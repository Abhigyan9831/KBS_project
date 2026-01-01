'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  cover: string;
  quantity: number;
}

interface OrderDetails {
  orderId: string;
  orderDate: string;
  estimatedDelivery: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: string;
}

function OrderSuccessContent() {
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [titleRevealed, setTitleRevealed] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(() => {
    // Initialize state from localStorage synchronously to avoid cascading renders
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('checkoutCart');
      if (savedCart) {
        try {
          const items: OrderItem[] = JSON.parse(savedCart);
          const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
          const shipping = subtotal > 500 ? 0 : 15.00;
          const tax = subtotal * 0.08;
          const total = subtotal + shipping + tax;
          
          // Generate random order ID
          const orderId = `KBS-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
          
          // Calculate estimated delivery (5-7 business days from now)
          const deliveryDate = new Date();
          deliveryDate.setDate(deliveryDate.getDate() + 5 + Math.floor(Math.random() * 3));
          
          const order: OrderDetails = {
            orderId,
            orderDate: new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            estimatedDelivery: deliveryDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            items,
            subtotal,
            shipping,
            tax,
            total,
            shippingAddress: {
              name: 'John Doe',
              address: '123 Main Street, Apartment 4B',
              city: 'Madison',
              state: 'Wisconsin',
              pincode: '50000'
            },
            paymentMethod: 'Credit Card ending in ****1234'
          };
          
          // Clear the cart after successful order
          localStorage.removeItem('checkoutCart');
          
          return order;
        } catch (e) {
          console.error('Error parsing cart data:', e);
        }
      }
    }
    return null;
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

  const handleDownloadInvoice = () => {
    // In a real app, this would generate and download a PDF
    alert('Invoice download would be implemented here');
  };

  if (!orderDetails) {
    return (
      <main className="order-success-page">
        <div
          ref={shutterTopRef}
          className="fixed top-0 left-0 w-full h-[50vh] bg-[#0a0a0a] z-[1000] pointer-events-none"
        />
        <div
          ref={shutterBottomRef}
          className="fixed top-[50vh] left-0 w-full h-[50vh] bg-[#0a0a0a] z-[1000] pointer-events-none"
        />
        <section className={`order-success-content ${showContent ? 'visible' : ''}`}>
          <div className="empty-order">
            <div className="empty-order__icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M16 16s-1.5-2-4-2-4 2-4 2"/>
                <line x1="9" y1="9" x2="9.01" y2="9"/>
                <line x1="15" y1="9" x2="15.01" y2="9"/>
              </svg>
            </div>
            <h2>No Order Found</h2>
            <p>It looks like you haven&apos;t placed an order yet.</p>
            <Link href="/store" className="continue-shopping-btn">
              Browse Products
            </Link>
          </div>
        </section>
        <style jsx global>{orderSuccessStyles}</style>
      </main>
    );
  }

  return (
    <main className={`order-success-page ${loading ? 'loading' : ''}`}>
      {/* Shutter Animation Panels */}
      <div
        ref={shutterTopRef}
        className="fixed top-0 left-0 w-full h-[50vh] bg-[#0a0a0a] z-[1000] pointer-events-none"
      />
      <div
        ref={shutterBottomRef}
        className="fixed top-[50vh] left-0 w-full h-[50vh] bg-[#0a0a0a] z-[1000] pointer-events-none"
      />

      {/* Header with Home icon */}
      <header className={`order-success-header ${showContent ? 'visible' : ''}`}>
        <div className="order-success-header__controls">
          <Link href="/" className="order-success-header__icon icon-bulge" title="Home">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </Link>
          <Link href="/store" className="order-success-header__icon icon-bulge" title="Store">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <section className={`order-success-content ${showContent ? 'visible' : ''}`}>
        {/* Success Banner */}
        <div className="success-banner">
          <div className="success-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h1 className="success-title__container">
            <span className="success-word-reveal">
              <span className={`success-word-reveal-inner success-word-delay-0 ${titleRevealed ? 'revealed' : ''}`}>
                Order Confirmed!
              </span>
            </span>
          </h1>
          <p className="success-subtitle">Thank you for your purchase. We&apos;ve received your order.</p>
          <p className="order-number">Order #{orderDetails.orderId}</p>
        </div>

        {/* Main Layout - Two Columns */}
        <div className="order-success-layout">
          {/* Left Column - Order Details */}
          <div className="order-success-left">
            {/* Order Status Card */}
            <div className="order-success-card">
              <h2 className="order-success-card__title">Order Status</h2>
              
              <div className="order-timeline">
                <div className="timeline-item completed">
                  <div className="timeline-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div className="timeline-content">
                    <span className="timeline-title">Order Placed</span>
                    <span className="timeline-date">{orderDetails.orderDate}</span>
                  </div>
                </div>
                <div className="timeline-item active">
                  <div className="timeline-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="3" width="15" height="13"/>
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                      <circle cx="5.5" cy="18.5" r="2.5"/>
                      <circle cx="18.5" cy="18.5" r="2.5"/>
                    </svg>
                  </div>
                  <div className="timeline-content">
                    <span className="timeline-title">Processing</span>
                    <span className="timeline-date">In progress</span>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                  <div className="timeline-content">
                    <span className="timeline-title">Out for Delivery</span>
                    <span className="timeline-date">Pending</span>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                      <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                  </div>
                  <div className="timeline-content">
                    <span className="timeline-title">Delivered</span>
                    <span className="timeline-date">Est. {orderDetails.estimatedDelivery}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address Card */}
            <div className="order-success-card">
              <h2 className="order-success-card__title">Shipping Address</h2>
              <div className="address-details">
                <p className="address-name">{orderDetails.shippingAddress.name}</p>
                <p>{orderDetails.shippingAddress.address}</p>
                <p>{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state}</p>
                <p>PIN: {orderDetails.shippingAddress.pincode}</p>
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="order-success-card">
              <h2 className="order-success-card__title">Payment Method</h2>
              <div className="payment-details">
                <div className="payment-method-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                    <line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                </div>
                <span>{orderDetails.paymentMethod}</span>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="order-success-right">
            {/* Order Items Card */}
            <div className="order-success-card order-items-card">
              <h2 className="order-success-card__title">Order Summary</h2>
              
              <div className="order-items-list">
                {orderDetails.items.map((item) => (
                  <div key={item.id} className="order-item">
                    <div className="order-item__image">
                      <Image 
                        src={item.cover} 
                        alt={item.name} 
                        width={70} 
                        height={70}
                        className="order-item__img"
                      />
                      <span className="order-item__quantity">{item.quantity}</span>
                    </div>
                    <div className="order-item__info">
                      <span className="order-item__name">{item.name}</span>
                      <span className="order-item__price">${item.price.toFixed(2)}</span>
                    </div>
                    <div className="order-item__total">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-totals">
                <div className="order-total-row">
                  <span>Subtotal</span>
                  <span>${orderDetails.subtotal.toFixed(2)}</span>
                </div>
                <div className="order-total-row">
                  <span>Shipping</span>
                  <span>{orderDetails.shipping === 0 ? 'FREE' : `$${orderDetails.shipping.toFixed(2)}`}</span>
                </div>
                <div className="order-total-row">
                  <span>Tax (8%)</span>
                  <span>${orderDetails.tax.toFixed(2)}</span>
                </div>
                <div className="order-total-row total">
                  <span>Total</span>
                  <span className="total-amount">${orderDetails.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="order-actions">
              <button className="download-invoice-btn" onClick={handleDownloadInvoice}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download Invoice
              </button>
              <Link href="/track-order" className="track-order-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                Track Order
              </Link>
              <Link href="/store" className="continue-shopping-btn">
                Continue Shopping
              </Link>
            </div>

            {/* Confirmation Email Notice */}
            <div className="email-notice">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <span>A confirmation email has been sent to your email address</span>
            </div>
          </div>
        </div>
      </section>

      {/* Styles */}
      <style jsx global>{orderSuccessStyles}</style>
    </main>
  );
}

const orderSuccessStyles = `
  /* Order Success Page Styles */
  .order-success-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 25%, #ffffff 50%, #f0f0f0 75%, #e5e5e5 100%);
    font-family: sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #111;
  }

  /* Loading State */
  .order-success-page.loading::before,
  .order-success-page.loading::after {
    content: '';
    position: fixed;
    z-index: 1000;
  }

  .order-success-page.loading::before {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 50%, #e5e5e5 100%);
  }

  .order-success-page.loading::after {
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

  /* Icon Bulge Animation - Touch-friendly */
  .icon-bulge {
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    min-width: 44px;
    min-height: 44px;
  }

  .icon-bulge:hover {
    transform: scale(1.2);
  }

  .icon-bulge:active {
    transform: scale(0.95);
  }

  /* Order Success Header - Responsive */
  .order-success-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 1000;
    padding: clamp(12px, 2vw, 24px) clamp(12px, 2vw, 32px);
    opacity: 0;
    transform: translateY(-20px);
    transition: opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s;
  }

  .order-success-header.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .order-success-header__controls {
    display: flex;
    align-items: center;
    gap: clamp(8px, 1.5vw, 16px);
  }

  .order-success-header__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: clamp(40px, 5vw, 48px);
    height: clamp(40px, 5vw, 48px);
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    color: #000;
  }

  .order-success-header__icon svg {
    width: clamp(18px, 2.5vw, 24px);
    height: clamp(18px, 2.5vw, 24px);
  }

  /* Order Success Content - Responsive padding */
  .order-success-content {
    padding: clamp(80px, 10vh, 100px) clamp(16px, 6vw, 80px) clamp(40px, 8vh, 80px);
    min-height: 100vh;
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease 0.7s, transform 0.6s ease 0.7s;
  }

  .order-success-content.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* Success Banner */
  .success-banner {
    text-align: center;
    margin-bottom: clamp(32px, 5vw, 48px);
  }

  .success-icon {
    width: clamp(70px, 10vw, 90px);
    height: clamp(70px, 10vw, 90px);
    margin: 0 auto clamp(16px, 2vw, 24px);
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
    border-radius: 50%;
    color: #fff;
  }

  .success-icon svg {
    width: clamp(36px, 5vw, 48px);
    height: clamp(36px, 5vw, 48px);
  }

  .success-title__container {
    font-family: sans-serif;
    font-size: clamp(28px, 6vw, 56px);
    line-height: 1;
    color: #000;
    font-weight: 300;
    letter-spacing: -0.02em;
    margin: 0 0 clamp(8px, 1.5vw, 16px) 0;
  }

  .success-subtitle {
    font-size: clamp(14px, 1.6vw, 16px);
    color: #666;
    margin: 0 0 clamp(8px, 1vw, 12px) 0;
  }

  .order-number {
    font-size: clamp(14px, 1.6vw, 18px);
    color: #000;
    font-weight: 600;
    margin: 0;
    font-family: monospace;
  }

  /* Word by Word Reveal Animation */
  .success-word-reveal {
    display: inline-block;
    overflow: hidden;
    vertical-align: bottom;
  }

  .success-word-reveal-inner {
    display: inline-block;
    transform: translateY(100%);
    opacity: 0;
  }

  .success-word-reveal-inner.revealed {
    transform: translateY(0);
    opacity: 1;
  }

  .success-word-delay-0 {
    transition: transform 1s cubic-bezier(0.23, 1, 0.32, 1) 0.2s,
                opacity 0.8s ease-out 0.2s;
  }

  /* Main Layout - Responsive */
  .order-success-layout {
    display: grid;
    grid-template-columns: 1fr clamp(340px, 40vw, 480px);
    gap: clamp(20px, 3vw, 32px);
    align-items: start;
    max-width: 1200px;
    margin: 0 auto;
  }

  /* Order Success Cards - Responsive */
  .order-success-card {
    background: #fff;
    border-radius: clamp(12px, 1.5vw, 16px);
    padding: clamp(20px, 3vw, 32px);
    margin-bottom: clamp(16px, 2vw, 24px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }

  .order-success-card__title {
    font-size: clamp(16px, 1.8vw, 18px);
    font-weight: 500;
    color: #000;
    margin: 0 0 clamp(16px, 2.5vw, 24px) 0;
  }

  /* Order Timeline */
  .order-timeline {
    position: relative;
    padding-left: clamp(32px, 4vw, 40px);
  }

  .order-timeline::before {
    content: '';
    position: absolute;
    left: clamp(11px, 1.5vw, 14px);
    top: clamp(24px, 3vw, 28px);
    bottom: clamp(24px, 3vw, 28px);
    width: 2px;
    background: #e5e5e5;
  }

  .timeline-item {
    position: relative;
    padding-bottom: clamp(20px, 3vw, 28px);
    display: flex;
    align-items: flex-start;
    gap: clamp(12px, 1.5vw, 16px);
  }

  .timeline-item:last-child {
    padding-bottom: 0;
  }

  .timeline-icon {
    position: absolute;
    left: clamp(-32px, -4vw, -40px);
    width: clamp(24px, 3vw, 28px);
    height: clamp(24px, 3vw, 28px);
    border-radius: 50%;
    background: #e5e5e5;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
  }

  .timeline-icon svg {
    width: clamp(12px, 1.5vw, 16px);
    height: clamp(12px, 1.5vw, 16px);
  }

  .timeline-item.completed .timeline-icon {
    background: #4ade80;
    color: #fff;
  }

  .timeline-item.active .timeline-icon {
    background: #3b82f6;
    color: #fff;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
    50% { box-shadow: 0 0 0 8px rgba(59, 130, 246, 0); }
  }

  .timeline-content {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .timeline-title {
    font-size: clamp(13px, 1.5vw, 15px);
    font-weight: 500;
    color: #000;
  }

  .timeline-date {
    font-size: clamp(11px, 1.3vw, 13px);
    color: #666;
  }

  /* Address Details */
  .address-details {
    font-size: clamp(13px, 1.4vw, 14px);
    line-height: 1.6;
    color: #444;
  }

  .address-name {
    font-weight: 600;
    color: #000;
    margin-bottom: 4px;
  }

  /* Payment Details */
  .payment-details {
    display: flex;
    align-items: center;
    gap: clamp(10px, 1.2vw, 12px);
    font-size: clamp(13px, 1.4vw, 14px);
    color: #444;
  }

  .payment-method-icon {
    width: clamp(36px, 4vw, 40px);
    height: clamp(36px, 4vw, 40px);
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f5f5;
    border-radius: 8px;
    color: #666;
  }

  .payment-method-icon svg {
    width: clamp(18px, 2vw, 24px);
    height: clamp(18px, 2vw, 24px);
  }

  /* Order Items Card */
  .order-items-card {
    position: sticky;
    top: 100px;
  }

  .order-items-list {
    display: flex;
    flex-direction: column;
    gap: clamp(14px, 2vw, 20px);
    margin-bottom: clamp(16px, 2vw, 24px);
    padding-bottom: clamp(16px, 2vw, 24px);
    border-bottom: 1px solid #eee;
  }

  .order-item {
    display: flex;
    align-items: center;
    gap: clamp(12px, 1.5vw, 16px);
  }

  .order-item__image {
    position: relative;
    width: clamp(55px, 7vw, 70px);
    height: clamp(55px, 7vw, 70px);
    border-radius: clamp(8px, 1vw, 10px);
    overflow: hidden;
    flex-shrink: 0;
    background: #f5f5f5;
  }

  .order-item__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .order-item__quantity {
    position: absolute;
    top: -6px;
    right: -6px;
    width: clamp(20px, 2.5vw, 24px);
    height: clamp(20px, 2.5vw, 24px);
    background: #111;
    color: #fff;
    border-radius: 50%;
    font-size: clamp(10px, 1.2vw, 12px);
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .order-item__info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .order-item__name {
    font-size: clamp(13px, 1.4vw, 14px);
    font-weight: 500;
    color: #000;
  }

  .order-item__price {
    font-size: clamp(12px, 1.3vw, 13px);
    color: #666;
  }

  .order-item__total {
    font-size: clamp(13px, 1.4vw, 14px);
    font-weight: 600;
    color: #000;
  }

  /* Order Totals */
  .order-totals {
    display: flex;
    flex-direction: column;
    gap: clamp(8px, 1vw, 10px);
  }

  .order-total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: clamp(13px, 1.4vw, 14px);
    color: #444;
  }

  .order-total-row.total {
    padding-top: clamp(10px, 1.2vw, 12px);
    border-top: 1px solid #eee;
    margin-top: clamp(6px, 0.8vw, 8px);
  }

  .order-total-row.total span {
    font-weight: 600;
    color: #000;
  }

  .total-amount {
    font-size: clamp(18px, 2.2vw, 22px) !important;
    color: #E8A87C !important;
  }

  /* Order Actions */
  .order-actions {
    display: flex;
    flex-direction: column;
    gap: clamp(10px, 1.2vw, 12px);
    margin-bottom: clamp(16px, 2vw, 20px);
  }

  .download-invoice-btn,
  .track-order-btn,
  .continue-shopping-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: clamp(8px, 1vw, 10px);
    padding: clamp(14px, 1.8vw, 18px);
    border-radius: 50px;
    font-size: clamp(14px, 1.5vw, 15px);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    min-height: 44px;
  }

  .download-invoice-btn {
    background: #fff;
    color: #111;
    border: 2px solid #111;
  }

  .download-invoice-btn:hover {
    background: #111;
    color: #fff;
  }

  .track-order-btn {
    background: #fff;
    color: #111;
    border: 2px solid #111;
  }

  .track-order-btn:hover {
    background: #111;
    color: #fff;
  }

  .continue-shopping-btn {
    background: #111;
    color: #fff;
    border: none;
  }

  .continue-shopping-btn:hover {
    background: #333;
    transform: translateY(-2px);
  }

  /* Email Notice */
  .email-notice {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: clamp(8px, 1vw, 10px);
    padding: clamp(12px, 1.5vw, 16px);
    background: #f0fdf4;
    border-radius: clamp(10px, 1.2vw, 12px);
    font-size: clamp(12px, 1.3vw, 13px);
    color: #166534;
  }

  .email-notice svg {
    flex-shrink: 0;
    width: clamp(16px, 2vw, 20px);
    height: clamp(16px, 2vw, 20px);
  }

  /* Empty Order State */
  .empty-order {
    text-align: center;
    padding: clamp(60px, 10vh, 100px) clamp(20px, 4vw, 40px);
  }

  .empty-order__icon {
    width: clamp(80px, 12vw, 120px);
    height: clamp(80px, 12vw, 120px);
    margin: 0 auto clamp(20px, 3vw, 32px);
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f5f5;
    border-radius: 50%;
    color: #999;
  }

  .empty-order__icon svg {
    width: clamp(40px, 6vw, 64px);
    height: clamp(40px, 6vw, 64px);
  }

  .empty-order h2 {
    font-size: clamp(20px, 3vw, 28px);
    font-weight: 500;
    color: #000;
    margin: 0 0 clamp(8px, 1vw, 12px) 0;
  }

  .empty-order p {
    font-size: clamp(14px, 1.6vw, 16px);
    color: #666;
    margin: 0 0 clamp(20px, 3vw, 32px) 0;
  }

  /* ===== TABLET BREAKPOINT (640px - 1023px) ===== */
  @media (min-width: 640px) and (max-width: 1023px) {
    .order-success-layout {
      grid-template-columns: 1fr;
      max-width: 700px;
    }

    .order-items-card {
      position: static;
    }

    .order-success-right {
      order: -1;
    }

    .order-actions {
      flex-direction: row;
      flex-wrap: wrap;
    }

    .download-invoice-btn,
    .track-order-btn {
      flex: 1;
      min-width: calc(50% - 6px);
    }

    .continue-shopping-btn {
      width: 100%;
    }
  }

  /* ===== MOBILE BREAKPOINT (<640px) ===== */
  @media (max-width: 639px) {
    .order-success-layout {
      grid-template-columns: 1fr;
    }

    .order-items-card {
      position: static;
    }

    .order-success-right {
      order: -1;
    }

    .order-actions {
      flex-direction: column;
    }

    .order-item {
      flex-wrap: wrap;
    }

    .order-item__total {
      width: 100%;
      text-align: right;
      padding-top: 8px;
      margin-top: 4px;
      border-top: 1px dashed #eee;
    }

    .order-timeline {
      padding-left: 28px;
    }

    .timeline-icon {
      left: -28px;
    }

    .email-notice {
      flex-direction: column;
      text-align: center;
    }
  }

  /* ===== SMALL MOBILE (<400px) ===== */
  @media (max-width: 399px) {
    .order-success-header__icon {
      width: 40px;
      height: 40px;
    }

    .success-icon {
      width: 60px;
      height: 60px;
    }

    .success-icon svg {
      width: 30px;
      height: 30px;
    }

    .order-item__image {
      width: 50px;
      height: 50px;
    }

    .order-item__quantity {
      width: 18px;
      height: 18px;
      font-size: 10px;
    }
  }
`;

export default function OrderSuccessPage() {
  return <OrderSuccessContent />;
}