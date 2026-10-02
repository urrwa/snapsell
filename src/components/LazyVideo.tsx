import React, { useEffect, useRef, useState } from 'react';

type Props = Omit<React.VideoHTMLAttributes<HTMLVideoElement>, 'src' | 'autoPlay' | 'preload'> & {
  src: string;
  /** How far outside the viewport to start loading. */
  rootMargin?: string;
};

/**
 * A muted, looping background video that costs nothing until it's needed.
 *
 * The source isn't attached until the element comes within `rootMargin` of
 * the viewport, so videos further down the page no longer download while
 * the landing view is loading. Once loaded it plays only while on screen
 * and pauses when scrolled away, which also saves decode work.
 */
export function LazyVideo({ src, rootMargin = '600px 0px', ...rest }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [armed, setArmed] = useState(false);

  // attach the source when it gets close
  useEffect(() => {
    const el = ref.current;
    if (!el || armed) return;
    if (!('IntersectionObserver' in window)) {
      setArmed(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setArmed(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [armed, rootMargin]);

  // play only while actually visible
  useEffect(() => {
    const el = ref.current;
    if (!el || !armed || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => undefined);
        else el.pause();
      },
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [armed]);

  return (
    <video
      ref={ref}
      src={armed ? src : undefined}
      preload={armed ? 'auto' : 'none'}
      muted
      loop
      playsInline
      {...rest}
    />
  );
}
