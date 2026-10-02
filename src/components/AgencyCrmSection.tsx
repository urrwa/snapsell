import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  BarChart3,
  Bell,
  Copy,
  Image as ImageIcon,
  LayoutDashboard,
  Link2,
  Search,
  Send,
  SquareKanban,
  UserCog,
  Users,
  Video,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/*  Content                                                            */
/* ------------------------------------------------------------------ */

type FeatureId = 'creators' | 'team' | 'inbox' | 'pipeline' | 'media' | 'analytics';

interface Feature {
  id: FeatureId;
  title: string;
  body: string;
  icon: React.ElementType;
}

/**
 * Six capabilities, each tied to one panel of the dashboard below.
 * Split three-and-three so they can sit either side of the dashboard on
 * wide screens; order within each side follows the panel positions.
 */
const LEFT: Feature[] = [
  {
    id: 'creators',
    title: 'Manage multiple creators',
    body: 'Profiles, internal notes, media, paid links and performance for every creator, organized in one place.',
    icon: Users,
  },
  {
    id: 'team',
    title: 'Organize your team',
    body: 'Separate access for chatters, moderators and administrators.',
    icon: UserCog,
  },
  {
    id: 'inbox',
    title: 'Central Telegram inbox',
    body: 'Handle Telegram conversations and assign each one to the right creator and team member.',
    icon: Send,
  },
];

const RIGHT: Feature[] = [
  {
    id: 'analytics',
    title: 'Dashboard & analytics',
    body: 'Follow creators, team members, paid links, sales, revenue and performance.',
    icon: BarChart3,
  },
  {
    id: 'pipeline',
    title: 'Simple CRM pipeline',
    body: 'Move contacts and activity through clear stages, without a complicated CRM.',
    icon: SquareKanban,
  },
  {
    id: 'media',
    title: 'Media & paid links',
    body: 'Upload images and videos, set a price and generate a paid link.',
    icon: Link2,
  },
];

const ORDER: FeatureId[] = ['creators', 'team', 'inbox', 'analytics', 'pipeline', 'media'];
const NUM: Record<FeatureId, string> = {
  creators: '01',
  team: '02',
  inbox: '03',
  analytics: '04',
  pipeline: '05',
  media: '06',
};

/* Sample workspace data — labelled as illustrative in the UI. */
const CREATORS = [
  { initials: 'MA', handle: '@maya.studio', links: 12, share: 0.82, hue: 'a' },
  { initials: 'NF', handle: '@noirframes', links: 9, share: 0.64, hue: 'b' },
  { initials: 'KE', handle: '@kai.edits', links: 7, share: 0.47, hue: 'c' },
  { initials: 'LP', handle: '@luna.presets', links: 5, share: 0.3, hue: 'd' },
];

const THREADS = [
  { name: 'J. Rivera', text: 'Is the preset pack still available?', creator: '@maya.studio', agent: 'Lena', unread: true },
  { name: 'A. Chen', text: 'Thanks — the link worked.', creator: '@kai.edits', agent: 'Dev', unread: false },
  { name: 'M. Okafor', text: 'Can I get the full collection?', creator: '@noirframes', agent: 'Lena', unread: true },
];

const STAGES = [
  { name: 'New', cards: ['T. Silva', 'R. Park'] },
  { name: 'Contacted', cards: ['J. Rivera'] },
  { name: 'Engaged', cards: ['M. Okafor', 'S. Ali'] },
  { name: 'Customer', cards: ['A. Chen'] },
];

const TEAM = [
  { initials: 'SK', name: 'Sara K.', role: 'Admin' },
  { initials: 'OR', name: 'Omar R.', role: 'Moderator' },
  { initials: 'LP', name: 'Lena P.', role: 'Chatter' },
  { initials: 'DA', name: 'Dev A.', role: 'Chatter' },
];

const MEDIA = [
  { kind: 'image', price: '$12', tone: 'a' },
  { kind: 'video', price: '$24', tone: 'b' },
  { kind: 'image', price: '$9', tone: 'c' },
];

/* Revenue area chart — sample curve. */
const CURVE = [18, 22, 20, 27, 25, 31, 29, 36, 34, 41, 39, 47, 45, 52];
const CHART_W = 300;
const CHART_H = 86;
const chartPoints = CURVE.map((v, i) => {
  const x = (i / (CURVE.length - 1)) * CHART_W;
  const y = CHART_H - ((v - 12) / 44) * (CHART_H - 8);
  return [x, y] as const;
});
const LINE = chartPoints.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
const AREA = `${LINE} L${CHART_W} ${CHART_H} L0 ${CHART_H} Z`;

