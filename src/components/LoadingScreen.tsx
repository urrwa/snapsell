import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SnapSellLogo } from './SnapSellLogo';

interface LoadingScreenProps {
  /** Fired when the backdrop starts clearing — the site should reveal now. */
  onReveal: () => void;
  /** Fired once the logo has landed and the screen can unmount. */
  onComplete: () => void;
}

type Phase = 'loading' | 'reveal' | 'flying' | 'done';

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onReveal, onComplete }) => {
  // Progress is painted straight onto the DOM (transform + text), not kept in
  // React state: re-rendering every frame and animating width/left forced a
  // full layout per frame while the page was also starting up.
  const fillRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const paintProgress = (pct: number) => {
    const f = pct / 100;
    if (fillRef.current) fillRef.current.style.transform = `scaleX(${f})`;
    if (railRef.current) railRef.current.style.transform = `translateX(${pct}%)`;
    if (percentRef.current) percentRef.current.textContent = String(pct).padStart(3, '0');
  };
  const [phase, setPhase] = useState<Phase>('loading');
  const logoRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  /**
   * Fly the centred mark to wherever the navbar logo sits.
   *
   * Measured rather than hard-coded, so it lands correctly at any viewport
   * size. The navbar logo is the full wordmark; its square icon tile is the
   * leading ~17% of that SVG, which is what the loading mark becomes.
   */
  const flyToNavbar = useCallback(() => {
    const el = logoRef.current;
    const target = document.getElementById('navbar-logo-target');
    if (!el) {
      setPhase('done');
      later(onComplete, 400);
      return;
    }

    const from = el.getBoundingClientRect();

    if (!target) {
      // No navbar to aim at — fall back to a graceful lift-out.
      el.style.transform = 'scale(1.15)';
      el.style.opacity = '0';
      setPhase('done');
      later(onComplete, 700);
      return;
    }

    const to = target.getBoundingClientRect();

    // The icon tile occupies the leading square of the wordmark.
    const tileSize = to.height;
    const toCenterX = to.left + tileSize / 2;
    const toCenterY = to.top + to.height / 2;

    const fromCenterX = from.left + from.width / 2;
    const fromCenterY = from.top + from.height / 2;

    const scale = tileSize / from.width;
    const dx = toCenterX - fromCenterX;
    const dy = toCenterY - fromCenterY;

    document.documentElement.classList.add('ss-logo-in-flight');

    // Next frame, so the transition property is live before we move it.
    requestAnimationFrame(() => {
      el.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(${scale})`;
    });

    setPhase('flying');

    // Hand over to the real navbar logo once it has landed.
    later(() => {
      document.documentElement.classList.remove('ss-logo-in-flight');
      setPhase('done');
      later(onComplete, 300);
    }, 700);
  }, [later, onComplete]);

  useEffect(() => {
    let frame: number;
    const startTime = Date.now();
    // Short on purpose: the intro holds back the headline, and Google's
    // LCP (largest paint) is measured from when that headline appears.
    const duration = 650;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const raw = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - raw, 3);
      paintProgress(Math.floor(eased * 100));

      if (raw < 1) {
        frame = requestAnimationFrame(animate);
        return;
      }

      paintProgress(100);

      later(() => {
        // Clear the backdrop and bring the site in behind the mark.
        setPhase('reveal');
        onReveal();
        // Give the navbar a beat to settle, then measure and fly.
        later(flyToNavbar, 180);
      }, 100);
    };

    const startDelay = window.setTimeout(() => {
      frame = requestAnimationFrame(animate);
    }, 60);
    timers.current.push(startDelay);

    return () => {
      cancelAnimationFrame(frame);
      timers.current.forEach(clearTimeout);
      document.documentElement.classList.remove('ss-logo-in-flight');
    };
  }, [flyToNavbar, later, onReveal]);

  const chromeHidden = phase !== 'loading';

  return (
    <div
      className={`loading-screen phase-${phase}`}
      aria-hidden="true"
    >
      <div className="loading-bg-glow" />

      {/* The mark that travels to the navbar */}
      <div ref={logoRef} className="loading-logo-container">
        <div className="loading-logo-ghost" />
        <div className="loading-logo-icon">
          <SnapSellLogo markOnly priority alt="" className="loading-logo-img" />
        </div>
      </div>

      <div className={`loading-bottom ${chromeHidden ? 'is-hidden' : ''}`}>
        <div className="loading-progress-track">
          <div ref={fillRef} className="loading-progress-fill" style={{ transform: 'scaleX(0)' }} />
          <div ref={railRef} className="loading-progress-rail" style={{ transform: 'translateX(0%)' }}>
            <div className="loading-progress-dot" />
          </div>
        </div>

        <div className="loading-bottom-info">
          <div className="loading-info-left">
            <div className="loading-dot-indicator" />
            <span className="loading-label">LOADING</span>
            <span ref={percentRef} className="loading-percent">000</span>
          </div>

          <div className="loading-info-right">
            <SnapSellLogo priority alt="SnapSell" className="loading-brand-logo" />
          </div>
        </div>
      </div>
    </div>
  );
};
