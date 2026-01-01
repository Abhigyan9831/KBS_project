'use client';

import React, { useState, useEffect, useRef, Suspense, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { useAuth } from '../context/AuthContext';

// Types
interface Order {
  id: string;
  date: string;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: {
    name: string;
    cover: string;
    quantity: number;
    price: number;
  }[];
}

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'netbanking';
  last4?: string;
  cardBrand?: string;
  upiId?: string;
  bankName?: string;
  isDefault: boolean;
}

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  cover: string;
  inStock: boolean;
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
}

// Sample Data
const sampleOrders: Order[] = [
  {
    id: 'KBS-ABC123',
    date: '2025-12-28',
    status: 'delivered',
    total: 289.99,
    items: [
      { name: 'Classic Oxford Shirt', cover: '/images/1.jpg', quantity: 2, price: 89.99 },
      { name: 'Premium Denim Jeans', cover: '/images/2.jpg', quantity: 1, price: 110.01 }
    ]
  },
  {
    id: 'KBS-DEF456',
    date: '2025-12-30',
    status: 'shipped',
    total: 159.50,
    items: [
      { name: 'Cashmere Sweater', cover: '/images/3.jpg', quantity: 1, price: 159.50 }
    ]
  },
  {
    id: 'KBS-GHI789',
    date: '2026-01-01',
    status: 'processing',
    total: 445.00,
    items: [
      { name: 'Leather Jacket', cover: '/images/4.jpg', quantity: 1, price: 299.00 },
      { name: 'Silk Scarf', cover: '/images/5.jpg', quantity: 2, price: 73.00 }
    ]
  }
];

const sampleAddresses: Address[] = [
  {
    id: 'addr-1',
    type: 'home',
    name: 'John Doe',
    address: '123 Main Street, Apartment 4B',
    city: 'Madison',
    state: 'Wisconsin',
    pincode: '53703',
    isDefault: true
  },
  {
    id: 'addr-2',
    type: 'work',
    name: 'John Doe',
    address: '456 Business Park, Suite 200',
    city: 'Madison',
    state: 'Wisconsin',
    pincode: '53704',
    isDefault: false
  }
];

const samplePaymentMethods: PaymentMethod[] = [
  {
    id: 'pay-1',
    type: 'card',
    last4: '4242',
    cardBrand: 'Visa',
    isDefault: true
  },
  {
    id: 'pay-2',
    type: 'card',
    last4: '8888',
    cardBrand: 'Mastercard',
    isDefault: false
  },
  {
    id: 'pay-3',
    type: 'upi',
    upiId: 'johndoe@upi',
    isDefault: false
  }
];

const sampleWishlist: WishlistItem[] = [
  { id: 'wish-1', name: 'Linen Summer Dress', price: 129.00, cover: '/images/6.jpg', inStock: true },
  { id: 'wish-2', name: 'Wool Blend Coat', price: 349.00, cover: '/images/7.jpg', inStock: true },
  { id: 'wish-3', name: 'Vintage Watch', price: 599.00, cover: '/images/8.jpg', inStock: false },
  { id: 'wish-4', name: 'Designer Sunglasses', price: 189.00, cover: '/images/9.jpg', inStock: true }
];

type TabType = 'orders' | 'addresses' | 'payments' | 'wishlist' | 'settings';