/* The dashboard is laid out at one fixed design width and scaled to fit,
   so it reads as the same screenshot at every viewport rather than
   reflowing into a different layout. */
const DASH_W = 940;

/* ------------------------------------------------------------------ */
/*  Pieces                                                             */
/* ------------------------------------------------------------------ */

function Marker({ id }: { id: FeatureId }) {
  return <span className="crm-marker" aria-hidden="true">{NUM[id]}</span>;
}

interface PanelProps {
  id: FeatureId;
  active: FeatureId | null;
  onHover: (id: FeatureId | null) => void;
  className?: string;
  title: string;
  meta?: React.ReactNode;
  children: React.ReactNode;
}

function Panel({ id, active, onHover, className = '', title, meta, children }: PanelProps) {
  return (
    <div
      className={`crm-panel ${className} ${active === id ? 'is-active' : ''} ${active && active !== id ? 'is-dim' : ''}`}
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="crm-panel-head">
        <span className="crm-panel-title">{title}</span>
        {meta}
        <Marker id={id} />
      </div>
      {children}
    </div>
  );
}

interface FeatureListProps {
  items: Feature[];
  side: 'left' | 'right';
  active: FeatureId | null;
  onSelect: (id: FeatureId | null) => void;
}

function FeatureList({ items, side, active, onSelect }: FeatureListProps) {
  return (
    <ul className={`crm-features crm-features--${side}`}>
      {items.map((f) => {
        const Icon = f.icon;
        const on = active === f.id;
        return (
          <li key={f.id} className="crm-anim">
            <button
              type="button"
              className={`crm-feature ${on ? 'is-active' : ''}`}
              aria-pressed={on}
              onMouseEnter={() => onSelect(f.id)}
              onMouseLeave={() => onSelect(null)}
              onFocus={() => onSelect(f.id)}
              onBlur={() => onSelect(null)}
              onClick={() => onSelect(f.id)}
            >
              <span className="crm-feature-top">
                <span className="crm-feature-icon">
                  <Icon className="w-[16px] h-[16px]" />
                </span>
                <span className="crm-feature-num">{NUM[f.id]}</span>
              </span>
              <span className="crm-feature-title">{f.title}</span>
              <span className="crm-feature-body">{f.body}</span>
              <span className="crm-feature-link" aria-hidden="true" />
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

export function AgencyCrmSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // `hovered` is what the visitor is pointing at; `auto` is the idle tour.
  const [hovered, setHovered] = useState<FeatureId | null>(null);
  const [auto, setAuto] = useState<FeatureId | null>(null);
  const [scale, setScale] = useState(1);
  const [canvasH, setCanvasH] = useState(0);
  const active = hovered ?? auto;

  const select = useCallback((id: FeatureId | null) => setHovered(id), []);

  /* Fit the fixed-width dashboard to its column. */
  useLayoutEffect(() => {
    const frame = frameRef.current;
    const canvas = canvasRef.current;
    if (!frame || !canvas) return;

    const measure = () => {
      // Fill the column; allow a slight upscale so mid-width screens don't
      // leave a gap beside the dashboard (text stays crisp — it's live DOM).
      const s = Math.min(1.14, frame.clientWidth / DASH_W);
      setScale(s);
      setCanvasH(canvas.offsetHeight * s);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(frame);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  /* Idle tour: step through the six panels while the section is on
     screen and nobody is interacting with it. */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let timer: number | undefined;
    let i = 0;
    const start = () => {
      if (timer) return;
      setAuto(ORDER[i]);
      timer = window.setInterval(() => {
        i = (i + 1) % ORDER.length;
        setAuto(ORDER[i]);
      }, 2600);
    };
    const stop = () => {
      if (timer) window.clearInterval(timer);
      timer = undefined;
      setAuto(null);
    };

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      stop();
    };
  }, []);

  /* Scroll reveal, in the same manner as the neighbouring sections. */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.crm-head .crm-anim',
        { opacity: 0, y: 22 },
        {
          opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 78%', once: true },
        }
      );
      gsap.fromTo(
        '.crm-dash-wrap',
        { opacity: 0, y: 40, scale: 0.975 },
        {
          opacity: 1, y: 0, scale: 1, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: '.crm-stage', start: 'top 82%', once: true },
        }
      );
      gsap.fromTo(
        '.crm-features .crm-anim',
        { opacity: 0, y: 18 },
        {
          opacity: 1, y: 0, duration: 0.7, stagger: 0.07, ease: 'power2.out',
          scrollTrigger: { trigger: '.crm-stage', start: 'top 72%', once: true },
        }
      );
      gsap.fromTo(
        '.crm-cta',
        { opacity: 0, y: 26 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: 'power2.out',
          scrollTrigger: { trigger: '.crm-cta', start: 'top 88%', once: true },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="agency-crm-section"
      className="crm-section"
      aria-labelledby="crm-title"
    >
      {/* backdrop: grid lines + soft emerald light */}
      <div className="crm-backdrop" aria-hidden="true">
        <div className="crm-grid" />
        <div className="crm-glow crm-glow--top" />
        <div className="crm-glow crm-glow--low" />
      </div>

      <div className="crm-shell">
        {/* ---------------- 1. HEADER ---------------- */}
        <header className="crm-head">
          <span className="crm-label crm-anim">
            <span className="crm-label-dot" />
            NEW: SNAPSELL FOR AGENCIES
          </span>
          <h2 id="crm-title" className="crm-title crm-anim">
            One workspace to manage your{' '}
            <span className="emerald-gradient-text">entire creator agency.</span>
          </h2>
          <p className="crm-lede crm-anim">
            Creators, team members, Telegram conversations, media, paid links and
            performance, all run from one SnapSell Agency Account.
          </p>
        </header>

        {/* ---------------- 2 + 3. DASHBOARD & FEATURES ---------------- */}
        <div className="crm-stage">
          <FeatureList items={LEFT} side="left" active={active} onSelect={select} />

          <div className="crm-dash-wrap">
            <div ref={frameRef} className="crm-dash-frame" style={{ height: canvasH || undefined }}>
              <div
                ref={canvasRef}
                className="crm-dash"
                style={{ width: DASH_W, transform: `scale(${scale})` }}
                data-active={active ?? undefined}
              >
                {/* window chrome */}
                <div className="crm-chrome">
                  <span className="crm-dots"><i /><i /><i /></span>
                  <span className="crm-url">app.snapsell.co/agency</span>
                  <span className="crm-sample">Sample workspace</span>
                </div>

                <div className="crm-app">
                  {/* sidebar */}
                  <aside className="crm-side">
                    <div className="crm-side-brand">
                      <span className="crm-side-logo">S</span>
                      <span>
                        <b>Northlight Agency</b>
                        <small>Agency account</small>
                      </span>
                    </div>
                    <nav className="crm-side-nav">
                      {[
                        [LayoutDashboard, 'Dashboard', 'analytics'],
                        [Users, 'Creators', 'creators'],
                        [Send, 'Telegram inbox', 'inbox'],
                        [SquareKanban, 'Pipeline', 'pipeline'],
                        [ImageIcon, 'Media & links', 'media'],
                        [UserCog, 'Team', 'team'],
                      ].map(([Icon, label, id]) => {
                        const I = Icon as React.ElementType;
                        return (
                          <span
                            key={label as string}
                            className={`crm-side-item ${active === id ? 'is-on' : ''}`}
                          >
                            <I className="w-[14px] h-[14px]" />
                            {label as string}
                          </span>
                        );
                      })}
                    </nav>
                  </aside>

                  {/* main */}
                  <div className="crm-main">
                    <div className="crm-topbar">
                      <span className="crm-search">
                        <Search className="w-[12px] h-[12px]" />
                        Search creators, contacts, links
                      </span>
                      <span className="crm-topbar-right">
                        <Bell className="w-[14px] h-[14px]" />
                        <span className="crm-avatar crm-avatar--sm crm-hue-a">SK</span>
                      </span>
                    </div>

                    {/* analytics */}
                    <Panel id="analytics" active={active} onHover={select} className="crm-p-analytics" title="Performance · last 30 days">
                      <div className="crm-kpis">
                        {[
                          ['Sales', '1,284'],
                          ['Revenue', '$18,420'],
                          ['Paid links', '36'],
                          ['Creators', '4'],
                        ].map(([k, v]) => (
                          <div key={k} className="crm-kpi">
                            <span>{k}</span>
                            <b>{v}</b>
                          </div>
                        ))}
                      </div>
                      <svg className="crm-chart" viewBox={`0 0 ${CHART_W} ${CHART_H}`} preserveAspectRatio="none" aria-hidden="true">
                        <defs>
                          <linearGradient id="crmArea" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#20B777" stopOpacity="0.38" />
                            <stop offset="100%" stopColor="#20B777" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        {[0.25, 0.5, 0.75].map((f) => (
                          <line key={f} x1="0" x2={CHART_W} y1={CHART_H * f} y2={CHART_H * f} className="crm-chart-grid" />
                        ))}
                        <path d={AREA} fill="url(#crmArea)" />
                        <path d={LINE} className="crm-chart-line" />
                      </svg>
                    </Panel>

                    {/* creators */}
                    <Panel id="creators" active={active} onHover={select} className="crm-p-creators" title="Creators" meta={<span className="crm-meta">4 active</span>}>
                      <ul className="crm-rows">
                        {CREATORS.map((c) => (
                          <li key={c.handle} className="crm-row">
                            <span className={`crm-avatar crm-hue-${c.hue}`}>{c.initials}</span>
                            <span className="crm-row-main">
                              <b>{c.handle}</b>
                              <small>{c.links} paid links · notes</small>
                            </span>
                            <span className="crm-bar"><i style={{ width: `${c.share * 100}%` }} /></span>
                          </li>
                        ))}
                      </ul>
                    </Panel>

                    {/* inbox */}
                    <Panel id="inbox" active={active} onHover={select} className="crm-p-inbox" title="Telegram inbox" meta={<span className="crm-meta crm-meta--live">2 unread</span>}>
                      <ul className="crm-rows">
                        {THREADS.map((t) => (
                          <li key={t.name} className="crm-thread">
                            <span className="crm-tg"><Send className="w-[10px] h-[10px]" /></span>
                            <span className="crm-row-main">
                              <b>{t.name}{t.unread && <i className="crm-unread" />}</b>
                              <small>{t.text}</small>
                              <span className="crm-tags">
                                <em>{t.creator}</em>
                                <em className="crm-tag-agent">→ {t.agent}</em>
                              </span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </Panel>

                    {/* pipeline */}
                    <Panel id="pipeline" active={active} onHover={select} className="crm-p-pipeline" title="Pipeline">
                      <div className="crm-kanban">
                        {STAGES.map((s) => (
                          <div key={s.name} className="crm-col">
                            <span className="crm-col-head">{s.name}<em>{s.cards.length}</em></span>
                            {s.cards.map((c) => (
                              <span key={c} className="crm-card">{c}</span>
                            ))}
                          </div>
                        ))}
                      </div>
                    </Panel>

                    {/* media & paid links */}
                    <Panel id="media" active={active} onHover={select} className="crm-p-media" title="Media & paid links">
                      <div className="crm-media">
                        {MEDIA.map((m, i) => (
                          <span key={i} className={`crm-thumb crm-tone-${m.tone}`}>
                            {m.kind === 'video' ? <Video className="w-[14px] h-[14px]" /> : <ImageIcon className="w-[14px] h-[14px]" />}
                            <b>{m.price}</b>
                          </span>
                        ))}
                      </div>
                      <div className="crm-link">
                        <Link2 className="w-[11px] h-[11px]" />
                        <span>snapsell.co/p/7f9a2</span>
                        <em><Copy className="w-[10px] h-[10px]" /> Copy</em>
                      </div>
                    </Panel>

                    {/* team */}
                    <Panel id="team" active={active} onHover={select} className="crm-p-team" title="Team" meta={<span className="crm-meta">4 members</span>}>
                      <ul className="crm-rows">
                        {TEAM.map((m) => (
                          <li key={m.name} className="crm-row">
                            <span className="crm-avatar crm-avatar--sm crm-hue-t">{m.initials}</span>
                            <span className="crm-row-main"><b>{m.name}</b></span>
                            <span className={`crm-role crm-role--${m.role.toLowerCase()}`}>{m.role}</span>
                          </li>
                        ))}
                      </ul>
                    </Panel>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <FeatureList items={RIGHT} side="right" active={active} onSelect={select} />
        </div>

        {/* ---------------- 4. CTA ---------------- */}
        <div className="crm-cta">
          <div className="crm-cta-copy">
            <h3 className="crm-cta-title">Ready to organize your agency with SnapSell?</h3>
            <p className="crm-cta-micro">
              For agencies with two or more creators <span>·</span> Personal onboarding <span>·</span> KYC verification required
            </p>
          </div>
          <div className="crm-cta-actions">
            <a href="#/contact" className="nav-cta-btn crm-btn">
              Start your 14-day free trial
              <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#/contact" className="nav-ghost-btn crm-btn">
              Request an agency demo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
