'use client';

import React, { useLayoutEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';


const cardImages = {
  
  leftCard1: '/images/5_1.jpg',
  leftCard2: '/images/6_2.jpg',
  
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
  const [isButtonHovered, setIsButtonHovered] = useState(false);

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

  return (
    <>
      <section
        className="relative w-full overflow-hidden"
        style={{
          background: 'rgb(245, 240, 230)',
          minHeight: '100vh',
          paddingTop: '80px',
          paddingBottom: '80px',
        }}
      >
        {/* Cards Grid Layout - 4 columns side by side for Desktop/Tablet */}
        {!isMobile && (
          <div
            className="w-full flex items-center justify-center"
            style={{
              paddingLeft: isTablet ? '16px' : '40px',
              paddingRight: isTablet ? '16px' : '40px',
            }}
          >
            {/* Rounded Corner Container with #C9B59C background */}
            <div
              className="w-full max-w-[1800px] mx-auto"
              style={{
                backgroundColor: '#C9B59C',
                borderRadius: isTablet ? '32px' : '48px',
                padding: isTablet ? '28px' : '48px',
                boxShadow: '0 12px 48px rgba(0, 0, 0, 0.35), 0 4px 16px rgba(0, 0, 0, 0.25)',
              }}
            >
              {/* 4 Column Grid - All cards side by side, taller cards */}
              <div
                className="grid items-stretch"
                style={{
                  gridTemplateColumns: isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                  gap: isTablet ? '12px' : '20px',
                }}
              >
                {/* Card 1 */}
                <div
                  className="product-card-hover overflow-hidden shadow-xl relative"
                  style={{
                    minHeight: isTablet ? '300px' : '60vh',
                  }}
                >
                  <Image
                    src={cardImages.leftCard1}
                    alt="Product Card 1"
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(180deg, #8b9aad 0%, #6b7d8c 50%, #4a5a6a 100%)' }} />
                </div>
                
                {/* Card 2 */}
                <div
                  className="product-card-hover overflow-hidden shadow-xl relative"
                  style={{
                    minHeight: isTablet ? '300px' : '60vh',
                  }}
                >
                  <Image
                    src={cardImages.leftCard2}
                    alt="Product Card 2"
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(180deg, #c4b8a8 0%, #a89888 50%, #8c7868 100%)' }} />
                </div>

                {/* Card 3 */}
                <div
                  className="product-card-hover overflow-hidden shadow-xl relative"
                  style={{
                    minHeight: isTablet ? '300px' : '60vh',
                  }}
                >
                  <Image
                    src={cardImages.rightCard1}
                    alt="Product Card 3"
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(180deg, #87CEEB 0%, #FFB366 50%, #FF6B6B 75%, #2c3e50 100%)' }} />
                </div>
                
                {/* Card 4 */}
                <div
                  className="product-card-hover overflow-hidden shadow-xl relative"
                  style={{
                    minHeight: isTablet ? '300px' : '60vh',
                  }}
                >
                  <Image
                    src={cardImages.rightCard2}
                    alt="Product Card 4"
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(180deg, #8B7355 0%, #D2B48C 50%, #654321 100%)' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Content - Title/Description and Button */}
        {isMobile && (
          <div className="flex flex-col items-center justify-center px-4 py-12 min-h-[60vh]">
            <div className="flex flex-col items-center gap-4 text-center">
              {/* Title in BLACK */}
              <h2 className="section2-title-container-mobile text-center" style={{ color: '#000000' }}>
                Our Products
              </h2>
              
              {/* Description in BLACK */}
              <p className="section2-description-mobile text-center max-w-[300px]" style={{ color: '#333333' }}>
                We believe in creating products that transform everyday moments into extraordinary experiences.
              </p>
              
              {/* Explore Us Button */}
              <Link
                href="/store#featured"
                className="section2-explore-btn-static"
                onMouseEnter={() => setIsButtonHovered(true)}
                onMouseLeave={() => setIsButtonHovered(false)}
                style={{
                  backgroundColor: isButtonHovered ? '#ffffff' : 'transparent',
                  color: '#000000',
                  borderColor: '#000000',
                  marginTop: '16px',
                }}
              >
                Explore Us
              </Link>
            </div>
          </div>
        )}

        {/* Desktop/Tablet Content - Bottom Section */}
        {!isMobile && (
          <div
            className="w-full"
            style={{
              paddingTop: '48px',
              paddingBottom: isTablet ? '32px' : '48px',
              paddingLeft: isTablet ? '24px' : '48px',
              paddingRight: isTablet ? '24px' : '48px',
            }}
          >
            {isTablet ? (
              /* Tablet Layout - Title and description stacked, button below */
              <div className="flex flex-col items-center gap-5">
                <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
                  {/* Title */}
                  <h2 className="section2-title-container" style={{ color: '#000000' }}>
                    Our Products
                  </h2>
                  
                  {/* Description */}
                  <p className="section2-description max-w-[360px] text-right" style={{ color: '#000000' }}>
                    We believe in creating products that transform everyday moments into extraordinary experiences.
                  </p>
                </div>
                
                {/* Button centered */}
                <Link
                  href="/store#featured"
                  className="section2-explore-btn-static"
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
              /* Desktop Layout - Flexbox layout */
              <div className="flex items-end justify-between">
                {/* Left - "Our Products" title */}
                <h2 className="section2-title-container" style={{ color: '#000000' }}>
                  Our Products
                </h2>

                {/* Center - "Explore Us" button */}
                <Link
                  href="/store#featured"
                  className="section2-explore-btn-static"
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

                {/* Right - Description text */}
                <p className="section2-description max-w-[420px] text-right" style={{ color: '#000000' }}>
                  We believe in creating products that transform everyday moments into extraordinary experiences. Our vision is to bring innovation and quality to every kitchen.
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Section 2 Styles */}
      <style jsx global>{`
        /* Product Card Hover - Oval/Pill Shape Effect */
        .product-card-hover {
          border-radius: 16px;
          transition: border-radius 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                      transform 0.3s ease,
                      box-shadow 0.3s ease;
          cursor: pointer;
        }

        .product-card-hover:hover {
          border-radius: 50% / 45%;
          transform: scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

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

        /* Static Explore Us Button - always visible */
        .section2-explore-btn-static {
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
          min-height: 48px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .section2-explore-btn-static:hover {
          background-color: #ffffff !important;
        }

        .section2-explore-btn-static:active {
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
          .section2-explore-btn-static {
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