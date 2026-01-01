'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';

interface CartItem {
  id: string;
  name: string;
  price: number;
  cover: string;
  quantity: number;
}

function CheckoutContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [titleRevealed, setTitleRevealed] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('credit');
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // Initialize cart items from localStorage during first render
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('checkoutCart');
      if (savedCart) {
        try {
          return JSON.parse(savedCart);
        } catch {
          return [];
        }
      }
    }
    return [];
  });
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
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

  // Calculate order totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 15.00;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(items => {
      const updated = items.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + delta;
          if (newQuantity <= 0) return null;
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(Boolean) as CartItem[];
      // Update localStorage
      localStorage.setItem('checkoutCart', JSON.stringify(updated));
      return updated;
    });
  };

  const removeItem = (id: string) => {
    setCartItems(items => {
      const updated = items.filter(item => item.id !== id);
      localStorage.setItem('checkoutCart', JSON.stringify(updated));
      return updated;
    });
  };

  // Generate order ID helper
  const generateOrderId = useCallback(() => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const randomPart = Math.random().toString(36).substring(2, 5).toUpperCase();
    return 'KBS-' + timestamp + randomPart;
  }, []);

  // Handle purchase completion
  const handleCompletePurchase = useCallback(() => {
    // Validate form data
    if (!formData.email || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.pincode) {
      alert('Please fill in all delivery information fields.');
      return;
    }

    if (selectedPayment === 'credit') {
      if (!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.cardholderName) {
        alert('Please fill in all card details.');
        return;
      }
    }

    setIsProcessing(true);

    // Generate order ID
    const orderId = generateOrderId();
    
    // Save order to localStorage for the success page to access
    const orderData = {
      orderId,
      items: cartItems,
      subtotal,
      shipping,
      tax,
      total,
      shippingAddress: {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      },
      email: formData.email,
      phone: formData.phone,
      paymentMethod: selectedPayment,
      createdAt: new Date().toISOString(),
    };
    
    localStorage.setItem('lastOrder', JSON.stringify(orderData));
    
    // Clear checkout cart
    localStorage.removeItem('checkoutCart');

    // Simulate payment processing delay
    setTimeout(() => {
      setIsProcessing(false);
      router.push('/order/success');
    }, 1500);
  }, [formData, selectedPayment, cartItems, subtotal, shipping, tax, total, generateOrderId, router]);

  return (
    <main className={`checkout-page ${loading ? 'loading' : ''}`}>
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
        className={`checkout-back-btn ${showContent ? 'visible' : ''}`}
        onClick={() => router.back()}
        title="Go Back"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12 19 5 12 12 5"/>
        </svg>
      </button>

      {/* Header with Home and Login icons */}
      <header className={`checkout-header ${showContent ? 'visible' : ''}`}>
        <div className="checkout-header__controls">
          <Link href="/" className="checkout-header__icon icon-bulge" title="Home">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </Link>
          <button className="checkout-header__icon icon-bulge" title="Login">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <section className={`checkout-content ${showContent ? 'visible' : ''}`}>
        {/* Title Section */}
        <div className="checkout-title-section">
          <h1 className="checkout-title__container">
            <span className="checkout-word-reveal">
              <span className={`checkout-word-reveal-inner checkout-word-delay-0 ${titleRevealed ? 'revealed' : ''}`}>
                Checkout
              </span>
            </span>
          </h1>
          <p className="checkout-subtitle">Secure payment processing</p>
        </div>

        {/* Main Layout - Two Columns */}
        <div className="checkout-layout">
          {/* Left Column */}
          <div className="checkout-left">
            {/* Contact Information Section */}
            <div className="checkout-card">
              <h2 className="checkout-card__title">Contact Information</h2>
              
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  className="form-input" 
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone"
                  className="form-input" 
                  placeholder="+1- 000-000-1111"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Delivery Location Section */}
            <div className="checkout-card">
              <h2 className="checkout-card__title">Delivery Location</h2>
              
              <div className="form-group">
                <label className="form-label">Street Address</label>
                <input 
                  type="text" 
                  name="address"
                  className="form-input" 
                  placeholder="123 Main Street, Apartment 4B"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input 
                    type="text" 
                    name="city"
                    className="form-input" 
                    placeholder="Madison"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input 
                    type="text" 
                    name="state"
                    className="form-input" 
                    placeholder="Wisconsin"
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group" style={{ maxWidth: '200px' }}>
                <label className="form-label">PIN Code</label>
                <input 
                  type="text" 
                  name="pincode"
                  className="form-input" 
                  placeholder="50000"
                  value={formData.pincode}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="checkout-card">
              <h2 className="checkout-card__title">Payment Method</h2>
              
              {/* Credit/Debit Card Option */}
              <div 
                className={`payment-option ${selectedPayment === 'credit' ? 'selected' : ''}`}
                onClick={() => setSelectedPayment('credit')}
              >
                <div className="payment-option__icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                    <line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                </div>
                <span className="payment-option__label">Credit / Debit Card</span>
                {selectedPayment === 'credit' && (
                  <div className="payment-option__check">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4A90D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                )}
              </div>

              {/* Apple Pay Option */}
              <div 
                className={`payment-option ${selectedPayment === 'apple' ? 'selected' : ''}`}
                onClick={() => setSelectedPayment('apple')}
              >
                <div className="payment-option__icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#000">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                </div>
                <span className="payment-option__label">Apple Pay</span>
                {selectedPayment === 'apple' && (
                  <div className="payment-option__check">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4A90D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                )}
              </div>

              {/* PayPal Option */}
              <div 
                className={`payment-option ${selectedPayment === 'paypal' ? 'selected' : ''}`}
                onClick={() => setSelectedPayment('paypal')}
              >
                <div className="payment-option__icon paypal-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="#003087" d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z"/>
                    <path fill="#003087" d="M23.95 7.332c-.023.143-.05.288-.082.437C22.86 12.819 19.493 14.566 15.195 14.566h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106H6.88a.641.641 0 0 1-.633-.74l.05-.32 1.17-7.44.08-.44c.082-.518.526-.9 1.05-.9h2.19c4.298 0 7.664-1.747 8.647-6.797.03-.149.054-.294.077-.437.318-1.63.004-2.736-.766-3.74-.253-.33-.566-.624-.935-.879 1.59.74 2.58 2.14 2.14 4.403z"/>
                    <path fill="#0070BA" d="M9.612 7.083c.082-.518.526-.9 1.05-.9h6.642c.787 0 1.52.05 2.19.152.19.029.375.063.555.1.18.039.356.081.526.128.085.024.169.048.25.074 1.59.74 2.58 2.14 2.14 4.403-.023.143-.05.288-.082.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106H5.83a.641.641 0 0 1-.633-.74l2.415-15.33"/>
                  </svg>
                </div>
                <span className="payment-option__label">PayPal</span>
                {selectedPayment === 'paypal' && (
                  <div className="payment-option__check">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4A90D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                )}
              </div>

              {/* Google Pay Option */}
              <div 
                className={`payment-option ${selectedPayment === 'gpay' ? 'selected' : ''}`}
                onClick={() => setSelectedPayment('gpay')}
              >
                <div className="payment-option__icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M12 11v4h6.3c-.3 1.5-1.8 4.5-6.3 4.5-3.8 0-6.9-3.1-6.9-7s3.1-7 6.9-7c2.2 0 3.6.9 4.4 1.7l3-2.9C17.5 2.5 15 1.5 12 1.5 6.5 1.5 2 6 2 11.5S6.5 21.5 12 21.5c5.8 0 9.6-4.1 9.6-9.8 0-.7-.1-1.2-.2-1.7H12z"/>
                  </svg>
                </div>
                <span className="payment-option__label">Google Pay</span>
                {selectedPayment === 'gpay' && (
                  <div className="payment-option__check">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4A90D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                )}
              </div>

              {/* Payment Icons Row */}
              <div className="payment-icons">
                {/* Visa */}
                <div className="payment-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="24" viewBox="0 0 48 32">
                    <rect width="48" height="32" rx="4" fill="#1A1F71"/>
                    <path d="M19.5 21h-3l1.8-11h3l-1.8 11zm7.8-10.7c-.6-.2-1.5-.5-2.6-.5-2.9 0-4.9 1.5-4.9 3.7 0 1.6 1.5 2.5 2.6 3 1.1.6 1.5 1 1.5 1.5 0 .8-1 1.2-1.8 1.2-1.2 0-1.9-.2-2.9-.6l-.4-.2-.4 2.6c.7.3 2 .6 3.4.6 3.1 0 5-1.5 5.1-3.8 0-1.3-.8-2.2-2.4-3-.9-.5-1.5-.8-1.5-1.3 0-.5.5-1 1.5-1 .9 0 1.5.2 2 .4l.2.1.5-2.6zm7.5-.2h-2.2c-.7 0-1.2.2-1.5.9l-4.3 10h3l.6-1.7h3.7l.4 1.7h2.7l-2.4-10.9zm-3.5 7l1.2-3.2.3-.9.2.8.7 3.3h-2.4zm-16.8-7l-2.9 7.5-.3-1.5c-.5-1.8-2.2-3.8-4-4.8l2.5 9.5h3.1l4.6-10.7h-3z" fill="#fff"/>
                    <path d="M9.5 10.3l-.1.5c3.7.9 6.2 3.2 7.2 5.9l-1-5.2c-.2-.8-.8-1.1-1.5-1.2H9.5z" fill="#F9A533"/>
                  </svg>
                </div>
                {/* Mastercard */}
                <div className="payment-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="24" viewBox="0 0 48 32">
                    <rect width="48" height="32" rx="4" fill="#000"/>
                    <circle cx="18" cy="16" r="10" fill="#EB001B"/>
                    <circle cx="30" cy="16" r="10" fill="#F79E1B"/>
                    <path d="M24 8.5a10 10 0 0 0-3.7 7.5 10 10 0 0 0 3.7 7.5 10 10 0 0 0 3.7-7.5 10 10 0 0 0-3.7-7.5z" fill="#FF5F00"/>
                  </svg>
                </div>
                {/* Apple Pay */}
                <div className="payment-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="24" viewBox="0 0 48 32">
                    <rect width="48" height="32" rx="4" fill="#000"/>
                    <path d="M16.5 11.5c-.5.6-1.2 1-1.9 1-.1-.8.3-1.6.7-2.1.52-1 1.9-1 .1.8-.2 1.5-.7 2.1zm.7 1.1c-1 0-2 .6-2.5.6s-1.3-.6-2.2-.6c-1.1 0-2.2.7-2.8 1.7-1.2 2-.3 5 .8 6.7.6.8 1.2 1.7 2.1 1.7s1.2-.5 2.2-.5 1.3.5 2.2.5 1.5-.8 2-1.7c.6-1 .9-1.9.9-2 0 0-1.7-.7-1.7-2.6 0-1.7 1.4-2.5 1.5-2.5-.8-1.2-2.1-1.3-2.5-1.3zm7.8-2.1v11h1.7v-3.8h2.4c2.2 0 3.7-1.5 3.7-3.6s-1.5-3.6-3.6-3.6h-4.2zm1.7 1.4h2c1.5 0 2.3.8 2.3 2.2s-.8 2.2-2.3 2.2h-2v-4.4zm9 9.7c1.1 0 2.1-.5 2.5-1.4h0v1.3h1.6v-5.6c0-1.6-1.3-2.6-3.2-2.6-1.8 0-3.1 1-3.2 2.4h1.5c.1-.7.8-1.1 1.6-1.1 1 0 1.6.5 1.6 1.4v.6l-2.1.1c-2 .1-3 .9-3 2.3 0 1.5 1.1 2.4 2.7 2.4zm.4-1.3c-.9 0-1.5-.4-1.5-1.1 0-.7.6-1.1 1.6-1.2l1.9-.1v.6c0 1.1-.9 1.9-2 1.9zm5.1 3.2c1.6 0 2.4-.6 3.1-2.5l2.9-8.3h-1.7l-2 6.3h0l-2-6.3h-1.8l2.8 7.8-.2.5c-.3.8-.7 1.1-1.5 1.1-.1 0-.4 0-.5 0v1.3c.1 0 .6 0 .9 0z" fill="#fff"/>
                  </svg>
                </div>
                {/* Google Pay */}
                <div className="payment-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="24" viewBox="0 0 48 32">
                    <rect width="48" height="32" rx="4" fill="#fff" stroke="#ddd"/>
                    <path d="M23.5 16.5v3h-1v-7.5h2.6c.6 0 1.2.2 1.7.6.5.4.7.9.7 1.5s-.2 1.1-.7 1.5c-.4.4-1 .6-1.7.6h-1.6zm0-3.5v2.5h1.7c.4 0 .7-.1.9-.4.3-.2.4-.5.4-.9s-.1-.6-.4-.9c-.2-.2-.5-.4-.9-.4h-1.7z" fill="#5F6368"/>
                    <path d="M30.5 13c.7 0 1.3.2 1.7.6.4.4.6 1 .6 1.6v4.3h-1v-1h0c-.4.6-.9.9-1.6.9-.6 0-1.1-.2-1.5-.5-.4-.4-.6-.8-.6-1.4 0-.6.2-1 .6-1.4.4-.3.9-.5 1.6-.5.6 0 1 .1 1.4.4v-.3c0-.4-.1-.7-.4-1-.3-.3-.6-.4-1-.4-.6 0-1 .3-1.2.8l-.9-.4c.4-.8 1-1.2 1.9-1.2zm-1.3 4.5c0 .3.1.5.4.7.2.2.5.3.8.3.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1-.3-.3-.7-.4-1.3-.4-.4 0-.8.1-1 .3-.3.2-.5.4-.5.7z" fill="#5F6368"/>
                    <path d="M38 13.2l-3.5 8h-1l1.3-2.8-2.3-5.2h1.1l1.6 4h0l1.6-4h1.2z" fill="#5F6368"/>
                    <path d="M17.5 15.5c0-.3 0-.6-.1-.9h-4.9v1.7h2.8c-.1.6-.4 1.1-.9 1.4v1.2h1.5c.9-.8 1.4-2 1.4-3.4z" fill="#4285F4"/>
                    <path d="M12.5 19.5c1.2 0 2.3-.4 3-1.1l-1.5-1.2c-.4.3-1 .5-1.6.5-1.2 0-2.2-.8-2.6-1.9h-1.5v1.2c.8 1.5 2.3 2.5 4.2 2.5z" fill="#34A853"/>
                    <path d="M9.9 15.8c-.1-.3-.1-.6-.1-.8s0-.6.1-.8v-1.2h-1.6c-.3.6-.4 1.3-.4 2s.2 1.4.5 2l1.5-1.2z" fill="#FBBC05"/>
                    <path d="M12.5 12.3c.7 0 1.3.2 1.8.7l1.3-1.3c-.8-.8-1.9-1.2-3.1-1.2-1.8 0-3.4 1-4.2 2.5l1.5 1.2c.4-1.1 1.4-1.9 2.6-1.9z" fill="#EA4335"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Card Details Section - Only show when credit card is selected */}
            {selectedPayment === 'credit' && (
              <div className="checkout-card">
                <h2 className="checkout-card__title">Card Details</h2>
                
                <div className="form-group">
                  <label className="form-label">Card Number</label>
                  <input 
                    type="text" 
                    name="cardNumber"
                    className="form-input" 
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Expiry Date</label>
                    <input 
                      type="text" 
                      name="expiryDate"
                      className="form-input" 
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CVV</label>
                    <input 
                      type="text" 
                      name="cvv"
                      className="form-input" 
                      placeholder="123"
                      value={formData.cvv}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Cardholder Name</label>
                  <input 
                    type="text" 
                    name="cardholderName"
                    className="form-input" 
                    placeholder="John Doe"
                    value={formData.cardholderName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary and Product Details */}
          <div className="checkout-right">
            {/* Product Details Section */}
            <div className="checkout-card product-details">
              <h2 className="checkout-card__title">Product Details</h2>
              
              {cartItems.length === 0 ? (
                <div className="empty-cart">
                  <p>No items in cart</p>
                  <Link href="/store" className="back-to-store">Continue Shopping</Link>
                </div>
              ) : (
                <div className="product-list">
                  {cartItems.map(item => (
                    <div key={item.id} className="product-item">
                      <div className="product-image">
                        <Image 
                          src={item.cover} 
                          alt={item.name} 
                          width={80} 
                          height={80}
                          className="product-img"
                        />
                      </div>
                      <div className="product-info">
                        <span className="product-name">{item.name}</span>
                        <span className="product-price">${item.price}</span>
                        <div className="product-quantity">
                          <button 
                            className="qty-btn"
                            onClick={() => updateQuantity(item.id, -1)}
                          >-</button>
                          <span className="qty-value">{item.quantity}</span>
                          <button 
                            className="qty-btn"
                            onClick={() => updateQuantity(item.id, 1)}
                          >+</button>
                        </div>
                      </div>
                      <button 
                        className="remove-btn"
                        onClick={() => removeItem(item.id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="checkout-card order-summary">
              <h2 className="checkout-card__title">Order Summary</h2>
              
              <div className="summary-row">
                <span className="summary-label">Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                <span className="summary-value">${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span className="summary-label">Shipping</span>
                <span className="summary-value">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              
              <div className="summary-row">
                <span className="summary-label">Tax (8%)</span>
                <span className="summary-value">${tax.toFixed(2)}</span>
              </div>
              
              <div className="summary-row total">
                <span className="summary-label">Total</span>
                <span className="summary-value total-value">${total.toFixed(2)}</span>
              </div>

              <button
                className="complete-purchase-btn"
                disabled={cartItems.length === 0 || isProcessing}
                onClick={handleCompletePurchase}
              >
                {isProcessing ? (
                  <span className="processing-text">
                    <span className="spinner"></span>
                    Processing...
                  </span>
                ) : (
                  'Complete Purchase'
                )}
              </button>

              <div className="secure-checkout">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <span>Secure checkout</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Styles */}
      <style jsx global>{`
        /* Checkout Page Styles */
        .checkout-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 25%, #ffffff 50%, #f0f0f0 75%, #e5e5e5 100%);
          font-family: sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          color: #111;
        }

        /* Loading State */
        .checkout-page.loading::before,
        .checkout-page.loading::after {
          content: '';
          position: fixed;
          z-index: 1000;
        }

        .checkout-page.loading::before {
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 50%, #e5e5e5 100%);
        }

        .checkout-page.loading::after {
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

        /* Back Button - Responsive */
        .checkout-back-btn {
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
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          color: #000;
          opacity: 0;
          transform: translateY(-20px);
          transition: opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s, background-color 0.3s ease;
        }

        .checkout-back-btn svg {
          width: clamp(18px, 2.5vw, 24px);
          height: clamp(18px, 2.5vw, 24px);
        }

        .checkout-back-btn.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .checkout-back-btn:hover {
          background: rgba(255, 255, 255, 1);
          transform: translateY(0) scale(1.1);
        }

        /* Checkout Header - Responsive */
        .checkout-header {
          position: fixed;
          top: 0;
          right: 0;
          z-index: 1000;
          padding: clamp(12px, 2vw, 24px) clamp(12px, 2vw, 32px);
          opacity: 0;
          transform: translateY(-20px);
          transition: opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s;
        }

        .checkout-header.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .checkout-header__controls {
          display: flex;
          align-items: center;
          gap: clamp(8px, 1.5vw, 16px);
        }

        .checkout-header__icon {
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

        .checkout-header__icon svg {
          width: clamp(18px, 2.5vw, 24px);
          height: clamp(18px, 2.5vw, 24px);
        }

        /* Checkout Content - Responsive padding */
        .checkout-content {
          padding: clamp(80px, 10vh, 100px) clamp(16px, 6vw, 80px) clamp(40px, 8vh, 80px);
          min-height: 100vh;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease 0.7s, transform 0.6s ease 0.7s;
        }

        .checkout-content.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Title Section - Responsive */
        .checkout-title-section {
          margin-bottom: clamp(24px, 4vw, 48px);
        }

        .checkout-title__container {
          font-family: sans-serif;
          font-size: clamp(32px, 8vw, 72px);
          line-height: 1;
          color: #000;
          font-weight: 300;
          letter-spacing: -0.02em;
          margin: 0 0 clamp(8px, 1.5vw, 16px) 0;
        }

        .checkout-subtitle {
          font-size: clamp(14px, 1.6vw, 16px);
          color: #000;
          font-weight: 500;
          margin: 0;
        }

        /* Word by Word Reveal Animation */
        .checkout-word-reveal {
          display: inline-block;
          overflow: hidden;
          vertical-align: bottom;
        }

        .checkout-word-reveal-inner {
          display: inline-block;
          transform: translateY(100%);
          opacity: 0;
        }

        .checkout-word-reveal-inner.revealed {
          transform: translateY(0);
          opacity: 1;
        }

        .checkout-word-delay-0 {
          transition: transform 1s cubic-bezier(0.23, 1, 0.32, 1) 0.2s,
                      opacity 0.8s ease-out 0.2s;
        }

        /* Main Layout - Responsive */
        .checkout-layout {
          display: grid;
          grid-template-columns: 1fr clamp(320px, 35vw, 420px);
          gap: clamp(20px, 3vw, 32px);
          align-items: start;
        }

        /* Checkout Cards - Responsive */
        .checkout-card {
          background: #fff;
          border-radius: clamp(12px, 1.5vw, 16px);
          padding: clamp(20px, 3vw, 32px);
          margin-bottom: clamp(16px, 2vw, 24px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .checkout-card__title {
          font-size: clamp(16px, 1.8vw, 18px);
          font-weight: 500;
          color: #000;
          margin: 0 0 clamp(16px, 2.5vw, 24px) 0;
        }

        /* Payment Options - Touch-friendly */
        .payment-option {
          display: flex;
          align-items: center;
          padding: clamp(14px, 2vw, 20px);
          border: 2px solid #e5e5e5;
          border-radius: clamp(10px, 1.2vw, 12px);
          margin-bottom: clamp(10px, 1.2vw, 12px);
          cursor: pointer;
          transition: all 0.3s ease;
          min-height: 44px;
        }

        .payment-option:hover {
          border-color: #ccc;
        }

        .payment-option.selected {
          border-color: #4A90D9;
          background: rgba(74, 144, 217, 0.02);
        }

        .payment-option__icon {
          width: clamp(24px, 3vw, 32px);
          height: clamp(24px, 3vw, 32px);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: clamp(12px, 1.5vw, 16px);
          color: #000;
        }

        .payment-option__icon svg {
          width: clamp(20px, 2.5vw, 24px);
          height: clamp(20px, 2.5vw, 24px);
        }

        .payment-option__label {
          flex: 1;
          font-size: clamp(13px, 1.5vw, 15px);
          color: #000;
        }

        .payment-option__check {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Payment Icons Row - Responsive */
        .payment-icons {
          display: flex;
          gap: clamp(8px, 1.2vw, 12px);
          margin-top: clamp(16px, 2.5vw, 24px);
          padding-top: clamp(16px, 2.5vw, 24px);
          border-top: 1px solid #eee;
          flex-wrap: wrap;
        }

        .payment-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .payment-icon svg {
          width: clamp(32px, 4vw, 40px);
          height: clamp(20px, 2.5vw, 24px);
        }

        /* Form Styles - Responsive */
        .form-group {
          margin-bottom: clamp(16px, 2vw, 20px);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(12px, 1.5vw, 16px);
        }

        .form-label {
          display: block;
          font-size: clamp(12px, 1.4vw, 14px);
          color: #000;
          margin-bottom: clamp(6px, 0.8vw, 8px);
          font-weight: 500;
        }

        .form-input {
          width: 100%;
          padding: clamp(12px, 1.5vw, 16px);
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          font-size: clamp(14px, 1.5vw, 15px);
          color: #000;
          background: #fff;
          transition: border-color 0.3s ease;
          box-sizing: border-box;
          min-height: 44px;
        }

        .form-input:focus {
          outline: none;
          border-color: #4A90D9;
        }

        .form-input::placeholder {
          color: #bbb;
        }

        /* Product Details Section - Responsive */
        .product-details {
          max-height: clamp(300px, 40vh, 400px);
          overflow-y: auto;
        }

        .empty-cart {
          text-align: center;
          padding: clamp(24px, 4vw, 40px) clamp(16px, 2vw, 20px);
          color: #000;
        }

        .back-to-store {
          display: inline-block;
          margin-top: clamp(12px, 1.5vw, 16px);
          padding: clamp(10px, 1.2vw, 12px) clamp(20px, 2.5vw, 24px);
          background: #111;
          color: #fff;
          text-decoration: none;
          border-radius: 8px;
          font-size: clamp(13px, 1.4vw, 14px);
          transition: background-color 0.3s ease;
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .back-to-store:hover {
          background: #333;
        }

        .product-list {
          display: flex;
          flex-direction: column;
          gap: clamp(12px, 1.5vw, 16px);
        }

        .product-item {
          display: flex;
          align-items: center;
          gap: clamp(12px, 1.5vw, 16px);
          padding: clamp(12px, 1.5vw, 16px);
          background: #f9f9f9;
          border-radius: clamp(10px, 1.2vw, 12px);
          position: relative;
        }

        .product-image {
          width: clamp(60px, 8vw, 80px);
          height: clamp(60px, 8vw, 80px);
          border-radius: 8px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .product-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .product-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: clamp(4px, 0.6vw, 6px);
          padding-right: 32px;
        }

        .product-name {
          font-size: clamp(13px, 1.5vw, 15px);
          font-weight: 500;
          color: #000;
        }

        .product-price {
          font-size: clamp(12px, 1.4vw, 14px);
          color: #000;
        }

        .product-quantity {
          display: flex;
          align-items: center;
          gap: clamp(8px, 1.2vw, 12px);
          margin-top: 4px;
        }

        .qty-btn {
          width: clamp(28px, 3.5vw, 36px);
          height: clamp(28px, 3.5vw, 36px);
          min-width: 44px;
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e5e5e5;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: clamp(14px, 1.6vw, 16px);
          color: #111;
          transition: background-color 0.3s ease;
        }

        .qty-btn:hover {
          background: #ddd;
        }

        .qty-value {
          font-size: clamp(13px, 1.4vw, 14px);
          font-weight: 500;
          min-width: 24px;
          text-align: center;
          color: #000;
        }

        .remove-btn {
          position: absolute;
          top: clamp(8px, 1.2vw, 12px);
          right: clamp(8px, 1.2vw, 12px);
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          cursor: pointer;
          color: #999;
          transition: color 0.3s ease;
        }

        .remove-btn:hover {
          color: #ff4444;
        }

        /* Order Summary - Responsive */
        .order-summary {
          position: sticky;
          top: 100px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: clamp(8px, 1.2vw, 12px) 0;
        }

        .summary-row.total {
          border-top: 1px solid #eee;
          margin-top: clamp(8px, 1.2vw, 12px);
          padding-top: clamp(14px, 2vw, 20px);
        }

        .summary-label {
          font-size: clamp(12px, 1.4vw, 14px);
          color: #000;
        }

        .summary-value {
          font-size: clamp(12px, 1.4vw, 14px);
          color: #000;
        }

        .summary-value.total-value {
          font-size: clamp(18px, 2.5vw, 24px);
          font-weight: 500;
          color: #E8A87C;
        }

        .complete-purchase-btn {
          width: 100%;
          padding: clamp(14px, 1.8vw, 18px);
          background: #111;
          color: #fff;
          border: none;
          border-radius: 50px;
          font-size: clamp(14px, 1.6vw, 16px);
          font-weight: 500;
          cursor: pointer;
          margin-top: clamp(16px, 2.5vw, 24px);
          transition: background-color 0.3s ease, transform 0.2s ease;
          min-height: 44px;
        }

        .complete-purchase-btn:hover:not(:disabled) {
          background: #333;
          transform: translateY(-2px);
        }

        .complete-purchase-btn:disabled {
          background: #999;
          cursor: not-allowed;
        }

        .processing-text {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .secure-checkout {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(6px, 0.8vw, 8px);
          margin-top: clamp(14px, 2vw, 20px);
          font-size: clamp(11px, 1.3vw, 13px);
          color: #000;
        }

        /* ===== TABLET BREAKPOINT (640px - 1023px) ===== */
        @media (min-width: 640px) and (max-width: 1023px) {
          .checkout-layout {
            grid-template-columns: 1fr;
          }

          .order-summary {
            position: static;
          }
          
          .checkout-right {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
          }
          
          .product-details {
            max-height: none;
          }
        }

        /* ===== MOBILE BREAKPOINT (<640px) ===== */
        @media (max-width: 639px) {
          .checkout-layout {
            grid-template-columns: 1fr;
          }

          .order-summary {
            position: static;
          }

          .form-row {
            grid-template-columns: 1fr;
          }
          
          .product-item {
            flex-direction: column;
            align-items: flex-start;
            padding-top: 40px;
          }
          
          .product-image {
            width: 100%;
            height: 120px;
          }
          
          .product-info {
            width: 100%;
            padding-right: 0;
          }
          
          .remove-btn {
            top: 8px;
            right: 8px;
          }
          
          .product-quantity {
            width: 100%;
            justify-content: flex-start;
          }
          
          .payment-option {
            padding: 16px 14px;
          }
          
          .payment-option__icon {
            margin-right: 10px;
          }
        }

        /* ===== SMALL MOBILE (<400px) ===== */
        @media (max-width: 399px) {
          .checkout-back-btn {
            width: 40px;
            height: 40px;
          }
          
          .checkout-header__icon {
            width: 40px;
            height: 40px;
          }
          
          .payment-icons {
            justify-content: center;
          }
          
          .product-image {
            height: 100px;
          }
        }
      `}</style>
    </main>
  );
}

export default function CheckoutPage() {
  return <CheckoutContent />;
}