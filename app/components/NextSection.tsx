'use client';

import React, { useLayoutEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';


// PRODUCT DATA CONFIGURATION
// You can add your YouTube or TikTok links in the 'videoLink' field below.
const products = [
  {
    id: 1,
    title: 'Product 1',
    image: '/images/5_1.jpg',
    gradient: 'linear-gradient(180deg, #8b9aad 0%, #6b7d8c 50%, #4a5a6a 100%)',
    videoLink: 'https://youtu.be/-ueUb6PNwbs?si=fIry_xhw-GI-otr3', // <--- Add your link here
  },
  {
    id: 2,
    title: 'Product 2',
    image: '/images/6_2.jpg',
    gradient: 'linear-gradient(180deg, #c4b8a8 0%, #a89888 50%, #8c7868 100%)',
    videoLink: 'https://youtu.be/XOBE3FCyaqU?si=jOIrqixg2ZHVjrO1', // <--- Add your link here
  },
  {
    id: 3,
    title: 'Product 3',
    image: '/images/10_1.jpg',
    gradient: 'linear-gradient(180deg, #87CEEB 0%, #FFB366 50%, #FF6B6B 75%, #2c3e50 100%)',
    videoLink: 'https://youtu.be/4e5DgSrN3E4?si=G_wy4Y7GuwktrMZh', // <--- Add your link here
  },
  {
    id: 4,
    title: 'Product 4',
    image: '/images/16_2.jpg',
    gradient: 'linear-gradient(180deg, #8B7355 0%, #D2B48C 50%, #654321 100%)',
    videoLink: 'https://youtu.be/h6CwwHyQxKI?si=94tDOLnmV3QbKb4u', // <--- Add your link here
  },
];


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
          minHeight: isMobile ? 'auto' : '100vh',
          paddingTop: isMobile ? '40px' : '80px',
          paddingBottom: isMobile ? '40px' : '80px',
        }}
      >
        {/* Cards Grid Layout - Responsive for All Devices */}
        <div
          className="w-full flex items-center justify-center"
          style={{
            paddingLeft: isMobile ? '16px' : isTablet ? '16px' : '40px',
            paddingRight: isMobile ? '16px' : isTablet ? '16px' : '40px',
          }}
        >
          {/* Rounded Corner Container with #C9B59C background */}
          <div
            className="w-full max-w-[1800px] mx-auto"
            style={{
              backgroundColor: '#C9B59C',
              borderRadius: isMobile ? '24px' : isTablet ? '32px' : '48px',
              padding: isMobile ? '20px' : isTablet ? '28px' : '48px',
              boxShadow: '0 12px 48px rgba(0, 0, 0, 0.35), 0 4px 16px rgba(0, 0, 0, 0.25)',
            }}
          >
            {/* Grid - 1 col mobile, 2 col tablet, 4 col desktop */}
            <div
              className="grid items-stretch"
              style={{
                gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                gap: isMobile ? '16px' : isTablet ? '12px' : '20px',
              }}
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  className="product-card-hover overflow-hidden shadow-xl relative group"
                  style={{
                    minHeight: isMobile ? '300px' : isTablet ? '300px' : '60vh',
                  }}
                >
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="absolute inset-0 -z-10" style={{ background: product.gradient }} />
                  
                  {/* Product Title - Visible initially */}
                  <div className="absolute bottom-8 left-0 right-0 text-center z-10 transition-opacity duration-300 group-hover:opacity-0">
                    <h3 className="card-title-text">{product.title}</h3>
                  </div>

                  {/* Hover Overlay - Slides up from bottom */}
                  <div className="absolute inset-0 glass-overlay translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out z-20 flex items-center justify-center">
                    <a
                      href={product.videoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="view-details-btn"
                    >
                      View details
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section - Title/Desc/Button - Visible on All Devices */}
        <div
          className="w-full"
          style={{
            paddingTop: isMobile ? '20px' : '48px',
            paddingBottom: isMobile ? '10px' : isTablet ? '32px' : '48px',
            paddingLeft: isMobile ? '20px' : isTablet ? '24px' : '48px',
            paddingRight: isMobile ? '20px' : isTablet ? '24px' : '48px',
          }}
        >
          {isMobile ? (
             /* Mobile Layout - Stacked */
             <div className="flex flex-col items-center gap-5">
              <div className="flex flex-col items-center justify-center w-full gap-3 text-center">
                <h2 className="section2-title-container-mobile" style={{ color: '#000000' }}>
                  Our Products
                </h2>
                <p className="section2-description-mobile max-w-[300px]" style={{ color: '#000000' }}>
                  We believe in creating products that transform everyday moments into extraordinary experiences.
                </p>
              </div>
              <Link
                href="/store#featured"
                className="section2-explore-btn-static"
                style={{ color: '#000000', borderColor: '#000000' }}
              >
                Explore Us
              </Link>
             </div>
          ) : isTablet ? (
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
            max-width: 360px;
          }
        }

        /* Card Text Styles matching 'New arrivals' font style */
        .card-title-text {
          font-family: sans-serif;
          font-size: 32px;
          color: #ffffff;
          font-weight: 300;
          letter-spacing: -0.02em;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .view-details-btn {
          display: inline-block;
          font-family: sans-serif;
          font-size: 20px;
          color: #ffffff;
          font-weight: 300;
          letter-spacing: -0.02em;
          padding: 12px 32px;
          background: transparent;
          border: 2px solid #ffffff;
          border-radius: 50px;
          cursor: pointer;
          text-decoration: none;
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        .view-details-btn:hover {
          background-color: #ffffff;
          color: #000000;
        }

        /* Black Glassmorphism Overlay Style */
        .glass-overlay {
          background: rgba(0, 0, 0, 0.5); /* Black semi-transparent */
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-top: 1px solid rgba(255, 255, 255, 0.15);
        }
      `}</style>
    </>
  );
};

export default NextSection;