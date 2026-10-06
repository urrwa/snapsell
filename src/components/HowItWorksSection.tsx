import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  UserCheck, 
  UploadCloud, 
  DollarSign, 
  Share2, 
  CheckCircle2, 
  ShieldCheck, 
  Copy, 
  Check, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  FileArchive, 
  ArrowRight,
  Sparkles,
  CreditCard,
  QrCode,
  Zap,
  Globe
} from 'lucide-react';
import { SnapSellLogo } from './SnapSellLogo';

gsap.registerPlugin(ScrollTrigger);

interface StepData {
  number: string;
  title: string;
  description: string;
  badge: string;
  /** Alternating canvas — the section cross-fades between these on scroll */
  theme: 'dark' | 'light';
}

const STEPS: StepData[] = [
  {
    number: '01',
    title: 'Create Your Account',
    description: 'Register as a creator and complete the required identity and account verification.',
    badge: 'Account Setup',
    theme: 'dark',
  },
  {
    number: '02',
    title: 'Upload Your Content',
    description: 'Choose the digital files or collections you want to sell.',
    badge: 'Asset Upload',
    theme: 'light',
  },
  {
    number: '03',
    title: 'Set Your Price',
    description: 'Decide how much customers should pay and configure your product details.',
    badge: 'Pricing & Details',
    theme: 'dark',
  },
  {
    number: '04',
    title: 'Share Your Link',
    description: 'Publish the generated SnapSell link wherever your audience follows or contacts you.',
    badge: 'Distribution',
    theme: 'light',
  },
  {
    number: '05',
    title: 'Get Paid',
    description: 'Customers complete payment through the secure checkout and receive electronic access to their purchased content.',
    badge: 'Fulfillment & Sales',
    theme: 'dark',
  },
];

