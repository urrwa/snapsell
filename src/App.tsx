import React, { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Navigation } from './components/Navigation';
import { LoadingScreen } from './components/LoadingScreen';
import { FooterSection } from './components/FooterSection';

import HomePage from './pages/HomePage';
// Inner pages are only reached by direct link; load them on demand.
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage'));
const PaymentsPage = lazy(() => import('./pages/PaymentsPage'));
const BusinessPage = lazy(() => import('./pages/BusinessPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));

import { ROUTES, SECTION_FOR_ROUTE, useHashRoute, type Route } from './router';
import { mountAllDeferred, releaseDeferredSections } from './components/DeferredSection';
import { requestScrollRefresh } from './lib/scrollRefresh';

gsap.registerPlugin(ScrollTrigger);

/** Resolve an in-site hash link to a route, or null if it isn't one. */
function routeFromHref(href: string): Route | null {
  if (!href.startsWith('#')) return null;
  const raw = href.replace(/^#\/?/, '').split('?')[0];
  if (raw === '') return 'home';
  return (ROUTES as readonly string[]).includes(raw) ? (raw as Route) : null;
}

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Scroll the window to `y` with an eased rAF animation; resolves when done. */
function smoothScrollTo(y: number): Promise<void> {
  const startY = window.scrollY;
  const dist = y - startY;
  if (Math.abs(dist) < 2) return Promise.resolve();
  // longer trips take a little longer (the homepage is long), but never drag
  const duration = Math.min(1500, 420 + Math.abs(dist) * 0.06);
  return new Promise((resolve) => {
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / duration);
      window.scrollTo(0, startY + dist * easeInOutCubic(t));
      if (t < 1) requestAnimationFrame(tick);
      else resolve();
    };
    requestAnimationFrame(tick);
  });
}

const nextFrame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));

/**
 * Smoothly scroll the homepage to a section. Any sections still waiting to
 * mount are mounted first and scroll animations re-measured, so the target
 * position is the real one — then it lands just below the fixed header.
 */
async function scrollToSection(id: string, instant = false) {
  mountAllDeferred();
  // sections are separate chunks: wait (briefly) for the target to exist
  for (let i = 0; i < 40 && !document.getElementById(id); i++) {
    await new Promise((r) => setTimeout(r, 50));
  }
  await new Promise((r) => setTimeout(r, 60));
  await nextFrame();
  ScrollTrigger.refresh();
  await nextFrame();
  const targetY = () => {
    const el = document.getElementById(id);
    if (!el) return null;
    const nav = document.querySelector('.nav-bar') as HTMLElement | null;
    const offset = (nav?.getBoundingClientRect().bottom ?? 80) + 12;
    return Math.max(0, el.getBoundingClientRect().top + window.scrollY - offset);
  };
  const y = targetY();
  if (y === null) return;
  if (instant) { window.scrollTo(0, y); return; }
  await smoothScrollTo(y);
  // The page can still be settling while we travel (just-mounted sections,
  // scroll animations re-measuring). Check on arrival and glide the last bit.
  for (let i = 0; i < 2; i++) {
    await new Promise((r) => setTimeout(r, 220));
    const again = targetY();
    if (again === null || Math.abs(again - window.scrollY) <= 3) break;
    await smoothScrollTo(again);
  }
}

