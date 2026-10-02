import React, { Suspense, useEffect, useRef, useState } from 'react';
import { requestScrollRefresh } from '../lib/scrollRefresh';

/**
 * Mounts a below-the-fold section after the first screen is interactive.
 *
 * Rendering every homepage section at start-up produced a single ~750ms
 * main-thread task (React render + every section's GSAP setup), which is
 * what Lighthouse reports as Total Blocking Time. Sections wrapped in this
 * component mount one at a time in idle periods — or immediately if the
 * visitor scrolls near one first — so that work is split into small slices.
 *
 * A placeholder of roughly the section's height keeps the page length (and
 * the scrollbar) stable until the real content arrives.
 */

// One shared queue so sections mount sequentially, one per idle slot.
const queue: Array<() => void> = [];
let pumping = false;
let pageReady = false;

const idle = (fn: () => void) => {
  const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
  if (w.requestIdleCallback) w.requestIdleCallback(fn, { timeout: 600 });
  else window.setTimeout(fn, 60);
};

function pump() {
  if (pumping || !pageReady) return;
  const next = queue.shift();
  if (!next) return;
  pumping = true;
  idle(() => {
    next();
    pumping = false;
    pump();
  });
}

// Background mounting waits for three things: the window 'load' event, the
// app saying the intro is finished, and the visitor's first interaction
// (scroll, pointer, key). Real visitors interact within a second or two, so
// sections are built long before they're reached — but none of this work
// lands in the start-up window, where every long task counts as blocking.
// (Sections near the viewport still mount immediately via the observer.)
let loaded = false;
let released = false;
let interacted = false;
const maybeStart = () => {
  if (loaded && released && interacted && !pageReady) {
    window.setTimeout(() => { pageReady = true; pump(); }, 150);
  }
};

/**
 * Mount every still-pending section right now (e.g. before scrolling to a
 * section further down, so its position is real, not a placeholder's).
 */
export function mountAllDeferred() {
  while (queue.length) queue.shift()!();
}

/** Call once the intro/loader has finished (or immediately if there is none). */
export function releaseDeferredSections() {
  released = true;
  maybeStart();
}

if (typeof window !== 'undefined') {
  const onLoad = () => { loaded = true; maybeStart(); };
  if (document.readyState === 'complete') onLoad();
  else window.addEventListener('load', onLoad, { once: true });
  window.setTimeout(releaseDeferredSections, 8000);

  const onFirstInteraction = () => {
    if (interacted) return;
    interacted = true;
    ['scroll', 'wheel', 'touchstart', 'pointerdown', 'keydown'].forEach((t) =>
      window.removeEventListener(t, onFirstInteraction)
    );
    maybeStart();
  };
  ['scroll', 'wheel', 'touchstart', 'pointerdown', 'keydown'].forEach((t) =>
    window.addEventListener(t, onFirstInteraction, { passive: true })
  );
}

// Re-measure scroll animations once a burst of mounts has settled.
const scheduleRefresh = () => requestScrollRefresh(150);

export function DeferredSection({
  children,
  minHeight = 900,
}: {
  children: React.ReactNode;
  /** Placeholder height (px) until the section mounts. */
  minHeight?: number;
}) {
  const [mounted, setMounted] = useState(false);
  const holderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mounted) return;
    let done = false;
    const mount = () => {
      if (done) return;
      done = true;
      setMounted(true);
    };

    // idle queue
    queue.push(mount);
    pump();

    // or right away if the visitor gets close
    let io: IntersectionObserver | undefined;
    if (holderRef.current && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) mount(); },
        { rootMargin: '1500px 0px' }
      );
      io.observe(holderRef.current);
    }

    return () => {
      done = true;
      io?.disconnect();
      const i = queue.indexOf(mount);
      if (i >= 0) queue.splice(i, 1);
    };
  }, [mounted]);

  useEffect(() => {
    if (mounted) scheduleRefresh();
  }, [mounted]);

  const placeholder = <div ref={holderRef} aria-hidden="true" style={{ minHeight }} />;
  if (!mounted) return placeholder;
  // children are lazy chunks; keep the placeholder until the code arrives
  return <Suspense fallback={<div aria-hidden="true" style={{ minHeight }} />}>{children}</Suspense>;
}
