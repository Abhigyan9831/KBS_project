'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Data for Hot Deals
const hotDeals = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  name: `Smart Bread Maker ${i + 1}`,
  description: 'Premium automatic bread maker',
  price: 129.99 + (i * 10),
  originalPrice: 199.99 + (i * 10),
  discount: '35% OFF',
  // Alternating placeholder images
  image: i % 3 === 0 ? '/images/5_1.jpg' : i % 3 === 1 ? '/images/10_1.jpg' : '/images/16_2.jpg'
}));

interface DualPanelSectionProps {
  // Props are kept optional compatible with previous usage,
  // but we will ignore the old props for the new layout
  leftPanel?: unknown;
  rightPanel?: unknown;
}

const DualPanelSection: React.FC<DualPanelSectionProps> = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
  
    const itemsToShow = isMobile ? 1 : isTablet ? 2 : 4;
    const maxSlide = Math.max(0, hotDeals.length - itemsToShow);
    
    // Ensure current slide is valid for current view
    const safeCurrentSlide = Math.min(currentSlide, maxSlide);
  
    const nextSlide = useCallback(() => {
      // Wrap around to 0 if at end
      setCurrentSlide(prev => (prev >= maxSlide ? 0 : prev + 1));
    }, [maxSlide]);
  
    const prevSlide = useCallback(() => {
      // Wrap around to end if at 0
      setCurrentSlide(prev => (prev <= 0 ? maxSlide : prev - 1));
    }, [maxSlide]);
  
    // Auto-play interval
    useEffect(() => {
      if (isPaused) return;
  
      const interval = setInterval(() => {
        setCurrentSlide((prev) => {
          const max = Math.max(0, hotDeals.length - itemsToShow);
          return prev >= max ? 0 : prev + 1;
        });
      }, 3000); // 3 seconds per slide auto-advance
  
      return () => clearInterval(interval);
    }, [isPaused, itemsToShow]);
  
    return (
      <section
        className="hot-deals-section"
        ref={containerRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Main Container - Same styling consistency */}
        <div className="hot-deals-container">
        
        {/* Header */}
        <div className="hot-deals-header">
          <h2 className="hot-deals-title">Hot Deals</h2>
          <div className="hot-deals-controls">
            <button
              className="nav-btn"
              onClick={prevSlide}
              aria-label="Previous items"
            >
              ←
            </button>
            <button
              className="nav-btn"
              onClick={nextSlide}
              aria-label="Next items"
            >
              →
            </button>
          </div>
        </div>

        {/* Slider Window */}
        <div className="slider-window">
          {/* Slider Track */}
          <div
            className="slider-track"
            style={{
              transform: `translateX(-${safeCurrentSlide * (100 / itemsToShow)}%)`
            }}
          >
            {hotDeals.map((deal) => (
              <div 
                key={deal.id} 
                className="slide-item"
                style={{ flex: `0 0 ${100 / itemsToShow}%` }}
              >
                <div className="deal-card">
                  {/* Image Area */}
                  <div className="deal-image-wrapper">
                    <Image
                      src={deal.image}
                      alt={deal.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      style={{ objectFit: 'cover' }}
                    />
                    <div className="discount-badge">{deal.discount}</div>
                  </div>

                  {/* Content Area */}
                  <div className="deal-content">
                    <h3 className="deal-name">{deal.name}</h3>
                    <div className="deal-pricing">
                      <span className="current-price">${deal.price.toFixed(2)}</span>
                      <span className="original-price">${deal.originalPrice.toFixed(2)}</span>
                    </div>
                    <Link href="/store" className="deal-button">
                      Buy Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <style jsx global>{`
        .hot-deals-section {
          width: 100%;
          padding: 40px;
          box-sizing: border-box;
          position: relative;
          z-index: 10;
        }

        .hot-deals-container {
          width: 100%;
          max-width: 1800px;
          margin: 0 auto;
          background-color: #C9B59C;
          border-radius: 48px;
          padding: 48px;
          box-shadow: 0 12px 48px rgba(0, 0, 0, 0.35), 0 4px 16px rgba(0, 0, 0, 0.25);
          overflow: hidden;
        }

        /* Header */
        .hot-deals-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .hot-deals-title {
          font-family: 'Sarina', cursive;
          font-size: 48px;
          color: #ffffff;
          margin: 0;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .hot-deals-controls {
          display: flex;
          gap: 12px;
        }

        .nav-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 2px solid #ffffff;
          background: transparent;
          color: #ffffff;
          font-size: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .nav-btn:hover:not(.disabled) {
          background: #ffffff;
          color: #C9B59C;
        }

        .nav-btn.disabled {
          opacity: 0.5;
          cursor: not-allowed;
          border-color: rgba(255,255,255,0.5);
        }

        /* Slider */
        .slider-window {
          overflow: hidden;
          width: 100%;
        }

        .slider-track {
          display: flex;
          transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);
          width: 100%;
        }

        .slide-item {
          padding: 0 12px; /* Gap between items */
          box-sizing: border-box;
        }

        /* Deal Card */
        .deal-card {
          background: #ffffff;
          border-radius: 24px;
          overflow: hidden;
          height: 100%;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .deal-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.15);
        }

        .deal-image-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 4/3;
          background: #f0f0f0;
        }

        .discount-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: #ff6b00;
          color: white;
          padding: 4px 12px;
          border-radius: 12px;
          font-weight: bold;
          font-size: 12px;
          font-family: sans-serif;
        }

        .deal-content {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .deal-name {
          font-family: sans-serif;
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 8px 0;
          color: #333;
        }

        .deal-pricing {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .current-price {
          font-size: 20px;
          font-weight: 700;
          color: #000;
        }

        .original-price {
          font-size: 14px;
          text-decoration: line-through;
          color: #888;
        }

        .deal-button {
          margin-top: auto;
          background: #000;
          color: #fff;
          text-align: center;
          padding: 10px;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 500;
          font-size: 14px;
          transition: background 0.3s ease;
        }

        .deal-button:hover {
          background: #ff6b00;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .hot-deals-container {
            border-radius: 32px;
            padding: 32px;
          }
          .slide-item {
            padding: 0 8px;
          }
        }

        @media (max-width: 640px) {
          .hot-deals-section {
            padding: 24px;
          }
          .hot-deals-container {
            border-radius: 24px;
            padding: 24px;
          }
          .hot-deals-title {
            font-size: 32px;
          }
           .slide-item {
            padding: 0 4px; /* Smaller gap on mobile */
          }
        }
      `}</style>
    </section>
  );
};

export default DualPanelSection;