'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';

const sections = [
  { id: 'information', title: 'Information We Collect' },
  { id: 'use', title: 'How We Use Your Information' },
  { id: 'sharing', title: 'Information Sharing' },
  { id: 'cookies', title: 'Cookies and Tracking' },
  { id: 'security', title: 'Data Security' },
  { id: 'rights', title: 'Your Rights' },
  { id: 'children', title: 'Children\'s Privacy' },
  { id: 'changes', title: 'Policy Changes' },
  { id: 'contact', title: 'Contact Us' },
];

export default function PrivacyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [activeSection, setActiveSection] = useState('information');
  
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
    <main className={`privacy-page ${loading ? 'loading' : ''}`}>
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
        className={`privacy-back-btn ${showContent ? 'visible' : ''}`}
        onClick={() => router.back()}
        title="Go Back"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12 19 5 12 12 5"/>
        </svg>
      </button>

      {/* Header */}
      <header className={`privacy-header ${showContent ? 'visible' : ''}`}>
        <div className="privacy-header__controls">
          <Link href="/" className="privacy-header__icon icon-bulge" title="Home">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </Link>
          <Link href="/store" className="privacy-header__icon icon-bulge" title="Store">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className={`privacy-hero ${showContent ? 'visible' : ''}`}>
        <h1 className="privacy-hero__title">Privacy Policy</h1>
        <p className="privacy-hero__subtitle">
          Last updated: January 1, 2024
        </p>
      </section>

      {/* Main Content */}
      <section className={`privacy-main ${showContent ? 'visible' : ''}`}>
        <div className="privacy-layout">
          {/* Navigation Sidebar */}
          <nav className="privacy-nav">
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
          <div className="privacy-content">
            <div className="privacy-intro">
              <p>
                Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
              </p>
            </div>

            <section id="information" className="privacy-section">
              <h2>1. Information We Collect</h2>
              
              <h3>Personal Information</h3>
              <p>We may collect personal information that you voluntarily provide to us when you:</p>
              <ul>
                <li>Create an account or register on our website</li>
                <li>Make a purchase or place an order</li>
                <li>Subscribe to our newsletter</li>
                <li>Contact us for support or inquiries</li>
                <li>Participate in surveys or promotions</li>
              </ul>
              <p>This information may include:</p>
              <ul>
                <li>Name and contact details (email, phone, address)</li>
                <li>Payment information (processed securely by our payment providers)</li>
                <li>Account credentials</li>
                <li>Order history and preferences</li>
              </ul>

              <h3>Automatically Collected Information</h3>
              <p>When you visit our website, we may automatically collect certain information, including:</p>
              <ul>
                <li>IP address and device information</li>
                <li>Browser type and version</li>
                <li>Pages visited and time spent on our site</li>
                <li>Referring website or source</li>
                <li>Geographic location (country/region)</li>
              </ul>
            </section>

            <section id="use" className="privacy-section">
              <h2>2. How We Use Your Information</h2>
              <p>We use the information we collect for various purposes, including:</p>
              <ul>
                <li>Processing and fulfilling your orders</li>
                <li>Creating and managing your account</li>
                <li>Providing customer support and responding to inquiries</li>
                <li>Sending transactional emails (order confirmations, shipping updates)</li>
                <li>Sending marketing communications (with your consent)</li>
                <li>Personalizing your shopping experience</li>
                <li>Analyzing website usage to improve our services</li>
                <li>Detecting and preventing fraud</li>
                <li>Complying with legal obligations</li>
              </ul>
            </section>

            <section id="sharing" className="privacy-section">
              <h2>3. Information Sharing</h2>
              <p>We may share your information with:</p>
              
              <h3>Service Providers</h3>
              <p>
                Third-party companies that help us operate our business, such as payment processors, shipping carriers, email service providers, and analytics providers. These parties only have access to information necessary to perform their functions.
              </p>

              <h3>Legal Requirements</h3>
              <p>
                We may disclose your information if required by law, court order, or government regulation, or if we believe disclosure is necessary to protect our rights, safety, or the rights of others.
              </p>

              <h3>Business Transfers</h3>
              <p>
                In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the business transaction.
              </p>

              <p><strong>We do not sell your personal information to third parties.</strong></p>
            </section>

            <section id="cookies" className="privacy-section">
              <h2>4. Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar tracking technologies to enhance your browsing experience and collect information about how you use our website.
              </p>

              <h3>Types of Cookies We Use</h3>
              <ul>
                <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our site</li>
                <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
              </ul>

              <p>
                You can control cookies through your browser settings. However, disabling certain cookies may limit your ability to use some features of our website.
              </p>
            </section>

            <section id="security" className="privacy-section">
              <h2>5. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
              <p>Our security measures include:</p>
              <ul>
                <li>SSL/TLS encryption for data transmission</li>
                <li>Secure payment processing (PCI DSS compliant)</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication</li>
                <li>Employee training on data protection</li>
              </ul>
              <p>
                While we strive to protect your information, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
              </p>
            </section>

            <section id="rights" className="privacy-section">
              <h2>6. Your Rights</h2>
              <p>Depending on your location, you may have certain rights regarding your personal information:</p>
              <ul>
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Request correction of inaccurate data</li>
                <li><strong>Deletion:</strong> Request deletion of your data (subject to legal requirements)</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
              </ul>
              <p>
                To exercise these rights, please contact us using the information provided below.
              </p>
            </section>

            <section id="children" className="privacy-section">
              <h2>7. Children&apos;s Privacy</h2>
              <p>
                Our website is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete that information.
              </p>
            </section>

            <section id="changes" className="privacy-section">
              <h2>8. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
              </p>
              <p>
                We encourage you to review this Privacy Policy periodically for any changes. Your continued use of our website after changes are posted constitutes your acceptance of the updated policy.
              </p>
            </section>

            <section id="contact" className="privacy-section">
              <h2>9. Contact Us</h2>
              <p>
                If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
              </p>
              <ul>
                <li>By email: privacy@example.com</li>
                <li>By visiting our <Link href="/contact">Contact Page</Link></li>
                <li>By mail: Privacy Team, 123 Commerce Street, New York, NY 10001</li>
              </ul>
            </section>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className={`privacy-related ${showContent ? 'visible' : ''}`}>
        <h3>Related Policies</h3>
        <div className="privacy-related__links">
          <Link href="/terms">Terms of Service</Link>
          <Link href="/shipping">Shipping & Returns</Link>
          <Link href="/faq">FAQ</Link>
        </div>
      </section>

      {/* Styles */}
      <style jsx global>{`
        .privacy-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 25%, #ffffff 50%, #f0f0f0 75%, #e5e5e5 100%);
          font-family: sans-serif;
          -webkit-font-smoothing: antialiased;
          color: #111;
        }

        .privacy-page.loading::before,
        .privacy-page.loading::after {
          content: '';
          position: fixed;
          z-index: 1000;
        }

        .privacy-page.loading::before {
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 50%, #e5e5e5 100%);
        }

        .privacy-page.loading::after {
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

        .privacy-back-btn {
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

        .privacy-back-btn.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .privacy-header {
          position: fixed;
          top: 0;
          right: 0;
          z-index: 1000;
          padding: clamp(12px, 2vw, 24px) clamp(12px, 2vw, 32px);
          opacity: 0;
          transform: translateY(-20px);
          transition: opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s;
        }

        .privacy-header.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .privacy-header__controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .privacy-header__icon {
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

        .privacy-hero {
          padding: clamp(120px, 15vh, 180px) clamp(24px, 5vw, 80px) clamp(40px, 6vh, 60px);
          text-align: center;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s;
        }

        .privacy-hero.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .privacy-hero__title {
          font-size: clamp(36px, 7vw, 64px);
          font-weight: 300;
          margin: 0 0 12px 0;
          letter-spacing: -0.02em;
        }

        .privacy-hero__subtitle {
          font-size: clamp(14px, 1.6vw, 16px);
          color: #666;
          margin: 0;
        }

        .privacy-main {
          padding: 0 clamp(24px, 5vw, 80px) clamp(60px, 8vh, 100px);
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease 0.6s, transform 0.6s ease 0.6s;
        }

        .privacy-main.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .privacy-layout {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: clamp(32px, 5vw, 64px);
          max-width: 1200px;
          margin: 0 auto;
        }

        .privacy-nav {
          position: sticky;
          top: 100px;
          height: fit-content;
          background: #fff;
          padding: 24px;
          border-radius: 16px;
        }

        .privacy-nav h3 {
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #666;
          margin: 0 0 16px 0;
        }

        .privacy-nav ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .privacy-nav li {
          margin-bottom: 4px;
        }

        .privacy-nav button {
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

        .privacy-nav button:hover {
          background: #f5f5f5;
          color: #111;
        }

        .privacy-nav button.active {
          background: #111;
          color: #fff;
        }

        .privacy-content {
          background: #fff;
          padding: clamp(32px, 5vw, 48px);
          border-radius: 24px;
        }

        .privacy-intro {
          padding-bottom: 32px;
          margin-bottom: 32px;
          border-bottom: 1px solid #e5e5e5;
        }

        .privacy-intro p {
          font-size: 16px;
          line-height: 1.8;
          color: #444;
          margin: 0;
        }

        .privacy-section {
          margin-bottom: 48px;
          scroll-margin-top: 100px;
        }

        .privacy-section:last-child {
          margin-bottom: 0;
        }

        .privacy-section h2 {
          font-size: clamp(20px, 2.5vw, 26px);
          font-weight: 500;
          margin: 0 0 20px 0;
          color: #111;
        }

        .privacy-section h3 {
          font-size: 16px;
          font-weight: 600;
          margin: 24px 0 12px 0;
          color: #333;
        }

        .privacy-section p {
          font-size: 15px;
          line-height: 1.8;
          color: #444;
          margin: 0 0 16px 0;
        }

        .privacy-section ul {
          margin: 0 0 16px 0;
          padding-left: 24px;
        }

        .privacy-section li {
          font-size: 15px;
          line-height: 1.8;
          color: #444;
          margin-bottom: 8px;
        }

        .privacy-section a {
          color: #111;
          text-decoration: underline;
        }

        .privacy-section a:hover {
          color: #555;
        }

        .privacy-related {
          padding: clamp(40px, 6vh, 60px) clamp(24px, 5vw, 80px) clamp(60px, 8vh, 100px);
          text-align: center;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease 0.7s, transform 0.6s ease 0.7s;
        }

        .privacy-related.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .privacy-related h3 {
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #666;
          margin: 0 0 20px 0;
        }

        .privacy-related__links {
          display: flex;
          justify-content: center;
          gap: 24px;
          flex-wrap: wrap;
        }

        .privacy-related__links a {
          padding: 12px 24px;
          background: #fff;
          border-radius: 50px;
          font-size: 14px;
          font-weight: 500;
          color: #333;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .privacy-related__links a:hover {
          background: #111;
          color: #fff;
        }

        @media (max-width: 900px) {
          .privacy-layout {
            grid-template-columns: 1fr;
          }

          .privacy-nav {
            position: relative;
            top: 0;
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            padding: 16px;
          }

          .privacy-nav h3 {
            width: 100%;
            margin-bottom: 8px;
          }

          .privacy-nav ul {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          }

          .privacy-nav li {
            margin-bottom: 0;
          }

          .privacy-nav button {
            padding: 8px 12px;
            font-size: 13px;
          }
        }
      `}</style>
    </main>
  );
}