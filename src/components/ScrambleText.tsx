import React, { useCallback, useEffect, useRef, useState } from 'react';

const DIGITS = '0123456789';

/** ms between glyph swaps — fast enough to read as a blur of digits */
const TICK = 26;

export interface ScrambleHandle {
  /** Scramble, then resolve left-to-right back into the label. */
  enter: () => void;
  /** Shorter, softer pass on the way out. */
  leave: () => void;
}

interface ScrambleTextProps {
  text: string;
  className?: string;
}

/**
 * Rapid number-scramble text.
 *
 * Every character is replaced with cycling random digits, and characters
 * lock back to the real label progressively from the left, so the word
 * resolves out of the noise rather than snapping back all at once.
 */
export const ScrambleText = React.forwardRef<ScrambleHandle, ScrambleTextProps>(
  ({ text, className = '' }, ref) => {
    const [display, setDisplay] = useState(text);
    const rafRef = useRef<number | null>(null);
    const lastTickRef = useRef(0);

    const stop = useCallback(() => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    }, []);

    const run = useCallback(
      (duration: number, chaos: number) => {
        stop();

        const chars = [...text];
        // `chaos` holds every glyph scrambling before the resolve begins;
        // the rest of the window staggers each character's lock-in.
        const holdFor = duration * chaos;
        const spread = duration - holdFor;
        const revealAt = chars.map(
          (_, i) => holdFor + spread * (i / Math.max(chars.length - 1, 1))
        );

        const started = performance.now();
        lastTickRef.current = 0;

        const frame = (now: number) => {
          const elapsed = now - started;

          // throttle the glyph churn so it reads as digits, not static
          if (elapsed - lastTickRef.current >= TICK || elapsed >= duration) {
            lastTickRef.current = elapsed;

            let out = '';
            let settled = true;

            for (let i = 0; i < chars.length; i++) {
              const c = chars[i];
              if (c === ' ') {
                out += ' ';
                continue;
              }
              if (elapsed >= revealAt[i]) {
                out += c;
              } else {
                settled = false;
                out += DIGITS[(Math.random() * DIGITS.length) | 0];
              }
            }

            setDisplay(out);

            if (settled) {
              setDisplay(text);
              rafRef.current = null;
              return;
            }
          }

          rafRef.current = requestAnimationFrame(frame);
        };

        rafRef.current = requestAnimationFrame(frame);
      },
      [stop, text]
    );

    React.useImperativeHandle(
      ref,
      () => ({
        // in: longer hold, fuller scramble
        enter: () => run(400, 0.42),
        // out: quick, subtler pass
        leave: () => run(220, 0.18),
      }),
      [run]
    );

    useEffect(() => {
      setDisplay(text);
      return stop;
    }, [text, stop]);

    return (
      <span className={`scramble-text ${className}`} data-label={text}>
        {/* invisible copy reserves the final width so nothing reflows */}
        <span className="scramble-ghost" aria-hidden="true">
          {text}
        </span>
        <span className="scramble-live" aria-hidden="true">
          {display}
        </span>
        <span className="sr-only">{text}</span>
      </span>
    );
  }
);

ScrambleText.displayName = 'ScrambleText';
