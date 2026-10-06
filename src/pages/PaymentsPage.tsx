import React from 'react';
import {
  Percent,
  CreditCard,
  Calendar,
  ShieldCheck,
  Check,
  Sparkles,
  Info,
} from 'lucide-react';
import { CreatorBenefitsSection } from '../components/CreatorBenefitsSection';
import { FinalCtaSection } from '../components/FinalCtaSection';
import { useLanguage } from '../i18n/LanguageContext';

/** Pricing + fee breakdown. Used on the Payments page and on the homepage,
 *  where the header's "Payments & Fees" link scrolls to it. */
export function PaymentsSection({ className = '' }: { className?: string }) {
  const { t } = useLanguage();

  const PLANS = [
    {
      id: 'creator',
      featured: true,
      ...t.paymentsPage.plans.creator,
    },
    {
      id: 'business',
      featured: false,
      ...t.paymentsPage.plans.business,
    },
  ];

  const DEDUCTIONS = [
    { icon: Percent, ...t.paymentsPage.deductions.serviceFee },
    { icon: CreditCard, ...t.paymentsPage.deductions.paymentProcessing },
    { icon: Calendar, ...t.paymentsPage.deductions.payoutSchedule },
    { icon: ShieldCheck, ...t.paymentsPage.deductions.refunds },
  ];

  return (
      <section id="payments-section" className={`page-section ${className}`}>
        <div className="page-shell">
          <header className="page-head">
            <span className="page-eyebrow">{t.paymentsPage.eyebrow.toUpperCase()}</span>
            <h1 className="page-title">
              {t.paymentsPage.headline1} <span className="emerald-gradient-text">{t.paymentsPage.headline2}</span>
            </h1>
            <p className="page-lede">
              {t.paymentsPage.description}
            </p>
          </header>

          {/* PRICING */}
          <div className="pricing-grid">
            {PLANS.map((plan) => (
              <article
                key={plan.id}
                className={`pricing-card ${plan.featured ? 'is-featured' : ''}`}
              >
                {plan.featured && (
                  <span className="pricing-flag">
                    <Sparkles className="w-3 h-3" />
                    {t.paymentsPage.mostCreators}
                  </span>
                )}

                <h2 className="pricing-name">{plan.name}</h2>
                <p className="pricing-tagline">{plan.tagline}</p>

                <div className="pricing-figure">
                  <span className="pricing-price">{plan.price}</span>
                  <span className="pricing-unit">{plan.unit}</span>
                </div>

                <ul className="pricing-points">
                  {(plan.points as readonly string[]).map((p) => (
                    <li key={p}>
                      <span className="pricing-check">
                        <Check className="w-3 h-3 stroke-[3.5]" />
                      </span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  className={plan.featured ? 'nav-cta-btn w-full justify-center py-3' : 'nav-ghost-btn w-full justify-center py-3'}
                >
                  {plan.featured ? t.paymentsPage.startSelling : t.paymentsPage.talkToSales}
                </button>
              </article>
            ))}
          </div>

          {/* WHAT COMES OUT OF A SALE */}
          <div className="deduction-grid">
            {DEDUCTIONS.map((d) => {
              const Icon = d.icon;
              return (
                <div key={d.title} className="deduction-card">
                  <span className="deduction-icon">
                    <Icon className="w-[18px] h-[18px]" />
                  </span>
                  <h3 className="deduction-title">{d.title}</h3>
                  <p className="deduction-body">{d.body}</p>
                </div>
              );
            })}
          </div>

          <p className="page-note">
            <Info className="w-4 h-4 shrink-0 text-[#4ED398]" />
            <span>{t.paymentsPage.note}</span>
          </p>
        </div>
      </section>
  );
}

export default function PaymentsPage() {
  return (
    <>
      <PaymentsSection />
      <CreatorBenefitsSection />
      <FinalCtaSection />
    </>
  );
}