export default function App() {
  const { route } = useHashRoute();
  const navRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const fadeOutRef = useRef<Animation | null>(null);
  const pendingFadeInRef = useRef(false);
  const pendingSectionRef = useRef<string | null>(null);
  const routeRef = useRef<Route>(route);
  routeRef.current = route;

  // Timelines live on the home page but are played by the loading screen,
  // so the page registers them up here when it mounts.
  const entranceTlRef = useRef<gsap.core.Timeline | null>(null);
  const wordLoopTlRef = useRef<gsap.core.Timeline | null>(null);

  const [isLoading, setIsLoading] = useState(() => {
    if (typeof window === 'undefined') return true;
    // The loader is an intro, not a page transition — only on a cold start.
    return !window.location.hash || window.location.hash === '#/';
  });

  const registerEntrance = useCallback((tl: gsap.core.Timeline | null) => {
    entranceTlRef.current = tl;
  }, []);

  const registerWordLoop = useCallback((tl: gsap.core.Timeline | null) => {
    wordLoopTlRef.current = tl;
  }, []);

  const handleReveal = useCallback(() => {
    requestAnimationFrame(() => {
      entranceTlRef.current?.play();
      wordLoopTlRef.current?.play();
    });
  }, []);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
    releaseDeferredSections();
  }, []);

  // No intro on this visit (opened on an inner page): nothing to wait for.
  useEffect(() => {
    if (!isLoading) releaseDeferredSections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Smooth page transitions for every in-site link (header, logo, mobile
  // menu, hero and footer links). Destinations are unchanged — the click
  // still lands on the same page; only the jump is replaced with motion.
  useEffect(() => {
    const onClick = async (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!link || link.target === '_blank') return;
      const href = link.getAttribute('href') || '';
      const target = routeFromHref(href);
      if (!target) return; // not a page link — leave its behaviour as it was

      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Header targets (How It Works, Payments & Fees, For Business, Contact)
      // scroll to their section on the homepage — no page change.
      const sectionId = SECTION_FOR_ROUTE[target];
      if (sectionId) {
        e.preventDefault();
        if (routeRef.current === 'home') {
          await scrollToSection(sectionId, reduce);
        } else {
          // opened on a standalone page via a direct link: go home, then glide
          pendingSectionRef.current = sectionId;
          window.location.hash = '#/';
        }
        return;
      }

      if (reduce) return; // native instant navigation

      e.preventDefault();

      // Same page: just glide back to the top.
      if (target === routeRef.current) {
        await smoothScrollTo(0);
        return;
      }

      const main = mainRef.current;
      const nearTop = window.scrollY <= window.innerHeight * 2;
      if (nearTop) {
        await smoothScrollTo(0);
      } else if (main) {
        // Far down a long page: a smooth scroll would race back through
        // every scroll animation, so fade the page out instead.
        fadeOutRef.current = main.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: 220,
          easing: 'ease-out',
          fill: 'forwards',
        });
        await fadeOutRef.current.finished.catch(() => undefined);
      }

      pendingFadeInRef.current = true;
      window.location.hash = href;
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  // Land at the top of each new page, and re-measure pinned/scrubbed sections.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    if (pendingFadeInRef.current && mainRef.current) {
      pendingFadeInRef.current = false;
      // opacity only: a transform here would shift GSAP's pin measurements
      fadeOutRef.current?.cancel();
      fadeOutRef.current = null;
      mainRef.current.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 460,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      });
    }
    requestScrollRefresh(220);

    // arrived home from a header link: glide to the section it asked for
    if (route === 'home' && pendingSectionRef.current) {
      const id = pendingSectionRef.current;
      pendingSectionRef.current = null;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.setTimeout(() => { void scrollToSection(id, reduce); }, 350);
    }
  }, [route]);

  // If the site opens on an inner page, the hero entrance never runs, so make
  // sure the nav is visible rather than stuck at the timeline's "from" state.
  useEffect(() => {
    if (route !== 'home' && navRef.current) {
      gsap.set(navRef.current, { opacity: 1, y: 0, clearProps: 'transform' });
    }
  }, [route]);

  const renderPage = (r: Route) => {
    switch (r) {
      case 'how-it-works':
        return <HowItWorksPage />;
      case 'payments':
        return <PaymentsPage />;
      case 'business':
        return <BusinessPage />;
      case 'contact':
        return <ContactPage />;
      default:
        return (
          <HomePage
            navRef={navRef}
            registerEntrance={registerEntrance}
            registerWordLoop={registerWordLoop}
          />
        );
    }
  };

  return (
    <div className="w-full bg-[#020204] text-slate-100 min-h-screen relative font-sans">
      {isLoading && (
        <LoadingScreen onReveal={handleReveal} onComplete={handleLoadingComplete} />
      )}

      <Navigation navRef={navRef} activeRoute={route} />

      {/* Inner pages start below the fixed bar; home tucks under it by design */}
      <main ref={mainRef} className={route === 'home' ? '' : 'pt-[104px] sm:pt-[118px]'}>
        {/* key remounts page-level GSAP contexts on navigation */}
        <React.Fragment key={route}><Suspense fallback={<div style={{ minHeight: '100vh' }} />}>{renderPage(route)}</Suspense></React.Fragment>
      </main>

      <FooterSection />
    </div>
  );
}
