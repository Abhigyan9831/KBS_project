'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';

interface ShutterOverlayProps {
  isAnimating: boolean;
  onAnimationComplete?: () => void;
}

const ShutterOverlay: React.FC<ShutterOverlayProps> = ({
  isAnimating,
  onAnimationComplete
}) => {
  const [decoTopY, setDecoTopY] = useState(-100);
  const [decoBottomY, setDecoBottomY] = useState(100);
  const [isVisible, setIsVisible] = useState(false);
  const animationRef = useRef<number | null>(null);
  const phaseRef = useRef<'idle' | 'closing' | 'closed' | 'opening'>('idle');
  const prevIsAnimating = useRef(false);

  const runAnimation = useCallback(() => {
    if (phaseRef.current !== 'idle') return;
    
    phaseRef.current = 'closing';
    setIsVisible(true);
    
    
    let startTime: number | null = null;
    const closingDuration = 500; // 0 perecent
    
    const animateClosing = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / closingDuration, 1);
      
      
      const easeProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
      setDecoTopY(-100 + (100 * easeProgress)); 
      setDecoBottomY(100 - (100 * easeProgress)); 
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animateClosing);
      } else {
        // Shutters are now closed
        phaseRef.current = 'closed';
        
        // Notify parent that shutters are closed - time to scroll
        if (onAnimationComplete) {
          onAnimationComplete();
        }
        
        // Wait a moment then start opening
        setTimeout(() => {
          phaseRef.current = 'opening';
          let openStartTime: number | null = null;
          const openingDuration = 600; // ms
          
          const animateOpening = (timestamp: number) => {
            if (!openStartTime) openStartTime = timestamp;
            const elapsed = timestamp - openStartTime;
            const progress = Math.min(elapsed / openingDuration, 1);
            
            // Ease in-out quad
            const easeProgress = progress < 0.5
              ? 2 * progress * progress
              : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            
            setDecoTopY(0 - (100 * easeProgress)); // 0% to -100%
            setDecoBottomY(0 + (100 * easeProgress)); // 0% to 100%
            
            if (progress < 1) {
              animationRef.current = requestAnimationFrame(animateOpening);
            } else {
              // Animation complete
              phaseRef.current = 'idle';
              setIsVisible(false);
            }
          };
          
          animationRef.current = requestAnimationFrame(animateOpening);
        }, 100); // Small delay before opening
      }
    };
    
    animationRef.current = requestAnimationFrame(animateClosing);
  }, [onAnimationComplete]);

  useEffect(() => {
    // Detect rising edge of isAnimating (false -> true)
    if (isAnimating && !prevIsAnimating.current) {
      // Use setTimeout to avoid synchronous setState warning
      const timer = setTimeout(() => {
        runAnimation();
      }, 0);
      prevIsAnimating.current = isAnimating;
      return () => {
        clearTimeout(timer);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
    prevIsAnimating.current = isAnimating;
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating, runAnimation]);

  return (
    <>
      {/* Top shutter panel */}
      <div
        className="fixed top-0 left-0 w-full pointer-events-none"
        style={{
          height: '50vh',
          background: '#0a0a0a',
          transform: `translateY(${decoTopY}%)`,
          opacity: isVisible ? 1 : 0,
          zIndex: 500, // Very high to overlay everything including menu
          transition: isVisible ? 'none' : 'opacity 0.3s ease',
        }}
      />
      {/* Bottom shutter panel */}
      <div
        className="fixed left-0 w-full pointer-events-none"
        style={{
          top: '50vh',
          height: '50vh',
          background: '#0a0a0a',
          transform: `translateY(${decoBottomY}%)`,
          opacity: isVisible ? 1 : 0,
          zIndex: 500,
          transition: isVisible ? 'none' : 'opacity 0.3s ease',
        }}
      />
    </>
  );
};

export default ShutterOverlay;