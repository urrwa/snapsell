import React, { useState } from 'react';
import { Mail, MessageCircle, Building2, LifeBuoy, Send, Check } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function ContactPage({ className = '' }: { className?: string }) {
  const [sent, setSent] = useState(false);
  const { t } = useLanguage();

  const CHANNELS = [
    {
      icon: LifeBuoy,
      label: t.contact.badge,
      value: 'support@snapsell.co',
      note: t.contact.info.response,
    },
    {
      icon: Building2,
      label: t.footer.business.headline,
      value: 'business@snapsell.co',
      note: t.contact.info.email,
    },
    {
      icon: MessageCircle,
      label: t.footer.company.links.press,
      value: 'hello@snapsell.co',
      note: t.contact.form.subject,
    },
  ];

  const TOPICS = [t.contact.form.subject, t.payments.features.instantPayout, t.business.headline, t.footer.support.helpCenter];
  const [topic, setTopic] = useState(TOPICS[0]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section id="contact-section" className={`page-section min-h-[calc(100vh-104px)] ${className}`}>
      <div className="page-shell">
        <header className="page-head">
          <span className="page-eyebrow">{t.nav.contact.toUpperCase()}</span>
          <h1 className="page-title">
            {t.contact.headline} <span className="emerald-gradient-text">{t.contact.badge}.</span>
          </h1>
          <p className="page-lede">
            {t.contact.subheadline}
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
                <span className="contact-label">{t.contact.form.name}</span>
                <input type="text" name="name" required placeholder={t.contact.form.namePlaceholder} />
              </label>

              <label className="contact-field">
                <span className="contact-label">{t.contact.form.email}</span>
                <input type="email" name="email" required placeholder={t.contact.form.emailPlaceholder} />
              </label>
            </div>

            <div className="contact-field">
              <span className="contact-label">{t.contact.form.subject}</span>
              <div className="contact-topics">
                {TOPICS.map((tp) => (
                  <button
                    key={tp}
                    type="button"
                    onClick={() => setTopic(tp)}
                    className={`contact-topic ${topic === tp ? 'is-active' : ''}`}
                  >
                    {tp}
                  </button>
                ))}
              </div>
            </div>

            <label className="contact-field">
              <span className="contact-label">{t.contact.form.message}</span>
              <textarea
                name="message"
                rows={5}
                required
                placeholder={t.contact.form.messagePlaceholder}
              />
            </label>

            <button type="submit" className="nav-cta-btn justify-center py-3.5 w-full">
              {sent ? (
                <>
                  <Check className="w-4 h-4" />
                  {t.contact.form.success}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  {t.contact.form.send}
                </>
              )}
            </button>

            <p className="contact-disclaimer">
              <Mail className="w-3.5 h-3.5 shrink-0" />
              {t.contact.info.response}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
