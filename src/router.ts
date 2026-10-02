import { useCallback, useEffect, useState } from 'react';

/**
 * Minimal hash router.
 *
 * Hash routing rather than the History API on purpose: the site is also
 * published as a single self-contained HTML file with no server behind it,
 * so there is nothing to resolve `/payments` against. `#/payments` works
 * identically whether it's served by Vite, a static host, or opened from a
 * file — and it needs no routing dependency.
 */

export const ROUTES = [
  'home',
  'how-it-works',
  'payments',
  'business',
  'contact',
] as const;

export type Route = (typeof ROUTES)[number];

export const ROUTE_LABELS: Record<Route, string> = {
  home: 'Home',
  'how-it-works': 'How It Works',
  payments: 'Payments & Fees',
  business: 'For Business',
  contact: 'Contact',
};

/**
 * Header links scroll to these sections on the homepage instead of opening
 * a separate page. (The standalone pages still exist for direct URLs.)
 */
export const SECTION_FOR_ROUTE: Partial<Record<Route, string>> = {
  'how-it-works': 'how-it-works-section',
  payments: 'payments-section',
  business: 'agency-crm-section',
  contact: 'contact-section',
};

/** Links that appear in the nav (home is reached via the logo). */
export const NAV_ROUTES: Route[] = ['how-it-works', 'payments', 'business', 'contact'];

const parse = (): Route => {
  const raw = window.location.hash.replace(/^#\/?/, '').split('?')[0];
  return (ROUTES as readonly string[]).includes(raw) ? (raw as Route) : 'home';
};

export function hrefFor(route: Route) {
  return route === 'home' ? '#/' : `#/${route}`;
}

export function useHashRoute() {
  const [route, setRoute] = useState<Route>(() =>
    typeof window === 'undefined' ? 'home' : parse()
  );

  useEffect(() => {
    const onChange = () => setRoute(parse());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = useCallback((next: Route) => {
    window.location.hash = next === 'home' ? '/' : `/${next}`;
  }, []);

  return { route, navigate };
}
