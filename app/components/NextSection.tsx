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
  const [dimensions, setDimensions] = useState({
    vh: 900,
    vw: 1200,
    isMobile: false,
    isTablet: false,
  });
  const [titleRevealed, setTitleRevealed] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const titleRevealedRef = useRef(false);

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

  const { vh, isMobile, isTablet } = dimensions;

  
  // For mobile: reveal title immediately when section 2 starts (scrollProgress > 0.1)
  // For desktop/tablet: use original delayed reveal
  useEffect(() => {
    if (isMobile) {
      // On mobile, reveal immediately when section 2 appears
      if (scrollProgress > 0.1 && !titleRevealedRef.current) {
        titleRevealedRef.current = true;
        setTitleRevealed(true);
      }
      if (scrollProgress < 0.05 && titleRevealedRef.current) {
        titleRevealedRef.current = false;
        queueMicrotask(() => setTitleRevealed(false));
      }
    } else {
      // Desktop/tablet: original behavior
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
    }
  }, [scrollProgress, isMobile]);

  
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

  // Calculate mobile content opacity - appears when scrollProgress > 0.3 (video shrunk enough)
  const mobileContentOpacity = isMobile ? Math.min(Math.max((scrollProgress - 0.3) / 0.4, 0), 1) : 0;

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
        {/* Cards Grid Layout - Only for Desktop/Tablet, NO cards on mobile */}
        {!isMobile && (
          <div
            className="absolute inset-0 flex items-start justify-center"
            style={{
              opacity: cardsOpacity,
              paddingTop: isTablet ? '100px' : '80px',
              paddingLeft: isTablet ? '24px' : '32px',
              paddingRight: isTablet ? '24px' : '32px',
              overflowY: 'hidden',
              overflowX: 'hidden',
            }}
          >
            <div className="w-full max-w-[1400px] mx-auto">
              {/* Desktop/Tablet Layout - 3 column grid */}
              <div
                className="grid gap-4 items-start"
                style={{
                  gridTemplateColumns: isTablet ? '1fr 1.2fr 1fr' : '1fr 1fr 1fr',
                  gap: isTablet ? '16px' : '20px',
                }}
              >
                {/* Left Column */}
                <div
                  className="flex flex-col"
                  style={{
                    gap: isTablet ? '16px' : '20px',
                    paddingTop: isTablet ? '60px' : '96px',
                  }}
                >
                  {/* Left Card 1 */}
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
                      sizes="(max-width: 1024px) 33vw, 400px"
                      style={{ objectFit: 'cover' }}
                    />
                    <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(180deg, #8b9aad 0%, #6b7d8c 50%, #4a5a6a 100%)' }} />
                  </div>
                  
                  {/* Left Card 2 */}
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
                      sizes="(max-width: 1024px) 33vw, 400px"
                      style={{ objectFit: 'cover' }}
                    />
                    <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(180deg, #c4b8a8 0%, #a89888 50%, #8c7868 100%)' }} />
                  </div>
                </div>

                {/* Center Column - Space for video card */}
                <div className="flex flex-col items-center pt-0">
                  <div style={{ height: `${Math.min(isTablet ? 500 : 650, vh * 0.72) + (isTablet ? 80 : 120)}px` }} />
                </div>

                {/* Right Column */}
                <div
                  className="flex flex-col"
                  style={{
                    gap: isTablet ? '16px' : '20px',
                    paddingTop: isTablet ? '120px' : '192px',
                  }}
                >
                  {/* Right Card 1 */}
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
                      sizes="(max-width: 1024px) 33vw, 400px"
                      style={{ objectFit: 'cover' }}
                    />
                    <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(180deg, #87CEEB 0%, #FFB366 50%, #FF6B6B 75%, #2c3e50 100%)' }} />
                  </div>
                  
                  {/* Right Card 2 */}
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
                      sizes="(max-width: 1024px) 33vw, 400px"
                      style={{ objectFit: 'cover' }}
                    />
                    <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(180deg, #8B7355 0%, #D2B48C 50%, #654321 100%)' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Content - Title/Description BELOW video (BLACK text on cream bg), Button at bottom */}
        {isMobile && (
          <>
            {/* Title and Description - Positioned BELOW the video area */}
            <div
              className="absolute left-0 right-0 flex flex-col items-center px-4"
              style={{
                // Position below video: video top (80px) + video height (~55vh or 400px max)
                top: `calc(80px + min(55vh, 400px) + 24px)`,
                opacity: mobileContentOpacity,
                transform: `translateY(${mobileContentOpacity > 0 ? 0 : 20}px)`,
                transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
              }}
            >
              <div className="flex flex-col items-center gap-3 text-center">
                {/* Title in BLACK */}
                <h2 className="section2-title-container-mobile text-center">
                  <span className="section2-word-reveal">
                    <span
                      className={`section2-word-reveal-inner section2-word-delay-0 ${titleRevealed ? 'revealed' : ''}`}
                      style={{ color: '#000000' }}
                    >
                      Our
                    </span>
                  </span>
                  {' '}
                  <span className="section2-word-reveal">
                    <span
                      className={`section2-word-reveal-inner section2-word-delay-1 ${titleRevealed ? 'revealed' : ''}`}
                      style={{ color: '#000000' }}
                    >
                      Products
                    </span>
                  </span>
                </h2>
                
                {/* Description in BLACK */}
                <p
                  className={`section2-description-mobile section2-word-reveal-inner section2-word-delay-2 text-center max-w-[300px] ${titleRevealed ? 'revealed' : ''}`}
                  style={{ color: '#333333' }}
                >
                  We believe in creating products that transform everyday moments into extraordinary experiences.
                </p>
              </div>
            </div>
            
            {/* Explore Us Button - At the bottom with black borders only */}
            <div
              className="absolute left-0 right-0 flex justify-center"
              style={{
                bottom: '12%',
                opacity: mobileContentOpacity,
                transform: `translateY(${mobileContentOpacity > 0 ? 0 : 10}px)`,
                transition: 'opacity 0.5s ease-out 0.2s, transform 0.5s ease-out 0.2s',
                pointerEvents: mobileContentOpacity > 0.5 ? 'auto' : 'none',
              }}
            >
              <Link
                href="/store"
                className={`section2-explore-btn-mobile ${titleRevealed ? 'revealed' : ''}`}
                onMouseEnter={() => setIsButtonHovered(true)}
                onMouseLeave={() => setIsButtonHovered(false)}
                style={{
                  backgroundColor: 'transparent',
                  color: '#000000',
                  borderColor: '#000000',
                }}
              >
                Explore Us
              </Link>
            </div>
          </>
        )}

        {/* Desktop/Tablet Content - Original layout */}
        {!isMobile && (
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              opacity: cardsOpacity,
              paddingBottom: isTablet ? '32px' : '64px',
              paddingLeft: isTablet ? '24px' : '48px',
              paddingRight: isTablet ? '24px' : '48px',
            }}
          >
            {isTablet ? (
              /* Tablet Layout - Title and description stacked, button below */
              <div className="flex flex-col items-center gap-5">
                <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
                  {/* Title */}
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
                  
                  {/* Description */}
                  <p className={`section2-description section2-word-reveal-inner section2-word-delay-2 max-w-[360px] text-right ${titleRevealed ? 'revealed' : ''}`}>
                    We believe in creating products that transform everyday moments into extraordinary experiences.
                  </p>
                </div>
                
                {/* Button centered */}
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
            ) : (
              /* Desktop Layout - Original layout with absolute positioning */
              <>
                {/* Left - "Our Products" title */}
                <div
                  className="absolute"
                  style={{
                    left: '48px',
                    bottom: '112px',
                  }}
                >
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
                <div
                  className="absolute max-w-[420px] text-right"
                  style={{
                    right: '48px',
                    bottom: '112px',
                  }}
                >
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
              </>
            )}
          </div>
        )}
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
          /* Touch-friendly tap target */
          min-height: 48px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
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

        /* Mobile-specific title styles (BLACK text on cream bg) */
        .section2-title-container-mobile {
          font-family: sans-serif;
          font-size: 36px;
          line-height: 1;
          color: #000000;
          font-weight: 300;
          letter-spacing: -0.02em;
        }

        .section2-description-mobile {
          font-family: sans-serif;
          font-size: 15px;
          line-height: 1.5;
          color: #333333;
          font-weight: 400;
        }

        /* Mobile Explore Us Button - black border only */
        .section2-explore-btn-mobile {
          font-family: sans-serif;
          font-size: 14px;
          font-weight: 500;
          padding: 12px 28px;
          border: 2px solid #000000;
          border-radius: 50px;
          background-color: transparent;
          color: #000000;
          cursor: pointer;
          transition: background-color 0.3s ease, transform 0.2s ease, opacity 0.5s ease-out;
          opacity: 0;
          transform: translateY(10px);
          min-height: 48px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .section2-explore-btn-mobile.revealed {
          opacity: 1;
          transform: translateY(0);
        }

        /* Responsive styles */
        @media (max-width: 1024px) {
          .section2-title-container {
            font-size: 56px;
          }
          .section2-description {
            font-size: 20px;
            max-width: 360px;
          }
        }

        @media (max-width: 768px) {
          .section2-title-container {
            font-size: 42px;
          }
          .section2-description {
            font-size: 17px;
            max-width: 320px;
          }
          .section2-explore-btn {
            font-size: 15px;
            padding: 12px 28px;
          }
        }

        @media (max-width: 480px) {
          .section2-title-container-mobile {
            font-size: 32px;
          }
          .section2-description-mobile {
            font-size: 14px;
            max-width: 280px;
          }
        }

        /* Extra small devices */
        @media (max-width: 360px) {
          .section2-title-container-mobile {
            font-size: 28px;
          }
          .section2-description-mobile {
            font-size: 13px;
          }
        }
      `}</style>
    </>
  );
};

export default NextSection;