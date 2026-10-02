import React, { useState } from 'react';
import { Mail, MessageCircle, Building2, LifeBuoy, Send, Check } from 'lucide-react';

const CHANNELS = [
  {
    icon: LifeBuoy,
    label: 'Creator support',
    value: 'support@snapsell.co',
    note: 'Account, payouts and delivery questions.',
  },
  {
    icon: Building2,
    label: 'Business & agencies',
    value: 'business@snapsell.co',
    note: 'Team accounts, API access and volume pricing.',
  },
  {
    icon: MessageCircle,
    label: 'Press & partnerships',
    value: 'hello@snapsell.co',
    note: 'Media requests and collaborations.',
  },
];

const TOPICS = ['General question', 'Payouts', 'Business account', 'Technical issue'];

export default function ContactPage({ className = '' }: { className?: string }) {
  const [sent, setSent] = useState(false);
  const [topic, setTopic] = useState(TOPICS[0]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Front-end only — no backend is wired up on this build.
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section id="contact-section" className={`page-section ${className}`}>
      <div className="page-shell">
        <header className="page-head">
          <span className="page-eyebrow">CONTACT</span>
          <h1 className="page-title">
            Talk to <span className="emerald-gradient-text">a human.</span>
          </h1>
          <p className="page-lede">
            Questions about selling, payouts or setting up a business account — send a
            note and the right person will pick it up.
          </p>
        </header>

        <div className="contact-grid">
          {/* Channels */}
          <div className="contact-channels">
            {CHANNELS.map((c) => {
              const Icon = c.icon;
              return (
                <a key={c.label} href={`mailto:${c.value}`} className="contact-channel">
                  <span className="contact-channel-icon">
                    <Icon className="w-[18px] h-[18px]" />
                  </span>
                  <span className="min-w-0">
                    <span className="contact-channel-label">{c.label}</span>
                    <span className="contact-channel-value">{c.value}</span>
                    <span className="contact-channel-note">{c.note}</span>
                  </span>
                </a>
              );
            })}
          </div>

          {/* Form */}
          <form className="contact-form" onSubmit={onSubmit}>
            <div className="contact-row">
              <label className="contact-field">
                <span className="contact-label">Name</span>
                <input type="text" name="name" required placeholder="Alex Rivers" />
              </label>

              <label className="contact-field">
                <span className="contact-label">Email</span>
                <input type="email" name="email" required placeholder="alex@creator.co" />
              </label>
            </div>

            <div className="contact-field">
              <span className="contact-label">Topic</span>
              <div className="contact-topics">
                {TOPICS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTopic(t)}
                    className={`contact-topic ${topic === t ? 'is-active' : ''}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <label className="contact-field">
              <span className="contact-label">Message</span>
              <textarea
                name="message"
                rows={5}
                required
                placeholder="Tell us what you're trying to do…"
              />
            </label>

            <button type="submit" className="nav-cta-btn justify-center py-3.5 w-full">
              {sent ? (
                <>
                  <Check className="w-4 h-4" />
                  Message sent
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send message
                </>
              )}
            </button>

            <p className="contact-disclaimer">
              <Mail className="w-3.5 h-3.5 shrink-0" />
              This form is front-end only in this build — no backend is connected yet.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
