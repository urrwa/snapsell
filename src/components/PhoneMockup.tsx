import React, { useState } from 'react';
import { PRODUCTS } from '../data/productData';
import { SnapSellLogo } from './SnapSellLogo';
import { ProductCover } from './ProductCover';
import { Copy, Check, Share2, Lock, DollarSign, TrendingUp, Sparkles } from 'lucide-react';

interface PhoneMockupProps {
  phoneStageRef: React.RefObject<HTMLDivElement | null>;
  phoneScreenMaskRef: React.RefObject<HTMLDivElement | null>;
  phoneInterfaceRef: React.RefObject<HTMLDivElement | null>;
  internalCardStackRef?: React.RefObject<HTMLDivElement | null>;
  spotlightRef?: React.RefObject<HTMLDivElement | null>;
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  phoneStageRef,
  phoneScreenMaskRef,
  phoneInterfaceRef,
  internalCardStackRef,
  spotlightRef,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://snapsell.co/p/d7f9a2');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      ref={phoneStageRef}
      id="snapsell-phone-stage"
      className="phone-stage absolute inset-0 z-25 grid place-items-center pointer-events-none p-4"
      style={{ willChange: 'transform, opacity' }}
    >
      <div
        id="snapsell-phone-wrapper"
        className="phone-wrapper relative w-[clamp(270px,23vw,410px)] aspect-[9/19.5] max-h-[min(78vh,820px)]"
      >
        {/* LOCALIZED WHITE SPOTLIGHT BEHIND PHONE */}
        <div
          ref={spotlightRef}
          id="phone-spotlight"
          className="phone-spotlight"
          aria-hidden="true"
        />

        {/* Outer Phone Metallic Frame */}
        <div className="phone-metallic-frame relative w-full h-full p-3 sm:p-3.5 flex flex-col justify-between overflow-hidden shadow-2xl">
          
