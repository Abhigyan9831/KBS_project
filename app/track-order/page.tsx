'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { gsap } from 'gsap';

// Mock order data for demo
const mockOrders: { [key: string]: {
  orderId: string;
  status: 'placed' | 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered';
  placedAt: string;
  estimatedDelivery: string;
  carrier: string;
  trackingNumber: string;
  items: { name: string; quantity: number; price: number; image: string }[];
  shippingAddress: { name: string; address: string; city: string; state: string; pincode: string };
  timeline: { status: string; date: string; time: string; description: string; completed: boolean }[];
}} = {
  'ORD-2024-001234': {
    orderId: 'ORD-2024-001234',
    status: 'shipped',
    placedAt: '2024-12-28',
    estimatedDelivery: '2025-01-03',
    carrier: 'FedEx',
    trackingNumber: 'FX1234567890',
    items: [
      { name: 'Product-1', quantity: 1, price: 299, image: '/images/1.jpg' },
      { name: 'Electric Kettle', quantity: 1, price: 149, image: '/images/2.jpg' },
    ],
    shippingAddress: {
      name: 'John Doe',
      address: '123 Main Street, Apt 4B',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110001',
    },
    timeline: [
      { status: 'Order Placed', date: 'Dec 28', time: '10:30 AM', description: 'Your order has been placed successfully', completed: true },
      { status: 'Order Confirmed', date: 'Dec 28', time: '11:00 AM', description: 'Order confirmed by seller', completed: true },
      { status: 'Processing', date: 'Dec 29', time: '09:00 AM', description: 'Your order is being prepared', completed: true },
      { status: 'Shipped', date: 'Dec 30', time: '02:00 PM', description: 'Package handed to FedEx courier', completed: true },
      { status: 'Out for Delivery', date: 'Jan 02', time: '', description: 'Package is out for delivery', completed: false },
      { status: 'Delivered', date: 'Jan 03', time: '', description: 'Package delivered', completed: false },
    ],
  },
  'ORD-2024-005678': {
    orderId: 'ORD-2024-005678',
    status: 'out_for_delivery',
    placedAt: '2024-12-25',
    estimatedDelivery: '2024-12-31',
    carrier: 'DHL',
    trackingNumber: 'DHL9876543210',
    items: [
      { name: 'Air Fryer Deluxe', quantity: 1, price: 199, image: '/images/3.jpg' },
    ],
    shippingAddress: {
      name: 'Jane Smith',
      address: '456 Oak Avenue',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
    },
    timeline: [
      { status: 'Order Placed', date: 'Dec 25', time: '03:15 PM', description: 'Your order has been placed successfully', completed: true },
      { status: 'Order Confirmed', date: 'Dec 25', time: '04:00 PM', description: 'Order confirmed by seller', completed: true },
      { status: 'Processing', date: 'Dec 26', time: '10:00 AM', description: 'Your order is being prepared', completed: true },
      { status: 'Shipped', date: 'Dec 27', time: '11:30 AM', description: 'Package handed to DHL courier', completed: true },
      { status: 'Out for Delivery', date: 'Dec 31', time: '08:00 AM', description: 'Package is out for delivery', completed: true },
      { status: 'Delivered', date: 'Dec 31', time: '', description: 'Package delivered', completed: false },
    ],
  },
};

function TrackOrderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [titleRevealed, setTitleRevealed] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [searchedOrderId, setSearchedOrderId] = useState('');
  const [order, setOrder] = useState<typeof mockOrders[string] | null>(null);
  const [error, setError] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const shutterTopRef = useRef<HTMLDivElement>(null);
  const shutterBottomRef = useRef<HTMLDivElement>(null);

  // Search function - defined before useEffect that uses it
  const performSearch = async (searchOrderId: string) => {
    if (!searchOrderId.trim()) {
      setError('Please enter an order ID');
      return;
    }

    setError('');
    setIsSearching(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const foundOrder = mockOrders[searchOrderId.toUpperCase()];
    if (foundOrder) {
      setOrder(foundOrder);
      setSearchedOrderId(searchOrderId.toUpperCase());
    } else {
      setError('Order not found. Please check the order ID and try again.');
      setOrder(null);
    }

    setIsSearching(false);
  };

  // Check for orderId in query params
  useEffect(() => {
    const orderIdParam = searchParams.get('orderId');
    if (orderIdParam) {
      setOrderId(orderIdParam);
      performSearch(orderIdParam);
    }
  }, [searchParams]);

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

  const handleSearch = () => {
    performSearch(orderId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return '#10b981';
      case 'out_for_delivery': return '#3b82f6';
      case 'shipped': return '#8b5cf6';
      case 'processing': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'placed': return 'Order Placed';
      case 'confirmed': return 'Confirmed';
      case 'processing': return 'Processing';
      case 'shipped': return 'Shipped';
      case 'out_for_delivery': return 'Out for Delivery';
      case 'delivered': return 'Delivered';
      default: return status;
    }
  };

  return (
    <main className={`track-order-page ${loading ? 'loading' : ''}`}>
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
        className={`track-back-btn ${showContent ? 'visible' : ''}`}
        onClick={() => router.back()}
        title="Go Back"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12 19 5 12 12 5"/>
        </svg>
      </button>

      {/* Header */}
      <header className={`track-header ${showContent ? 'visible' : ''}`}>
        <div className="track-header__controls">
          <Link href="/" className="track-header__icon icon-bulge" title="Home">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <section className={`track-content ${showContent ? 'visible' : ''}`}>
        {/* Title Section */}
        <div className="track-title-section">
          <h1 className="track-title__container">
            <span className="track-word-reveal">
              <span className={`track-word-reveal-inner track-word-delay-0 ${titleRevealed ? 'revealed' : ''}`}>
                Track
              </span>
            </span>
            {' '}
            <span className="track-word-reveal">
              <span className={`track-word-reveal-inner track-word-delay-1 ${titleRevealed ? 'revealed' : ''}`}>
                Order
              </span>
            </span>
          </h1>
          <p className="track-subtitle">Enter your order ID to track your shipment</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="track-search-form">
          <div className="track-search-input-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter Order ID (e.g., ORD-2024-001234)"
              className="track-search-input"
            />
          </div>
          <button type="submit" className="track-search-btn" disabled={isSearching}>
            {isSearching ? 'Searching...' : 'Track Order'}
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div className="track-error">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Demo Orders Notice */}
        <div className="track-demo-notice">
          <p>Demo Order IDs to try: <strong>ORD-2024-001234</strong> or <strong>ORD-2024-005678</strong></p>
        </div>

        {/* Order Details */}
        {order && (
          <div className="track-order-details">
            {/* Order Header */}
            <div className="track-order-header">
              <div className="track-order-header__left">
                <h2 className="track-order-id">{order.orderId}</h2>
                <div 
                  className="track-order-status"
                  style={{ backgroundColor: `${getStatusColor(order.status)}15`, color: getStatusColor(order.status) }}
                >
                  {getStatusLabel(order.status)}
                </div>
              </div>
              <div className="track-order-header__right">
                <div className="track-order-date">
                  <span>Placed on</span>
                  <strong>{new Date(order.placedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong>
                </div>
              </div>
            </div>

            {/* Estimated Delivery */}
            <div className="track-estimated-delivery">
              <div className="track-estimated-delivery__icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13"/>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                  <circle cx="5.5" cy="18.5" r="2.5"/>
                  <circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
              </div>
              <div className="track-estimated-delivery__info">
                <span>Estimated Delivery</span>
                <strong>{new Date(order.estimatedDelivery).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</strong>
              </div>
              <div className="track-carrier-info">
                <span>{order.carrier}</span>
                <span className="track-tracking-number">{order.trackingNumber}</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="track-timeline">
              <h3>Shipment Progress</h3>
              <div className="track-timeline__list">
                {order.timeline.map((event, index) => (
                  <div 
                    key={index} 
                    className={`track-timeline__item ${event.completed ? 'completed' : ''} ${index === order.timeline.findIndex(t => !t.completed) - 1 ? 'current' : ''}`}
                  >
                    <div className="track-timeline__marker">
                      {event.completed ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      ) : (
                        <div className="track-timeline__dot" />
                      )}
                    </div>
                    <div className="track-timeline__content">
                      <div className="track-timeline__header">
                        <span className="track-timeline__status">{event.status}</span>
                        <span className="track-timeline__datetime">
                          {event.date} {event.time && `at ${event.time}`}
                        </span>
                      </div>
                      <p className="track-timeline__description">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items */}
            <div className="track-items">
              <h3>Order Items</h3>
              <div className="track-items__list">
                {order.items.map((item, index) => (
                  <div key={index} className="track-item">
                    <div 
                      className="track-item__image"
                      style={{ backgroundImage: `url(${item.image})` }}
                    />
                    <div className="track-item__info">
                      <span className="track-item__name">{item.name}</span>
                      <span className="track-item__quantity">Qty: {item.quantity}</span>
                    </div>
                    <span className="track-item__price">${item.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="track-shipping">
              <h3>Shipping Address</h3>
              <div className="track-shipping__card">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <div className="track-shipping__info">
                  <strong>{order.shippingAddress.name}</strong>
                  <span>{order.shippingAddress.address}</span>
                  <span>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="track-actions">
              <button className="track-action-btn secondary">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                Contact Support
              </button>
              <Link href="/store" className="track-action-btn primary">
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Styles */}
      <style jsx global>{`
        .track-order-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 25%, #ffffff 50%, #f0f0f0 75%, #e5e5e5 100%);
          font-family: sans-serif;
          -webkit-font-smoothing: antialiased;
          color: #111;
        }

        .track-order-page.loading::before,
        .track-order-page.loading::after {
          content: '';
          position: fixed;
          z-index: 1000;
        }

        .track-order-page.loading::before {
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 50%, #e5e5e5 100%);
        }

        .track-order-page.loading::after {
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

        .icon-bulge {
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          min-width: 44px;
          min-height: 44px;
        }

        .icon-bulge:hover {
          transform: scale(1.2);
        }

        .track-back-btn {
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

        .track-back-btn.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .track-back-btn:hover {
          background: rgba(255, 255, 255, 1);
          transform: translateY(0) scale(1.1);
        }

        .track-header {
          position: fixed;
          top: 0;
          right: 0;
          z-index: 1000;
          padding: clamp(12px, 2vw, 24px) clamp(12px, 2vw, 32px);
          opacity: 0;
          transform: translateY(-20px);
          transition: opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s;
        }

        .track-header.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .track-header__controls {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .track-header__icon {
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

        .track-content {
          padding: clamp(80px, 10vh, 100px) clamp(16px, 6vw, 80px) clamp(40px, 8vh, 80px);
          min-height: 100vh;
          max-width: 800px;
          margin: 0 auto;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease 0.7s, transform 0.6s ease 0.7s;
        }

        .track-content.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .track-title-section {
          margin-bottom: clamp(24px, 4vw, 40px);
        }

        .track-title__container {
          font-size: clamp(32px, 8vw, 56px);
          line-height: 1.1;
          color: #000;
          font-weight: 300;
          letter-spacing: -0.02em;
          margin: 0 0 clamp(8px, 1.5vw, 16px) 0;
        }

        .track-subtitle {
          font-size: clamp(14px, 1.6vw, 16px);
          color: #666;
          margin: 0;
        }

        .track-word-reveal {
          display: inline-block;
          overflow: hidden;
          vertical-align: bottom;
        }

        .track-word-reveal-inner {
          display: inline-block;
          transform: translateY(100%);
          opacity: 0;
        }

        .track-word-reveal-inner.revealed {
          transform: translateY(0);
          opacity: 1;
        }

        .track-word-delay-0 {
          transition: transform 1s cubic-bezier(0.23, 1, 0.32, 1) 0.2s,
                      opacity 0.8s ease-out 0.2s;
        }

        .track-word-delay-1 {
          transition: transform 1s cubic-bezier(0.23, 1, 0.32, 1) 0.35s,
                      opacity 0.8s ease-out 0.35s;
        }

        .track-search-form {
          display: flex;
          gap: clamp(12px, 2vw, 16px);
          margin-bottom: clamp(16px, 2vw, 24px);
          flex-wrap: wrap;
        }

        .track-search-input-wrapper {
          flex: 1;
          min-width: 250px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: clamp(12px, 1.5vw, 16px) clamp(16px, 2vw, 20px);
          background: #fff;
          border-radius: 50px;
          border: 1px solid #e5e5e5;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .track-search-input-wrapper:focus-within {
          border-color: #4A90D9;
          box-shadow: 0 0 0 4px rgba(74, 144, 217, 0.1);
        }

        .track-search-input-wrapper svg {
          color: #999;
          flex-shrink: 0;
        }

        .track-search-input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: clamp(14px, 1.5vw, 16px);
          color: #111;
          outline: none;
        }

        .track-search-input::placeholder {
          color: #999;
        }

        .track-search-btn {
          padding: clamp(12px, 1.5vw, 16px) clamp(24px, 3vw, 32px);
          background: #111;
          color: #fff;
          border: none;
          border-radius: 50px;
          font-size: clamp(14px, 1.5vw, 16px);
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.3s ease, transform 0.2s ease;
          min-height: 44px;
        }

        .track-search-btn:hover:not(:disabled) {
          background: #333;
          transform: translateY(-2px);
        }

        .track-search-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .track-error {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: clamp(12px, 1.5vw, 16px);
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 12px;
          color: #dc2626;
          font-size: clamp(13px, 1.5vw, 15px);
          margin-bottom: clamp(16px, 2vw, 24px);
        }

        .track-demo-notice {
          padding: clamp(12px, 1.5vw, 16px);
          background: #f0f9ff;
          border: 1px solid #bae6fd;
          border-radius: 12px;
          font-size: clamp(12px, 1.4vw, 14px);
          color: #0369a1;
          margin-bottom: clamp(24px, 4vw, 40px);
        }

        .track-demo-notice strong {
          font-family: monospace;
          background: rgba(0, 0, 0, 0.05);
          padding: 2px 6px;
          border-radius: 4px;
        }

        .track-order-details {
          background: #fff;
          border-radius: clamp(16px, 2vw, 24px);
          padding: clamp(20px, 3vw, 32px);
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
        }

        .track-order-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 16px;
          padding-bottom: clamp(16px, 2vw, 24px);
          border-bottom: 1px solid #f0f0f0;
          margin-bottom: clamp(16px, 2vw, 24px);
        }

        .track-order-header__left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .track-order-id {
          font-size: clamp(18px, 2.5vw, 24px);
          font-weight: 600;
          color: #111;
          margin: 0;
        }

        .track-order-status {
          padding: 6px 14px;
          border-radius: 50px;
          font-size: clamp(12px, 1.3vw, 14px);
          font-weight: 500;
        }

        .track-order-date {
          display: flex;
          flex-direction: column;
          text-align: right;
          font-size: clamp(12px, 1.4vw, 14px);
          color: #666;
        }

        .track-order-date strong {
          color: #111;
        }

        .track-estimated-delivery {
          display: flex;
          align-items: center;
          gap: clamp(12px, 2vw, 20px);
          padding: clamp(16px, 2vw, 24px);
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          border-radius: 16px;
          margin-bottom: clamp(20px, 3vw, 32px);
          flex-wrap: wrap;
        }

        .track-estimated-delivery__icon {
          width: 48px;
          height: 48px;
          background: #fff;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0369a1;
          flex-shrink: 0;
        }

        .track-estimated-delivery__info {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .track-estimated-delivery__info span {
          font-size: clamp(12px, 1.3vw, 14px);
          color: #0369a1;
        }

        .track-estimated-delivery__info strong {
          font-size: clamp(16px, 2vw, 20px);
          color: #0c4a6e;
        }

        .track-carrier-info {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          font-size: clamp(12px, 1.3vw, 14px);
          color: #0369a1;
        }

        .track-tracking-number {
          font-family: monospace;
          font-weight: 500;
        }

        .track-timeline {
          margin-bottom: clamp(24px, 3vw, 32px);
        }

        .track-timeline h3 {
          font-size: clamp(16px, 2vw, 18px);
          font-weight: 600;
          color: #111;
          margin: 0 0 clamp(16px, 2vw, 24px) 0;
        }

        .track-timeline__list {
          position: relative;
          padding-left: 28px;
        }

        .track-timeline__item {
          position: relative;
          padding-bottom: clamp(16px, 2vw, 24px);
        }

        .track-timeline__item:last-child {
          padding-bottom: 0;
        }

        .track-timeline__item::before {
          content: '';
          position: absolute;
          left: -20px;
          top: 24px;
          bottom: 0;
          width: 2px;
          background: #e5e5e5;
        }

        .track-timeline__item:last-child::before {
          display: none;
        }

        .track-timeline__item.completed::before {
          background: #10b981;
        }

        .track-timeline__marker {
          position: absolute;
          left: -28px;
          top: 0;
          width: 20px;
          height: 20px;
          background: #e5e5e5;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .track-timeline__item.completed .track-timeline__marker {
          background: #10b981;
          color: #fff;
        }

        .track-timeline__item.current .track-timeline__marker {
          background: #3b82f6;
          color: #fff;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
        }

        .track-timeline__dot {
          width: 8px;
          height: 8px;
          background: #fff;
          border-radius: 50%;
        }

        .track-timeline__content {
          padding-left: 8px;
        }

        .track-timeline__header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 4px;
        }

        .track-timeline__status {
          font-size: clamp(14px, 1.5vw, 16px);
          font-weight: 500;
          color: #111;
        }

        .track-timeline__item:not(.completed) .track-timeline__status {
          color: #999;
        }

        .track-timeline__datetime {
          font-size: clamp(12px, 1.3vw, 13px);
          color: #666;
        }

        .track-timeline__description {
          font-size: clamp(13px, 1.4vw, 14px);
          color: #666;
          margin: 0;
        }

        .track-timeline__item:not(.completed) .track-timeline__description {
          color: #999;
        }

        .track-items {
          margin-bottom: clamp(24px, 3vw, 32px);
        }

        .track-items h3 {
          font-size: clamp(16px, 2vw, 18px);
          font-weight: 600;
          color: #111;
          margin: 0 0 clamp(12px, 1.5vw, 16px) 0;
        }

        .track-items__list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .track-item {
          display: flex;
          align-items: center;
          gap: clamp(12px, 2vw, 16px);
          padding: 12px;
          background: #f9f9f9;
          border-radius: 12px;
        }

        .track-item__image {
          width: clamp(50px, 8vw, 60px);
          height: clamp(50px, 8vw, 60px);
          border-radius: 8px;
          background-size: cover;
          background-position: center;
          flex-shrink: 0;
        }

        .track-item__info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .track-item__name {
          font-size: clamp(14px, 1.5vw, 16px);
          font-weight: 500;
          color: #111;
        }

        .track-item__quantity {
          font-size: clamp(12px, 1.3vw, 14px);
          color: #666;
        }

        .track-item__price {
          font-size: clamp(14px, 1.5vw, 16px);
          font-weight: 600;
          color: #111;
        }

        .track-shipping {
          margin-bottom: clamp(24px, 3vw, 32px);
        }

        .track-shipping h3 {
          font-size: clamp(16px, 2vw, 18px);
          font-weight: 600;
          color: #111;
          margin: 0 0 clamp(12px, 1.5vw, 16px) 0;
        }

        .track-shipping__card {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
          background: #f9f9f9;
          border-radius: 12px;
        }

        .track-shipping__card svg {
          color: #666;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .track-shipping__info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: clamp(13px, 1.4vw, 15px);
          color: #666;
        }

        .track-shipping__info strong {
          color: #111;
        }

        .track-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .track-action-btn {
          flex: 1;
          min-width: 150px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: clamp(12px, 1.5vw, 16px) clamp(20px, 2.5vw, 28px);
          border-radius: 50px;
          font-size: clamp(14px, 1.5vw, 16px);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          min-height: 44px;
        }

        .track-action-btn.primary {
          background: #111;
          color: #fff;
          border: none;
        }

        .track-action-btn.primary:hover {
          background: #333;
          transform: translateY(-2px);
        }

        .track-action-btn.secondary {
          background: #fff;
          color: #111;
          border: 1px solid #e5e5e5;
        }

        .track-action-btn.secondary:hover {
          border-color: #111;
          background: #f9f9f9;
        }

        @media (max-width: 639px) {
          .track-search-form {
            flex-direction: column;
          }

          .track-search-input-wrapper {
            min-width: 100%;
          }

          .track-search-btn {
            width: 100%;
          }

          .track-estimated-delivery {
            flex-direction: column;
            align-items: flex-start;
          }

          .track-carrier-info {
            align-items: flex-start;
          }

          .track-actions {
            flex-direction: column;
          }

          .track-action-btn {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={
      <div className="track-order-page loading">
        <div className="fixed top-0 left-0 w-full h-[50vh] bg-[#0a0a0a] z-[1000]" />
        <div className="fixed top-[50vh] left-0 w-full h-[50vh] bg-[#0a0a0a] z-[1000]" />
      </div>
    }>
      <TrackOrderContent />
    </Suspense>
  );
}