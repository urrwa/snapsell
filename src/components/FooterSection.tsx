import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Mail } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function FooterSection() {
  const footerRef = useRef<HTMLElement>(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const footerEl = footerRef.current;
    if (!footerEl || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.footer-anim-item',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footerEl,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, footerEl);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      id="site-footer"
      ref={footerRef}
      className="site-footer relative w-full bg-[#020204] bg-grain text-white pt-20 pb-8 sm:pt-28 sm:pb-12 px-4 sm:px-6 lg:px-12 border-t border-white/10 overflow-hidden"
    >
      {/* Background Subtle Warm Gold Glow at Top Center */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[radial-gradient(ellipse_at_top,rgba(235,206,100,0.08)_0%,rgba(193,156,50,0.02)_50%,transparent_70%)] pointer-events-none rounded-full" />

      <div className="footer-container relative z-10 w-full max-w-[1420px] mx-auto">
        
        {/* Main Grid Section */}
        <div className="footer-main grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[minmax(260px,1.35fr)_minmax(130px,0.65fr)_minmax(150px,0.75fr)_minmax(130px,0.6fr)_minmax(260px,1.15fr)] gap-10 lg:gap-12 xl:gap-16 items-start pb-16 border-b border-white/10">
          
          {/* Brand Column */}
          <div className="footer-anim-item space-y-4 md:col-span-2 lg:col-span-1">
            <a href="#hero" className="inline-block transition-opacity hover:opacity-90">
              <img
                src="https://res.cloudinary.com/dpwfzo2vk/image/upload/v1785158302/Webforge_iwgtmf.png"
                alt="SnapSell"
                className="h-9 sm:h-10 w-auto object-contain"
              />
            </a>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-[330px]">
              Built for creators. Upload digital content, share a link and get paid.
            </p>
          </div>

          {/* Product Links Column */}
          <nav className="footer-anim-item space-y-4" aria-label="Product links">
            <h3 className="text-white text-sm font-bold tracking-tight uppercase flex items-center gap-1.5">
              <span>Product</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#20B777] inline-block" />
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#how-it-works" className="text-slate-400 hover:text-[#7AE9B4] inline-block transition-all duration-200 hover:translate-x-1">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#payments" className="text-slate-400 hover:text-[#7AE9B4] inline-block transition-all duration-200 hover:translate-x-1">
                  Payments &amp; Fees
                </a>
              </li>
              <li>
                <a href="#business-accounts" className="text-slate-400 hover:text-[#7AE9B4] inline-block transition-all duration-200 hover:translate-x-1">
                  Business Accounts
                </a>
              </li>
              <li>
                <a href="#api-docs" className="text-slate-400 hover:text-[#7AE9B4] inline-block transition-all duration-200 hover:translate-x-1">
                  API Documentation
                </a>
              </li>
              <li>
                <a href="#login" className="text-slate-400 hover:text-[#7AE9B4] inline-block transition-all duration-200 hover:translate-x-1">
                  Log In
                </a>
              </li>
            </ul>
          </nav>

          {/* Help Links Column */}
          <nav className="footer-anim-item space-y-4" aria-label="Help links">
            <h3 className="text-white text-sm font-bold tracking-tight uppercase flex items-center gap-1.5">
              <span>Help</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#20B777] inline-block" />
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#/contact" className="text-slate-400 hover:text-[#7AE9B4] inline-block transition-all duration-200 hover:translate-x-1">
                  Contact Support
                </a>
              </li>
              <li>
                <a href="#delivery-access" className="text-slate-400 hover:text-[#7AE9B4] inline-block transition-all duration-200 hover:translate-x-1">
                  Delivery and Access
                </a>
              </li>
              <li>
                <a href="#refund-policy" className="text-slate-400 hover:text-[#7AE9B4] inline-block transition-all duration-200 hover:translate-x-1">
                  Refund Policy
                </a>
              </li>
              <li>
                <a href="#dmca" className="text-slate-400 hover:text-[#7AE9B4] inline-block transition-all duration-200 hover:translate-x-1">
                  Copyright and DMCA
                </a>
              </li>
            </ul>
          </nav>

          {/* Legal Links Column */}
          <nav className="footer-anim-item space-y-4" aria-label="Legal links">
            <h3 className="text-white text-sm font-bold tracking-tight uppercase flex items-center gap-1.5">
              <span>Legal</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#20B777] inline-block" />
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#terms" className="text-slate-400 hover:text-[#7AE9B4] inline-block transition-all duration-200 hover:translate-x-1">
                  Terms of Use
                </a>
              </li>
              <li>
                <a href="#privacy" className="text-slate-400 hover:text-[#7AE9B4] inline-block transition-all duration-200 hover:translate-x-1">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#cookies" className="text-slate-400 hover:text-[#7AE9B4] inline-block transition-all duration-200 hover:translate-x-1">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </nav>

          {/* Contact Column */}
          <div className="footer-anim-item space-y-4">
            <h3 className="text-white text-sm font-bold tracking-tight uppercase flex items-center gap-1.5">
              <span>Contact</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#20B777] inline-block" />
            </h3>
            
            <div className="space-y-4 text-sm">
              <div className="space-y-1">
                <span className="text-xs text-slate-500 font-medium block">General questions:</span>
                <a
                  href="mailto:info@snapsell.org"
                  className="text-slate-200 hover:text-[#7AE9B4] font-semibold inline-flex items-center gap-1.5 transition-colors break-all"
                >
                  <Mail className="w-3.5 h-3.5 text-[#4ED398] shrink-0" />
                  <span>info@snapsell.org</span>
                </a>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-500 font-medium block">Support, billing, payouts and refunds:</span>
                <a
                  href="mailto:support@snapsell.org"
                  className="text-slate-200 hover:text-[#7AE9B4] font-semibold inline-flex items-center gap-1.5 transition-colors break-all"
                >
                  <Mail className="w-3.5 h-3.5 text-[#4ED398] shrink-0" />
                  <span>support@snapsell.org</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bottom Row */}
        <div className="footer-anim-item pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {currentYear} SnapSell. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-6">
            <a href="#terms" className="hover:text-[#7AE9B4] transition-colors">
              Terms of Use
            </a>
            <a href="#privacy" className="hover:text-[#7AE9B4] transition-colors">
              Privacy Policy
            </a>
            <a href="#cookies" className="hover:text-[#7AE9B4] transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
