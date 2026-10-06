import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play, Sparkles } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

interface OurTeamSectionProps {
  videoUrl?: string;
  posterUrl?: string;
}

export function OurTeamSection({
  videoUrl = 'https://res.cloudinary.com/dpwfzo2vk/video/upload/v1785242316/0728_t8jb3d.mp4',
  posterUrl = 'https://res.cloudinary.com/z8ule8ik/image/upload/v1786829395/254461_sdmcip.jpg',
}: OurTeamSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const playButtonRef = useRef<HTMLButtonElement>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const { t } = useLanguage();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Reveal animation timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
          toggleActions: 'play none none reverse',
        },
      });

      if (headerRef.current) {
        const elements = headerRef.current.children;
        tl.fromTo(
          elements,
          { opacity: 0, y: 35 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' }
        );
      }

      if (videoWrapperRef.current) {
        tl.fromTo(
          videoWrapperRef.current,
          { opacity: 0, y: 40, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out' },
          '-=0.4'
        );
      }

      if (playButtonRef.current) {
        tl.fromTo(
          playButtonRef.current,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' },
          '-=0.3'
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  return (
    <section
      id="our-team-section"
      ref={sectionRef}
      className="team-video-section relative w-full bg-[#020204] text-slate-100 overflow-hidden"
      style={{
        padding: 'clamp(110px, 12vw, 180px) clamp(20px, 5vw, 72px)',
      }}
    >
      {/* BACKGROUND CONTINUITY: Subtle radial glow & grain pattern */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Gold Radial Glow behind video area */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(100vw,1200px)] h-[600px] rounded-full opacity-60"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(235,206,100,0.08), rgba(193,156,50,0.025) 38%, transparent 68%)',
          }}
        />
        {/* Subtle dark gradient overlay */}
        <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-black/90" />
      </div>

      <div className="team-video-container relative z-10 w-[min(92vw,1380px)] mx-auto">
        {/* HEADER */}
        <header ref={headerRef} className="team-video-header text-center flex flex-col items-center">
          {/* EYEBROW */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#20B777]/10 border border-[#20B777]/30 text-[#7AE9B4] text-xs font-bold tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(32,183,119,0.1)]">
            <Sparkles className="w-3.5 h-3.5 text-[#4ED398]" />
            <span className="section-eyebrow">{t.ourTeam.eyebrow.toUpperCase()}</span>
          </div>

          {/* MAIN HEADING */}
          <h2 className="text-white font-display font-bold tracking-tight text-center leading-[0.98] mb-7 max-w-[960px]"
            style={{
              fontSize: 'clamp(46px, 6vw, 92px)',
              letterSpacing: '-0.04em',
            }}
          >
            {t.ourTeam.headline}
          </h2>

          {/* SUPPORTING TEXT */}
          <p
            className="text-slate-300 font-normal text-center leading-relaxed max-w-[760px] mx-auto"
            style={{
              fontSize: 'clamp(17px, 1.4vw, 21px)',
              lineHeight: '1.55',
              marginBottom: 'clamp(50px, 6vw, 82px)',
            }}
          >
            {t.ourTeam.description}
          </p>
        </header>

        {/* VIDEO WRAPPER */}
        <div className="team-video-wrapper w-[min(100%,1280px)] mx-auto">
          <div
            ref={videoWrapperRef}
            className="team-video-placeholder relative w-full aspect-video overflow-hidden rounded-[clamp(24px,3vw,38px)] border border-white/10 bg-zinc-950 shadow-[0_35px_110px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all duration-500"
            style={{
              background: isPlaying
                ? '#000000'
                : 'radial-gradient(circle at 50% 45%, rgba(32,183,119,0.08), transparent 42%), linear-gradient(145deg, #111114, #070708)',
            }}
          >
            {!isPlaying ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 group">
                {/* Video Thumbnail Background Image */}
                <img
                  src={posterUrl}
                  alt="SnapSell Team Story Preview Thumbnail"
                  className="absolute inset-0 w-full h-full object-cover object-center opacity-80 pointer-events-none transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  referrerPolicy="no-referrer"
                />

                {/* Subtle dark gradient overlay for contrast and seamless blend */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/55 pointer-events-none" />
                <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#20B777]/30 via-transparent to-transparent" />
                
                {/* PLAY BUTTON */}
                <button
                  ref={playButtonRef}
                  onClick={handlePlayClick}
                  aria-label="Play the SnapSell team video"
                  className="team-video-play-button relative z-10 group/btn cursor-pointer outline-none transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 active:scale-95 mb-4"
                  style={{
                    width: 'clamp(72px, 7vw, 94px)',
                    height: 'clamp(72px, 7vw, 94px)',
                  }}
                >
                  <div
                    className="w-full h-full rounded-full flex items-center justify-center border border-[#7AE9B4]/30 shadow-[0_18px_55px_rgba(32,183,119,0.28)] group-hover/btn:shadow-[0_22px_65px_rgba(32,183,119,0.4)] transition-all duration-300"
                    style={{
                      background: 'linear-gradient(135deg, #7AE9B4 0%, #20B777 50%, #075E3B 100%)',
                    }}
                  >
                    <Play className="w-8 h-8 sm:w-10 sm:h-10 text-zinc-950 fill-zinc-950 translate-x-0.5 group-hover/btn:scale-110 transition-transform duration-300" />
                  </div>
                </button>

                {/* VIDEO LABEL */}
                <span className="team-video-label relative z-10 text-slate-100 font-semibold text-sm sm:text-base tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] group-hover:text-white transition-colors duration-200">
                  {t.ourTeam.watchLabel}
                </span>
              </div>
            ) : (
              <video
                className="w-full h-full object-cover rounded-[clamp(24px,3vw,38px)]"
                src={videoUrl}
                poster={posterUrl}
                controls
                autoPlay
                playsInline
                preload="metadata"
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
