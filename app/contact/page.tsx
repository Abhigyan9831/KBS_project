'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';

const contactInfo = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    title: 'Visit Us',
    content: ['123 Commerce Street', 'New York, NY 10001', 'United States'],
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
    title: 'Call Us',
    content: ['+1 (555) 123-4567', '+1 (555) 987-6543', 'Mon - Fri: 9AM - 6PM EST'],
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    title: 'Email Us',
    content: ['support@example.com', 'sales@example.com', 'info@example.com'],
  },
];

const faqQuick = [
  { question: 'How can I track my order?', answer: 'You can track your order using the Track Order page with your order ID.' },
  { question: 'What are your shipping options?', answer: 'We offer standard (5-7 days), express (2-3 days), and overnight shipping.' },
  { question: 'How do I return an item?', answer: 'Visit your account dashboard and select the order to initiate a return.' },
];

export default function ContactPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');

    // Simulate form submission
    setTimeout(() => {
      setFormStatus('sent');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset form status after 5 seconds
      setTimeout(() => {
        setFormStatus('idle');
      }, 5000);
    }, 1500);
  };

  return (
    <main className={`contact-page ${loading ? 'loading' : ''}`}>
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
        className={`contact-back-btn ${showContent ? 'visible' : ''}`}
        onClick={() => router.back()}
        title="Go Back"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12 19 5 12 12 5"/>
        </svg>
      </button>

      {/* Header */}
      <header className={`contact-header ${showContent ? 'visible' : ''}`}>
        <div className="contact-header__controls">
          <Link href="/" className="contact-header__icon icon-bulge" title="Home">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </Link>
          <Link href="/store" className="contact-header__icon icon-bulge" title="Store">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className={`contact-hero ${showContent ? 'visible' : ''}`}>
        <h1 className="contact-hero__title">Contact Us</h1>
        <p className="contact-hero__subtitle">
          Have a question or need help? We&apos;re here for you.
        </p>
      </section>

      {/* Contact Info Cards */}
      <section className={`contact-info ${showContent ? 'visible' : ''}`}>
        <div className="contact-info__grid">
          {contactInfo.map((info, index) => (
            <div key={index} className="contact-info-card">
              <div className="contact-info-card__icon">{info.icon}</div>
              <h3>{info.title}</h3>
              {info.content.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <section className={`contact-main ${showContent ? 'visible' : ''}`}>
        <div className="contact-main__grid">
          {/* Contact Form */}
          <div className="contact-form-wrapper">
            <h2>Send us a Message</h2>
            <p>Fill out the form below and we&apos;ll get back to you within 24 hours.</p>
            
            {formStatus === 'sent' ? (
              <div className="contact-form-success">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <h3>Message Sent!</h3>
                <p>Thank you for contacting us. We&apos;ll respond shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="contact-form__row">
                  <div className="contact-form__field">
                    <label htmlFor="name">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="contact-form__field">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="contact-form__field">
                  <label htmlFor="subject">Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="order">Order Related</option>
                    <option value="shipping">Shipping Question</option>
                    <option value="return">Returns & Refunds</option>
                    <option value="product">Product Question</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="contact-form__field">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us how we can help..."
                    rows={6}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="contact-form__submit"
                  disabled={formStatus === 'sending'}
                >
                  {formStatus === 'sending' ? (
                    <>
                      <span className="contact-form__spinner" />
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Quick FAQ */}
          <div className="contact-faq">
            <h2>Quick Answers</h2>
            <p>Check out these common questions</p>
            
            <div className="contact-faq__list">
              {faqQuick.map((faq, index) => (
                <div key={index} className="contact-faq__item">
                  <h4>{faq.question}</h4>
                  <p>{faq.answer}</p>
                </div>
              ))}
            </div>

            <Link href="/faq" className="contact-faq__link">
              View All FAQs
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>

            {/* Social Links */}
            <div className="contact-social">
              <h3>Follow Us</h3>
              <div className="contact-social__links">
                <a href="#" className="contact-social__link" title="Facebook">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </a>
                <a href="#" className="contact-social__link" title="Twitter">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                  </svg>
                </a>
                <a href="#" className="contact-social__link" title="Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </a>
                <a href="#" className="contact-social__link" title="LinkedIn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                    <rect x="2" y="9" width="4" height="12"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className={`contact-map ${showContent ? 'visible' : ''}`}>
        <div className="contact-map__placeholder">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <p>Interactive Map</p>
          <span>Map integration coming soon</span>
        </div>
      </section>

      {/* Styles */}
      <style jsx global>{`
        .contact-page {
          min-height: 100vh;
          background: #F5F0E6;
          font-family: sans-serif;
          -webkit-font-smoothing: antialiased;
          color: #111;
        }

        .contact-page.loading::before,
        .contact-page.loading::after {
          content: '';
          position: fixed;
          z-index: 1000;
        }

        .contact-page.loading::before {
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 50%, #e5e5e5 100%);
        }

        .contact-page.loading::after {
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

        .contact-back-btn {
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

        .contact-back-btn.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .contact-header {
          position: fixed;
          top: 0;
          right: 0;
          z-index: 1000;
          padding: clamp(12px, 2vw, 24px) clamp(12px, 2vw, 32px);
          opacity: 0;
          transform: translateY(-20px);
          transition: opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s;
        }

        .contact-header.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .contact-header__controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .contact-header__icon {
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

        .contact-hero {
          padding: clamp(120px, 15vh, 180px) clamp(24px, 5vw, 80px) clamp(40px, 6vh, 60px);
          text-align: center;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s;
        }

        .contact-hero.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .contact-hero__title {
          font-size: clamp(40px, 8vw, 72px);
          font-weight: 300;
          margin: 0 0 16px 0;
          letter-spacing: -0.02em;
        }

        .contact-hero__subtitle {
          font-size: clamp(16px, 2vw, 20px);
          color: #555;
          margin: 0;
        }

        .contact-info {
          padding: 0 clamp(24px, 5vw, 80px) clamp(40px, 6vh, 60px);
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease 0.6s, transform 0.6s ease 0.6s;
        }

        .contact-info.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .contact-info__grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .contact-info-card {
          background: #fff;
          padding: clamp(24px, 3vw, 36px);
          border-radius: 20px;
          text-align: center;
          transition: transform 0.3s ease;
        }

        .contact-info-card:hover {
          transform: translateY(-4px);
        }

        .contact-info-card__icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          background: #f5f5f5;
          border-radius: 50%;
          margin-bottom: 16px;
        }

        .contact-info-card h3 {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 12px 0;
        }

        .contact-info-card p {
          font-size: 14px;
          color: #666;
          margin: 0;
          line-height: 1.6;
        }

        .contact-main {
          padding: clamp(40px, 6vh, 80px) clamp(24px, 5vw, 80px);
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease 0.7s, transform 0.6s ease 0.7s;
        }

        .contact-main.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .contact-main__grid {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: clamp(32px, 5vw, 64px);
          max-width: 1200px;
          margin: 0 auto;
        }

        .contact-form-wrapper {
          background: #fff;
          padding: clamp(24px, 4vw, 48px);
          border-radius: 24px;
        }

        .contact-form-wrapper h2 {
          font-size: clamp(24px, 3vw, 32px);
          font-weight: 400;
          margin: 0 0 8px 0;
        }

        .contact-form-wrapper > p {
          font-size: 15px;
          color: #666;
          margin: 0 0 32px 0;
        }

        .contact-form-success {
          text-align: center;
          padding: 48px 24px;
        }

        .contact-form-success svg {
          color: #22c55e;
          margin-bottom: 16px;
        }

        .contact-form-success h3 {
          font-size: 24px;
          margin: 0 0 8px 0;
        }

        .contact-form-success p {
          font-size: 15px;
          color: #666;
          margin: 0;
        }

        .contact-form__row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .contact-form__field {
          margin-bottom: 20px;
        }

        .contact-form__field label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 8px;
          color: #333;
        }

        .contact-form__field input,
        .contact-form__field select,
        .contact-form__field textarea {
          width: 100%;
          padding: 14px 16px;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          font-size: 15px;
          color: #111;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .contact-form__field input:focus,
        .contact-form__field select:focus,
        .contact-form__field textarea:focus {
          outline: none;
          border-color: #111;
          box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.05);
        }

        .contact-form__field textarea {
          resize: vertical;
          min-height: 120px;
        }

        .contact-form__submit {
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
        }

        .contact-form__submit:hover:not(:disabled) {
          background: #333;
        }

        .contact-form__submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .contact-form__spinner {
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

        .contact-faq {
          background: #fff;
          padding: clamp(24px, 4vw, 36px);
          border-radius: 24px;
          height: fit-content;
        }

        .contact-faq h2 {
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 4px 0;
        }

        .contact-faq > p {
          font-size: 14px;
          color: #666;
          margin: 0 0 24px 0;
        }

        .contact-faq__list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }

        .contact-faq__item {
          padding: 16px;
          background: #f9f9f9;
          border-radius: 12px;
        }

        .contact-faq__item h4 {
          font-size: 14px;
          font-weight: 600;
          margin: 0 0 8px 0;
        }

        .contact-faq__item p {
          font-size: 13px;
          color: #666;
          margin: 0;
          line-height: 1.5;
        }

        .contact-faq__link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #111;
          text-decoration: none;
          padding-bottom: 24px;
          border-bottom: 1px solid #e5e5e5;
          margin-bottom: 24px;
        }

        .contact-faq__link:hover {
          text-decoration: underline;
        }

        .contact-social h3 {
          font-size: 14px;
          font-weight: 600;
          margin: 0 0 16px 0;
        }

        .contact-social__links {
          display: flex;
          gap: 12px;
        }

        .contact-social__link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          background: #f5f5f5;
          border-radius: 50%;
          color: #333;
          transition: all 0.2s ease;
        }

        .contact-social__link:hover {
          background: #111;
          color: #fff;
        }

        .contact-map {
          padding: 0 clamp(24px, 5vw, 80px) clamp(60px, 8vh, 100px);
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease 0.8s, transform 0.6s ease 0.8s;
        }

        .contact-map.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .contact-map__placeholder {
          max-width: 1200px;
          margin: 0 auto;
          height: 300px;
          background: #f0f0f0;
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #999;
        }

        .contact-map__placeholder svg {
          margin-bottom: 16px;
          opacity: 0.5;
        }

        .contact-map__placeholder p {
          font-size: 18px;
          font-weight: 500;
          margin: 0 0 4px 0;
        }

        .contact-map__placeholder span {
          font-size: 14px;
        }

        @media (max-width: 900px) {
          .contact-main__grid {
            grid-template-columns: 1fr;
          }

          .contact-faq {
            order: -1;
          }
        }

        @media (max-width: 639px) {
          .contact-form__row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}