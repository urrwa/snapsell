import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface WordData {
  text: string;
  type: 'silver' | 'emerald';
}

const WORDS: WordData[] = [
  { text: 'Fast', type: 'silver' },
  { text: 'Smart', type: 'emerald' },
  { text: 'Secure', type: 'emerald' },
];

export function ScrollWordsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const ctx = gsap.context(() => {
      const wordEls = WORDS.map((_, i) => document.getElementById(`scroll-word-item-${i}`));
      const glowEl = document.getElementById('scroll-word-bg-glow');

      // Set initial positions
      // FAST starts visible
      if (wordEls[0]) {
        gsap.set(wordEls[0], {
          autoAlpha: 1,
          yPercent: 0,
          scale: 1,
          filter: 'blur(0px)',
        });
      }

      // Smart and Secure start hidden below
      wordEls.slice(1).forEach((el) => {
        if (el) {
          gsap.set(el, {
            autoAlpha: 0,
            yPercent: 90,
            scale: 0.94,
            filter: 'blur(7px)',
          });
        }
      });

      // Master Timeline linked to ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.addLabel('fastIn', 0)
        .addLabel('fastToSmart', 0.28)
        .addLabel('smartToSecure', 0.58)
        .addLabel('secureHold', 0.70);

      // 1. Fast (0 to 0.28) -> Transitions out while Smart enters (0.28 to 0.40)
      tl.to(
        wordEls[0],
        {
          autoAlpha: 0,
          yPercent: -90,
          scale: 1.04,
          filter: 'blur(6px)',
          duration: 0.12,
          ease: 'power2.inOut',
        },
        0.28
      );

      tl.to(
        wordEls[1],
        {
          autoAlpha: 1,
          yPercent: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 0.12,
          ease: 'power2.inOut',
        },
        0.28
      );

      if (glowEl) {
        tl.to(
          glowEl,
          {
            '--glow': 'rgba(32, 183, 119, 0.14)', // emerald glow for Smart
            duration: 0.12,
          },
          0.28
        );
      }

      // 2. Smart (0.40 to 0.58) -> Transitions out while Secure enters (0.58 to 0.70)
      tl.to(
        wordEls[1],
        {
          autoAlpha: 0,
          yPercent: -90,
          scale: 1.04,
          filter: 'blur(6px)',
          duration: 0.12,
          ease: 'power2.inOut',
        },
        0.58
      );

      tl.to(
        wordEls[2],
        {
          autoAlpha: 1,
          yPercent: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 0.12,
          ease: 'power2.inOut',
        },
        0.58
      );

      if (glowEl) {
        tl.to(
          glowEl,
          {
            '--glow': 'rgba(32, 183, 119, 0.14)', // emerald glow for Secure
            duration: 0.12,
          },
          0.58
        );
      }

      // 3. Secure holds (0.70 to 0.94) before sticky release
      tl.to(
        wordEls[2],
        {
          autoAlpha: 1,
          duration: 0.24,
        },
        0.70
      );
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="scroll-words-section"
      className="scroll-words-section relative w-full bg-black min-h-[300vh] sm:min-h-[330vh] border-t border-white/10"
    >
      {/* Reduced Motion Fallback */}
      <div className="hidden prefers-reduced-motion:block max-w-5xl mx-auto py-24 px-4 text-center space-y-12">
        {WORDS.map((w, idx) => (
          <div
            key={idx}
            className={`text-5xl sm:text-7xl font-bold tracking-tight ${
              w.type === 'emerald'
                ? 'text-transparent bg-clip-text bg-gradient-to-b from-[#7AE9B4] via-[#20B777] to-[#075E3B]'
                : 'text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-500'
            }`}
          >
            {w.text}
          </div>
        ))}
      </div>

      {/* STICKY STAGE FOR SCROLL SCRUBBING */}
      <div
        ref={stickyRef}
        className="scroll-words-sticky sticky top-0 h-[100svh] w-full flex items-center justify-center overflow-hidden bg-black pointer-events-none prefers-reduced-motion:hidden"
      >
        {/* Dynamic Background Glow */}
        <div
          id="scroll-word-bg-glow"
          className="absolute w-[740px] sm:w-[940px] h-[740px] sm:h-[940px] pointer-events-none"
          // A gradient driven by --glow instead of a 120px blur filter: the
          // colour is animated on scroll, and re-blurring a 700px layer every
          // frame was one of the most expensive things on the page.
          style={{
            ['--glow' as string]: 'rgba(255,255,255,0.08)',
            background: 'radial-gradient(closest-side, var(--glow), transparent)',
          } as React.CSSProperties}
        />

        {/* LAYERED WORDS AT EXACT CENTER */}
        <div className="relative w-full h-full flex items-center justify-center px-4">
          {WORDS.map((word, index) => (
            <div
              key={word.text}
              id={`scroll-word-item-${index}`}
              className={`scroll-word word-${word.text.toLowerCase()} absolute inset-0 flex items-center justify-center px-6 sm:px-12 lg:px-20 select-none text-center`}
            >
              <span
                className={`text-[clamp(52px,16vw,94px)] sm:text-[clamp(72px,15vw,165px)] lg:text-[clamp(92px,14vw,245px)] font-bold tracking-[-0.055em] leading-[0.86] text-center whitespace-nowrap max-w-[calc(100vw-48px)] transition-all ${
                  word.type === 'emerald'
                    ? 'text-transparent bg-clip-text bg-gradient-to-b from-[#7AE9B4] via-[#20B777] to-[#075E3B] drop-shadow-[0_0_35px_rgba(32,183,119,0.20)]'
                    : 'text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-500 drop-shadow-[0_0_35px_rgba(255,255,255,0.12)]'
                }`}
              >
                {word.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
