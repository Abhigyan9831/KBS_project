'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';

function AccountContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [titleRevealed, setTitleRevealed] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  
  // Form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  
  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const shutterTopRef = useRef<HTMLDivElement>(null);
  const shutterBottomRef = useRef<HTMLDivElement>(null);

  // Shutter animation on page load
  useEffect(() => {
    if (shutterTopRef.current && shutterBottomRef.current) {
      gsap.set(shutterTopRef.current, { yPercent: 0 });
      gsap.set(shutterBottomRef.current, { yPercent: 0 });
      
      const tl = gsap.timeline({
        onComplete: () => {
          setShowContent(true);
          setTimeout(() => setTitleRevealed(true), 300);
        }
      });
      
      tl.to([shutterTopRef.current, shutterBottomRef.current], {
        yPercent: (index) => index === 0 ? -100 : 100,
        duration: 1.2,
        ease: 'power2.inOut',
        stagger: 0.05,
      });
    }
  }, []);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData(prev => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login:', loginData);
    // Add login logic here
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Signup:', signupData);
    // Add signup logic here
  };

  return (
    <main className={`account-page ${loading ? 'loading' : ''}`}>
      {/* Shutter Animation Panels */}
      <div
        ref={shutterTopRef}
        className="fixed top-0 left-0 w-full h-[50vh] bg-[#0a0a0a] z-[1000] pointer-events-none"
      />
      <div
        ref={shutterBottomRef}
        className="fixed top-[50vh] left-0 w-full h-[50vh] bg-[#0a0a0a] z-[1000] pointer-events-none"
      />

      {/* Back Arrow - Top Left */}
      <button
        className={`account-back-btn ${showContent ? 'visible' : ''}`}
        onClick={() => router.back()}
        title="Go Back"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12 19 5 12 12 5"/>
        </svg>
      </button>

      {/* Header with Home icon */}
      <header className={`account-header ${showContent ? 'visible' : ''}`}>
        <div className="account-header__controls">
          <Link href="/" className="account-header__icon icon-bulge" title="Home">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <section className={`account-content ${showContent ? 'visible' : ''}`}>
        {/* Title Section */}
        <div className="account-title-section">
          <h1 className="account-title__container">
            <span className="account-word-reveal">
              <span className={`account-word-reveal-inner account-word-delay-0 ${titleRevealed ? 'revealed' : ''}`}>
                Account
              </span>
            </span>
          </h1>
          <p className="account-subtitle">Sign in to your account or create a new one</p>
        </div>

        {/* Main Layout */}
        <div className="account-layout">
          {/* Auth Card */}
          <div className="account-card auth-card">
            {/* Tab Switcher */}
            <div className="auth-tabs">
              <button 
                className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
                onClick={() => setActiveTab('login')}
              >
                Sign In
              </button>
              <button 
                className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
                onClick={() => setActiveTab('signup')}
              >
                Create Account
              </button>
            </div>

            {/* Login Form */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="auth-form">
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    className="form-input" 
                    placeholder="john@example.com"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input 
                    type="password" 
                    name="password"
                    className="form-input" 
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    required
                  />
                </div>

                <div className="form-footer">
                  <button type="button" className="forgot-password">
                    Forgot password?
                  </button>
                </div>

                <button type="submit" className="auth-submit-btn">
                  Sign In
                </button>

                <div className="auth-divider">
                  <span>or continue with</span>
                </div>

                {/* Social Login Options */}
                <div className="social-login-options">
                  <button type="button" className="social-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#000">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    <span>Apple</span>
                  </button>
                  <button type="button" className="social-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Google</span>
                  </button>
                </div>
              </form>
            )}

            {/* Signup Form */}
            {activeTab === 'signup' && (
              <form onSubmit={handleSignupSubmit} className="auth-form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input 
                      type="text" 
                      name="firstName"
                      className="form-input" 
                      placeholder="John"
                      value={signupData.firstName}
                      onChange={handleSignupChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input 
                      type="text" 
                      name="lastName"
                      className="form-input" 
                      placeholder="Doe"
                      value={signupData.lastName}
                      onChange={handleSignupChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    className="form-input" 
                    placeholder="john@example.com"
                    value={signupData.email}
                    onChange={handleSignupChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input 
                    type="password" 
                    name="password"
                    className="form-input" 
                    placeholder="Create a password"
                    value={signupData.password}
                    onChange={handleSignupChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input 
                    type="password" 
                    name="confirmPassword"
                    className="form-input" 
                    placeholder="Confirm your password"
                    value={signupData.confirmPassword}
                    onChange={handleSignupChange}
                    required
                  />
                </div>

                <div className="terms-checkbox">
                  <input type="checkbox" id="terms" required />
                  <label htmlFor="terms">
                    I agree to the <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>
                  </label>
                </div>

                <button type="submit" className="auth-submit-btn">
                  Create Account
                </button>

                <div className="auth-divider">
                  <span>or continue with</span>
                </div>

                {/* Social Signup Options */}
                <div className="social-login-options">
                  <button type="button" className="social-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#000">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    <span>Apple</span>
                  </button>
                  <button type="button" className="social-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Google</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Info Card */}
          <div className="account-card info-card">
            <div className="info-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h3 className="info-title">Why create an account?</h3>
            <ul className="info-list">
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>Track your orders and delivery status</span>
              </li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>Save your favorite products</span>
              </li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>Faster checkout experience</span>
              </li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>Exclusive member discounts</span>
              </li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>Early access to new products</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Styles */}
      <style jsx global>{`
        /* Account Page Styles */
        .account-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 25%, #ffffff 50%, #f0f0f0 75%, #e5e5e5 100%);
          font-family: sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          color: #111;
        }

        /* Loading State */
        .account-page.loading::before,
        .account-page.loading::after {
          content: '';
          position: fixed;
          z-index: 1000;
        }

        .account-page.loading::before {
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 50%, #e5e5e5 100%);
        }

        .account-page.loading::after {
          top: 50%;
          left: 50%;
          width: 60px;
          height: 60px;
          margin: -30px 0 0 -30px;
          border-radius: 50%;
          opacity: 0.4;
          background: #111;
          animation: loaderAnim 0.7s linear infinite alternate forwards;
        }

        @keyframes loaderAnim {
          to {
            opacity: 1;
            transform: scale3d(0.5, 0.5, 1);
          }
        }

        /* Icon Bulge Animation */
        .icon-bulge {
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .icon-bulge:hover {
          transform: scale(1.2);
        }

        .icon-bulge:active {
          transform: scale(0.95);
        }

        /* Back Button */
        .account-back-btn {
          position: fixed;
          top: 24px;
          left: 32px;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          color: #000;
          opacity: 0;
          transform: translateY(-20px);
          transition: opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s, background-color 0.3s ease;
        }

        .account-back-btn.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .account-back-btn:hover {
          background: rgba(255, 255, 255, 1);
          transform: translateY(0) scale(1.1);
        }

        /* Account Header */
        .account-header {
          position: fixed;
          top: 0;
          right: 0;
          z-index: 1000;
          padding: 24px 32px;
          opacity: 0;
          transform: translateY(-20px);
          transition: opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s;
        }

        .account-header.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .account-header__controls {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .account-header__icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          color: #000;
        }

        /* Account Content */
        .account-content {
          padding: 60px 80px 80px;
          min-height: 100vh;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease 0.7s, transform 0.6s ease 0.7s;
        }

        .account-content.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Title Section */
        .account-title-section {
          margin-bottom: 48px;
        }

        .account-title__container {
          font-family: sans-serif;
          font-size: 72px;
          line-height: 1;
          color: #000;
          font-weight: 300;
          letter-spacing: -0.02em;
          margin: 0 0 16px 0;
        }

        .account-subtitle {
          font-size: 16px;
          color: #000;
          font-weight: 500;
          margin: 0;
        }

        /* Word by Word Reveal Animation */
        .account-word-reveal {
          display: inline-block;
          overflow: hidden;
          vertical-align: bottom;
        }

        .account-word-reveal-inner {
          display: inline-block;
          transform: translateY(100%);
          opacity: 0;
        }

        .account-word-reveal-inner.revealed {
          transform: translateY(0);
          opacity: 1;
        }

        .account-word-delay-0 {
          transition: transform 1s cubic-bezier(0.23, 1, 0.32, 1) 0.2s,
                      opacity 0.8s ease-out 0.2s;
        }

        /* Main Layout */
        .account-layout {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 32px;
          align-items: start;
          max-width: 1100px;
        }

        /* Account Cards */
        .account-card {
          background: #fff;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        /* Auth Tabs */
        .auth-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 32px;
          padding: 4px;
          background: #f5f5f5;
          border-radius: 12px;
        }

        .auth-tab {
          flex: 1;
          padding: 14px 24px;
          border: none;
          background: transparent;
          font-size: 15px;
          font-weight: 500;
          color: #666;
          cursor: pointer;
          border-radius: 10px;
          transition: all 0.3s ease;
        }

        .auth-tab:hover {
          color: #333;
        }

        .auth-tab.active {
          background: #fff;
          color: #000;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        /* Auth Form */
        .auth-form {
          display: flex;
          flex-direction: column;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .form-label {
          display: block;
          font-size: 14px;
          color: #000;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .form-input {
          width: 100%;
          padding: 16px;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          font-size: 15px;
          color: #000;
          background: #fff;
          transition: border-color 0.3s ease;
          box-sizing: border-box;
        }

        .form-input:focus {
          outline: none;
          border-color: #4A90D9;
        }

        .form-input::placeholder {
          color: #bbb;
        }

        .form-footer {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 24px;
        }

        .forgot-password {
          background: none;
          border: none;
          color: #4A90D9;
          font-size: 14px;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .forgot-password:hover {
          color: #357abd;
        }

        .terms-checkbox {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 24px;
        }

        .terms-checkbox input {
          margin-top: 3px;
        }

        .terms-checkbox label {
          font-size: 14px;
          color: #666;
          line-height: 1.4;
        }

        .terms-checkbox a {
          color: #4A90D9;
          text-decoration: none;
        }

        .terms-checkbox a:hover {
          text-decoration: underline;
        }

        .auth-submit-btn {
          width: 100%;
          padding: 18px;
          background: #111;
          color: #fff;
          border: none;
          border-radius: 50px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.3s ease, transform 0.2s ease;
        }

        .auth-submit-btn:hover {
          background: #333;
          transform: translateY(-2px);
        }

        .auth-divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 24px 0;
          color: #999;
          font-size: 14px;
        }

        .auth-divider::before,
        .auth-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #eee;
        }

        /* Social Login Options */
        .social-login-options {
          display: flex;
          gap: 12px;
        }

        .social-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 24px;
          background: #f5f5f5;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          color: #333;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .social-btn:hover {
          background: #eee;
          border-color: #ddd;
        }

        /* Info Card */
        .info-card {
          position: sticky;
          top: 100px;
        }

        .info-icon {
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f5f5f5 0%, #e5e5e5 100%);
          border-radius: 50%;
          margin-bottom: 24px;
          color: #333;
        }

        .info-title {
          font-size: 20px;
          font-weight: 500;
          color: #000;
          margin: 0 0 20px 0;
        }

        .info-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .info-list li {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          color: #444;
          font-size: 14px;
        }

        .info-list li svg {
          color: #4A90D9;
          flex-shrink: 0;
        }

        /* Responsive Styles */
        @media (max-width: 1024px) {
          .account-content {
            padding: 48px 40px;
          }

          .account-layout {
            grid-template-columns: 1fr;
          }

          .info-card {
            position: static;
            order: -1;
          }

          .account-title__container {
            font-size: 56px;
          }
        }

        @media (max-width: 768px) {
          .account-content {
            padding: 32px 24px;
          }

          .account-title__container {
            font-size: 42px;
          }

          .account-card {
            padding: 24px;
          }

          .account-header {
            padding: 16px;
          }

          .account-header__icon {
            width: 44px;
            height: 44px;
          }

          .account-back-btn {
            top: 16px;
            left: 16px;
            width: 44px;
            height: 44px;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .social-login-options {
            flex-direction: column;
          }
        }

        @media (max-width: 480px) {
          .account-title__container {
            font-size: 32px;
          }

          .account-back-btn {
            width: 40px;
            height: 40px;
          }
        }
      `}</style>
    </main>
  );
}

export default function AccountPage() {
  return <AccountContent />;
}