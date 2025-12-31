'use client';

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import Image from 'next/image';

interface FourthSectionProps {
  transitionProgress: number; // Progress of section 3 to section 4 transition
}

const FourthSection: React.FC<FourthSectionProps> = ({ transitionProgress }) => {
  const [titleRevealed, setTitleRevealed] = useState(false);
  const titleRevealedRef = useRef(false);
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
  
  // Custom wallpaper state - stores the uploaded image URL
  // To use: Place your image in public/images/ folder and update the path below
  // Example: '/images/your-custom-wallpaper.jpg'
  const [customWallpaper, setCustomWallpaper] = useState<string | null>('/images/pexels-noe-garde-2150865147-35094607.jpg');
  
  // ========================================
  // CUSTOM WALLPAPER CONFIGURATION
  // ========================================
  // To add your own background image:
  // 1. Place your image in the public/images/ folder
  // 2. Uncomment and update the line below with your image filename:
  //
   const CUSTOM_WALLPAPER_PATH = '/images/pexels-noe-garde-2150865147-35094607.jpg';
  //
  // Or set it dynamically using the state setter:
  // setCustomWallpaper('/images/your-wallpaper.jpg');
  // ========================================
  
  // Example wallpaper paths you can use (update with your own):
  const WALLPAPER_OPTIONS = [
    '/images/pexels-noe-garde-2150865147-35094607.jpg',
    
    // Add more paths as needed
  ];

  // Trigger title reveal animation when section becomes visible
  useEffect(() => {
    if (transitionProgress > 0.7 && !titleRevealedRef.current) {
      const timer = setTimeout(() => {
        titleRevealedRef.current = true;
        setTitleRevealed(true);
      }, 300);
      return () => clearTimeout(timer);
    }
    if (transitionProgress < 0.3 && titleRevealedRef.current) {
      titleRevealedRef.current = false;
      queueMicrotask(() => setTitleRevealed(false));
    }
  }, [transitionProgress]);

  // Calculate animation values based on transition progress
  // Phase 1: 0-0.5 - Shutters close (deco panels meet in the middle)
  // Phase 2: 0.5-1.0 - Shutters open (deco panels slide out, revealing section 4)

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
    // Shutters opening - moving out (revealing section 4)
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
  const sectionZIndex = transitionProgress > 0.3 ? 20 : -1; // Higher z-index for section 5

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
          zIndex: 140, // Higher than section 4 shutters
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
          zIndex: 140,
        }}
      />

      {/* Fourth Section - Fixed position during transition */}
      <section
        className="fixed inset-0 w-full h-screen overflow-hidden"
        style={{
          opacity: sectionOpacity,
          zIndex: sectionZIndex,
          pointerEvents: transitionProgress > 0.5 ? 'auto' : 'none',
        }}
      >
        <div
          className="w-full h-full overflow-hidden"
          style={{
            transform: `scale(${imageScale}) rotate(${imageRotation}deg)`,
            transformOrigin: 'center center',
          }}
        >
          {/* Background - Custom Wallpaper or Default */}
          <div className="absolute inset-0 w-full h-full">
            {customWallpaper ? (
              <Image
                src={customWallpaper}
                alt="Background"
                fill
                className="object-cover"
                priority
              />
            ) : (
              /* Default gradient background */
              <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-neutral-100 via-neutral-200 to-neutral-300" />
            )}
            {/* Overlay for text readability */}
            <div className="absolute inset-0 w-full h-full bg-black/20" />
          </div>

          {/* Content - Responsive Layout */}
          <div
            className="relative z-10 h-full w-full"
            style={{
              opacity: contentOpacity,
              padding: isMobile ? '16px' : isTablet ? '24px' : '0',
            }}
          >
            {/* Mobile Layout - Same style as Section 2 "Our Products" */}
            {isMobile ? (
              <div className="absolute inset-x-0 bottom-0 flex flex-col items-center pb-8 px-4">
                {/* Title - Centered (matching Section 2 style) */}
                <h2 className="section5-title-mobile-centered text-center mb-3">
                  <span className="section5-word-reveal">
                    <span
                      className={`section5-word-reveal-inner section5-word-delay-0 ${titleRevealed ? 'revealed' : ''}`}
                    >
                      About
                    </span>
                  </span>
                  {' '}
                  <span className="section5-word-reveal">
                    <span
                      className={`section5-word-reveal-inner section5-word-delay-1 ${titleRevealed ? 'revealed' : ''}`}
                    >
                      Us
                    </span>
                  </span>
                </h2>

                {/* Description Text - Centered (matching Section 2 style) */}
                <p className={`section5-desc-mobile-centered text-center max-w-[300px] section5-word-reveal-inner section5-word-delay-2 ${titleRevealed ? 'revealed' : ''}`}>
                  KBS is a global brand specializing in intelligent bread makers that combine advanced technology, premium materials, and modern design.
                </p>
              </div>
            ) : isTablet ? (
              /* Tablet Layout - Side by side but closer together */
              <div className="absolute inset-x-6 bottom-12 flex flex-col sm:flex-row justify-between items-end gap-6">
                {/* About Us Title */}
                <h2 className="section5-title-container flex flex-row items-baseline gap-3">
                  <span className="section5-word-reveal">
                    <span
                      className={`section5-word-reveal-inner section5-word-delay-0 ${titleRevealed ? 'revealed' : ''}`}
                    >
                      About
                    </span>
                  </span>
                  <span className="section5-word-reveal">
                    <span
                      className={`section5-word-reveal-inner section5-word-delay-1 ${titleRevealed ? 'revealed' : ''}`}
                    >
                      Us
                    </span>
                  </span>
                </h2>

                {/* Description Text */}
                <div className="max-w-md text-right">
                  <p className="section5-description">
                    KBS is a global brand specializing in intelligent bread makers that combine advanced technology, premium materials, and modern design—delivering precise, effortless, and customizable home baking for today's kitchens.
                  </p>
                </div>
              </div>
            ) : (
              /* Desktop Layout - Original absolute positioning */
              <>
                {/* About Us Title - Left side, moved up - single line */}
                <div className="absolute left-12 bottom-32">
                  <h2 className="section5-title-container flex flex-row items-baseline gap-4">
                    {/* "About" word */}
                    <span className="section5-word-reveal">
                      <span
                        className={`section5-word-reveal-inner section5-word-delay-0 ${titleRevealed ? 'revealed' : ''}`}
                      >
                        About
                      </span>
                    </span>
                    
                    {/* "Us" word */}
                    <span className="section5-word-reveal">
                      <span
                        className={`section5-word-reveal-inner section5-word-delay-1 ${titleRevealed ? 'revealed' : ''}`}
                      >
                        Us
                      </span>
                    </span>
                  </h2>
                </div>

                {/* Description Text - Right side, moved up */}
                <div className="absolute right-12 bottom-24 max-w-xl text-right">
                  <p className="section5-description">
                    KBS is a global brand specializing in intelligent bread makers that combine advanced technology, premium materials, and modern design—delivering precise, effortless, and customizable home baking for today's kitchens.
                  </p>
                </div>
              </>
            )}

            {/* Custom Wallpaper Upload Placeholder */}
            {/*
              ==========================================
              HOW TO ADD YOUR CUSTOM WALLPAPER:
              ==========================================
              
              Method 1: Static Image
              1. Place your image in: public/images/
              2. Update the customWallpaper state above:
                 const [customWallpaper] = useState('/images/your-image.jpg');
              
              Method 2: Dynamic Upload (for development)
              Uncomment the input below to test with local files:
            */}
            {/*
            <div className="absolute top-4 right-4 z-50">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = URL.createObjectURL(file);
                    setCustomWallpaper(url);
                  }
                }}
                className="hidden"
                id="wallpaper-upload"
              />
              <label
                htmlFor="wallpaper-upload"
                className="cursor-pointer px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg text-sm font-medium text-black hover:bg-white transition-colors"
              >
                Upload Wallpaper
              </label>
            </div>
            */}
          </div>
        </div>
      </section>

      {/* Section 5 Styles */}
      <style jsx global>{`
        /* Section 5 Title Styles - "About Us" - Desktop */
        .section5-title-container {
          font-family: sans-serif;
          font-size: clamp(48px, 6vw, 72px);
          line-height: 0.95;
          color: #ffffff;
          font-weight: 300;
          letter-spacing: -0.02em;
        }

        /* Section 5 Description Styles - Desktop */
        .section5-description {
          font-family: sans-serif;
          font-size: clamp(16px, 2vw, 24px);
          line-height: 1.6;
          color: #ffffff;
          font-weight: 400;
        }
        
        /* Mobile-specific title - auto-adjusts to screen */
        .section5-title-mobile {
          font-family: sans-serif;
          font-size: clamp(28px, 8vw, 40px);
          line-height: 1;
          color: #ffffff;
          font-weight: 300;
          letter-spacing: -0.02em;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
        
        /* Mobile-specific title - centered style (matching Section 2) */
        .section5-title-mobile-centered {
          font-family: sans-serif;
          font-size: 36px;
          line-height: 1;
          color: #ffffff;
          font-weight: 300;
          letter-spacing: -0.02em;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
        
        /* Mobile-specific description - auto-adjusts to screen */
        .section5-desc-mobile {
          font-family: sans-serif;
          font-size: clamp(13px, 3.5vw, 16px);
          line-height: 1.5;
          font-weight: 400;
        }
        
        /* Mobile-specific description - centered style (matching Section 2) */
        .section5-desc-mobile-centered {
          font-family: sans-serif;
          font-size: 15px;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 400;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
        }

        /* Word by Word Reveal Animation for Section 5 */
        .section5-word-reveal {
          display: inline-block;
          overflow: hidden;
          vertical-align: bottom;
        }

        .section5-word-reveal-inner {
          display: inline-block;
          transform: translateY(100%);
          opacity: 0;
        }

        .section5-word-reveal-inner.revealed {
          transform: translateY(0);
          opacity: 1;
        }

        /* Staggered animation delays for Section 5 title */
        .section5-word-delay-0 {
          transition: transform 1s cubic-bezier(0.23, 1, 0.32, 1) 0.2s,
                      opacity 0.8s ease-out 0.2s;
        }

        .section5-word-delay-1 {
          transition: transform 1s cubic-bezier(0.23, 1, 0.32, 1) 0.4s,
                      opacity 0.8s ease-out 0.4s;
        }

        .section5-word-delay-2 {
          transition: transform 1s cubic-bezier(0.23, 1, 0.32, 1) 0.5s,
                      opacity 0.8s ease-out 0.5s;
        }

        /* Responsive Section 5 Styles - Tablet */
        @media (max-width: 1024px) {
          .section5-title-container {
            font-size: clamp(40px, 6vw, 52px);
          }
          .section5-description {
            font-size: clamp(15px, 2vw, 18px);
            line-height: 1.5;
          }
        }

        /* Safe area bottom for notched phones */
        .safe-area-bottom {
          padding-bottom: max(20px, env(safe-area-inset-bottom));
        }
      `}</style>
    </>
  );
};

export default FourthSection;