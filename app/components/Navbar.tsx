'use client';

import React, { useLayoutEffect, useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Menu from './Menu';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  scrollProgress: number;
}

const Navbar: React.FC<NavbarProps> = ({ scrollProgress }) => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [vw, setVw] = useState(1440);
  const [vh, setVh] = useState(900);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setVw(width);
      setVh(height);
      setIsMobile(width < 640);
      setIsTablet(width >= 640 && width < 1024);
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Focus the input when search expands
  useEffect(() => {
    if (searchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchExpanded]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (searchExpanded && !target.closest('.search-container')) {
        setSearchExpanded(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [searchExpanded]);

  // Eased progress for smoother animation
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
  const progress = easeOutCubic(scrollProgress);

  // Calculate navbar styles based on scroll progress - RESPONSIVE
  const getNavbarStyles = () => {
    // Responsive target values for pill shape based on viewport
    let targetWidth: number;
    let targetPadding: number;
    let targetTop: number;
    let startPadding: number;
    let startPaddingX: number;
    let targetPaddingX: number;
    
    if (isMobile) {
      // Mobile: pill takes more width, smaller padding
      targetWidth = Math.min(vw - 24, vw * 0.92);
      targetPadding = 8;
      targetTop = 12;
      startPadding = 16;
      startPaddingX = 16;
      targetPaddingX = 12;
    } else if (isTablet) {
      // Tablet: medium pill size
      targetWidth = Math.min(500, vw * 0.65);
      targetPadding = 10;
      targetTop = 16;
      startPadding = 20;
      startPaddingX = 28;
      targetPaddingX = 16;
    } else {
      // Desktop: original behavior
      targetWidth = Math.min(600, vw * 0.42);
      targetPadding = 12;
      targetTop = 20;
      startPadding = 24;
      startPaddingX = 40;
      targetPaddingX = 20;
    }
    
    const targetBorderRadius = 50;

    // Starting values (full width)
    const startWidth = vw;
    const startTop = 0;
    const startBorderRadius = 0;

    // Interpolate
    const currentWidth = startWidth - (startWidth - targetWidth) * progress;
    const currentPaddingY = startPadding - (startPadding - targetPadding) * progress;
    const currentPaddingX = startPaddingX - (startPaddingX - targetPaddingX) * progress;
    const currentTop = startTop + (targetTop - startTop) * progress;
    const currentBorderRadius = startBorderRadius + (targetBorderRadius - startBorderRadius) * progress;

    // Background: transparent -> glassmorphic
    const bgOpacity = progress * 0.15;
    const backdropBlur = progress * 20;
    const borderOpacity = progress * 0.15;

    return {
      width: currentWidth,
      paddingY: currentPaddingY,
      paddingX: currentPaddingX,
      top: currentTop,
      borderRadius: currentBorderRadius,
      bgOpacity,
      backdropBlur,
      borderOpacity,
    };
  };

  const styles = getNavbarStyles();
  
  // Text/icon color: white on video -> dark on cream background
  const textColorValue = Math.round(255 - (255 - 26) * progress);
  const textColor = `rgb(${textColorValue}, ${textColorValue}, ${textColorValue})`;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Search:', searchQuery);
      // Add your search logic here
    }
  };

  const handleCartClick = () => {
    // Navigate to store page with openCart query parameter
    router.push('/store?openCart=true');
  };

  // Get user initials for avatar display
  const userInitials = user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` : '';

  return (
    <>
      {/* Menu Overlay */}
      <Menu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      {/* Navbar */}
      <nav
        className="fixed z-[200]"
        style={{
          top: `${styles.top}px`,
          left: '50%',
          transform: 'translateX(-50%)',
          width: `${styles.width}px`,
          padding: `${styles.paddingY}px ${styles.paddingX}px`,
          background: `rgba(255, 255, 255, ${styles.bgOpacity})`,
          backdropFilter: `blur(${styles.backdropBlur}px)`,
          WebkitBackdropFilter: `blur(${styles.backdropBlur}px)`,
          borderRadius: `${styles.borderRadius}px`,
          border: `1px solid rgba(255, 255, 255, ${styles.borderOpacity})`,
          willChange: 'transform, width, padding, background, border-radius',
          display: menuOpen ? 'none' : 'block',
        }}
      >
        <div className="flex items-center justify-between">
          {/* Left Section - Menu & Logo */}
          <div className={`flex items-center ${isMobile ? 'gap-3' : isTablet ? 'gap-4' : 'gap-6'}`}>
            {/* Hamburger Menu */}
            <button
              className={`flex flex-col justify-center ${isMobile ? 'gap-[5px]' : 'gap-1.5'} hover:opacity-70 transition-opacity`}
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              style={{ padding: isMobile ? '6px' : '8px' }}
            >
              <span
                className={`block ${isMobile ? 'w-[18px]' : 'w-6'} h-[2px]`}
                style={{ backgroundColor: textColor }}
              />
              <span
                className={`block ${isMobile ? 'w-[18px]' : 'w-6'} h-[2px]`}
                style={{ backgroundColor: textColor }}
              />
            </button>

            {/* Logo - KBS */}
            <div
              className={`font-medium ${isMobile ? 'text-base' : 'text-lg'} tracking-wide`}
              style={{ color: textColor }}
            >
              KBS
            </div>
          </div>

          {/* Center Section - Search Icon with Expandable Text Box (hidden on very small mobile) */}
          <div className={`search-container flex items-center ${isMobile && searchExpanded ? 'absolute left-1/2 -translate-x-1/2 z-10' : ''}`}>
            <div
              className="flex items-center overflow-hidden transition-all duration-300 ease-out rounded-full"
              style={{
                width: searchExpanded
                  ? (isMobile ? `${Math.min(vw - 120, 200)}px` : isTablet ? '180px' : '220px')
                  : (isMobile ? '36px' : '40px'),
                backgroundColor: searchExpanded
                  ? (progress > 0.5 ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)')
                  : 'transparent',
                padding: searchExpanded ? (isMobile ? '2px 10px' : '4px 12px') : '0',
              }}
            >
              <button
                className={`${isMobile ? 'p-1.5' : 'p-2'} hover:opacity-70 transition-opacity flex-shrink-0`}
                onClick={() => setSearchExpanded(!searchExpanded)}
                aria-label={searchExpanded ? 'Close search' : 'Open search'}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={isMobile ? "18" : "20"}
                  height={isMobile ? "18" : "20"}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={textColor}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
              
              {searchExpanded && (
                <form onSubmit={handleSearchSubmit} className="flex-1">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className={`w-full bg-transparent border-none outline-none ${isMobile ? 'text-xs' : 'text-sm'}`}
                    style={{
                      color: textColor,
                      caretColor: textColor,
                    }}
                  />
                </form>
              )}
            </div>
          </div>

          {/* Right Section - Cart Icon & User Login/Signup Icon */}
          <div className={`flex items-center ${isMobile ? 'gap-2' : isTablet ? 'gap-3' : 'gap-4'}`}>
            {/* Cart Icon */}
            <button
              className={`${isMobile ? 'p-1.5' : 'p-2'} hover:opacity-70 transition-opacity relative`}
              title="Cart"
              onClick={handleCartClick}
              aria-label="Shopping cart"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={isMobile ? "20" : "22"}
                height={isMobile ? "20" : "22"}
                viewBox="0 0 24 24"
                fill="none"
                stroke={textColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="m1 1 4 4h16l-2.5 9H7.1"></path>
                <path d="M6.1 14H21"></path>
              </svg>
              {/* Cart Badge */}
              <span
                className={`absolute ${isMobile ? '-top-0.5 -right-0.5 w-3.5 h-3.5 text-[10px]' : '-top-1 -right-1 w-4 h-4 text-xs'} rounded-full flex items-center justify-center`}
                style={{
                  backgroundColor: progress > 0.5 ? '#1a1a1a' : '#fff',
                  color: progress > 0.5 ? '#fff' : '#1a1a1a',
                }}
              >
                0
              </span>
            </button>
            
            {/* User Login/Signup Icon - Direct Navigation (no dropdown) */}
            <Link
              href={isAuthenticated ? "/dashboard" : "/account"}
              className={`${isMobile ? 'p-1.5' : 'p-2'} hover:opacity-70 transition-opacity relative flex items-center justify-center`}
              title={isAuthenticated ? "My Dashboard" : "Login / Sign up"}
              aria-label={isAuthenticated ? "Go to dashboard" : "Login or sign up"}
            >
              {isAuthenticated && user ? (
                <div
                  className={`${isMobile ? 'w-5 h-5 text-[9px]' : 'w-7 h-7 text-xs'} rounded-full flex items-center justify-center font-medium`}
                  style={{
                    background: 'linear-gradient(135deg, #4A90D9 0%, #357abd 100%)',
                    color: '#fff',
                  }}
                >
                  {userInitials}
                </div>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={isMobile ? "20" : "22"}
                  height={isMobile ? "20" : "22"}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={textColor}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ display: 'block' }}
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              )}
              {/* Logged in indicator */}
              {isAuthenticated && (
                <span
                  className={`absolute ${isMobile ? 'bottom-0.5 right-0.5 w-2 h-2' : 'bottom-1 right-1 w-2.5 h-2.5'} rounded-full border-2`}
                  style={{
                    backgroundColor: '#4ade80',
                    borderColor: progress > 0.5 ? '#f5f0e6' : '#0a0a0a'
                  }}
                />
              )}
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;