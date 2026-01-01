'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { gsap } from 'gsap';

// Mock products data
const allProducts = [
  { id: 'product-01', name: 'Product-1', price: 299, originalPrice: 350, discount: 15, cover: '/images/1.jpg', category: 'electronics', rating: 4.5, reviews: 32 },
  { id: 'product-02', name: 'Electric Kettle', price: 149, originalPrice: 180, discount: 17, cover: '/images/2.jpg', category: 'kitchen', rating: 4.8, reviews: 56 },
  { id: 'product-03', name: 'Air Fryer Deluxe', price: 199, originalPrice: 250, discount: 20, cover: '/images/3.jpg', category: 'kitchen', rating: 4.7, reviews: 89 },
  { id: 'product-04', name: 'Coffee Maker', price: 179, originalPrice: 220, discount: 18, cover: '/images/4.jpg', category: 'kitchen', rating: 4.6, reviews: 45 },
  { id: 'product-05', name: 'Toaster Elite', price: 89, originalPrice: 110, discount: 19, cover: '/images/5.jpg', category: 'kitchen', rating: 4.4, reviews: 28 },
  { id: 'product-06', name: 'Food Processor', price: 249, originalPrice: 299, discount: 17, cover: '/images/6.jpg', category: 'kitchen', rating: 4.9, reviews: 112 },
  { id: 'product-07', name: 'Blender Pro', price: 129, originalPrice: 160, discount: 19, cover: '/images/7.jpg', category: 'kitchen', rating: 4.5, reviews: 67 },
  { id: 'product-08', name: 'Rice Cooker', price: 99, originalPrice: 130, discount: 24, cover: '/images/8.jpg', category: 'kitchen', rating: 4.6, reviews: 34 },
  { id: 'product-09', name: 'Microwave Oven', price: 199, originalPrice: 240, discount: 17, cover: '/images/9.jpg', category: 'electronics', rating: 4.3, reviews: 78 },
  { id: 'product-10', name: 'Stand Mixer', price: 349, originalPrice: 420, discount: 17, cover: '/images/10.jpg', category: 'kitchen', rating: 4.8, reviews: 156 },
];

const categories = [
  { id: 'all', name: 'All Categories' },
  { id: 'kitchen', name: 'Kitchen' },
  { id: 'electronics', name: 'Electronics' },
];

