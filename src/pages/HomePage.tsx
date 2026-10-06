import React, { lazy, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HeroHeading } from '../components/HeroHeading';
import { ProductCard } from '../components/ProductCard';
import { PhoneMockup } from '../components/PhoneMockup';
import { FinalMessage } from '../components/FinalMessage';
import { requestScrollRefresh } from '../lib/scrollRefresh';
import { DeferredSection } from '../components/DeferredSection';
import { PRODUCTS } from '../data/productData';

// Below-the-fold sections: separate chunks, fetched when they're about to mount.
const ValuePropositionSection = lazy(() => import('../components/ValuePropositionSection').then((m) => ({ default: m.ValuePropositionSection })));
const CreatorBenefitsSection = lazy(() => import('../components/CreatorBenefitsSection').then((m) => ({ default: m.CreatorBenefitsSection })));
const ScrollWordsSection = lazy(() => import('../components/ScrollWordsSection').then((m) => ({ default: m.ScrollWordsSection })));
const HowItWorksSection = lazy(() => import('../components/HowItWorksSection').then((m) => ({ default: m.HowItWorksSection })));
const OurTeamSection = lazy(() => import('../components/OurTeamSection').then((m) => ({ default: m.OurTeamSection })));
const ContentTypesSection = lazy(() => import('../components/ContentTypesSection').then((m) => ({ default: m.ContentTypesSection })));
const SocialSellingSection = lazy(() => import('../components/SocialSellingSection').then((m) => ({ default: m.SocialSellingSection })));
const PaymentsSection = lazy(() => import('./PaymentsPage').then((m) => ({ default: m.PaymentsSection })));
const AgencyCrmSection = lazy(() => import('../components/AgencyCrmSection').then((m) => ({ default: m.AgencyCrmSection })));
const FinalCtaSection = lazy(() => import('../components/FinalCtaSection').then((m) => ({ default: m.FinalCtaSection })));

gsap.registerPlugin(ScrollTrigger);

interface HomePageProps {
  /** Entrance timeline is owned here but played by the loading screen. */
  navRef: React.RefObject<HTMLDivElement | null>;
  registerEntrance: (tl: gsap.core.Timeline | null) => void;
  registerWordLoop: (tl: gsap.core.Timeline | null) => void;
}

