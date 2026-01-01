'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';

const sections = [
  { id: 'acceptance', title: 'Acceptance of Terms' },
  { id: 'use', title: 'Use of Service' },
  { id: 'account', title: 'Account Terms' },
  { id: 'orders', title: 'Orders and Payments' },
  { id: 'shipping', title: 'Shipping Policy' },
  { id: 'returns', title: 'Returns and Refunds' },
  { id: 'intellectual', title: 'Intellectual Property' },
  { id: 'limitation', title: 'Limitation of Liability' },
  { id: 'changes', title: 'Changes to Terms' },
  { id: 'contact', title: 'Contact Information' },
];

export default function TermsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [activeSection, setActiveSection] = useState('acceptance');
  
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

  // Handle scroll to update active section
  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map(s => document.getElementById(s.id));
      const scrollPosition = window.scrollY + 200;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const section = sectionElements[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const top = element.offsetTop - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <main className={`terms-page ${loading ? 'loading' : ''}`}>
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
        className={`terms-back-btn ${showContent ? 'visible' : ''}`}
        onClick={() => router.back()}
        title="Go Back"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12 19 5 12 12 5"/>
        </svg>
      </button>

      {/* Header */}
      <header className={`terms-header ${showContent ? 'visible' : ''}`}>
        <div className="terms-header__controls">
          <Link href="/" className="terms-header__icon icon-bulge" title="Home">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </Link>
          <Link href="/store" className="terms-header__icon icon-bulge" title="Store">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className={`terms-hero ${showContent ? 'visible' : ''}`}>
        <h1 className="terms-hero__title">Terms of Service</h1>
        <p className="terms-hero__subtitle">
          Last updated: January 1, 2024
        </p>
      </section>

      {/* Main Content */}
      <section className={`terms-main ${showContent ? 'visible' : ''}`}>
        <div className="terms-layout">
          {/* Navigation Sidebar */}
          <nav className="terms-nav">
            <h3>Contents</h3>
            <ul>
              {sections.map(section => (
                <li key={section.id}>
                  <button
                    className={activeSection === section.id ? 'active' : ''}
                    onClick={() => scrollToSection(section.id)}
                  >
                    {section.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Content */}
          <div className="terms-content">
            <section id="acceptance" className="terms-section">
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.
              </p>
              <p>
                These Terms of Service apply to all users of the site, including without limitation users who are browsers, vendors, customers, merchants, and/or contributors of content.
              </p>
              <p>
                Please read these Terms of Service carefully before accessing or using our website. By accessing or using any part of the site, you agree to be bound by these Terms of Service.
              </p>
            </section>

            <section id="use" className="terms-section">
              <h2>2. Use of Service</h2>
              <p>
                You may use our service only for lawful purposes and in accordance with these Terms. You agree not to use the service:
              </p>
              <ul>
                <li>In any way that violates any applicable federal, state, local, or international law or regulation</li>
                <li>To exploit, harm, or attempt to exploit or harm minors in any way</li>
                <li>To transmit, or procure the sending of, any advertising or promotional material without our prior written consent</li>
                <li>To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity</li>
                <li>To engage in any other conduct that restricts or inhibits anyone&apos;s use or enjoyment of the service</li>
              </ul>
            </section>

            <section id="account" className="terms-section">
              <h2>3. Account Terms</h2>
              <p>
                When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms.
              </p>
              <p>
                You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.
              </p>
              <p>
                You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
              </p>
            </section>

            <section id="orders" className="terms-section">
              <h2>4. Orders and Payments</h2>
              <p>
                All orders placed through our website are subject to our acceptance. We reserve the right to refuse or cancel any order for any reason, including but not limited to:
              </p>
              <ul>
                <li>Product or service availability</li>
                <li>Errors in product or pricing information</li>
                <li>Errors in your order</li>
                <li>Suspected fraudulent activity</li>
              </ul>
              <p>
                Prices for our products are subject to change without notice. We reserve the right to modify or discontinue the service without notice at any time.
              </p>
              <p>
                We accept various payment methods as displayed during checkout. All payments are processed securely through our payment providers.
              </p>
            </section>

            <section id="shipping" className="terms-section">
              <h2>5. Shipping Policy</h2>
              <p>
                We ship to addresses within our service areas. Shipping times and costs vary based on your location and the shipping method selected.
              </p>
              <p>
                We are not responsible for delays caused by customs, weather conditions, or other factors outside our control. Risk of loss and title for items pass to you upon delivery to the carrier.
              </p>
              <p>
                For full details, please refer to our <Link href="/shipping">Shipping & Returns Policy</Link>.
              </p>
            </section>

            <section id="returns" className="terms-section">
              <h2>6. Returns and Refunds</h2>
              <p>
                We offer a 30-day return policy for most items. To be eligible for a return, your item must be unused and in the same condition that you received it.
              </p>
              <p>
                Certain items are excluded from returns, including:
              </p>
              <ul>
                <li>Personalized or custom-made products</li>
                <li>Perishable goods</li>
                <li>Digital downloads</li>
                <li>Gift cards</li>
              </ul>
              <p>
                Refunds will be processed within 5-7 business days after we receive and inspect the returned item.
              </p>
            </section>

            <section id="intellectual" className="terms-section">
              <h2>7. Intellectual Property</h2>
              <p>
                The service and its original content, features, and functionality are and will remain the exclusive property of our company and its licensors.
              </p>
              <p>
                Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
              </p>
              <p>
                You may not reproduce, distribute, modify, create derivative works of, publicly display, or exploit any of the content on our website without express written permission.
              </p>
            </section>

            <section id="limitation" className="terms-section">
              <h2>8. Limitation of Liability</h2>
              <p>
                In no event shall our company, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
              <p>
                Our liability is limited to the maximum extent permitted by law. In jurisdictions where limitations of liability are restricted, our liability shall be limited to the greatest extent permitted.
              </p>
            </section>

            <section id="changes" className="terms-section">
              <h2>9. Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days&apos; notice prior to any new terms taking effect.
              </p>
              <p>
                By continuing to access or use our service after those revisions become effective, you agree to be bound by the revised terms.
              </p>
            </section>

            <section id="contact" className="terms-section">
              <h2>10. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <ul>
                <li>By email: legal@example.com</li>
                <li>By visiting our <Link href="/contact">Contact Page</Link></li>
                <li>By mail: 123 Commerce Street, New York, NY 10001</li>
              </ul>
            </section>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className={`terms-related ${showContent ? 'visible' : ''}`}>
        <h3>Related Policies</h3>
        <div className="terms-related__links">
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/shipping">Shipping & Returns</Link>
          <Link href="/faq">FAQ</Link>
        </div>
      </section>

      {/* Styles */}
      <style jsx global>{`
        .terms-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 25%, #ffffff 50%, #f0f0f0 75%, #e5e5e5 100%);
          font-family: sans-serif;
          -webkit-font-smoothing: antialiased;
          color: #111;
        }

        .terms-page.loading::before,
        .terms-page.loading::after {
          content: '';
          position: fixed;
          z-index: 1000;
        }

        .terms-page.loading::before {
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 50%, #e5e5e5 100%);
        }

        .terms-page.loading::after {
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

        .terms-back-btn {
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

        .terms-back-btn.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .terms-header {
          position: fixed;
          top: 0;
          right: 0;
          z-index: 1000;
          padding: clamp(12px, 2vw, 24px) clamp(12px, 2vw, 32px);
          opacity: 0;
          transform: translateY(-20px);
          transition: opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s;
        }

        .terms-header.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .terms-header__controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .terms-header__icon {
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

        .terms-hero {
          padding: clamp(120px, 15vh, 180px) clamp(24px, 5vw, 80px) clamp(40px, 6vh, 60px);
          text-align: center;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s;
        }

        .terms-hero.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .terms-hero__title {
          font-size: clamp(36px, 7vw, 64px);
          font-weight: 300;
          margin: 0 0 12px 0;
          letter-spacing: -0.02em;
        }

        .terms-hero__subtitle {
          font-size: clamp(14px, 1.6vw, 16px);
          color: #666;
          margin: 0;
        }

        .terms-main {
          padding: 0 clamp(24px, 5vw, 80px) clamp(60px, 8vh, 100px);
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease 0.6s, transform 0.6s ease 0.6s;
        }

        .terms-main.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .terms-layout {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: clamp(32px, 5vw, 64px);
          max-width: 1200px;
          margin: 0 auto;
        }

        .terms-nav {
          position: sticky;
          top: 100px;
          height: fit-content;
          background: #fff;
          padding: 24px;
          border-radius: 16px;
        }

        .terms-nav h3 {
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #666;
          margin: 0 0 16px 0;
        }

        .terms-nav ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .terms-nav li {
          margin-bottom: 4px;
        }

        .terms-nav button {
          width: 100%;
          text-align: left;
          padding: 10px 12px;
          border: none;
          background: transparent;
          font-size: 14px;
          color: #555;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .terms-nav button:hover {
          background: #f5f5f5;
          color: #111;
        }

        .terms-nav button.active {
          background: #111;
          color: #fff;
        }

        .terms-content {
          background: #fff;
          padding: clamp(32px, 5vw, 48px);
          border-radius: 24px;
        }

        .terms-section {
          margin-bottom: 48px;
          scroll-margin-top: 100px;
        }

        .terms-section:last-child {
          margin-bottom: 0;
        }

        .terms-section h2 {
          font-size: clamp(20px, 2.5vw, 26px);
          font-weight: 500;
          margin: 0 0 20px 0;
          color: #111;
        }

        .terms-section p {
          font-size: 15px;
          line-height: 1.8;
          color: #444;
          margin: 0 0 16px 0;
        }

        .terms-section ul {
          margin: 0 0 16px 0;
          padding-left: 24px;
        }

        .terms-section li {
          font-size: 15px;
          line-height: 1.8;
          color: #444;
          margin-bottom: 8px;
        }

        .terms-section a {
          color: #111;
          text-decoration: underline;
        }

        .terms-section a:hover {
          color: #555;
        }

        .terms-related {
          padding: clamp(40px, 6vh, 60px) clamp(24px, 5vw, 80px) clamp(60px, 8vh, 100px);
          text-align: center;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease 0.7s, transform 0.6s ease 0.7s;
        }

        .terms-related.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .terms-related h3 {
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #666;
          margin: 0 0 20px 0;
        }

        .terms-related__links {
          display: flex;
          justify-content: center;
          gap: 24px;
          flex-wrap: wrap;
        }

        .terms-related__links a {
          padding: 12px 24px;
          background: #fff;
          border-radius: 50px;
          font-size: 14px;
          font-weight: 500;
          color: #333;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .terms-related__links a:hover {
          background: #111;
          color: #fff;
        }

        @media (max-width: 900px) {
          .terms-layout {
            grid-template-columns: 1fr;
          }

          .terms-nav {
            position: relative;
            top: 0;
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            padding: 16px;
          }

          .terms-nav h3 {
            width: 100%;
            margin-bottom: 8px;
          }

          .terms-nav ul {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          }

          .terms-nav li {
            margin-bottom: 0;
          }

          .terms-nav button {
            padding: 8px 12px;
            font-size: 13px;
          }
        }
      `}</style>
    </main>
  );
}