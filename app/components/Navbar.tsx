'use client';

import React, { useLayoutEffect, useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Menu from './Menu';

interface NavbarProps {
  scrollProgress: number;
  onNavigateToAbout?: () => void;
}

// Simulated user state - in a real app, this would come from auth context
interface User {
  name: string;
  email: string;
}

const Navbar: React.FC<NavbarProps> = ({ scrollProgress, onNavigateToAbout }) => {
  const router = useRouter();
  const [vw, setVw] = useState(1440);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null); // null = not logged in
  const searchInputRef = useRef<HTMLInputElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const updateWidth = () => {
      setVw(window.innerWidth);
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Focus the input when search expands
  useEffect(() => {
    if (searchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchExpanded]);

  // Close search and user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (searchExpanded && !target.closest('.search-container')) {
        setSearchExpanded(false);
      }
      if (userDropdownOpen && !target.closest('.user-dropdown-container')) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [searchExpanded, userDropdownOpen]);

  // Eased progress for smoother animation
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
  const progress = easeOutCubic(scrollProgress);

  // Calculate navbar styles based on scroll progress
  const getNavbarStyles = () => {
    // Target values for pill shape
    const targetWidth = Math.min(600, vw * 0.42);
    const targetPadding = 12;
    const targetTop = 20;
    const targetBorderRadius = 50;

    // Starting values (full width)
    const startWidth = vw;
    const startPadding = 24;
    const startTop = 0;
    const startBorderRadius = 0;

    // Interpolate
    const currentWidth = startWidth - (startWidth - targetWidth) * progress;
    const currentPaddingY = startPadding - (startPadding - targetPadding) * progress;
    const currentPaddingX = 40 - (40 - 20) * progress;
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

  // Handle navigation to About Us - closes menu and triggers animation
  const handleNavigateToAbout = () => {
    setMenuOpen(false);
    if (onNavigateToAbout) {
      // Small delay to allow menu to start closing
      setTimeout(() => {
        onNavigateToAbout();
      }, 100);
    }
  };

  // Handle user icon click
  const handleUserIconClick = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    setUserDropdownOpen(false);
    // In a real app, you would also clear tokens, etc.
  };

  // For demo: simulate login
  const handleDemoLogin = () => {
    setUser({
      name: 'John Doe',
      email: 'john@example.com'
    });
    setUserDropdownOpen(false);
  };

  return (
    <>
      {/* Menu Overlay */}
      <Menu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigateToAbout={handleNavigateToAbout}
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
          <div className="flex items-center gap-6">
            {/* Hamburger Menu */}
            <button 
              className="flex flex-col gap-1.5 p-2 hover:opacity-70 transition-opacity"
              onClick={() => setMenuOpen(true)}
            >
              <span 
                className="block w-6 h-0.5"
                style={{ backgroundColor: textColor }}
              />
              <span 
                className="block w-6 h-0.5"
                style={{ backgroundColor: textColor }}
              />
            </button>

            {/* Logo - AE.1 */}
            <div 
              className="font-medium text-lg tracking-wide"
              style={{ color: textColor }}
            >
              KBS
            </div>
          </div>

          {/* Center Section - Search Icon with Expandable Text Box */}
          <div className="search-container flex items-center">
            <div 
              className="flex items-center overflow-hidden transition-all duration-300 ease-out rounded-full"
              style={{
                width: searchExpanded ? '220px' : '40px',
                backgroundColor: searchExpanded 
                  ? (progress > 0.5 ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)') 
                  : 'transparent',
                padding: searchExpanded ? '4px 12px' : '0',
              }}
            >
              <button 
                className="p-2 hover:opacity-70 transition-opacity flex-shrink-0"
                onClick={() => setSearchExpanded(!searchExpanded)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
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
                    className="w-full bg-transparent border-none outline-none text-sm"
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
          <div className="flex items-center gap-4">
            {/* Cart Icon */}
            <button
              className="p-2 hover:opacity-70 transition-opacity relative"
              title="Cart"
              onClick={handleCartClick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
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
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center"
                style={{ 
                  backgroundColor: progress > 0.5 ? '#1a1a1a' : '#fff',
                  color: progress > 0.5 ? '#fff' : '#1a1a1a',
                }}
              >
                0
              </span>
            </button>
            
            {/* User Login/Signup Icon with Dropdown */}
            <div className="user-dropdown-container relative">
              <button
                className="p-2 hover:opacity-70 transition-opacity"
                title={user ? user.name : "Login / Sign up"}
                onClick={handleUserIconClick}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={textColor}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                {/* Logged in indicator */}
                {user && (
                  <span
                    className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full border-2"
                    style={{
                      backgroundColor: '#4ade80',
                      borderColor: progress > 0.5 ? '#f5f0e6' : '#0a0a0a'
                    }}
                  />
                )}
              </button>

              {/* User Dropdown */}
              <div
                ref={userDropdownRef}
                className={`user-dropdown ${userDropdownOpen ? 'open' : ''}`}
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 12px)',
                  right: 0,
                  width: '280px',
                  background: 'rgba(255, 255, 255, 0.92)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                  opacity: userDropdownOpen ? 1 : 0,
                  transform: userDropdownOpen ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.95)',
                  pointerEvents: userDropdownOpen ? 'auto' : 'none',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  transformOrigin: 'top right',
                  zIndex: 300,
                  overflow: 'hidden',
                }}
              >
                {user ? (
                  /* Logged In State */
                  <>
                    {/* User Info Header */}
                    <div className="px-5 py-4 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Account Options */}
                    <div className="py-2">
                      <Link
                        href="/account"
                        className="dropdown-item"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                        <span>My Account</span>
                      </Link>
                      <Link
                        href="/store"
                        className="dropdown-item"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                          <line x1="3" y1="6" x2="21" y2="6"/>
                          <path d="M16 10a4 4 0 0 1-8 0"/>
                        </svg>
                        <span>Orders</span>
                      </Link>
                      <Link
                        href="/store"
                        className="dropdown-item"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                        <span>Wishlist</span>
                      </Link>
                      <button
                        className="dropdown-item"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="3"/>
                          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                        </svg>
                        <span>Settings</span>
                      </button>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-100 py-2">
                      <button
                        className="dropdown-item text-red-500"
                        onClick={handleLogout}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                          <polyline points="16 17 21 12 16 7"/>
                          <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </>
                ) : (
                  /* Not Logged In State */
                  <>
                    {/* Welcome Header */}
                    <div className="px-5 py-4 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">Welcome to KBS</p>
                      <p className="text-xs text-gray-500 mt-1">Sign in for the best experience</p>
                    </div>

                    {/* Sign In Options */}
                    <div className="p-4">
                      <Link
                        href="/account"
                        className="w-full mb-3 py-3 px-4 bg-black text-white rounded-full text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/account"
                        className="w-full py-3 px-4 bg-gray-100 text-gray-900 rounded-full text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        Create Account
                      </Link>
                    </div>

                    {/* Social Login Divider */}
                    <div className="px-4 flex items-center gap-3">
                      <div className="flex-1 h-px bg-gray-200"></div>
                      <span className="text-xs text-gray-400">or continue with</span>
                      <div className="flex-1 h-px bg-gray-200"></div>
                    </div>

                    {/* Social Login Options */}
                    <div className="p-4 flex gap-3">
                      <button
                        className="flex-1 py-2.5 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
                        onClick={handleDemoLogin}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#000">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                        </svg>
                        Apple
                      </button>
                      <button
                        className="flex-1 py-2.5 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
                        onClick={handleDemoLogin}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Google
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Dropdown Styles */}
      <style jsx global>{`
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 20px;
          background: transparent;
          border: none;
          font-size: 14px;
          color: #333;
          cursor: pointer;
          transition: background-color 0.2s ease;
          text-decoration: none;
        }

        .dropdown-item:hover {
          background: rgba(0, 0, 0, 0.05);
        }

        .dropdown-item svg {
          opacity: 0.7;
        }

        .dropdown-item.text-red-500 {
          color: #ef4444;
        }

        .dropdown-item.text-red-500:hover {
          background: rgba(239, 68, 68, 0.08);
        }
      `}</style>
    </>
  );
};

export default Navbar;