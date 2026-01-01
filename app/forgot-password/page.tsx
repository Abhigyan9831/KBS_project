'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'sent' | 'reset' | 'success'>('email');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Validate email
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('sent');
    }, 1500);
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Validate code (demo: accept any 6-digit code)
    if (code.length !== 6 || !/^\d+$/.test(code)) {
      setError('Please enter a valid 6-digit code');
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('reset');
    }, 1000);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Validate passwords
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      setIsSubmitting(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('success');
    }, 1500);
  };

  const handleResendCode = () => {
    // Simulate resend
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert('A new code has been sent to your email');
    }, 1000);
  };

  return (
    <main className={`forgot-page ${loading ? 'loading' : ''}`}>
      {/* Shutter Animation Panels */}
      <div
        ref={shutterTopRef}
        className="fixed top-0 left-0 w-full h-[50vh] bg-[#0a0a0a] z-[1000] pointer-events-none"
      />
      <div
        ref={shutterBottomRef}
        className="fixed top-[50vh] left-0 w-full h-[50vh] bg-[#0a0a0a] z-[1000] pointer-events-none"
      />

      {/* Back Arrow */}
      <button
        className={`forgot-back-btn ${showContent ? 'visible' : ''}`}
        onClick={() => router.back()}
        title="Go Back"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12 19 5 12 12 5"/>
        </svg>
      </button>

      {/* Header */}
      <header className={`forgot-header ${showContent ? 'visible' : ''}`}>
        <div className="forgot-header__controls">
          <Link href="/" className="forgot-header__icon icon-bulge" title="Home">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <section className={`forgot-content ${showContent ? 'visible' : ''}`}>
        <div className="forgot-card">
          {step === 'email' && (
            <>
              <div className="forgot-card__icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <h1>Forgot Password?</h1>
              <p className="forgot-card__subtitle">
                No worries! Enter your email address and we&apos;ll send you a reset code.
              </p>

              <form onSubmit={handleEmailSubmit} className="forgot-form">
                <div className="forgot-form__field">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                {error && <p className="forgot-form__error">{error}</p>}

                <button 
                  type="submit" 
                  className="forgot-form__submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="forgot-form__spinner" />
                      Sending...
                    </>
                  ) : (
                    'Send Reset Code'
                  )}
                </button>
              </form>

              <p className="forgot-card__footer">
                Remember your password? <Link href="/account">Sign In</Link>
              </p>
            </>
          )}

          {step === 'sent' && (
            <>
              <div className="forgot-card__icon sent">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <h1>Check Your Email</h1>
              <p className="forgot-card__subtitle">
                We&apos;ve sent a 6-digit code to <strong>{email}</strong>
              </p>

              <form onSubmit={handleCodeSubmit} className="forgot-form">
                <div className="forgot-form__field">
                  <label htmlFor="code">Verification Code</label>
                  <input
                    type="text"
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className="forgot-form__code-input"
                    required
                  />
                </div>

                {error && <p className="forgot-form__error">{error}</p>}

                <button 
                  type="submit" 
                  className="forgot-form__submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="forgot-form__spinner" />
                      Verifying...
                    </>
                  ) : (
                    'Verify Code'
                  )}
                </button>
              </form>

              <p className="forgot-card__footer">
                Didn&apos;t receive the code?{' '}
                <button 
                  onClick={handleResendCode}
                  disabled={isSubmitting}
                  className="forgot-resend-btn"
                >
                  Resend
                </button>
              </p>
            </>
          )}

          {step === 'reset' && (
            <>
              <div className="forgot-card__icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
                </svg>
              </div>
              <h1>Create New Password</h1>
              <p className="forgot-card__subtitle">
                Your new password must be different from your previous password.
              </p>

              <form onSubmit={handlePasswordSubmit} className="forgot-form">
                <div className="forgot-form__field">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                  />
                  <span className="forgot-form__hint">Must be at least 8 characters</span>
                </div>

                <div className="forgot-form__field">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                  />
                </div>

                {error && <p className="forgot-form__error">{error}</p>}

                <button 
                  type="submit" 
                  className="forgot-form__submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="forgot-form__spinner" />
                      Resetting...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </form>
            </>
          )}

          {step === 'success' && (
            <>
              <div className="forgot-card__icon success">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h1>Password Reset!</h1>
              <p className="forgot-card__subtitle">
                Your password has been successfully reset. You can now sign in with your new password.
              </p>

              <Link href="/account" className="forgot-form__submit">
                Sign In
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Styles */}
      <style jsx global>{`
        .forgot-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 25%, #ffffff 50%, #f0f0f0 75%, #e5e5e5 100%);
          font-family: sans-serif;
          -webkit-font-smoothing: antialiased;
          color: #111;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .forgot-page.loading::before,
        .forgot-page.loading::after {
          content: '';
          position: fixed;
          z-index: 1000;
        }

        .forgot-page.loading::before {
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 50%, #e5e5e5 100%);
        }

        .forgot-page.loading::after {
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

        .icon-bulge {
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          min-width: 44px;
          min-height: 44px;
        }

        .icon-bulge:hover {
          transform: scale(1.2);
        }

        .forgot-back-btn {
          position: fixed;
          top: clamp(12px, 2vw, 24px);
          left: clamp(12px, 2vw, 32px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          width: clamp(40px, 5vw, 48px);
          height: clamp(40px, 5vw, 48px);
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          color: #000;
          opacity: 0;
          transform: translateY(-20px);
          transition: opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s, background-color 0.3s ease;
        }

        .forgot-back-btn.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .forgot-header {
          position: fixed;
          top: 0;
          right: 0;
          z-index: 1000;
          padding: clamp(12px, 2vw, 24px) clamp(12px, 2vw, 32px);
          opacity: 0;
          transform: translateY(-20px);
          transition: opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s;
        }

        .forgot-header.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .forgot-header__controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .forgot-header__icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: clamp(40px, 5vw, 48px);
          height: clamp(40px, 5vw, 48px);
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          color: #000;
        }

        .forgot-content {
          padding: clamp(24px, 4vw, 48px);
          width: 100%;
          max-width: 440px;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s;
        }

        .forgot-content.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .forgot-card {
          background: #fff;
          padding: clamp(32px, 5vw, 48px);
          border-radius: 24px;
          text-align: center;
          box-shadow: 0 4px 32px rgba(0, 0, 0, 0.08);
        }

        .forgot-card__icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          background: #f5f5f5;
          border-radius: 50%;
          margin-bottom: 24px;
          color: #333;
        }

        .forgot-card__icon.sent {
          background: #e3f2fd;
          color: #1976d2;
        }

        .forgot-card__icon.success {
          background: #e8f5e9;
          color: #2e7d32;
        }

        .forgot-card h1 {
          font-size: clamp(24px, 4vw, 32px);
          font-weight: 500;
          margin: 0 0 12px 0;
        }

        .forgot-card__subtitle {
          font-size: 15px;
          color: #666;
          margin: 0 0 32px 0;
          line-height: 1.6;
        }

        .forgot-card__subtitle strong {
          color: #111;
        }

        .forgot-form {
          text-align: left;
        }

        .forgot-form__field {
          margin-bottom: 20px;
        }

        .forgot-form__field label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 8px;
          color: #333;
        }

        .forgot-form__field input {
          width: 100%;
          padding: 14px 16px;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          font-size: 15px;
          color: #111;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .forgot-form__field input:focus {
          outline: none;
          border-color: #111;
          box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.05);
        }

        .forgot-form__code-input {
          text-align: center;
          font-size: 24px !important;
          letter-spacing: 8px;
          font-weight: 600;
        }

        .forgot-form__hint {
          display: block;
          font-size: 12px;
          color: #999;
          margin-top: 6px;
        }

        .forgot-form__error {
          color: #dc2626;
          font-size: 14px;
          margin: 0 0 16px 0;
          text-align: center;
        }

        .forgot-form__submit {
          width: 100%;
          padding: 16px 24px;
          background: #111;
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: background-color 0.3s ease;
          text-decoration: none;
        }

        .forgot-form__submit:hover:not(:disabled) {
          background: #333;
        }

        .forgot-form__submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .forgot-form__spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .forgot-card__footer {
          font-size: 14px;
          color: #666;
          margin: 24px 0 0 0;
        }

        .forgot-card__footer a {
          color: #111;
          font-weight: 500;
          text-decoration: none;
        }

        .forgot-card__footer a:hover {
          text-decoration: underline;
        }

        .forgot-resend-btn {
          background: none;
          border: none;
          color: #111;
          font-weight: 500;
          cursor: pointer;
          font-size: 14px;
        }

        .forgot-resend-btn:hover {
          text-decoration: underline;
        }

        .forgot-resend-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </main>
  );
}