'use client';

import React, { useMemo, useState, useLayoutEffect } from 'react';

interface ThirdSectionProps {
  transitionProgress: number; // Progress of section 2 to section 3 transition
  section3to4Progress: number; // Progress of section 3 to section 4 transition
}

const ThirdSection: React.FC<ThirdSectionProps> = ({ transitionProgress, section3to4Progress }) => {
  const [dimensions, setDimensions] = useState({
    vh: 900,
    vw: 1200,
    isMobile: false,
    isTablet: false,
  });

  useLayoutEffect(() => {
    const updateDimensions = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setDimensions({
        vh,
        vw,
        isMobile: vw < 640,
        isTablet: vw >= 640 && vw < 1024,
      });
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const { isMobile, isTablet } = dimensions;
  // Determine if text should be revealed based on transition progress
  const textRevealed = useMemo(() => transitionProgress >= 0.85, [transitionProgress]);

  // Calculate animation values based on transition progress
  // Phase 1: 0-0.5 - Shutters close (deco panels meet in the middle)
  // Phase 2: 0.5-1.0 - Shutters open (deco panels slide out, revealing section 3)

  // Deco elements position
  // Phase 1: Top goes from -100% to 0%, Bottom goes from 100% to 0%
  // Phase 2: Top goes from 0% to -100%, Bottom goes from 0% to 100%
  let decoTopY, decoBottomY;
  
  if (transitionProgress <= 0.5) {
    // Shutters closing - moving to center (meeting at 0%)
    // Use easeInOutQuad for smooth animation
    const t = transitionProgress * 2; // normalize to 0-1
    const easeProgress = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    decoTopY = -100 + (100 * easeProgress); // -100% to 0%
    decoBottomY = 100 - (100 * easeProgress); // 100% to 0%
  } else {
    // Shutters opening - moving out (revealing section 3)
    const t = (transitionProgress - 0.5) * 2; // normalize to 0-1
    const easeProgress = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    decoTopY = 0 - (100 * easeProgress); // 0% to -100%
    decoBottomY = 0 + (100 * easeProgress); // 0% to 100%
  }

  // Image scale and rotation (starts scaled/rotated, ends normal)
  // This only applies after shutters start opening (phase 2)
  const revealProgress = Math.max(0, (transitionProgress - 0.5) / 0.5);
  const imageScale = 1.15 - (0.15 * revealProgress);
  const imageRotation = 3 - (3 * revealProgress);

  // Content opacity - fades in at the end
  const contentOpacity = transitionProgress > 0.7 ? (transitionProgress - 0.7) / 0.3 : 0;

  // Deco opacity (visible during transition)
  const decoOpacity = transitionProgress > 0 && transitionProgress < 1 ? 1 : 0;

  // Section visibility - only show when transition starts
  const sectionOpacity = transitionProgress > 0 ? 1 : 0;
  const sectionZIndex = transitionProgress > 0.3 ? 15 : -1; // Higher z-index since it's now section 4

  return (
    <>
      {/* Deco overlay elements - fixed position for shutter effect */}
      {/* Top shutter panel */}
      <div
        className="fixed top-0 left-0 w-full pointer-events-none"
        style={{
          height: '50vh',
          background: '#0a0a0a',
          transform: `translateY(${decoTopY}%)`,
          opacity: decoOpacity,
          zIndex: 120, // Higher z-index for section 4 shutters
        }}
      />
      {/* Bottom shutter panel */}
      <div
        className="fixed left-0 w-full pointer-events-none"
        style={{
          top: '50vh',
          height: '50vh',
          background: '#0a0a0a',
          transform: `translateY(${decoBottomY}%)`,
          opacity: decoOpacity,
          zIndex: 120,
        }}
      />

      {/* Third Section - Fixed position during transition */}
      <section
        className="fixed inset-0 w-full h-screen overflow-hidden"
        style={{
          opacity: sectionOpacity * (1 - section3to4Progress),
          zIndex: sectionZIndex,
          pointerEvents: transitionProgress > 0.5 && section3to4Progress < 0.5 ? 'auto' : 'none',
          transform: `scale(${1 + 0.1 * section3to4Progress}) rotate(${2 * section3to4Progress}deg)`,
        }}
      >
        <div
          className="w-full h-full overflow-hidden"
          style={{
            transform: `scale(${imageScale}) rotate(${imageRotation}deg)`,
            transformOrigin: 'center center',
          }}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: 'url(/images/pexels-max-fischer-5868118.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />

          {/* Content - Responsive Layout */}
          <div
            className="relative z-10 h-full w-full"
            style={{
              opacity: contentOpacity,
              padding: isMobile ? '16px' : isTablet ? '24px' : '0',
              overflowY: isMobile ? 'auto' : 'visible',
            }}
          >
            {/* Mobile Layout - Cards at bottom, face visible in center */}
            {isMobile ? (
              <div className="h-full flex flex-col justify-between">
                {/* Why Us? - Top left corner on mobile */}
                <div className="pt-20 pl-4">
                  <h2 className={`section3-heading section3-reveal-inner ${textRevealed ? 'revealed' : ''}`}
                      style={{ transitionDelay: '0s', textAlign: 'left', fontSize: 'clamp(24px, 7vw, 36px)' }}>
                    Why Us?
                  </h2>
                </div>

                {/* Horizontal scrollable cards at bottom - doesn't cover face */}
                <div className="pb-6">
                  <div
                    className="flex gap-3 overflow-x-auto px-4 pb-4 snap-x snap-mandatory"
                    style={{
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                      WebkitOverflowScrolling: 'touch',
                    }}
                  >
                    {/* Premium Quality Card */}
                    <div
                      className="flex-shrink-0 bg-amber-100/90 backdrop-blur-sm rounded-2xl p-4 snap-start"
                      style={{ width: 'clamp(200px, 70vw, 280px)', minHeight: '120px' }}
                    >
                      <h3 className={`section3-title-mobile section3-reveal-inner ${textRevealed ? 'revealed' : ''}`}
                          style={{ transitionDelay: '0.1s' }}>
                        Premium Quality
                      </h3>
                      <p className={`section3-desc-mobile section3-reveal-inner ${textRevealed ? 'revealed' : ''}`}
                         style={{ transitionDelay: '0.2s', marginTop: '6px' }}>
                        Carefully built to highest standards.
                      </p>
                    </div>

                    {/* Fast Delivery Card */}
                    <div
                      className="flex-shrink-0 bg-amber-100/90 backdrop-blur-sm rounded-2xl p-4 snap-start"
                      style={{ width: 'clamp(200px, 70vw, 280px)', minHeight: '120px' }}
                    >
                      <h3 className={`section3-title-mobile section3-reveal-inner ${textRevealed ? 'revealed' : ''}`}
                          style={{ transitionDelay: '0.15s' }}>
                        Fast Delivery
                      </h3>
                      <p className={`section3-desc-mobile section3-reveal-inner ${textRevealed ? 'revealed' : ''}`}
                         style={{ transitionDelay: '0.25s', marginTop: '6px' }}>
                        Quick orders with real-time tracking.
                      </p>
                    </div>

                    {/* Secure Payments Card */}
                    <div
                      className="flex-shrink-0 bg-gray-200/90 backdrop-blur-sm rounded-2xl p-4 snap-start"
                      style={{ width: 'clamp(200px, 70vw, 280px)', minHeight: '120px' }}
                    >
                      <h3 className={`section3-title-mobile section3-reveal-inner ${textRevealed ? 'revealed' : ''}`}
                          style={{ transitionDelay: '0.2s' }}>
                        Secure Payments
                      </h3>
                      <p className={`section3-desc-mobile section3-reveal-inner ${textRevealed ? 'revealed' : ''}`}
                         style={{ transitionDelay: '0.3s', marginTop: '6px' }}>
                        100% safe encrypted methods.
                      </p>
                    </div>

                    {/* Easy Returns Card */}
                    <div
                      className="flex-shrink-0 bg-gray-300/90 backdrop-blur-sm rounded-2xl p-4 snap-start"
                      style={{ width: 'clamp(200px, 70vw, 280px)', minHeight: '120px' }}
                    >
                      <h3 className={`section3-title-mobile section3-reveal-inner ${textRevealed ? 'revealed' : ''}`}
                          style={{ transitionDelay: '0.25s' }}>
                        Easy Returns
                      </h3>
                      <p className={`section3-desc-mobile section3-reveal-inner ${textRevealed ? 'revealed' : ''}`}
                         style={{ transitionDelay: '0.35s', marginTop: '6px' }}>
                        Hassle-free stress-free shopping.
                      </p>
                    </div>
                  </div>
                  
                  {/* Scroll indicator dots */}
                  <div className="flex justify-center gap-2 mt-2">
                    <div className="w-2 h-2 rounded-full bg-black/40"></div>
                    <div className="w-2 h-2 rounded-full bg-black/20"></div>
                    <div className="w-2 h-2 rounded-full bg-black/20"></div>
                    <div className="w-2 h-2 rounded-full bg-black/20"></div>
                  </div>
                </div>
              </div>
            ) : isTablet ? (
              /* Tablet Layout - 2 column grid with centered heading */
              <div className="h-full flex flex-col">
                {/* Why Us? - Top Center */}
                <div className="text-center pt-20 mb-8">
                  <h2 className={`section3-heading section3-reveal-inner ${textRevealed ? 'revealed' : ''}`}
                      style={{ transitionDelay: '0s' }}>
                    Why Us?
                  </h2>
                </div>

                {/* 2x2 Grid of content boxes */}
                <div className="grid grid-cols-2 gap-6 flex-1 px-4">
                  {/* Top Left */}
                  <div className="bg-black/20 backdrop-blur-sm rounded-xl p-5">
                    <h3 className={`section3-title section3-reveal-inner ${textRevealed ? 'revealed' : ''}`}
                        style={{ transitionDelay: '0.1s' }}>
                      Premium Quality, Always
                    </h3>
                    <p className={`section3-description section3-reveal-inner ${textRevealed ? 'revealed' : ''}`}
                       style={{ transitionDelay: '0.2s', marginTop: '10px' }}>
                      Every product is carefully built to meet the highest quality standards.
                    </p>
                  </div>

                  {/* Top Right */}
                  <div className="bg-black/20 backdrop-blur-sm rounded-xl p-5 text-right">
                    <h3 className={`section3-title section3-reveal-inner ${textRevealed ? 'revealed' : ''}`}
                        style={{ transitionDelay: '0.15s' }}>
                      Fast & Reliable Delivery
                    </h3>
                    <p className={`section3-description section3-reveal-inner ${textRevealed ? 'revealed' : ''}`}
                       style={{ transitionDelay: '0.25s', marginTop: '10px' }}>
                      Get your orders delivered quickly with real-time tracking.
                    </p>
                  </div>

                  {/* Bottom Left */}
                  <div className="bg-black/20 backdrop-blur-sm rounded-xl p-5">
                    <h3 className={`section3-title section3-reveal-inner ${textRevealed ? 'revealed' : ''}`}
                        style={{ transitionDelay: '0.25s' }}>
                      Easy Returns & Hassle-Free Experience
                    </h3>
                    <p className={`section3-description section3-reveal-inner ${textRevealed ? 'revealed' : ''}`}
                       style={{ transitionDelay: '0.35s', marginTop: '10px' }}>
                      Simple returns designed to keep shopping stress-free.
                    </p>
                  </div>

                  {/* Bottom Right */}
                  <div className="bg-black/20 backdrop-blur-sm rounded-xl p-5 text-right">
                    <h3 className={`section3-title section3-reveal-inner ${textRevealed ? 'revealed' : ''}`}
                        style={{ transitionDelay: '0.2s' }}>
                      Secure Payments
                    </h3>
                    <p className={`section3-description section3-reveal-inner ${textRevealed ? 'revealed' : ''}`}
                       style={{ transitionDelay: '0.3s', marginTop: '10px' }}>
                      Shop with confidence using 100% safe and encrypted payment methods.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Desktop Layout - Original absolute positioning */
              <>
                {/* Why Us? - Bottom Center */}
                <div
                  className="absolute left-1/2"
                  style={{
                    bottom: '80px',
                    transform: 'translateX(-50%)',
                  }}
                >
                  <h2 className={`section3-heading section3-reveal-inner ${textRevealed ? 'revealed' : ''}`}
                      style={{ transitionDelay: '0s' }}>
                    Why Us?
                  </h2>
                </div>

                {/* Violet Box - Top Left */}
                <div
                  className="absolute"
                  style={{
                    top: '100px',
                    left: '60px',
                    maxWidth: '380px',
                  }}
                >
                  <h3 className={`section3-title section3-reveal-inner ${textRevealed ? 'revealed' : ''}`}
                      style={{ transitionDelay: '0.1s' }}>
                    Premium Quality, Always
                  </h3>
                  <p className={`section3-description section3-reveal-inner ${textRevealed ? 'revealed' : ''}`}
                     style={{ transitionDelay: '0.25s', marginTop: '12px' }}>
                    Every product is carefully built to meet the highest quality standards.
                  </p>
                </div>

                {/* Blue Box - Top Right */}
                <div
                  className="absolute text-right"
                  style={{
                    top: '100px',
                    right: '60px',
                    maxWidth: '400px',
                  }}
                >
                  <h3 className={`section3-title section3-reveal-inner ${textRevealed ? 'revealed' : ''}`}
                      style={{ transitionDelay: '0.15s' }}>
                    Fast & Reliable Delivery
                  </h3>
                  <p className={`section3-description section3-reveal-inner ${textRevealed ? 'revealed' : ''}`}
                     style={{ transitionDelay: '0.3s', marginTop: '12px' }}>
                    Get your orders delivered quickly with real-time tracking.
                  </p>
                  
                  <h3 className={`section3-title section3-reveal-inner ${textRevealed ? 'revealed' : ''}`}
                      style={{ transitionDelay: '0.2s', marginTop: '32px' }}>
                    Secure Payments
                  </h3>
                  <p className={`section3-description section3-reveal-inner ${textRevealed ? 'revealed' : ''}`}
                     style={{ transitionDelay: '0.35s', marginTop: '12px' }}>
                    Shop with confidence using 100% safe and encrypted payment methods.
                  </p>
                </div>

                {/* Pink Box - Bottom Left */}
                <div
                  className="absolute"
                  style={{
                    bottom: '120px',
                    left: '60px',
                    maxWidth: '350px',
                  }}
                >
                  <h3 className={`section3-title section3-reveal-inner ${textRevealed ? 'revealed' : ''}`}
                      style={{ transitionDelay: '0.25s' }}>
                    Easy Returns & Hassle-Free Experience
                  </h3>
                  <p className={`section3-description section3-reveal-inner ${textRevealed ? 'revealed' : ''}`}
                     style={{ transitionDelay: '0.4s', marginTop: '12px' }}>
                    Simple returns designed to keep shopping stress-free.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default ThirdSection;