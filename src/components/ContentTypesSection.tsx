import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Camera,
  Video,
  Eye,
  Images,
  BookOpen,
  FileText,
  Sliders,
  Layers,
  FolderArchive,
  Headphones,
  Link2,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

interface ContentTypeRow {
  id: string;
  title: string;
  description: string;
  /** File-format tag shown on the right of the row */
  tag: string;
  icon: React.ElementType;
}

type ContentTypeKey = 'photos' | 'videos' | 'bts' | 'collections' | 'ebooks' | 'pdfs' | 'presets' | 'psd' | 'zip' | 'audio';

const CONTENT_TYPES_STATIC: { id: string; tag: string; icon: React.ElementType; tKey: ContentTypeKey }[] = [
  { id: '01', tag: 'JPG',  icon: Camera,      tKey: 'photos' },
  { id: '02', tag: 'MP4',  icon: Video,       tKey: 'videos' },
  { id: '03', tag: 'MOV',  icon: Eye,         tKey: 'bts' },
  { id: '04', tag: 'ZIP',  icon: Images,      tKey: 'collections' },
  { id: '05', tag: 'EPUB', icon: BookOpen,    tKey: 'ebooks' },
  { id: '06', tag: 'PDF',  icon: FileText,    tKey: 'pdfs' },
  { id: '07', tag: 'XMP',  icon: Sliders,     tKey: 'presets' },
  { id: '08', tag: 'PSD',  icon: Layers,      tKey: 'psd' },
  { id: '09', tag: 'ZIP',  icon: FolderArchive, tKey: 'zip' },
  { id: '10', tag: 'MP3',  icon: Headphones,  tKey: 'audio' },
];

export function ContentTypesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const CONTENT_TYPES: ContentTypeRow[] = CONTENT_TYPES_STATIC.map((s) => {
    const item = (t.contentTypesSection.items as Record<ContentTypeKey, { title: string; description: string }>)[s.tKey];
    return { id: s.id, tag: s.tag, icon: s.icon, title: item.title, description: item.description };
  });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !panelRef.current) return;

    const ctx = gsap.context(() => {
      // Panel lifts into place
      gsap.fromTo(
        panelRef.current,
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          force3D: true,
          scrollTrigger: { trigger: panelRef.current, start: 'top 85%' },
        }
      );

      // Rows cascade in
      gsap.fromTo(
        '.ct-row',
        { opacity: 0, x: -14 },
        {
          opacity: 1,
          x: 0,
          duration: 0.45,
          stagger: 0.05,
          ease: 'power2.out',
          scrollTrigger: { trigger: panelRef.current, start: 'top 72%' },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="content-types-section"
      className="content-types-section relative w-full bg-black text-white py-24 sm:py-32 overflow-hidden border-t border-white/10"
    >
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-radial from-[#20B777]/10 via-[#20B777]/5 to-transparent rounded-full pointer-events-none" />

      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* SECTION HEADER */}
        <header className="max-w-3xl mx-auto text-center mb-14 sm:mb-20 space-y-4">
          <span className="section-eyebrow inline-block px-3.5 py-1 rounded-full bg-[#20B777]/10 border border-[#20B777]/20 text-[#7AE9B4] text-[11px] font-bold tracking-[0.25em] uppercase">
            {t.contentTypesSection.eyebrow.toUpperCase()}
          </span>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.04]">
            {t.contentTypesSection.headline}
          </h2>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed pt-1">
            {t.contentTypesSection.description}
          </p>
        </header>

        {/* ---------- SINGLE CONSOLIDATED PANEL ---------- */}
        <div ref={panelRef} className="ct-panel">

          {/* Window chrome */}
          <div className="ct-panel-bar">
            <span className="ct-dots" aria-hidden="true">
              <i className="ct-dot ct-dot--on" />
              <i className="ct-dot ct-dot--on" />
              <i className="ct-dot" />
            </span>
            <span className="ct-bar-label">CONTENT LIBRARY · SNAPSELL</span>
          </div>

          <div className="ct-panel-body">

            {/* Inbox-style highlight strip */}
            <div className="ct-strip">
              <div className="ct-strip-head">
                <span className="ct-mono">snapsell.library</span>
                <span className="ct-mono ct-muted">Formats 10</span>
              </div>
              <div className="ct-strip-hero">
                <span className="ct-strip-icon">
                  <Link2 className="w-4 h-4" />
                </span>
                <span>Any file type, one secure Paid Link</span>
              </div>
            </div>

            {/* Stat tiles */}
            <div className="ct-stats">
              <div className="ct-stat">
                <span className="ct-mono ct-stat-label">FORMATS</span>
                <span className="ct-stat-value">10</span>
                <span className="ct-stat-note">photo · video · doc · audio</span>
              </div>
              <div className="ct-stat">
                <span className="ct-mono ct-stat-label">DELIVERY</span>
                <span className="ct-stat-value">1-Click</span>
                <span className="ct-stat-note">instant secure access</span>
              </div>
            </div>

            {/* All ten content types as rows */}
            <div className="ct-rows">
              {CONTENT_TYPES.map((row) => {
                const Icon = row.icon;
                return (
                  <div key={row.id} className="ct-row">
                    <span className="ct-row-icon">
                      <Icon className="w-[18px] h-[18px]" />
                    </span>

                    <span className="ct-row-copy">
                      <span className="ct-row-title">{row.title}</span>
                      <span className="ct-row-desc">{row.description}</span>
                    </span>

                    <span className="ct-row-tag">{row.tag}</span>
                  </div>
                );
              })}
            </div>

            {/* Footer caption */}
            <p className="ct-footnote">From any file type to your first Paid Link</p>

          </div>
        </div>

        {/* CLOSING STATEMENT */}
        <p className="text-center text-slate-300 text-lg sm:text-xl font-medium max-w-3xl mx-auto mt-14 sm:mt-20 leading-relaxed">
          Whether you sell creative work, premium media or informational products, SnapSell gives you a{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7AE9B4] via-[#4ED398] to-[#20B777] font-bold border-b border-[#20B777]/30 pb-0.5">
            direct route from content to customer
          </span>
          .
        </p>

      </div>
    </section>
  );
}
