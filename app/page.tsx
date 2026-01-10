'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import NextSection from './components/NextSection';
import DualPanelSection from './components/DualPanelSection';
import EmptySection from './components/EmptySection';
import ThirdSection from './components/ThirdSection';
import FourthSection from './components/FourthSection';
import ShutterOverlay from './components/ShutterOverlay';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Scroll Fade Section wrapper component
interface ScrollFadeSectionProps {
  children: React.ReactNode;
  className?: string;
}

const ScrollFadeSection: React.FC<ScrollFadeSectionProps> = ({ children, className = '' }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visibility, setVisibility] = useState<'hidden' | 'entering' | 'visible' | 'exiting'>('hidden');

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Create intersection observer for fade-in (entering viewport)
    const enterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibility('visible');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );

    // Create intersection observer for fade-out (leaving viewport at top)
    const exitObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Only trigger exit when section is leaving from the top
          if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
            setVisibility('exiting');
          } else if (entry.isIntersecting) {
            setVisibility('visible');
          } else if (!entry.isIntersecting && entry.boundingClientRect.top > 0) {
            setVisibility('hidden');
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px 0px 0px 0px' }
    );

    enterObserver.observe(section);
    exitObserver.observe(section);

    return () => {
      enterObserver.disconnect();
      exitObserver.disconnect();
    };
  }, []);

  const getClassName = () => {
    const baseClass = 'scroll-fade-container';
    switch (visibility) {
      case 'visible':
        return `${baseClass} fade-in`;
      case 'exiting':
        return `${baseClass} fade-out`;
      default:
        return baseClass;
    }
  };

  return (
    <div ref={sectionRef} className={`${getClassName()} ${className}`}>
      {children}
    </div>
  );
};

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Shutter navigation state
  const [isShutterAnimating, setIsShutterAnimating] = useState(false);

  useEffect(() => {
    // Create scroll trigger for the hero fade-out transition
    const trigger1 = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: '+=100%',
      scrub: 0.5,
      onUpdate: (self) => {
        setScrollProgress(self.progress);
      },
    });

    return () => {
      trigger1.kill();
    };
  }, []);

  // Called when shutter closes - scroll to footer/contact/bottom
  const handleShutterComplete = useCallback(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'instant'
    });
    
    setTimeout(() => {
      setIsShutterAnimating(false);
    }, 700);
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen">
      {/* Shutter Overlay for navigation animations */}
      <ShutterOverlay
        isAnimating={isShutterAnimating}
        onAnimationComplete={handleShutterComplete}
      />
      
      {/* Navbar - transforms from full-width to pill shape */}
      <Navbar scrollProgress={scrollProgress} />
      
      {/* Fixed Hero Section - Fades out as you scroll */}
      <div className="fixed inset-0 w-full h-screen" style={{ zIndex: 1 }}>
        <HeroSection scrollProgress={scrollProgress} section2to3Progress={0} />
      </div>
      
      {/* Spacer for the fixed hero area */}
      <div style={{ height: '100vh' }} />
      
      {/* All sections scroll normally after hero fade-out - One Page Scroll with fade animations */}
      <div className="relative" style={{ zIndex: 10, background: '#f5f0e6' }}>
        {/* Section 2 - Products Grid */}
        <ScrollFadeSection>
          <NextSection scrollProgress={scrollProgress} section2to3Progress={0} />
        </ScrollFadeSection>
        
        {/* Section 3 - Dual Panel (Allbirds style) */}
        <ScrollFadeSection>
          <DualPanelSection
            leftPanel={{
              type: 'image',
              src: '/images/5_1.jpg',
              headline: 'Made Easy For home',
              subheadline: 'Made From Nature',
              overlayPosition: 'center',
              textColor: '#000000'
            }}
            rightPanel={{
              type: 'image',
              src: '/images/10_1.jpg',
              headline: 'Precision Crafted',
              subheadline: 'Never Looked So Good',
              buttons: [
                { label: 'Shop', href: '/store' }
              ],
              overlayPosition: 'center',
              textColor: '#000000'
            }}
          />
        </ScrollFadeSection>
        
        {/* Section 4 - New Arrivals Slider */}
        <ScrollFadeSection>
          <EmptySection />
        </ScrollFadeSection>
        
        {/* Section 5 - Why Us? */}
        <ScrollFadeSection>
          <ThirdSection />
        </ScrollFadeSection>
        
        {/* Section 6 - About Us */}
        <ScrollFadeSection>
          <FourthSection />
        </ScrollFadeSection>
      </div>
    </div>
  );
}
