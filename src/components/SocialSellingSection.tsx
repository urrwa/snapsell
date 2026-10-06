import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Image as ImageIcon,
  Video as VideoIcon,
  FileText,
  BookOpen,
  FileArchive,
  Music,
  Layers,
  Sliders,
  Download,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

interface PlatformItem {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface FileFormat {
  id: string;
  ext: string;
  label: string;
  icon: React.ElementType;
  tone: string;
}

/** Downloadable formats shown alongside the share channels. */
const FORMATS: FileFormat[] = [
  { id: 'jpg',  ext: 'JPG',  label: 'Photos',    icon: ImageIcon,   tone: 'ss-tone-mint' },
  { id: 'mp4',  ext: 'MP4',  label: 'Video',     icon: VideoIcon,   tone: 'ss-tone-sky' },
  { id: 'pdf',  ext: 'PDF',  label: 'Documents', icon: FileText,    tone: 'ss-tone-emerald' },
  { id: 'epub', ext: 'EPUB', label: 'E-books',   icon: BookOpen,    tone: 'ss-tone-violet' },
  { id: 'zip',  ext: 'ZIP',  label: 'Bundles',   icon: FileArchive, tone: 'ss-tone-amber' },
  { id: 'mp3',  ext: 'MP3',  label: 'Audio',     icon: Music,       tone: 'ss-tone-rose' },
  { id: 'psd',  ext: 'PSD',  label: 'Templates', icon: Layers,      tone: 'ss-tone-sky' },
  { id: 'xmp',  ext: 'XMP',  label: 'Presets',   icon: Sliders,     tone: 'ss-tone-mint' },
];

const PLATFORMS: PlatformItem[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    icon: (
      <svg className="w-6 h-6 sm:w-8 sm:h-8 text-pink-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
      </svg>
    ),
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: (
      <svg className="w-6 h-6 sm:w-8 sm:h-8 fill-current text-white" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V5.8a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 1 0 15.68 12V8.45a8.28 8.28 0 0 0 4.77 1.52V6.52a4.85 4.85 0 0 1-.86.17z"/>
      </svg>
    ),
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: (
      <svg className="w-6 h-6 sm:w-8 sm:h-8 fill-current text-emerald-400" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.99c-.002 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413"/>
      </svg>
    ),
  },
  {
    id: 'telegram',
    name: 'Telegram',
    icon: (
      <svg className="w-6 h-6 sm:w-8 sm:h-8 fill-current text-sky-400" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
      </svg>
    ),
  },
  {
    id: 'x',
    name: 'X',
    icon: (
      <svg className="w-5 h-5 sm:w-7 sm:h-7 fill-current text-white" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    id: 'email',
    name: 'Email',
    icon: (
      <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#4ED398]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2"/>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
      </svg>
    ),
  },
  {
    id: 'reddit',
    name: 'Reddit',
    icon: (
      <svg className="w-6 h-6 sm:w-8 sm:h-8 fill-current text-orange-500" viewBox="0 0 24 24">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.562-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.688-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.32.32 0 0 0 0 .45c.835.836 2.376.889 2.947.889.57 0 2.112-.053 2.947-.889a.32.32 0 0 0 0-.45.328.328 0 0 0-.462 0c-.637.637-1.841.71-2.485.71-.645 0-1.848-.073-2.485-.71a.322.322 0 0 0-.231-.094z"/>
      </svg>
    ),
  },
];

export function SocialSellingSection() {
  const panelRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const panelEl = panelRef.current;
    if (!panelEl || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        panelEl,
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: panelEl,
            start: 'top 80%',
            once: true,
          },
        }
      );
    }, panelRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="social-selling-section"
      className="social-selling-section relative w-full bg-black text-white py-20 sm:py-32 overflow-hidden border-t border-white/10"
    >
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-[radial-gradient(circle,rgba(32,183,119,0.10)_0%,rgba(7,94,59,0.045)_34%,transparent_68%)] rounded-full pointer-events-none" />

      <div className="max-w-[1540px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        {/* OUTER BORDERED PANEL CONTAINER */}
        <div
          ref={panelRef}
          className="social-selling-panel relative w-full max-w-[1420px] mx-auto rounded-[30px] border border-white/10 bg-gradient-to-br from-zinc-900/60 via-zinc-950/80 to-black p-8 sm:p-14 lg:p-20 shadow-[0_30px_90px_rgba(0,0,0,0.4)] overflow-hidden"
        >
          {/* Top Panel Subtle Accent Line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-[#20B777]/50 to-transparent" />

          {/* HEADER */}
          <header className="social-selling-header max-w-4xl mx-auto text-center space-y-4 mb-10 sm:mb-14">
            <span className="section-eyebrow inline-block px-3.5 py-1 rounded-full bg-[#20B777]/10 border border-[#20B777]/22 text-[#7AE9B4] text-[11px] font-bold tracking-[0.25em] uppercase">
              {t.socialSellingSection.eyebrow.toUpperCase()}
            </span>

            <h2 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.02]">
              {t.socialSellingSection.headline}
            </h2>

            <p className="text-slate-300 text-base sm:text-xl max-w-2xl mx-auto font-normal leading-relaxed pt-1">
              {t.socialSellingSection.description}
            </p>
          </header>

          {/* ---------- ROW 1: SHARE CHANNELS (scrolls left) ---------- */}
          <div className="ss-row-label">Share your SnapSell link through:</div>

          <div className="ss-marquee ss-marquee--left">
            <div className="ss-marquee-track">
              {/* Two identical groups; the track shifts by exactly one group
                  width, so the seam is invisible and the loop never resets. */}
              {[0, 1].map((copy) => (
                <div className="ss-marquee-group" key={`ch-${copy}`} aria-hidden={copy === 1}>
                  {PLATFORMS.map((platform) => (
                    <div
                      key={`ch-${copy}-${platform.id}`}
                      className="ss-channel"
                      title={platform.name}
                      aria-label={copy === 0 ? platform.name : undefined}
                    >
                      {platform.icon}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* ---------- ROW 2: DOWNLOAD FORMATS (scrolls right) ---------- */}
          <div className="ss-row-label ss-row-label--second">
            <Download className="w-4 h-4 text-[#4ED398]" />
            <span>Buyers download instantly:</span>
          </div>

          <div className="ss-marquee ss-marquee--right">
            <div className="ss-marquee-track">
              {[0, 1].map((copy) => (
                <div className="ss-marquee-group" key={`fmt-${copy}`} aria-hidden={copy === 1}>
                  {FORMATS.map((f) => {
                    const Icon = f.icon;
                    return (
                      <div key={`fmt-${copy}-${f.id}`} className={`ss-format ${f.tone}`}>
                        <span className="ss-format-icon">
                          <Icon className="w-[18px] h-[18px]" />
                        </span>
                        <span className="ss-format-copy">
                          <span className="ss-format-ext">{f.ext}</span>
                          <span className="ss-format-label">{f.label}</span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* CLOSING STATEMENT */}
          <p className="social-selling-closing text-center text-slate-300 text-base sm:text-lg lg:text-xl font-normal max-w-3xl mx-auto mt-10 sm:mt-14 leading-relaxed">
            Your customers open the link, complete checkout and access their purchase through a{' '}
            <span className="text-[#7AE9B4] font-semibold border-b border-[#20B777]/30 pb-0.5">
              secure digital-delivery process
            </span>
            .
          </p>
        </div>
      </div>

    </section>
  );
}
