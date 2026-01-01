'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';

const teamMembers = [
  { name: 'Sarah Johnson', role: 'CEO & Founder', image: '/images/1.jpg' },
  { name: 'Michael Chen', role: 'Head of Design', image: '/images/2.jpg' },
  { name: 'Emily Davis', role: 'Product Manager', image: '/images/3.jpg' },
  { name: 'James Wilson', role: 'Head of Engineering', image: '/images/4.jpg' },
];

const milestones = [
  { year: '2018', title: 'Company Founded', description: 'Started with a vision to revolutionize e-commerce.' },
  { year: '2019', title: 'First 1000 Customers', description: 'Reached our first major customer milestone.' },
  { year: '2020', title: 'Global Expansion', description: 'Expanded operations to 15 countries worldwide.' },
  { year: '2021', title: 'Series A Funding', description: 'Raised $10M to accelerate growth and innovation.' },
  { year: '2022', title: 'Award Winning', description: 'Recognized as Best E-commerce Platform of the Year.' },
  { year: '2023', title: '1 Million Users', description: 'Celebrated serving over 1 million happy customers.' },
];

const values = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
    title: 'Customer First',
    description: 'Every decision we make starts with our customers in mind. Their satisfaction is our success.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
    title: 'Transparency',
    description: 'We believe in honest communication and clear pricing. No hidden fees, no surprises.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    title: 'Innovation',
    description: 'We constantly push boundaries to deliver cutting-edge solutions and experiences.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'Community',
    description: 'We build lasting relationships with our customers, partners, and each other.',
  },
];

