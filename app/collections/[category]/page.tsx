'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { gsap } from 'gsap';

// Mock products data with categories
const allProducts = [
  { id: 'product-01', name: 'Product-1', price: 299, originalPrice: 350, discount: 15, cover: '/images/1.jpg', category: 'electronics', subcategory: 'audio', rating: 4.5, reviews: 32 },
  { id: 'product-02', name: 'Electric Kettle', price: 149, originalPrice: 180, discount: 17, cover: '/images/2.jpg', category: 'kitchen', subcategory: 'appliances', rating: 4.8, reviews: 56 },
  { id: 'product-03', name: 'Air Fryer Deluxe', price: 199, originalPrice: 250, discount: 20, cover: '/images/3.jpg', category: 'kitchen', subcategory: 'appliances', rating: 4.7, reviews: 89 },
  { id: 'product-04', name: 'Coffee Maker', price: 179, originalPrice: 220, discount: 18, cover: '/images/4.jpg', category: 'kitchen', subcategory: 'appliances', rating: 4.6, reviews: 45 },
  { id: 'product-05', name: 'Toaster Elite', price: 89, originalPrice: 110, discount: 19, cover: '/images/5.jpg', category: 'kitchen', subcategory: 'appliances', rating: 4.4, reviews: 28 },
  { id: 'product-06', name: 'Food Processor', price: 249, originalPrice: 299, discount: 17, cover: '/images/6.jpg', category: 'kitchen', subcategory: 'appliances', rating: 4.9, reviews: 112 },
  { id: 'product-07', name: 'Blender Pro', price: 129, originalPrice: 160, discount: 19, cover: '/images/7.jpg', category: 'kitchen', subcategory: 'appliances', rating: 4.5, reviews: 67 },
  { id: 'product-08', name: 'Rice Cooker', price: 99, originalPrice: 130, discount: 24, cover: '/images/8.jpg', category: 'kitchen', subcategory: 'appliances', rating: 4.6, reviews: 34 },
  { id: 'product-09', name: 'Microwave Oven', price: 199, originalPrice: 240, discount: 17, cover: '/images/9.jpg', category: 'electronics', subcategory: 'appliances', rating: 4.3, reviews: 78 },
  { id: 'product-10', name: 'Stand Mixer', price: 349, originalPrice: 420, discount: 17, cover: '/images/10.jpg', category: 'kitchen', subcategory: 'appliances', rating: 4.8, reviews: 156 },
  { id: 'product-11', name: 'Wireless Headphones', price: 199, originalPrice: 249, discount: 20, cover: '/images/11.jpg', category: 'electronics', subcategory: 'audio', rating: 4.7, reviews: 234 },
  { id: 'product-12', name: 'Smart Watch', price: 299, originalPrice: 349, discount: 14, cover: '/images/12.jpg', category: 'electronics', subcategory: 'wearables', rating: 4.6, reviews: 189 },
  { id: 'product-13', name: 'Portable Speaker', price: 79, originalPrice: 99, discount: 20, cover: '/images/13.jpg', category: 'electronics', subcategory: 'audio', rating: 4.4, reviews: 145 },
  { id: 'product-14', name: 'Tablet Stand', price: 39, originalPrice: 49, discount: 20, cover: '/images/14.jpg', category: 'accessories', subcategory: 'stands', rating: 4.3, reviews: 67 },
  { id: 'product-15', name: 'USB Hub', price: 29, originalPrice: 39, discount: 26, cover: '/images/15.jpg', category: 'accessories', subcategory: 'cables', rating: 4.5, reviews: 98 },
];

// Category definitions
const categories: Record<string, { name: string; description: string; banner: string; subcategories: string[] }> = {
  'kitchen': {
    name: 'Kitchen',
    description: 'Discover our collection of premium kitchen appliances and tools to make cooking a breeze.',
    banner: '/images/1.jpg',
    subcategories: ['appliances', 'cookware', 'tools'],
  },
  'electronics': {
    name: 'Electronics',
    description: 'Explore the latest in technology with our selection of electronics and gadgets.',
    banner: '/images/11.jpg',
    subcategories: ['audio', 'wearables', 'appliances'],
  },
  'accessories': {
    name: 'Accessories',
    description: 'Complete your setup with our range of quality accessories.',
    banner: '/images/14.jpg',
    subcategories: ['stands', 'cables', 'cases'],
  },
  'new-arrivals': {
    name: 'New Arrivals',
    description: 'Check out the latest products we have added to our collection.',
    banner: '/images/3.jpg',
    subcategories: [],
  },
  'sale': {
    name: 'On Sale',
    description: 'Great deals and discounts on selected items. Limited time offers!',
    banner: '/images/6.jpg',
    subcategories: [],
  },
};