const sortOptions = [
  { id: 'relevance', name: 'Relevance' },
  { id: 'price-low', name: 'Price: Low to High' },
  { id: 'price-high', name: 'Price: High to Low' },
  { id: 'rating', name: 'Highest Rated' },
  { id: 'newest', name: 'Newest' },
];

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [titleRevealed, setTitleRevealed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof allProducts>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSort, setSelectedSort] = useState('relevance');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const shutterTopRef = useRef<HTMLDivElement>(null);
  const shutterBottomRef = useRef<HTMLDivElement>(null);

  // Perform search
  const performSearch = React.useCallback((query: string) => {
    let results = [...allProducts];

    // Filter by search query
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(product => 
        product.name.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      results = results.filter(product => product.category === selectedCategory);
    }

    // Filter by price range
    results = results.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Filter by rating
    if (minRating > 0) {
      results = results.filter(product => product.rating >= minRating);
    }

    // Sort results
    switch (selectedSort) {
      case 'price-low':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        // For demo, reverse the array
        results.reverse();
        break;
      default:
        // Relevance - keep original order
        break;
    }

    setSearchResults(results);
  }, [selectedCategory, selectedSort, priceRange, minRating]);

  // Get query from URL
  useEffect(() => {
    const q = searchParams.get('q') || '';
    setSearchQuery(q);
    performSearch(q);
  }, [searchParams, performSearch]);

  // Re-run search when filters change
  useEffect(() => {
    performSearch(searchQuery);
  }, [performSearch, searchQuery]);

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

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
    <main className={`search-page ${loading ? 'loading' : ''}`}>
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
        className={`search-back-btn ${showContent ? 'visible' : ''}`}
        onClick={() => router.back()}
        title="Go Back"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12 19 5 12 12 5"/>
        </svg>
      </button>

      {/* Header */}
      <header className={`search-header ${showContent ? 'visible' : ''}`}>
        <div className="search-header__controls">
          <Link href="/" className="search-header__icon icon-bulge" title="Home">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </Link>
          <Link href="/store" className="search-header__icon icon-bulge" title="Store">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <section className={`search-content ${showContent ? 'visible' : ''}`}>
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="search-bar">
          <div className="search-bar__input-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="search-bar__input"
            />
            {searchQuery && (
              <button 
                type="button" 
                className="search-bar__clear"
                onClick={() => {
                  setSearchQuery('');
                  router.push('/search');
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>
          <button type="submit" className="search-bar__btn">Search</button>
        </form>

        {/* Results Header */}
        <div className="search-results-header">
          <div className="search-results-info">
            <h1 className="search-results-title">
              {searchQuery ? (
                <>Search results for &ldquo;<strong>{searchQuery}</strong>&rdquo;</>
              ) : (
                'All Products'
              )}
            </h1>
            <span className="search-results-count">{searchResults.length} products found</span>
          </div>
          
          <div className="search-results-controls">
            {/* Filter Toggle (Mobile) */}
            <button 
              className="search-filter-toggle"
              onClick={() => setShowFilters(!showFilters)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="21" x2="4" y2="14"/>
                <line x1="4" y1="10" x2="4" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12" y2="3"/>
                <line x1="20" y1="21" x2="20" y2="16"/>
                <line x1="20" y1="12" x2="20" y2="3"/>
                <line x1="1" y1="14" x2="7" y2="14"/>
                <line x1="9" y1="8" x2="15" y2="8"/>
                <line x1="17" y1="16" x2="23" y2="16"/>
              </svg>
              Filters
            </button>

            {/* View Mode Toggle */}
            <div className="search-view-toggle">
              <button 
                className={`search-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
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
                className={`search-view-btn ${viewMode === 'list' ? 'active' : ''}`}
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
              className="search-sort-select"
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
            >
              {sortOptions.map(option => (
                <option key={option.id} value={option.id}>{option.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Layout */}
        <div className="search-layout">
          {/* Filters Sidebar */}
          <aside className={`search-filters ${showFilters ? 'open' : ''}`}>
            <div className="search-filters__header">
              <h3>Filters</h3>
              <button 
                className="search-filters__close"
                onClick={() => setShowFilters(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Category Filter */}
            <div className="search-filter-group">
              <h4>Category</h4>
              <div className="search-filter-options">
                {categories.map(cat => (
                  <label key={cat.id} className="search-filter-option">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === cat.id}
                      onChange={() => setSelectedCategory(cat.id)}
                    />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="search-filter-group">
              <h4>Price Range</h4>
              <div className="search-price-range">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  placeholder="Min"
                  className="search-price-input"
                />
                <span>to</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  placeholder="Max"
                  className="search-price-input"
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div className="search-filter-group">
              <h4>Minimum Rating</h4>
              <div className="search-rating-options">
                {[0, 3, 4, 4.5].map(rating => (
                  <label key={rating} className="search-filter-option">
                    <input
                      type="radio"
                      name="rating"
                      checked={minRating === rating}
                      onChange={() => setMinRating(rating)}
                    />
                    <span>
                      {rating === 0 ? 'All Ratings' : (
                        <>
                          {renderStars(Math.floor(rating))}
                          <span className="rating-text">{rating}+ stars</span>
                        </>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            <button 
              className="search-clear-filters"
              onClick={() => {
                setSelectedCategory('all');
                setPriceRange([0, 500]);
                setMinRating(0);
              }}
            >
              Clear All Filters
            </button>
          </aside>

          {/* Results Grid/List */}
          <div className="search-results">
            {searchResults.length === 0 ? (
              <div className="search-no-results">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                  <line x1="8" y1="11" x2="14" y2="11"/>
                </svg>
                <h2>No products found</h2>
                <p>Try adjusting your search or filters to find what you&apos;re looking for.</p>
                <Link href="/store" className="search-browse-all">
                  Browse All Products
                </Link>
              </div>
            ) : (
              <div className={`search-products ${viewMode}`}>
                {searchResults.map(product => (
                  <Link 
                    key={product.id} 
                    href={`/store?product=${product.id}`}
                    className="search-product"
                  >
                    <div className="search-product__image">
                      <Image
                        src={product.cover}
                        alt={product.name}
                        fill
                        className="search-product__img"
                      />
                      <span className="search-product__discount">-{product.discount}%</span>
                    </div>
                    <div className="search-product__info">
                      <h3 className="search-product__name">{product.name}</h3>
                      <div className="search-product__rating">
                        {renderStars(Math.floor(product.rating))}
                        <span className="search-product__reviews">({product.reviews})</span>
                      </div>
                      <div className="search-product__price">
                        <span className="search-product__original">${product.originalPrice}</span>
                        <span className="search-product__current">${product.price}</span>
                      </div>
                      {viewMode === 'list' && (
                        <button className="search-product__add-btn">
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Overlay for mobile filters */}
      {showFilters && (
        <div 
          className="search-filters-overlay"
          onClick={() => setShowFilters(false)}
        />
      )}

      {/* Styles */}
      <style jsx global>{`
        .search-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 25%, #ffffff 50%, #f0f0f0 75%, #e5e5e5 100%);
          font-family: sans-serif;
          -webkit-font-smoothing: antialiased;
          color: #111;
        }

        .search-page.loading::before,
        .search-page.loading::after {
          content: '';
          position: fixed;
          z-index: 1000;
        }

        .search-page.loading::before {
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 50%, #e5e5e5 100%);
        }

        .search-page.loading::after {
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

        .search-back-btn {
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

        .search-back-btn.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .search-header {
          position: fixed;
          top: 0;
          right: 0;
          z-index: 1000;
          padding: clamp(12px, 2vw, 24px) clamp(12px, 2vw, 32px);
          opacity: 0;
          transform: translateY(-20px);
          transition: opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s;
        }

        .search-header.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .search-header__controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .search-header__icon {
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

        .search-content {
          padding: clamp(80px, 10vh, 100px) clamp(16px, 4vw, 48px) clamp(40px, 6vh, 60px);
          min-height: 100vh;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease 0.7s, transform 0.6s ease 0.7s;
        }

        .search-content.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .search-bar {
          display: flex;
          gap: 12px;
          margin-bottom: clamp(24px, 4vw, 40px);
          max-width: 700px;
        }

        .search-bar__input-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: clamp(12px, 1.5vw, 16px) clamp(16px, 2vw, 20px);
          background: #fff;
          border-radius: 50px;
          border: 1px solid #e5e5e5;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .search-bar__input-wrapper:focus-within {
          border-color: #4A90D9;
          box-shadow: 0 0 0 4px rgba(74, 144, 217, 0.1);
        }

        .search-bar__input-wrapper svg {
          color: #999;
          flex-shrink: 0;
        }

        .search-bar__input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: clamp(15px, 1.6vw, 17px);
          color: #111;
          outline: none;
        }

        .search-bar__input::placeholder {
          color: #999;
        }

        .search-bar__clear {
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
          padding: 4px;
        }

        .search-bar__clear:hover {
          color: #333;
        }

        .search-bar__btn {
          padding: clamp(12px, 1.5vw, 16px) clamp(24px, 3vw, 32px);
          background: #111;
          color: #fff;
          border: none;
          border-radius: 50px;
          font-size: clamp(14px, 1.5vw, 16px);
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .search-bar__btn:hover {
          background: #333;
        }

        .search-results-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: clamp(20px, 3vw, 32px);
        }

        .search-results-title {
          font-size: clamp(20px, 3vw, 28px);
          font-weight: 400;
          color: #111;
          margin: 0;
        }

        .search-results-title strong {
          font-weight: 600;
        }

        .search-results-count {
          font-size: clamp(13px, 1.4vw, 15px);
          color: #666;
          display: block;
          margin-top: 4px;
        }

        .search-results-controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .search-filter-toggle {
          display: none;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          font-size: 14px;
          color: #333;
          cursor: pointer;
        }

        .search-view-toggle {
          display: flex;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          overflow: hidden;
        }

        .search-view-btn {
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

        .search-view-btn.active {
          background: #111;
          color: #fff;
        }

        .search-sort-select {
          padding: 10px 16px;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          font-size: 14px;
          color: #333;
          cursor: pointer;
          min-width: 150px;
        }

        .search-layout {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: clamp(24px, 4vw, 40px);
        }

        .search-filters {
          background: #fff;
          border-radius: 16px;
          padding: clamp(20px, 2.5vw, 28px);
          height: fit-content;
          position: sticky;
          top: 100px;
        }

        .search-filters__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .search-filters__header h3 {
          font-size: 18px;
          font-weight: 600;
          margin: 0;
        }

        .search-filters__close {
          display: none;
          background: none;
          border: none;
          color: #666;
          cursor: pointer;
        }

        .search-filter-group {
          margin-bottom: 24px;
        }

        .search-filter-group h4 {
          font-size: 14px;
          font-weight: 600;
          color: #333;
          margin: 0 0 12px 0;
        }

        .search-filter-options {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .search-filter-option {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: #555;
          cursor: pointer;
        }

        .search-filter-option input {
          width: 18px;
          height: 18px;
        }

        .search-price-range {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .search-price-input {
          width: 80px;
          padding: 8px 12px;
          border: 1px solid #e5e5e5;
          border-radius: 6px;
          font-size: 14px;
        }

        .search-rating-options .star {
          color: #ddd;
          font-size: 14px;
        }

        .search-rating-options .star.filled {
          color: #fbbf24;
        }

        .search-rating-options .rating-text {
          margin-left: 6px;
          color: #666;
        }

        .search-clear-filters {
          width: 100%;
          padding: 12px;
          background: #f5f5f5;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          color: #666;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .search-clear-filters:hover {
          background: #eee;
          color: #333;
        }

        .search-results {
          min-height: 400px;
        }

        .search-no-results {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          text-align: center;
          color: #666;
        }

        .search-no-results svg {
          color: #ccc;
          margin-bottom: 24px;
        }

        .search-no-results h2 {
          font-size: 24px;
          color: #333;
          margin: 0 0 12px 0;
        }

        .search-no-results p {
          font-size: 15px;
          margin: 0 0 24px 0;
        }

        .search-browse-all {
          padding: 14px 28px;
          background: #111;
          color: #fff;
          border-radius: 50px;
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          transition: background-color 0.3s ease;
        }

        .search-browse-all:hover {
          background: #333;
        }

        .search-products {
          display: grid;
          gap: clamp(16px, 2vw, 24px);
        }

        .search-products.grid {
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        }

        .search-products.list {
          grid-template-columns: 1fr;
        }

        .search-product {
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          text-decoration: none;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .search-product:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
        }

        .search-products.list .search-product {
          display: grid;
          grid-template-columns: 140px 1fr;
          gap: 20px;
          padding-right: 20px;
        }

        .search-product__image {
          position: relative;
          aspect-ratio: 1;
          background: #f5f5f5;
        }

        .search-products.list .search-product__image {
          aspect-ratio: 1;
          border-radius: 12px;
          overflow: hidden;
          margin: 12px;
        }

        .search-product__img {
          object-fit: cover;
        }

        .search-product__discount {
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

        .search-product__info {
          padding: 16px;
        }

        .search-products.list .search-product__info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 20px 0;
        }

        .search-product__name {
          font-size: clamp(14px, 1.5vw, 16px);
          font-weight: 500;
          color: #111;
          margin: 0 0 8px 0;
        }

        .search-product__rating {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 8px;
        }

        .search-product__rating .star {
          color: #ddd;
          font-size: 14px;
        }

        .search-product__rating .star.filled {
          color: #fbbf24;
        }

        .search-product__reviews {
          font-size: 12px;
          color: #999;
          margin-left: 4px;
        }

        .search-product__price {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .search-product__original {
          font-size: 13px;
          color: #999;
          text-decoration: line-through;
        }

        .search-product__current {
          font-size: 16px;
          font-weight: 600;
          color: #111;
        }

        .search-product__add-btn {
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

        .search-product__add-btn:hover {
          background: #333;
        }

        .search-filters-overlay {
          display: none;
        }

        @media (max-width: 900px) {
          .search-layout {
            grid-template-columns: 1fr;
          }

          .search-filter-toggle {
            display: flex;
          }

          .search-filters {
            position: fixed;
            top: 0;
            left: 0;
            width: 300px;
            height: 100vh;
            z-index: 1100;
            border-radius: 0;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            overflow-y: auto;
          }

          .search-filters.open {
            transform: translateX(0);
          }

          .search-filters__close {
            display: block;
          }

          .search-filters-overlay {
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1050;
          }
        }

        @media (max-width: 639px) {
          .search-bar {
            flex-direction: column;
          }

          .search-bar__btn {
            width: 100%;
          }

          .search-results-header {
            flex-direction: column;
          }

          .search-results-controls {
            width: 100%;
            justify-content: space-between;
          }

          .search-sort-select {
            flex: 1;
          }

          .search-products.grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .search-products.list .search-product {
            grid-template-columns: 100px 1fr;
          }
        }
      `}</style>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="search-page loading">
        <div className="fixed top-0 left-0 w-full h-[50vh] bg-[#0a0a0a] z-[1000]" />
        <div className="fixed top-[50vh] left-0 w-full h-[50vh] bg-[#0a0a0a] z-[1000]" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}