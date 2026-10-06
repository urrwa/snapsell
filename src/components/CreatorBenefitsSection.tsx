import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Percent, 
  Zap, 
  BarChart3, 
  Globe, 
  Calendar, 
  Check, 
  ArrowRight 
} from 'lucide-react';
import { SnapSellLogo } from './SnapSellLogo';
import { useLanguage } from '../i18n/LanguageContext';

export interface Benefit {
  id: string;
  eyebrow: string;
  shortLabel: string;
  title: string;
  description: string;
  bullets: string[];
  icon: React.ElementType;
  // Position percentages on orbit (x, y relative to center 50%, 50%)
  x: number; // % from left
  y: number; // % from top
  angleDeg: number;
}

// IDs aligned with translation keys
const BENEFITS_BASE = [
  { id: 'no-fees', tKey: 'noFees' as const, icon: ShieldCheck, x: 50, y: 10, angleDeg: -90, bullets: ['Start without a monthly commitment', 'Publish products right away', 'Better for creators testing new offers', 'Pay only when you generate sales'] },
  { id: 'pricing', tKey: 'pricing' as const, icon: Percent, x: 85, y: 30, angleDeg: -30, bullets: ['Clear platform fee structure', 'Cost is tied to actual sales activity', 'No recurring subscription burden', 'Built for flexible creator monetization'] },
  { id: 'delivery', tKey: 'delivery' as const, icon: Zap, x: 85, y: 70, angleDeg: 30, bullets: ['Secure digital access for buyers', 'No manual file sending', 'Faster fulfillment experience', 'Better buyer experience at scale'] },
  { id: 'dashboard', tKey: 'dashboard' as const, icon: BarChart3, x: 50, y: 90, angleDeg: 90, bullets: ['View your sales activity', 'Track earnings and balances', 'Manage digital products centrally', 'Stay organized as you grow'] },
  { id: 'global-sales', tKey: 'international' as const, icon: Globe, x: 15, y: 70, angleDeg: 150, bullets: ['Sell to buyers in multiple markets', 'Support broader audience reach', 'Better flexibility across regions', 'Built for cross-channel digital selling'] },
  { id: 'payouts', tKey: 'payouts' as const, icon: Calendar, x: 15, y: 30, angleDeg: 210, bullets: ['Structured payout flow', 'Suitable for ongoing creator sales', 'Clear payout expectations', 'Supports more predictable operations'] },
];

