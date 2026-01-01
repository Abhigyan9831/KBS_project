'use client';

import React, { useEffect, useState, useLayoutEffect } from 'react';
import Link from 'next/link';

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const Menu: React.FC<MenuProps> = ({ isOpen, onClose }) => {
  const [dimensions, setDimensions] = useState({
    vh: 900,
    vw: 1200,
    isMobile: false,
    isTablet: false,
  });

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

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Dark overlay behind menu */}
      <div
        className={`fixed inset-0 z-[299] bg-black/40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Menu Container - With responsive padding on all sides */}
      <div
        className={`fixed z-[300] transition-all duration-500 pointer-events-none`}
        style={{
          top: isMobile ? '12px' : isTablet ? '16px' : '24px',
          left: isMobile ? '12px' : isTablet ? '16px' : '24px',
          right: isMobile ? '12px' : isTablet ? '16px' : '24px',
          bottom: isMobile ? '12px' : isTablet ? '16px' : '24px',
        }}
      >
        {/* Menu Panel - Rounded corners, not full screen */}
        <div
          className={`w-full h-full rounded-3xl overflow-hidden pointer-events-auto transition-all duration-500 ease-out ${
            isOpen 
              ? 'opacity-100 scale-100 translate-y-0' 
              : 'opacity-0 scale-[0.97] -translate-y-4 pointer-events-none'
          }`}
          style={{ 
            backgroundColor: '#F5F0E6',
            boxShadow: isOpen ? '0 25px 80px -12px rgba(0, 0, 0, 0.35)' : 'none',
          }}
        >
          {/* Inner content wrapper with responsive padding */}
          <div
            className="h-full overflow-y-auto"
            style={{
              padding: isMobile ? '16px' : isTablet ? '24px' : '40px',
            }}
          >
            {/* Menu Header */}
            <div className="flex items-center justify-between mb-4 md:mb-6 lg:mb-8">
              {/* Left - Empty space for balance */}
              <div className="w-10" />

              {/* Center - Home Icon */}
              <Link
                href="/"
                className="p-2 hover:opacity-70 transition-opacity min-h-[44px] min-w-[44px] flex items-center justify-center"
                onClick={onClose}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={isMobile ? "22" : "24"}
                  height={isMobile ? "22" : "24"}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1a1a1a"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </Link>

              {/* Right - Close Button */}
              <button
                onClick={onClose}
                className="p-2 hover:opacity-70 transition-all duration-300 hover:rotate-90 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={isMobile ? "22" : "24"}
                  height={isMobile ? "22" : "24"}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1a1a1a"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Menu Content - Responsive layout */}
            {isMobile ? (
              /* Mobile Layout - Single column, scrollable */
              <div className="flex flex-col gap-6">
                {/* Navigation Links */}
                <div>
                  <div className="text-xs text-[#888] mb-4 pb-2 border-b border-[#ddd]">
                    Navigation
                  </div>
                  <div className="space-y-0">
                    <Link
                      href="/store"
                      onClick={onClose}
                      className="menu-link-hover group flex items-center justify-between py-3 border-b border-[#ddd] hover:border-[#1a1a1a] transition-colors"
                    >
                      <span className="menu-link-text text-[36px] font-light text-[#1a1a1a] tracking-tight leading-none">
                        Store
                      </span>
                    </Link>
                    <Link
                      href="/account"
                      onClick={onClose}
                      className="menu-link-hover group flex items-center justify-between py-3 border-b border-[#ddd] hover:border-[#1a1a1a] transition-colors"
                    >
                      <span className="menu-link-text text-[36px] font-light text-[#1a1a1a] tracking-tight leading-none">
                        Account
                      </span>
                    </Link>
                  </div>
                </div>

                {/* Feature Cards - Horizontal scroll on mobile */}
                <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory">
                  {/* About Us Card */}
                  <Link
                    href="/about"
                    onClick={onClose}
                    className="flex-shrink-0 w-[70vw] max-w-[280px] h-40 relative rounded-xl overflow-hidden group cursor-pointer snap-start"
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{
                        backgroundImage: 'url(/images/pexels-burakkostak-18809.jpg)',
                        backgroundColor: '#6b7d8c',
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="text-base font-medium mb-0.5">About Us</h3>
                      <p className="text-xs opacity-80">Make your home smart</p>
                    </div>
                  </Link>

                  {/* FAQ Card */}
                  <Link
                    href="/faq"
                    onClick={onClose}
                    className="flex-shrink-0 w-[60vw] max-w-[240px] h-40 relative rounded-xl overflow-hidden group cursor-pointer snap-start"
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{
                        backgroundImage: 'url(/images/pexels-ahmetcigsar-17406672.jpg)',
                        backgroundColor: '#e0e0e0',
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="text-base font-medium mb-0.5">FAQ</h3>
                      <p className="text-xs opacity-80">Common questions</p>
                    </div>
                  </Link>

                  {/* Contact Card */}
                  <Link
                    href="/contact"
                    onClick={onClose}
                    className="flex-shrink-0 w-[60vw] max-w-[240px] h-40 relative rounded-xl overflow-hidden group cursor-pointer snap-start"
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{
                        backgroundImage: 'url(/images/austin-distel-wD1LRb9OeEo-unsplash.jpg)',
                        backgroundColor: '#6b8b6a',
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="text-base font-medium mb-0.5">Contact</h3>
                      <p className="text-xs opacity-80">Get in touch</p>
                    </div>
                  </Link>
                </div>

                {/* Footer Links - 2 columns on mobile */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 pt-4 border-t border-[#ddd]">
                  <Link href="/about" onClick={onClose} className="block text-sm text-[#1a1a1a] hover:opacity-70 transition-opacity py-1">
                    About Us
                  </Link>
                  <Link href="/faq" onClick={onClose} className="block text-sm text-[#1a1a1a] hover:opacity-70 transition-opacity py-1">
                    FAQ
                  </Link>
                  <Link href="/contact" onClick={onClose} className="block text-sm text-[#1a1a1a] hover:opacity-70 transition-opacity py-1">
                    Contact
                  </Link>
                  <Link href="/shipping" onClick={onClose} className="block text-sm text-[#1a1a1a] hover:opacity-70 transition-opacity py-1">
                    Shipping & Returns
                  </Link>
                  <Link href="/terms" onClick={onClose} className="block text-sm text-[#1a1a1a] hover:opacity-70 transition-opacity py-1">
                    Terms of Service
                  </Link>
                  <Link href="/privacy" onClick={onClose} className="block text-sm text-[#1a1a1a] hover:opacity-70 transition-opacity py-1">
                    Privacy Policy
                  </Link>
                </div>
              </div>
            ) : (
              /* Tablet & Desktop Layout - Two columns */
              <div className="flex h-[calc(100%-60px)]">
                {/* Left Section - Product Categories */}
                <div
                  className="flex flex-col justify-between"
                  style={{
                    width: isTablet ? '45%' : '42%',
                    paddingRight: isTablet ? '24px' : '48px',
                  }}
                >
                  {/* Top - Categories */}
                  <div>
                    {/* Section Title */}
                    <div className="text-sm text-[#888] mb-6 lg:mb-8 pb-3 border-b border-[#ddd]">
                      All Electric
                    </div>

                    {/* Product Links */}
                    <div className="space-y-1">
                      <Link
                        href="/store"
                        onClick={onClose}
                        className="menu-link-hover group flex items-center justify-between py-4 lg:py-5 border-b border-[#ddd] hover:border-[#1a1a1a] transition-colors"
                      >
                        <span className={`menu-link-text font-light text-[#1a1a1a] tracking-tight leading-none ${isTablet ? 'text-[48px]' : 'text-[72px] lg:text-[80px]'}`}>
                          Store
                        </span>
                      </Link>

                      <Link
                        href="/account"
                        onClick={onClose}
                        className="menu-link-hover group flex items-center justify-between py-4 lg:py-5 border-b border-[#ddd] hover:border-[#1a1a1a] transition-colors"
                      >
                        <span className={`menu-link-text font-light text-[#1a1a1a] tracking-tight leading-none ${isTablet ? 'text-[48px]' : 'text-[72px] lg:text-[80px]'}`}>
                          Account
                        </span>
                      </Link>
                    </div>
                  </div>

                  {/* Bottom - Footer Links */}
                  <div className={`flex mt-auto pb-2 ${isTablet ? 'gap-10' : 'gap-16 lg:gap-24'}`}>
                    <div className="space-y-2">
                      <Link href="/about" onClick={onClose} className="block text-sm text-[#1a1a1a] hover:opacity-70 transition-opacity">
                        About Us
                      </Link>
                      <Link href="/contact" onClick={onClose} className="block text-sm text-[#1a1a1a] hover:opacity-70 transition-opacity">
                        Contact
                      </Link>
                      <Link href="/faq" onClick={onClose} className="block text-sm text-[#1a1a1a] hover:opacity-70 transition-opacity">
                        FAQ
                      </Link>
                    </div>
                    <div className="space-y-2">
                      <Link href="/shipping" onClick={onClose} className="block text-sm text-[#1a1a1a] hover:opacity-70 transition-opacity">
                        Shipping & Returns
                      </Link>
                      <Link href="/terms" onClick={onClose} className="block text-sm text-[#1a1a1a] hover:opacity-70 transition-opacity">
                        Terms of Service
                      </Link>
                      <Link href="/privacy" onClick={onClose} className="block text-sm text-[#1a1a1a] hover:opacity-70 transition-opacity">
                        Privacy Policy
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Right Section - Feature Cards */}
                <div
                  className="flex"
                  style={{
                    width: isTablet ? '55%' : '58%',
                    gap: isTablet ? '12px' : '20px',
                    paddingLeft: isTablet ? '12px' : '32px',
                  }}
                >
                  {/* Large Card - About Us */}
                  <Link
                    href="/about"
                    onClick={onClose}
                    className="relative rounded-2xl overflow-hidden group cursor-pointer"
                    style={{ width: '62%' }}
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{
                        backgroundImage: 'url(/images/pexels-burakkostak-18809.jpg)',
                        backgroundColor: '#6b7d8c',
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className={`absolute left-4 right-4 text-white ${isTablet ? 'bottom-4' : 'bottom-6'}`}>
                      <h3 className={`font-medium mb-1 ${isTablet ? 'text-lg' : 'text-xl'}`}>About Us</h3>
                      <p className={`opacity-80 ${isTablet ? 'text-xs' : 'text-sm'}`}>Make your home smart with us</p>
                    </div>
                  </Link>

                  {/* Right Column - Two smaller cards */}
                  <div className="flex flex-col" style={{ width: '38%', gap: isTablet ? '12px' : '16px' }}>
                    {/* FAQ Card */}
                    <Link
                      href="/faq"
                      onClick={onClose}
                      className="flex-1 relative rounded-2xl overflow-hidden group cursor-pointer"
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{
                          backgroundImage: 'url(/images/pexels-ahmetcigsar-17406672.jpg)',
                          backgroundColor: '#e0e0e0',
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className={`absolute left-3 right-3 text-white ${isTablet ? 'bottom-3' : 'bottom-4'}`}>
                        <h3 className={`font-medium mb-0.5 ${isTablet ? 'text-base' : 'text-lg'}`}>FAQ</h3>
                        <p className="text-xs opacity-80">Common questions answered</p>
                      </div>
                    </Link>

                    {/* Contact Card */}
                    <Link
                      href="/contact"
                      onClick={onClose}
                      className="flex-1 relative rounded-2xl overflow-hidden group cursor-pointer"
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{
                          backgroundImage: 'url(/images/austin-distel-wD1LRb9OeEo-unsplash.jpg)',
                          backgroundColor: '#6b8b6a',
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className={`absolute left-3 right-3 text-white ${isTablet ? 'bottom-3' : 'bottom-4'}`}>
                        <h3 className={`font-medium mb-0.5 ${isTablet ? 'text-base' : 'text-lg'}`}>Contact Us</h3>
                        <p className="text-xs opacity-80">Questions? We&apos;ve got answers</p>
                      </div>
                      {/* Chat Icon */}
                      <div className={`absolute right-3 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm ${isTablet ? 'bottom-3 w-7 h-7' : 'bottom-4 w-8 h-8'}`}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={isTablet ? "14" : "16"}
                          height={isTablet ? "14" : "16"}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Menu Styles */}
      <style jsx global>{`
        /* Underline hover effect for main menu links */
        .menu-link-hover .menu-link-text {
          position: relative;
          display: inline-block;
        }

        .menu-link-hover .menu-link-text::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 0;
          height: 3px;
          background-color: #1a1a1a;
          transition: width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .menu-link-hover:hover .menu-link-text::after {
          width: 100%;
        }

        /* Responsive adjustments for menu text */
        @media (max-width: 1200px) {
          .menu-link-text {
            font-size: 56px !important;
          }
        }

        @media (max-width: 900px) {
          .menu-link-text {
            font-size: 42px !important;
          }
        }

        @media (max-width: 768px) {
          .menu-link-text {
            font-size: 36px !important;
          }
          .menu-link-hover .menu-link-text::after {
            height: 2px;
          }
        }

        @media (max-width: 640px) {
          .menu-link-text {
            font-size: 32px !important;
          }
        }

        /* Hide scrollbar but keep functionality */
        .overflow-y-auto::-webkit-scrollbar {
          width: 0;
          background: transparent;
        }
      `}</style>
    </>
  );
};

export default Menu;