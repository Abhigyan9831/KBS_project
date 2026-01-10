'use client';

import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';
import Image from 'next/image';

// Standard component props instead of transition/animation props
interface ThirdSectionProps {}

const ThirdSection: React.FC<ThirdSectionProps> = () => {
  const [dimensions, setDimensions] = useState({
    vh: 900,
    vw: 1200,
    isMobile: false,
    isTablet: false,
  });
  
  const [textRevealed, setTextRevealed] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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
  
  // Intersection Observer for scroll reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTextRevealed(true);
        }
      },
      { threshold: 0.2 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  const { isMobile, isTablet } = dimensions;

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{
        background: 'rgb(245, 240, 230)',
        minHeight: '100vh',
        paddingTop: '80px',
        paddingBottom: '80px',
      }}
    >
      {/* Main Content Container */}
      <div
        className="w-full flex items-center justify-center"
        style={{
          paddingLeft: isMobile ? '16px' : isTablet ? '16px' : '40px',
          paddingRight: isMobile ? '16px' : isTablet ? '16px' : '40px',
        }}
      >
        {/* Rounded Corner Container with #C9B59C background - Same as Section 2 */}
        <div
          className="w-full max-w-[1800px] mx-auto"
          style={{
            backgroundColor: '#C9B59C',
            borderRadius: isMobile ? '24px' : isTablet ? '32px' : '48px',
            padding: isMobile ? '20px' : isTablet ? '28px' : '32px',
            boxShadow: '0 12px 48px rgba(0, 0, 0, 0.35), 0 4px 16px rgba(0, 0, 0, 0.25)',
            minHeight: isMobile ? 'auto' : isTablet ? '500px' : '70vh',
          }}
        >
          {/* Two Column Layout */}
          <div
            className="w-full h-full"
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1.2fr' : '0.8fr 1.2fr',
              gap: isMobile ? '20px' : isTablet ? '20px' : '24px',
              minHeight: isMobile ? 'auto' : isTablet ? '450px' : 'calc(70vh - 64px)',
            }}
          >
            {/* Left Column - Smaller Product/Content */}
            <div
              className="flex flex-col justify-center"
              style={{
                padding: isMobile ? '16px' : isTablet ? '20px' : '32px',
              }}
            >
              {/* Why Us? Heading */}
              <h2
                className={`section3-heading-new section3-reveal-inner ${textRevealed ? 'revealed' : ''}`}
                style={{
                  transitionDelay: '0s',
                  marginBottom: isMobile ? '20px' : '32px',
                }}
              >
                Why Us?
              </h2>

              {/* Feature Items */}
              <div className="flex flex-col gap-6">
                {/* Feature 1 */}
                <div className={`section3-reveal-inner ${textRevealed ? 'revealed' : ''}`}
                     style={{ transitionDelay: '0.1s' }}>
                  <h3 className="section3-title-new">Premium Quality, Always</h3>
                  <p className="section3-description-new">
                    Every product is carefully built to meet the highest quality standards.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className={`section3-reveal-inner ${textRevealed ? 'revealed' : ''}`}
                     style={{ transitionDelay: '0.2s' }}>
                  <h3 className="section3-title-new">Fast & Reliable Delivery</h3>
                  <p className="section3-description-new">
                    Get your orders delivered quickly with real-time tracking.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className={`section3-reveal-inner ${textRevealed ? 'revealed' : ''}`}
                     style={{ transitionDelay: '0.3s' }}>
                  <h3 className="section3-title-new">Secure Payments</h3>
                  <p className="section3-description-new">
                    Shop with confidence using 100% safe and encrypted payment methods.
                  </p>
                </div>

                {/* Feature 4 */}
                <div className={`section3-reveal-inner ${textRevealed ? 'revealed' : ''}`}
                     style={{ transitionDelay: '0.4s' }}>
                  <h3 className="section3-title-new">Easy Returns</h3>
                  <p className="section3-description-new">
                    Simple returns designed to keep shopping stress-free.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Full Height/Width Video/Image */}
            <div
              className="relative overflow-hidden"
              style={{
                borderRadius: isMobile ? '16px' : isTablet ? '20px' : '32px',
                minHeight: isMobile ? '300px' : '100%',
              }}
            >
              {/* Video Background */}
              <video
                className="absolute inset-0 w-full h-full object-cover"
                src="/videos/Hero.mp4"
                autoPlay
                muted
                loop
                playsInline
                poster="/images/pexels-max-fischer-5868118.jpg"
              />
              {/* Subtle Overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.2) 100%)',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        /* New Section 3 Styles */
        .section3-heading-new {
          font-family: sans-serif;
          font-size: clamp(32px, 5vw, 56px);
          color: #000000;
          font-weight: 600;
          letter-spacing: -0.02em;
        }
        
        .section3-title-new {
          font-family: sans-serif;
          font-size: clamp(16px, 2vw, 20px);
          color: #000000;
          font-weight: 600;
          margin-bottom: 6px;
        }
        
        .section3-description-new {
          font-family: sans-serif;
          font-size: clamp(13px, 1.5vw, 16px);
          color: rgba(0, 0, 0, 0.75);
          line-height: 1.5;
        }

        /* Animations */
        .section3-reveal-inner {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        
        .section3-reveal-inner.revealed {
          opacity: 1;
          transform: translateY(0);
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .section3-heading-new {
            font-size: 28px;
            text-align: center;
          }
          
          .section3-title-new {
            font-size: 16px;
          }
          
          .section3-description-new {
            font-size: 14px;
          }
        }
      `}</style>
    </section>
  );
};

export default ThirdSection;