const sortOptions = [
  { id: 'featured', name: 'Featured' },
  { id: 'price-low', name: 'Price: Low to High' },
  { id: 'price-high', name: 'Price: High to Low' },
  { id: 'rating', name: 'Highest Rated' },
  { id: 'newest', name: 'Newest' },
];

export default function CollectionPage() {
  const router = useRouter();
  const params = useParams();
  const category = params.category as string;
  
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [selectedSort, setSelectedSort] = useState('featured');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const shutterTopRef = useRef<HTMLDivElement>(null);
  const shutterBottomRef = useRef<HTMLDivElement>(null);

  const categoryInfo = categories[category] || {
    name: category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' '),
    description: 'Browse our collection of quality products.',
    banner: '/images/1.jpg',
    subcategories: [],
  };

  // Filter and sort products based on category using useMemo
  const products = React.useMemo(() => {
    let filtered = [...allProducts];

    // Filter by category
    if (category === 'new-arrivals') {
      // Show last 5 products as "new"
      filtered = filtered.slice(-5);
    } else if (category === 'sale') {
      // Show products with discount > 18%
      filtered = filtered.filter(p => p.discount > 18);
    } else {
      filtered = filtered.filter(p => p.category === category);
    }

    // Filter by subcategory
    if (selectedSubcategory) {
      filtered = filtered.filter(p => p.subcategory === selectedSubcategory);
    }

    // Sort products
    switch (selectedSort) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.reverse();
        break;
      default:
        // Featured - keep original order
        break;
    }

    return filtered;
  }, [category, selectedSort, selectedSubcategory]);

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

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= rating ? 'filled' : ''}`}>★</span>
      );
    }
    return stars;
  };

  return (
    <main className={`collection-page ${loading ? 'loading' : ''}`}>
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
        className={`collection-back-btn ${showContent ? 'visible' : ''}`}
        onClick={() => router.back()}
        title="Go Back"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12 19 5 12 12 5"/>
        </svg>
      </button>

      {/* Header */}
      <header className={`collection-header ${showContent ? 'visible' : ''}`}>
        <div className="collection-header__controls">
          <Link href="/" className="collection-header__icon icon-bulge" title="Home">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </Link>
          <Link href="/store" className="collection-header__icon icon-bulge" title="Store">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </Link>
        </div>
      </header>

      {/* Banner */}
      <section className={`collection-banner ${showContent ? 'visible' : ''}`}>
        <div className="collection-banner__image">
          <Image
            src={categoryInfo.banner}
            alt={categoryInfo.name}
            fill
            className="collection-banner__img"
            priority
          />
          <div className="collection-banner__overlay" />
        </div>
        <div className="collection-banner__content">
          <h1 className="collection-banner__title">{categoryInfo.name}</h1>
          <p className="collection-banner__description">{categoryInfo.description}</p>
        </div>
      </section>

      {/* Main Content */}
      <section className={`collection-content ${showContent ? 'visible' : ''}`}>
        {/* Breadcrumb */}
        <nav className="collection-breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/store">Store</Link>
          <span>/</span>
          <span className="current">{categoryInfo.name}</span>
        </nav>

        {/* Controls Bar */}
        <div className="collection-controls">
          <div className="collection-controls__left">
            <span className="collection-count">{products.length} products</span>
            
            {/* Subcategory Filter */}
            {categoryInfo.subcategories.length > 0 && (
              <div className="collection-subcategories">
                <button
                  className={`collection-subcategory ${!selectedSubcategory ? 'active' : ''}`}
                  onClick={() => setSelectedSubcategory(null)}
                >
                  All
                </button>
                {categoryInfo.subcategories.map(sub => (
                  <button
                    key={sub}
                    className={`collection-subcategory ${selectedSubcategory === sub ? 'active' : ''}`}
                    onClick={() => setSelectedSubcategory(sub)}
                  >
                    {sub.charAt(0).toUpperCase() + sub.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="collection-controls__right">
            {/* View Mode Toggle */}
            <div className="collection-view-toggle">
              <button 
                className={`collection-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                </svg>
              </button>
              <button 
                className={`collection-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6"/>
                  <line x1="8" y1="12" x2="21" y2="12"/>
                  <line x1="8" y1="18" x2="21" y2="18"/>
                  <line x1="3" y1="6" x2="3.01" y2="6"/>
                  <line x1="3" y1="12" x2="3.01" y2="12"/>
                  <line x1="3" y1="18" x2="3.01" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Sort Dropdown */}
            <select 
              className="collection-sort-select"
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
            >
              {sortOptions.map(option => (
                <option key={option.id} value={option.id}>{option.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid/List */}
        <div className="collection-products-wrapper">
          {products.length === 0 ? (
            <div className="collection-no-products">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <h2>No products found</h2>
              <p>Try selecting a different subcategory or browse our other collections.</p>
              <Link href="/store" className="collection-browse-all">
                Browse All Products
              </Link>
            </div>
          ) : (
            <div className={`collection-products ${viewMode}`}>
              {products.map(product => (
                <Link 
                  key={product.id} 
                  href={`/store?product=${product.id}`}
                  className="collection-product"
                >
                  <div className="collection-product__image">
                    <Image
                      src={product.cover}
                      alt={product.name}
                      fill
                      className="collection-product__img"
                    />
                    <span className="collection-product__discount">-{product.discount}%</span>
                  </div>
                  <div className="collection-product__info">
                    <h3 className="collection-product__name">{product.name}</h3>
                    <div className="collection-product__rating">
                      {renderStars(Math.floor(product.rating))}
                      <span className="collection-product__reviews">({product.reviews})</span>
                    </div>
                    <div className="collection-product__price">
                      <span className="collection-product__original">${product.originalPrice}</span>
                      <span className="collection-product__current">${product.price}</span>
                    </div>
                    {viewMode === 'list' && (
                      <button className="collection-product__add-btn">
                        Add to Cart
                      </button>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Related Collections */}
        <div className="collection-related">
          <h2>Browse Other Collections</h2>
          <div className="collection-related__grid">
            {Object.entries(categories)
              .filter(([key]) => key !== category)
              .slice(0, 4)
              .map(([key, cat]) => (
                <Link key={key} href={`/collections/${key}`} className="collection-related__item">
                  <div className="collection-related__image">
                    <Image
                      src={cat.banner}
                      alt={cat.name}
                      fill
                      className="collection-related__img"
                    />
                    <div className="collection-related__overlay" />
                  </div>
                  <span className="collection-related__name">{cat.name}</span>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Styles */}
      <style jsx global>{`
        .collection-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 25%, #ffffff 50%, #f0f0f0 75%, #e5e5e5 100%);
          font-family: sans-serif;
          -webkit-font-smoothing: antialiased;
          color: #111;
        }

        .collection-page.loading::before,
        .collection-page.loading::after {
          content: '';
          position: fixed;
          z-index: 1000;
        }

        .collection-page.loading::before {
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 50%, #e5e5e5 100%);
        }

        .collection-page.loading::after {
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

        .collection-back-btn {
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

        .collection-back-btn.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .collection-header {
          position: fixed;
          top: 0;
          right: 0;
          z-index: 1000;
          padding: clamp(12px, 2vw, 24px) clamp(12px, 2vw, 32px);
          opacity: 0;
          transform: translateY(-20px);
          transition: opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s;
        }

        .collection-header.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .collection-header__controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .collection-header__icon {
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

        .collection-banner {
          position: relative;
          height: clamp(250px, 40vh, 400px);
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s;
        }

        .collection-banner.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .collection-banner__image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .collection-banner__img {
          object-fit: cover;
        }

        .collection-banner__overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.3) 0%,
            rgba(0, 0, 0, 0.5) 50%,
            rgba(0, 0, 0, 0.7) 100%
          );
        }

        .collection-banner__content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: clamp(24px, 4vw, 48px);
          color: #fff;
        }

        .collection-banner__title {
          font-size: clamp(32px, 5vw, 56px);
          font-weight: 300;
          margin: 0 0 12px 0;
          letter-spacing: -0.02em;
        }

        .collection-banner__description {
          font-size: clamp(14px, 1.6vw, 18px);
          margin: 0;
          opacity: 0.9;
          max-width: 600px;
        }

        .collection-content {
          padding: clamp(24px, 4vw, 48px);
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease 0.7s, transform 0.6s ease 0.7s;
        }

        .collection-content.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .collection-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #666;
          margin-bottom: 24px;
        }

        .collection-breadcrumb a {
          color: #666;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .collection-breadcrumb a:hover {
          color: #111;
        }

        .collection-breadcrumb .current {
          color: #111;
          font-weight: 500;
        }

        .collection-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: clamp(24px, 3vw, 32px);
          padding-bottom: 20px;
          border-bottom: 1px solid #e5e5e5;
        }

        .collection-controls__left {
          display: flex;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
        }

        .collection-count {
          font-size: 15px;
          color: #666;
        }

        .collection-subcategories {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .collection-subcategory {
          padding: 8px 16px;
          background: transparent;
          border: 1px solid #ddd;
          border-radius: 20px;
          font-size: 13px;
          color: #555;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .collection-subcategory:hover {
          border-color: #111;
          color: #111;
        }

        .collection-subcategory.active {
          background: #111;
          border-color: #111;
          color: #fff;
        }

        .collection-controls__right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .collection-view-toggle {
          display: flex;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          overflow: hidden;
        }

        .collection-view-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: transparent;
          border: none;
          color: #999;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .collection-view-btn.active {
          background: #111;
          color: #fff;
        }

        .collection-sort-select {
          padding: 10px 16px;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          font-size: 14px;
          color: #333;
          cursor: pointer;
          min-width: 150px;
        }

        .collection-products-wrapper {
          min-height: 400px;
        }

        .collection-no-products {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          text-align: center;
          color: #666;
        }

        .collection-no-products svg {
          color: #ccc;
          margin-bottom: 24px;
        }

        .collection-no-products h2 {
          font-size: 24px;
          color: #333;
          margin: 0 0 12px 0;
        }

        .collection-no-products p {
          font-size: 15px;
          margin: 0 0 24px 0;
        }

        .collection-browse-all {
          padding: 14px 28px;
          background: #111;
          color: #fff;
          border-radius: 50px;
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          transition: background-color 0.3s ease;
        }

        .collection-browse-all:hover {
          background: #333;
        }

        .collection-products {
          display: grid;
          gap: clamp(16px, 2vw, 24px);
        }

        .collection-products.grid {
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        }

        .collection-products.list {
          grid-template-columns: 1fr;
        }

        .collection-product {
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          text-decoration: none;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .collection-product:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
        }

        .collection-products.list .collection-product {
          display: grid;
          grid-template-columns: 160px 1fr;
          gap: 20px;
          padding-right: 20px;
        }

        .collection-product__image {
          position: relative;
          aspect-ratio: 1;
          background: #f5f5f5;
        }

        .collection-products.list .collection-product__image {
          aspect-ratio: 1;
          border-radius: 12px;
          overflow: hidden;
          margin: 12px;
        }

        .collection-product__img {
          object-fit: cover;
        }

        .collection-product__discount {
          position: absolute;
          top: 12px;
          left: 12px;
          background: #111;
          color: #fff;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }

        .collection-product__info {
          padding: 16px;
        }

        .collection-products.list .collection-product__info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 20px 0;
        }

        .collection-product__name {
          font-size: clamp(14px, 1.5vw, 16px);
          font-weight: 500;
          color: #111;
          margin: 0 0 8px 0;
        }

        .collection-product__rating {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 8px;
        }

        .collection-product__rating .star {
          color: #ddd;
          font-size: 14px;
        }

        .collection-product__rating .star.filled {
          color: #fbbf24;
        }

        .collection-product__reviews {
          font-size: 12px;
          color: #999;
          margin-left: 4px;
        }

        .collection-product__price {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .collection-product__original {
          font-size: 13px;
          color: #999;
          text-decoration: line-through;
        }

        .collection-product__current {
          font-size: 16px;
          font-weight: 600;
          color: #111;
        }

        .collection-product__add-btn {
          margin-top: 12px;
          padding: 10px 20px;
          background: #111;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.3s ease;
          width: fit-content;
        }

        .collection-product__add-btn:hover {
          background: #333;
        }

        .collection-related {
          margin-top: clamp(48px, 6vw, 80px);
        }

        .collection-related h2 {
          font-size: clamp(20px, 2.5vw, 28px);
          font-weight: 400;
          margin: 0 0 24px 0;
        }

        .collection-related__grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
        }

        .collection-related__item {
          position: relative;
          height: 160px;
          border-radius: 16px;
          overflow: hidden;
          text-decoration: none;
        }

        .collection-related__image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .collection-related__img {
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .collection-related__item:hover .collection-related__img {
          transform: scale(1.1);
        }

        .collection-related__overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.6) 100%);
        }

        .collection-related__name {
          position: absolute;
          bottom: 16px;
          left: 16px;
          color: #fff;
          font-size: 16px;
          font-weight: 500;
        }

        @media (max-width: 639px) {
          .collection-controls {
            flex-direction: column;
            align-items: flex-start;
          }

          .collection-controls__left {
            width: 100%;
            flex-direction: column;
            align-items: flex-start;
          }

          .collection-controls__right {
            width: 100%;
            justify-content: space-between;
          }

          .collection-products.grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .collection-products.list .collection-product {
            grid-template-columns: 100px 1fr;
          }

          .collection-related__grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </main>
  );
}