export default function HomePage({ navRef, registerEntrance, registerWordLoop }: HomePageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stickyStageRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const wordTrackRef = useRef<HTMLDivElement>(null);
  const subcopyRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const cardStageRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const phoneStageRef = useRef<HTMLDivElement>(null);
  const phoneScreenMaskRef = useRef<HTMLDivElement>(null);
  const phoneInterfaceRef = useRef<HTMLDivElement>(null);
  const internalCardStackRef = useRef<HTMLDivElement>(null);
  const finalContentRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const videoBgRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const entranceTlRef = useRef<gsap.core.Timeline | null>(null);
  const wordLoopTlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Set up Word Rotation Animation (Photos -> Videos -> PDFs -> Digital content -> Photos)
    if (wordTrackRef.current && !prefersReducedMotion) {
      const itemsCount = 5;
      const lineStep = 100 / itemsCount;
      
      const wordTl = gsap.timeline({ repeat: -1, paused: true });
      
      for (let i = 1; i < itemsCount; i++) {
        wordTl.to(wordTrackRef.current, {
          yPercent: -lineStep * i,
          duration: 0.55,
          ease: 'power3.inOut',
          delay: 1.8,
        });
      }

      wordTl.to(wordTrackRef.current, {
        yPercent: 0,
        duration: 0,
      });

      wordLoopTlRef.current = wordTl;
      registerWordLoop(wordTl);
    }

    if (prefersReducedMotion) {
      if (finalContentRef.current) {
        gsap.set(finalContentRef.current, { autoAlpha: 1, x: 0, pointerEvents: 'auto' });
      }
      if (internalCardStackRef.current) {
        gsap.set(internalCardStackRef.current, { autoAlpha: 1 });
      }
      return;
    }

    // Set initial hidden states
    if (finalContentRef.current) {
      gsap.set(finalContentRef.current, { autoAlpha: 0, x: 40, pointerEvents: 'none' });
    }
    if (internalCardStackRef.current) {
      gsap.set(internalCardStackRef.current, { autoAlpha: 0 });
    }

    // Page-Load Initial Entrance
    const ctx = gsap.context(() => {
      const loadTl = gsap.timeline({ paused: true });
      entranceTlRef.current = loadTl;
      registerEntrance(loadTl);

      loadTl
        .fromTo(navRef.current, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
        .fromTo(headingRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, '-=0.5')
        .fromTo(subcopyRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, '-=0.6')
        .fromTo(buttonsRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, '-=0.5');
      // The product cards are not part of the landing view any more — their
      // entrance is driven by scrolling (see the master timeline below).

      // GSAP MatchMedia for Responsive ScrollTrigger Setup
      const mm = gsap.matchMedia();

      mm.add(
        {
          // 820px keeps the desktop composition (phone left, copy right)
          // through split-screen widths instead of switching layouts there.
          isDesktop: '(min-width: 820px)',
          isTablet: '(min-width: 700px) and (max-width: 819px)',
          isMobile: '(max-width: 699px)',
        },
        (context) => {
          const { isMobile, isTablet } = context.conditions as { isMobile: boolean; isTablet: boolean };

          // Master Scroll-Driven Timeline with explicit normalized durations (0.0 to 1.0)
          const master = gsap.timeline({
            scrollTrigger: {
              trigger: trackRef.current,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.5,
              invalidateOnRefresh: true,
              anticipatePin: 1,
              fastScrollEnd: true,
              onUpdate: (self) => {
                // Pause rotating word loop when scrolling down past 15%
                if (wordLoopTlRef.current) {
                  if (self.progress > 0.15 && !wordLoopTlRef.current.paused()) {
                    wordLoopTlRef.current.pause();
                  } else if (self.progress <= 0.15 && wordLoopTlRef.current.paused()) {
                    wordLoopTlRef.current.resume();
                  }
                }
              },
            },
          });

          // Define explicit timeline labels as specified
          master
            .addLabel('heroInitial', 0)
            .addLabel('heroExit', 0.14)
            .addLabel('cardsReveal', 0.18)
            .addLabel('cardsFullyVisible', 0.26)
            .addLabel('cardsHold', 0.32)
            .addLabel('cardsConverge', 0.39)
            .addLabel('phoneReveal', 0.50)
            .addLabel('cardsStack', 0.62)
            .addLabel('handoff', 0.76)
            .addLabel('phoneComplete', 0.80)
            .addLabel('phoneMoveLeft', 0.85)
            .addLabel('finalReveal', 0.91)
            .addLabel('finalHold', 0.97);

          // HERO BACKGROUND VIDEO SCROLL FADE (0% -> 30% -> 60% -> 85%)
          if (videoBgRef.current) {
            master.to(
              videoBgRef.current,
              {
                opacity: isMobile ? 0.24 : 0.32,
                duration: 0.18,
                ease: 'power1.inOut',
              },
              0.30
            );

            master.to(
              videoBgRef.current,
              {
                opacity: isMobile ? 0.10 : 0.15,
                duration: 0.25,
                ease: 'power1.inOut',
              },
              0.60
            );

            master.to(
              videoBgRef.current,
              {
                opacity: 0,
                duration: 0.12,
                ease: 'power1.out',
              },
              0.85
            );
          }

          // STAGE 1: INITIAL HERO COPY EXITS & CARDS ELEVATE INTO FULL VIEW (14% - 26%)
          // The landing view scrolls away like a normal page: glow, video,
          // overlay and copy slide up together by one screen height, 1:1 with
          // the scroll — no fade. `heroScrollEnd` is the timeline progress at
          // which one stage-height of scrolling has happened.
          const stageH = stickyStageRef.current?.offsetHeight || window.innerHeight;
          const trackH = trackRef.current?.offsetHeight || stageH * 4.6;
          const heroScrollEnd = Math.min(0.3, stageH / Math.max(1, trackH - stageH));
          const heroLayers = [
            stickyStageRef.current?.querySelector('.hero-background'),
            videoBgRef.current,
            stickyStageRef.current?.querySelector('.hero-video-overlay'),
            headingRef.current,
          ].filter(Boolean) as Element[];

          master.fromTo(
            heroLayers,
            { y: 0 },
            {
              y: () => -(stickyStageRef.current?.offsetHeight || window.innerHeight),
              duration: heroScrollEnd,
              ease: 'none',
              force3D: true,
              immediateRender: false,
            },
            0
          );

          master.to(
            navRef.current,
            {
              opacity: 0.6,
              duration: 0.12,
              ease: 'power1.inOut',
            },
            0.14
          );

          // Dynamic calculation to ensure all five cards are completely visible from top to bottom
          const getFullyVisibleCardY = () => {
            if (!cardStageRef.current) return isMobile ? -80 : isTablet ? -160 : -220;
            const stageRect = cardStageRef.current.getBoundingClientRect();
            // Measure from the resting position: the rect includes any lift
            // already applied, which a mid-scroll refresh would otherwise
            // read as "already up".
            const appliedY = Number(gsap.getProperty(cardStageRef.current, 'y')) || 0;
            const vh = window.innerHeight;
            const targetBottom = vh - (isMobile ? 24 : 48);
            const requiredY = targetBottom - (stageRect.bottom - appliedY);
            return Math.min(requiredY, isMobile ? -60 : isTablet ? -150 : -210);
          };

          // Card row: invisible on the landing view, then rises in behind the
          // landing view as it scrolls away (14% -> 34%), easing to a stop.
          master.fromTo(
            cardStageRef.current,
            { y: 0, autoAlpha: 0 },
            {
              y: () => getFullyVisibleCardY(),
              autoAlpha: 1,
              duration: 0.2,
              ease: 'power2.out',
              force3D: true,
            },
            0.14
          );

          // ...and within it each card fades up in turn, left to right.
          cardsRef.current.forEach((cardEl, idx) => {
            if (!cardEl) return;
            master.fromTo(
              cardEl,
              { y: 70, opacity: 0, scale: 0.96 },
              { y: 0, opacity: 1, scale: 1, duration: 0.1, ease: 'power2.out' },
              // cascade left to right; the last card settles at ~0.33
              0.15 + idx * 0.02
            );
          });

          // STAGE 2: CARDS HOLD IN FULL VIEW (26% - 39%), THEN CONVERGE (39% - 53%)
          const cardRotations = [-6, -3, 0, 3, 6];
          const cardXShiftMobile = [-18, -9, 0, 9, 18];
          // The row already spans the stage edge to edge, so the scatter can
          // only drift a little outward before the end cards leave the screen;
          // the tilt carries the "scatter" feel.
          const cardXShiftDesktop = [-30, -15, 0, 15, 30];

          cardsRef.current.forEach((cardEl, idx) => {
            if (!cardEl) return;
            const targetX = isMobile ? cardXShiftMobile[idx] : cardXShiftDesktop[idx];
            
            master.to(
              cardEl,
              {
                x: targetX,
                rotation: cardRotations[idx],
                scale: isMobile ? 0.82 : 0.88,
                opacity: 1,
                duration: 0.14,
                ease: 'power2.inOut',
              },
              0.39
            );
          });

          // STAGE 3: PHONE REVEAL BEHIND CONVERGING CARDS (50% - 62%)
          master.fromTo(
            phoneStageRef.current,
            {
              opacity: 0,
              scale: 0.88,
              y: 50,
            },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.12,
              ease: 'power2.out',
            },
            0.50
          );

          // STAGE 4: CARDS ENTER CENTERED PHONE SCREEN MASK (62% - 76%)
          const getPhoneCardTargets = () => {
            if (!phoneScreenMaskRef.current || !cardStageRef.current) {
              return Array(5).fill({ x: 0, y: 0, scale: 0.36, rot: 0 });
            }

            const maskEl = phoneScreenMaskRef.current;
            const previewSlot = maskEl.querySelector('.phone-product-preview-slot') || maskEl;

            const slotRect = previewSlot.getBoundingClientRect();
            const slotCenterX = slotRect.left + slotRect.width / 2;
            const slotCenterY = slotRect.top + slotRect.height / 2;

            return cardsRef.current.map((cardEl) => {
              if (!cardEl) return { x: 0, y: 0, scale: 0.36, rot: 0 };
              const cardRect = cardEl.getBoundingClientRect();
              const cardCenterX = cardRect.left + cardRect.width / 2;
              const cardCenterY = cardRect.top + cardRect.height / 2;

              const dx = slotCenterX - cardCenterX;
              const dy = slotCenterY - cardCenterY;

              const scaleX = slotRect.width / (cardRect.width || 1);
              const scaleY = slotRect.height / (cardRect.height || 1);
              const safeScale = Math.min(scaleX, scaleY) * 0.94;

              return {
                x: dx,
                y: dy,
                scale: safeScale,
                rot: 0,
              };
            });
          };

          const cardStackOrder = [0, 4, 1, 3, 2];
          cardStackOrder.forEach((cardIdx, seq) => {
            const cardEl = cardsRef.current[cardIdx];
            if (!cardEl) return;

            const startOffset = 0.62 + seq * 0.028;
            master.to(
              cardEl,
              {
                x: () => getPhoneCardTargets()[cardIdx]?.x || 0,
                y: () => getPhoneCardTargets()[cardIdx]?.y || 0,
                scale: () => getPhoneCardTargets()[cardIdx]?.scale || 0.36,
                rotation: 0,
                boxShadow: '0 0 0 rgba(0,0,0,0)',
                zIndex: 10 + seq,
                duration: 0.10,
                ease: 'power2.inOut',
              },
              startOffset
            );
          });

          // STAGE 5: EXTERNAL TO INTERNAL HANDOFF & PHONE INTERFACE ASSEMBLY (76% - 80%)
          // External cards fade out cleanly
          master.to(
            cardsRef.current.filter(Boolean),
            {
              autoAlpha: 0,
              duration: 0.04,
              ease: 'power1.out',
            },
            0.76
          );

          master.to(
            cardStageRef.current,
            {
              autoAlpha: 0,
              visibility: 'hidden',
              pointerEvents: 'none',
              duration: 0.04,
            },
            0.77
          );

          // Internal card stack inside phone-screen-mask fades in
          master.to(
            internalCardStackRef.current,
            {
              autoAlpha: 1,
              visibility: 'visible',
              duration: 0.04,
              ease: 'power1.in',
            },
            0.76
          );

          // Phone App Interface Controls Fade-In
          master.fromTo(
            phoneInterfaceRef.current,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.05, ease: 'power2.out' },
            0.80
          );

          // LOCALIZED WHITE SPOTLIGHT BEHIND PHONE (fades in as phone completes)
          if (spotlightRef.current) {
            gsap.set(spotlightRef.current, { opacity: 0, scale: 0.82 });
            master.to(
              spotlightRef.current,
              {
                opacity: 1,
                scale: 1,
                duration: 0.07,
                ease: 'power2.out',
                force3D: true,
              },
              0.80
            );
          }

          // STAGE 7: ASSEMBLED PHONE MOVES FROM CENTER TO LEFT POSITION (85% - 93%)
          if (!isMobile && !isTablet) {
            // Desktop 2-Column shift to left column
            master.to(
              phoneStageRef.current,
              {
                x: '-22vw',
                duration: 0.08,
                ease: 'power2.inOut',
              },
              0.85
            );
          } else {
            // Mobile/Tablet upward shift
            master.to(
              phoneStageRef.current,
              {
                y: '-14vh',
                duration: 0.08,
                ease: 'power2.inOut',
              },
              0.85
            );
          }

          // STAGE 8: FINAL PRODUCT CONVERSION MESSAGE REVEAL (91% - 97%)
          master.to(
            finalContentRef.current,
            {
              autoAlpha: 1,
              x: 0,
              duration: 0.06,
              ease: 'power2.out',
              onStart: () => {
                if (finalContentRef.current) {
                  finalContentRef.current.style.pointerEvents = 'auto';
                }
              },
              onReverseComplete: () => {
                if (finalContentRef.current) {
                  finalContentRef.current.style.pointerEvents = 'none';
                }
              },
            },
            0.91
          );

          // STAGE 9: HOLD STABLE COMPOSITION (97% - 100%)
          master.to({}, { duration: 0.03 }, 0.97);
        }
      );
    }, containerRef);

    // Re-measure once fonts have settled (text metrics change layout).
    // Card images don't need their own pass: the cards have fixed aspect
    // ratios, so an image arriving never moves anything. ScrollTrigger also
    // refreshes itself on window 'load'.
    document.fonts.ready.then(() => requestScrollRefresh());

    return () => {
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={containerRef} className="w-full">
    {/* TALL SCROLL TRACK */}
    <section 
      ref={trackRef} 
      id="snapsell-scroll-track"
      className="snapsell-scroll-track relative w-full h-[460vh] sm:h-[480vh] lg:h-[520vh]"
    >
      {/* STICKY STAGE VIEWPORT */}
      <div 
        ref={stickyStageRef} 
        id="snapsell-sticky-stage"
        className="snapsell-sticky-stage sticky top-0 left-0 right-0 w-full h-[100svh] min-h-[700px] overflow-hidden select-none bg-grain"
      >
        {/* CINEMATIC BACKGROUND GLOWS */}
        <div className="hero-background absolute inset-0 z-0 pointer-events-none">
          {/* Top Center Emerald Glow */}
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 -translate-y-[140px] w-[980px] h-[780px] pointer-events-none" style={{ background: 'radial-gradient(closest-side, rgba(32,183,119,0.10), rgba(32,183,119,0.045) 55%, transparent)' }} />
          {/* Lower Silver Glow */}
          <div className="absolute bottom-[-5%] left-1/2 -translate-x-1/2 translate-y-[160px] w-[1220px] h-[720px] pointer-events-none" style={{ background: 'radial-gradient(closest-side, rgba(98,116,142,0.10), rgba(98,116,142,0.045) 55%, transparent)' }} />
          {/* Vignette */}
          <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-black/90 pointer-events-none" />
        </div>

        {/* HERO VIDEO BACKGROUND LAYER - z-1 */}
        <div ref={videoBgRef} className="hero-video-background">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            disablePictureInPicture
            onError={(e) => {
              console.warn('Hero video load failed:', e);
              if (videoBgRef.current) {
                videoBgRef.current.style.display = 'none';
              }
            }}
          >
            <source src="videos/hero-background.mp4" type="video/mp4" />
          </video>
        </div>

        {/* DARK VIDEO OVERLAY LAYER - z-2 */}
        <div className="hero-video-overlay" />

        {/* INITIAL HERO HEADLINE */}
        <HeroHeading
          headingRef={headingRef}
          wordTrackRef={wordTrackRef}
          subcopyRef={subcopyRef}
          buttonsRef={buttonsRef}
        />

        {/* FIVE PRODUCT CARDS STAGE
            Parked below the fold so the hero reads as full-bleed video with
            the copy on the floor. The scroll timeline lifts this row into
            view from 14% onward — getFullyVisibleCardY() measures the live
            rect, so it still lands correctly starting from down here. */}
        <div
          ref={cardStageRef}
          id="product-card-stage"
          className="product-card-stage external-card-stage absolute left-1/2 -translate-x-1/2 w-[min(94vw,1720px)] h-[clamp(340px,48vh,560px)] overflow-visible z-20 flex justify-between items-end pointer-events-auto"
          style={{
            willChange: 'transform, opacity',
            // Wait fully below the fold until scrolling starts: one card
            // height (card width × 4.2/3) plus room for the glow. Tied to the
            // card's own size so wide-but-short windows can't show the tops.
            bottom: 'calc(-1 * (clamp(210px, 17.5vw, 345px) * 1.4 + 140px))',
          }}
        >
          {PRODUCTS.map((product, idx) => {
            // Spread evenly with the first card flush left and the last flush
            // right (percent steps alone ignored the card's own width, so the
            // last card overhung the right edge).
            const step = idx / (PRODUCTS.length - 1);
            return (
              <div
                key={product.id}
                className="absolute bottom-0"
                style={{ left: `calc((100% - clamp(210px, 17.5vw, 345px)) * ${step})` }}
              >
                <ProductCard
                  product={product}
                  index={idx}
                  cardRef={(el) => {
                    cardsRef.current[idx] = el;
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* PHONE MOCKUP STAGE */}
        <PhoneMockup
          phoneStageRef={phoneStageRef}
          phoneScreenMaskRef={phoneScreenMaskRef}
          phoneInterfaceRef={phoneInterfaceRef}
          internalCardStackRef={internalCardStackRef}
          spotlightRef={spotlightRef}
        />

        {/* FINAL PRODUCT CONVERSION COPY */}
        <FinalMessage finalContentRef={finalContentRef} />

      </div>
    </section>

      {/* The landing page carries the full story; the routes above are
          direct entry points to the same sections for deep links and nav. */}
      {/* Below the fold: mounted in idle slices after the first screen is
          interactive (see DeferredSection). Heights are rough placeholders. */}
      <DeferredSection minHeight={2200}><ValuePropositionSection /></DeferredSection>
      <DeferredSection minHeight={1150}><CreatorBenefitsSection /></DeferredSection>
      <DeferredSection minHeight={2850}><ScrollWordsSection /></DeferredSection>
      <DeferredSection minHeight={4700}><HowItWorksSection /></DeferredSection>
      <DeferredSection minHeight={1200}><OurTeamSection /></DeferredSection>
      <DeferredSection minHeight={1600}><ContentTypesSection /></DeferredSection>
      <DeferredSection minHeight={1000}><SocialSellingSection /></DeferredSection>
      {/* Header targets, in header order: How It Works (above) → Payments →
          For Business (Agency CRM) → Contact */}
      <DeferredSection minHeight={1300}><PaymentsSection className="border-t border-white/10" /></DeferredSection>
      <DeferredSection minHeight={1500}><AgencyCrmSection /></DeferredSection>
      <DeferredSection minHeight={1000}><FinalCtaSection /></DeferredSection>
    </div>
  );
}
