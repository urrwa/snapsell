import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LazyVideo } from './LazyVideo';
import {
  UploadCloud,
  Share2,
  CreditCard,
  Sparkles,
  Lock,
  Check,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { ProductCover } from './ProductCover';
import { useLanguage } from '../i18n/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

/**
 * Media clips for the card panels. Served from /public/videos, so they work
 * in dev and in a normal build. `build_artifact.py` inlines them as base64
 * when producing the single-file version.
 */
const CLIP_UPLOAD = 'videos/card-upload.mp4';
const CLIP_SHARE = 'videos/card-share.mp4';
const CLIP_CHECKOUT = 'videos/card-checkout.mp4';

interface FloatingChip {
  label: string;
  value: string;
  icon: React.ElementType;
  /** Tailwind positioning for the chip over the media panel */
  position: string;
}

interface ValueCard {
  id: string;
  index: string;
  badge: string;
  title: string;
  description: string;
  bullets: string[];
  icon: React.ElementType;
  video?: string;
  cover?: 'commerce';
  /** Visual theme for the copy panel */
  theme: 'emerald' | 'graphite' | 'forest';
  chips: FloatingChip[];
}

// Static (non-translated) card data merged with translated content inside the component
const VALUE_CARDS_STATIC = [
  {
    id: 'upload' as const,
    index: '01',
    icon: UploadCloud,
    video: CLIP_UPLOAD,
    theme: 'emerald' as const,
    chips: [
      { label: 'Noir Photography Vault.zip', value: 'Uploaded', icon: Check, position: 'top-5 right-5 sm:top-7 sm:right-7' },
      { label: 'Price', value: '$29.00 USD', icon: Sparkles, position: 'bottom-5 left-5 sm:bottom-7 sm:left-7' },
    ],
  },
  {
    id: 'link' as const,
    index: '02',
    icon: Share2,
    video: CLIP_SHARE,
    theme: 'graphite' as const,
    chips: [
      { label: 'Secure product link', value: 'snapsell.co/p/7f9a2', icon: Lock, position: 'top-5 left-5 sm:top-7 sm:left-7' },
      { label: 'Reach', value: 'Works on any channel', icon: Zap, position: 'bottom-5 right-5 sm:bottom-7 sm:right-7' },
    ],
  },
  {
    id: 'checkout' as const,
    index: '03',
    icon: CreditCard,
    video: CLIP_CHECKOUT,
    cover: 'commerce' as const,
    theme: 'forest' as const,
    chips: [
      { label: 'Checkout', value: '256-bit secured', icon: ShieldCheck, position: 'top-5 right-5 sm:top-7 sm:right-7' },
      { label: 'New sale', value: '+$29.00', icon: Sparkles, position: 'bottom-5 left-5 sm:bottom-7 sm:left-7' },
    ],
  },
];

export function ValuePropositionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { t } = useLanguage();

  const VALUE_CARDS: ValueCard[] = VALUE_CARDS_STATIC.map((s) => ({
    ...s,
    ...t.valuePropositionSection.cards[s.id],
    bullets: [...(t.valuePropositionSection.cards[s.id].bullets as readonly string[])],
  }));

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];

      cards.forEach((card, i) => {
        const inner = card.querySelector('.vp-card');
        if (!inner) return;

        // Entrance: each card rises into place
        gsap.fromTo(
          inner,
          { y: 60, opacity: 0.4 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            force3D: true,
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              end: 'top 55%',
              scrub: 0.6,
            },
          }
        );

        // Recede: as the NEXT card slides over this one, push it back.
        //
        // The start value must be written out. Tweening `filter` from the
        // computed `none` makes GSAP read the start as brightness(0), so the
        // card began fully black and *brightened* to 0.74 — the reverse of the
        // intent. `fromTo` with an explicit brightness(1) interpolates 1 -> 0.74.
        const next = cards[i + 1];
        if (next) {
          gsap.fromTo(
            inner,
            { scale: 1, filter: 'brightness(1)' },
            {
              scale: 0.955,
              filter: 'brightness(0.74)',
              ease: 'none',
              force3D: true,
              immediateRender: false,
              scrollTrigger: {
                trigger: next,
                // Begin only once the next card is genuinely arriving, so a
                // card is never dimmed while it is still the one being read.
                start: 'top 85%',
                end: 'top top',
                scrub: 0.6,
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="value-proposition-section"
      className="vp-section relative w-full py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#020204] text-slate-100 border-t border-white/10"
    >
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-[160px] w-[1120px] h-[820px]" style={{ background: 'radial-gradient(closest-side, rgba(32,183,119,0.08), rgba(32,183,119,0.035) 55%, transparent)' }} />
        <div className="absolute bottom-[-140px] left-1/3 -translate-x-[180px] w-[960px] h-[760px]" style={{ background: 'radial-gradient(closest-side, rgba(17,138,89,0.05), rgba(17,138,89,0.022) 55%, transparent)' }} />
      </div>

      <div className="relative z-10 max-w-[1320px] mx-auto">
        {/* SECTION HEADER */}
        <div className="flex flex-col items-center text-center mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#20B777]/10 border border-[#20B777]/30 text-[#7AE9B4] text-xs font-semibold tracking-wider uppercase mb-5">
            <Sparkles className="w-3.5 h-3.5 text-[#4ED398]" />
            <span>{t.valuePropositionSection.eyebrow}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white tracking-tight leading-[1.1] mb-5 max-w-3xl">
            {t.valuePropositionSection.headline1} <br className="hidden sm:inline" />
            <span className="emerald-gradient-text">{t.valuePropositionSection.headline2}</span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed font-normal">
            {t.valuePropositionSection.description}
          </p>
        </div>

        {/* STACKING HORIZONTAL CARDS */}
        <div className="vp-stack">
          {VALUE_CARDS.map((card, i) => {
            const Icon = card.icon;

            return (
              <div
                key={card.id}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className="vp-stack-item"
                style={{ '--i': i } as React.CSSProperties}
              >
                <article className={`vp-card vp-card--${card.theme}`}>
                  {/* ---------- COPY PANEL ---------- */}
                  <div className="vp-copy">
                    <div className="vp-copy-inner">
                      <span className="vp-badge">{card.badge}</span>

                      <h3 className="vp-title">{card.title}</h3>

                      <p className="vp-description">{card.description}</p>

                      <ul className="vp-bullets">
                        {card.bullets.map((b, bi) => (
                          <li key={bi}>
                            <span className="vp-bullet-dot" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="vp-copy-footer">
                        <span className="vp-icon-chip">
                          <Icon className="w-4 h-4" />
                        </span>
                        <span className="vp-step-index">
                          Step {card.index} <span className="opacity-40">/ 03</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ---------- MEDIA PANEL ---------- */}
                  <div className="vp-media">
                    <div className="vp-media-frame">
                      {/* Artwork layer — sits under the clip and shows
                          through if the clip ever fails to load. */}
                      {card.cover && (
                        <ProductCover
                          variant={card.cover}
                          uid={`vp-${card.id}`}
                          className="vp-cover"
                        />
                      )}

                      {card.video && (
                        <LazyVideo
                          className="vp-video"
                          src={card.video}
                          aria-hidden="true"
                          disablePictureInPicture
                          onError={(e) => {
                            (e.currentTarget as HTMLVideoElement).style.display = 'none';
                          }}
                        />
                      )}

                      {/* Readability scrim */}
                      <div className="vp-media-scrim" />

                      {/* Floating glass chips over the video */}
                      {card.chips.map((chip, ci) => {
                        const ChipIcon = chip.icon;
                        return (
                          <div key={ci} className={`vp-chip absolute ${chip.position}`}>
                            <span className="vp-chip-icon">
                              <ChipIcon className="w-3 h-3" />
                            </span>
                            <span className="min-w-0">
                              <span className="vp-chip-label">{chip.label}</span>
                              <span className="vp-chip-value">{chip.value}</span>
                            </span>
                          </div>
                        );
                      })}

                      {/* Ghost step number */}
                      <span className="vp-ghost-number">{card.index}</span>
                    </div>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
