import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * One debounced ScrollTrigger.refresh() for the whole app.
 *
 * refresh() re-measures every scroll animation on the page, which is a
 * full layout pass. Several things want one at start-up (fonts ready, route
 * change, sections mounting); calling it for each produced a string of
 * 150-230ms main-thread tasks. Coalescing them means a burst of requests
 * costs a single pass.
 */
let timer: number | undefined;

export function requestScrollRefresh(delay = 200) {
  window.clearTimeout(timer);
  timer = window.setTimeout(() => ScrollTrigger.refresh(), delay);
}
