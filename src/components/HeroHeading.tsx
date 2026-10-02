import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface HeroHeadingProps {
  headingRef?: React.RefObject<HTMLDivElement | null>;
  wordTrackRef?: React.RefObject<HTMLDivElement | null>;
  subcopyRef?: React.RefObject<HTMLDivElement | null>;
  buttonsRef?: React.RefObject<HTMLDivElement | null>;
}

export const HeroHeading: React.FC<HeroHeadingProps> = ({
  headingRef,
  wordTrackRef,
  subcopyRef,
  buttonsRef
}) => {
  return (
    <div
      ref={headingRef}
      id="hero-heading-container"
      className="hero-copy"
    >
      <div className="hero-copy-row">

        {/* LEFT: headline, anchored to the bottom of the band */}
        <div className="hero-headline-wrapper">
          <h1 id="hero-main-headline" className="hero-headline">
            <span className="headline-line static-line silver-gradient-text">Sell</span>

            <span className="headline-line rotating-line">
              <span className="rotating-word-mask">
                <span ref={wordTrackRef} className="rotating-word-track">
                  <span className="gold-gradient-text">Photos</span>
                  <span className="gold-gradient-text">Videos</span>
                  <span className="gold-gradient-text">PDFs</span>
                  <span className="gold-gradient-text">Digital content</span>
                  <span aria-hidden="true" className="gold-gradient-text">Photos</span>
                </span>
              </span>
            </span>

            <span className="headline-line static-line silver-gradient-text">instantly</span>
          </h1>
        </div>

        {/* RIGHT: a quiet editorial caption — hairline, label, one line, two actions */}
        <div className="hero-aside">
          <div ref={subcopyRef} className="hero-aside-copy">
            <span className="hero-aside-label">Upload · Price · Share</span>
            <p id="hero-subcopy-text" className="hero-description">
              Upload your content, set your price and sell it through one secure link.
            </p>
          </div>

          <div ref={buttonsRef} className="hero-actions">
            <a id="hero-cta-start" href="#/contact" className="hero-cta-primary">
              Start Selling
              <ArrowUpRight className="w-[15px] h-[15px]" />
            </a>
            <a id="hero-cta-how" href="#/how-it-works" className="hero-cta-link">
              See how it works
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
