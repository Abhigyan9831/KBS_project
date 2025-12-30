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
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

  useLayoutEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
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

  // Calculate video container styles based on scroll progress
  const getVideoStyles = () => {
    // Target dimensions for the shrunk video card
    const targetWidth = Math.min(550, vw * 0.38);
    const targetHeight = Math.min(650, vh * 0.72);
    const targetTop = 120;
    const targetLeft = (vw - targetWidth) / 2;
    const targetBorderRadius = 20;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const progress = easeOutCubic(scrollProgress);

    const currentWidth = vw - (vw - targetWidth) * progress;
    const currentHeight = vh - (vh - targetHeight) * progress;
    const currentTop = 0 + targetTop * progress;
    const currentLeft = 0 + targetLeft * progress;
    const currentBorderRadius = 0 + targetBorderRadius * progress;

    return {
      width: currentWidth,
      height: currentHeight,
      top: currentTop,
      left: currentLeft,
      borderRadius: currentBorderRadius,
    };
  };

  const videoStyles = getVideoStyles();
  
  
  const titleOpacity = Math.max(0, 1 - scrollProgress * 2.5);
  const indicatorsOpacity = Math.max(0, 1 - scrollProgress * 3);

  return (
    <>
      {}
      <div className="h-[200vh] relative" style={{ zIndex: 1 }}>
        {/* This creates scroll space */}
      </div>

      {/* Fixed Video Container */}
      <div
        className="fixed overflow-hidden"
        style={{
          top: `${videoStyles.top}px`,
          left: `${videoStyles.left}px`,
          width: `${videoStyles.width}px`,
          height: `${videoStyles.height}px`,
          borderRadius: `${videoStyles.borderRadius}px`,
          zIndex: 5,
          willChange: 'transform, width, height, top, left, border-radius',
          opacity: 1 - section2to3Progress,
          transform: `scale(${1 + 0.1 * section2to3Progress}) rotate(${2 * section2to3Progress}deg)`,
          pointerEvents: section2to3Progress > 0.5 ? 'none' : 'auto',
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
            <source src="/videos/sample_vid.mp4" type="video/mp4" />
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

        {}
        <div
          className="absolute left-0 bottom-[15%] px-[5%]"
          style={{
            opacity: titleOpacity,
            transform: `translateY(${scrollProgress * 30}px)`,
            pointerEvents: titleOpacity < 0.3 ? 'none' : 'auto',
          }}
        >
          <h1 className="hero-title flex flex-row items-baseline gap-[0.3em]">
            {/* "Go" word */}
            <span className="word-reveal">
              <span
                className={`word-reveal-inner word-delay-0 ${wordsRevealed ? 'revealed' : ''}`}
              >
                Go
              </span>
            </span>
            
            {/* "Further" word - same line (matching Lightship exactly) */}
            <span className="word-reveal">
              <span
                className={`word-reveal-inner word-delay-1 ${wordsRevealed ? 'revealed' : ''}`}
              >
                Beyond
              </span>
            </span>
          </h1>
        </div>
      </div>

      {/* Scroll Indicator - Bottom Left */}
      <div
        className="fixed bottom-8 left-8 flex items-center gap-2 z-20"
        style={{ 
          opacity: indicatorsOpacity,
          pointerEvents: indicatorsOpacity < 0.3 ? 'none' : 'auto',
        }}
      >
        <div className="flex flex-col items-center scroll-indicator">
          <span className="text-white text-xl">↓</span>
        </div>
      </div>

      {/* Scroll to Explore - Bottom Right */}
      <div
        className="fixed bottom-8 right-8 flex items-center gap-3 z-20"
        style={{ 
          opacity: indicatorsOpacity,
          pointerEvents: indicatorsOpacity < 0.3 ? 'none' : 'auto',
        }}
      >
        <span className="text-white text-sm tracking-wider">Scroll to</span>
        <div className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
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