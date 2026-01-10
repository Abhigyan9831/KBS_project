'use client';

import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';

interface HeroSectionProps {
  scrollProgress: number;
  section2to3Progress: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({ scrollProgress, section2to3Progress }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [wordsRevealed, setWordsRevealed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number; isMobile: boolean; isTablet: boolean } | null>(null);

  useLayoutEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setDimensions({
        width,
        height,
        isMobile: width < 640,
        isTablet: width >= 640 && width < 1024,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const loadTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    const revealTimer = setTimeout(() => {
      setWordsRevealed(true);
    }, 600);

    return () => {
      clearTimeout(loadTimer);
      clearTimeout(revealTimer);
    };
  }, []);

  const vw = dimensions?.width ?? 1440;
  const vh = dimensions?.height ?? 900;
  const isMobile = dimensions?.isMobile ?? false;
  const isTablet = dimensions?.isTablet ?? false;

  // Keep video full screen, no shrinking
  const videoStyles = {
    width: vw,
    height: vh,
    top: 0,
    left: 0,
    borderRadius: 0,
  };
  
  
  const titleOpacity = Math.max(0, 1 - scrollProgress * 2.5);
  const indicatorsOpacity = Math.max(0, 1 - scrollProgress * 3);

  return (
    <>
      {}
      {/* Video Container - positioned within fixed parent */}
      <div
        className="absolute overflow-hidden"
        style={{
          top: `${videoStyles.top}px`,
          left: `${videoStyles.left}px`,
          width: `${videoStyles.width}px`,
          height: `${videoStyles.height}px`,
          borderRadius: `${videoStyles.borderRadius}px`,
          zIndex: 5,
          willChange: 'transform, width, height, top, left, border-radius, opacity',
          // Clean fade out effect like Hamilton Company website
          // Fade out as we scroll from Hero to Section 2
          opacity: Math.max(0, 1 - scrollProgress * 1.2), // Fade out slightly faster than scroll
          transform: 'none',
          transition: 'opacity 0.1s linear',
          pointerEvents: scrollProgress > 0.8 ? 'none' : 'auto',
        }}
      >
        {/* Video Background */}
        <div className={`absolute inset-0 ${isLoaded ? 'hero-entry' : 'opacity-0'}`}>
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            poster="/videos/hero-poster.jpg"
          >
            <source src="/videos/Hero.mp4" type="video/mp4" />
            <source src="/videos/hero-video.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>

          {}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)',
              opacity: 1 - scrollProgress,
            }}
          />
        </div>

        {/* Title Container - Bottom centered positioning */}
        <div
          className={`absolute left-0 right-0 ${isMobile ? 'bottom-[8%]' : isTablet ? 'bottom-[10%]' : 'bottom-[12%]'} flex flex-col items-center`}
          style={{
            opacity: titleOpacity,
            transform: `translateY(${scrollProgress * (isMobile ? 20 : 30)}px)`,
            pointerEvents: titleOpacity < 0.3 ? 'none' : 'auto',
          }}
        >
          <h1
            className={`hero-title flex ${isMobile ? 'flex-col gap-0' : 'flex-row items-baseline gap-[0.3em]'} justify-center text-center`}
            style={{
              fontFamily: '"Chewy", system-ui',
              color: '#ffffff',
              WebkitTextStroke: isMobile ? '2px #000000' : '3px #000000',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
              paintOrder: 'stroke fill',
            }}
          >
            {/* "Go" word */}
            <span className="word-reveal">
              <span
                className={`word-reveal-inner word-delay-0 ${wordsRevealed ? 'revealed' : ''}`}
              >
                Go
              </span>
            </span>
            
            {/* "Beyond" word - stacked on mobile, same line on desktop */}
            <span className="word-reveal">
              <span
                className={`word-reveal-inner word-delay-1 ${wordsRevealed ? 'revealed' : ''}`}
              >
                Beyond
              </span>
            </span>
          </h1>
          
          {/* Floating Arrow - Explore More */}
          <div
            className={`flex flex-col items-center ${isMobile ? 'mt-4' : 'mt-6'} floating-arrow`}
            style={{
              animation: 'floatUpDown 2s ease-in-out infinite',
            }}
          >
            <span
              className={`text-white ${isMobile ? 'text-xs' : 'text-sm'} tracking-widest uppercase mb-2`}
              style={{
                textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
              }}
            >
              Explore More
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={isMobile ? "24" : "32"}
              height={isMobile ? "24" : "32"}
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                filter: 'drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.5))',
              }}
            >
              <path d="M12 5v14"></path>
              <path d="M19 12l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Bottom Left - Responsive */}
      <div
        className={`fixed ${isMobile ? 'bottom-4 left-4' : isTablet ? 'bottom-6 left-6' : 'bottom-8 left-8'} flex items-center gap-2 z-20`}
        style={{
          opacity: indicatorsOpacity,
          pointerEvents: indicatorsOpacity < 0.3 ? 'none' : 'auto',
        }}
      >
        <div className="flex flex-col items-center scroll-indicator">
          <span className={`text-white ${isMobile ? 'text-lg' : 'text-xl'}`}>↓</span>
        </div>
      </div>

      {/* Scroll to Explore - Bottom Right - Responsive (hidden on very small mobile) */}
      <div
        className={`fixed ${isMobile ? 'bottom-4 right-4' : isTablet ? 'bottom-6 right-6' : 'bottom-8 right-8'} flex items-center gap-3 z-20`}
        style={{
          opacity: indicatorsOpacity,
          pointerEvents: indicatorsOpacity < 0.3 ? 'none' : 'auto',
        }}
      >
        {/* Hide text on mobile for cleaner look */}
        {!isMobile && (
          <span className={`text-white ${isTablet ? 'text-xs' : 'text-sm'} tracking-wider`}>Scroll to</span>
        )}
        <div className={`${isMobile ? 'w-9 h-9' : 'w-10 h-10'} rounded-full border border-white/40 flex items-center justify-center bg-black/30 backdrop-blur-sm`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={isMobile ? "16" : "18"}
            height={isMobile ? "16" : "18"}
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