          {/* Top Speaker / Notch Pill */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 sm:w-24 h-4 sm:h-5 bg-black/95 rounded-full z-40 border border-white/10 flex items-center justify-center gap-2 px-2 shadow-inner pointer-events-none">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-700/80" />
            <div className="w-8 h-1 rounded-full bg-zinc-800" />
          </div>

          {/* Inner Phone Screen Mask */}
          <div
            ref={phoneScreenMaskRef}
            id="phone-screen-mask"
            className="phone-screen-mask relative w-full h-full rounded-[34px] sm:rounded-[38px] overflow-hidden bg-[#050508] border border-white/10 flex flex-col justify-between pt-7 sm:pt-8 pb-3 px-3 sm:px-4 select-none z-10"
            style={{
              clipPath: 'inset(0 round 34px)',
              contain: 'paint',
              isolation: 'isolate',
            }}
          >
            {/* Phone Screen Background Glow */}
            <div className="phone-screen-background absolute inset-0 bg-[radial-gradient(circle,rgba(32,183,119,0.12)_0%,rgba(12,18,16,0.8)_50%,black_100%)] z-0 pointer-events-none" />

            {/* TOP BAR / APP HEADER */}
            <div className="phone-ui-header relative z-20 pb-2 sm:pb-2.5 flex items-center justify-between border-b border-white/10 shrink-0">
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <SnapSellLogo className="phone-header-logo h-3.5 sm:h-4 w-auto max-w-[70px] sm:max-w-[90px] object-contain" />
                <span className="phone-header-title text-[10px] sm:text-xs font-semibold text-slate-300">Store</span>
              </div>
              <div className="phone-header-status flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#20B777]/10 border border-[#20B777]/25 text-[#7AE9B4] text-[9px] sm:text-[10px] font-bold shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ED398] animate-pulse" />
                Live Link
              </div>
            </div>

            {/* MAIN CONTENT AREA: IMAGE CARD + DETAILS + METRICS + CTA */}
            <div className="phone-main-content relative z-10 flex-1 flex flex-col justify-between py-2 sm:py-2.5 gap-2 sm:gap-2.5 min-h-0">

              {/* MIDDLE SECTION: PRODUCT IMAGE CARD */}
              <div 
                ref={internalCardStackRef}
                id="internal-card-stack"
                className="internal-card-stack relative z-10 w-full shrink-0 my-0.5 pointer-events-auto opacity-0"
                style={{ willChange: 'transform, opacity' }}
              >
                <div className="relative w-full aspect-[16/10] sm:aspect-[16/9.5] rounded-xl sm:rounded-2xl overflow-hidden border border-[#20B777]/35 shadow-lg bg-zinc-950">
                  {PRODUCTS.map((prod, idx) => {
                    const isFrontCard = idx === 0;
                    return (
                      <div
                        key={`internal-${prod.id}`}
                        className={`internal-card-item internal-card-${idx} absolute inset-0 rounded-xl sm:rounded-2xl overflow-hidden`}
                        style={{
                          zIndex: isFrontCard ? 10 : 5 - idx,
                          opacity: isFrontCard ? 1 : 0,
                          visibility: isFrontCard ? 'visible' : 'hidden',
                        }}
                      >
                        {prod.photo ? (
                          <img
                            src={prod.photo}
                            alt={prod.alt}
                            draggable={false}
                            decoding="async"
                            loading="lazy"
                            className="w-full h-full block object-cover"
                            style={{ objectPosition: prod.photoPositionPhone ?? 'center' }}
                          />
                        ) : (
                          <ProductCover
                            variant={prod.cover}
                            uid={`phone-${prod.id}`}
                            className="w-full h-full block"
                          />
                        )}
                        {/* Soft Gradient overlay - preserving face clarity while keeping top badges readable */}
                        <div 
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0.02) 30%, rgba(0, 0, 0, 0.50) 100%)'
                          }}
                        />
                        
                        {/* Image Badges: Product type badge (JPG) + Featured badge */}
                        <div className="absolute top-2 sm:top-2.5 left-2 sm:left-2.5 right-2 sm:right-2.5 flex items-center justify-between z-10">
                          <span className="px-2 py-0.5 rounded-full bg-black/65 backdrop-blur-md border border-[#20B777]/35 text-[9px] sm:text-[10px] font-extrabold text-[#7AE9B4]">
                            {prod.type}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-[#20B777]/20 backdrop-blur-md text-[#7AE9B4] text-[9px] sm:text-[10px] font-bold border border-[#20B777]/30 flex items-center gap-1 shadow-sm">
                            <Sparkles className="w-2.5 h-2.5 text-[#4ED398]" />
                            Featured
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* BOTTOM SECTION: SNAPSELL INTERFACE CONTROLS */}
              <div 
                ref={phoneInterfaceRef}
                id="snapsell-phone-interface"
                className="snapsell-interface relative z-20 flex flex-col gap-2 sm:gap-2.5 flex-1 justify-between shrink-0 pointer-events-auto opacity-0"
                style={{ willChange: 'transform, opacity' }}
              >
                {/* Product Info & Details Card */}
                <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-zinc-900/90 border border-white/10 backdrop-blur-md flex flex-col gap-2 shadow-xl">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate leading-tight">Noir Photography Vault</h4>
                      <p className="text-[9px] sm:text-[10px] text-[#7AE9B4]/80 font-medium truncate mt-0.5">48 Exclusive RAW Files</p>
                    </div>
                    <span className="text-xs sm:text-sm font-extrabold text-[#7AE9B4] bg-[#20B777]/15 px-2.5 py-1 rounded-lg border border-[#20B777]/30 shrink-0 shadow-sm">
                      $29
                    </span>
                  </div>

                  {/* Instant Share Link Box */}
                  <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-black/80 border border-white/10 text-[10px] sm:text-[11px] text-slate-300">
                    <Lock className="w-3 h-3 text-[#4ED398] shrink-0 ml-0.5" />
                    <span className="truncate text-[10px] font-mono text-slate-300 flex-1">snapsell.co/p/d7f9a2</span>
                    <button
                      id="phone-copy-btn"
                      type="button"
                      onClick={handleCopyLink}
                      className="px-2 py-0.5 sm:py-1 rounded-md bg-white/10 hover:bg-white/20 text-white font-medium text-[10px] flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
                    >
                      {copied ? <Check className="w-3 h-3 text-[#7AE9B4]" /> : <Copy className="w-3 h-3 text-[#4ED398]" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Sales & Earnings Metrics */}
                <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                  <div className="p-2 sm:p-2.5 rounded-xl bg-zinc-900/80 border border-white/10 flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[#20B777]/10 text-[#4ED398] shrink-0 border border-[#20B777]/20">
                      <TrendingUp className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[8px] sm:text-[9px] text-slate-400 font-medium block">Sales</span>
                      <span className="text-[10px] sm:text-xs font-bold text-white truncate block">142 Sales</span>
                    </div>
                  </div>

                  <div className="p-2 sm:p-2.5 rounded-xl bg-zinc-900/80 border border-white/10 flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[#20B777]/10 text-[#7AE9B4] shrink-0 border border-[#20B777]/20">
                      <DollarSign className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[8px] sm:text-[9px] text-slate-400 font-medium block">Earned</span>
                      <span className="text-[10px] sm:text-xs font-bold text-[#7AE9B4] truncate block">$4,118</span>
                    </div>
                  </div>
                </div>

                {/* Share Product Link CTA Button */}
                <button
                  id="phone-share-action"
                  type="button"
                  className="emerald-pill-btn w-full py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-2 shadow-lg cursor-pointer text-zinc-950"
                >
                  <Share2 className="w-3.5 h-3.5 text-zinc-950" />
                  <span>Share Product Link</span>
                </button>
              </div>

            </div>

          </div>

          {/* Home Bar Indicator */}
          <div className="w-28 sm:w-32 h-1 bg-white/30 rounded-full mx-auto my-1 z-40" />

        </div>
      </div>
    </div>
  );
};
