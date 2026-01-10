'use client';

import React, { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// No props interface needed for static version

// Responsive hook for device detection
const useResponsive = () => {
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

  return dimensions;
};

// Slide data
const slideData = [
  {
    index: 0,
    headline: 'Smart Bread Maker',
    button: 'Shop now',
    src: '/images/3_1.jpg'
  },
  {
    index: 1,
    headline: 'Precion and Engineering',
    button: 'Shop now',
    src: '/images/16_2.jpg'
  },
  {
    index: 2,
    headline: 'For Your Current Mood',
    button: 'Shop now',
    src: '/images/6_2.jpg'
  },
  {
    index: 3,
    headline: 'Modern Designs',
    button: 'Shop now',
    src: '/images/ui.jpg'
  }
];

// Slide Component - simplified for centered display
interface SlideProps {
  slide: typeof slideData[0];
  current: number;
}

const Slide: React.FC<SlideProps> = ({ slide, current }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const { src, button, headline, index } = slide;
  const isCurrent = current === index;

  if (!isCurrent) return null;

  return (
    <div
      className="slide-centered"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="slide-centered__image-wrapper"
        style={{
          transform: isHovered ? 'scale(1.03)' : 'scale(1)',
          transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        <Image
          className="slide-centered__image"
          alt={headline}
          src={src}
          fill
          sizes="95vw"
          priority
          onLoad={handleImageLoad}
          style={{
            opacity: imageLoaded ? 1 : 0,
            objectFit: 'cover',
            objectPosition: 'center'
          }}
        />
        {/* Fallback gradient if image doesn't load */}
        <div className="slide-centered__image-fallback" />
      </div>

      {/* Headline overlay */}
      <div className="slide-centered__content">
        <h2 className="slide-centered__headline">{headline}</h2>
        <Link href="/store" className="slide-centered__action">{button}</Link>
      </div>
    </div>
  );
};

// Arrow Control Component - positioned on sides
interface ArrowControlProps {
  direction: 'left' | 'right';
  onClick: () => void;
}

const ArrowControl: React.FC<ArrowControlProps> = ({ direction, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <button 
      className={`arrow-btn arrow-btn--${direction}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={direction === 'left' ? 'Previous slide' : 'Next slide'}
    >
      <svg 
        className="arrow-icon" 
        viewBox="0 0 24 24"
        style={{ fill: isHovered ? '#ff6b00' : '#000000' }}
      >
        {direction === 'left' ? (
          <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
        ) : (
          <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
        )}
      </svg>
    </button>
  );
};

const EmptySection: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [titleRevealed, setTitleRevealed] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { isMobile } = useResponsive();

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

  const handlePreviousClick = useCallback(() => {
    setCurrent(prev => (prev - 1 < 0) ? slideData.length - 1 : prev - 1);
  }, []);

  const handleNextClick = useCallback(() => {
    setCurrent(prev => (prev + 1 === slideData.length) ? 0 : prev + 1);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen overflow-hidden"
      style={{
        backgroundColor: 'rgb(245, 240, 230)',
        zIndex: 10,
        paddingTop: '80px', // Space for navbar
      }}
    >
      {/* Title - Centered at top */}
      <div className="new-arrivals-title-container">
        <h2 className="section3-title-container">
          <span className="section3-word-reveal">
            <span
              className={`section3-word-reveal-inner section3-word-delay-0 ${titleRevealed ? 'revealed' : ''}`}
            >
              New
            </span>
          </span>
          <span className="section3-word-reveal" style={{ marginLeft: '0.3em' }}>
            <span
              className={`section3-word-reveal-inner section3-word-delay-1 ${titleRevealed ? 'revealed' : ''}`}
            >
              Arrivals
            </span>
          </span>
        </h2>
      </div>

      {/* Main Slider Container - 95% width, centered */}
      <div className="new-arrivals-slider-container">
        {/* Image Display - 95% width with navigation overlay */}
        <div className="new-arrivals-image-container">
          {slideData.map(slide => (
            <Slide
              key={slide.index}
              slide={slide}
              current={current}
            />
          ))}
          
          {/* Navigation Arrows - positioned over the image */}
          <div className="new-arrivals-nav-overlay">
            <ArrowControl direction="left" onClick={handlePreviousClick} />
            <ArrowControl direction="right" onClick={handleNextClick} />
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="new-arrivals-indicators">
        {slideData.map((_, index) => (
          <button
            key={index}
            className={`indicator-dot ${current === index ? 'indicator-dot--active' : ''}`}
            onClick={() => setCurrent(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* New Arrivals Styles */}
      <style jsx global>{`
        /* Title Container */
        .new-arrivals-title-container {
          text-align: center;
          padding: 40px 20px 30px;
        }

        /* Section 3 Title Styles - "New Arrivals" */
        .section3-title-container {
          font-family: sans-serif;
          font-size: 48px;
          line-height: 1.2;
          color: #000000;
          font-weight: 300;
          letter-spacing: -0.02em;
          display: inline-block;
        }

        /* Word by Word Reveal Animation */
        .section3-word-reveal {
          display: inline-block;
          overflow: hidden;
          vertical-align: bottom;
        }

        .section3-word-reveal-inner {
          display: inline-block;
          transform: translateY(100%);
          opacity: 0;
        }

        .section3-word-reveal-inner.revealed {
          transform: translateY(0);
          opacity: 1;
        }

        .section3-word-delay-0 {
          transition: transform 1s cubic-bezier(0.23, 1, 0.32, 1) 0.2s,
                      opacity 0.8s ease-out 0.2s;
        }

        .section3-word-delay-1 {
          transition: transform 1s cubic-bezier(0.23, 1, 0.32, 1) 0.4s,
                      opacity 0.8s ease-out 0.4s;
        }

        /* Main Slider Container */
        .new-arrivals-slider-container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 0;
          box-sizing: border-box;
        }

        /* Image Container - 95% width */
        .new-arrivals-image-container {
          width: 95%;
          aspect-ratio: 16 / 8;
          position: relative;
          overflow: hidden;
          border-radius: 12px;
        }

        /* Navigation Overlay - positioned over the image */
        .new-arrivals-nav-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          pointer-events: none;
          z-index: 10;
        }

        /* Arrow Buttons */
        .arrow-btn {
          background: rgba(255, 255, 255, 0.85);
          border: none;
          cursor: pointer;
          padding: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease, background-color 0.3s ease, box-shadow 0.3s ease;
          border-radius: 50%;
          pointer-events: auto;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .arrow-btn:hover {
          transform: scale(1.15);
          background: rgba(255, 255, 255, 1);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
        }

        .arrow-btn--left {
          margin-right: 0;
        }

        .arrow-btn--right {
          margin-left: 0;
        }

        .arrow-icon {
          width: 36px;
          height: 36px;
          transition: fill 0.3s ease;
        }

        /* Slide Centered Style */
        .slide-centered {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .slide-centered__image-wrapper {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          background-color: #e5e0d6;
        }

        .slide-centered__image {
          transition: opacity 0.5s ease;
        }

        .slide-centered__image-fallback {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #d4cfc5 0%, #e5e0d6 50%, #d4cfc5 100%);
          z-index: -1;
        }

        .slide-centered__content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 40px;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.5));
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .slide-centered__headline {
          font-family: sans-serif;
          font-size: 28px;
          font-weight: 400;
          color: #ffffff;
          text-align: center;
          margin: 0;
        }

        .slide-centered__action {
          background-color: #000000;
          border: none;
          border-radius: 4px;
          color: #ffffff;
          cursor: pointer;
          font-family: sans-serif;
          font-size: 14px;
          font-weight: 400;
          padding: 0.875rem 2rem;
          text-decoration: none;
          transition: background-color 0.3s ease;
        }

        .slide-centered__action:hover {
          background-color: #ff6b00;
        }

        /* Slide Indicators */
        .new-arrivals-indicators {
          display: flex;
          justify-content: center;
          gap: 12px;
          padding: 30px 0 50px;
        }

        .indicator-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: rgba(0, 0, 0, 0.2);
          border: none;
          cursor: pointer;
          transition: background-color 0.3s ease;
          padding: 0;
          margin: 0;
        }

        .indicator-dot:hover {
          background-color: rgba(0, 0, 0, 0.4);
        }

        .indicator-dot--active {
          background-color: #000000;
          transform: scale(1);
        }

        /* Responsive Styles */
        @media (max-width: 1024px) {
          .section3-title-container {
            font-size: 42px;
          }
          
          .new-arrivals-image-container {
            width: 95%;
          }
          
          .new-arrivals-nav-overlay {
            padding: 0 15px;
          }
          
          .arrow-icon {
            width: 32px;
            height: 32px;
          }
          
          .arrow-btn {
            padding: 12px;
          }
          
          .slide-centered__headline {
            font-size: 24px;
          }
        }

        @media (max-width: 768px) {
          .section3-title-container {
            font-size: 36px;
          }
          
          .new-arrivals-image-container {
            width: 95%;
            aspect-ratio: 16 / 9;
          }
          
          .new-arrivals-nav-overlay {
            padding: 0 12px;
          }
          
          .arrow-btn {
            padding: 10px;
          }
          
          .arrow-icon {
            width: 28px;
            height: 28px;
          }
          
          .slide-centered__content {
            padding: 25px;
            gap: 15px;
          }
          
          .slide-centered__headline {
            font-size: 20px;
          }
          
          .slide-centered__action {
            padding: 0.75rem 1.5rem;
            font-size: 13px;
          }
        }

        @media (max-width: 640px) {
          .new-arrivals-title-container {
            padding: 30px 15px 20px;
          }
          
          .section3-title-container {
            font-size: 32px;
          }
          
          .new-arrivals-slider-container {
            padding: 0;
          }
          
          .new-arrivals-image-container {
            width: 95%;
            aspect-ratio: 16 / 10;
          }
          
          .new-arrivals-nav-overlay {
            padding: 0 10px;
          }
          
          .arrow-btn {
            padding: 8px;
          }
          
          .arrow-icon {
            width: 24px;
            height: 24px;
          }
          
          .slide-centered__content {
            padding: 20px;
            gap: 12px;
          }
          
          .slide-centered__headline {
            font-size: 18px;
          }
          
          .new-arrivals-indicators {
            gap: 10px;
            padding: 25px 0 40px;
          }
          
          .indicator-dot {
            width: 5px;
            height: 5px;
          }
        }

        @media (max-width: 480px) {
          .section3-title-container {
            font-size: 28px;
          }
          
          .new-arrivals-image-container {
            width: 95%;
          }
          
          .new-arrivals-nav-overlay {
            padding: 0 8px;
          }
          
          .arrow-btn {
            padding: 6px;
          }
          
          .arrow-icon {
            width: 20px;
            height: 20px;
          }
          
          .slide-centered__headline {
            font-size: 16px;
          }
        }
      `}</style>
    </section>
  );
};

export default EmptySection;