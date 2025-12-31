'use client';

import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { gsap } from 'gsap';

// Product data with more details
// Review interface
interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  verified: boolean;
}

// Product reviews data
const productReviews: { [key: string]: Review[] } = {
  'product-01': [
    { id: 'r1', author: 'John D.', rating: 5, date: '2024-12-15', title: 'Excellent product!', content: 'This product exceeded my expectations. The quality is outstanding and it arrived quickly.', verified: true },
    { id: 'r2', author: 'Sarah M.', rating: 4, date: '2024-12-10', title: 'Great value', content: 'Very happy with this purchase. Works as described and looks great.', verified: true },
    { id: 'r3', author: 'Mike R.', rating: 5, date: '2024-12-05', title: 'Highly recommend', content: 'Best purchase I have made this year. Will definitely buy again.', verified: false },
  ],
  'product-02': [
    { id: 'r4', author: 'Emily L.', rating: 5, date: '2024-12-18', title: 'Love it!', content: 'Perfect for my kitchen. Heats up super fast and looks modern.', verified: true },
    { id: 'r5', author: 'David K.', rating: 4, date: '2024-12-12', title: 'Good quality', content: 'Solid build quality. The auto shut-off feature is very useful.', verified: true },
  ],
  'product-03': [
    { id: 'r6', author: 'Jessica T.', rating: 5, date: '2024-12-20', title: 'Game changer!', content: 'Makes the best crispy fries without all the oil. Highly recommend!', verified: true },
    { id: 'r7', author: 'Robert W.', rating: 5, date: '2024-12-14', title: 'Amazing appliance', content: 'Use it almost every day. Easy to clean and food comes out perfect.', verified: true },
    { id: 'r8', author: 'Lisa H.', rating: 4, date: '2024-12-08', title: 'Great for healthy cooking', content: 'Loving the healthy meals I can make with this. Only wish it was a bit larger.', verified: false },
  ],
  'product-04': [
    { id: 'r9', author: 'Tom B.', rating: 5, date: '2024-12-16', title: 'Best coffee ever', content: 'The built-in grinder makes a huge difference. Coffee tastes amazing!', verified: true },
    { id: 'r10', author: 'Anna S.', rating: 4, date: '2024-12-11', title: 'Great features', content: 'Love the programmable timer. Wakes up to fresh coffee every morning.', verified: true },
  ],
  'product-05': [
    { id: 'r11', author: 'Chris P.', rating: 4, date: '2024-12-19', title: 'Perfect toast every time', content: 'Variable browning control works great. No more burnt toast!', verified: true },
    { id: 'r12', author: 'Karen M.', rating: 5, date: '2024-12-13', title: 'Sleek design', content: 'Looks amazing on my counter and works perfectly.', verified: false },
  ],
  'product-06': [
    { id: 'r13', author: 'Steve J.', rating: 5, date: '2024-12-21', title: 'Powerful and versatile', content: 'Handles everything I throw at it. The multiple attachments are very useful.', verified: true },
    { id: 'r14', author: 'Nancy D.', rating: 5, date: '2024-12-17', title: 'Kitchen essential', content: 'Cannot imagine my kitchen without this now. Makes meal prep so easy!', verified: true },
    { id: 'r15', author: 'Paul G.', rating: 4, date: '2024-12-09', title: 'Great value for money', content: 'Excellent quality at this price point. Very happy with my purchase.', verified: true },
  ],
};

const products = [
  {
    id: 'product-01',
    name: 'Product-1',
    price: 299,
    originalPrice: 350,
    discount: 15,
    cover: '/images/1.jpg',
    gallery: ['/images/1.jpg', '/images/2.jpg', '/images/3.jpg', '/images/4.jpg', '/images/5.jpg', '/images/1.jpg'],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    features: [
      'Lorem ipsum dolor sit amet, adipi scing elit',
      'Lorem ipsum dolor sit amet, consectetuer adipi scing elit',
      'Lorem ipsum dolor sit amet, consectetuer adipi'
    ],
    rating: 4.5,
    reviews: 32,
  },
  {
    id: 'product-02',
    name: 'Electric Kettle',
    price: 149,
    originalPrice: 180,
    discount: 17,
    cover: '/images/2.jpg',
    gallery: ['/images/2.jpg', '/images/3.jpg', '/images/4.jpg', '/images/5.jpg', '/images/6.jpg', '/images/2.jpg'],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    features: [
      'Fast heating technology',
      'Auto shut-off safety feature',
      'Premium stainless steel'
    ],
    rating: 4.8,
    reviews: 56,
  },
  {
    id: 'product-03',
    name: 'Air Fryer Deluxe',
    price: 199,
    originalPrice: 250,
    discount: 20,
    cover: '/images/3.jpg',
    gallery: ['/images/3.jpg', '/images/4.jpg', '/images/5.jpg', '/images/6.jpg', '/images/7.jpg', '/images/3.jpg'],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    features: [
      'Large 5.8 quart capacity',
      '7 preset cooking functions',
      'Easy clean non-stick basket'
    ],
    rating: 4.7,
    reviews: 89,
  },
  {
    id: 'product-04',
    name: 'Coffee Maker',
    price: 179,
    originalPrice: 220,
    discount: 18,
    cover: '/images/4.jpg',
    gallery: ['/images/4.jpg', '/images/5.jpg', '/images/6.jpg', '/images/7.jpg', '/images/8.jpg', '/images/4.jpg'],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    features: [
      'Programmable timer',
      '12-cup capacity',
      'Built-in grinder'
    ],
    rating: 4.6,
    reviews: 45,
  },
  {
    id: 'product-05',
    name: 'Toaster Elite',
    price: 89,
    originalPrice: 110,
    discount: 19,
    cover: '/images/5.jpg',
    gallery: ['/images/5.jpg', '/images/6.jpg', '/images/7.jpg', '/images/8.jpg', '/images/9.jpg', '/images/5.jpg'],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    features: [
      '4-slice capacity',
      'Variable browning control',
      'Extra-wide slots'
    ],
    rating: 4.4,
    reviews: 28,
  },
  {
    id: 'product-06',
    name: 'Food Processor',
    price: 249,
    originalPrice: 299,
    discount: 17,
    cover: '/images/6.jpg',
    gallery: ['/images/6.jpg', '/images/7.jpg', '/images/8.jpg', '/images/9.jpg', '/images/10.jpg', '/images/6.jpg'],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    features: [
      'Powerful 700W motor',
      'Multiple attachments',
      'Easy pulse control'
    ],
    rating: 4.9,
    reviews: 112,
  },
];

interface CartItem {
  id: string;
  name: string;
  price: number;
  cover: string;
  quantity: number;
}

function StoreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [titleRevealed, setTitleRevealed] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsAnimating, setDetailsAnimating] = useState(false);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [shouldOpenCart, setShouldOpenCart] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');
  const lastScrollY = useRef(0);
  const headerRef = useRef<HTMLDivElement>(null);
  
  const cartButtonRef = useRef<HTMLButtonElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  const cartBgRef = useRef<HTMLDivElement>(null);
  const cartInnerBgRef = useRef<HTMLDivElement>(null);
  const cartCloseRef = useRef<HTMLButtonElement>(null);
  const cartButtonNumberRef = useRef<HTMLSpanElement>(null);
  const cartButtonBgRef = useRef<HTMLSpanElement>(null);
  const cartButtonLabelRef = useRef<HTMLSpanElement>(null);
  const shutterTopRef = useRef<HTMLDivElement>(null);
  const shutterBottomRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const detailsBgRef = useRef<HTMLDivElement>(null);
  const detailsInnerBgRef = useRef<HTMLDivElement>(null);
  const detailsCloseRef = useRef<HTMLButtonElement>(null);

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

  // Preload images
  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = products.map((product) => {
        return new Promise((resolve, reject) => {
          const img = new window.Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = product.cover;
        });
      });
      await Promise.all(imagePromises);
      setLoading(false);
    };
    preloadImages();
  }, []);

  // Initialize cart button animation
  useEffect(() => {
    if (cartButtonNumberRef.current && cartButtonBgRef.current) {
      gsap.set([cartButtonNumberRef.current, cartButtonBgRef.current], { scale: 0 });
    }
  }, []);

  // Initialize cart panel animation - EXACTLY like sam3/cartjs.txt cartAnimationSetup()
  useEffect(() => {
    if (cartRef.current && cartBgRef.current && cartInnerBgRef.current && cartCloseRef.current) {
      gsap.set(cartRef.current, { xPercent: 100 });
      gsap.set([cartBgRef.current, cartInnerBgRef.current], { xPercent: 110 });
      gsap.set(cartCloseRef.current, { x: 30, autoAlpha: 0 });
    }
  }, []);

  // Initialize details panel animation - EXACTLY like sam3/cartjs.txt cartAnimationSetup()
  useEffect(() => {
    if (detailsRef.current && detailsBgRef.current && detailsInnerBgRef.current && detailsCloseRef.current) {
      gsap.set(detailsRef.current, { xPercent: 100 });
      gsap.set([detailsBgRef.current, detailsInnerBgRef.current], { xPercent: 110 });
      gsap.set(detailsCloseRef.current, { x: 30, autoAlpha: 0 });
    }
  }, []);

  // Focus search input when expanded
  useEffect(() => {
    if (searchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchExpanded]);

  // Scroll behavior - hide header on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Don't hide header if cart or details panel is open
      if (cartOpen || detailsOpen) {
        setHeaderVisible(true);
        return;
      }
      
      // Show header when at top of page
      if (currentScrollY < 50) {
        setHeaderVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        // Scrolling down - hide header
        setHeaderVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        // Scrolling up - show header
        setHeaderVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [cartOpen, detailsOpen]);

  const cartButtonAnimationEnter = useCallback(() => {
    if (!cartButtonNumberRef.current || !cartButtonBgRef.current || !cartButtonLabelRef.current) return;
    
    const tl = gsap.timeline();
    tl.addLabel('start');
    
    tl.to(cartButtonLabelRef.current, {
      x: -35,
      duration: 0.4,
      ease: 'power2.out'
    }, 'start');
    
    tl.to([cartButtonNumberRef.current, cartButtonBgRef.current], {
      scale: 1,
      stagger: 0.1,
      duration: 0.8,
      ease: 'elastic.out(1.3, 0.9)',
    }, 'start');
    
    return tl;
  }, []);

  // Cart animation enter - EXACTLY like sam3/cartjs.txt cartAnimationEnter()
  const openCart = useCallback(() => {
    if (isAnimating || !cartRef.current || !cartBgRef.current || !cartInnerBgRef.current || !cartCloseRef.current) return;
    
    document.body.classList.add('locked');
    setIsAnimating(true);

    const cartItemElements = cartRef.current.querySelectorAll('.cart-item');
    const cartTotalElements = cartRef.current.querySelectorAll('.cart-total > *');
    
    // Set initial states for items that will animate in
    if (cartItemElements.length > 0) gsap.set(cartItemElements, { x: 30, autoAlpha: 0 });
    gsap.set(cartTotalElements, { scale: 0.9, autoAlpha: 0 });

    const tl = gsap.timeline({
      onStart: () => { gsap.set(cartRef.current, { xPercent: 0 }); },
      onComplete: () => {
        setCartOpen(true);
        setIsAnimating(false);
      },
    });
    
    tl.addLabel('start');

    // Background slides in - exactly like sam3
    tl.to([cartBgRef.current, cartInnerBgRef.current], {
      xPercent: 0,
      stagger: 0.1,
      duration: 2.2,
      ease: 'expo.inOut',
    }, 'start');

    // Close button fades in - exactly like sam3
    tl.to(cartCloseRef.current, {
      x: 0,
      autoAlpha: 1,
      stagger: 0.1,
      duration: 1,
      ease: 'power2.out',
    }, 'start+=1.3');

    // Cart items slide in - exactly like sam3
    if (cartItemElements.length > 0) {
      tl.to(cartItemElements, {
        x: 0,
        autoAlpha: 1,
        stagger: 0.1,
        duration: 1,
        ease: 'power2.out',
      }, 'start+=1.4');
    }

    // Total section scales in - exactly like sam3
    tl.to(cartTotalElements, {
      scale: 1,
      autoAlpha: 1,
      stagger: 0.1,
      duration: 1,
      ease: 'power2.out',
    }, 'start+=1.6');
  }, [isAnimating]);

  // Cart animation leave - EXACTLY like sam3/cartjs.txt cartAnimationLeave()
  const closeCart = () => {
    if (isAnimating || !cartRef.current || !cartBgRef.current || !cartInnerBgRef.current || !cartCloseRef.current) return;
    
    document.body.classList.remove('locked');
    setIsAnimating(true);

    const cartItemElements = cartRef.current.querySelectorAll('.cart-item');
    const cartTotalElements = cartRef.current.querySelectorAll('.cart-total > *');

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(cartRef.current, { xPercent: 100 });
        setCartOpen(false);
        setIsAnimating(false);
      },
    });
    
    tl.addLabel('start');

    // Background slides out - exactly like sam3
    tl.to([cartBgRef.current, cartInnerBgRef.current], {
      xPercent: 110,
      stagger: 0.1,
      duration: 1.5,
      ease: 'expo.inOut',
    }, 'start');

    // Cart items slide out - exactly like sam3
    if (cartItemElements.length > 0) {
      tl.to(cartItemElements, {
        x: 30,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power2.out',
      }, 'start');
    }

    // Close button fades out - exactly like sam3
    tl.to(cartCloseRef.current, {
      x: 30,
      autoAlpha: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power2.out',
    }, 'start');

    // Total section scales out - exactly like sam3
    tl.to(cartTotalElements, {
      scale: 0.9,
      autoAlpha: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power2.out',
    }, 'start');
  };

  // Open product details panel - EXACTLY like sam3/cartjs.txt cartAnimationEnter() pattern
  const openDetails = (product: typeof products[0]) => {
    if (detailsAnimating || !detailsRef.current || !detailsBgRef.current || !detailsInnerBgRef.current || !detailsCloseRef.current) return;
    
    setSelectedProduct(product);
    setMainImageIndex(0);
    document.body.classList.add('locked');
    setDetailsAnimating(true);

    // Set initial state - panel starts off screen
    gsap.set(detailsRef.current, { xPercent: 0 });
    
    // Wait a frame for React to render the content, then set it hidden and animate
    requestAnimationFrame(() => {
      const detailsContent = detailsRef.current?.querySelector('.details-panel__content');
      
      // Set initial states - content hidden, will animate in after background
      if (detailsContent) gsap.set(detailsContent, { x: 30, autoAlpha: 0 });
      gsap.set(detailsCloseRef.current, { x: 30, autoAlpha: 0 });

      const tl = gsap.timeline({
        onComplete: () => {
          setDetailsOpen(true);
          setDetailsAnimating(false);
        },
      });
      
      tl.addLabel('start');

      // Background slides in - exactly like sam3 cart
      tl.to([detailsBgRef.current, detailsInnerBgRef.current], {
        xPercent: 0,
        stagger: 0.1,
        duration: 2.2,
        ease: 'expo.inOut',
      }, 'start');

      // Close button fades in - exactly like sam3 cart
      tl.to(detailsCloseRef.current, {
        x: 0,
        autoAlpha: 1,
        stagger: 0.1,
        duration: 1,
        ease: 'power2.out',
      }, 'start+=1.3');

      // Content slides in - like cart items in sam3
      if (detailsContent) {
        tl.to(detailsContent, {
          x: 0,
          autoAlpha: 1,
          duration: 1,
          ease: 'power2.out',
        }, 'start+=1.4');
      }
    });
  };

  // Close product details panel - EXACTLY like sam3/cartjs.txt cartAnimationLeave() pattern
  const closeDetails = () => {
    if (detailsAnimating || !detailsRef.current || !detailsBgRef.current || !detailsInnerBgRef.current || !detailsCloseRef.current) return;
    
    document.body.classList.remove('locked');
    setDetailsAnimating(true);

    const detailsContent = detailsRef.current.querySelector('.details-panel__content');

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(detailsRef.current, { xPercent: 100 });
        setDetailsOpen(false);
        setDetailsAnimating(false);
        setSelectedProduct(null);
      },
    });
    
    tl.addLabel('start');

    // Background slides out - exactly like sam3 cart
    tl.to([detailsBgRef.current, detailsInnerBgRef.current], {
      xPercent: 110,
      stagger: 0.1,
      duration: 1.5,
      ease: 'expo.inOut',
    }, 'start');

    // Content slides out - like cart items in sam3
    if (detailsContent) {
      tl.to(detailsContent, {
        x: 30,
        autoAlpha: 0,
        duration: 0.8,
        ease: 'power2.out',
      }, 'start');
    }

    // Close button fades out - exactly like sam3 cart
    tl.to(detailsCloseRef.current, {
      x: 30,
      autoAlpha: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power2.out',
    }, 'start');
  };

  const addToCart = useCallback((product: typeof products[0], productElement: HTMLElement) => {
    const galleryItems = productElement.querySelectorAll('.product-gallery-item');
    const gallery = productElement.querySelector('.product-gallery') as HTMLElement;
    const otherProducts = document.querySelectorAll('.product-item:not(.active)');
    const cartButtonRect = cartButtonRef.current?.getBoundingClientRect();
    
    if (!cartButtonRect || !gallery || galleryItems.length === 0) return;

    productElement.classList.add('active');
    
    const firstGalleryItem = galleryItems[0] as HTMLElement;
    const itemRect = firstGalleryItem.getBoundingClientRect();
    const isTopRow = window.innerWidth > 768 && itemRect.top < window.innerHeight / 2;

    // Set initial states - make gallery visible and position items
    gsap.set(gallery, { visibility: 'visible', opacity: 1 });
    gsap.set(galleryItems, {
      transformOrigin: isTopRow ? 'top right' : 'bottom left',
      scale: 1,
      x: 0,
      y: 0,
      opacity: 1
    });

    const tl = gsap.timeline({
      onComplete: () => {
        // Reset all gallery items after animation
        gsap.set(galleryItems, { scale: 1, opacity: 1, y: 0, x: 0, clearProps: 'all' });
        gsap.set(gallery, { visibility: 'hidden', opacity: 0 });
        productElement.classList.remove('active');
      },
    });
    
    tl.addLabel('start');

    // Add item to cart immediately
    tl.add(() => {
      setCartItems(prevItems => {
        const existingItem = prevItems.find((item) => item.id === product.id);
        if (existingItem) {
          return prevItems.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          return [...prevItems, { ...product, quantity: 1 }];
        }
      });
    }, 'start');

    // Fade out other products
    tl.to(otherProducts, {
      scale: 0.85,
      opacity: 0.1,
      duration: 0.5,
      stagger: 0.03,
      ease: 'power2.out',
    }, 'start');

    // Scale up current product slightly
    tl.to(productElement, {
      scale: 1.02,
      duration: 0.5,
      ease: 'power2.out',
    }, 'start');

    // Animate gallery items flying to cart with synchronized keyframes
    tl.to(galleryItems, {
      keyframes: {
        '0%': {
          x: 0,
          y: 0,
          scale: 1,
          opacity: 1,
        },
        '30%': {
          y: isTopRow ? itemRect.height * 0.8 : -itemRect.height * 0.8,
          scale: isTopRow ? 0.7 : 0.5,
          opacity: 1,
        },
        '100%': {
          x: cartButtonRect.x - itemRect.left - itemRect.width / 2 + 20,
          y: cartButtonRect.y - itemRect.top - itemRect.height / 2 + 20,
          scale: 0,
          opacity: 0,
        },
      },
      stagger: {
        from: 'end',
        each: 0.03,
      },
      duration: 1.2,
      ease: 'power2.inOut',
    }, 'start+=0.1');

    // Reset products back to normal
    tl.to([productElement, ...Array.from(otherProducts)], {
      scale: 1,
      opacity: 1,
      duration: 0.5,
      stagger: 0.02,
      ease: 'power2.out',
    }, 'start+=1');
  }, [cartButtonAnimationEnter]);

  const addToCartFromDetails = useCallback(() => {
    if (!selectedProduct) return;
    
    setCartItems(prevItems => {
      const existingItem = prevItems.find((item) => item.id === selectedProduct.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === selectedProduct.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...selectedProduct, quantity: 1 }];
      }
    });
    
    // Show a brief visual feedback without closing the panel
    const addButton = document.querySelector('.details-panel__add-to-cart') as HTMLElement;
    if (addButton) {
      const originalText = addButton.textContent;
      addButton.textContent = 'Added!';
      addButton.style.background = '#2d8a2d';
      setTimeout(() => {
        addButton.textContent = originalText;
        addButton.style.background = '#111';
      }, 1000);
    }
  }, [selectedProduct, cartButtonAnimationEnter]);

  const buyNowFromDetails = useCallback(() => {
    if (!selectedProduct) return;
    
    // Add to cart first
    setCartItems(prevItems => {
      const existingItem = prevItems.find((item) => item.id === selectedProduct.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === selectedProduct.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...selectedProduct, quantity: 1 }];
      }
    });
    
    // Close details panel and open cart
    closeDetails();
    setTimeout(() => {
      openCart();
    }, 800);
  }, [selectedProduct, openCart]);

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((items) => {
      return items.map((item) => {
        if (item.id === id) {
          const newQuantity = item.quantity + delta;
          if (newQuantity <= 0) return null;
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const toggleSearch = () => {
    setSearchExpanded(!searchExpanded);
    if (searchExpanded) {
      setSearchQuery('');
    }
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Handle checkout - only navigate if cart has items
  const handleCheckout = useCallback(() => {
    if (cartItems.length > 0) {
      // Save cart items to localStorage for checkout page
      localStorage.setItem('checkoutCart', JSON.stringify(cartItems));
      router.push('/checkout');
    }
  }, [cartItems, router]);

  // Render star ratings
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
    <main className={`store-page ${loading ? 'loading' : ''}`}>
      {/* Shutter Animation Panels */}
      <div
        ref={shutterTopRef}
        className="fixed top-0 left-0 w-full h-[50vh] bg-[#0a0a0a] z-[1000] pointer-events-none"
      />
      <div
        ref={shutterBottomRef}
        className="fixed top-[50vh] left-0 w-full h-[50vh] bg-[#0a0a0a] z-[1000] pointer-events-none"
      />

      {/* Noise texture overlay */}
      <div className="noise-overlay" />

      {/* Unified Header Bar with Title and Controls */}
      <header
        ref={headerRef}
        className={`store-header ${showContent ? 'visible' : ''} ${headerVisible ? 'header-visible' : 'header-hidden'}`}
      >
        <div className="store-header__inner">
          {/* Store Title on the left */}
          <div className="store-header__title">
            <h1 className="store-title__container">
              <span className="store-title__word-reveal">
                <span className={`store-title__word-inner store-title__delay-0 ${titleRevealed ? 'revealed' : ''}`}>
                  Store
                </span>
              </span>
            </h1>
          </div>

          {/* Right side controls */}
          <div className="store-header__controls">
            {/* Home Icon */}
            <Link href="/" className="store-header__icon icon-bulge">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </Link>

            {/* Search - Expandable */}
            <div className={`store-header__search ${searchExpanded ? 'expanded' : ''}`}>
              <button className="store-header__icon icon-bulge" onClick={toggleSearch}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </button>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="store-header__search-input"
              />
            </div>

            {/* User/Login Icon */}
            <button className="store-header__icon icon-bulge">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>

            {/* Cart Button with Icon */}
            <button ref={cartButtonRef} className="cart-button icon-bulge" onClick={openCart}>
              <div className="cart-button__label-wrap">
                <span ref={cartButtonLabelRef} className="cart-button__label">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                </span>
                <span className="cart-button__line" />
              </div>
              <div className="cart-button__number-wrap">
                <span ref={cartButtonBgRef} className="cart-button__number-bg" />
                <span ref={cartButtonNumberRef} className="cart-button__number">{cartItems.length}</span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Products Section */}
      <section className={`store-content ${showContent ? 'visible' : ''}`}>
        <div className="products">
          <ul className="products__list">
            {products.map((product, index) => (
              <li
                key={product.id}
                className="product-item products__item"
                style={{ zIndex: 7 - index }}
              >
                <div className="products__images">
                  <Image
                    src={product.cover}
                    alt={product.name}
                    fill
                    className="products__main-image"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  
                  {/* Discount badge */}
                  <div className="products__discount-badge">-{product.discount}%</div>
                  
                  {/* Gallery for animation */}
                  <div className="product-gallery products__gallery">
                    {product.gallery.map((img, i) => (
                      <Image
                        key={i}
                        src={img}
                        alt={`${product.name} gallery ${i + 1}`}
                        fill
                        className="product-gallery-item products__gallery-item"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ))}
                  </div>
                </div>

                <div className="products__info">
                  <span className="products__name">{product.name}</span>
                  <div className="products__price-wrap">
                    <span className="products__original-price">${product.originalPrice}</span>
                  <span className="products__price">${product.price}</span>
                  </div>
                </div>

                <div className="products__actions">
                  <button
                    type="button"
                    className="products__cta button"
                    onClick={(e) => {
                      const productElement = (e.target as HTMLElement).closest('.product-item') as HTMLElement;
                      if (productElement) addToCart(product, productElement);
                    }}
                  >
                    Add to cart
                  </button>
                  <button
                    type="button"
                    className="products__details-btn icon-bulge"
                    onClick={() => openDetails(product)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Product Details Panel */}
      <aside ref={detailsRef} className="details-panel">
        <div ref={detailsBgRef} className="details-panel__bg" onClick={closeDetails} />
        
        <div className="details-panel__inner">
          <button ref={detailsCloseRef} className="details-panel__close" onClick={closeDetails}>
            Close
          </button>
          <div ref={detailsInnerBgRef} className="details-panel__inner-bg" />

          {selectedProduct && (
            <div className="details-panel__content">
              {/* Breadcrumb */}
              <div className="details-panel__breadcrumb">
                <span>Product Listing</span>
                <span className="separator">&gt;</span>
                <span className="current">Dummy Product Page</span>
              </div>

              {/* Product Layout */}
              <div className="details-panel__layout">
                {/* Images Section */}
                <div className="details-panel__images">
                  {/* Thumbnail Gallery */}
                  <div className="details-panel__thumbnails">
                    {selectedProduct.gallery.slice(0, 4).map((img, i) => (
                      <button
                        key={i}
                        className={`details-panel__thumbnail ${mainImageIndex === i ? 'active' : ''}`}
                        onClick={() => setMainImageIndex(i)}
                      >
                        <Image src={img} alt={`Thumbnail ${i + 1}`} fill className="details-panel__thumbnail-img" />
                      </button>
                    ))}
                  </div>
                  
                  {/* Main Image */}
                  <div className="details-panel__main-image">
                    <Image
                      src={selectedProduct.gallery[mainImageIndex]}
                      alt={selectedProduct.name}
                      fill
                      className="details-panel__main-img"
                    />
                  </div>
                </div>

                {/* Product Info */}
                <div className="details-panel__info">
                  <h2 className="details-panel__title">{selectedProduct.name}</h2>
                  
                  <div className="details-panel__price-rating">
                    <span className="details-panel__price">${selectedProduct.price}</span>
                    <span className="details-panel__divider">|</span>
                    <div className="details-panel__rating">
                      {renderStars(selectedProduct.rating)}
                      <span className="details-panel__reviews">( {selectedProduct.reviews} reviews )</span>
                    </div>
                  </div>
                  
                  <div className="details-panel__wishlist">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </div>

                  <p className="details-panel__description">{selectedProduct.description}</p>

                  <ul className="details-panel__features">
                    {selectedProduct.features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>

                  {/* Quantity and Add to Cart */}
                  <div className="details-panel__cart-section">
                    <div className="details-panel__quantity">
                      <button className="details-panel__qty-btn">-</button>
                      <span className="details-panel__qty-value">1</span>
                      <button className="details-panel__qty-btn">+</button>
                    </div>
                    <button className="details-panel__add-to-cart" onClick={addToCartFromDetails}>
                      Add to Cart
                    </button>
                  </div>

                  <button className="details-panel__buy-now" onClick={buyNowFromDetails}>Buy Now</button>

                  {/* Shipping Info */}
                  <div className="details-panel__shipping">
                    <div className="details-panel__shipping-item">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="1" y="3" width="15" height="13" />
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                        <circle cx="5.5" cy="18.5" r="2.5" />
                        <circle cx="18.5" cy="18.5" r="2.5" />
                      </svg>
                      <span>Free worldwide shipping on all orders over $500</span>
                    </div>
                    <div className="details-panel__shipping-item">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span>Delivers in: 3-7 Working Days <a href="#">Shipping & Return</a></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description & Reviews Tabs */}
              <div className="details-panel__tabs">
                <div className="details-panel__tab-headers">
                  <button
                    className={`details-panel__tab-btn ${activeTab === 'description' ? 'active' : ''}`}
                    onClick={() => setActiveTab('description')}
                  >
                    Description
                  </button>
                  <span className="details-panel__tab-divider">|</span>
                  <button
                    className={`details-panel__tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reviews')}
                  >
                    Reviews ({productReviews[selectedProduct.id]?.length || 0})
                  </button>
                </div>
                <div className="details-panel__tab-content">
                  {activeTab === 'description' ? (
                    <>
                      <p>{selectedProduct.description}</p>
                      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                    </>
                  ) : (
                    <div className="reviews-section">
                      {/* Reviews Summary */}
                      <div className="reviews-summary">
                        <div className="reviews-summary__rating">
                          <span className="reviews-summary__number">{selectedProduct.rating}</span>
                          <div className="reviews-summary__stars">
                            {renderStars(selectedProduct.rating)}
                          </div>
                          <span className="reviews-summary__count">Based on {selectedProduct.reviews} reviews</span>
                        </div>
                      </div>
                      
                      {/* Reviews List */}
                      <div className="reviews-list">
                        {(productReviews[selectedProduct.id] || []).map((review) => (
                          <div key={review.id} className="review-item">
                            <div className="review-item__header">
                              <div className="review-item__author-info">
                                <span className="review-item__author">{review.author}</span>
                                {review.verified && (
                                  <span className="review-item__verified">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                      <polyline points="22 4 12 14.01 9 11.01"/>
                                    </svg>
                                    Verified Purchase
                                  </span>
                                )}
                              </div>
                              <span className="review-item__date">{new Date(review.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                            <div className="review-item__rating">
                              {renderStars(review.rating)}
                            </div>
                            <h4 className="review-item__title">{review.title}</h4>
                            <p className="review-item__content">{review.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Similar Products */}
              <div className="details-panel__similar">
                <h3>Similar Products</h3>
                <div className="details-panel__similar-grid">
                  {products.slice(0, 4).map((prod) => (
                    <div key={prod.id} className="details-panel__similar-item">
                      <div className="details-panel__similar-image">
                        <Image src={prod.cover} alt={prod.name} fill />
                        <span className="details-panel__similar-discount">-{prod.discount}%</span>
                      </div>
                      <div className="details-panel__similar-info">
                        <span className="details-panel__similar-name">{prod.name}</span>
                        <div className="details-panel__similar-price">
                          <span className="original">${prod.originalPrice}</span>
                          <span className="current">${prod.price}</span>
                        </div>
                      </div>
                      <button className="details-panel__similar-add icon-bulge">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="16" />
                          <line x1="8" y1="12" x2="16" y2="12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Cart Sidebar */}
      <aside ref={cartRef} className="cart">
        <div ref={cartBgRef} className="cart__bg" onClick={closeCart} />
        
        <div className="cart__inner">
          <button ref={cartCloseRef} className="cart__inner-close" onClick={closeCart}>
            Close
          </button>
          <div ref={cartInnerBgRef} className="cart__inner-bg" />

          <div className="cart-items">
            {cartItems.length === 0 ? (
              <div className="cart-empty">Your cart is empty</div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="cart-item cart-grid">
                  <div className="cart-item__img-wrap">
                    <Image
                      src={item.cover}
                      alt={item.name}
                      width={100}
                      height={100}
                      className="cart-item__img"
                    />
                  </div>

                  <div className="cart-item__details">
                    <span className="cart-item__details-title">{item.name}</span>
                    
                    <button
                      className="cart-item__remove-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>

                    <div className="cart-item__details-wrap">
                      <span className="cart-item__details-label">Quantity:</span>

                      <div className="cart-item__details-actions">
                        <button
                          className="cart-item__minus-button"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          -
                        </button>
                        <span className="cart-item__quantity">{item.quantity}</span>
                        <button
                          className="cart-item__plus-button"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          +
                        </button>
                      </div>
                      <span className="cart-item__details-price">${item.price}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="cart-total cart-grid">
            <div className="cart-total__inner">
              <div className="cart-total__label">Total:</div>
              <div className="cart-total__amount">${cartTotal}</div>
              <div className="cart-total__taxes">
                Delivery fee and tax<br />
                calculated at checkout
              </div>
              <div className="cart-total__buttons">
                <button
                  className={`cart-total__buy-now-btn button ${cartItems.length === 0 ? 'disabled' : ''}`}
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0}
                >
                  Buy Now
                </button>
                <button
                  className={`cart-total__checkout-btn button ${cartItems.length === 0 ? 'disabled' : ''}`}
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0}
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Styles */}
      <style jsx global>{`
        /* Store Page Styles */
        .store-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 25%, #ffffff 50%, #f0f0f0 75%, #e5e5e5 100%);
          font-family: sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          color: #111;
        }

        /* Loading State */
        .store-page.loading::before,
        .store-page.loading::after {
          content: '';
          position: fixed;
          z-index: 1000;
        }

        .store-page.loading::before {
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 50%, #e5e5e5 100%);
        }

        .store-page.loading::after {
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

        /* Noise Overlay */
        .noise-overlay {
          position: fixed;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          opacity: 0.03;
          pointer-events: none;
          z-index: 10;
          mix-blend-mode: multiply;
          animation: noise 1.2s steps(3) infinite both;
        }

        @keyframes noise {
          0% { transform: translate3d(1%, -1%, 0) }
          10% { transform: translate3d(-5%, -2%, 0) }
          20% { transform: translate3d(10%, 5%, 0) }
          30% { transform: translate3d(5%, -11%, 0) }
          40% { transform: translate3d(-12%, -5%, 0) }
          50% { transform: translate3d(10%, 9%, 0) }
          60% { transform: translate3d(15%, 0, 0) }
          70% { transform: translate3d(-10%, 8%, 0) }
          80% { transform: translate3d(10%, 2%, 0) }
          90% { transform: translate3d(1%, 5%, 0) }
          100% { transform: translate3d(0, 8%, 0) }
        }

        /* Icon Bulge Animation - touch-friendly tap targets */
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

        /* Unified Header Bar - Fixed at top with scroll hide behavior */
        .store-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: clamp(8px, 2vw, 16px) clamp(12px, 3vw, 24px);
          opacity: 0;
          transform: translateY(-100%);
          transition: opacity 0.6s ease, transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .store-header.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .store-header.visible.header-hidden {
          transform: translateY(-100%);
        }

        .store-header.visible.header-visible {
          transform: translateY(0);
        }

        .store-header__inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: clamp(8px, 1.5vw, 12px) clamp(12px, 2vw, 20px);
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 50px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .store-header__title {
          display: flex;
          align-items: center;
        }

        .store-header__title .store-title__container {
          font-family: sans-serif;
          font-size: clamp(18px, 3vw, 28px);
          line-height: 1;
          color: #000000;
          font-weight: 300;
          letter-spacing: -0.02em;
          margin: 0;
        }

        .store-header__controls {
          display: flex;
          align-items: center;
          gap: clamp(4px, 1vw, 8px);
        }

        .store-header__icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: clamp(36px, 5vw, 44px);
          height: clamp(36px, 5vw, 44px);
          border-radius: 50%;
          background: transparent;
          border: none;
          cursor: pointer;
          color: #000;
          position: relative;
        }

        .store-header__icon svg {
          width: clamp(18px, 2.5vw, 24px);
          height: clamp(18px, 2.5vw, 24px);
        }

        /* Cart Button (like sam3) */
        .cart-button {
          position: relative;
          pointer-events: all;
          cursor: pointer;
          display: flex;
          align-items: center;
          background: transparent;
          border: none;
          padding: 8px;
          min-width: 44px;
          min-height: 44px;
        }

        .cart-button__label-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .cart-button__label {
          display: flex;
          align-items: center;
          color: #000;
        }

        .cart-button__label svg {
          width: clamp(18px, 2.5vw, 22px);
          height: clamp(18px, 2.5vw, 22px);
        }

        .cart-button__line {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background-color: #111;
        }

        .cart-button__number-wrap {
          position: absolute;
          right: -8px;
          top: 50%;
          transform: translateY(-50%);
          display: grid;
          grid-template-areas: 'element';
          align-items: center;
          justify-content: center;
        }

        .cart-button__number-bg {
          grid-area: element;
          width: clamp(18px, 2.5vw, 22px);
          height: clamp(18px, 2.5vw, 22px);
          border-radius: 50%;
          background-color: #D9D9D9;
        }

        .cart-button__number {
          font-size: clamp(9px, 1.2vw, 11px);
          grid-area: element;
          text-align: center;
          color: #000;
          font-weight: 500;
        }

        /* Expandable Search */
        .store-header__search {
          display: flex;
          align-items: center;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .store-header__search-input {
          width: 0;
          padding: 0;
          border: none;
          background: transparent;
          font-size: 14px;
          outline: none;
          color: #000;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .store-header__search.expanded .store-header__search-input {
          width: clamp(120px, 20vw, 180px);
          padding: 8px 12px;
          margin-left: 8px;
          background: rgba(0, 0, 0, 0.05);
          border-radius: 20px;
        }

        /* Word by Word Reveal Animation */
        .store-title__word-reveal {
          display: inline-block;
          overflow: hidden;
          vertical-align: bottom;
        }

        .store-title__word-inner {
          display: inline-block;
          transform: translateY(100%);
          opacity: 0;
        }

        .store-title__word-inner.revealed {
          transform: translateY(0);
          opacity: 1;
        }

        .store-title__delay-0 {
          transition: transform 1s cubic-bezier(0.23, 1, 0.32, 1) 0.2s,
                      opacity 0.8s ease-out 0.2s;
        }

        /* Store Content - Responsive padding */
        .store-content {
          padding: clamp(80px, 12vh, 120px) clamp(16px, 4vw, 48px) clamp(24px, 4vh, 48px);
          min-height: 100vh;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s;
        }

        .store-content.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Products Grid - Responsive */
        .products {
          width: 100%;
        }

        .products__list {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(16px, 2vw, 24px);
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .products__item {
          display: flex;
          flex-direction: column;
          gap: clamp(12px, 1.5vw, 16px);
        }

        .products__images {
          position: relative;
          height: clamp(200px, 32vh, 400px);
          min-height: 200px;
          overflow: hidden;
          border-radius: clamp(12px, 2vw, 16px);
        }

        .products__main-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: clamp(12px, 2vw, 16px);
        }

        .products__discount-badge {
          position: absolute;
          top: clamp(8px, 1.5vw, 12px);
          left: clamp(8px, 1.5vw, 12px);
          background: #000;
          color: #fff;
          padding: clamp(3px, 0.5vw, 4px) clamp(8px, 1vw, 10px);
          border-radius: 20px;
          font-size: clamp(10px, 1.2vw, 12px);
          font-weight: 500;
          z-index: 2;
        }

        .products__gallery {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: grid;
          grid-auto-columns: 100%;
          grid-template-rows: 100%;
          grid-template-areas: 'gallery';
          opacity: 0;
          visibility: hidden;
          border-radius: clamp(12px, 2vw, 16px);
          pointer-events: none;
          z-index: 10;
        }

        .products__gallery-item {
          width: 100%;
          height: 100%;
          object-fit: cover;
          grid-area: gallery;
          border-radius: clamp(12px, 2vw, 16px);
          will-change: transform, opacity;
        }

        .products__info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 4px;
          flex-wrap: wrap;
          gap: 8px;
        }

        .products__name {
          font-size: clamp(14px, 1.6vw, 16px);
          font-weight: 500;
          color: #111;
        }

        .products__price-wrap {
          display: flex;
          align-items: center;
          gap: clamp(4px, 0.8vw, 8px);
        }

        .products__original-price {
          font-size: clamp(12px, 1.4vw, 14px);
          color: #999;
          text-decoration: line-through;
        }

        .products__price {
          font-size: clamp(12px, 1.4vw, 14px);
          color: #111;
          font-weight: 600;
        }

        .products__actions {
          display: flex;
          align-items: center;
          gap: clamp(8px, 1.2vw, 12px);
        }

        /* Button Styles - Touch-friendly */
        .button {
          color: #111;
          font-size: clamp(13px, 1.5vw, 15px);
          line-height: 1;
          padding: clamp(10px, 1.2vw, 12px) clamp(16px, 2vw, 20px);
          background-color: #D9D9D9;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.5s cubic-bezier(0.33, 1, 0.68, 1), transform 0.2s ease;
          min-height: 44px;
        }

        .button:hover {
          background-color: #C9C9C9;
          transform: translateY(-2px);
        }

        .button:active {
          transform: translateY(0);
        }

        .products__cta {
          flex: 1;
        }

        .products__details-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          background: #D9D9D9;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          color: #111;
          transition: background-color 0.3s ease;
        }

        .products__details-btn:hover {
          background: #C9C9C9;
        }

        /* Product Details Panel - Responsive */
        .details-panel {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1002;
          pointer-events: none;
        }

        .details-panel__bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(10px);
          pointer-events: auto;
          cursor: pointer;
        }

        .details-panel__inner {
          position: absolute;
          top: 0;
          right: 0;
          width: min(85%, 1000px);
          height: 100%;
          overflow-y: auto;
          padding: clamp(20px, 4vw, 40px);
          pointer-events: auto;
        }

        .details-panel__inner-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #ffffff 0%, #f8f8f8 50%, #f0f0f0 100%);
          z-index: 0;
        }

        .details-panel__close {
          font-size: clamp(14px, 1.6vw, 16px);
          position: absolute;
          top: clamp(12px, 2vw, 20px);
          right: clamp(12px, 2vw, 20px);
          text-decoration: underline;
          cursor: pointer;
          z-index: 2;
          background: none;
          border: none;
          color: #111;
          min-width: 44px;
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .details-panel__content {
          position: relative;
          z-index: 1;
        }

        .details-panel__breadcrumb {
          font-size: clamp(11px, 1.3vw, 13px);
          color: #666;
          margin-bottom: clamp(16px, 2.5vw, 24px);
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .details-panel__breadcrumb .separator {
          color: #999;
        }

        .details-panel__breadcrumb .current {
          color: #111;
          font-weight: 500;
        }

        .details-panel__layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(20px, 4vw, 40px);
          margin-bottom: clamp(24px, 4vw, 40px);
        }

        .details-panel__images {
          display: flex;
          gap: clamp(10px, 1.5vw, 16px);
          flex-direction: row;
        }

        .details-panel__thumbnails {
          display: flex;
          flex-direction: column;
          gap: clamp(8px, 1.2vw, 12px);
        }

        .details-panel__thumbnail {
          position: relative;
          width: clamp(50px, 8vw, 80px);
          height: clamp(50px, 8vw, 80px);
          border: 2px solid transparent;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          background: transparent;
          padding: 0;
          transition: border-color 0.3s ease;
        }

        .details-panel__thumbnail.active {
          border-color: #111;
        }

        .details-panel__thumbnail-img {
          object-fit: cover;
        }

        .details-panel__main-image {
          position: relative;
          flex: 1;
          min-height: clamp(250px, 40vh, 400px);
          border-radius: 12px;
          overflow: hidden;
        }

        .details-panel__main-img {
          object-fit: cover;
        }

        .details-panel__info {
          position: relative;
        }

        .details-panel__title {
          font-size: clamp(20px, 3vw, 28px);
          font-weight: 500;
          margin: 0 0 clamp(12px, 1.5vw, 16px) 0;
          color: #111;
          padding-right: 40px;
        }

        .details-panel__price-rating {
          display: flex;
          align-items: center;
          gap: clamp(8px, 1.2vw, 12px);
          margin-bottom: clamp(16px, 2vw, 20px);
          flex-wrap: wrap;
        }

        .details-panel__price {
          font-size: clamp(18px, 2.5vw, 24px);
          font-weight: 600;
          color: #111;
        }

        .details-panel__divider {
          color: #ccc;
        }

        .details-panel__rating {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .star {
          color: #ddd;
          font-size: clamp(14px, 1.6vw, 16px);
        }

        .star.filled {
          color: #111;
        }

        .details-panel__reviews {
          font-size: clamp(11px, 1.3vw, 13px);
          color: #666;
          margin-left: 4px;
        }

        .details-panel__wishlist {
          position: absolute;
          top: 0;
          right: 0;
          cursor: pointer;
          color: #ccc;
          transition: color 0.3s ease;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .details-panel__wishlist:hover {
          color: #ff4444;
        }

        .details-panel__description {
          font-size: clamp(12px, 1.4vw, 14px);
          line-height: 1.7;
          color: #666;
          margin-bottom: clamp(16px, 2vw, 20px);
        }

        .details-panel__features {
          list-style: disc;
          padding-left: 20px;
          margin: 0 0 clamp(16px, 2.5vw, 24px) 0;
        }

        .details-panel__features li {
          font-size: clamp(11px, 1.3vw, 13px);
          color: #666;
          margin-bottom: 6px;
        }

        .details-panel__cart-section {
          display: flex;
          gap: clamp(12px, 1.5vw, 16px);
          margin-bottom: clamp(12px, 1.5vw, 16px);
        }

        .details-panel__quantity {
          display: flex;
          align-items: center;
          gap: clamp(8px, 1.2vw, 12px);
          padding: 0 clamp(12px, 1.5vw, 16px);
          background: #f5f5f5;
          border-radius: 8px;
        }

        .details-panel__qty-btn {
          background: none;
          border: none;
          font-size: clamp(16px, 1.8vw, 18px);
          color: #111;
          cursor: pointer;
          padding: 8px;
          min-width: 44px;
          min-height: 44px;
        }

        .details-panel__qty-value {
          font-size: clamp(14px, 1.6vw, 16px);
          font-weight: 500;
          min-width: 24px;
          text-align: center;
          color: #111;
        }

        .details-panel__add-to-cart {
          flex: 1;
          padding: clamp(12px, 1.5vw, 16px) clamp(20px, 3vw, 32px);
          background: #111;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: clamp(13px, 1.5vw, 15px);
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.3s ease;
          min-height: 44px;
        }

        .details-panel__add-to-cart:hover {
          background: #333;
        }

        .details-panel__buy-now {
          width: 100%;
          padding: clamp(12px, 1.5vw, 16px);
          background: #fff;
          color: #111;
          border: 2px solid #111;
          border-radius: 8px;
          font-size: clamp(13px, 1.5vw, 15px);
          font-weight: 500;
          cursor: pointer;
          margin-bottom: clamp(16px, 2.5vw, 24px);
          transition: all 0.3s ease;
          min-height: 44px;
        }

        .details-panel__buy-now:hover {
          background: #111;
          color: #fff;
        }

        .details-panel__shipping {
          display: flex;
          flex-direction: column;
          gap: clamp(8px, 1.2vw, 12px);
        }

        .details-panel__shipping-item {
          display: flex;
          align-items: center;
          gap: clamp(8px, 1.2vw, 12px);
          font-size: clamp(11px, 1.3vw, 13px);
          color: #666;
        }

        .details-panel__shipping-item svg {
          flex-shrink: 0;
          width: clamp(16px, 2vw, 20px);
          height: clamp(16px, 2vw, 20px);
        }

        .details-panel__shipping-item a {
          color: #111;
          text-decoration: underline;
        }

        /* Tabs */
        .details-panel__tabs {
          border-top: 1px solid #e5e5e5;
          padding-top: clamp(20px, 3vw, 32px);
          margin-bottom: clamp(24px, 4vw, 40px);
        }

        .details-panel__tab-headers {
          display: flex;
          align-items: center;
          gap: clamp(12px, 1.5vw, 16px);
          margin-bottom: clamp(16px, 2.5vw, 24px);
        }

        .details-panel__tab-btn {
          background: none;
          border: none;
          font-size: clamp(15px, 1.8vw, 18px);
          font-weight: 500;
          color: #999;
          cursor: pointer;
          transition: color 0.3s ease;
          min-height: 44px;
          padding: 8px;
        }

        .details-panel__tab-btn.active {
          color: #111;
        }

        .details-panel__tab-btn:hover {
          color: #666;
        }

        .details-panel__tab-divider {
          color: #ccc;
        }

        .details-panel__tab-content {
          font-size: clamp(12px, 1.4vw, 14px);
          line-height: 1.8;
          color: #666;
        }

        .details-panel__tab-content p {
          margin-bottom: clamp(12px, 1.5vw, 16px);
        }

        /* Reviews Section Styles */
        .reviews-section {
          padding-top: clamp(8px, 1.5vw, 16px);
        }

        .reviews-summary {
          display: flex;
          align-items: center;
          gap: clamp(16px, 2vw, 24px);
          padding-bottom: clamp(16px, 2.5vw, 24px);
          border-bottom: 1px solid #e5e5e5;
          margin-bottom: clamp(16px, 2.5vw, 24px);
        }

        .reviews-summary__rating {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: clamp(4px, 0.8vw, 8px);
        }

        .reviews-summary__number {
          font-size: clamp(32px, 5vw, 48px);
          font-weight: 600;
          color: #111;
          line-height: 1;
        }

        .reviews-summary__stars {
          display: flex;
          gap: 2px;
        }

        .reviews-summary__count {
          font-size: clamp(11px, 1.3vw, 13px);
          color: #666;
        }

        .reviews-list {
          display: flex;
          flex-direction: column;
          gap: clamp(16px, 2.5vw, 24px);
        }

        .review-item {
          padding-bottom: clamp(16px, 2.5vw, 24px);
          border-bottom: 1px solid #f0f0f0;
        }

        .review-item:last-child {
          border-bottom: none;
        }

        .review-item__header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: clamp(6px, 1vw, 8px);
          flex-wrap: wrap;
          gap: 8px;
        }

        .review-item__author-info {
          display: flex;
          align-items: center;
          gap: clamp(8px, 1.2vw, 12px);
          flex-wrap: wrap;
        }

        .review-item__author {
          font-weight: 600;
          color: #111;
          font-size: clamp(13px, 1.5vw, 15px);
        }

        .review-item__verified {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: clamp(10px, 1.2vw, 12px);
          color: #2d8a2d;
        }

        .review-item__verified svg {
          width: clamp(12px, 1.4vw, 14px);
          height: clamp(12px, 1.4vw, 14px);
        }

        .review-item__date {
          font-size: clamp(11px, 1.3vw, 13px);
          color: #999;
        }

        .review-item__rating {
          display: flex;
          gap: 2px;
          margin-bottom: clamp(6px, 1vw, 8px);
        }

        .review-item__rating .star {
          font-size: clamp(12px, 1.4vw, 14px);
        }

        .review-item__title {
          font-size: clamp(14px, 1.6vw, 16px);
          font-weight: 500;
          color: #111;
          margin: 0 0 clamp(4px, 0.6vw, 6px) 0;
        }

        .review-item__content {
          font-size: clamp(12px, 1.4vw, 14px);
          line-height: 1.6;
          color: #555;
          margin: 0;
        }

        /* Similar Products - Responsive */
        .details-panel__similar {
          padding-top: clamp(20px, 3vw, 32px);
        }

        .details-panel__similar h3 {
          font-size: clamp(18px, 2.5vw, 24px);
          font-weight: 500;
          margin-bottom: clamp(16px, 2.5vw, 24px);
          color: #111;
        }

        .details-panel__similar-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: clamp(12px, 2vw, 20px);
        }

        .details-panel__similar-item {
          position: relative;
        }

        .details-panel__similar-image {
          position: relative;
          aspect-ratio: 1;
          border-radius: clamp(8px, 1.2vw, 12px);
          overflow: hidden;
          margin-bottom: clamp(8px, 1.2vw, 12px);
          background: #f5f5f5;
        }

        .details-panel__similar-image img {
          object-fit: cover;
        }

        .details-panel__similar-discount {
          position: absolute;
          top: 8px;
          left: 8px;
          background: #000;
          color: #fff;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: clamp(9px, 1.1vw, 11px);
          font-weight: 500;
        }

        .details-panel__similar-info {
          padding-right: 36px;
        }

        .details-panel__similar-name {
          font-size: clamp(12px, 1.4vw, 14px);
          font-weight: 500;
          color: #111;
          display: block;
          margin-bottom: 4px;
        }

        .details-panel__similar-price {
          display: flex;
          align-items: center;
          gap: clamp(4px, 0.8vw, 8px);
        }

        .details-panel__similar-price .original {
          font-size: clamp(10px, 1.2vw, 12px);
          color: #999;
          text-decoration: line-through;
        }

        .details-panel__similar-price .current {
          font-size: clamp(12px, 1.4vw, 14px);
          font-weight: 600;
          color: #111;
        }

        .details-panel__similar-add {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: 1px solid #ddd;
          border-radius: 50%;
          cursor: pointer;
          color: #666;
          transition: all 0.3s ease;
        }

        .details-panel__similar-add:hover {
          border-color: #111;
          color: #111;
        }

        /* Cart Sidebar - Responsive */
        .cart {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1001;
          pointer-events: none;
        }

        .cart__bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(255, 255, 255, 0.8);
          pointer-events: auto;
          cursor: pointer;
        }

        .cart__inner {
          position: absolute;
          top: clamp(10px, 2vw, 20px);
          right: clamp(10px, 2vw, 20px);
          width: min(600px, calc(100% - clamp(20px, 4vw, 40px)));
          height: calc(100vh - clamp(20px, 4vw, 40px));
          padding: clamp(80px, 12vh, 120px) clamp(16px, 2vw, 20px) clamp(16px, 2vw, 20px);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          pointer-events: auto;
        }

        .cart__inner-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 50%, #e8e8e8 100%);
          border-radius: clamp(12px, 1.5vw, 16px);
          z-index: 0;
        }

        .cart__inner-close {
          font-size: clamp(14px, 1.6vw, 16px);
          position: absolute;
          top: clamp(12px, 2vw, 20px);
          right: clamp(12px, 2vw, 20px);
          text-decoration: underline;
          cursor: pointer;
          z-index: 2;
          background: none;
          border: none;
          color: #111;
          min-width: 44px;
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Cart Items - All text in black, Responsive */
        .cart-items {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: clamp(20px, 5vh, 60px);
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          overflow-x: hidden;
          padding-bottom: clamp(20px, 3vh, 40px);
          z-index: 1;
        }

        .cart-empty {
          text-align: center;
          color: #111;
          padding: clamp(24px, 4vw, 40px);
          font-weight: 500;
        }

        .cart-grid {
          display: grid;
          grid-template-columns: clamp(60px, 10vw, 100px) auto;
          gap: clamp(16px, 4vw, 60px);
        }

        .cart-item {
          position: relative;
          align-items: flex-end;
        }

        .cart-item__img-wrap {
          position: relative;
          width: clamp(60px, 10vw, 100px);
          height: clamp(60px, 10vw, 100px);
          border-radius: clamp(8px, 1.2vw, 12px);
          overflow: hidden;
        }

        .cart-item__img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .cart-item__details {
          width: 100%;
          font-size: clamp(12px, 1.4vw, 14px);
          display: flex;
          flex-direction: column;
          gap: clamp(8px, 1.5vw, 20px);
          color: #111;
        }

        .cart-item__details-title {
          font-weight: 500;
          color: #111;
        }

        .cart-item__details-actions {
          display: flex;
          align-items: center;
          gap: clamp(12px, 2vw, 20px);
        }

        .cart-item__remove-btn {
          position: absolute;
          top: 0;
          right: 0;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.4);
          text-decoration: underline;
          background: none;
          border: none;
          cursor: pointer;
          min-width: 44px;
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cart-item__remove-btn:hover {
          color: #111;
        }

        .cart-item__details-wrap {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #111;
          flex-wrap: wrap;
          gap: 8px;
        }

        .cart-item__details-label {
          color: #111;
        }

        .cart-item__quantity {
          color: #111;
          font-weight: 500;
        }

        .cart-item__details-price {
          color: #111;
          font-weight: 600;
        }

        .cart-item__minus-button,
        .cart-item__plus-button {
          width: clamp(28px, 4vw, 36px);
          height: clamp(28px, 4vw, 36px);
          min-width: 44px;
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #D9D9D9;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: clamp(14px, 1.6vw, 16px);
          color: #111;
          transition: background-color 0.3s ease;
        }

        .cart-item__minus-button:hover,
        .cart-item__plus-button:hover {
          background: #C9C9C9;
        }

        /* Cart Total - All text in black, Responsive */
        .cart-total {
          position: relative;
          z-index: 1;
          width: 100%;
          flex-shrink: 0;
          padding-top: clamp(12px, 2vh, 20px);
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }

        .cart-total__inner {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-template-rows: repeat(2, 1fr);
          gap: clamp(12px, 2vw, 30px);
          grid-column: 2 / 2;
        }

        .cart-total__label {
          font-weight: 500;
          color: #111;
          font-size: clamp(12px, 1.4vw, 14px);
        }

        .cart-total__amount {
          text-align: right;
          color: #111;
          font-weight: 600;
          font-size: clamp(16px, 1.8vw, 18px);
        }

        .cart-total__taxes {
          font-size: clamp(9px, 1.1vw, 12px);
          color: #666;
        }

        .cart-total__buttons {
          grid-column: 1 / -1;
          display: flex;
          gap: clamp(10px, 1.5vw, 16px);
          margin-top: clamp(8px, 1.2vw, 12px);
        }

        .cart-total__buy-now-btn {
          flex: 1;
          background: #E8A87C;
          color: #111;
          min-height: 44px;
          font-weight: 600;
        }

        .cart-total__buy-now-btn:hover:not(.disabled) {
          background: #d4956b;
        }

        .cart-total__buy-now-btn.disabled {
          background: #ccc;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .cart-total__checkout-btn {
          flex: 1;
          background: #111;
          color: #fff;
          min-height: 44px;
        }

        .cart-total__checkout-btn:hover:not(.disabled) {
          background: #333;
        }

        .cart-total__checkout-btn.disabled {
          background: #999;
          cursor: not-allowed;
          opacity: 0.6;
        }

        /* ===== TABLET BREAKPOINT (640px - 1023px) ===== */
        @media (min-width: 640px) and (max-width: 1023px) {
          .products__list {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .products__images {
            height: clamp(220px, 35vh, 350px);
          }
          
          .details-panel__inner {
            width: 90%;
          }
          
          .details-panel__layout {
            grid-template-columns: 1fr 1fr;
            gap: 24px;
          }
          
          .details-panel__images {
            flex-direction: column-reverse;
          }
          
          .details-panel__thumbnails {
            flex-direction: row;
            overflow-x: auto;
            padding-bottom: 8px;
          }
          
          .details-panel__main-image {
            min-height: 280px;
          }
          
          .details-panel__similar-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        /* ===== MOBILE BREAKPOINT (<640px) ===== */
        @media (max-width: 639px) {
          .store-header__controls {
            gap: 2px;
          }
          
          .store-header__search.expanded .store-header__search-input {
            width: 100px;
          }
          
          .products__list {
            display: flex;
            flex-direction: column;
            gap: 24px;
          }
          
          .products__images {
            height: clamp(200px, 45vh, 280px);
          }
          
          .products__info {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }
          
          .products__actions {
            width: 100%;
          }
          
          .products__cta {
            flex: 1;
          }
          
          /* Details Panel - Full screen on mobile */
          .details-panel__inner {
            width: 100%;
            padding: 60px 16px 24px;
          }
          
          .details-panel__close {
            top: 12px;
            right: 12px;
          }
          
          .details-panel__layout {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          
          .details-panel__images {
            flex-direction: column-reverse;
          }
          
          .details-panel__thumbnails {
            flex-direction: row;
            overflow-x: auto;
            padding-bottom: 8px;
            gap: 8px;
          }
          
          .details-panel__thumbnail {
            width: 60px;
            height: 60px;
            flex-shrink: 0;
          }
          
          .details-panel__main-image {
            min-height: 250px;
          }
          
          .details-panel__cart-section {
            flex-direction: column;
          }
          
          .details-panel__quantity {
            justify-content: center;
            width: 100%;
            padding: 8px 16px;
          }
          
          .details-panel__similar-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          
          /* Cart on mobile */
          .cart__inner {
            width: calc(100% - 20px);
            right: 10px;
            top: 10px;
            height: calc(100vh - 20px);
            padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
          }
          
          .cart-items {
            max-height: calc(100vh - 280px);
          }
          
          .cart-total {
            padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
          }
          
          .cart-total__inner {
            gap: 10px;
          }
          
          .cart-total__buttons {
            flex-direction: column;
          }
          
          .cart-total__checkout-btn,
          .cart-total__buy-now-btn {
            padding: 14px 20px;
            width: 100%;
          }
        }

        /* ===== SMALL MOBILE (<400px) ===== */
        @media (max-width: 399px) {
          .store-header__icon {
            width: 36px;
            height: 36px;
          }
          
          .store-header__icon svg {
            width: 18px;
            height: 18px;
          }
          
          .cart-button__label svg {
            width: 18px;
            height: 18px;
          }
          
          .products__images {
            height: 180px;
            min-height: 180px;
          }
          
          .details-panel__similar-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        /* Locked body state */
        body.locked {
          overflow: hidden;
        }
      `}</style>
    </main>
  );
}

export default function StorePage() {
  return (
    <Suspense fallback={
      <div className="store-page loading">
        <div className="fixed top-0 left-0 w-full h-[50vh] bg-[#0a0a0a] z-[1000]" />
        <div className="fixed top-[50vh] left-0 w-full h-[50vh] bg-[#0a0a0a] z-[1000]" />
      </div>
    }>
      <StoreContent />
    </Suspense>
  );
}