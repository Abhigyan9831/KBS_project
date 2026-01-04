'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';

const faqCategories = [
  { id: 'all', name: 'All' },
  { id: 'orders', name: 'Orders' },
  { id: 'shipping', name: 'Shipping' },
  { id: 'returns', name: 'Returns' },
  { id: 'payment', name: 'Payment' },
  { id: 'account', name: 'Account' },
];

const faqData = [
  {
    id: 1,
    category: 'orders',
    question: 'How do I track my order?',
    answer: 'You can track your order by visiting the Track Order page and entering your order ID. You will also receive email updates with tracking information once your order ships.',
  },
  {
    id: 2,
    category: 'orders',
    question: 'Can I modify or cancel my order after placing it?',
    answer: 'You can modify or cancel your order within 1 hour of placing it. After that, the order enters our processing system and cannot be changed. Please contact customer support immediately if you need assistance.',
  },
  {
    id: 3,
    category: 'orders',
    question: 'How do I check my order status?',
    answer: 'Log into your account and visit the Dashboard to see all your orders and their current status. You can also use the Track Order page with your order ID.',
  },
  {
    id: 4,
    category: 'shipping',
    question: 'What are your shipping options?',
    answer: 'We offer three shipping options: Standard Shipping (5-7 business days), Express Shipping (2-3 business days), and Overnight Shipping (next business day). Shipping costs vary based on your location and order total.',
  },
  {
    id: 5,
    category: 'shipping',
    question: 'Do you ship internationally?',
    answer: 'Yes! We ship to over 50 countries worldwide. International shipping times and costs vary by destination. Please note that customs duties and taxes may apply for international orders.',
  },
  {
    id: 6,
    category: 'shipping',
    question: 'Is there free shipping?',
    answer: 'Yes, we offer free standard shipping on all orders over $50 within the continental United States. Some promotional periods may offer expanded free shipping options.',
  },
  {
    id: 7,
    category: 'returns',
    question: 'What is your return policy?',
    answer: 'We offer a 30-day return policy for most items. Products must be unused, in original packaging, and with all tags attached. Some items like personalized products or perishables are not eligible for return.',
  },
  {
    id: 8,
    category: 'returns',
    question: 'How do I start a return?',
    answer: 'Log into your account, go to your Dashboard, find the order with the item you want to return, and click "Return Item." Follow the instructions to print a prepaid return label.',
  },
  {
    id: 9,
    category: 'returns',
    question: 'When will I receive my refund?',
    answer: 'Once we receive and inspect your returned item, we will process your refund within 3-5 business days. The refund will be credited to your original payment method.',
  },
  {
    id: 10,
    category: 'payment',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, Google Pay, and Shop Pay. Some regions may have additional local payment options.',
  },
  {
    id: 11,
    category: 'payment',
    question: 'Is my payment information secure?',
    answer: 'Absolutely. We use industry-standard SSL encryption and are PCI DSS compliant. We never store your full credit card details on our servers.',
  },
  {
    id: 12,
    category: 'payment',
    question: 'Can I use multiple payment methods?',
    answer: 'Currently, you can only use one payment method per order. However, you can apply gift cards or store credit along with your primary payment method.',
  },
  {
    id: 13,
    category: 'account',
    question: 'How do I create an account?',
    answer: 'Click on the Account icon in the navigation and select "Create Account." You can also create an account during checkout. Having an account lets you track orders, save addresses, and earn rewards.',
  },
  {
    id: 14,
    category: 'account',
    question: 'I forgot my password. How do I reset it?',
    answer: 'Click "Forgot Password" on the login page and enter your email address. We will send you a link to reset your password. The link expires after 24 hours.',
  },
  {
    id: 15,
    category: 'account',
    question: 'How do I update my account information?',
    answer: 'Log into your account and go to your Dashboard. From there, you can update your personal information, shipping addresses, payment methods, and notification preferences.',
  },
];

