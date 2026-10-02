# SnapSell — Website

Scroll-driven, multipage marketing site for SnapSell, built with Vite + React +
TypeScript + Tailwind CSS v4, animated with GSAP (ScrollTrigger) and Motion.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with HMR |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the built output |
| `npm run lint` | Typecheck only (`tsc --noEmit`) |

## Project layout

```
public/
  videos/              background + card clips, served as static files
  images/              logos + product/step photos (WebP)
src/
  App.tsx              app shell: loader, nav, route switch, footer
  router.ts            tiny hash router (no dependency)
  index.css            all styling (Tailwind v4 + custom layers)
  pages/
    HomePage           hero stage + master scroll timeline + every section
                       (header links scroll to How It Works, Payments,
                       For Business and Contact here)
    HowItWorksPage     step-by-step walkthrough
    PaymentsPage       pricing tiers + fee breakdown
    BusinessPage       business accounts detail
    ContactPage        contact channels + form (front-end only)
  components/
    LoadingScreen      cinematic loader; its mark flies into the navbar
    Navigation         monospace nav with digit-scramble hover
    ScrambleText       the scramble primitive
    HeroHeading        bottom-anchored hero copy
    ProductCard        hero product cards
    ProductCover       inline-SVG cover artwork (no external images)
    SnapSellLogo       logo (WebP; `markOnly` for the loader)
    AgencyCrmSection   agency CRM dashboard + six linked feature points
    DeferredSection    mounts below-the-fold sections after start-up
    LazyVideo          video that loads near the viewport, pauses off-screen
    PhoneMockup        phone that the cards assemble into
    FinalMessage       closing panel of the hero sequence
    ValueProposition…  horizontal stacking video cards
    CreatorBenefits…   interactive orbit hub
    ScrollWords…       Fast / Smart / Secure over a video backdrop
    HowItWorks…        timeline that alternates dark ↔ light per step
    ContentTypes…      single console-style panel
    SocialSelling…     infinite marquees (channels + download formats)
    BusinessAccounts…  minimal numbered feature rows
    OurTeam / FinalCta / Footer
  data/productData.ts  product card content
```

## Key implementation notes

**Routing is hash-based.** `src/router.ts` is ~60 lines with no dependency.
Hash rather than the History API because the site is also published as a single
self-contained HTML file with no server behind it — `#/payments` resolves the
same way from Vite, a static host, or a local file.

**Imagery is drawn or bundled, never fetched.** `ProductCover` renders as inline
SVG; the logo and photos are local WebP files in `public/images/`. An earlier version pulled from
a remote CDN and broke when that host stopped serving, leaving broken-image boxes
across the page. Nothing on the page depends on an external asset.

**Media lives in `public/`.** Videos and images are referenced by relative
path (`videos/…`, `images/…`), so they work in dev, on any static host and as
artifact files. Each `<video>` has an `onError`
handler that hides it, letting the themed gradient underneath show through.

**Scroll choreography.** The hero uses one master GSAP timeline on a tall track
with a sticky stage, driven by normalized labels (`heroExit` at 0.14,
`phoneReveal` at 0.50, `finalReveal` at 0.91…). Card positions are computed from
live bounding rects rather than fixed offsets, so the sequence survives layout
changes.

**Responsive approach: resize, don't redesign.** `gsap.matchMedia()` breakpoints
are `isDesktop ≥820px`, `isTablet 700–819px`, `isMobile ≤699px`. The desktop
composition is deliberately kept down to 820px so a split-screen window still
looks like the same design rather than a different layout. Alignment is never
flipped (left stays left); elements scale via `clamp()` instead.

**Reduced motion is handled throughout** — marquees stop, scrambles are skipped,
scroll-driven themes land on their final state.

## Building & deploying

`npm run build` produces a normal split build in `dist/` with relative paths:
the first screen's code in `index-*.js`, one chunk per homepage section
(downloaded only when that section is about to mount), plus `videos/` and
`images/`. Upload the whole `dist/` folder to any static host (Netlify,
Vercel, Cloudflare Pages, S3…) — no server config needed thanks to the hash
router.

### Publishing as an artifact

```bash
npm run build
python3 build_artifact.py        # -> artifact_page.html + artifact_files.json
```

The page embeds the CSS (so the first paint never waits on a stylesheet
request) and references the JS modules and media as separate files, listed in
`artifact_files.json` for the publish step.

`SINGLEFILE=1 npm run build && python3 build_artifact.py --inline` still
produces the old fully self-contained ~10 MB file if ever needed.

## Performance notes

Lighthouse on a gzip-serving host (PageSpeed's settings): desktop **100**,
mobile **92–94**. What keeps it there:

- **Code splitting** — sections and inner pages are `React.lazy` chunks.
- **Deferred sections** (`DeferredSection`) — below-the-fold sections mount
  after the intro and the visitor's first interaction, or as soon as they come
  within 1500px of the viewport. Header links mount everything first, then
  scroll.
- **Lazy media** — card videos (`LazyVideo`) attach their source near the
  viewport and pause off-screen; photos are WebP at display size with
  `loading="lazy"`.
- **No large blur filters** — glows are radial gradients.
- **One debounced `ScrollTrigger.refresh()`** (`src/lib/scrollRefresh.ts`).
- **Short intro** (~0.8s to reveal) — Google's LCP is the hero headline,
  which the intro holds back.

## Stack

React 19 · Vite 6 · TypeScript · Tailwind CSS v4 · GSAP 3 (ScrollTrigger) ·
Motion · lucide-react