export default function AboutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  
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
    <main className={`about-page ${loading ? 'loading' : ''}`}>
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
        className={`about-back-btn ${showContent ? 'visible' : ''}`}
        onClick={() => router.back()}
        title="Go Back"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12 19 5 12 12 5"/>
        </svg>
      </button>

      {/* Header */}
      <header className={`about-header ${showContent ? 'visible' : ''}`}>
        <div className="about-header__controls">
          <Link href="/" className="about-header__icon icon-bulge" title="Home">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </Link>
          <Link href="/store" className="about-header__icon icon-bulge" title="Store">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className={`about-hero ${showContent ? 'visible' : ''}`}>
        <div className="about-hero__content">
          <h1 className="about-hero__title">About Us</h1>
          <p className="about-hero__subtitle">
            We&apos;re on a mission to make online shopping delightful, accessible, and sustainable for everyone.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className={`about-story ${showContent ? 'visible' : ''}`}>
        <div className="about-story__content">
          <div className="about-story__text">
            <h2>Our Story</h2>
            <p>
              Founded in 2018, we started with a simple idea: create an e-commerce platform that truly puts customers first. What began as a small startup has grown into a thriving community of over a million happy shoppers worldwide.
            </p>
            <p>
              Our journey has been defined by our commitment to quality, innovation, and exceptional customer service. We carefully curate every product in our catalog, ensuring that our customers receive only the best.
            </p>
            <p>
              Today, we continue to push boundaries and explore new ways to enhance the shopping experience. From cutting-edge technology to sustainable practices, we&apos;re building the future of e-commerce.
            </p>
          </div>
          <div className="about-story__image">
            <Image
              src="/images/austin-distel-wD1LRb9OeEo-unsplash.jpg"
              alt="Our team at work"
              fill
              className="about-story__img"
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className={`about-values ${showContent ? 'visible' : ''}`}>
        <h2>Our Values</h2>
        <div className="about-values__grid">
          {values.map((value, index) => (
            <div key={index} className="about-value">
              <div className="about-value__icon">{value.icon}</div>
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline Section */}
      <section className={`about-timeline ${showContent ? 'visible' : ''}`}>
        <h2>Our Journey</h2>
        <div className="about-timeline__list">
          {milestones.map((milestone, index) => (
            <div key={index} className="about-milestone">
              <div className="about-milestone__year">{milestone.year}</div>
              <div className="about-milestone__content">
                <h3>{milestone.title}</h3>
                <p>{milestone.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className={`about-team ${showContent ? 'visible' : ''}`}>
        <h2>Meet Our Team</h2>
        <p className="about-team__intro">
          The talented people behind our success
        </p>
        <div className="about-team__grid">
          {teamMembers.map((member, index) => (
            <div key={index} className="about-team-member">
              <div className="about-team-member__image">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="about-team-member__img"
                />
              </div>
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className={`about-stats ${showContent ? 'visible' : ''}`}>
        <div className="about-stat">
          <span className="about-stat__number">1M+</span>
          <span className="about-stat__label">Happy Customers</span>
        </div>
        <div className="about-stat">
          <span className="about-stat__number">50K+</span>
          <span className="about-stat__label">Products</span>
        </div>
        <div className="about-stat">
          <span className="about-stat__number">15</span>
          <span className="about-stat__label">Countries</span>
        </div>
        <div className="about-stat">
          <span className="about-stat__number">4.9</span>
          <span className="about-stat__label">Average Rating</span>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`about-cta ${showContent ? 'visible' : ''}`}>
        <h2>Ready to Start Shopping?</h2>
        <p>Join millions of happy customers and discover amazing products.</p>
        <div className="about-cta__buttons">
          <Link href="/store" className="about-cta__btn primary">
            Browse Products
          </Link>
          <Link href="/contact" className="about-cta__btn secondary">
            Contact Us
          </Link>
        </div>
      </section>

      {/* Styles */}
      <style jsx global>{`
        .about-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 25%, #ffffff 50%, #f0f0f0 75%, #e5e5e5 100%);
          font-family: sans-serif;
          -webkit-font-smoothing: antialiased;
          color: #111;
        }

        .about-page.loading::before,
        .about-page.loading::after {
          content: '';
          position: fixed;
          z-index: 1000;
        }

        .about-page.loading::before {
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 50%, #e5e5e5 100%);
        }

        .about-page.loading::after {
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

        .about-back-btn {
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

        .about-back-btn.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .about-header {
          position: fixed;
          top: 0;
          right: 0;
          z-index: 1000;
          padding: clamp(12px, 2vw, 24px) clamp(12px, 2vw, 32px);
          opacity: 0;
          transform: translateY(-20px);
          transition: opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s;
        }

        .about-header.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .about-header__controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .about-header__icon {
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

        .about-hero {
          padding: clamp(120px, 15vh, 180px) clamp(24px, 5vw, 80px) clamp(60px, 8vh, 100px);
          text-align: center;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s;
        }

        .about-hero.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .about-hero__title {
          font-size: clamp(40px, 8vw, 80px);
          font-weight: 300;
          margin: 0 0 20px 0;
          letter-spacing: -0.02em;
        }

        .about-hero__subtitle {
          font-size: clamp(16px, 2vw, 22px);
          color: #555;
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .about-story {
          padding: clamp(40px, 6vh, 80px) clamp(24px, 5vw, 80px);
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease 0.7s, transform 0.6s ease 0.7s;
        }

        .about-story.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .about-story__content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(32px, 5vw, 80px);
          max-width: 1200px;
          margin: 0 auto;
          align-items: center;
        }

        .about-story__text h2 {
          font-size: clamp(28px, 4vw, 40px);
          font-weight: 400;
          margin: 0 0 24px 0;
        }

        .about-story__text p {
          font-size: clamp(15px, 1.6vw, 17px);
          color: #555;
          line-height: 1.8;
          margin: 0 0 16px 0;
        }

        .about-story__image {
          position: relative;
          height: clamp(300px, 40vw, 500px);
          border-radius: 24px;
          overflow: hidden;
        }

        .about-story__img {
          object-fit: cover;
        }

        .about-values {
          padding: clamp(60px, 8vh, 100px) clamp(24px, 5vw, 80px);
          background: #fff;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease 0.8s, transform 0.6s ease 0.8s;
        }

        .about-values.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .about-values h2 {
          font-size: clamp(28px, 4vw, 40px);
          font-weight: 400;
          text-align: center;
          margin: 0 0 clamp(32px, 5vw, 60px) 0;
        }

        .about-values__grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: clamp(24px, 3vw, 40px);
          max-width: 1200px;
          margin: 0 auto;
        }

        .about-value {
          text-align: center;
          padding: clamp(24px, 3vw, 40px);
          background: #f9f9f9;
          border-radius: 20px;
          transition: transform 0.3s ease;
        }

        .about-value:hover {
          transform: translateY(-4px);
        }

        .about-value__icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          background: #111;
          color: #fff;
          border-radius: 50%;
          margin-bottom: 20px;
        }

        .about-value h3 {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 12px 0;
        }

        .about-value p {
          font-size: 14px;
          color: #666;
          line-height: 1.6;
          margin: 0;
        }

        .about-timeline {
          padding: clamp(60px, 8vh, 100px) clamp(24px, 5vw, 80px);
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease 0.9s, transform 0.6s ease 0.9s;
        }

        .about-timeline.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .about-timeline h2 {
          font-size: clamp(28px, 4vw, 40px);
          font-weight: 400;
          text-align: center;
          margin: 0 0 clamp(32px, 5vw, 60px) 0;
        }

        .about-timeline__list {
          max-width: 800px;
          margin: 0 auto;
          position: relative;
        }

        .about-timeline__list::before {
          content: '';
          position: absolute;
          left: 60px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #e5e5e5;
        }

        .about-milestone {
          display: flex;
          gap: 32px;
          padding: 24px 0;
          position: relative;
        }

        .about-milestone::before {
          content: '';
          position: absolute;
          left: 54px;
          top: 32px;
          width: 14px;
          height: 14px;
          background: #111;
          border-radius: 50%;
          border: 3px solid #fff;
          box-shadow: 0 0 0 2px #111;
        }

        .about-milestone__year {
          font-size: 14px;
          font-weight: 600;
          color: #111;
          min-width: 40px;
        }

        .about-milestone__content {
          padding-left: 40px;
        }

        .about-milestone__content h3 {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 8px 0;
        }

        .about-milestone__content p {
          font-size: 14px;
          color: #666;
          margin: 0;
        }

        .about-team {
          padding: clamp(60px, 8vh, 100px) clamp(24px, 5vw, 80px);
          background: #fff;
          text-align: center;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease 1s, transform 0.6s ease 1s;
        }

        .about-team.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .about-team h2 {
          font-size: clamp(28px, 4vw, 40px);
          font-weight: 400;
          margin: 0 0 12px 0;
        }

        .about-team__intro {
          font-size: 16px;
          color: #666;
          margin: 0 0 clamp(32px, 5vw, 60px) 0;
        }

        .about-team__grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: clamp(24px, 3vw, 40px);
          max-width: 1000px;
          margin: 0 auto;
        }

        .about-team-member {
          text-align: center;
        }

        .about-team-member__image {
          position: relative;
          width: 150px;
          height: 150px;
          margin: 0 auto 20px;
          border-radius: 50%;
          overflow: hidden;
        }

        .about-team-member__img {
          object-fit: cover;
        }

        .about-team-member h3 {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 4px 0;
        }

        .about-team-member p {
          font-size: 14px;
          color: #666;
          margin: 0;
        }

        .about-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 32px;
          padding: clamp(60px, 8vh, 100px) clamp(24px, 5vw, 80px);
          max-width: 1000px;
          margin: 0 auto;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease 1.1s, transform 0.6s ease 1.1s;
        }

        .about-stats.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .about-stat {
          text-align: center;
        }

        .about-stat__number {
          display: block;
          font-size: clamp(36px, 5vw, 56px);
          font-weight: 300;
          color: #111;
          margin-bottom: 8px;
        }

        .about-stat__label {
          font-size: 14px;
          color: #666;
        }

        .about-cta {
          padding: clamp(60px, 8vh, 100px) clamp(24px, 5vw, 80px);
          background: #111;
          color: #fff;
          text-align: center;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease 1.2s, transform 0.6s ease 1.2s;
        }

        .about-cta.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .about-cta h2 {
          font-size: clamp(28px, 4vw, 40px);
          font-weight: 400;
          margin: 0 0 16px 0;
        }

        .about-cta p {
          font-size: 16px;
          opacity: 0.8;
          margin: 0 0 32px 0;
        }

        .about-cta__buttons {
          display: flex;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .about-cta__btn {
          padding: 14px 32px;
          border-radius: 50px;
          font-size: 15px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .about-cta__btn.primary {
          background: #fff;
          color: #111;
        }

        .about-cta__btn.primary:hover {
          background: #f0f0f0;
        }

        .about-cta__btn.secondary {
          background: transparent;
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .about-cta__btn.secondary:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        @media (max-width: 768px) {
          .about-story__content {
            grid-template-columns: 1fr;
          }

          .about-story__image {
            order: -1;
          }

          .about-timeline__list::before {
            left: 20px;
          }

          .about-milestone::before {
            left: 14px;
          }

          .about-milestone {
            flex-direction: column;
            gap: 8px;
            padding-left: 48px;
          }

          .about-milestone__year {
            min-width: unset;
          }

          .about-milestone__content {
            padding-left: 0;
          }
        }
      `}</style>
    </main>
  );
}