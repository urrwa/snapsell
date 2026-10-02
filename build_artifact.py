#!/usr/bin/env python3
"""
Turn the Vite build into a publishable artifact page.

Two modes:

  npm run build && python3 build_artifact.py
      Split build (default). The page is small: CSS is embedded so the first
      paint never waits on a stylesheet request, the JavaScript stays as ES
      module files (the first screen's code, plus one chunk per section that
      downloads only when that section is about to mount), and videos and
      images are separate files. Everything to publish alongside the page is
      listed in artifact_files.json.

  SINGLEFILE=1 npm run build && python3 build_artifact.py --inline
      One self-contained HTML file with every script, video and image
      embedded as base64 (~10 MB). Slower to load, but needs nothing else.

Either way the doctype/html/head/body wrappers are stripped, since the
artifact runtime supplies them.
"""
import base64
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).parent
DIST = ROOT / 'dist'
PUBLIC = ROOT / 'public'
INLINE_ALL = '--inline' in sys.argv

# media referenced by the app (relative paths, as written in the source)
MEDIA = {
    'videos/hero-background.mp4': 'video/mp4',
    'videos/card-upload.mp4': 'video/mp4',
    'videos/card-share.mp4': 'video/mp4',
    'videos/card-checkout.mp4': 'video/mp4',
    'images/snapsell-logo.webp': 'image/webp',
    'images/snapsell-mark.webp': 'image/webp',
    'images/product-fashion.webp': 'image/webp',
    'images/product-cinematic.webp': 'image/webp',
    'images/product-brand.webp': 'image/webp',
    'images/step-upload-slides.webp': 'image/webp',
}

html = (DIST / 'index.html').read_text(encoding='utf-8')
head = re.search(r'<head>(.*)</head>', html, re.DOTALL).group(1)
body = re.search(r'<body[^>]*>(.*?)</body>', html, re.DOTALL).group(1)
title = re.search(r'<title>(.*?)</title>', head, re.DOTALL)
metas = [m for m in re.findall(r'<meta[^>]*>', head) if 'charset' not in m and 'viewport' not in m]

files = {}  # published path -> source path (relative to ROOT)
total_media = 0

if INLINE_ALL:
    scripts = re.findall(r'<script(?![^>]*src=)[^>]*>.*?</script>', head, re.DOTALL)
    styles = re.findall(r'<style[^>]*>.*?</style>', head, re.DOTALL)
    if not scripts:
        sys.exit("ERROR: no inline script — build with SINGLEFILE=1 for --inline")
    doc = '\n'.join(styles + ['@@BODY@@'] + scripts)
    for path, mime in MEDIA.items():
        src = PUBLIC / path
        raw = src.read_bytes()
        total_media += len(raw)
        hits = doc.count(path)
        if hits < 1:
            sys.exit(f"ERROR: {path!r} not referenced in the bundle")
        doc = doc.replace(path, f'data:{mime};base64,' + base64.b64encode(raw).decode())
        print(f"  embedded {path:<34} {len(raw):>9,} bytes")
    head_parts = [doc.split('@@BODY@@')[0]]
    tail_parts = [doc.split('@@BODY@@')[1]]
else:
    # embed the stylesheet
    css_links = re.findall(r'<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>', head)
    styles = []
    for href in css_links:
        css = (DIST / href.lstrip('./')).read_text(encoding='utf-8')
        styles.append(f'<style>{css}</style>')
        print(f"  embedded css {href:<30} {len(css):>9,} bytes")
    # keep module scripts + modulepreload hints as files
    scripts = re.findall(r'<script[^>]*src="[^"]+"[^>]*></script>', head)
    preloads = re.findall(r'<link[^>]*rel="modulepreload"[^>]*>', head)
    if not scripts:
        sys.exit("ERROR: no module script found — was this a split build?")
    head_parts = ['\n'.join(styles)]
    tail_parts = ['\n'.join(preloads + scripts)]
    for js in sorted((DIST / 'assets').glob('*.js')):
        files[f'assets/{js.name}'] = str(js.relative_to(ROOT))
    for path in MEDIA:
        src = PUBLIC / path
        total_media += src.stat().st_size
        files[path] = str(src.relative_to(ROOT))

parts = ([f'<title>{title.group(1)}</title>'] if title else []) + metas + head_parts + [body.strip()] + tail_parts
out = '\n'.join(p for p in parts if p)
(ROOT / 'artifact_page.html').write_text(out, encoding='utf-8')
(ROOT / 'artifact_files.json').write_text(json.dumps(files, indent=2))

js_bytes = sum((ROOT / v).stat().st_size for k, v in files.items() if k.endswith('.js'))
mb = len(out) / 1024 / 1024
print(f"\n  page          : {len(out):,} chars ({mb:.2f} MB)")
if not INLINE_ALL:
    print(f"  js modules    : {sum(1 for k in files if k.endswith('.js'))} files, {js_bytes:,} bytes")
    print(f"  media files   : {sum(1 for k in files if not k.endswith('.js'))}, {total_media:,} bytes")
if mb > 15:
    sys.exit(f"ERROR: page is {mb:.1f} MB, over the 16 MB artifact limit")
print("  OK")