export default function FAQPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
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

  // Filter FAQs
  const filteredFaqs = faqData.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <main className={`faq-page ${loading ? 'loading' : ''}`}>
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
        className={`faq-back-btn ${showContent ? 'visible' : ''}`}
        onClick={() => router.back()}
        title="Go Back"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12 19 5 12 12 5"/>
        </svg>
      </button>

      {/* Header */}
      <header className={`faq-header ${showContent ? 'visible' : ''}`}>
        <div className="faq-header__controls">
          <Link href="/" className="faq-header__icon icon-bulge" title="Home">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </Link>
          <Link href="/store" className="faq-header__icon icon-bulge" title="Store">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className={`faq-hero ${showContent ? 'visible' : ''}`}>
        <h1 className="faq-hero__title">Frequently Asked Questions</h1>
        <p className="faq-hero__subtitle">
          Find answers to common questions about orders, shipping, returns, and more.
        </p>
        
        {/* Search Bar */}
        <div className="faq-search">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="faq-search__clear">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>
      </section>

      {/* Category Tabs */}
      <section className={`faq-categories ${showContent ? 'visible' : ''}`}>
        <div className="faq-categories__list">
          {faqCategories.map(cat => (
            <button
              key={cat.id}
              className={`faq-category ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* FAQ List */}
      <section className={`faq-content ${showContent ? 'visible' : ''}`}>
        <div className="faq-list">
          {filteredFaqs.length === 0 ? (
            <div className="faq-empty">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <h3>No results found</h3>
              <p>Try a different search term or category.</p>
            </div>
          ) : (
            filteredFaqs.map(faq => (
              <div 
                key={faq.id} 
                className={`faq-item ${expandedId === faq.id ? 'expanded' : ''}`}
              >
                <button 
                  className="faq-item__header"
                  onClick={() => toggleFaq(faq.id)}
                >
                  <span className="faq-item__question">{faq.question}</span>
                  <span className="faq-item__icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points={expandedId === faq.id ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}/>
                    </svg>
                  </span>
                </button>
                <div className="faq-item__answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Still Need Help Section */}
      <section className={`faq-help ${showContent ? 'visible' : ''}`}>
        <div className="faq-help__content">
          <h2>Still need help?</h2>
          <p>Our customer support team is here to assist you.</p>
          <div className="faq-help__buttons">
            <Link href="/contact" className="faq-help__btn primary">
              Contact Us
            </Link>
            <a href="mailto:support@example.com" className="faq-help__btn secondary">
              Email Support
            </a>
          </div>
        </div>
      </section>

      {/* Styles */}
      <style jsx global>{`
        .faq-page {
          min-height: 100vh;
          background: #F5F0E6;
          font-family: sans-serif;
          -webkit-font-smoothing: antialiased;
          color: #111;
        }

        .faq-page.loading::before,
        .faq-page.loading::after {
          content: '';
          position: fixed;
          z-index: 1000;
        }

        .faq-page.loading::before {
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 50%, #e5e5e5 100%);
        }

        .faq-page.loading::after {
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

        .faq-back-btn {
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

        .faq-back-btn.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .faq-header {
          position: fixed;
          top: 0;
          right: 0;
          z-index: 1000;
          padding: clamp(12px, 2vw, 24px) clamp(12px, 2vw, 32px);
          opacity: 0;
          transform: translateY(-20px);
          transition: opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s;
        }

        .faq-header.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .faq-header__controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .faq-header__icon {
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

        .faq-hero {
          padding: clamp(120px, 15vh, 180px) clamp(24px, 5vw, 80px) clamp(40px, 6vh, 60px);
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s;
        }

        .faq-hero.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .faq-hero__title {
          font-size: clamp(32px, 6vw, 56px);
          font-weight: 300;
          margin: 0 0 16px 0;
          letter-spacing: -0.02em;
        }

        .faq-hero__subtitle {
          font-size: clamp(15px, 1.8vw, 18px);
          color: #555;
          margin: 0 0 32px 0;
        }

        .faq-search {
          display: flex;
          align-items: center;
          gap: 12px;
          max-width: 500px;
          margin: 0 auto;
          padding: 14px 20px;
          background: #fff;
          border-radius: 50px;
          border: 1px solid #e5e5e5;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .faq-search:focus-within {
          border-color: #111;
          box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.05);
        }

        .faq-search svg {
          color: #999;
          flex-shrink: 0;
        }

        .faq-search input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 16px;
          color: #111;
          outline: none;
        }

        .faq-search input::placeholder {
          color: #999;
        }

        .faq-search__clear {
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
          padding: 4px;
        }

        .faq-search__clear:hover {
          color: #333;
        }

        .faq-categories {
          padding: 0 clamp(24px, 5vw, 80px) clamp(24px, 4vh, 40px);
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease 0.6s, transform 0.6s ease 0.6s;
        }

        .faq-categories.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .faq-categories__list {
          display: flex;
          justify-content: center;
          gap: 8px;
          flex-wrap: wrap;
          max-width: 800px;
          margin: 0 auto;
        }

        .faq-category {
          padding: 10px 20px;
          background: transparent;
          border: 1px solid #ddd;
          border-radius: 25px;
          font-size: 14px;
          color: #555;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .faq-category:hover {
          border-color: #111;
          color: #111;
        }

        .faq-category.active {
          background: #111;
          border-color: #111;
          color: #fff;
        }

        .faq-content {
          padding: 0 clamp(24px, 5vw, 80px) clamp(60px, 8vh, 100px);
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease 0.7s, transform 0.6s ease 0.7s;
        }

        .faq-content.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .faq-list {
          max-width: 800px;
          margin: 0 auto;
        }

        .faq-empty {
          text-align: center;
          padding: 60px 24px;
          color: #666;
        }

        .faq-empty svg {
          color: #ccc;
          margin-bottom: 16px;
        }

        .faq-empty h3 {
          font-size: 20px;
          color: #333;
          margin: 0 0 8px 0;
        }

        .faq-empty p {
          font-size: 15px;
          margin: 0;
        }

        .faq-item {
          background: #fff;
          border-radius: 16px;
          margin-bottom: 12px;
          overflow: hidden;
          transition: box-shadow 0.3s ease;
        }

        .faq-item:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
        }

        .faq-item__header {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          background: transparent;
          border: none;
          text-align: left;
          cursor: pointer;
        }

        .faq-item__question {
          font-size: 16px;
          font-weight: 500;
          color: #111;
          padding-right: 16px;
        }

        .faq-item__icon {
          flex-shrink: 0;
          color: #666;
          transition: transform 0.3s ease;
        }

        .faq-item.expanded .faq-item__icon {
          transform: rotate(180deg);
        }

        .faq-item__answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease, padding 0.3s ease;
        }

        .faq-item.expanded .faq-item__answer {
          max-height: 500px;
        }

        .faq-item__answer p {
          padding: 0 24px 20px;
          font-size: 15px;
          color: #666;
          line-height: 1.7;
          margin: 0;
        }

        .faq-help {
          padding: clamp(60px, 8vh, 100px) clamp(24px, 5vw, 80px);
          background: #111;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease 0.8s, transform 0.6s ease 0.8s;
        }

        .faq-help.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .faq-help__content {
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
          color: #fff;
        }

        .faq-help__content h2 {
          font-size: clamp(24px, 4vw, 36px);
          font-weight: 400;
          margin: 0 0 12px 0;
        }

        .faq-help__content p {
          font-size: 16px;
          opacity: 0.8;
          margin: 0 0 32px 0;
        }

        .faq-help__buttons {
          display: flex;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .faq-help__btn {
          padding: 14px 28px;
          border-radius: 50px;
          font-size: 15px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .faq-help__btn.primary {
          background: #fff;
          color: #111;
        }

        .faq-help__btn.primary:hover {
          background: #f0f0f0;
        }

        .faq-help__btn.secondary {
          background: transparent;
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .faq-help__btn.secondary:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        @media (max-width: 639px) {
          .faq-item__header {
            padding: 16px 20px;
          }

          .faq-item__question {
            font-size: 15px;
          }

          .faq-item__answer p {
            padding: 0 20px 16px;
            font-size: 14px;
          }
        }
      `}</style>
    </main>
  );
}