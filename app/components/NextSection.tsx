'use client';

import React, { useLayoutEffect, useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';


const cardImages = {
  // Left Column Cards
  leftCard1: '/images/5_1.jpg',      
  leftCard2: '/images/6_2.jpg',      
  // Right Column Cards
  rightCard1: '/images/10_1.jpg',     
  rightCard2: '/images/16_2.jpg',     
};


interface NextSectionProps {
  scrollProgress: number;
  section2to3Progress: number;
}

const NextSection: React.FC<NextSectionProps> = ({ scrollProgress, section2to3Progress }) => {
  const [vh, setVh] = useState(900);
  const [titleRevealed, setTitleRevealed] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const titleRevealedRef = useRef(false);

  useLayoutEffect(() => {
    const updateHeight = () => {
      setVh(window.innerHeight);
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  
  useEffect(() => {
    if (scrollProgress > 0.6 && !titleRevealedRef.current) {
      const timer = setTimeout(() => {
        titleRevealedRef.current = true;
        setTitleRevealed(true);
      }, 200);
      return () => clearTimeout(timer);
    }
    if (scrollProgress < 0.3 && titleRevealedRef.current) {
      titleRevealedRef.current = false;
      queueMicrotask(() => setTitleRevealed(false));
    }
  }, [scrollProgress]);

  
  const cardsOpacity = Math.min(Math.max((scrollProgress - 0.3) / 0.4, 0), 1);
  const cardsVisible = scrollProgress > 0.4;

  
  const bgOpacity = Math.min(scrollProgress * 1.5, 1);

  // Hide section 2 when transitioning to section 3
  // Scale and rotate effect during transition (like slideshow)
  const transitionScale = 1 + (0.1 * section2to3Progress);
  const transitionRotation = 2 * section2to3Progress;
  const sectionOpacity = 1 - section2to3Progress;

  // Hide completely when transition is complete
  if (section2to3Progress >= 1) {
    return null;
  }

  return (
    <>
      <section
        className="fixed inset-0 w-full h-screen overflow-hidden"
        style={{
          background: `rgba(245, 240, 230, ${bgOpacity})`,
          zIndex: 0,
          pointerEvents: scrollProgress > 0.1 && section2to3Progress < 0.5 ? 'auto' : 'none',
          transform: `scale(${transitionScale}) rotate(${transitionRotation}deg)`,
          transformOrigin: 'center center',
          opacity: sectionOpacity,
        }}
      >
        {/* Cards Grid Layout - Matching Lightship RV */}
        <div
          className="absolute inset-0 flex items-start justify-center pt-20 px-8"
          style={{
            opacity: cardsOpacity,
          }}
        >
          <div className="w-full max-w-[1400px] mx-auto">
            <div className="grid grid-cols-3 gap-5 items-start">
              {/* Left Column */}
              <div className="flex flex-col gap-5 pt-24">
                {/* Left Card 1 - Update cardImages.leftCard1 above to use your image */}
                <div
                  className="rounded-2xl overflow-hidden aspect-[4/3] shadow-lg relative"
                  style={{
                    opacity: cardsVisible ? 1 : 0,
                    transform: cardsVisible ? 'translateY(0)' : 'translateY(50px)',
                    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.1s',
                  }}
                >
                  <Image
                    src={cardImages.leftCard1}
                    alt="Product Card 1"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: 'cover' }}
                  />
                  {/* Fallback gradient if image doesn't load */}
                  <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(180deg, #8b9aad 0%, #6b7d8c 50%, #4a5a6a 100%)' }} />
                </div>
                
                {/* Left Card 2 - Update cardImages.leftCard2 above to use your image */}
                <div
                  className="rounded-2xl overflow-hidden aspect-[4/3] shadow-lg relative"
                  style={{
                    opacity: cardsVisible ? 1 : 0,
                    transform: cardsVisible ? 'translateY(0)' : 'translateY(50px)',
                    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s',
                  }}
                >
                  <Image
                    src={cardImages.leftCard2}
                    alt="Product Card 2"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: 'cover' }}
                  />
                  {/* Fallback gradient if image doesn't load */}
                  <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(180deg, #c4b8a8 0%, #a89888 50%, #8c7868 100%)' }} />
                </div>
              </div>

              {/* Center Column - Space for video card */}
              <div className="flex flex-col items-center pt-0">
                {/* This is where the video card lands - just a spacer */}
                <div style={{ height: `${Math.min(650, vh * 0.72) + 120}px` }} />
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-5 pt-48">
                {/* Right Card 1 - Update cardImages.rightCard1 above to use your image */}
                <div
                  className="rounded-2xl overflow-hidden aspect-[4/3] shadow-lg relative"
                  style={{
                    opacity: cardsVisible ? 1 : 0,
                    transform: cardsVisible ? 'translateY(0)' : 'translateY(50px)',
                    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.15s',
                  }}
                >
                  <Image
                    src={cardImages.rightCard1}
                    alt="Product Card 3"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: 'cover' }}
                  />
                  {/* Fallback gradient if image doesn't load */}
                  <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(180deg, #87CEEB 0%, #FFB366 50%, #FF6B6B 75%, #2c3e50 100%)' }} />
                </div>
                
                {/* Right Card 2 - Update cardImages.rightCard2 above to use your image */}
                <div
                  className="rounded-2xl overflow-hidden aspect-[4/3] shadow-lg relative"
                  style={{
                    opacity: cardsVisible ? 1 : 0,
                    transform: cardsVisible ? 'translateY(0)' : 'translateY(50px)',
                    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.3s',
                  }}
                >
                  <Image
                    src={cardImages.rightCard2}
                    alt="Product Card 4"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: 'cover' }}
                  />
                  {/* Fallback gradient if image doesn't load */}
                  <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(180deg, #8B7355 0%, #D2B48C 50%, #654321 100%)' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Content - "Our Products" title on left, description on right, button centered */}
        <div
          className="absolute bottom-0 left-0 right-0 pb-16 px-12"
          style={{
            opacity: cardsOpacity,
          }}
        >
          {/* Left - "Our Products" title */}
          <div className="absolute left-12 bottom-28">
            <h2 className="section2-title-container">
              <span className="section2-word-reveal">
                <span
                  className={`section2-word-reveal-inner section2-word-delay-0 ${titleRevealed ? 'revealed' : ''}`}
                >
                  Our
                </span>
              </span>
              {' '}
              <span className="section2-word-reveal">
                <span
                  className={`section2-word-reveal-inner section2-word-delay-1 ${titleRevealed ? 'revealed' : ''}`}
                >
                  Products
                </span>
              </span>
            </h2>
          </div>

          {/* Right - Description text */}
          <div className="absolute right-12 bottom-28 max-w-[420px] text-right">
            <p className={`section2-description section2-word-reveal-inner section2-word-delay-2 ${titleRevealed ? 'revealed' : ''}`}>
              We believe in creating products that transform everyday moments into extraordinary experiences. Our vision is to bring innovation and quality to every kitchen.
            </p>
          </div>

          {/* Center - "Explore Us" button - positioned higher */}
          <div className="flex justify-center" style={{ marginBottom: '60px' }}>
            <Link
              href="/store"
              className={`section2-explore-btn ${titleRevealed ? 'revealed' : ''}`}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
              style={{
                backgroundColor: isButtonHovered ? '#ffffff' : 'transparent',
                color: '#000000',
                borderColor: '#000000',
              }}
            >
              Explore Us
            </Link>
          </div>
        </div>
      </section>

      {/* Section 2 Styles */}
      <style jsx global>{`
        /* Section 2 Title Styles - "Our Products" */
        .section2-title-container {
          font-family: sans-serif;
          font-size: 72px;
          line-height: 1;
          color: #000000;
          font-weight: 300;
          letter-spacing: -0.02em;
        }

        /* Section 2 Description */
        .section2-description {
          font-family: sans-serif;
          font-size: 24px;
          line-height: 1.4;
          color: #000000;
          font-weight: 400;
        }

        /* Word by Word Reveal Animation for Section 2 */
        .section2-word-reveal {
          display: inline-block;
          overflow: hidden;
          vertical-align: bottom;
        }

        .section2-word-reveal-inner {
          display: inline-block;
          transform: translateY(100%);
          opacity: 0;
        }

        .section2-word-reveal-inner.revealed {
          transform: translateY(0);
          opacity: 1;
        }

        /* Staggered animation delays for Section 2 */
        .section2-word-delay-0 {
          transition: transform 1s cubic-bezier(0.23, 1, 0.32, 1) 0.2s,
                      opacity 0.8s ease-out 0.2s;
        }

        .section2-word-delay-1 {
          transition: transform 1s cubic-bezier(0.23, 1, 0.32, 1) 0.4s,
                      opacity 0.8s ease-out 0.4s;
        }

        .section2-word-delay-2 {
          transition: transform 1s cubic-bezier(0.23, 1, 0.32, 1) 0.5s,
                      opacity 0.8s ease-out 0.5s;
        }

        /* Explore Us Button */
        .section2-explore-btn {
          font-family: sans-serif;
          font-size: 16px;
          font-weight: 500;
          padding: 14px 32px;
          border: 2px solid #000000;
          border-radius: 50px;
          background-color: transparent;
          color: #000000;
          cursor: pointer;
          transition: background-color 0.3s ease, transform 0.2s ease;
          opacity: 0;
          transform: translateY(20px);
        }

        .section2-explore-btn.revealed {
          opacity: 1;
          transform: translateY(0);
          transition: background-color 0.3s ease, transform 0.2s ease, opacity 0.8s ease-out 0.6s;
        }

        .section2-explore-btn:hover {
          background-color: #ffffff !important;
        }

        .section2-explore-btn:active {
          transform: translateY(2px);
        }

        /* Responsive Section 2 Title */
        @media (max-width: 1024px) {
          .section2-title-container {
            font-size: 56px;
          }
          .section2-description {
            font-size: 20px;
          }
        }

        @media (max-width: 768px) {
          .section2-title-container {
            font-size: 48px;
          }
          .section2-description {
            font-size: 18px;
          }
        }

        @media (max-width: 480px) {
          .section2-title-container {
            font-size: 36px;
          }
          .section2-description {
            font-size: 16px;
          }
        }
      `}</style>
    </>
  );
};

export default NextSection;