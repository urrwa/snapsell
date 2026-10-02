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

gsap.registerPlugin(ScrollTrigger);

interface FeatureRow {
  id: string;
  label: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

/**
 * Minimal feature rows.
 *
 * This section used to be five tall image cards. The imagery came from a
 * remote host that no longer resolves, so it rendered as five large empty
 * blocks with alt text — dominating the page for no benefit. The content is
 * a short list of capabilities, so it is presented as one now.
 */
const FEATURES: FeatureRow[] = [
  {
    id: 'central-dashboard',
    label: 'Central management',
    title: 'Central Dashboard',
    description: 'Manage accounts, products and activity from one place.',
    icon: LayoutDashboard,
  },
  {
    id: 'team-worker-accounts',
    label: 'Role-based access',
    title: 'Team and Worker Accounts',
    description: 'Give team members appropriate access without sharing the main account credentials.',
    icon: ShieldCheck,
  },
  {
    id: 'unlimited-team-members',
    label: 'Built to scale',
    title: 'Unlimited Team Members',
    description: 'Add the people required to operate and grow your creator business.',
    icon: UserPlus,
  },
  {
    id: 'api-access',
    label: 'System connections',
    title: 'API Access',
    description: 'Connect SnapSell to external platforms, applications and internal workflows.',
    icon: Key,
  },
  {
    id: 'sales-webhooks',
    label: 'Automated sales data',
    title: 'Sales Webhooks',
    description: 'Send completed-sale information to your CRM, automation or reporting systems.',
    icon: Webhook,
  },
];

export function BusinessAccountsSection() {
  const sectionRef = useRef<HTMLElement>(null);

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
            <span className="ba-eyebrow ba-anim">BUSINESS ACCOUNTS</span>
            <h2 className="ba-title ba-anim">One Platform for Your Entire Creator Team</h2>
          </div>

          <div className="ba-head-aside ba-anim">
            <p className="ba-lede">
              SnapSell Business Accounts help agencies and companies manage multiple
              creators and digital-product operations from a central environment.
            </p>
            <a href="#/contact" className="ba-cta">
              <span>Create a Business Account</span>
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
                  <span className="ba-row-label">{f.label}</span>
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
