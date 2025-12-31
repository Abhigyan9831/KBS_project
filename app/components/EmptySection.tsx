'use client';

import React, { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface EmptySectionProps {
  transitionProgress: number;
  nextTransitionProgress: number;
  zIndexBase?: number;
  shutterZIndex?: number;
  bgColor?: string;
  bgColorStyle?: string;
}

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

// Slide data - Update the 'src' paths to use your local images
// Place your images in the public/images folder and update paths like: '/images/your-image.jpg'
const slideData = [
  {
    index: 0,
    headline: 'Smart Bread Maker',
    button: 'Shop now',
    src: '/images/3_1.jpg' // Replace with your local image
  },
  {
    index: 1,
    headline: 'Precion and Engineering',
    button: 'Shop now',
    src: '/images/16_2.jpg' // Replace with your local image
  },
  {
    index: 2,
    headline: 'For Your Current Mood',
    button: 'Shop now',
    src: '/images/6_2.jpg' // Replace with your local image
  },
  {
    index: 3,
    headline: 'Modern Designs',
    button: 'Shop now',
    src: '/images/ui.jpg' // Replace with your local image
  }
];

// Slide Component
interface SlideProps {
  slide: typeof slideData[0];
  current: number;
  handleSlideClick: (index: number) => void;
}

const Slide: React.FC<SlideProps> = ({ slide, current, handleSlideClick }) => {
  const slideRef = useRef<HTMLLIElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLLIElement>) => {
    const el = slideRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setMousePos({
      x: event.clientX - (r.left + Math.floor(r.width / 2)),
      y: event.clientY - (r.top + Math.floor(r.height / 2))
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMousePos({ x: 0, y: 0 });
  }, []);

  const handleClick = useCallback(() => {
    handleSlideClick(slide.index);
  }, [handleSlideClick, slide.index]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const { src, button, headline, index } = slide;
  const isCurrent = current === index;
  const isPrevious = current - 1 === index;
  const isNext = current + 1 === index;

  // Calculate transforms based on mouse position for parallax effect
  const imageWrapperTransform = isCurrent
    ? `scale(1.025) translate(${mousePos.x / 50}px, ${mousePos.y / 50}px)`
    : 'none';
  
  const imageTransform = isCurrent
    ? `translate(${mousePos.x / 20}px, ${mousePos.y / 20}px)`
    : 'none';
  
  const contentTransform = isCurrent
    ? `translate(${-mousePos.x / 60}px, ${-mousePos.y / 60}px)`
    : 'none';

  let slideClasses = 'slide';
  if (isCurrent) slideClasses += ' slide--current';
  else if (isPrevious) slideClasses += ' slide--previous';
  else if (isNext) slideClasses += ' slide--next';

  return (
    <li
      ref={slideRef}
      className={slideClasses}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="slide__image-wrapper"
        style={{ transform: imageWrapperTransform }}
      >
        <Image
          className="slide__image"
          alt={headline}
          src={src}
          fill
          sizes="70vmin"
          priority={index === 0}
          onLoad={handleImageLoad}
          style={{
            opacity: imageLoaded ? 1 : 0,
            transform: imageTransform,
            objectFit: 'cover',
            objectPosition: 'center'
          }}
        />
        {/* Fallback gradient if image doesn't load */}
        <div className="slide__image-fallback" />
      </div>

      {/* Headline - positioned higher */}
      <article
        className={`slide__content slide__content--headline ${isCurrent ? 'slide__content--visible' : ''}`}
        style={{ transform: contentTransform }}
      >
        <h2 className="slide__headline">{headline}</h2>
      </article>
      
      {/* Button - positioned at bottom center of image */}
      <div
        className={`slide__button-wrapper ${isCurrent ? 'slide__button-wrapper--visible' : ''}`}
      >
        <Link href="/store" className="slide__action">{button}</Link>
      </div>
    </li>
  );
};

// Slider Control Component
interface SliderControlProps {
  type: 'previous' | 'next';
  title: string;
  handleClick: () => void;
}

const SliderControl: React.FC<SliderControlProps> = ({ type, title, handleClick }) => {
  return (
    <button 
      className={`slider-btn slider-btn--${type}`} 
      title={title} 
      onClick={handleClick}
    >
      <svg className="slider-icon" viewBox="0 0 24 24">
        <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
      </svg>
    </button>
  );
};

const EmptySection: React.FC<EmptySectionProps> = ({
  transitionProgress,
  nextTransitionProgress,
  zIndexBase = 10,
  shutterZIndex = 100,
}) => {
  const [current, setCurrent] = useState(0);
  const [titleRevealed, setTitleRevealed] = useState(false);
  const titleRevealedRef = useRef(false);
  const { isMobile, isTablet } = useResponsive();

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
      // Reset reveal state when scrolling back up - using a microtask to avoid sync setState
      queueMicrotask(() => setTitleRevealed(false));
    }
  }, [transitionProgress]);

  // Shutter animation calculations
  let decoTopY, decoBottomY;
  
  if (transitionProgress <= 0.5) {
    const t = transitionProgress * 2;
    const easeProgress = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    decoTopY = -100 + (100 * easeProgress);
    decoBottomY = 100 - (100 * easeProgress);
  } else {
    const t = (transitionProgress - 0.5) * 2;
    const easeProgress = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    decoTopY = 0 - (100 * easeProgress);
    decoBottomY = 0 + (100 * easeProgress);
  }

  const revealProgress = Math.max(0, (transitionProgress - 0.5) / 0.5);
  const imageScale = 1.15 - (0.15 * revealProgress);
  const imageRotation = 3 - (3 * revealProgress);
  const contentOpacity = transitionProgress > 0.7 ? (transitionProgress - 0.7) / 0.3 : 0;
  const decoOpacity = transitionProgress > 0 && transitionProgress < 1 ? 1 : 0;
  const sectionOpacity = transitionProgress > 0 ? 1 : 0;
  const sectionZIndex = transitionProgress > 0.3 ? zIndexBase : -1;
  const finalOpacity = sectionOpacity * (1 - nextTransitionProgress);

  const handlePreviousClick = useCallback(() => {
    setCurrent(prev => (prev - 1 < 0) ? slideData.length - 1 : prev - 1);
  }, []);

  const handleNextClick = useCallback(() => {
    setCurrent(prev => (prev + 1 === slideData.length) ? 0 : prev + 1);
  }, []);

  const handleSlideClick = useCallback((index: number) => {
    if (current !== index) {
      setCurrent(index);
    }
  }, [current]);

  const wrapperTransform = {
    transform: `translateX(-${current * (100 / slideData.length)}%)`
  };

  return (
    <>
      {/* Shutter panels */}
      <div
        className="fixed top-0 left-0 w-full pointer-events-none"
        style={{
          height: '50vh',
          background: '#0a0a0a',
          transform: `translateY(${decoTopY}%)`,
          opacity: decoOpacity,
          zIndex: shutterZIndex,
        }}
      />
      <div
        className="fixed left-0 w-full pointer-events-none"
        style={{
          top: '50vh',
          height: '50vh',
          background: '#0a0a0a',
          transform: `translateY(${decoBottomY}%)`,
          opacity: decoOpacity,
          zIndex: shutterZIndex,
        }}
      />

      {/* Section */}
      <section
        className="fixed inset-0 w-full h-screen overflow-hidden"
        style={{
          opacity: finalOpacity,
          zIndex: sectionZIndex,
          pointerEvents: transitionProgress > 0.5 && nextTransitionProgress < 0.5 ? 'auto' : 'none',
          transform: `scale(${1 + 0.1 * nextTransitionProgress}) rotate(${2 * nextTransitionProgress}deg)`,
        }}
      >
        {/* Background - Same cream color as section 2 */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{ backgroundColor: 'rgb(245, 240, 230)' }}
        />

        {/* Main Content Container - Responsive layout */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            opacity: contentOpacity,
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
          }}
        >
          {/* Mobile Layout */}
          {isMobile ? (
            <>
              {/* Title at top on mobile - visible in the space below navbar */}
              <div
                className="z-30 flex items-center justify-center"
                style={{
                  paddingTop: '100px',
                  paddingBottom: '16px',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  minHeight: '140px',
                }}
              >
                <h2 className="section3-title-container flex flex-row items-baseline gap-3 justify-center">
                  <span className="section3-word-reveal">
                    <span
                      className={`section3-word-reveal-inner section3-word-delay-0 ${titleRevealed ? 'revealed' : ''}`}
                    >
                      New
                    </span>
                  </span>
                  <span className="section3-word-reveal">
                    <span
                      className={`section3-word-reveal-inner section3-word-delay-1 ${titleRevealed ? 'revealed' : ''}`}
                    >
                      Arrivals
                    </span>
                  </span>
                </h2>
              </div>

              {/* Slider below title on mobile */}
              <div
                className="flex-1 overflow-hidden"
                style={{
                  transform: `scale(${imageScale}) rotate(${imageRotation}deg)`,
                  transformOrigin: 'center center',
                }}
              >
                <div className="relative z-10 h-full w-full flex items-center justify-center">
                  <div className="slider slider--mobile" aria-label="Product Slider">
                    <ul className="slider__wrapper" style={wrapperTransform}>
                      {slideData.map(slide => (
                        <Slide
                          key={slide.index}
                          slide={slide}
                          current={current}
                          handleSlideClick={handleSlideClick}
                        />
                      ))}
                    </ul>

                    <div className="slider__controls">
                      <SliderControl
                        type="previous"
                        title="Go to previous slide"
                        handleClick={handlePreviousClick}
                      />
                      <SliderControl
                        type="next"
                        title="Go to next slide"
                        handleClick={handleNextClick}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Left Column - Title "New Arrivals" */}
              <div
                className="h-full flex items-center z-30"
                style={{
                  width: isTablet ? '30%' : '35%',
                  paddingLeft: isTablet ? '3%' : '5%',
                }}
              >
                <h2 className="section3-title-container flex flex-col items-start">
                  {/* "New" word - first line */}
                  <span className="section3-word-reveal">
                    <span
                      className={`section3-word-reveal-inner section3-word-delay-0 ${titleRevealed ? 'revealed' : ''}`}
                    >
                      New
                    </span>
                  </span>
                  
                  {/* "Arrivals" word - second line */}
                  <span className="section3-word-reveal">
                    <span
                      className={`section3-word-reveal-inner section3-word-delay-1 ${titleRevealed ? 'revealed' : ''}`}
                    >
                      Arrivals
                    </span>
                  </span>
                </h2>
              </div>

              {/* Right Column - Slider */}
              <div
                className="h-full overflow-hidden"
                style={{
                  width: isTablet ? '70%' : '65%',
                  transform: `scale(${imageScale}) rotate(${imageRotation}deg)`,
                  transformOrigin: 'center center',
                }}
              >
                {/* Slider Container */}
                <div className="relative z-10 h-full w-full flex items-center justify-center">
                  <div className={`slider ${isTablet ? 'slider--tablet' : ''}`} aria-label="Product Slider">
                    <ul className="slider__wrapper" style={wrapperTransform}>
                      {slideData.map(slide => (
                        <Slide
                          key={slide.index}
                          slide={slide}
                          current={current}
                          handleSlideClick={handleSlideClick}
                        />
                      ))}
                    </ul>

                    <div className="slider__controls">
                      <SliderControl
                        type="previous"
                        title="Go to previous slide"
                        handleClick={handlePreviousClick}
                      />
                      <SliderControl
                        type="next"
                        title="Go to next slide"
                        handleClick={handleNextClick}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Slider Styles */}
      <style jsx global>{`
        .slider {
          --slide-size: 70vmin;
          --slide-margin: 4vmin;
          --base-duration: 600ms;
          --base-ease: cubic-bezier(0.25, 0.46, 0.45, 0.84);
          
          height: var(--slide-size);
          margin: 0 auto;
          position: relative;
          width: var(--slide-size);
        }

        /* Mobile slider adjustments */
        .slider--mobile {
          --slide-size: min(75vw, 320px);
          --slide-margin: 3vmin;
        }

        /* Tablet slider adjustments */
        .slider--tablet {
          --slide-size: 55vmin;
          --slide-margin: 3vmin;
        }

        .slider__wrapper {
          display: flex;
          margin: 0 calc(var(--slide-margin) * -1);
          position: absolute;
          transition: transform var(--base-duration) cubic-bezier(0.25, 1, 0.35, 1);
          list-style: none;
          padding: 0;
        }

        .slider__controls {
          display: flex;
          justify-content: center;
          position: absolute;
          top: calc(100% + 1rem);
          width: 100%;
        }

        .slider-btn {
          --size: 3rem;
          align-items: center;
          background-color: transparent;
          border: 3px solid transparent;
          border-radius: 100%;
          display: flex;
          height: var(--size);
          padding: 0;
          width: var(--size);
          cursor: pointer;
          transition: border-color 0.3s ease;
        }

        .slider-btn:hover {
          border-color: rgba(0, 0, 0, 0.3);
        }

        .slider-btn:focus {
          border-color: #6D64F7;
          outline: none;
        }

        .slider-btn--previous svg {
          transform: rotate(180deg);
        }

        .slider-icon {
          fill: #000000;
          width: 100%;
        }

        .slide {
          align-items: center;
          color: #000000;
          display: flex;
          flex: 1;
          flex-direction: column;
          height: var(--slide-size);
          justify-content: center;
          margin: 0 var(--slide-margin);
          opacity: 0.25;
          position: relative;
          text-align: center;
          transition: 
            opacity calc(var(--base-duration) / 2) var(--base-ease),
            transform calc(var(--base-duration) / 2) var(--base-ease);
          width: var(--slide-size);
          z-index: 1;
          cursor: pointer;
          flex-shrink: 0;
        }

        .slide--previous:hover,
        .slide--next:hover {
          opacity: 0.5;
        }

        .slide--previous {
          cursor: w-resize;
        }

        .slide--previous:hover {
          transform: translateX(2%);
        }

        .slide--next {
          cursor: e-resize;
        }

        .slide--next:hover {
          transform: translateX(-2%);
        }

        .slide--current {
          opacity: 1;
          pointer-events: auto;
          user-select: auto;
        }

        .slide__image-wrapper {
          background-color: #e5e0d6;
          border-radius: 8px;
          height: 100%;
          left: 0;
          overflow: hidden;
          position: absolute;
          top: 0;
          transition: transform calc(var(--base-duration) / 4) var(--base-ease);
          width: 100%;
        }

        .slide__image {
          height: 100%;
          left: 0;
          object-fit: cover;
          object-position: center;
          pointer-events: none;
          position: absolute;
          top: 0;
          transition:
            opacity var(--base-duration) var(--base-ease),
            transform var(--base-duration) var(--base-ease);
          user-select: none;
          width: 100%;
        }

        .slide__image-fallback {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #d4cfc5 0%, #e5e0d6 50%, #d4cfc5 100%);
          z-index: -1;
        }

        .slide__content {
          padding: 4vmin;
          position: relative;
          opacity: 0;
          visibility: hidden;
          transition:
            opacity calc(var(--base-duration) / 2) var(--base-ease),
            transform var(--base-duration) var(--base-ease);
        }

        .slide__content--headline {
          margin-top: -12rem;
        }

        .slide__content--visible {
          opacity: 1;
          visibility: visible;
        }

        .slide__button-wrapper {
          position: absolute;
          bottom: 8%;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          opacity: 0;
          visibility: hidden;
          transition:
            opacity calc(var(--base-duration) / 2) var(--base-ease);
          z-index: 10;
        }

        .slide__button-wrapper--visible {
          opacity: 1;
          visibility: visible;
        }

        .slide__headline {
          font-family: sans-serif;
          font-size: 24px;
          font-weight: 400;
          position: relative;
          color: #000000;
          line-height: 1.3;
        }

        .slide__action {
          background-color: #000000;
          border: none;
          border-radius: 4px;
          color: #ffffff;
          cursor: pointer;
          font-family: sans-serif;
          font-size: 14px;
          font-weight: 400;
          padding: 0.875rem 2rem;
          transition: background-color 0.3s ease, transform 0.2s ease;
        }

        .slide__action:hover {
          background-color: #ff6b00;
        }

        .slide__action:focus {
          outline-color: #6D64F7;
          outline-offset: 2px;
          outline-style: solid;
          outline-width: 3px;
        }

        .slide__action:active {
          transform: translateY(1px);
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Section 3 Title Styles - "New Arrivals" */
        .section3-title-container {
          font-family: sans-serif;
          font-size: 72px;
          line-height: 0.95;
          color: #000000;
          font-weight: 300;
          letter-spacing: -0.02em;
        }

        /* Word by Word Reveal Animation for Section 3 */
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

        /* Staggered animation delays for Section 3 title */
        .section3-word-delay-0 {
          transition: transform 1s cubic-bezier(0.23, 1, 0.32, 1) 0.2s,
                      opacity 0.8s ease-out 0.2s;
        }

        .section3-word-delay-1 {
          transition: transform 1s cubic-bezier(0.23, 1, 0.32, 1) 0.4s,
                      opacity 0.8s ease-out 0.4s;
        }

        /* Responsive Section 3 Title */
        @media (max-width: 1024px) {
          .section3-title-container {
            font-size: 52px;
          }
          .slider {
            --slide-size: 55vmin;
          }
          .slide__headline {
            font-size: 20px;
          }
        }

        @media (max-width: 768px) {
          .section3-title-container {
            font-size: 42px;
          }
          .slider {
            --slide-size: 50vmin;
          }
          .slide__headline {
            font-size: 18px;
          }
          .slide__content--headline {
            margin-top: -8rem;
          }
        }

        @media (max-width: 640px) {
          .section3-title-container {
            font-size: 36px;
          }
          .slider {
            --slide-size: min(75vw, 280px);
            --slide-margin: 2vmin;
          }
          .slide__headline {
            font-size: 16px;
          }
          .slide__content--headline {
            margin-top: -6rem;
          }
          .slide__action {
            padding: 0.75rem 1.5rem;
            font-size: 13px;
          }
          .slider-btn {
            --size: 2.5rem;
          }
          .slide__button-wrapper {
            bottom: 6%;
          }
        }

        @media (max-width: 480px) {
          .section3-title-container {
            font-size: 32px;
          }
          .slider {
            --slide-size: min(80vw, 260px);
          }
          .slide__headline {
            font-size: 15px;
          }
          .slide__content {
            padding: 3vmin;
          }
          .slide__content--headline {
            margin-top: -5rem;
          }
        }

        @media (max-width: 360px) {
          .section3-title-container {
            font-size: 28px;
          }
          .slider {
            --slide-size: min(85vw, 240px);
          }
          .slide__headline {
            font-size: 14px;
          }
        }
      `}</style>
    </>
  );
};

export default EmptySection;