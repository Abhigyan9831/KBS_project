'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToAbout?: () => void;
}

const Menu: React.FC<MenuProps> = ({ isOpen, onClose, onNavigateToAbout }) => {
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

      {/* Menu Container - With padding on all sides */}
      <div
        className={`fixed z-[300] transition-all duration-500 pointer-events-none`}
        style={{
          top: '24px',
          left: '24px',
          right: '24px',
          bottom: '24px',
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
          {/* Inner content wrapper with padding on all sides */}
          <div className="h-full p-6 md:p-8 lg:p-10">
            {/* Menu Header - with spacing from edges */}
            <div className="flex items-center justify-between mb-6 md:mb-8">
              {/* Left - Empty space for balance */}
              <div className="w-10" />

              {/* Center - Home Icon */}
              <Link href="/" className="p-2 hover:opacity-70 transition-opacity" onClick={onClose}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
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
                className="p-2 hover:opacity-70 transition-all duration-300 hover:rotate-90"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
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

            {/* Menu Content - With space from header and edges */}
            <div className="flex h-[calc(100%-80px)]">
              {/* Left Section - Product Categories */}
              <div className="w-[42%] flex flex-col justify-between pr-8 lg:pr-12">
                {/* Top - Categories */}
                <div>
                  {/* Section Title */}
                  <div className="text-sm text-[#888] mb-8 pb-3 border-b border-[#ddd]">
                    All Electric
                  </div>

                  {/* Product Links - Large text like in the image */}
                  <div className="space-y-1">
                    <Link
                      href="/store"
                      onClick={onClose}
                      className="menu-link-hover group flex items-center justify-between py-5 border-b border-[#ddd] hover:border-[#1a1a1a] transition-colors"
                    >
                      <span className="menu-link-text text-[60px] md:text-[72px] lg:text-[80px] font-light text-[#1a1a1a] tracking-tight leading-none">
                        Store
                      </span>
                    </Link>

                    <a
                      href="#account"
                      className="menu-link-hover group flex items-center justify-between py-5 border-b border-[#ddd] hover:border-[#1a1a1a] transition-colors"
                    >
                      <span className="menu-link-text text-[60px] md:text-[72px] lg:text-[80px] font-light text-[#1a1a1a] tracking-tight leading-none">
                        Account Details
                      </span>
                    </a>
                  </div>
                </div>

                {/* Bottom - Footer Links - Matching image layout */}
                <div className="flex gap-16 lg:gap-24 mt-auto pb-2">
                  <div className="space-y-2">
                    <a href="#company" className="block text-sm text-[#1a1a1a] hover:opacity-70 transition-opacity">
                      Company
                    </a>
                    <a href="#events" className="block text-sm text-[#1a1a1a] hover:opacity-70 transition-opacity">
                      Events
                    </a>
                    <a href="#press" className="block text-sm text-[#1a1a1a] hover:opacity-70 transition-opacity">
                      Press & Media
                    </a>
                  </div>
                  <div className="space-y-2">
                    <a href="#journal" className="block text-sm text-[#1a1a1a] hover:opacity-70 transition-opacity">
                      Journal
                    </a>
                    <a href="#careers" className="block text-sm text-[#1a1a1a] hover:opacity-70 transition-opacity">
                      Careers
                    </a>
                    <a href="#compare" className="block text-sm text-[#1a1a1a] hover:opacity-70 transition-opacity">
                      Compare
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Section - Feature Cards - With proper spacing */}
              <div className="w-[58%] flex gap-4 lg:gap-5 pl-4 lg:pl-8">
                {/* Large Card - About Us (clickable to navigate) */}
                <div
                  className="w-[62%] relative rounded-2xl overflow-hidden group cursor-pointer"
                  onClick={() => {
                    if (onNavigateToAbout) {
                      onNavigateToAbout();
                    }
                  }}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{
                      backgroundImage: 'url(/images/pexels-burakkostak-18809.jpg)',
                      backgroundColor: '#6b7d8c',
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <h3 className="text-xl font-medium mb-1">About Us</h3>
                    <p className="text-sm opacity-80">Make your home smart with us</p>
                  </div>
                </div>

                {/* Right Column - Two smaller cards */}
                <div className="w-[38%] flex flex-col gap-4">
                  {/* Technology Card */}
                  <div className="flex-1 relative rounded-2xl overflow-hidden group cursor-pointer">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{
                        backgroundImage: 'url(/images/pexels-ahmetcigsar-17406672.jpg)',
                        backgroundColor: '#e0e0e0',
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-lg font-medium mb-0.5">Technology</h3>
                      <p className="text-xs opacity-80">Discover the tech within KBS</p>
                    </div>
                  </div>

                  {/* Connect with us Card */}
                  <div className="flex-1 relative rounded-2xl overflow-hidden group cursor-pointer">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{
                        backgroundImage: 'url(/images/austin-distel-wD1LRb9OeEo-unsplash.jpg)',
                        backgroundColor: '#6b8b6a',
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-lg font-medium mb-0.5">Connect with us</h3>
                      <p className="text-xs opacity-80">Questions? We&apos;ve got answers</p>
                    </div>
                    {/* Chat Icon */}
                    <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
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
                  </div>
                </div>
              </div>
            </div>
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
      `}</style>
    </>
  );
};

export default Menu;