export function CreatorBenefitsSection() {
  const [activeId, setActiveId] = useState<string>('no-fees');
  const { t } = useLanguage();

  const BENEFITS: Benefit[] = BENEFITS_BASE.map((b) => {
    const card = t.creatorBenefitsSection.cards[b.tKey];
    return {
      id: b.id,
      eyebrow: t.creatorBenefitsSection.eyebrow.toUpperCase(),
      shortLabel: card.shortLabel,
      title: card.title,
      description: card.description,
      bullets: (card as { bullets?: string[] }).bullets ?? b.bullets,
      icon: b.icon,
      x: b.x,
      y: b.y,
      angleDeg: b.angleDeg,
    };
  });

  const activeBenefit = BENEFITS.find((b) => b.id === activeId) || BENEFITS[0];
  const ActiveIcon = activeBenefit.icon;

  return (
    <section 
      id="creator-benefits"
      className="relative w-full py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-black border-t border-white/10 overflow-hidden"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-radial from-[#20B777]/10 via-[#20B777]/5 to-transparent rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <span className="text-[11px] font-bold tracking-[0.25em] text-[#7AE9B4] uppercase mb-3 inline-block px-3.5 py-1 rounded-full bg-[#20B777]/10 border border-[#20B777]/20">
            {t.creatorBenefitsSection.eyebrow.toUpperCase()}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mt-2">
            {t.creatorBenefits.headline}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed mt-4 max-w-2xl mx-auto">
            {t.creatorBenefits.eyebrow}
          </p>
        </div>

        {/* MAIN INTERACTIVE HUB & DETAIL GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT: INTERACTIVE ORBIT ECOSYSTEM GRAPHIC */}
          <div className="lg:col-span-6 flex justify-center items-center">
            <div className="relative w-full max-w-[420px] sm:max-w-[480px] lg:max-w-[500px] aspect-square flex items-center justify-center p-2">
              
              {/* Outer Subtle Orbit Line */}
              <div className="absolute inset-[8%] rounded-full border border-dashed border-white/15 pointer-events-none" />
              
              {/* Inner Orbit Line */}
              <div className="absolute inset-[24%] rounded-full border border-white/10 pointer-events-none" />

              {/* Connecting Lines SVG */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <defs>
                  <linearGradient id="benefitPulseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#20B777" stopOpacity="0" />
                    <stop offset="45%" stopColor="#7AE9B4" stopOpacity="1" />
                    <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#20B777" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {BENEFITS.map((benefit) => {
                  const isActive = benefit.id === activeId;
                  return (
                    <line
                      key={`line-${benefit.id}`}
                      x1="50%"
                      y1="50%"
                      x2={`${benefit.x}%`}
                      y2={`${benefit.y}%`}
                      stroke={isActive ? '#20B777' : '#ffffff'}
                      strokeOpacity={isActive ? '0.8' : '0.12'}
                      strokeWidth={isActive ? '2' : '1'}
                      strokeDasharray={isActive ? 'none' : '4 4'}
                      className="transition-all duration-300"
                    />
                  );
                })}

                {/* Travelling light pulse along the active connector */}
                <line
                  key={`pulse-${activeId}`}
                  className="benefit-line-pulse"
                  x1="50%"
                  y1="50%"
                  x2={`${activeBenefit.x}%`}
                  y2={`${activeBenefit.y}%`}
                  stroke="url(#benefitPulseGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>

              {/* CENTER CIRCLE: SnapSell Hub */}
              <div className="relative z-10 w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border-2 border-[#20B777]/40 shadow-[0_0_50px_rgba(32,183,119,0.25)] flex items-center justify-center text-center p-3 transition-transform duration-500 hover:scale-105">
                <div className="absolute inset-0 rounded-full bg-radial from-[#20B777]/20 to-transparent pointer-events-none" />
                <SnapSellLogo className="h-6 sm:h-8 w-auto object-contain" />
              </div>

              {/* SURROUNDING 6 NODES */}
              {BENEFITS.map((benefit) => {
                const isActive = benefit.id === activeId;
                const IconComp = benefit.icon;

                return (
                  <button
                    key={benefit.id}
                    type="button"
                    onMouseEnter={() => setActiveId(benefit.id)}
                    onClick={() => setActiveId(benefit.id)}
                    style={{
                      left: `${benefit.x}%`,
                      top: `${benefit.y}%`,
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-2xl transition-all duration-300 group focus:outline-none cursor-pointer ${
                      isActive
                        ? 'bg-zinc-900/95 border-2 border-[#4ED398] shadow-[0_0_30px_rgba(32,183,119,0.45)] scale-110'
                        : 'bg-zinc-950/80 border border-white/15 hover:border-[#20B777]/50 hover:bg-zinc-900/90 hover:scale-105'
                    }`}
                  >
                    {/* Expanding light ring, replays on each selection */}
                    {isActive && (
                      <motion.span
                        key={`ping-${benefit.id}`}
                        className="benefit-node-ping"
                        initial={{ scale: 0.75, opacity: 0.85 }}
                        animate={{ scale: 2.1, opacity: 0 }}
                        transition={{ duration: 0.9, ease: 'easeOut' }}
                        aria-hidden="true"
                      />
                    )}

                    <div
                      className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                        isActive
                          ? 'bg-[#20B777]/25 text-[#7AE9B4]'
                          : 'bg-white/5 text-slate-400 group-hover:text-[#7AE9B4] group-hover:bg-[#20B777]/10'
                      }`}
                    >
                      <IconComp className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <span
                      className={`text-[10px] sm:text-xs font-semibold mt-1 whitespace-nowrap transition-colors duration-300 ${
                        isActive ? 'text-[#7AE9B4] font-bold' : 'text-slate-300 group-hover:text-white'
                      }`}
                    >
                      {benefit.shortLabel}
                    </span>
                  </button>
                );
              })}

            </div>
          </div>

          {/* RIGHT: DYNAMIC BENEFIT DETAIL CARD */}
          <div className="lg:col-span-6">
            <div className="benefit-detail-card relative rounded-[28px] p-6 sm:p-8 md:p-9 overflow-hidden min-h-[430px] flex flex-col">

              {/* Ambient corner glow */}
              <div className="benefit-card-glow" aria-hidden="true" />

              {/* Light sweep — replays on every option change */}
              <motion.div
                key={`sweep-${activeBenefit.id}`}
                className="benefit-card-sweep"
                initial={{ x: '-130%', opacity: 0 }}
                animate={{ x: '260%', opacity: [0, 1, 1, 0] }}
                transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1], times: [0, 0.15, 0.7, 1] }}
                aria-hidden="true"
              />

              {/* Colour wash flash behind the content */}
              <motion.div
                key={`wash-${activeBenefit.id}`}
                className="benefit-card-wash"
                initial={{ opacity: 0.55 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.75, ease: 'easeOut' }}
                aria-hidden="true"
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeBenefit.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="relative z-10 flex-1"
                >
                  {/* Icon Badge & Eyebrow */}
                  <div className="flex items-start gap-4 mb-5">
                    <motion.div
                      className="benefit-icon-badge shrink-0"
                      initial={{ scale: 0.82, rotate: -8, opacity: 0 }}
                      animate={{ scale: 1, rotate: 0, opacity: 1 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <ActiveIcon className="w-6 h-6 sm:w-7 sm:h-7" />
                    </motion.div>

                    <div className="min-w-0 pt-0.5">
                      <span className="benefit-eyebrow">
                        <span className="benefit-eyebrow-dash" />
                        {activeBenefit.eyebrow}
                      </span>
                      <h3 className="text-[clamp(22px,2.4vw,32px)] font-extrabold text-white tracking-[-0.03em] leading-[1.1] mt-1.5">
                        {activeBenefit.title}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-slate-300/90 text-sm sm:text-[15px] leading-relaxed mb-6 font-normal max-w-[54ch]">
                    {activeBenefit.description}
                  </p>

                  {/* Bullet List — staggered in */}
                  <motion.div
                    className="space-y-2 pt-5 border-t border-white/10"
                    initial="hidden"
                    animate="show"
                    variants={{
                      hidden: {},
                      show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
                    }}
                  >
                    {activeBenefit.bullets.map((bullet, idx) => (
                      <motion.div
                        key={idx}
                        className="benefit-bullet-row"
                        variants={{
                          hidden: { opacity: 0, x: -12 },
                          show: { opacity: 1, x: 0, transition: { duration: 0.32, ease: 'easeOut' } },
                        }}
                      >
                        <span className="benefit-check-chip">
                          <Check className="w-3 h-3 stroke-[3.5]" />
                        </span>
                        <span className="text-xs sm:text-sm text-slate-200 font-medium leading-snug">
                          {bullet}
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* Card Footer — progress track */}
              <div className="mt-7 pt-4 border-t border-white/10 flex items-center justify-between gap-4 relative z-10">
                <span className="flex items-center gap-2 text-[11px] sm:text-xs text-[#4ED398]/75 font-medium min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4ED398] animate-pulse shrink-0" />
                  <span className="truncate">Hover any node to explore features</span>
                </span>

                <div className="flex items-center gap-2.5 shrink-0">
                  <div className="flex items-center gap-1.5">
                    {BENEFITS.map((b) => (
                      <span
                        key={`dot-${b.id}`}
                        className={`benefit-progress-dot ${b.id === activeId ? 'is-active' : ''}`}
                      />
                    ))}
                  </div>
                  <span className="font-mono text-[11px] text-slate-500 tabular-nums">
                    0{BENEFITS.findIndex((b) => b.id === activeId) + 1}/0{BENEFITS.length}
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* BOTTOM CTA BUTTONS */}
        <div className="mt-14 sm:mt-18 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full emerald-pill-btn text-zinc-950 font-bold text-sm shadow-[0_0_25px_rgba(32,183,119,0.25)] hover:shadow-[0_0_35px_rgba(32,183,119,0.35)] transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
          >
            <span>{t.hero.startSelling}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/5 border border-white/15 text-white font-semibold text-sm hover:bg-white/10 hover:border-white/30 transition-all flex items-center justify-center gap-2"
          >
            <span>{t.hero.seeHowItWorks}</span>
          </a>
        </div>

      </div>
    </section>
  );
}
