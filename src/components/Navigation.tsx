import React, { useState, useRef, useEffect } from 'react';
import { SnapSellLogo } from './SnapSellLogo';
import { X, ArrowUpRight } from 'lucide-react';
import { ScrambleText, ScrambleHandle } from './ScrambleText';
import { NAV_ROUTES, hrefFor, type Route } from '../router';
import { useLanguage, type Lang } from '../i18n/LanguageContext';

interface NavigationProps {
  navRef?: React.RefObject<HTMLDivElement | null>;
  activeRoute?: Route;
}

/**
 * Nav item whose label scrambles into digits.
 *
 * Desktop fires on hover; touch devices have no hover, so the effect also
 * runs on touchstart and on mount when the mobile panel opens — otherwise
 * the scramble simply never appeared on a phone.
 */
/** EN / DE pill toggle */
const LangToggle: React.FC = () => {
  const { lang, setLang } = useLanguage();
  return (
    <div className="flex items-center gap-0.5 bg-white/5 border border-white/10 rounded-md overflow-hidden text-[11px] font-semibold tracking-wide">
      {(['en', 'de'] as Lang[]).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          className={`px-2.5 py-1 transition-colors ${lang === l ? 'bg-[#20B777] text-white' : 'text-slate-400 hover:text-white'}`}
          aria-pressed={lang === l}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

const ScrambleLink: React.FC<{
  route: Route;
  index: number;
  isActive: boolean;
  variant?: 'bar' | 'panel';
  playOnMount?: boolean;
  mountDelay?: number;
  onNavigate?: () => void;
}> = ({ route, index, isActive, variant = 'bar', playOnMount = false, mountDelay = 0, onNavigate }) => {
  const { t } = useLanguage();
  const scrambleRef = useRef<ScrambleHandle>(null);

  const ROUTE_LABELS_T: Record<Route, string> = {
    home: t.nav.home,
    'how-it-works': t.nav.howItWorks,
    payments: t.nav.payments,
    business: t.nav.business,
    contact: t.nav.contact,
  };

  useEffect(() => {
    if (!playOnMount) return;
    const t = window.setTimeout(() => scrambleRef.current?.enter(), mountDelay);
    return () => clearTimeout(t);
  }, [playOnMount, mountDelay]);

  return (
    <a
      id={`${variant === 'panel' ? 'mobile-' : ''}nav-link-${index}`}
      href={hrefFor(route)}
      onClick={onNavigate}
      className={variant === 'panel' ? 'nav-mobile-link' : 'nav-item'}
      aria-current={isActive ? 'page' : undefined}
      data-active={isActive || undefined}
      onMouseEnter={() => scrambleRef.current?.enter()}
      onMouseLeave={() => scrambleRef.current?.leave()}
      onTouchStart={() => scrambleRef.current?.enter()}
      onFocus={() => scrambleRef.current?.enter()}
      onBlur={() => scrambleRef.current?.leave()}
    >
      <span className="nav-item-marker" aria-hidden="true" />
      <ScrambleText ref={scrambleRef} text={ROUTE_LABELS_T[route]} />
    </a>
  );
};

export const Navigation: React.FC<NavigationProps> = ({ navRef, activeRoute = 'home' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  // Close the panel whenever the route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [activeRoute]);

  // Don't let the page scroll behind an open panel
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileMenuOpen]);

  return (
    <header
      ref={navRef}
      id="main-navigation"
      className="hero-navigation fixed top-0 left-0 right-0 z-50 pointer-events-auto"
    >
      <div className="nav-outer">
        <nav className="nav-bar">
          <a href={hrefFor('home')} id="snapsell-brand-link" className="nav-brand group">
            <span id="navbar-logo-target" className="flex items-center">
              <SnapSellLogo
                className="h-7 sm:h-8 w-auto transition-transform duration-300 group-hover:scale-105"
                priority={true}
              />
            </span>
          </a>

          <div className="nav-links">
            {NAV_ROUTES.map((r, idx) => (
              <ScrambleLink key={r} route={r} index={idx} isActive={activeRoute === r} />
            ))}
          </div>

          <div className="nav-actions">
            <LangToggle />

            <button id="nav-action-demo" type="button" className="nav-ghost-btn">
              {t.nav.seeDemo}
            </button>

            <button id="nav-action-start" type="button" className="nav-cta-btn group">
              <span className="nav-cta-label">{t.nav.startSelling}</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            <button
              id="mobile-menu-toggle"
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="nav-burger"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-[18px] h-[18px]" />
              ) : (
                <span className="nav-burger-lines" aria-hidden="true">
                  <i /><i /><i />
                </span>
              )}
            </button>
          </div>
        </nav>

        {mobileMenuOpen && (
          <div className="nav-mobile-panel">
            {NAV_ROUTES.map((r, idx) => (
              <ScrambleLink
                key={r}
                route={r}
                index={idx}
                isActive={activeRoute === r}
                variant="panel"
                /* stagger each label's scramble as the panel opens */
                playOnMount
                mountDelay={90 + idx * 70}
                onNavigate={() => setMobileMenuOpen(false)}
              />
            ))}

            <div className="nav-mobile-actions">
              <div className="flex justify-center pb-1">
                <LangToggle />
              </div>
              <button type="button" className="nav-ghost-btn w-full justify-center py-3">
                {t.nav.seeDemo}
              </button>
              <button type="button" className="nav-cta-btn w-full justify-center py-3">
                {t.nav.startSelling}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