export function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineWrapperRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([false, false, false, false, false]);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const wrapper = timelineWrapperRef.current;
    if (!wrapper || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Central progress line fill linked to section scroll
      ScrollTrigger.create({
        trigger: wrapper,
        start: 'top 40%',
        end: 'bottom 70%',
        scrub: 0.5,
        onUpdate: (self) => {
          if (progressBarRef.current) {
            progressBarRef.current.style.transform = `scaleY(${self.progress})`;
          }
          
          // Completed steps change only a handful of times across the whole
          // section. Returning the same array when nothing changed lets React
          // skip the re-render — previously a new array every scroll frame
          // re-rendered all five phone mockups ~60 times a second.
          const progress = self.progress;
          const stepRatio = 1 / STEPS.length;
          setCompletedSteps((prev) => {
            const next = prev.map((_, idx) => progress >= (idx + 0.5) * stepRatio);
            return next.every((v, i) => v === prev[i]) ? prev : next;
          });
        },
      });

      // 2. Local ScrollTriggers for each step row reveal & active state
      STEPS.forEach((_, index) => {
        const stepEl = document.getElementById(`timeline-step-row-${index}`);
        const phoneEl = document.getElementById(`phone-mockup-${index}`);
        const textEl = document.getElementById(`step-text-content-${index}`);

        if (stepEl) {
          ScrollTrigger.create({
            trigger: stepEl,
            start: 'top 65%',
            end: 'bottom 35%',
            onToggle: (self) => {
              if (self.isActive) {
                setActiveStepIndex(index);
              }
            },
          });

          // Reveal animations for phone & text
          if (phoneEl && textEl) {
            const isPhoneLeft = index % 2 === 0;

            gsap.fromTo(
              phoneEl,
              {
                x: isPhoneLeft ? -60 : 60,
                opacity: 0.25,
                scale: 0.94,
              },
              {
                x: 0,
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: stepEl,
                  start: 'top 75%',
                  end: 'top 35%',
                  scrub: 0.5,
                },
              }
            );

            gsap.fromTo(
              textEl,
              {
                x: isPhoneLeft ? 60 : -60,
                opacity: 0.25,
              },
              {
                x: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: stepEl,
                  start: 'top 75%',
                  end: 'top 35%',
                  scrub: 0.5,
                },
              }
            );
          }
        }
      });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const handleCopy = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Render individual phone mockup screen
  const renderPhoneScreen = (index: number) => {
    switch (index) {
      case 0:
        return (
          <div className="phone-step-content flex flex-col justify-between h-full pt-1">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#20B777]/10 border border-[#20B777]/25 text-[#4ED398]">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Create Creator Account</h4>
                  <p className="text-[9px] text-slate-400">Verify identity & start selling</p>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <div>
                  <label className="text-[9px] text-slate-400 block mb-0.5">Creator Name</label>
                  <div className="w-full bg-zinc-900 border border-white/15 rounded-lg px-2.5 py-1.5 text-[10px] text-white flex items-center justify-between">
                    <span>Alex Rivers</span>
                    <CheckCircle2 className="w-3 h-3 text-[#7AE9B4]" />
                  </div>
                </div>
                <div>
                  <label className="text-[9px] text-slate-400 block mb-0.5">Work Email</label>
                  <div className="w-full bg-zinc-900 border border-white/15 rounded-lg px-2.5 py-1.5 text-[10px] text-white flex items-center justify-between">
                    <span>alex@creator.co</span>
                    <CheckCircle2 className="w-3 h-3 text-[#7AE9B4]" />
                  </div>
                </div>
                <div>
                  <label className="text-[9px] text-slate-400 block mb-0.5">Country / Region</label>
                  <div className="w-full bg-zinc-900 border border-white/15 rounded-lg px-2.5 py-1.5 text-[10px] text-slate-300 flex items-center justify-between">
                    <span>United States (USD $)</span>
                    <Globe className="w-3 h-3 text-[#4ED398]" />
                  </div>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-[#20B777]/10 border border-[#20B777]/20 text-[#7AE9B4] flex items-center gap-2 text-[9.5px]">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Identity Verified & Payout Eligible</span>
              </div>
            </div>

            <button type="button" className="emerald-pill-btn w-full py-2 rounded-xl text-[10.5px] font-bold shadow-md flex items-center justify-center gap-1.5">
              <span>Continue Setup</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        );

      case 1:
        return (
          <div className="phone-step-content flex flex-col justify-between h-full pt-1">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#20B777]/10 border border-[#20B777]/25 text-[#4ED398]">
                  <UploadCloud className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Upload Digital Files</h4>
                  <p className="text-[9px] text-slate-400">Photos, Videos, PDFs, ZIPs</p>
                </div>
              </div>

              <div className="border-2 border-dashed border-[#20B777]/30 bg-[#20B777]/5 rounded-xl p-3 text-center space-y-1.5">
                <UploadCloud className="w-6 h-6 text-[#4ED398] mx-auto animate-bounce" />
                <p className="text-[10px] font-semibold text-slate-200">Drop files or click to select</p>
                <div className="flex items-center justify-center gap-2 text-[8px] text-slate-400">
                  <span className="px-1.5 py-0.5 rounded bg-zinc-800 border border-white/10 flex items-center gap-0.5"><ImageIcon className="w-2.5 h-2.5" /> RAW</span>
                  <span className="px-1.5 py-0.5 rounded bg-zinc-800 border border-white/10 flex items-center gap-0.5"><Video className="w-2.5 h-2.5" /> MP4</span>
                  <span className="px-1.5 py-0.5 rounded bg-zinc-800 border border-white/10 flex items-center gap-0.5"><FileText className="w-2.5 h-2.5" /> PDF</span>
                  <span className="px-1.5 py-0.5 rounded bg-zinc-800 border border-white/10 flex items-center gap-0.5"><FileArchive className="w-2.5 h-2.5" /> ZIP</span>
                </div>
              </div>

              <div className="p-2 bg-zinc-900 border border-white/10 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between text-[9.5px]">
                  <span className="font-semibold text-slate-200 truncate max-w-[140px]">Creator_Photo_Collection.zip</span>
                  <span className="text-[#7AE9B4] font-bold">100% Uploaded</span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#20B777] h-full w-full rounded-full" />
                </div>
              </div>

              {/* Content Preview */}
              <div>
                <p className="text-[8px] font-semibold text-slate-400 uppercase tracking-widest mb-1 px-0.5">Content Preview</p>
                <div className="relative w-full rounded-xl overflow-hidden border-2 border-[#20B777]/50 shadow-[0_0_14px_rgba(32,183,119,0.18)]" style={{aspectRatio:'3/4', maxHeight:'130px'}}>
                  <img
                    src="images/product-fashion-v2.webp"
                    alt="Creator Photo Collection preview"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-top"
                  />
                  {/* Bottom gradient + title */}
                  <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />
                  <div className="absolute bottom-0 inset-x-0 px-2 pb-1.5 z-10">
                    <span className="text-[8.5px] font-bold text-white/95 tracking-tight leading-tight">Creator Photo Collection</span>
                  </div>
                  {/* Uploaded badge */}
                  <div className="absolute top-1.5 right-1.5 z-10 px-1.5 py-0.5 rounded-md bg-[#20B777]/90 text-[7px] font-bold text-white shadow-sm">
                    Uploaded ✓
                  </div>
                </div>
              </div>
            </div>

            <button type="button" className="emerald-pill-btn w-full py-2 rounded-xl text-[10.5px] font-bold shadow-md flex items-center justify-center gap-1.5">
              <span>Configure Product</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        );

      case 2:
        return (
          <div className="phone-step-content flex flex-col justify-between h-full pt-1 pb-0.5 gap-1.5">
            <div className="space-y-2 flex-1 flex flex-col justify-between min-h-0">
              {/* ── Creator Photo Collection Cover ─────────── */}
              <div className="relative w-full aspect-[16/9.5] rounded-xl sm:rounded-2xl overflow-hidden border-2 border-[#20B777]/40 shadow-[0_0_15px_rgba(32,183,119,0.2)] bg-zinc-950 shrink-0">

                <img
                  src="images/product-fashion-v2.webp"
                  alt="Creator Photo Collection"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />

                {/* ── Top-left badge ── */}
                <div className="absolute top-2 left-2 z-10">
                  <div className="px-2 py-0.5 rounded-md bg-black/75 border border-[#20B777]/40 text-[#7AE9B4] text-[8.5px] font-bold flex items-center gap-1 shadow-sm">
                    <CheckCircle2 className="w-2.5 h-2.5 text-[#4ED398]" />
                    <span>Content Uploaded</span>
                  </div>
                </div>

                {/* ── Bottom gradient + title + badges ── */}
                <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/90 via-black/55 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 inset-x-0 px-2 pb-1.5 z-10 flex flex-col gap-0.5">
                  <span className="text-[9px] font-bold text-white/95 tracking-tight leading-tight truncate">Creator Photo Collection</span>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[8px] text-white/60 truncate max-w-[110px]">Creator_Photo_Collection.zip</span>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="px-1.5 py-0.5 rounded-md bg-black/80 border border-white/15 text-[7.5px] font-semibold text-[#7AE9B4]">Photo Pack</span>
                      <span className="px-1.5 py-0.5 rounded-md bg-[#20B777]/20 border border-[#20B777]/30 text-[7px] font-semibold text-[#7AE9B4]">Digital · ZIP</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing & Product Info Section Header */}
              <div className="flex items-center gap-2 shrink-0 pt-0.5">
                <div className="p-1.5 rounded-lg bg-[#20B777]/10 border border-[#20B777]/25 text-[#4ED398] shrink-0">
                  <DollarSign className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white leading-tight truncate">Pricing & Product Info</h4>
                  <p className="text-[9px] text-slate-400 truncate">Set price and customer access</p>
                </div>
              </div>

              {/* Input Fields */}
              <div className="space-y-1.5 shrink-0">
                <div>
                  <label className="text-[8.5px] text-slate-400 block mb-0.5">Product Title</label>
                  <div className="w-full bg-zinc-900 border border-white/15 rounded-xl px-2.5 py-1.5 text-[9.5px] text-white truncate">
                    Master Creator LUTs & Presets
                  </div>
                </div>

                <div>
                  <label className="text-[8.5px] text-slate-400 block mb-0.5">Selling Price</label>
                  <div className="w-full bg-zinc-900/90 border-2 border-[#20B777]/60 shadow-[0_0_12px_rgba(32,183,119,0.22)] rounded-xl px-3 py-1.5 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#7AE9B4] font-bold">$ USD</span>
                    <span className="text-sm font-extrabold text-white">29.00</span>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-zinc-900/80 border border-white/10 flex items-center justify-between text-[9px]">
                  <span className="text-slate-300">Automated File Access</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#20B777]/20 text-[#7AE9B4] font-bold border border-[#20B777]/30 text-[8.5px]">
                    Instant
                  </span>
                </div>
              </div>
            </div>

            <button type="button" className="emerald-pill-btn w-full py-2 rounded-xl text-[10.5px] font-bold shadow-md flex items-center justify-center gap-1.5 shrink-0 mt-0.5">
              <span>Generate SnapSell Link</span>
              <Zap className="w-3.5 h-3.5" />
            </button>
          </div>
        );

      case 3:
        return (
          <div className="phone-step-content flex flex-col justify-between h-full pt-1">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#20B777]/10 border border-[#20B777]/25 text-[#4ED398]">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Distribute Product Link</h4>
                  <p className="text-[9px] text-slate-400">Share on bio, chat or website</p>
                </div>
              </div>

              <div className="p-2.5 bg-zinc-900 border border-[#20B777]/25 rounded-xl space-y-2">
                <span className="text-[8.5px] font-bold uppercase tracking-wider text-[#7AE9B4]">
                  Your Public Purchase Link
                </span>
                <div className="flex items-center justify-between gap-2 bg-black border border-white/15 rounded-lg px-2 py-1.5">
                  <span className="text-[9.5px] font-mono text-slate-200 truncate">
                    snapsell.link/alex-luts
                  </span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="px-2 py-1 rounded bg-[#20B777] text-zinc-950 text-[9px] font-bold flex items-center gap-1 shrink-0 hover:bg-[#4ED398] transition-colors"
                  >
                    {copiedLink ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[8.5px] text-slate-400 block">Optimized for audience channels:</span>
                <div className="grid grid-cols-3 gap-1.5 text-[8.5px] text-slate-300 font-medium">
                  <div className="p-1.5 rounded-lg bg-zinc-900 border border-white/10 text-center">Instagram Bio</div>
                  <div className="p-1.5 rounded-lg bg-zinc-900 border border-white/10 text-center">TikTok / X</div>
                  <div className="p-1.5 rounded-lg bg-zinc-900 border border-white/10 text-center">YouTube / Web</div>
                </div>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-[#20B777]/10 border border-[#20B777]/20 text-center text-[9.5px] text-[#7AE9B4] font-semibold flex items-center justify-center gap-1.5">
              <QrCode className="w-3.5 h-3.5" />
              <span>Ready for Instant Orders</span>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="phone-step-content flex flex-col justify-between h-full pt-1">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Payment & Fulfillment</h4>
                  <p className="text-[9px] text-slate-400">Order completed & access sent</p>
                </div>
              </div>

              <div className="p-2.5 bg-gradient-to-br from-emerald-950/60 to-zinc-900 border border-emerald-500/30 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-[9.5px]">
                  <span className="font-bold text-emerald-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> New Sale Received
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">+$29.00</span>
                </div>
                <p className="text-[8.5px] text-slate-300">
                  Customer paid via Apple Pay. Digital files delivered securely.
                </p>
              </div>

              <div className="p-2 bg-zinc-900 border border-white/10 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between text-[9px] text-slate-400">
                  <span>Available Earnings Balance</span>
                  <span className="text-[#7AE9B4] font-bold">Updated Now</span>
                </div>
                <div className="text-base font-extrabold text-white font-mono">
                  $1,480.00
                </div>
                <div className="flex items-center justify-between text-[8px] text-slate-400 pt-1 border-t border-white/10">
                  <span>Payout Schedule: Auto-Scheduled</span>
                  <span className="text-emerald-400 font-semibold">Active</span>
                </div>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-center text-[10px] font-bold flex items-center justify-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Instant Access & Verified Delivery</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Render standardized Phone Mockup Container
  const renderPhoneMockup = (stepIndex: number) => {
    const isActive = activeStepIndex === stepIndex;

    return (
      <div
        id={`phone-mockup-${stepIndex}`}
        className={`hiw-phone phone-wrapper relative w-[270px] sm:w-[310px] md:w-[340px] aspect-[9/18] rounded-[42px] p-3 overflow-hidden mx-auto ${
          isActive ? 'is-active' : ''
        }`}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-4.5 bg-black rounded-b-xl z-30 flex items-center justify-center">
          <div className="w-8 h-1 rounded-full bg-zinc-800" />
        </div>

        {/* Inner Mask */}
        <div className="phone-screen-mask relative w-full h-full rounded-[32px] bg-black overflow-hidden border border-white/10 flex flex-col justify-between pt-5 pb-3 px-3 z-10">
          {/* Phone Header */}
          <div className="phone-ui-header relative z-20 pb-2 border-b border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <SnapSellLogo className="h-3.5 w-auto max-w-[65px] object-contain" />
              <span className="text-[9.5px] font-semibold text-slate-300 truncate">
                {STEPS[stepIndex].badge}
              </span>
            </div>
            <span className="text-[8.5px] px-2 py-0.5 rounded-full bg-[#20B777]/15 text-[#7AE9B4] font-bold border border-[#20B777]/25 shrink-0">
              STEP {STEPS[stepIndex].number}
            </span>
          </div>

          {/* Screen Content */}
          <div className="phone-screen-content relative flex-1 my-2 overflow-hidden">
            {renderPhoneScreen(stepIndex)}
          </div>

          {/* Bottom Bar */}
          <div className="w-20 h-1 bg-zinc-700 rounded-full mx-auto shrink-0 mt-1" />
        </div>

        {/* Outer Highlight Overlay */}
        <div className="phone-frame-overlay absolute inset-0 rounded-[42px] border border-white/10 pointer-events-none" />
      </div>
    );
  };

  // Render Step Text Block
  const renderStepContent = (stepIndex: number) => {
    const step = STEPS[stepIndex];
    const isActive = activeStepIndex === stepIndex;

    return (
      <div
        id={`step-text-content-${stepIndex}`}
        className={`hiw-content ${isActive ? 'is-active' : ''}`}
      >
        {/* oversized ghost numeral behind the copy */}
        <span className="hiw-ghost-num" aria-hidden="true">{step.number}</span>

        <div className="hiw-meta">
          <span className="hiw-step-label">STEP {step.number}</span>
          <span className="hiw-badge">{step.badge}</span>
          {isActive && (
            <span className="hiw-current">
              <span className="hiw-current-dot" />
              Current
            </span>
          )}
        </div>

        <h3 className="hiw-title">{step.title}</h3>

        <p className="hiw-desc">{step.description}</p>

        <span className="hiw-rule" aria-hidden="true" />
      </div>
    );
  };

  return (
    <section
      ref={sectionRef}
      id="how-it-works-section"
      data-theme={STEPS[activeStepIndex]?.theme ?? 'dark'}
      className="how-it-works-section relative w-full py-20 sm:py-32 overflow-hidden"
    >
      {/* Light canvas: fades in over the dark one (opacity only — cheap) */}
      <div className="hiw-paper" aria-hidden="true" />

      {/* Ambient glow — belongs to the dark canvas only */}
      <div className="hiw-glow absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full pointer-events-none" />

      {/* SECTION HEADER */}
      <header className="how-it-works-header max-w-4xl mx-auto px-4 sm:px-6 text-center mb-16 sm:mb-28 relative z-10">
        <span className="hiw-eyebrow">HOW IT WORKS</span>
        <h2 className="hiw-heading">From Upload to Income in Minutes</h2>
      </header>

      {/* TIMELINE WRAPPER WITH CENTER LINE */}
      <div
        ref={timelineWrapperRef}
        className="timeline-wrapper relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* CENTER VERTICAL TIMELINE LINE */}
        <div className="hiw-line timeline-line absolute top-0 bottom-0 left-6 lg:left-1/2 w-0.5 -translate-x-1/2 z-0">
          <div
            ref={progressBarRef}
            className="hiw-progress timeline-progress absolute top-0 left-0 w-full h-full origin-top"
            style={{ transform: 'scaleY(0)' }}
          />
        </div>

        {/* 5 TIMELINE STEPS ROW BY ROW */}
        <div className="space-y-24 sm:space-y-36 lg:space-y-44 relative z-10">
          {STEPS.map((_, index) => {
            const isPhoneLeft = index % 2 === 0;
            const isActive = activeStepIndex === index;
            const isCompleted = completedSteps[index];

            return (
              <article
                key={index}
                id={`timeline-step-row-${index}`}
                className="timeline-step-row relative min-h-[70vh] sm:min-h-[80vh] flex flex-col justify-center"
              >
                {/* DESKTOP ALTERNATING GRID (3-COLUMNS: Left, Center, Right) */}
                <div className="hidden lg:grid grid-cols-[1fr_80px_1fr] items-center gap-8 w-full">
                  
                  {/* LEFT SIDE: Phone or Text */}
                  <div className="timeline-side timeline-left flex justify-end">
                    {isPhoneLeft ? renderPhoneMockup(index) : renderStepContent(index)}
                  </div>

                  {/* CENTER MARKER */}
                  <div className="timeline-center flex justify-center items-center">
                    <div
                      className={`hiw-marker ${isActive ? 'is-active' : ''} ${
                        isCompleted ? 'is-done' : ''
                      }`}
                    >
                      {isActive && <span className="hiw-marker-ping" />}
                    </div>
                  </div>

                  {/* RIGHT SIDE: Text or Phone */}
                  <div className="timeline-side timeline-right flex justify-start">
                    {isPhoneLeft ? renderStepContent(index) : renderPhoneMockup(index)}
                  </div>

                </div>

                {/* MOBILE / TABLET LAYOUT (Left Vertical Line with Content on Right) */}
                <div className="lg:hidden pl-12 sm:pl-16 relative">
                  {/* Mobile Marker aligned with left line */}
                  <div
                    className={`hiw-marker hiw-marker--mobile absolute left-0 top-6 -translate-x-1/2 ${
                      isActive ? 'is-active' : ''
                    } ${isCompleted ? 'is-done' : ''}`}
                  />

                  {/* Mobile Content Stack (Text then Phone) */}
                  <div className="space-y-8">
                    {renderStepContent(index)}
                    <div className="pt-2">{renderPhoneMockup(index)}</div>
                  </div>
                </div>

              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
