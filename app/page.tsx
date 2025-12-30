'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import NextSection from './components/NextSection';
import EmptySection from './components/EmptySection';
import ThirdSection from './components/ThirdSection';
import FourthSection from './components/FourthSection';
import ShutterOverlay from './components/ShutterOverlay';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const section2TriggerRef = useRef<HTMLDivElement>(null);
  const section3TriggerRef = useRef<HTMLDivElement>(null);
  const section4TriggerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [section2to3Progress, setSection2to3Progress] = useState(0);
  const [section3to4Progress, setSection3to4Progress] = useState(0);
  const [section4to5Progress, setSection4to5Progress] = useState(0);
  
  // Shutter navigation state
  const [isShutterAnimating, setIsShutterAnimating] = useState(false);

  useEffect(() => {
    // Create scroll trigger for the hero to second section transition
    // This happens during the first 100vh of scroll (0-100vh scroll position)
    const trigger1 = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: '+=100%', // One viewport height of scroll
      scrub: 0.5, // Smooth scrubbing
      onUpdate: (self) => {
        setScrollProgress(self.progress);
      },
    });

    // Create scroll trigger for section 2 to section 3 transition (empty section)
    // This happens during the second 100vh of scroll (100vh-200vh scroll position)
    const trigger2 = ScrollTrigger.create({
      trigger: section2TriggerRef.current,
      start: 'top top',
      end: '+=100%', // One viewport height of scroll
      scrub: 0.5,
      onUpdate: (self) => {
        setSection2to3Progress(self.progress);
      },
    });

    // Create scroll trigger for section 3 to section 4 transition (Why Us? section)
    // This happens during the third 100vh of scroll (200vh-300vh scroll position)
    const trigger3 = ScrollTrigger.create({
      trigger: section3TriggerRef.current,
      start: 'top top',
      end: '+=100%', // One viewport height of scroll
      scrub: 0.5,
      onUpdate: (self) => {
        setSection3to4Progress(self.progress);
      },
    });

    // Create scroll trigger for section 4 to section 5 transition (empty section)
    // This happens during the fourth 100vh of scroll (300vh-400vh scroll position)
    const trigger4 = ScrollTrigger.create({
      trigger: section4TriggerRef.current,
      start: 'top top',
      end: '+=100%', // One viewport height of scroll
      scrub: 0.5,
      onUpdate: (self) => {
        setSection4to5Progress(self.progress);
      },
    });

    return () => {
      trigger1.kill();
      trigger2.kill();
      trigger3.kill();
      trigger4.kill();
    };
  }, []);

  // Handle navigation to About Us section with shutter animation
  const handleNavigateToAbout = useCallback(() => {
    setIsShutterAnimating(true);
  }, []);

  // Called when shutter closes - scroll to Section 5
  const handleShutterComplete = useCallback(() => {
    // Section 5 (FourthSection/About Us) is at around 700vh scroll position
    // The section becomes visible when section4to5Progress > 0.5
    // Scroll to position where Section 5 is fully visible (after the shutter opens)
    window.scrollTo({
      top: window.innerHeight * 7, // 700vh - where Section 5 is fully visible
      behavior: 'instant' // Instant scroll while shutters are closed
    });
    
    // Reset the animating flag after a delay to allow shutter to open
    setTimeout(() => {
      setIsShutterAnimating(false);
    }, 700);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Shutter Overlay for navigation animations */}
      <ShutterOverlay
        isAnimating={isShutterAnimating}
        onAnimationComplete={handleShutterComplete}
      />
      
      {/* Navbar - transforms from full-width to pill shape */}
      <Navbar scrollProgress={scrollProgress} onNavigateToAbout={handleNavigateToAbout} />
      
      {/* Hero Section with Video Background that shrinks */}
      <HeroSection scrollProgress={scrollProgress} section2to3Progress={section2to3Progress} />
      
      {/* Section 2 - Cream background with image cards (fixed position) */}
      <NextSection scrollProgress={scrollProgress} section2to3Progress={section2to3Progress} />
      
      {/* Section 3 - Empty section with shutter animation (same cream as section 2) */}
      <EmptySection
        transitionProgress={section2to3Progress}
        nextTransitionProgress={section3to4Progress}
        zIndexBase={10}
        shutterZIndex={100}
        bgColorStyle="rgb(245, 240, 230)"
      />
      
      {/* Section 4 - "Why Us?" section with background image */}
      <ThirdSection transitionProgress={section3to4Progress} section3to4Progress={section4to5Progress} />
      
      {/* Section 5 - Empty section with shutter animation */}
      <FourthSection transitionProgress={section4to5Progress} />
      
      {/* Section 2 to 3 scroll trigger anchor - positioned at 200vh */}
      {/* Each section gets 100vh of viewing + 100vh of transition */}
      <div
        ref={section2TriggerRef}
        className="absolute left-0 w-full"
        style={{
          top: '200vh',
          height: '100vh',
        }}
      />
      
      {/* Section 3 to 4 scroll trigger anchor - positioned at 400vh */}
      <div
        ref={section3TriggerRef}
        className="absolute left-0 w-full"
        style={{
          top: '400vh',
          height: '100vh',
        }}
      />
      
      {/* Section 4 to 5 scroll trigger anchor - positioned at 600vh */}
      <div
        ref={section4TriggerRef}
        className="absolute left-0 w-full"
        style={{
          top: '600vh',
          height: '100vh',
        }}
      />
      
      {/* Spacer for total scroll height - 8 viewport heights for 5 sections with viewing time */}
      <div style={{ height: '800vh' }} />
    </div>
  );
}
