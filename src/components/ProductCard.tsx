import React from 'react';
import { ProductCardData } from '../data/productData';
import { Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { ProductCover } from './ProductCover';

interface ProductCardProps {
  product: ProductCardData;
  cardRef: (el: HTMLDivElement | null) => void;
  index: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, cardRef, index }) => {
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
            background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.04) 25%, rgba(0, 0, 0, 0.18) 55%, rgba(0, 0, 0, 0.88) 100%)'
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
        <div className="absolute bottom-0 left-0 right-0 p-3.5 sm:p-5 z-10 flex flex-col gap-1.5">
          <div className="flex items-center gap-1 text-[10px] sm:text-xs text-[#7AE9B4] font-medium tracking-wide min-w-0">
            <Sparkles className="w-3 h-3 text-[#4ED398] shrink-0" />
            <span className="truncate min-w-0">{product.subtitle}</span>
          </div>

          <h3 className="text-xs sm:text-sm md:text-base font-bold text-white tracking-tight leading-snug truncate group-hover:text-[#7AE9B4] transition-colors">
            {product.title}
          </h3>

          <div className="mt-1.5 pt-2 border-t border-white/10 flex items-center justify-between gap-2 text-[10px] sm:text-xs text-slate-300">
            <span className="flex items-center gap-1 text-slate-400 whitespace-nowrap min-w-0 truncate">
              <ShieldCheck className="w-3 h-3 text-[#4ED398]/80 shrink-0" />
              1-Click Delivery
            </span>
            <span className="font-semibold text-[#7AE9B4] flex items-center gap-0.5 whitespace-nowrap shrink-0 group-hover:translate-x-1 transition-transform">
              Buy <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
