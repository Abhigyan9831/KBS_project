'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface PanelData {
  type: 'image' | 'video';
  src: string;
  posterSrc?: string; // For video poster
  headline: string;
  subheadline?: string;
  buttons?: { label: string; href: string }[];
  overlayPosition?: 'top' | 'bottom' | 'center';
  textColor?: string;
}

interface DualPanelSectionProps {
  leftPanel: PanelData;
  rightPanel: PanelData;
  backgroundColor?: string;
}

// Default panel data matching Allbirds style
const defaultLeftPanel: PanelData = {
  type: 'image',
  src: '/images/5_1.jpg',
  headline: 'WILDLY COMFORTABLE',
  subheadline: 'MADE FROM NATURE',
  overlayPosition: 'center',
  textColor: '#ffffff'
};

const defaultRightPanel: PanelData = {
  type: 'image',
  src: '/images/10_1.jpg',
  headline: 'RECYCLED LEATHER AND SUGAR CANE',
  subheadline: 'PRECISION CRAFTED',
  buttons: [
    { label: 'SHOP MEN', href: '/collections/men' },
    { label: 'SHOP WOMEN', href: '/collections/women' }
  ],
  overlayPosition: 'bottom',
  textColor: '#ffffff'
};

const Panel: React.FC<{ data: PanelData; isVisible: boolean }> = ({ data, isVisible }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (data.type === 'video' && videoRef.current && isVisible) {
      videoRef.current.play().catch(() => {
        // Autoplay failed, likely due to browser restrictions
      });
    }
  }, [data.type, isVisible]);

  const overlayPositionClass = {
    top: 'items-start pt-12',
    center: 'items-center',
    bottom: 'items-end pb-12'
  }[data.overlayPosition || 'center'];

  return (
    <div className="dual-panel">
      {/* Media Container */}
      <div className="dual-panel__media">
        {data.type === 'image' ? (
          <>
            <Image
              src={data.src}
              alt={data.headline}
              fill
              sizes="50vw"
              priority
              onLoad={() => setImageLoaded(true)}
              style={{
                opacity: imageLoaded ? 1 : 0,
                objectFit: 'cover',
                objectPosition: 'center',
                transition: 'opacity 0.5s ease'
              }}
            />
            <div className="dual-panel__fallback" />
          </>
        ) : (
          <video
            ref={videoRef}
            className="dual-panel__video"
            src={data.src}
            poster={data.posterSrc}
            muted
            loop
            playsInline
          />
        )}
      </div>

      {/* Content Overlay */}
      <div className={`dual-panel__content ${overlayPositionClass}`}>
        <div className="dual-panel__text-container">
          <h2 
            className="dual-panel__headline"
            style={{ color: data.textColor || '#ffffff' }}
          >
            {data.headline}
          </h2>
          {data.subheadline && (
            <p 
              className="dual-panel__subheadline"
              style={{ color: data.textColor || '#ffffff' }}
            >
              {data.subheadline}
            </p>
          )}
          {data.buttons && data.buttons.length > 0 && (
            <div className="dual-panel__buttons">
              {data.buttons.map((button, index) => (
                <Link
                  key={index}
                  href={button.href}
                  className="dual-panel__button"
                >
                  {button.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DualPanelSection: React.FC<DualPanelSectionProps> = ({
  leftPanel = defaultLeftPanel,
  rightPanel = defaultRightPanel,
  backgroundColor = 'rgb(245, 240, 230)'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const updateDimensions = () => {
      const vw = window.innerWidth;
      setIsMobile(vw < 640);
      setIsTablet(vw >= 640 && vw < 1024);
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="dual-panel-section"
      style={{ backgroundColor }}
    >
      {/* Rounded Corner Container with #C9B59C background */}
      <div
        className="dual-panel-outer-container"
        style={{
          backgroundColor: '#C9B59C',
          borderRadius: isMobile ? '24px' : isTablet ? '32px' : '48px',
          padding: isMobile ? '20px' : isTablet ? '24px' : '32px',
          boxShadow: '0 12px 48px rgba(0, 0, 0, 0.35), 0 4px 16px rgba(0, 0, 0, 0.25)',
          maxWidth: '1800px',
          margin: '0 auto',
          minHeight: isMobile ? 'auto' : isTablet ? '450px' : '70vh',
        }}
      >
        <div
          className="dual-panel-container-new"
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : isTablet ? '0.9fr 1.1fr' : '0.7fr 1.3fr',
            gap: isMobile ? '20px' : isTablet ? '20px' : '24px',
            height: '100%',
            minHeight: isMobile ? 'auto' : isTablet ? '400px' : 'calc(70vh - 64px)',
          }}
        >
          {/* Left Panel - Smaller */}
          <div className="dual-panel-left">
            <Panel data={leftPanel} isVisible={isVisible} />
          </div>
          
          {/* Right Panel - Full Height/Width */}
          <div className="dual-panel-right">
            <Panel data={rightPanel} isVisible={isVisible} />
          </div>
        </div>
      </div>

      <style jsx global>{`
        .dual-panel-section {
          width: 100%;
          padding: 40px;
          box-sizing: border-box;
          position: relative;
          z-index: 10;
        }

        .dual-panel-outer-container {
          width: 100%;
        }

        .dual-panel-left {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dual-panel-left .dual-panel {
          width: 100%;
          height: 100%;
          min-height: 300px;
          aspect-ratio: auto;
          border-radius: 24px;
        }

        .dual-panel-right {
          display: flex;
          align-items: stretch;
        }

        .dual-panel-right .dual-panel {
          width: 100%;
          height: 100%;
          min-height: 100%;
          aspect-ratio: auto;
          border-radius: 32px;
        }

        .dual-panel {
          flex: 1;
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          aspect-ratio: 4 / 3;
          min-height: 350px;
        }

        .dual-panel__media {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .dual-panel__fallback {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #3a3a3a 0%, #1a1a1a 100%);
          z-index: -1;
        }

        .dual-panel__video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .dual-panel__content {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 40px;
          z-index: 2;
        }

        .dual-panel__text-container {
          max-width: 80%;
        }

        .dual-panel__headline {
          font-family: 'Sarina', cursive;
          font-size: 48px;
          font-weight: 400;
          font-style: normal;
          line-height: 1.1;
          margin: 0 0 8px 0;
          text-transform: none;
          letter-spacing: 0.02em;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .dual-panel__subheadline {
          font-family: 'Sarina', cursive;
          font-size: 40px;
          font-weight: 400;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          font-style: normal;
          line-height: 1.1;
          margin: 0;
          text-transform: none;
          letter-spacing: 0;
        }

        .dual-panel__buttons {
          display: flex;
          gap: 12px;
          margin-top: 24px;
          flex-wrap: wrap;
        }

        .dual-panel__button {
          background-color: #ffffff;
          color: #000000;
          border: none;
          border-radius: 50px;
          padding: 12px 24px;
          font-family: sans-serif;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          text-decoration: none;
          cursor: pointer;
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        .dual-panel__button:hover {
          background-color: #ff6b00;
          color: #000000;
        }

        /* Responsive Styles */
        @media (max-width: 1024px) {
          .dual-panel-section {
            padding: 24px;
          }

          .dual-panel {
            min-height: 300px;
          }

          .dual-panel-left .dual-panel {
            border-radius: 20px;
          }

          .dual-panel-right .dual-panel {
            border-radius: 24px;
          }

          .dual-panel__headline {
            font-size: 36px;
          }

          .dual-panel__subheadline {
            font-size: 30px;
          }

          .dual-panel__content {
            padding: 24px;
          }
        }

        @media (max-width: 768px) {
          .dual-panel-section {
            padding: 16px;
          }

          .dual-panel-left .dual-panel,
          .dual-panel-right .dual-panel {
            min-height: 280px;
            border-radius: 16px;
          }

          .dual-panel__headline {
            font-size: 32px;
          }

          .dual-panel__subheadline {
            font-size: 26px;
          }

          .dual-panel__content {
            padding: 20px;
          }

          .dual-panel__text-container {
            max-width: 90%;
          }

          .dual-panel__button {
            padding: 10px 20px;
            font-size: 11px;
          }
        }

        @media (max-width: 480px) {
          .dual-panel-section {
            padding: 12px;
          }

          .dual-panel-left .dual-panel,
          .dual-panel-right .dual-panel {
            min-height: 250px;
            border-radius: 16px;
          }

          .dual-panel__headline {
            font-size: 26px;
          }

          .dual-panel__subheadline {
            font-size: 22px;
          }

          .dual-panel__content {
            padding: 16px;
          }

          .dual-panel__buttons {
            gap: 8px;
            margin-top: 16px;
          }

          .dual-panel__button {
            padding: 8px 16px;
            font-size: 10px;
          }
        }
      `}</style>
    </section>
  );
};

export default DualPanelSection;