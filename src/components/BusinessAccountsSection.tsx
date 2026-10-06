import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  LayoutDashboard,
  ShieldCheck,
  UserPlus,
  Key,
  Webhook,
  ArrowRight,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

interface FeatureRow {
  id: string;
  tKey: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

const FEATURES_STATIC = [
  { id: 'central-dashboard',    tKey: 'dashboard', icon: LayoutDashboard },
  { id: 'team-worker-accounts', tKey: 'team',      icon: ShieldCheck },
  { id: 'unlimited-team-members', tKey: 'unlimited', icon: UserPlus },
  { id: 'api-access',           tKey: 'api',       icon: Key },
  { id: 'sales-webhooks',       tKey: 'webhooks',  icon: Webhook },
];

export function BusinessAccountsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { t } = useLanguage();

  type BAFeatureKey = keyof typeof t.businessAccountsSection.features;
  const FEATURES: FeatureRow[] = FEATURES_STATIC.map((s) => {
    const f = (t.businessAccountsSection.features as Record<BAFeatureKey, { title: string; description: string }>)[s.tKey as BAFeatureKey];
    return { id: s.id, tKey: s.tKey, title: f.title, description: f.description, icon: s.icon };
  });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sectionEl = sectionRef.current;
    if (!sectionEl || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.ba-anim',
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.07,
          ease: 'power2.out',
          scrollTrigger: { trigger: sectionEl, start: 'top 78%', once: true },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="business-accounts-section"
      className="ba-section"
    >
      <div className="ba-shell">

        {/* HEADER */}
        <header className="ba-head">
          <div className="ba-head-copy">
            <span className="ba-eyebrow ba-anim">{t.businessAccountsSection.eyebrow.toUpperCase()}</span>
            <h2 className="ba-title ba-anim">{t.businessAccountsSection.headline}</h2>
          </div>

          <div className="ba-head-aside ba-anim">
            <p className="ba-lede">
              {t.businessAccountsSection.description}
            </p>
            <a href="#/contact" className="ba-cta">
              <span>{t.businessAccountsSection.cta}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200" />
            </a>
          </div>
        </header>

        {/* FEATURE ROWS */}
        <ul className="ba-list">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <li key={f.id} className="ba-row ba-anim">
                <span className="ba-row-num">{String(i + 1).padStart(2, '0')}</span>

                <span className="ba-row-icon">
                  <Icon className="w-[17px] h-[17px]" />
                </span>

                <span className="ba-row-main">
                  <span className="ba-row-title">{f.title}</span>
                </span>

                <span className="ba-row-desc">{f.description}</span>
              </li>
            );
          })}
        </ul>

      </div>
    </section>
  );
}
