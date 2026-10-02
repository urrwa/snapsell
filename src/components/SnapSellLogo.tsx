import React from 'react';

interface SnapSellLogoProps {
  className?: string;
  alt?: string;
  priority?: boolean;
  /** Square brand mark only, without the wordmark. */
  markOnly?: boolean;
}

/**
 * The real SnapSell logo.
 *
 * Bundled from /public/images rather than a CDN — the previous remote copy
 * stopped resolving and left a broken-image box in the navbar. The PNG has a
 * transparent background, so it sits correctly on the dark surfaces.
 */
export function SnapSellLogo({
  className = '',
  alt = 'SnapSell',
  priority = false,
  markOnly = false,
}: SnapSellLogoProps) {
  return (
    <img
      src={markOnly ? 'images/snapsell-mark.webp' : 'images/snapsell-logo.webp'}
      alt={alt}
      className={`snapsell-logo ${className}`}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      draggable="false"
    />
  );
}
