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

const PLANS = [
  {
    id: 'creator',
    name: 'Creator',
    price: '10%',
    unit: 'per sale',
    tagline: 'For individuals selling their own work.',
    featured: true,
    points: [
      'No monthly subscription',
      'Unlimited products and Paid Links',
      'Automatic digital delivery',
      'Sales and earnings dashboard',
      'Payouts on the 1st and 15th',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    price: 'Custom',
    unit: 'volume based',
    tagline: 'For agencies and teams managing multiple creators.',
    featured: false,
    points: [
      'Everything in Creator',
      'Team members and sub-accounts',
      'Centralised management',
      'API access and sale webhooks',
      'Priority support',
    ],
  },
];

const DEDUCTIONS = [
  {
    icon: Percent,
    title: 'Service fee',
    body: 'SnapSell takes 10% of each completed sale. Nothing is charged when you do not sell.',
  },
  {
    icon: CreditCard,
    title: 'Payment processing',
    body: 'The payment provider charges its own processing fee, which varies by method and country.',
  },
  {
    icon: Calendar,
    title: 'Payout schedule',
    body: 'Eligible balances are paid twice monthly, once the minimum payout threshold is met.',
  },
  {
    icon: ShieldCheck,
    title: 'Refunds & chargebacks',
    body: 'Refunded or charged-back orders are reversed, including the associated fees.',
  },
];

/** Pricing + fee breakdown. Used on the Payments page and on the homepage,
 *  where the header's "Payments & Fees" link scrolls to it. */
export function PaymentsSection({ className = '' }: { className?: string }) {
  return (
      <section id="payments-section" className={`page-section ${className}`}>
        <div className="page-shell">
          <header className="page-head">
            <span className="page-eyebrow">PAYMENTS &amp; FEES</span>
            <h1 className="page-title">
              You only pay when <span className="emerald-gradient-text">you get paid.</span>
            </h1>
            <p className="page-lede">
              No monthly subscription for individual creators. SnapSell takes a share of
              completed sales, and nothing at all when you do not sell.
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
                    Most creators
                  </span>
                )}

                <h2 className="pricing-name">{plan.name}</h2>
                <p className="pricing-tagline">{plan.tagline}</p>

                <div className="pricing-figure">
                  <span className="pricing-price">{plan.price}</span>
                  <span className="pricing-unit">{plan.unit}</span>
                </div>

                <ul className="pricing-points">
                  {plan.points.map((p) => (
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
                  {plan.featured ? 'Start Selling' : 'Talk to Sales'}
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
            <span>
              Fees, thresholds and available payment methods depend on your country and
              the supported payment provider. Exact figures are confirmed at checkout and
              in your dashboard.
            </span>
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