function DashboardContent() {
  const router = useRouter();
  const { isAuthenticated, user, logout, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [titleRevealed, setTitleRevealed] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('orders');
  const [orders] = useState<Order[]>(sampleOrders);
  const [addresses, setAddresses] = useState<Address[]>(sampleAddresses);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(samplePaymentMethods);
  const [wishlist, setWishlist] = useState<WishlistItem[]>(sampleWishlist);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedName, setEditedName] = useState(() =>
    user ? `${user.firstName} ${user.lastName}` : ''
  );
  const [editedEmail, setEditedEmail] = useState(() => user?.email || '');
  const [editedPhone, setEditedPhone] = useState(() => user?.phone || '');
  
  // Modal states
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  
  // Address form
  const [addressForm, setAddressForm] = useState({
    type: 'home' as 'home' | 'work' | 'other',
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });
  
  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Payment form
  const [paymentForm, setPaymentForm] = useState({
    type: 'card' as 'card' | 'upi',
    cardNumber: '',
    upiId: ''
  });
  
  const shutterTopRef = useRef<HTMLDivElement>(null);
  const shutterBottomRef = useRef<HTMLDivElement>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/account?redirect=/dashboard');
    }
  }, [isAuthenticated, router]);


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

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'processing': return '#3b82f6';
      case 'shipped': return '#f59e0b';
      case 'delivered': return '#22c55e';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'processing': return 'Processing';
      case 'shipped': return 'Shipped';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  };

  const handleRemoveFromWishlist = (id: string) => {
    setWishlist(prev => prev.filter(item => item.id !== id));
  };

  // Handle Track Order - Navigate to track order page with order ID
  const handleTrackOrder = useCallback((orderId: string) => {
    router.push(`/track-order?orderId=${orderId}`);
  }, [router]);

  // Handle Reorder - Add items back to cart
  const handleReorder = useCallback((order: Order) => {
    // Get existing cart from localStorage
    const existingCart = localStorage.getItem('cart');
    let cart: { id: string; name: string; price: number; cover: string; quantity: number }[] = [];
    
    if (existingCart) {
      try {
        cart = JSON.parse(existingCart);
      } catch (e) {
        console.error('Error parsing cart:', e);
      }
    }
    
    // Add order items to cart
    order.items.forEach(item => {
      const existingIndex = cart.findIndex(c => c.name === item.name);
      if (existingIndex >= 0) {
        cart[existingIndex].quantity += item.quantity;
      } else {
        cart.push({
          id: `reorder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: item.name,
          price: item.price,
          cover: item.cover,
          quantity: item.quantity
        });
      }
    });
    
    localStorage.setItem('cart', JSON.stringify(cart));
    router.push('/checkout');
  }, [router]);

  // Handle Add to Cart from Wishlist
  const handleAddToCart = useCallback((item: WishlistItem) => {
    if (!item.inStock) return;
    
    // Get existing cart from localStorage
    const existingCart = localStorage.getItem('cart');
    let cart: { id: string; name: string; price: number; cover: string; quantity: number }[] = [];
    
    if (existingCart) {
      try {
        cart = JSON.parse(existingCart);
      } catch (e) {
        console.error('Error parsing cart:', e);
      }
    }
    
    // Add item to cart
    const existingIndex = cart.findIndex(c => c.name === item.name);
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        id: item.id,
        name: item.name,
        price: item.price,
        cover: item.cover,
        quantity: 1
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Remove from wishlist after adding to cart
    setWishlist(prev => prev.filter(w => w.id !== item.id));
    
    // Show feedback
    alert(`${item.name} added to cart!`);
  }, []);

  // Handle Add Address
  const handleOpenAddressModal = useCallback((address?: Address) => {
    if (address) {
      setEditingAddress(address);
      setAddressForm({
        type: address.type,
        name: address.name,
        address: address.address,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        isDefault: address.isDefault
      });
    } else {
      setEditingAddress(null);
      setAddressForm({
        type: 'home',
        name: user ? `${user.firstName} ${user.lastName}` : '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: false
      });
    }
    setShowAddressModal(true);
  }, [user]);

  const handleSaveAddress = useCallback(() => {
    if (!addressForm.name || !addressForm.address || !addressForm.city || !addressForm.state || !addressForm.pincode) {
      alert('Please fill in all fields');
      return;
    }
    
    if (editingAddress) {
      // Update existing address
      setAddresses(prev => prev.map(addr =>
        addr.id === editingAddress.id
          ? { ...addr, ...addressForm }
          : addressForm.isDefault ? { ...addr, isDefault: false } : addr
      ));
    } else {
      // Add new address
      const newAddress: Address = {
        id: `addr-${Date.now()}`,
        ...addressForm
      };
      
      setAddresses(prev => {
        const updated = addressForm.isDefault
          ? prev.map(addr => ({ ...addr, isDefault: false }))
          : prev;
        return [...updated, newAddress];
      });
    }
    
    setShowAddressModal(false);
    setEditingAddress(null);
  }, [addressForm, editingAddress]);

  const handleDeleteAddress = useCallback((id: string) => {
    if (confirm('Are you sure you want to delete this address?')) {
      setAddresses(prev => prev.filter(addr => addr.id !== id));
    }
  }, []);

  // Handle Payment Methods
  const handleOpenPaymentModal = useCallback(() => {
    setPaymentForm({
      type: 'card',
      cardNumber: '',
      upiId: ''
    });
    setShowPaymentModal(true);
  }, []);

  const handleSavePayment = useCallback(() => {
    if (paymentForm.type === 'card' && paymentForm.cardNumber.length < 16) {
      alert('Please enter a valid card number');
      return;
    }
    if (paymentForm.type === 'upi' && !paymentForm.upiId.includes('@')) {
      alert('Please enter a valid UPI ID');
      return;
    }
    
    const newPayment: PaymentMethod = {
      id: `pay-${Date.now()}`,
      type: paymentForm.type,
      isDefault: paymentMethods.length === 0,
      ...(paymentForm.type === 'card' ? {
        last4: paymentForm.cardNumber.slice(-4),
        cardBrand: paymentForm.cardNumber.startsWith('4') ? 'Visa' : 'Mastercard'
      } : {
        upiId: paymentForm.upiId
      })
    };
    
    setPaymentMethods(prev => [...prev, newPayment]);
    setShowPaymentModal(false);
  }, [paymentForm, paymentMethods.length]);

  const handleRemovePayment = useCallback((id: string) => {
    if (confirm('Are you sure you want to remove this payment method?')) {
      setPaymentMethods(prev => prev.filter(p => p.id !== id));
    }
  }, []);

  // Handle Change Password
  const handleOpenPasswordModal = useCallback(() => {
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setShowPasswordModal(true);
  }, []);

  const handleChangePassword = useCallback(() => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      alert('Please fill in all fields');
      return;
    }
    
    if (passwordForm.newPassword.length < 8) {
      alert('New password must be at least 8 characters');
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    // In a real app, this would call an API
    alert('Password changed successfully!');
    setShowPasswordModal(false);
  }, [passwordForm]);

  const handleSetDefaultAddress = (id: string) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  const handleSaveProfile = () => {
    if (user) {
      const [firstName, ...lastNameParts] = editedName.split(' ');
      const lastName = lastNameParts.join(' ') || '';
      updateUser({
        firstName,
        lastName,
        email: editedEmail,
        phone: editedPhone
      });
    }
    setIsEditingProfile(false);
  };

  const handleCancelEditProfile = () => {
    if (user) {
      setEditedName(`${user.firstName} ${user.lastName}`);
      setEditedEmail(user.email);
      setEditedPhone(user.phone || '');
    }
    setIsEditingProfile(false);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Don't render if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="dashboard-page loading">
        <div className="fixed top-0 left-0 w-full h-[50vh] bg-[#0a0a0a] z-[1000]" />
        <div className="fixed top-[50vh] left-0 w-full h-[50vh] bg-[#0a0a0a] z-[1000]" />
      </div>
    );
  }

  const userDisplayName = `${user.firstName} ${user.lastName}`;
  const userInitial = user.firstName?.charAt(0).toUpperCase() || 'U';

  const renderOrdersTab = () => (
    <div className="tab-content">
      <h2 className="tab-title">Order History</h2>
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div className="order-info">
                <span className="order-id">#{order.id}</span>
                <span className="order-date">{new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="order-status" style={{ backgroundColor: `${getStatusColor(order.status)}15`, color: getStatusColor(order.status) }}>
                {getStatusLabel(order.status)}
              </div>
            </div>
            <div className="order-items">
              {order.items.map((item, idx) => (
                <div key={idx} className="order-item">
                  <div className="order-item__image">
                    <Image src={item.cover} alt={item.name} width={60} height={60} className="order-item__img" />
                    <span className="order-item__quantity">{item.quantity}</span>
                  </div>
                  <div className="order-item__details">
                    <span className="order-item__name">{item.name}</span>
                    <span className="order-item__price">${item.price.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-footer">
              <span className="order-total">Total: <strong>${order.total.toFixed(2)}</strong></span>
              <div className="order-actions">
                <button className="order-action-btn" onClick={() => handleTrackOrder(order.id)}>Track Order</button>
                {order.status === 'delivered' && (
                  <button className="order-action-btn secondary" onClick={() => handleReorder(order)}>Reorder</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAddressesTab = () => (
    <div className="tab-content">
      <div className="tab-header">
        <h2 className="tab-title">Saved Addresses</h2>
        <button className="add-btn" onClick={() => handleOpenAddressModal()}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add New Address
        </button>
      </div>
      <div className="addresses-grid">
        {addresses.map((address) => (
          <div key={address.id} className={`address-card ${address.isDefault ? 'default' : ''}`}>
            {address.isDefault && <span className="default-badge">Default</span>}
            <div className="address-type">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {address.type === 'home' ? (
                  <>
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </>
                ) : address.type === 'work' ? (
                  <>
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                  </>
                ) : (
                  <>
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </>
                )}
              </svg>
              <span>{address.type.charAt(0).toUpperCase() + address.type.slice(1)}</span>
            </div>
            <div className="address-details">
              <p className="address-name">{address.name}</p>
              <p>{address.address}</p>
              <p>{address.city}, {address.state}</p>
              <p>PIN: {address.pincode}</p>
            </div>
            <div className="address-actions">
              <button className="address-action-btn" onClick={() => handleOpenAddressModal(address)}>Edit</button>
              {!address.isDefault && (
                <button className="address-action-btn" onClick={() => handleSetDefaultAddress(address.id)}>Set as Default</button>
              )}
              <button className="address-action-btn delete" onClick={() => handleDeleteAddress(address.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPaymentsTab = () => (
    <div className="tab-content">
      <div className="tab-header">
        <h2 className="tab-title">Payment Methods</h2>
        <button className="add-btn" onClick={handleOpenPaymentModal}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Payment Method
        </button>
      </div>
      <div className="payments-list">
        {paymentMethods.map((method) => (
          <div key={method.id} className={`payment-card ${method.isDefault ? 'default' : ''}`}>
            {method.isDefault && <span className="default-badge">Default</span>}
            <div className="payment-icon">
              {method.type === 'card' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
              ) : method.type === 'upi' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                  <line x1="12" y1="18" x2="12.01" y2="18"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <line x1="3" y1="9" x2="21" y2="9"/>
                  <line x1="9" y1="21" x2="9" y2="9"/>
                </svg>
              )}
            </div>
            <div className="payment-details">
              {method.type === 'card' && (
                <>
                  <span className="payment-brand">{method.cardBrand}</span>
                  <span className="payment-number">•••• •••• •••• {method.last4}</span>
                </>
              )}
              {method.type === 'upi' && (
                <>
                  <span className="payment-brand">UPI</span>
                  <span className="payment-number">{method.upiId}</span>
                </>
              )}
              {method.type === 'netbanking' && (
                <>
                  <span className="payment-brand">Net Banking</span>
                  <span className="payment-number">{method.bankName}</span>
                </>
              )}
            </div>
            <div className="payment-actions">
              <button className="payment-action-btn delete" onClick={() => handleRemovePayment(method.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderWishlistTab = () => (
    <div className="tab-content">
      <h2 className="tab-title">My Wishlist</h2>
      {wishlist.length === 0 ? (
        <div className="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <p>Your wishlist is empty</p>
          <Link href="/store" className="browse-btn">Browse Products</Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((item) => (
            <div key={item.id} className="wishlist-card">
              <button 
                className="wishlist-remove" 
                onClick={() => handleRemoveFromWishlist(item.id)}
                aria-label="Remove from wishlist"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
              <div className="wishlist-image">
                <Image src={item.cover} alt={item.name} width={200} height={200} className="wishlist-img" />
                {!item.inStock && <div className="out-of-stock-overlay">Out of Stock</div>}
              </div>
              <div className="wishlist-details">
                <span className="wishlist-name">{item.name}</span>
                <span className="wishlist-price">${item.price.toFixed(2)}</span>
              </div>
              <button
                className={`add-to-cart-btn ${!item.inStock ? 'disabled' : ''}`}
                disabled={!item.inStock}
                onClick={() => handleAddToCart(item)}
              >
                {item.inStock ? 'Add to Cart' : 'Notify Me'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSettingsTab = () => (
    <div className="tab-content">
      <h2 className="tab-title">Account Settings</h2>
      
      {/* Profile Section */}
      <div className="settings-section">
        <h3 className="settings-section-title">Profile Information</h3>
        <div className="profile-card">
          <div className="profile-avatar">
            <div className="avatar-placeholder">{userInitial}</div>
            <button className="change-avatar-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </button>
          </div>
          {isEditingProfile ? (
            <div className="profile-form">
              <div className="form-group">
                <label htmlFor="profileName">Full Name</label>
                <input
                  id="profileName"
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="profileEmail">Email Address</label>
                <input
                  id="profileEmail"
                  type="email"
                  value={editedEmail}
                  onChange={(e) => setEditedEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
              <div className="form-group">
                <label htmlFor="profilePhone">Phone Number</label>
                <input
                  id="profilePhone"
                  type="tel"
                  value={editedPhone}
                  onChange={(e) => setEditedPhone(e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="profile-actions">
                <button className="save-btn" onClick={handleSaveProfile}>Save Changes</button>
                <button className="cancel-btn" onClick={handleCancelEditProfile}>Cancel</button>
              </div>
            </div>
          ) : (
            <div className="profile-info">
              <div className="profile-field">
                <span className="field-label">Name</span>
                <span className="field-value">{userDisplayName}</span>
              </div>
              <div className="profile-field">
                <span className="field-label">Email</span>
                <span className="field-value">{user.email}</span>
              </div>
              <div className="profile-field">
                <span className="field-label">Phone</span>
                <span className="field-value">{user.phone || 'Not provided'}</span>
              </div>
              <button className="edit-profile-btn" onClick={() => setIsEditingProfile(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Preferences Section */}
      <div className="settings-section">
        <h3 className="settings-section-title">Preferences</h3>
        <div className="preferences-card">
          <div className="preference-item">
            <div className="preference-info">
              <span className="preference-title">Email Notifications</span>
              <span className="preference-desc">Receive order updates and promotions via email</span>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="preference-item">
            <div className="preference-info">
              <span className="preference-title">SMS Notifications</span>
              <span className="preference-desc">Receive order updates via SMS</span>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="preference-item">
            <div className="preference-info">
              <span className="preference-title">Newsletter</span>
              <span className="preference-desc">Subscribe to our weekly newsletter</span>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="settings-section">
        <h3 className="settings-section-title">Security</h3>
        <div className="security-card">
          <button className="security-btn" onClick={handleOpenPasswordModal}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Change Password
          </button>
          <button className="security-btn danger" onClick={handleLogout}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    {
      id: 'orders',
      label: 'Orders',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13"/>
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
          <circle cx="5.5" cy="18.5" r="2.5"/>
          <circle cx="18.5" cy="18.5" r="2.5"/>
        </svg>
      )
    },
    {
      id: 'addresses',
      label: 'Addresses',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      )
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
          <line x1="1" y1="10" x2="23" y2="10"/>
        </svg>
      )
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      )
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      )
    }
  ];

  return (
    <main className={`dashboard-page ${loading ? 'loading' : ''}`}>
      {/* Shutter Animation Panels */}
      <div
        ref={shutterTopRef}
        className="fixed top-0 left-0 w-full h-[50vh] bg-[#0a0a0a] z-[1000] pointer-events-none"
      />
      <div
        ref={shutterBottomRef}
        className="fixed top-[50vh] left-0 w-full h-[50vh] bg-[#0a0a0a] z-[1000] pointer-events-none"
      />

      {/* Header with icons */}
      <header className={`dashboard-header ${showContent ? 'visible' : ''}`}>
        <Link href="/" className="dashboard-header__back icon-bulge" title="Back to Home">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
        </Link>
        <div className="dashboard-header__controls">
          <Link href="/store" className="dashboard-header__icon icon-bulge" title="Store">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <section className={`dashboard-content ${showContent ? 'visible' : ''}`}>
        {/* Page Title */}
        <div className="dashboard-banner">
          <h1 className="dashboard-title__container">
            <span className="dashboard-word-reveal">
              <span className={`dashboard-word-reveal-inner dashboard-word-delay-0 ${titleRevealed ? 'revealed' : ''}`}>
                My Account
              </span>
            </span>
          </h1>
          <p className="dashboard-subtitle">Manage your orders, addresses, and account settings</p>
        </div>

        {/* Dashboard Layout */}
        <div className="dashboard-layout">
          {/* Sidebar Navigation */}
          <nav className="dashboard-sidebar">
            <div className="user-info">
              <div className="user-avatar">
                <div className="user-avatar-placeholder">{userInitial}</div>
              </div>
              <div className="user-details">
                <span className="user-name">{userDisplayName}</span>
                <span className="user-email">{user.email}</span>
              </div>
            </div>
            <ul className="nav-tabs">
              {tabs.map((tab) => (
                <li key={tab.id}>
                  <button
                    className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Main Content Area */}
          <div className="dashboard-main">
            {activeTab === 'orders' && renderOrdersTab()}
            {activeTab === 'addresses' && renderAddressesTab()}
            {activeTab === 'payments' && renderPaymentsTab()}
            {activeTab === 'wishlist' && renderWishlistTab()}
            {activeTab === 'settings' && renderSettingsTab()}
          </div>
        </div>

        {/* Mobile Tab Bar */}
        <nav className="mobile-tab-bar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`mobile-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </section>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="modal-overlay" onClick={() => setShowAddressModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">{editingAddress ? 'Edit Address' : 'Add New Address'}</h2>
            <div className="modal-form">
              <div className="form-group">
                <label>Address Type</label>
                <div className="radio-group">
                  {(['home', 'work', 'other'] as const).map((type) => (
                    <label key={type} className="radio-label">
                      <input
                        type="radio"
                        name="addressType"
                        checked={addressForm.type === type}
                        onChange={() => setAddressForm(prev => ({ ...prev, type }))}
                      />
                      <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={addressForm.name}
                  onChange={(e) => setAddressForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full name"
                />
              </div>
              <div className="form-group">
                <label>Street Address</label>
                <input
                  type="text"
                  value={addressForm.address}
                  onChange={(e) => setAddressForm(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter street address"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="City"
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    value={addressForm.state}
                    onChange={(e) => setAddressForm(prev => ({ ...prev, state: e.target.value }))}
                    placeholder="State"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>PIN Code</label>
                <input
                  type="text"
                  value={addressForm.pincode}
                  onChange={(e) => setAddressForm(prev => ({ ...prev, pincode: e.target.value }))}
                  placeholder="PIN Code"
                  maxLength={6}
                />
              </div>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={addressForm.isDefault}
                  onChange={(e) => setAddressForm(prev => ({ ...prev, isDefault: e.target.checked }))}
                />
                <span>Set as default address</span>
              </label>
            </div>
            <div className="modal-actions">
              <button className="modal-btn secondary" onClick={() => setShowAddressModal(false)}>Cancel</button>
              <button className="modal-btn primary" onClick={handleSaveAddress}>Save Address</button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Add Payment Method</h2>
            <div className="modal-form">
              <div className="form-group">
                <label>Payment Type</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="paymentType"
                      checked={paymentForm.type === 'card'}
                      onChange={() => setPaymentForm(prev => ({ ...prev, type: 'card' }))}
                    />
                    <span>Credit/Debit Card</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="paymentType"
                      checked={paymentForm.type === 'upi'}
                      onChange={() => setPaymentForm(prev => ({ ...prev, type: 'upi' }))}
                    />
                    <span>UPI</span>
                  </label>
                </div>
              </div>
              {paymentForm.type === 'card' ? (
                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    value={paymentForm.cardNumber}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, cardNumber: e.target.value.replace(/\D/g, '').slice(0, 16) }))}
                    placeholder="1234 5678 9012 3456"
                    maxLength={16}
                  />
                </div>
              ) : (
                <div className="form-group">
                  <label>UPI ID</label>
                  <input
                    type="text"
                    value={paymentForm.upiId}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, upiId: e.target.value }))}
                    placeholder="yourname@upi"
                  />
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button className="modal-btn secondary" onClick={() => setShowPaymentModal(false)}>Cancel</button>
              <button className="modal-btn primary" onClick={handleSavePayment}>Add Payment</button>
            </div>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Change Password</h2>
            <div className="modal-form">
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="Enter current password"
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Enter new password"
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm new password"
                />
              </div>
              <p className="password-hint">Password must be at least 8 characters long</p>
            </div>
            <div className="modal-actions">
              <button className="modal-btn secondary" onClick={() => setShowPasswordModal(false)}>Cancel</button>
              <button className="modal-btn primary" onClick={handleChangePassword}>Change Password</button>
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
      <style jsx global>{dashboardStyles}</style>
    </main>
  );
}

const dashboardStyles = `
  /* Dashboard Page Styles */
  .dashboard-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 25%, #ffffff 50%, #f0f0f0 75%, #e5e5e5 100%);
    font-family: sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #111;
    padding-bottom: 80px;
  }

  @media (min-width: 768px) {
    .dashboard-page {
      padding-bottom: 0;
    }
  }

  /* Loading State */
  .dashboard-page.loading::before,
  .dashboard-page.loading::after {
    content: '';
    position: fixed;
    z-index: 1000;
  }

  .dashboard-page.loading::before {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 50%, #e5e5e5 100%);
  }

  .dashboard-page.loading::after {
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

  /* Dashboard Header - Responsive */
  .dashboard-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: clamp(12px, 2vw, 24px) clamp(12px, 2vw, 32px);
    opacity: 0;
    transform: translateY(-20px);
    transition: opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s;
  }

  .dashboard-header.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .dashboard-header__back,
  .dashboard-header__icon {
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
    text-decoration: none;
  }

  .dashboard-header__icon svg,
  .dashboard-header__back svg {
    width: clamp(18px, 2.5vw, 24px);
    height: clamp(18px, 2.5vw, 24px);
  }

  .dashboard-header__controls {
    display: flex;
    align-items: center;
    gap: clamp(8px, 1.5vw, 16px);
  }

  /* Dashboard Content - Responsive padding */
  .dashboard-content {
    padding: clamp(80px, 10vh, 100px) clamp(16px, 4vw, 48px) clamp(40px, 8vh, 80px);
    min-height: 100vh;
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease 0.7s, transform 0.6s ease 0.7s;
  }

  .dashboard-content.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* Dashboard Banner */
  .dashboard-banner {
    text-align: center;
    margin-bottom: clamp(24px, 4vw, 40px);
  }

  .dashboard-title__container {
    font-family: sans-serif;
    font-size: clamp(28px, 6vw, 48px);
    line-height: 1;
    color: #000;
    font-weight: 300;
    letter-spacing: -0.02em;
    margin: 0 0 clamp(8px, 1.5vw, 16px) 0;
  }

  .dashboard-subtitle {
    font-size: clamp(14px, 1.6vw, 16px);
    color: #666;
    margin: 0;
  }

  /* Word by Word Reveal Animation */
  .dashboard-word-reveal {
    display: inline-block;
    overflow: hidden;
    vertical-align: bottom;
  }

  .dashboard-word-reveal-inner {
    display: inline-block;
    transform: translateY(100%);
    opacity: 0;
  }

  .dashboard-word-reveal-inner.revealed {
    transform: translateY(0);
    opacity: 1;
  }

  .dashboard-word-delay-0 {
    transition: transform 1s cubic-bezier(0.23, 1, 0.32, 1) 0.2s,
                opacity 0.8s ease-out 0.2s;
  }

  /* Dashboard Layout */
  .dashboard-layout {
    display: grid;
    grid-template-columns: clamp(200px, 25vw, 280px) 1fr;
    gap: clamp(20px, 3vw, 32px);
    max-width: 1400px;
    margin: 0 auto;
  }

  /* Sidebar */
  .dashboard-sidebar {
    background: #fff;
    border-radius: clamp(12px, 1.5vw, 16px);
    padding: clamp(20px, 3vw, 28px);
    height: fit-content;
    position: sticky;
    top: 100px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: clamp(10px, 1.5vw, 14px);
    padding-bottom: clamp(16px, 2vw, 20px);
    border-bottom: 1px solid #eee;
    margin-bottom: clamp(16px, 2vw, 20px);
  }

  .user-avatar {
    width: clamp(40px, 5vw, 48px);
    height: clamp(40px, 5vw, 48px);
    border-radius: 50%;
    overflow: hidden;
    background: #f5f5f5;
    flex-shrink: 0;
  }

  .user-avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .user-avatar-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #4A90D9 0%, #357abd 100%);
    color: #fff;
    font-size: clamp(16px, 2vw, 20px);
    font-weight: 600;
  }

  .user-details {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .user-name {
    font-size: clamp(14px, 1.6vw, 16px);
    font-weight: 600;
    color: #000;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .user-email {
    font-size: clamp(11px, 1.2vw, 13px);
    color: #666;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .nav-tabs {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .nav-tab {
    display: flex;
    align-items: center;
    gap: clamp(10px, 1.2vw, 12px);
    width: 100%;
    padding: clamp(10px, 1.5vw, 14px) clamp(12px, 1.5vw, 16px);
    border: none;
    background: transparent;
    border-radius: clamp(8px, 1vw, 10px);
    font-size: clamp(13px, 1.4vw, 15px);
    color: #444;
    cursor: pointer;
    transition: all 0.2s ease;
    min-height: 44px;
  }

  .nav-tab:hover {
    background: #f5f5f5;
  }

  .nav-tab.active {
    background: #111;
    color: #fff;
  }

  .nav-tab svg {
    width: clamp(18px, 2vw, 20px);
    height: clamp(18px, 2vw, 20px);
    flex-shrink: 0;
  }

  /* Main Content Area */
  .dashboard-main {
    background: #fff;
    border-radius: clamp(12px, 1.5vw, 16px);
    padding: clamp(20px, 3vw, 32px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    min-height: 500px;
  }

  /* Tab Content */
  .tab-content {
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .tab-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: clamp(12px, 2vw, 16px);
    margin-bottom: clamp(16px, 2.5vw, 24px);
  }

  .tab-title {
    font-size: clamp(18px, 2.2vw, 22px);
    font-weight: 500;
    color: #000;
    margin: 0;
  }

  .add-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: clamp(10px, 1.2vw, 12px) clamp(16px, 2vw, 20px);
    background: #111;
    color: #fff;
    border: none;
    border-radius: 50px;
    font-size: clamp(13px, 1.4vw, 14px);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    min-height: 44px;
  }

  .add-btn:hover {
    background: #333;
    transform: translateY(-2px);
  }

  /* Orders Tab */
  .orders-list {
    display: flex;
    flex-direction: column;
    gap: clamp(16px, 2vw, 20px);
  }

  .order-card {
    background: #fafafa;
    border-radius: clamp(10px, 1.2vw, 12px);
    padding: clamp(16px, 2vw, 20px);
    border: 1px solid #eee;
  }

  .order-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: clamp(8px, 1vw, 12px);
    margin-bottom: clamp(12px, 1.5vw, 16px);
    padding-bottom: clamp(12px, 1.5vw, 16px);
    border-bottom: 1px solid #eee;
  }

  .order-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .order-id {
    font-size: clamp(14px, 1.6vw, 16px);
    font-weight: 600;
    color: #000;
    font-family: monospace;
  }

  .order-date {
    font-size: clamp(12px, 1.3vw, 13px);
    color: #666;
  }

  .order-status {
    padding: clamp(4px, 0.5vw, 6px) clamp(10px, 1.2vw, 14px);
    border-radius: 50px;
    font-size: clamp(11px, 1.2vw, 13px);
    font-weight: 500;
  }

  .order-items {
    display: flex;
    flex-direction: column;
    gap: clamp(10px, 1.2vw, 12px);
    margin-bottom: clamp(12px, 1.5vw, 16px);
  }

  .order-item {
    display: flex;
    align-items: center;
    gap: clamp(10px, 1.2vw, 14px);
  }

  .order-item__image {
    position: relative;
    width: clamp(50px, 6vw, 60px);
    height: clamp(50px, 6vw, 60px);
    border-radius: clamp(6px, 0.8vw, 8px);
    overflow: hidden;
    flex-shrink: 0;
    background: #eee;
  }

  .order-item__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .order-item__quantity {
    position: absolute;
    top: -4px;
    right: -4px;
    width: clamp(18px, 2vw, 20px);
    height: clamp(18px, 2vw, 20px);
    background: #111;
    color: #fff;
    border-radius: 50%;
    font-size: clamp(10px, 1.1vw, 11px);
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .order-item__details {
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

  .order-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: clamp(10px, 1.5vw, 16px);
    padding-top: clamp(12px, 1.5vw, 16px);
    border-top: 1px solid #eee;
  }

  .order-total {
    font-size: clamp(14px, 1.5vw, 15px);
    color: #444;
  }

  .order-total strong {
    color: #000;
    font-weight: 600;
  }

  .order-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .order-action-btn {
    padding: clamp(8px, 1vw, 10px) clamp(14px, 1.8vw, 18px);
    background: #111;
    color: #fff;
    border: none;
    border-radius: 50px;
    font-size: clamp(12px, 1.3vw, 13px);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    min-height: 36px;
  }

  .order-action-btn:hover {
    background: #333;
  }

  .order-action-btn.secondary {
    background: #fff;
    color: #111;
    border: 1px solid #111;
  }

  .order-action-btn.secondary:hover {
    background: #111;
    color: #fff;
  }

  /* Addresses Tab */
  .addresses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: clamp(16px, 2vw, 20px);
  }

  .address-card {
    background: #fafafa;
    border-radius: clamp(10px, 1.2vw, 12px);
    padding: clamp(16px, 2vw, 20px);
    border: 1px solid #eee;
    position: relative;
  }

  .address-card.default {
    border-color: #111;
  }

  .default-badge {
    position: absolute;
    top: clamp(12px, 1.5vw, 16px);
    right: clamp(12px, 1.5vw, 16px);
    background: #111;
    color: #fff;
    padding: 4px 10px;
    border-radius: 50px;
    font-size: clamp(10px, 1.1vw, 11px);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .address-type {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: clamp(12px, 1.5vw, 16px);
    color: #666;
    font-size: clamp(12px, 1.3vw, 13px);
  }

  .address-type svg {
    width: clamp(16px, 1.8vw, 18px);
    height: clamp(16px, 1.8vw, 18px);
  }

  .address-details {
    font-size: clamp(13px, 1.4vw, 14px);
    line-height: 1.6;
    color: #444;
    margin-bottom: clamp(16px, 2vw, 20px);
  }

  .address-details .address-name {
    font-weight: 600;
    color: #000;
    margin-bottom: 4px;
  }

  .address-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .address-action-btn {
    padding: clamp(6px, 0.8vw, 8px) clamp(12px, 1.5vw, 16px);
    background: transparent;
    color: #111;
    border: 1px solid #ddd;
    border-radius: 50px;
    font-size: clamp(11px, 1.2vw, 12px);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    min-height: 32px;
  }

  .address-action-btn:hover {
    background: #f5f5f5;
    border-color: #111;
  }

  .address-action-btn.delete {
    color: #ef4444;
    border-color: #fecaca;
  }

  .address-action-btn.delete:hover {
    background: #fef2f2;
    border-color: #ef4444;
  }

  /* Payments Tab */
  .payments-list {
    display: flex;
    flex-direction: column;
    gap: clamp(12px, 1.5vw, 16px);
  }

  .payment-card {
    display: flex;
    align-items: center;
    gap: clamp(14px, 2vw, 20px);
    background: #fafafa;
    border-radius: clamp(10px, 1.2vw, 12px);
    padding: clamp(16px, 2vw, 20px);
    border: 1px solid #eee;
    position: relative;
  }

  .payment-card.default {
    border-color: #111;
  }

  .payment-icon {
    width: clamp(48px, 6vw, 56px);
    height: clamp(48px, 6vw, 56px);
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    border-radius: clamp(8px, 1vw, 10px);
    border: 1px solid #eee;
    color: #666;
    flex-shrink: 0;
  }

  .payment-icon svg {
    width: clamp(24px, 3vw, 32px);
    height: clamp(24px, 3vw, 32px);
  }

  .payment-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .payment-brand {
    font-size: clamp(14px, 1.5vw, 15px);
    font-weight: 600;
    color: #000;
  }

  .payment-number {
    font-size: clamp(13px, 1.4vw, 14px);
    color: #666;
    font-family: monospace;
  }

  .payment-actions {
    display: flex;
    gap: 8px;
  }

  .payment-action-btn {
    padding: clamp(6px, 0.8vw, 8px) clamp(12px, 1.5vw, 16px);
    background: transparent;
    color: #111;
    border: 1px solid #ddd;
    border-radius: 50px;
    font-size: clamp(11px, 1.2vw, 12px);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    min-height: 32px;
  }

  .payment-action-btn:hover {
    background: #f5f5f5;
    border-color: #111;
  }

  .payment-action-btn.delete {
    color: #ef4444;
    border-color: #fecaca;
  }

  .payment-action-btn.delete:hover {
    background: #fef2f2;
    border-color: #ef4444;
  }

  /* Wishlist Tab */
  .wishlist-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: clamp(16px, 2vw, 20px);
  }

  .wishlist-card {
    background: #fafafa;
    border-radius: clamp(10px, 1.2vw, 12px);
    overflow: hidden;
    border: 1px solid #eee;
    position: relative;
  }

  .wishlist-remove {
    position: absolute;
    top: clamp(8px, 1vw, 10px);
    right: clamp(8px, 1vw, 10px);
    z-index: 10;
    width: clamp(28px, 3.5vw, 32px);
    height: clamp(28px, 3.5vw, 32px);
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #999;
    min-width: 44px;
    min-height: 44px;
  }

  .wishlist-remove:hover {
    background: #fff;
    color: #ef4444;
  }

  .wishlist-image {
    position: relative;
    aspect-ratio: 1;
    background: #eee;
  }

  .wishlist-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .out-of-stock-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: clamp(12px, 1.4vw, 14px);
    font-weight: 600;
  }

  .wishlist-details {
    padding: clamp(12px, 1.5vw, 16px);
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .wishlist-name {
    font-size: clamp(13px, 1.4vw, 14px);
    font-weight: 500;
    color: #000;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .wishlist-price {
    font-size: clamp(14px, 1.5vw, 15px);
    font-weight: 600;
    color: #E8A87C;
  }

  .add-to-cart-btn {
    width: calc(100% - clamp(16px, 2vw, 24px));
    margin: 0 auto clamp(12px, 1.5vw, 16px);
    padding: clamp(10px, 1.2vw, 12px);
    background: #111;
    color: #fff;
    border: none;
    border-radius: 50px;
    font-size: clamp(12px, 1.3vw, 13px);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    min-height: 40px;
  }

  .add-to-cart-btn:hover:not(.disabled) {
    background: #333;
  }

  .add-to-cart-btn.disabled {
    background: #ddd;
    color: #999;
    cursor: not-allowed;
  }

  /* Empty State */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: clamp(40px, 6vw, 80px) clamp(20px, 3vw, 40px);
    text-align: center;
    color: #999;
  }

  .empty-state svg {
    width: clamp(48px, 8vw, 64px);
    height: clamp(48px, 8vw, 64px);
    margin-bottom: clamp(16px, 2vw, 24px);
  }

  .empty-state p {
    font-size: clamp(14px, 1.6vw, 16px);
    margin: 0 0 clamp(16px, 2vw, 24px) 0;
  }

  .browse-btn {
    padding: clamp(12px, 1.5vw, 14px) clamp(24px, 3vw, 32px);
    background: #111;
    color: #fff;
    border: none;
    border-radius: 50px;
    font-size: clamp(13px, 1.4vw, 14px);
    font-weight: 500;
    text-decoration: none;
    transition: all 0.3s ease;
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .browse-btn:hover {
    background: #333;
    transform: translateY(-2px);
  }

  /* Settings Tab */
  .settings-section {
    margin-bottom: clamp(24px, 3vw, 32px);
  }

  .settings-section:last-child {
    margin-bottom: 0;
  }

  .settings-section-title {
    font-size: clamp(15px, 1.7vw, 17px);
    font-weight: 600;
    color: #000;
    margin: 0 0 clamp(12px, 1.5vw, 16px) 0;
  }

  /* Profile Card */
  .profile-card {
    background: #fafafa;
    border-radius: clamp(10px, 1.2vw, 12px);
    padding: clamp(20px, 2.5vw, 28px);
    border: 1px solid #eee;
    display: flex;
    gap: clamp(20px, 3vw, 32px);
    align-items: flex-start;
  }

  .profile-avatar {
    position: relative;
    width: clamp(60px, 8vw, 80px);
    height: clamp(60px, 8vw, 80px);
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
    background: #eee;
  }

  .avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .avatar-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #4A90D9 0%, #357abd 100%);
    color: #fff;
    font-size: clamp(24px, 3vw, 32px);
    font-weight: 600;
    border-radius: 50%;
  }

  .change-avatar-btn {
    position: absolute;
    bottom: 0;
    right: 0;
    width: clamp(28px, 3.5vw, 32px);
    height: clamp(28px, 3.5vw, 32px);
    display: flex;
    align-items: center;
    justify-content: center;
    background: #111;
    color: #fff;
    border: 2px solid #fff;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 44px;
    min-height: 44px;
  }

  .change-avatar-btn:hover {
    background: #333;
  }

  .profile-info,
  .profile-form {
    flex: 1;
  }

  .profile-field {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-bottom: clamp(12px, 1.5vw, 16px);
  }

  .profile-field:last-child {
    margin-bottom: clamp(16px, 2vw, 20px);
  }

  .field-label {
    font-size: clamp(11px, 1.2vw, 12px);
    color: #999;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .field-value {
    font-size: clamp(14px, 1.5vw, 15px);
    color: #000;
    font-weight: 500;
  }

  .edit-profile-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: clamp(10px, 1.2vw, 12px) clamp(18px, 2.2vw, 24px);
    background: #111;
    color: #fff;
    border: none;
    border-radius: 50px;
    font-size: clamp(13px, 1.4vw, 14px);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    min-height: 44px;
  }

  .edit-profile-btn:hover {
    background: #333;
  }

  /* Profile Form */
  .form-group {
    margin-bottom: clamp(16px, 2vw, 20px);
  }

  .form-group label {
    display: block;
    font-size: clamp(12px, 1.3vw, 13px);
    color: #666;
    margin-bottom: 6px;
  }

  .form-group input {
    width: 100%;
    padding: clamp(10px, 1.2vw, 12px) clamp(14px, 1.8vw, 18px);
    border: 1px solid #ddd;
    border-radius: clamp(8px, 1vw, 10px);
    font-size: clamp(14px, 1.5vw, 15px);
    color: #000;
    background: #fff;
    transition: all 0.2s ease;
    min-height: 44px;
  }

  .form-group input:focus {
    outline: none;
    border-color: #111;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
  }

  .profile-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .save-btn,
  .cancel-btn {
    padding: clamp(10px, 1.2vw, 12px) clamp(20px, 2.5vw, 28px);
    border-radius: 50px;
    font-size: clamp(13px, 1.4vw, 14px);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    min-height: 44px;
  }

  .save-btn {
    background: #111;
    color: #fff;
    border: none;
  }

  .save-btn:hover {
    background: #333;
  }

  .cancel-btn {
    background: #fff;
    color: #111;
    border: 1px solid #111;
  }

  .cancel-btn:hover {
    background: #f5f5f5;
  }

  /* Preferences Card */
  .preferences-card {
    background: #fafafa;
    border-radius: clamp(10px, 1.2vw, 12px);
    border: 1px solid #eee;
    overflow: hidden;
  }

  .preference-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: clamp(14px, 1.8vw, 18px) clamp(16px, 2vw, 20px);
    border-bottom: 1px solid #eee;
  }

  .preference-item:last-child {
    border-bottom: none;
  }

  .preference-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .preference-title {
    font-size: clamp(13px, 1.4vw, 14px);
    font-weight: 500;
    color: #000;
  }

  .preference-desc {
    font-size: clamp(11px, 1.2vw, 12px);
    color: #666;
  }

  /* Toggle Switch */
  .toggle-switch {
    position: relative;
    display: inline-block;
    width: clamp(44px, 5vw, 52px);
    height: clamp(24px, 3vw, 28px);
    flex-shrink: 0;
  }

  .toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .toggle-slider {
    position: absolute;
    cursor: pointer;
    inset: 0;
    background-color: #ddd;
    border-radius: 50px;
    transition: all 0.3s ease;
  }

  .toggle-slider::before {
    position: absolute;
    content: "";
    height: calc(100% - 6px);
    aspect-ratio: 1;
    left: 3px;
    bottom: 3px;
    background-color: white;
    border-radius: 50%;
    transition: all 0.3s ease;
  }

  .toggle-switch input:checked + .toggle-slider {
    background-color: #22c55e;
  }

  .toggle-switch input:checked + .toggle-slider::before {
    transform: translateX(calc(100% + 2px));
  }

  /* Security Card */
  .security-card {
    background: #fafafa;
    border-radius: clamp(10px, 1.2vw, 12px);
    padding: clamp(16px, 2vw, 20px);
    border: 1px solid #eee;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .security-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: clamp(12px, 1.5vw, 14px) clamp(20px, 2.5vw, 28px);
    background: #fff;
    color: #111;
    border: 1px solid #ddd;
    border-radius: 50px;
    font-size: clamp(13px, 1.4vw, 14px);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    min-height: 44px;
  }

  .security-btn:hover {
    background: #f5f5f5;
    border-color: #111;
  }

  .security-btn.danger {
    color: #ef4444;
    border-color: #fecaca;
  }

  .security-btn.danger:hover {
    background: #fef2f2;
    border-color: #ef4444;
  }

  /* Mobile Tab Bar */
  .mobile-tab-bar {
    display: none;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
    padding: clamp(8px, 1.5vw, 12px) clamp(8px, 2vw, 16px);
    z-index: 1000;
    gap: 4px;
  }

  .mobile-tab {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: clamp(8px, 1.2vw, 10px) clamp(4px, 1vw, 8px);
    background: transparent;
    border: none;
    border-radius: clamp(8px, 1vw, 10px);
    color: #666;
    cursor: pointer;
    transition: all 0.2s ease;
    min-height: 44px;
  }

  .mobile-tab:hover {
    background: #f5f5f5;
  }

  .mobile-tab.active {
    color: #111;
    background: #f0f0f0;
  }

  .mobile-tab svg {
    width: clamp(18px, 3vw, 22px);
    height: clamp(18px, 3vw, 22px);
  }

  .mobile-tab span {
    font-size: clamp(10px, 1.5vw, 11px);
    font-weight: 500;
  }

  /* ===== TABLET BREAKPOINT (768px - 1023px) ===== */
  @media (max-width: 1023px) {
    .dashboard-layout {
      grid-template-columns: clamp(180px, 22vw, 220px) 1fr;
    }

    .addresses-grid {
      grid-template-columns: 1fr;
    }

    .profile-card {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .profile-info,
    .profile-form {
      width: 100%;
    }

    .profile-field {
      align-items: center;
    }

    .profile-actions {
      justify-content: center;
    }

    .edit-profile-btn {
      margin: 0 auto;
    }
  }

  /* ===== MOBILE BREAKPOINT (<768px) ===== */
  @media (max-width: 767px) {
    .dashboard-layout {
      grid-template-columns: 1fr;
    }

    .dashboard-sidebar {
      display: none;
    }

    .mobile-tab-bar {
      display: flex;
    }

    .dashboard-main {
      border-radius: clamp(12px, 2vw, 16px) clamp(12px, 2vw, 16px) 0 0;
      padding-bottom: 100px;
    }

    .payment-card {
      flex-wrap: wrap;
    }

    .payment-actions {
      width: 100%;
      margin-top: 8px;
    }

    .wishlist-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: clamp(10px, 2vw, 14px);
    }

    .security-card {
      flex-direction: column;
    }

    .security-btn {
      width: 100%;
      justify-content: center;
    }

    .tab-header {
      flex-direction: column;
      align-items: stretch;
    }

    .add-btn {
      width: 100%;
      justify-content: center;
    }
  }

  /* ===== SMALL MOBILE (<400px) ===== */
  @media (max-width: 399px) {
    .wishlist-grid {
      grid-template-columns: 1fr;
    }

    .mobile-tab span {
      display: none;
    }

    .mobile-tab {
      padding: clamp(10px, 2vw, 14px);
    }

    .order-actions {
      flex-direction: column;
      width: 100%;
    }

    .order-action-btn {
      width: 100%;
      text-align: center;
    }
  }

  /* Modal Styles */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    padding: 20px;
  }

  .modal-content {
    background: #fff;
    border-radius: clamp(12px, 2vw, 16px);
    padding: clamp(24px, 4vw, 32px);
    max-width: 480px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  }

  .modal-title {
    font-size: clamp(18px, 2.5vw, 22px);
    font-weight: 600;
    color: #000;
    margin: 0 0 clamp(20px, 3vw, 24px) 0;
  }

  .modal-form {
    display: flex;
    flex-direction: column;
    gap: clamp(16px, 2vw, 20px);
  }

  .modal-form .form-group {
    margin-bottom: 0;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: clamp(12px, 2vw, 16px);
  }

  .radio-group {
    display: flex;
    gap: clamp(16px, 2vw, 24px);
    flex-wrap: wrap;
  }

  .radio-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: clamp(13px, 1.5vw, 14px);
    color: #444;
  }

  .radio-label input[type="radio"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    font-size: clamp(13px, 1.5vw, 14px);
    color: #444;
  }

  .checkbox-label input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }

  .modal-actions {
    display: flex;
    gap: 12px;
    margin-top: clamp(24px, 3vw, 32px);
    justify-content: flex-end;
  }

  .modal-btn {
    padding: clamp(12px, 1.5vw, 14px) clamp(24px, 3vw, 32px);
    border-radius: 50px;
    font-size: clamp(13px, 1.5vw, 14px);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    min-height: 44px;
  }

  .modal-btn.primary {
    background: #111;
    color: #fff;
    border: none;
  }

  .modal-btn.primary:hover {
    background: #333;
  }

  .modal-btn.secondary {
    background: #fff;
    color: #111;
    border: 1px solid #ddd;
  }

  .modal-btn.secondary:hover {
    background: #f5f5f5;
    border-color: #111;
  }

  .password-hint {
    font-size: clamp(11px, 1.2vw, 12px);
    color: #666;
    margin: 0;
  }

  @media (max-width: 480px) {
    .form-row {
      grid-template-columns: 1fr;
    }

    .modal-actions {
      flex-direction: column-reverse;
    }

    .modal-btn {
      width: 100%;
      text-align: center;
    }
  }
`;

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="dashboard-page loading">
        <div className="fixed top-0 left-0 w-full h-[50vh] bg-[#0a0a0a] z-[1000]" />
        <div className="fixed top-[50vh] left-0 w-full h-[50vh] bg-[#0a0a0a] z-[1000]" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}