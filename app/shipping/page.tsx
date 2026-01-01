'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';

const shippingOptions = [
  {
    name: 'Standard Shipping',
    time: '5-7 business days',
    price: '$4.99',
    freeThreshold: 'Free on orders over $50',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13"/>
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
        <circle cx="5.5" cy="18.5" r="2.5"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
  },
  {
    name: 'Express Shipping',
    time: '2-3 business days',
    price: '$9.99',
    freeThreshold: 'Free on orders over $100',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
  {
    name: 'Overnight Shipping',
    time: 'Next business day',
    price: '$19.99',
    freeThreshold: null,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
        <line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
  },
];

export default function ShippingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [activeTab, setActiveTab] = useState<'shipping' | 'returns'>('shipping');
  
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

  return (
    <main className={`shipping-page ${loading ? 'loading' : ''}`}>
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
        className={`shipping-back-btn ${showContent ? 'visible' : ''}`}
        onClick={() => router.back()}
        title="Go Back"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12 19 5 12 12 5"/>
        </svg>
      </button>

      {/* Header */}
      <header className={`shipping-header ${showContent ? 'visible' : ''}`}>
        <div className="shipping-header__controls">
          <Link href="/" className="shipping-header__icon icon-bulge" title="Home">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </Link>
          <Link href="/store" className="shipping-header__icon icon-bulge" title="Store">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className={`shipping-hero ${showContent ? 'visible' : ''}`}>
        <h1 className="shipping-hero__title">Shipping & Returns</h1>
        <p className="shipping-hero__subtitle">
          Everything you need to know about getting your order and our hassle-free return policy.
        </p>
      </section>

      {/* Tab Navigation */}
      <section className={`shipping-tabs ${showContent ? 'visible' : ''}`}>
        <button
          className={`shipping-tab ${activeTab === 'shipping' ? 'active' : ''}`}
          onClick={() => setActiveTab('shipping')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="3" width="15" height="13"/>
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
            <circle cx="5.5" cy="18.5" r="2.5"/>
            <circle cx="18.5" cy="18.5" r="2.5"/>
          </svg>
          Shipping
        </button>
        <button
          className={`shipping-tab ${activeTab === 'returns' ? 'active' : ''}`}
          onClick={() => setActiveTab('returns')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 14 4 9 9 4"/>
            <path d="M20 20v-7a4 4 0 0 0-4-4H4"/>
          </svg>
          Returns
        </button>
      </section>

      {/* Main Content */}
      <section className={`shipping-content ${showContent ? 'visible' : ''}`}>
        {activeTab === 'shipping' ? (
          <div className="shipping-info">
            {/* Shipping Options */}
            <div className="shipping-options">
              <h2>Shipping Options</h2>
              <div className="shipping-options__grid">
                {shippingOptions.map((option, index) => (
                  <div key={index} className="shipping-option">
                    <div className="shipping-option__icon">{option.icon}</div>
                    <h3>{option.name}</h3>
                    <p className="shipping-option__time">{option.time}</p>
                    <p className="shipping-option__price">{option.price}</p>
                    {option.freeThreshold && (
                      <span className="shipping-option__badge">{option.freeThreshold}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Details */}
            <div className="shipping-details">
              <h2>Shipping Information</h2>
              
              <div className="shipping-section">
                <h3>Processing Time</h3>
                <p>
                  Orders are typically processed within 1-2 business days. During peak seasons or sales events, processing may take an additional 1-2 days.
                </p>
              </div>

              <div className="shipping-section">
                <h3>Delivery Areas</h3>
                <p>
                  We ship to all 50 US states and internationally to over 50 countries. International shipping times vary by destination, typically ranging from 7-21 business days.
                </p>
              </div>

              <div className="shipping-section">
                <h3>Order Tracking</h3>
                <p>
                  Once your order ships, you&apos;ll receive an email with tracking information. You can also track your order by visiting our <Link href="/track-order">Track Order</Link> page.
                </p>
              </div>

              <div className="shipping-section">
                <h3>Shipping Restrictions</h3>
                <p>
                  Some items may have shipping restrictions based on size, weight, or destination. These restrictions will be noted on the product page.
                </p>
              </div>

              <div className="shipping-section">
                <h3>International Orders</h3>
                <p>
                  International customers may be responsible for customs duties, taxes, and import fees. These charges are determined by your country&apos;s customs office and are not included in our shipping costs.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="returns-info">
            {/* Returns Overview */}
            <div className="returns-overview">
              <div className="returns-overview__card">
                <div className="returns-overview__icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <h3>30-Day Returns</h3>
                <p>Return any item within 30 days of delivery for a full refund.</p>
              </div>
              <div className="returns-overview__card">
                <div className="returns-overview__icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13"/>
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                    <circle cx="5.5" cy="18.5" r="2.5"/>
                    <circle cx="18.5" cy="18.5" r="2.5"/>
                  </svg>
                </div>
                <h3>Free Return Shipping</h3>
                <p>We provide prepaid return labels for all domestic returns.</p>
              </div>
              <div className="returns-overview__card">
                <div className="returns-overview__icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23"/>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                </div>
                <h3>Quick Refunds</h3>
                <p>Refunds are processed within 3-5 business days after receiving your return.</p>
              </div>
            </div>

            {/* Return Process */}
            <div className="returns-process">
              <h2>How to Return an Item</h2>
              <div className="returns-steps">
                <div className="returns-step">
                  <span className="returns-step__number">1</span>
                  <div className="returns-step__content">
                    <h4>Start Your Return</h4>
                    <p>Log into your account and go to your order history. Select the item you want to return and click &quot;Start Return.&quot;</p>
                  </div>
                </div>
                <div className="returns-step">
                  <span className="returns-step__number">2</span>
                  <div className="returns-step__content">
                    <h4>Print Label</h4>
                    <p>Print the prepaid return shipping label that we&apos;ll email to you.</p>
                  </div>
                </div>
                <div className="returns-step">
                  <span className="returns-step__number">3</span>
                  <div className="returns-step__content">
                    <h4>Pack & Ship</h4>
                    <p>Pack the item securely in its original packaging if possible, and drop it off at any carrier location.</p>
                  </div>
                </div>
                <div className="returns-step">
                  <span className="returns-step__number">4</span>
                  <div className="returns-step__content">
                    <h4>Get Refunded</h4>
                    <p>Once we receive and inspect your return, we&apos;ll process your refund.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Return Policy Details */}
            <div className="returns-details">
              <h2>Return Policy Details</h2>
              
              <div className="returns-section">
                <h3>Eligibility</h3>
                <p>To be eligible for a return, items must be:</p>
                <ul>
                  <li>Unused and in original condition</li>
                  <li>In original packaging with all tags attached</li>
                  <li>Returned within 30 days of delivery</li>
                </ul>
              </div>

              <div className="returns-section">
                <h3>Non-Returnable Items</h3>
                <p>The following items cannot be returned:</p>
                <ul>
                  <li>Personalized or custom-made products</li>
                  <li>Perishable goods</li>
                  <li>Digital downloads and gift cards</li>
                  <li>Items marked as final sale</li>
                  <li>Intimate apparel and swimwear</li>
                </ul>
              </div>

              <div className="returns-section">
                <h3>Exchanges</h3>
                <p>
                  We currently don&apos;t offer direct exchanges. To get a different size or color, please return the original item and place a new order.
                </p>
              </div>

              <div className="returns-section">
                <h3>Damaged or Defective Items</h3>
                <p>
                  If you receive a damaged or defective item, please contact us within 48 hours of delivery. We&apos;ll arrange for a replacement or refund at no additional cost.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Help Section */}
      <section className={`shipping-help ${showContent ? 'visible' : ''}`}>
        <div className="shipping-help__content">
          <h2>Need Help?</h2>
          <p>Our customer support team is here to assist you with any questions.</p>
          <div className="shipping-help__buttons">
            <Link href="/contact" className="shipping-help__btn primary">
              Contact Support
            </Link>
            <Link href="/faq" className="shipping-help__btn secondary">
              View FAQs
            </Link>
          </div>
        </div>
      </section>

      {/* Styles */}
      <style jsx global>{`
        .shipping-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 25%, #ffffff 50%, #f0f0f0 75%, #e5e5e5 100%);
          font-family: sans-serif;
          -webkit-font-smoothing: antialiased;
          color: #111;
        }

        .shipping-page.loading::before,
        .shipping-page.loading::after {
          content: '';
          position: fixed;
          z-index: 1000;
        }

        .shipping-page.loading::before {
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 50%, #e5e5e5 100%);
        }

        .shipping-page.loading::after {
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

        .shipping-back-btn {
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

        .shipping-back-btn.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .shipping-header {
          position: fixed;
          top: 0;
          right: 0;
          z-index: 1000;
          padding: clamp(12px, 2vw, 24px) clamp(12px, 2vw, 32px);
          opacity: 0;
          transform: translateY(-20px);
          transition: opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s;
        }

        .shipping-header.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .shipping-header__controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .shipping-header__icon {
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

        .shipping-hero {
          padding: clamp(120px, 15vh, 180px) clamp(24px, 5vw, 80px) clamp(40px, 6vh, 60px);
          text-align: center;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s;
        }

        .shipping-hero.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .shipping-hero__title {
          font-size: clamp(36px, 7vw, 64px);
          font-weight: 300;
          margin: 0 0 16px 0;
          letter-spacing: -0.02em;
        }

        .shipping-hero__subtitle {
          font-size: clamp(15px, 1.8vw, 18px);
          color: #555;
          margin: 0;
          max-width: 600px;
          margin: 0 auto;
        }

        .shipping-tabs {
          display: flex;
          justify-content: center;
          gap: 12px;
          padding: 0 clamp(24px, 5vw, 80px) clamp(32px, 4vh, 48px);
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease 0.6s, transform 0.6s ease 0.6s;
        }

        .shipping-tabs.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .shipping-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 50px;
          font-size: 15px;
          font-weight: 500;
          color: #555;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .shipping-tab:hover {
          border-color: #111;
          color: #111;
        }

        .shipping-tab.active {
          background: #111;
          border-color: #111;
          color: #fff;
        }

        .shipping-content {
          padding: 0 clamp(24px, 5vw, 80px) clamp(60px, 8vh, 100px);
          max-width: 1000px;
          margin: 0 auto;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease 0.7s, transform 0.6s ease 0.7s;
        }

        .shipping-content.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Shipping Info Styles */
        .shipping-options {
          margin-bottom: 48px;
        }

        .shipping-options h2 {
          font-size: clamp(24px, 3vw, 32px);
          font-weight: 400;
          margin: 0 0 24px 0;
          text-align: center;
        }

        .shipping-options__grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .shipping-option {
          background: #fff;
          padding: 28px;
          border-radius: 20px;
          text-align: center;
        }

        .shipping-option__icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          background: #f5f5f5;
          border-radius: 50%;
          margin-bottom: 16px;
        }

        .shipping-option h3 {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 8px 0;
        }

        .shipping-option__time {
          font-size: 14px;
          color: #666;
          margin: 0 0 8px 0;
        }

        .shipping-option__price {
          font-size: 24px;
          font-weight: 600;
          color: #111;
          margin: 0 0 12px 0;
        }

        .shipping-option__badge {
          display: inline-block;
          padding: 6px 12px;
          background: #e8f5e9;
          color: #2e7d32;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }

        .shipping-details {
          background: #fff;
          padding: clamp(24px, 4vw, 48px);
          border-radius: 24px;
        }

        .shipping-details h2 {
          font-size: clamp(22px, 3vw, 28px);
          font-weight: 400;
          margin: 0 0 32px 0;
        }

        .shipping-section {
          margin-bottom: 28px;
        }

        .shipping-section:last-child {
          margin-bottom: 0;
        }

        .shipping-section h3 {
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 10px 0;
        }

        .shipping-section p {
          font-size: 15px;
          color: #555;
          line-height: 1.7;
          margin: 0;
        }

        .shipping-section a {
          color: #111;
          text-decoration: underline;
        }

        /* Returns Info Styles */
        .returns-overview {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 48px;
        }

        .returns-overview__card {
          background: #fff;
          padding: 28px;
          border-radius: 20px;
          text-align: center;
        }

        .returns-overview__icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          background: #f5f5f5;
          border-radius: 50%;
          margin-bottom: 16px;
        }

        .returns-overview__card h3 {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 8px 0;
        }

        .returns-overview__card p {
          font-size: 14px;
          color: #666;
          margin: 0;
          line-height: 1.5;
        }

        .returns-process {
          background: #fff;
          padding: clamp(24px, 4vw, 48px);
          border-radius: 24px;
          margin-bottom: 32px;
        }

        .returns-process h2 {
          font-size: clamp(22px, 3vw, 28px);
          font-weight: 400;
          margin: 0 0 32px 0;
        }

        .returns-steps {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .returns-step {
          display: flex;
          gap: 20px;
        }

        .returns-step__number {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: #111;
          color: #fff;
          border-radius: 50%;
          font-size: 16px;
          font-weight: 600;
        }

        .returns-step__content h4 {
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 6px 0;
        }

        .returns-step__content p {
          font-size: 14px;
          color: #666;
          margin: 0;
          line-height: 1.6;
        }

        .returns-details {
          background: #fff;
          padding: clamp(24px, 4vw, 48px);
          border-radius: 24px;
        }

        .returns-details h2 {
          font-size: clamp(22px, 3vw, 28px);
          font-weight: 400;
          margin: 0 0 32px 0;
        }

        .returns-section {
          margin-bottom: 28px;
        }

        .returns-section:last-child {
          margin-bottom: 0;
        }

        .returns-section h3 {
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 10px 0;
        }

        .returns-section p {
          font-size: 15px;
          color: #555;
          line-height: 1.7;
          margin: 0 0 12px 0;
        }

        .returns-section ul {
          margin: 0;
          padding-left: 24px;
        }

        .returns-section li {
          font-size: 15px;
          color: #555;
          line-height: 1.7;
          margin-bottom: 6px;
        }

        .shipping-help {
          padding: clamp(60px, 8vh, 100px) clamp(24px, 5vw, 80px);
          background: #111;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease 0.8s, transform 0.6s ease 0.8s;
        }

        .shipping-help.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .shipping-help__content {
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
          color: #fff;
        }

        .shipping-help__content h2 {
          font-size: clamp(24px, 4vw, 36px);
          font-weight: 400;
          margin: 0 0 12px 0;
        }

        .shipping-help__content p {
          font-size: 16px;
          opacity: 0.8;
          margin: 0 0 32px 0;
        }

        .shipping-help__buttons {
          display: flex;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .shipping-help__btn {
          padding: 14px 28px;
          border-radius: 50px;
          font-size: 15px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .shipping-help__btn.primary {
          background: #fff;
          color: #111;
        }

        .shipping-help__btn.primary:hover {
          background: #f0f0f0;
        }

        .shipping-help__btn.secondary {
          background: transparent;
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .shipping-help__btn.secondary:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        @media (max-width: 639px) {
          .shipping-tabs {
            flex-direction: column;
            padding: 0 24px 32px;
          }

          .shipping-tab {
            justify-content: center;
          }

          .returns-step {
            flex-direction: column;
            gap: 12px;
          }
        }
      `}</style>
    </main>
  );
}