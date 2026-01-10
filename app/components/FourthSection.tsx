'use client';

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import Image from 'next/image';

interface FourthSectionProps {}

const FourthSection: React.FC<FourthSectionProps> = () => {
  const [titleRevealed, setTitleRevealed] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  
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
  
  // Custom wallpaper state
  const [customWallpaper, setCustomWallpaper] = useState<string | null>('/images/pexels-noe-garde-2150865147-35094607.jpg');
  
  // Intersection Observer for scroll reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTitleRevealed(true);
        }
      },
      { threshold: 0.2 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden"
      style={{ backgroundColor: '#2B2A2A' }}
    >
        {/* Background Image - about.jpg */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/images/about.jpg"
            alt="About Us Background"
            fill
            priority
            style={{
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
          {/* Dark overlay for better text readability */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to right, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0.1) 100%)',
            }}
          />
        </div>

        {/* Content - Responsive Layout - Middle Left Positioning */}
        <div
          className="relative z-10 h-full w-full flex items-center"
          style={{
            padding: isMobile ? '16px' : isTablet ? '24px' : '0',
          }}
        >
          {/* Mobile Layout - Middle Left */}
          {isMobile ? (
            <div className="flex flex-col items-start justify-center px-6 py-8">
              {/* Title */}
              <h2 className="section5-title-mobile-centered text-left mb-4">
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

              {/* Description Text */}
              <p className={`section5-desc-mobile-centered text-left max-w-[320px] section5-word-reveal-inner section5-word-delay-2 ${titleRevealed ? 'revealed' : ''}`}>
                KBS is a global brand specializing in intelligent bread makers that combine advanced technology, premium materials, and modern design.
              </p>
            </div>
          ) : isTablet ? (
            /* Tablet Layout - Middle Left */
            <div className="flex flex-col items-start justify-center px-10">
              {/* About Us Title */}
              <h2 className="section5-title-container flex flex-row items-baseline gap-3 mb-5">
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
              <div className="max-w-md text-left">
                <p className={`section5-description section5-word-reveal-inner section5-word-delay-2 ${titleRevealed ? 'revealed' : ''}`}>
                  KBS is a global brand specializing in intelligent bread makers that combine advanced technology, premium materials, and modern design—delivering precise, effortless, and customizable home baking for today's kitchens.
                </p>
              </div>
            </div>
          ) : (
            /* Desktop Layout - Middle Left */
            <div className="flex flex-col items-start justify-center pl-16 lg:pl-24">
              {/* About Us Title */}
              <h2 className="section5-title-container flex flex-row items-baseline gap-4 mb-6">
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

              {/* Description Text - Below title */}
              <div className="max-w-xl text-left">
                <p className={`section5-description section5-word-reveal-inner section5-word-delay-2 ${titleRevealed ? 'revealed' : ''}`}>
                  KBS is a global brand specializing in intelligent bread makers that combine advanced technology, premium materials, and modern design—delivering precise, effortless, and customizable home baking for today's kitchens.
                </p>
              </div>
            </div>
          )}
        </div>

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
    </section>
  );
};

export default FourthSection;