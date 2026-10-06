import React from 'react';
import { ProductCardData } from '../data/productData';
import { Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { ProductCover } from './ProductCover';
import { useLanguage } from '../i18n/LanguageContext';

interface ProductCardProps {
  product: ProductCardData;
  cardRef: (el: HTMLDivElement | null) => void;
  index: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, cardRef, index }) => {
  const { t } = useLanguage();
  type CardId = keyof typeof t.productCards.items;
  const cardText = (t.productCards.items as Record<CardId, { title: string; subtitle: string }>)[product.id as CardId];
  const title    = cardText?.title    ?? product.title;
  const subtitle = cardText?.subtitle ?? product.subtitle;

  return (
    <div
      ref={cardRef}
      id={`product-card-${product.id}`}
      className="snapsell-card absolute rounded-2xl sm:rounded-[28px] overflow-hidden select-none cursor-pointer group shadow-2xl transition-shadow duration-300 hover:shadow-[0_0_35px_rgba(32,183,119,0.22)]"
      style={{
        // Sit inside the row, bottom-anchored. The wrapper is zero-height, so
        // without this the card hung from its top edge — a full card-height
        // below the row — and the scroll lift left it cut off at the fold.
        left: 0,
        bottom: 0,
        width: 'clamp(210px, 17.5vw, 345px)',
        aspectRatio: '3 / 4.2',
        willChange: 'transform, opacity',
      }}
    >
      {/* Product Image */}
      <div className="relative w-full h-full overflow-hidden">
        {product.photo ? (
          <img
            src={product.photo}
            alt={product.alt}
            draggable={false}
            decoding="async"
            loading="lazy"
            className="w-full h-full block object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            style={{ objectPosition: product.photoPositionCard ?? 'center' }}
          />
        ) : (
          <ProductCover
            variant={product.cover}
            uid={product.id}
            className="w-full h-full block transition-transform duration-700 ease-out group-hover:scale-105"
          />
        )}

        {/* Gradient Overlay for Text Readability */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.04) 20%, rgba(0, 0, 0, 0.22) 50%, rgba(0, 0, 0, 0.92) 100%)'
          }}
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <span className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wide border backdrop-blur-md shadow-md ${product.badgeColor}`}>
            {product.type}
          </span>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 border border-[#20B777]/40 text-[#7AE9B4] text-[11px] sm:text-xs font-extrabold backdrop-blur-md shadow-lg">
            <span>{product.price}</span>
          </div>
        </div>

        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 right-0 px-3.5 sm:px-5 pt-4 pb-3.5 sm:pb-4 z-10 flex flex-col justify-end" style={{ minHeight: '38%' }}>
          {/* Subtitle — wraps naturally, 2 lines max */}
          <div className="flex items-start gap-1 text-[10px] sm:text-[11px] text-[#7AE9B4] font-medium tracking-wide leading-snug mb-1">
            <Sparkles className="w-3 h-3 text-[#4ED398] shrink-0 mt-px" />
            <span className="line-clamp-2">{subtitle}</span>
          </div>

          {/* Title — wraps onto 2 lines if needed */}
          <h3 className="text-sm sm:text-[15px] md:text-base font-bold text-white tracking-tight leading-tight line-clamp-2 group-hover:text-[#7AE9B4] transition-colors mb-2.5">
            {title}
          </h3>

          {/* Footer row */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2 text-[10px] sm:text-xs text-slate-300">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3 h-3 text-[#4ED398]/80 shrink-0" />
              <span className="whitespace-nowrap">{t.productCards.delivery}</span>
            </span>
            <span className="font-semibold text-[#7AE9B4] flex items-center gap-0.5 whitespace-nowrap shrink-0 group-hover:translate-x-1 transition-transform">
              {t.productCards.buy} <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
