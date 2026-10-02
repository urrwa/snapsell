import React from 'react';

/**
 * Self-contained cover artwork for product cards.
 *
 * These are drawn as inline SVG rather than loaded as photos so the cards
 * always render — no external host, no broken-image state, nothing to
 * rate-limit. Each variant is an abstract, business-flavoured composition
 * tuned to the product type it sits on.
 */

export type CoverVariant =
  | 'editorial'   // fashion / photography
  | 'cinematic'   // video / LUTs
  | 'blueprint'   // strategy / documents
  | 'playbook'    // e-book / guide
  | 'facet'       // 3D / asset kit
  | 'commerce';   // checkout / payments (wide panels)

interface ProductCoverProps {
  variant: CoverVariant;
  className?: string;
  /** Unique suffix so gradient ids never collide between instances */
  uid: string;
}

export const ProductCover: React.FC<ProductCoverProps> = ({ variant, className = '', uid }) => {
  const id = (name: string) => `${name}-${variant}-${uid}`;

  const common = {
    className: `product-cover-svg ${className}`,
    viewBox: '0 0 300 420',
    preserveAspectRatio: 'xMidYMid slice' as const,
    xmlns: 'http://www.w3.org/2000/svg',
    'aria-hidden': true as const,
  };

  if (variant === 'commerce') {
    // Wide landscape composition for the value-proposition media panels
    const wide = { ...common, viewBox: '0 0 640 400' };
    return (
      <svg {...wide}>
        <defs>
          <linearGradient id={id('bg')} x1="0" y1="0" x2="0.6" y2="1">
            <stop offset="0%" stopColor="#0E3B28" />
            <stop offset="48%" stopColor="#072418" />
            <stop offset="100%" stopColor="#030E0A" />
          </linearGradient>
          <radialGradient id={id('glow')} cx="42%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#7AE9B4" stopOpacity="0.26" />
            <stop offset="100%" stopColor="#7AE9B4" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={id('cardA')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#5FDCA5" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#149C69" stopOpacity="0.78" />
          </linearGradient>
          <linearGradient id={id('cardB')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.05" />
          </linearGradient>
          <pattern id={id('grid')} width="34" height="34" patternUnits="userSpaceOnUse">
            <path d="M34 0H0V34" fill="none" stroke="#7AE9B4" strokeOpacity="0.07" strokeWidth="1" />
          </pattern>
        </defs>

        <rect width="640" height="400" fill={`url(#${id('bg')})`} />
        <rect width="640" height="400" fill={`url(#${id('grid')})`} />
        <rect width="640" height="400" fill={`url(#${id('glow')})`} />

        {/* back card */}
        <g transform="rotate(-9 250 196)">
          <rect x="158" y="120" width="196" height="124" rx="16" fill={`url(#${id('cardB')})`}
                stroke="#FFFFFF" strokeOpacity="0.18" />
          <rect x="176" y="150" width="34" height="24" rx="5" fill="#FFFFFF" fillOpacity="0.28" />
          <rect x="176" y="204" width="104" height="7" rx="3.5" fill="#FFFFFF" fillOpacity="0.22" />
        </g>

        {/* front payment card */}
        <g transform="rotate(5 318 208)">
          <rect x="212" y="138" width="216" height="136" rx="18" fill={`url(#${id('cardA')})`} />
          <rect x="212" y="138" width="216" height="136" rx="18" fill="none"
                stroke="#D6FFEC" strokeOpacity="0.40" />
          {/* chip */}
          <rect x="234" y="172" width="38" height="28" rx="6" fill="#04271A" fillOpacity="0.55" />
          <path d="M234 186h38M253 172v28" stroke="#7AE9B4" strokeOpacity="0.5" strokeWidth="1.3" />
          {/* number rows */}
          <g fill="#04271A" fillOpacity="0.55">
            <rect x="234" y="222" width="46" height="8" rx="4" />
            <rect x="290" y="222" width="46" height="8" rx="4" />
            <rect x="346" y="222" width="46" height="8" rx="4" />
          </g>
          <rect x="234" y="244" width="72" height="6" rx="3" fill="#04271A" fillOpacity="0.38" />
          {/* contactless */}
          <g fill="none" stroke="#04271A" strokeOpacity="0.45" strokeWidth="2.4" strokeLinecap="round">
            <path d="M386 168a16 16 0 0 1 0 22" />
            <path d="M396 161a26 26 0 0 1 0 36" />
          </g>
        </g>

        {/* rising revenue bars */}
        <g fill="#7AE9B4">
          <rect x="452" y="264" width="20" height="44" rx="4" fillOpacity="0.35" />
          <rect x="482" y="242" width="20" height="66" rx="4" fillOpacity="0.48" />
          <rect x="512" y="212" width="20" height="96" rx="4" fillOpacity="0.62" />
          <rect x="542" y="178" width="20" height="130" rx="4" fillOpacity="0.80" />
        </g>
        <path d="M462 258 L492 236 L522 206 L552 172" fill="none"
              stroke="#D6FFEC" strokeOpacity="0.55" strokeWidth="2" strokeLinecap="round" />
        <circle cx="552" cy="172" r="5" fill="#D6FFEC" fillOpacity="0.9" />

        {/* currency marks */}
        <g fill="#7AE9B4" fillOpacity="0.16" fontFamily="var(--font-primary)"
           fontSize="30" fontWeight="800">
          <text x="92" y="106">$</text>
          <text x="92" y="318">€</text>
          <text x="576" y="106">£</text>
        </g>

        <rect y="300" width="640" height="100" fill="#000" opacity="0.22" />
      </svg>
    );
  }

  if (variant === 'editorial') {
    return (
      <svg {...common}>
        <defs>
          <linearGradient id={id('bg')} x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0%" stopColor="#3A2A1C" />
            <stop offset="42%" stopColor="#1C1510" />
            <stop offset="100%" stopColor="#0A0806" />
          </linearGradient>
          <radialGradient id={id('key')} cx="50%" cy="16%" r="58%">
            <stop offset="0%" stopColor="#F4D9A8" stopOpacity="0.55" />
            <stop offset="45%" stopColor="#C89B5E" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={id('figure')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E8C79A" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#8A6438" stopOpacity="0.03" />
          </linearGradient>
        </defs>

        <rect width="300" height="420" fill={`url(#${id('bg')})`} />
        {/* studio key light */}
        <rect width="300" height="420" fill={`url(#${id('key')})`} />
        {/* soft figure suggestion */}
        <ellipse cx="150" cy="196" rx="62" ry="78" fill={`url(#${id('figure')})`} />
        <ellipse cx="150" cy="120" rx="34" ry="38" fill={`url(#${id('figure')})`} />
        {/* vertical light streaks */}
        <g opacity="0.16">
          <rect x="44" y="0" width="1.5" height="420" fill="#F4D9A8" />
          <rect x="122" y="0" width="1" height="420" fill="#F4D9A8" />
          <rect x="228" y="0" width="1.5" height="420" fill="#F4D9A8" />
        </g>
        {/* lower vignette */}
        <rect y="250" width="300" height="170" fill="#000" opacity="0.30" />
      </svg>
    );
  }

  if (variant === 'cinematic') {
    return (
      <svg {...common}>
        <defs>
          <linearGradient id={id('bg')} x1="0" y1="0" x2="0.6" y2="1">
            <stop offset="0%" stopColor="#12304A" />
            <stop offset="45%" stopColor="#0B1A2A" />
            <stop offset="100%" stopColor="#050A10" />
          </linearGradient>
          <linearGradient id={id('flare')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4FC3F7" stopOpacity="0" />
            <stop offset="30%" stopColor="#8FD9FF" stopOpacity="0.55" />
            <stop offset="52%" stopColor="#FFFFFF" stopOpacity="0.75" />
            <stop offset="74%" stopColor="#7AE9B4" stopOpacity="0.40" />
            <stop offset="100%" stopColor="#4FC3F7" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={id('bokeh')}>
            <stop offset="0%" stopColor="#8FD9FF" stopOpacity="0.30" />
            <stop offset="100%" stopColor="#8FD9FF" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="300" height="420" fill={`url(#${id('bg')})`} />
        {/* anamorphic flare */}
        <rect x="-20" y="138" width="340" height="2.5" fill={`url(#${id('flare')})`} />
        <rect x="-20" y="132" width="340" height="16" fill={`url(#${id('flare')})`} opacity="0.22" />
        {/* bokeh */}
        <circle cx="76" cy="112" r="34" fill={`url(#${id('bokeh')})`} />
        <circle cx="216" cy="176" r="46" fill={`url(#${id('bokeh')})`} />
        <circle cx="140" cy="250" r="26" fill={`url(#${id('bokeh')})`} />
        {/* letterbox bars */}
        <rect width="300" height="34" fill="#02060A" opacity="0.85" />
        <rect y="386" width="300" height="34" fill="#02060A" opacity="0.85" />
        {/* timeline ticks */}
        <g opacity="0.28" fill="#8FD9FF">
          {Array.from({ length: 14 }).map((_, i) => (
            <rect key={i} x={12 + i * 20} y={352} width="2" height={i % 3 === 0 ? 14 : 8} />
          ))}
        </g>
        <rect y="250" width="300" height="170" fill="#000" opacity="0.26" />
      </svg>
    );
  }

  if (variant === 'blueprint') {
    return (
      <svg {...common}>
        <defs>
          <linearGradient id={id('bg')} x1="0" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#0D3A28" />
            <stop offset="48%" stopColor="#062318" />
            <stop offset="100%" stopColor="#030D09" />
          </linearGradient>
          <pattern id={id('grid')} width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M24 0H0V24" fill="none" stroke="#7AE9B4" strokeOpacity="0.13" strokeWidth="1" />
          </pattern>
          <radialGradient id={id('glow')} cx="30%" cy="26%" r="62%">
            <stop offset="0%" stopColor="#7AE9B4" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#7AE9B4" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="300" height="420" fill={`url(#${id('bg')})`} />
        <rect width="300" height="420" fill={`url(#${id('grid')})`} />
        <rect width="300" height="420" fill={`url(#${id('glow')})`} />
        {/* wireframe blocks */}
        <g stroke="#7AE9B4" strokeOpacity="0.45" fill="#7AE9B4" fillOpacity="0.07" strokeWidth="1.4">
          <rect x="40" y="86" width="126" height="20" rx="4" />
          <rect x="40" y="118" width="84" height="12" rx="3" />
          <rect x="40" y="152" width="220" height="86" rx="8" />
          <rect x="40" y="252" width="104" height="58" rx="6" />
          <rect x="156" y="252" width="104" height="58" rx="6" />
        </g>
        {/* rising bars inside the big block */}
        <g fill="#7AE9B4" fillOpacity="0.55">
          <rect x="62" y="206" width="14" height="20" rx="2" />
          <rect x="88" y="192" width="14" height="34" rx="2" />
          <rect x="114" y="176" width="14" height="50" rx="2" />
          <rect x="140" y="188" width="14" height="38" rx="2" />
          <rect x="166" y="164" width="14" height="62" rx="2" />
        </g>
        <rect y="260" width="300" height="160" fill="#000" opacity="0.28" />
      </svg>
    );
  }

  if (variant === 'playbook') {
    return (
      <svg {...common}>
        <defs>
          <linearGradient id={id('bg')} x1="0" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#3A2359" />
            <stop offset="46%" stopColor="#1E1233" />
            <stop offset="100%" stopColor="#0A0614" />
          </linearGradient>
          <linearGradient id={id('page')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#C9A8FF" stopOpacity="0.30" />
            <stop offset="100%" stopColor="#7B5BB8" stopOpacity="0.06" />
          </linearGradient>
          <radialGradient id={id('glow')} cx="64%" cy="22%" r="60%">
            <stop offset="0%" stopColor="#C9A8FF" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#C9A8FF" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="300" height="420" fill={`url(#${id('bg')})`} />
        <rect width="300" height="420" fill={`url(#${id('glow')})`} />
        {/* stacked pages */}
        <g stroke="#C9A8FF" strokeOpacity="0.32" strokeWidth="1.3">
          <rect x="72" y="104" width="152" height="196" rx="10"
                fill={`url(#${id('page')})`} transform="rotate(-8 148 202)" />
          <rect x="82" y="96" width="152" height="196" rx="10"
                fill={`url(#${id('page')})`} transform="rotate(-3 158 194)" />
          <rect x="92" y="90" width="152" height="196" rx="10"
                fill={`url(#${id('page')})`} transform="rotate(2 168 188)" />
        </g>
        {/* text lines on the front page */}
        <g fill="#E4D2FF" fillOpacity="0.40" transform="rotate(2 168 188)">
          <rect x="110" y="124" width="82" height="7" rx="3.5" />
          <rect x="110" y="142" width="112" height="5" rx="2.5" />
          <rect x="110" y="156" width="98" height="5" rx="2.5" />
          <rect x="110" y="170" width="106" height="5" rx="2.5" />
          <rect x="110" y="200" width="60" height="5" rx="2.5" />
          <rect x="110" y="214" width="88" height="5" rx="2.5" />
        </g>
        <rect y="266" width="300" height="154" fill="#000" opacity="0.30" />
      </svg>
    );
  }

  // facet — 3D / asset kit
  return (
    <svg {...common}>
      <defs>
        <linearGradient id={id('bg')} x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#2A3038" />
          <stop offset="46%" stopColor="#161A1F" />
          <stop offset="100%" stopColor="#07090B" />
        </linearGradient>
        <linearGradient id={id('mA')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.42" />
          <stop offset="100%" stopColor="#7A8894" stopOpacity="0.06" />
        </linearGradient>
        <linearGradient id={id('mB')} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7AE9B4" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#20B777" stopOpacity="0.04" />
        </linearGradient>
        <radialGradient id={id('glow')} cx="50%" cy="34%" r="56%">
          <stop offset="0%" stopColor="#CFE8DC" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#CFE8DC" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="300" height="420" fill={`url(#${id('bg')})`} />
      <rect width="300" height="420" fill={`url(#${id('glow')})`} />
      {/* faceted solid */}
      <g strokeWidth="1.2" stroke="#FFFFFF" strokeOpacity="0.22">
        <polygon points="150,84 226,130 226,216 150,262 74,216 74,130" fill={`url(#${id('mA')})`} />
        <polygon points="150,84 226,130 150,174 74,130" fill={`url(#${id('mB')})`} />
        <polygon points="150,174 226,130 226,216 150,262" fill="#FFFFFF" fillOpacity="0.07" />
        <polygon points="150,174 74,130 74,216 150,262" fill="#000000" fillOpacity="0.22" />
      </g>
      {/* orbit ring */}
      <ellipse cx="150" cy="200" rx="108" ry="34" fill="none"
               stroke="#7AE9B4" strokeOpacity="0.22" strokeWidth="1.2" />
      {/* scattered tokens */}
      <g fill="#FFFFFF" fillOpacity="0.16">
        <rect x="42" y="290" width="26" height="26" rx="6" transform="rotate(-14 55 303)" />
        <rect x="128" y="306" width="30" height="30" rx="7" transform="rotate(8 143 321)" />
        <rect x="216" y="286" width="24" height="24" rx="6" transform="rotate(-6 228 298)" />
      </g>
      <rect y="262" width="300" height="158" fill="#000" opacity="0.30" />
    </svg>
  );
};
