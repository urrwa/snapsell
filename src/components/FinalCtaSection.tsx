import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ShieldCheck, CheckCircle2, Zap } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export function FinalCtaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sectionEl = sectionRef.current;
    if (!sectionEl || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Reveal items in sequence
      gsap.fromTo(
        '.cta-anim-item',
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionEl,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionEl);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="final-cta-section"
      ref={sectionRef}
      className="final-cta-section relative w-full bg-[#020204] bg-grain text-white py-24 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-8 overflow-hidden border-t border-white/10"
    >
      {/* Background Soft Emerald Radial Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(32,183,119,0.12)_0%,rgba(17,138,89,0.04)_45%,transparent_70%)] pointer-events-none rounded-full" />

      {/* Decorative Emerald Ring Halo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[850px] h-[350px] sm:h-[480px] border border-[#20B777]/10 rounded-[100%] pointer-events-none blur-sm" />

      <div className="final-cta-container relative z-10 w-full max-w-[1080px] mx-auto text-center flex flex-col items-center">
        
        {/* Main Translucent Premium Panel */}
        <div className="w-full rounded-[28px] sm:rounded-[38px] lg:rounded-[46px] border border-white/10 bg-gradient-to-br from-white/[0.035] via-white/[0.02] to-white/[0.012] p-8 sm:p-14 lg:p-20 shadow-[0_40px_120px_rgba(0,0,0,0.5)] relative overflow-hidden">
          
          {/* Subtle Top Inner Highlight */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#20B777]/30 to-transparent" />

          {/* Eyebrow Label */}
          <div className="cta-anim-item inline-flex items-center gap-2 mb-6 sm:mb-8">
            <span className="section-eyebrow px-4 py-1.5 rounded-full border border-[#20B777]/35 bg-[#20B777]/10 text-[#7AE9B4] text-xs font-bold tracking-[0.06em] uppercase">
              {t.finalCtaSection.eyebrow.toUpperCase()}
            </span>
          </div>

          {/* Main Headline */}
          <h2 className="cta-anim-item font-display font-extrabold text-3xl sm:text-5xl lg:text-7xl xl:text-[84px] tracking-[-0.055em] leading-[0.94] text-white max-w-[950px] mx-auto mb-6 text-balance">
            <span className="silver-gradient-text">{t.finalCtaSection.headline1}</span>{' '}
            <span className="emerald-gradient-text block sm:inline">{t.finalCtaSection.headline2}</span>
          </h2>

          {/* Primary Paragraph */}
          <p className="cta-anim-item text-slate-200 text-base sm:text-xl lg:text-[22px] font-medium leading-snug sm:leading-relaxed max-w-[760px] mx-auto mb-4 text-balance">
            {t.finalCtaSection.description1}
          </p>

          {/* Secondary Paragraph */}
          <p className="cta-anim-item text-slate-400 text-sm sm:text-base lg:text-lg leading-relaxed max-w-[720px] mx-auto mb-8 sm:mb-10 text-balance">
            {t.finalCtaSection.description2}
          </p>

          {/* Action Buttons */}
          <div className="cta-anim-item final-cta-actions flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md sm:max-w-none mx-auto mb-10">
            <a
              href="#start-selling"
              className="emerald-pill-btn w-full sm:w-auto h-[58px] px-8 sm:px-10 rounded-full text-base font-bold flex items-center justify-center gap-2.5 cursor-pointer group transition-all duration-300 shadow-[0_4px_25px_rgba(32,183,119,0.35)]"
            >
              <span>{t.finalCtaSection.startSelling}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>

            <a
              href="#get-the-app"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-pill-btn w-full sm:w-auto h-[58px] px-8 sm:px-10 rounded-full text-base font-semibold flex items-center justify-center gap-3 cursor-pointer group transition-all duration-300"
            >
              <svg
                className="w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-105"
                viewBox="0 0 512 512"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M325.3 234.3L104.6 13l280.8 161.2-59.8 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l220.7-221.3 59.8 60.1L104.6 499z" />
              </svg>
              <span>{t.finalCtaSection.getApp}</span>
            </a>
          </div>

          {/* Optional Trust Line */}
          <div className="cta-anim-item final-cta-trust-line flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-400 border-t border-white/10 pt-6 max-w-xl mx-auto">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#4ED398] shrink-0" />
              <span>{t.finalCtaSection.trust.noSubscription}</span>
            </div>
            <span className="hidden sm:inline text-white/20">•</span>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t.finalCtaSection.trust.secureCheckout}</span>
            </div>
            <span className="hidden sm:inline text-white/20">•</span>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#4ED398] shrink-0" />
              <span>{t.finalCtaSection.trust.autoDelivery}</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
