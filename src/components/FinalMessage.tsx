import React from 'react';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface FinalMessageProps {
  finalContentRef: React.RefObject<HTMLDivElement | null>;
}

export const FinalMessage: React.FC<FinalMessageProps> = ({ finalContentRef }) => {
  return (
    <div
      ref={finalContentRef}
      id="snapsell-final-message"
      className="final-product-content absolute inset-0 z-40 flex items-center justify-center px-4 sm:px-8 lg:px-12 pointer-events-none opacity-0 invisible"
      style={{ willChange: 'transform, opacity' }}
    >
      <div className="final-msg-grid">
        
        {/* Left Column Spacer (Phone mockup occupies the left side in desktop grid) */}
        {/* spacer: the phone occupies this column */}
        <div className="final-msg-spacer" aria-hidden="true" />

        {/* Right Column: Final Conversion Copy — presented as a card */}
        <div className="final-message-card">

          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#20B777]/10 border border-[#20B777]/30 text-[#7AE9B4] text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#4ED398]" />
            <span>Instant digital commerce</span>
          </div>

          {/* Main Headline */}
          <h2 
            className="font-display font-bold text-white tracking-[-0.035em] leading-[1.02] max-w-[680px] text-[clamp(28px,3.8vw,58px)]"
            style={{ textShadow: '0 8px 30px rgba(0,0,0,0.8)' }}
          >
            Sell digital content <br className="hidden sm:inline" />
            <span className="emerald-gradient-text">through one secure link</span>
          </h2>

          {/* Body Description */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-300 font-normal leading-relaxed text-balance max-w-xl">
            Upload your photos, videos, PDFs and other digital products. Set your price, share your SnapSell link and start earning directly from your audience.
          </p>

          {/* Payment Badges & Supporting Line */}
          <div className="p-4 rounded-2xl bg-zinc-900/90 border border-white/10 text-xs sm:text-sm text-slate-300 space-y-3 w-full max-w-xl shadow-lg">
            <p className="leading-snug text-slate-300 font-medium">
              Accept payments by card, PayPal, Apple Pay, Google Pay and bank transfer—without building a complicated online store.
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-2 border-t border-white/10 text-[11px] text-[#7AE9B4]/90 font-medium">
              <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10">Card</span>
              <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10">PayPal</span>
              <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10">Apple Pay</span>
              <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10">Google Pay</span>
              <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10">Bank Transfer</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto pt-1">
            <button
              id="final-cta-start"
              type="button"
              className="emerald-pill-btn w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-bold flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Start Selling</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              id="final-cta-how"
              type="button"
              className="glass-pill-btn w-full sm:w-auto px-7 py-3.5 rounded-full text-sm font-semibold cursor-pointer"
            >
              See How It Works
            </button>
          </div>

          {/* Microcopy Guarantee */}
          <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>No monthly subscription. SnapSell only earns when you make a sale.</span>
          </div>

        </div>

      </div>
    </div>
  );
};
