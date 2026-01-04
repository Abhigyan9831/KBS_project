'use client';

import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { useAuth } from '../context/AuthContext';

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

// Specification labels for each product image - these will animate in with fade effect
interface SpecLabel {
  text: string;
  position: { top?: string; bottom?: string; left?: string; right?: string };
  delay: number;
}

interface ProductSpecs {
  [imageIndex: number]: SpecLabel[];
}

const productSpecifications: { [productId: string]: ProductSpecs } = {
  'product-01': {
    0: [
      { text: 'MODEL_KBS_01', position: { top: '15%', left: '10%' }, delay: 0.2 },
      { text: 'PREMIUM BUILD', position: { top: '25%', left: '8%' }, delay: 0.4 },
      { text: 'POWER: 1200W', position: { top: '60%', right: '10%' }, delay: 0.6 },
      { text: 'TEMP: 45.80°C', position: { bottom: '25%', right: '12%' }, delay: 0.8 },
      { text: 'D 01.01.2025', position: { bottom: '15%', left: '10%' }, delay: 1.0 },
    ],
    1: [
      { text: 'SIDE_VIEW_01', position: { top: '12%', left: '8%' }, delay: 0.2 },
      { text: 'DIMENSIONS: 30x25x20cm', position: { top: '70%', right: '8%' }, delay: 0.5 },
    ],
    2: [
      { text: 'DETAIL_PANEL', position: { top: '10%', left: '10%' }, delay: 0.3 },
      { text: 'MATERIAL: STEEL', position: { bottom: '20%', right: '10%' }, delay: 0.6 },
    ],
    3: [
      { text: 'CONTROL_UNIT', position: { top: '15%', right: '10%' }, delay: 0.2 },
      { text: 'DIGITAL DISPLAY', position: { bottom: '25%', left: '8%' }, delay: 0.5 },
    ],
  },
  'product-02': {
    0: [
      { text: 'KETTLE_PRO_02', position: { top: '12%', left: '8%' }, delay: 0.2 },
      { text: 'RAPID BOIL', position: { top: '22%', left: '6%' }, delay: 0.4 },
      { text: 'CAPACITY: 1.7L', position: { top: '55%', right: '8%' }, delay: 0.6 },
      { text: 'TEMP: 100°C MAX', position: { bottom: '30%', right: '10%' }, delay: 0.8 },
    ],
    1: [
      { text: 'HANDLE_DESIGN', position: { top: '15%', left: '10%' }, delay: 0.3 },
      { text: 'ERGONOMIC GRIP', position: { bottom: '20%', right: '8%' }, delay: 0.5 },
    ],
  },
  'product-03': {
    0: [
      { text: 'AIRFRYER_DLX_03', position: { top: '10%', left: '8%' }, delay: 0.2 },
      { text: 'HEALTHY COOKING', position: { top: '20%', left: '6%' }, delay: 0.4 },
      { text: 'CAPACITY: 5.8QT', position: { top: '50%', right: '10%' }, delay: 0.6 },
      { text: 'TEMP: 200°C', position: { bottom: '25%', right: '8%' }, delay: 0.8 },
      { text: '7 PRESETS', position: { bottom: '15%', left: '10%' }, delay: 1.0 },
    ],
  },
  'product-04': {
    0: [
      { text: 'COFFEE_MKR_04', position: { top: '12%', left: '10%' }, delay: 0.2 },
      { text: 'FRESH GROUND', position: { top: '22%', left: '8%' }, delay: 0.4 },
      { text: 'CUPS: 12', position: { top: '55%', right: '10%' }, delay: 0.6 },
      { text: 'GRINDER: BUILT-IN', position: { bottom: '20%', right: '8%' }, delay: 0.8 },
    ],
  },
  'product-05': {
    0: [
      { text: 'TOASTER_ELT_05', position: { top: '15%', left: '8%' }, delay: 0.2 },
      { text: 'EVEN BROWNING', position: { top: '25%', left: '6%' }, delay: 0.4 },
      { text: 'SLOTS: 4', position: { top: '60%', right: '10%' }, delay: 0.6 },
      { text: 'EXTRA WIDE', position: { bottom: '25%', right: '8%' }, delay: 0.8 },
    ],
  },
  'product-06': {
    0: [
      { text: 'PROCESSOR_06', position: { top: '10%', left: '8%' }, delay: 0.2 },
      { text: 'MULTI-FUNCTION', position: { top: '20%', left: '6%' }, delay: 0.4 },
      { text: 'POWER: 700W', position: { top: '50%', right: '10%' }, delay: 0.6 },
      { text: 'PULSE CONTROL', position: { bottom: '25%', right: '8%' }, delay: 0.8 },
      { text: 'ATTACHMENTS: 5', position: { bottom: '15%', left: '10%' }, delay: 1.0 },
    ],
  },
};

// Combo items for each product - accessories and complementary items
interface ComboItem {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  cover: string;
  description: string;
}

const productComboItems: { [productId: string]: ComboItem[] } = {
  'product-01': [
    { id: 'combo-01-1', name: 'Premium Stand', price: 49, originalPrice: 65, discount: 25, cover: '/images/10.jpg', description: 'Ergonomic stand for Product-1' },
    { id: 'combo-01-2', name: 'Protective Cover', price: 29, originalPrice: 39, discount: 26, cover: '/images/11.jpg', description: 'Durable protective cover' },
    { id: 'combo-01-3', name: 'Extended Warranty', price: 59, originalPrice: 79, discount: 25, cover: '/images/12.jpg', description: '2-year extended warranty' },
    { id: 'combo-01-4', name: 'Cleaning Kit', price: 19, originalPrice: 25, discount: 24, cover: '/images/13.jpg', description: 'Complete cleaning kit' },
  ],
  'product-02': [
    { id: 'combo-02-1', name: 'Kettle Base Pad', price: 15, originalPrice: 20, discount: 25, cover: '/images/14.jpg', description: 'Heat-resistant base pad' },
    { id: 'combo-02-2', name: 'Descaling Tablets', price: 12, originalPrice: 16, discount: 25, cover: '/images/15.jpg', description: 'Pack of 12 descaling tablets' },
    { id: 'combo-02-3', name: 'Temperature Display', price: 25, originalPrice: 35, discount: 29, cover: '/images/16.jpg', description: 'Smart temperature display add-on' },
    { id: 'combo-02-4', name: 'Tea Infuser Set', price: 18, originalPrice: 24, discount: 25, cover: '/images/17.jpg', description: 'Stainless steel tea infusers' },
  ],
  'product-03': [
    { id: 'combo-03-1', name: 'Air Fryer Liners', price: 14, originalPrice: 18, discount: 22, cover: '/images/18.jpg', description: 'Pack of 100 disposable liners' },
    { id: 'combo-03-2', name: 'Silicone Mat Set', price: 22, originalPrice: 30, discount: 27, cover: '/images/10.jpg', description: 'Non-stick silicone mats' },
    { id: 'combo-03-3', name: 'Recipe Book', price: 19, originalPrice: 25, discount: 24, cover: '/images/11.jpg', description: '200+ air fryer recipes' },
    { id: 'combo-03-4', name: 'Rack Accessory Kit', price: 35, originalPrice: 45, discount: 22, cover: '/images/12.jpg', description: 'Multi-layer cooking rack set' },
  ],
  'product-04': [
    { id: 'combo-04-1', name: 'Coffee Bean Set', price: 28, originalPrice: 35, discount: 20, cover: '/images/13.jpg', description: 'Premium blend sampler pack' },
    { id: 'combo-04-2', name: 'Thermal Carafe', price: 32, originalPrice: 42, discount: 24, cover: '/images/14.jpg', description: 'Insulated replacement carafe' },
    { id: 'combo-04-3', name: 'Water Filter Pack', price: 24, originalPrice: 32, discount: 25, cover: '/images/15.jpg', description: 'Pack of 6 charcoal filters' },
    { id: 'combo-04-4', name: 'Coffee Mug Set', price: 26, originalPrice: 34, discount: 24, cover: '/images/16.jpg', description: 'Set of 4 ceramic mugs' },
  ],
  'product-05': [
    { id: 'combo-05-1', name: 'Crumb Tray Set', price: 12, originalPrice: 16, discount: 25, cover: '/images/17.jpg', description: 'Replacement crumb trays' },
    { id: 'combo-05-2', name: 'Bagel Rack', price: 15, originalPrice: 20, discount: 25, cover: '/images/18.jpg', description: 'Extra wide bagel rack' },
    { id: 'combo-05-3', name: 'Bread Box', price: 28, originalPrice: 38, discount: 26, cover: '/images/10.jpg', description: 'Matching bread storage box' },
    { id: 'combo-05-4', name: 'Butter Dish', price: 18, originalPrice: 24, discount: 25, cover: '/images/11.jpg', description: 'Ceramic butter keeper' },
  ],
  'product-06': [
    { id: 'combo-06-1', name: 'Blade Set', price: 35, originalPrice: 45, discount: 22, cover: '/images/12.jpg', description: 'Complete blade replacement set' },
    { id: 'combo-06-2', name: 'Bowl Extension', price: 42, originalPrice: 55, discount: 24, cover: '/images/13.jpg', description: 'Extra large processing bowl' },
    { id: 'combo-06-3', name: 'Spiralizer Attachment', price: 28, originalPrice: 38, discount: 26, cover: '/images/14.jpg', description: 'Vegetable spiralizer add-on' },
    { id: 'combo-06-4', name: 'Storage Container Set', price: 22, originalPrice: 30, discount: 27, cover: '/images/15.jpg', description: 'Stackable storage containers' },
  ],
};

const products = [
  {
    id: 'product-01',
    name: 'Premium Smart Blender',
    category: 'Kitchen Essentials',
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
    colors: ['#1a1a1a', '#c4c4c4', '#8b4513'],
  },
  {
    id: 'product-02',
    name: 'Electric Kettle Pro',
    category: 'Kitchen Appliances',
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
    colors: ['#1a1a1a', '#ffffff', '#d4af37'],
  },
  {
    id: 'product-03',
    name: 'Air Fryer Deluxe XL',
    category: 'Cooking Appliances',
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
    colors: ['#1a1a1a', '#c4c4c4'],
  },
  {
    id: 'product-04',
    name: 'Artisan Coffee Maker',
    category: 'Coffee & Tea',
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
    colors: ['#1a1a1a', '#8b0000', '#c4c4c4'],
  },
  {
    id: 'product-05',
    name: 'Toaster Elite 4-Slice',
    category: 'Breakfast Essentials',
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
    colors: ['#c4c4c4', '#1a1a1a'],
  },
  {
    id: 'product-06',
    name: 'Food Processor Ultra',
    category: 'Kitchen Essentials',
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
    colors: ['#1a1a1a', '#ffffff', '#c4c4c4'],
  },
  {
    id: 'product-07',
    name: 'Smart Induction Cooktop',
    category: 'Cooking Appliances',
    price: 329,
    originalPrice: 399,
    discount: 18,
    cover: '/images/7.jpg',
    gallery: ['/images/7.jpg', '/images/8.jpg', '/images/9.jpg', '/images/10.jpg', '/images/11.jpg', '/images/7.jpg'],
    description: 'Experience precision cooking with our advanced induction technology. Perfect for modern kitchens.',
    features: [
      'Precise temperature control',
      'Energy efficient',
      'Easy-clean glass surface'
    ],
    rating: 4.7,
    reviews: 67,
    colors: ['#1a1a1a', '#c4c4c4'],
  },
  {
    id: 'product-08',
    name: 'Stand Mixer Professional',
    category: 'Baking Essentials',
    price: 449,
    originalPrice: 549,
    discount: 18,
    cover: '/images/8.jpg',
    gallery: ['/images/8.jpg', '/images/9.jpg', '/images/10.jpg', '/images/11.jpg', '/images/12.jpg', '/images/8.jpg'],
    description: 'Professional-grade stand mixer for all your baking needs. Powerful and versatile.',
    features: [
      '500W powerful motor',
      '10 speed settings',
      'Includes 3 attachments'
    ],
    rating: 4.9,
    reviews: 156,
    colors: ['#cc0000', '#1a1a1a', '#ffffff', '#4169e1'],
  },
  {
    id: 'product-09',
    name: 'Electric Pressure Cooker',
    category: 'Cooking Appliances',
    price: 189,
    originalPrice: 229,
    discount: 17,
    cover: '/images/9.jpg',
    gallery: ['/images/9.jpg', '/images/10.jpg', '/images/11.jpg', '/images/12.jpg', '/images/13.jpg', '/images/9.jpg'],
    description: 'Cook meals up to 70% faster with our multi-function pressure cooker.',
    features: [
      '8 quart capacity',
      '14 smart programs',
      'Keep warm function'
    ],
    rating: 4.6,
    reviews: 89,
    colors: ['#c4c4c4', '#1a1a1a'],
  },
  {
    id: 'product-10',
    name: 'Immersion Blender Set',
    category: 'Kitchen Essentials',
    price: 79,
    originalPrice: 99,
    discount: 20,
    cover: '/images/10.jpg',
    gallery: ['/images/10.jpg', '/images/11.jpg', '/images/12.jpg', '/images/13.jpg', '/images/14.jpg', '/images/10.jpg'],
    description: 'Versatile hand blender with multiple attachments for blending, chopping, and whisking.',
    features: [
      'Powerful 400W motor',
      '5 attachments included',
      'Variable speed control'
    ],
    rating: 4.5,
    reviews: 42,
    colors: ['#1a1a1a', '#ffffff'],
  },
  {
    id: 'product-11',
    name: 'Rice Cooker Smart',
    category: 'Cooking Appliances',
    price: 129,
    originalPrice: 159,
    discount: 19,
    cover: '/images/11.jpg',
    gallery: ['/images/11.jpg', '/images/12.jpg', '/images/13.jpg', '/images/14.jpg', '/images/15.jpg', '/images/11.jpg'],
    description: 'Perfect rice every time with our smart fuzzy logic technology.',
    features: [
      '10 cup capacity',
      '15 cooking settings',
      'Delay timer up to 24 hours'
    ],
    rating: 4.7,
    reviews: 73,
    colors: ['#ffffff', '#c4c4c4'],
  },
  {
    id: 'product-12',
    name: 'Electric Grill Indoor',
    category: 'Grilling & BBQ',
    price: 159,
    originalPrice: 199,
    discount: 20,
    cover: '/images/12.jpg',
    gallery: ['/images/12.jpg', '/images/13.jpg', '/images/14.jpg', '/images/15.jpg', '/images/16.jpg', '/images/12.jpg'],
    description: 'Enjoy grilling year-round with our smokeless indoor electric grill.',
    features: [
      'Non-stick grill plates',
      'Adjustable temperature',
      'Removable drip tray'
    ],
    rating: 4.4,
    reviews: 58,
    colors: ['#1a1a1a', '#c4c4c4'],
  },
];

// Featured section data
const featuredItems = [
  {
    id: 'featured-1',
    title: 'New Arrivals',
    subtitle: 'Discover the latest in kitchen innovation',
    image: '/images/13.jpg',
    video: '/videos/sample_vid.mp4',
    link: '/collections?category=new',
  },
  {
    id: 'featured-2',
    title: 'Best Sellers',
    subtitle: 'Top-rated products loved by thousands',
    image: '/images/14.jpg',
    video: '/videos/example1.mp4',
    link: '/collections?category=best-sellers',
  },
  {
    id: 'featured-3',
    title: 'Kitchen Essentials',
    subtitle: 'Everything you need for a modern kitchen',
    image: '/images/15.jpg',
    video: '/videos/example2.mp4',
    link: '/collections?category=essentials',
  },
  {
    id: 'featured-4',
    title: 'Smart Appliances',
    subtitle: 'Technology meets culinary excellence',
    image: '/images/16.jpg',
    video: '/videos/example3.mp4',
    link: '/collections?category=smart',
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
  const { isAuthenticated, user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
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
  const [detailsQuantity, setDetailsQuantity] = useState(1);
  const [shouldOpenCart, setShouldOpenCart] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');
  const [specsVisible, setSpecsVisible] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [zoomActive, setZoomActive] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const lastScrollY = useRef(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  
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
    setDetailsQuantity(1); // Reset quantity when opening new product
    setSpecsVisible(false); // Reset specs visibility
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
          // Trigger specs fade-in animation after panel opens
          setTimeout(() => setSpecsVisible(true), 300);
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
    setSpecsVisible(false); // Hide specs immediately

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
    // Check if user is authenticated
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    
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
  }, [isAuthenticated, cartButtonAnimationEnter]);

  const addToCartFromDetails = useCallback(() => {
    if (!selectedProduct) return;
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      closeDetails();
      return;
    }
    
    setCartItems(prevItems => {
      const existingItem = prevItems.find((item) => item.id === selectedProduct.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === selectedProduct.id ? { ...item, quantity: item.quantity + detailsQuantity } : item
        );
      } else {
        return [...prevItems, { ...selectedProduct, quantity: detailsQuantity }];
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
  }, [selectedProduct, isAuthenticated, detailsQuantity]);

  const buyNowFromDetails = useCallback(() => {
    if (!selectedProduct) return;
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      closeDetails();
      return;
    }
    
    // Add to cart first with selected quantity
    setCartItems(prevItems => {
      const existingItem = prevItems.find((item) => item.id === selectedProduct.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === selectedProduct.id ? { ...item, quantity: item.quantity + detailsQuantity } : item
        );
      } else {
        return [...prevItems, { ...selectedProduct, quantity: detailsQuantity }];
      }
    });
    
    // Close details panel and open cart
    closeDetails();
    setTimeout(() => {
      openCart();
    }, 800);
  }, [selectedProduct, openCart, isAuthenticated, detailsQuantity]);

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

  // Handle quantity change in details panel
  const handleDetailsQuantityChange = useCallback((delta: number) => {
    setDetailsQuantity(prev => {
      const newQty = prev + delta;
      return newQty < 1 ? 1 : newQty > 99 ? 99 : newQty;
    });
  }, []);

  // Handle image change and reset specs animation
  const handleImageChange = useCallback((index: number) => {
    setSpecsVisible(false);
    setMainImageIndex(index);
    // Trigger fade-in after a small delay
    setTimeout(() => setSpecsVisible(true), 150);
  }, []);

  // Handle mouse move for zoom effect
  const handleZoomMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroImageRef.current) return;
    
    const rect = heroImageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x, y });
  }, []);

  // Handle mouse enter/leave for zoom
  const handleZoomMouseEnter = useCallback(() => {
    setZoomActive(true);
  }, []);

  const handleZoomMouseLeave = useCallback(() => {
    setZoomActive(false);
  }, []);

  // Open lightbox
  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.classList.add('locked');
  }, []);

  // Close lightbox
  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.classList.remove('locked');
  }, []);

  // Navigate lightbox
  const lightboxPrev = useCallback(() => {
    if (selectedProduct) {
      setLightboxIndex((prev) => (prev - 1 + selectedProduct.gallery.length) % selectedProduct.gallery.length);
    }
  }, [selectedProduct]);

  const lightboxNext = useCallback(() => {
    if (selectedProduct) {
      setLightboxIndex((prev) => (prev + 1) % selectedProduct.gallery.length);
    }
  }, [selectedProduct]);

  // Handle keyboard navigation in lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        lightboxPrev();
      } else if (e.key === 'ArrowRight') {
        lightboxNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, closeLightbox, lightboxPrev, lightboxNext]);

  // Add similar product to cart
  const addSimilarProductToCart = useCallback((product: typeof products[0]) => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    
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
    
    // Brief visual feedback
    cartButtonAnimationEnter();
  }, [isAuthenticated, cartButtonAnimationEnter]);

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
            <Link
              href={isAuthenticated ? "/dashboard" : "/account?redirect=/store"}
              className="store-header__icon icon-bulge"
              title={isAuthenticated ? `${user?.firstName}'s Dashboard` : "Sign In"}
            >
              {isAuthenticated ? (
                <div className="user-avatar">
                  {user?.firstName?.charAt(0).toUpperCase()}
                </div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              )}
            </Link>

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
                style={{ zIndex: products.length + 1 - index }}
              >
                <div
                  className="products__images"
                  onClick={() => openDetails(product)}
                  style={{ cursor: 'pointer' }}
                >
                  <Image
                    src={product.cover}
                    alt={product.name}
                    fill
                    className="products__main-image"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  
                  {/* Quick Add Button - appears on hover */}
                  <button
                    type="button"
                    className="products__quick-add"
                    onClick={(e) => {
                      e.stopPropagation();
                      const productElement = (e.target as HTMLElement).closest('.product-item') as HTMLElement;
                      if (productElement) addToCart(product, productElement);
                    }}
                  >
                    Quick Add
                  </button>
                  
                  {/* Gallery for animation */}
                  <div className="product-gallery products__gallery">
                    {product.gallery.map((img, i) => (
                      <Image
                        key={i}
                        src={img}
                        alt={`${product.name} gallery ${i + 1}`}
                        fill
                        className="product-gallery-item products__gallery-item"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                    ))}
                  </div>
                </div>

                <div className="products__info">
                  {/* Price Row - Green sale price, strikethrough original with discount */}
                  <div className="products__price-row">
                    <span className="products__sale-price">${product.price}</span>
                    <span className="products__original-price">${product.originalPrice}</span>
                    <span className="products__discount-tag">-{product.discount}%</span>
                  </div>
                  
                  {/* Product Name */}
                  <span className="products__name">{product.name}</span>
                  
                  {/* Category */}
                  <span className="products__category">{product.category}</span>
                  
                  {/* Color Variants */}
                  <div className="products__colors">
                    {product.colors?.map((color, i) => (
                      <span
                        key={i}
                        className="products__color-dot"
                        style={{ backgroundColor: color }}
                        title={`Color option ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Featured Section */}
        <div id="featured" className="featured-section">
          <h2 className="featured-section__title">Featured</h2>
          <div className="featured-section__grid">
            {featuredItems.map((item) => (
              <Link key={item.id} href={item.link} className="featured-card">
                <div className="featured-card__media">
                  {item.video ? (
                    <video
                      className="featured-card__video"
                      autoPlay
                      muted
                      loop
                      playsInline
                    >
                      <source src={item.video} type="video/mp4" />
                    </video>
                  ) : (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="featured-card__image"
                    />
                  )}
                  <div className="featured-card__overlay" />
                </div>
                <div className="featured-card__content">
                  <span className="featured-card__subtitle">{item.subtitle}</span>
                  <h3 className="featured-card__title">{item.title}</h3>
                  <span className="featured-card__cta">
                    Shop
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Product Details Panel - Amazon-style 3-column Layout */}
      <aside ref={detailsRef} className="details-panel">
        <div ref={detailsBgRef} className="details-panel__bg" onClick={closeDetails} />
        
        <div className="details-panel__inner">
          <button ref={detailsCloseRef} className="details-panel__close" onClick={closeDetails}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <div ref={detailsInnerBgRef} className="details-panel__inner-bg" />

          {selectedProduct && (
            <div className="details-panel__content">
              {/* Breadcrumb */}
              <div className="details-panel__breadcrumb">
                <Link href="/store">Store</Link>
                <span className="separator">›</span>
                <Link href="/collections">Kitchen Appliances</Link>
                <span className="separator">›</span>
                <span className="current">{selectedProduct.name}</span>
              </div>

              {/* Amazon-style 3-Column Layout */}
              <div className="details-panel__amazon-layout">
                {/* Left Column - Vertical Thumbnail Strip */}
                <div className="details-panel__thumb-column">
                  {selectedProduct.gallery.slice(0, 6).map((img, i) => (
                    <button
                      key={i}
                      className={`details-panel__thumb-vertical ${mainImageIndex === i ? 'active' : ''}`}
                      onClick={() => handleImageChange(i)}
                      onMouseEnter={() => handleImageChange(i)}
                    >
                      <Image src={img} alt={`View ${i + 1}`} fill className="details-panel__thumb-img" />
                    </button>
                  ))}
                </div>

                {/* Center Column - Main Product Image with Zoom */}
                <div className="details-panel__image-column">
                  <div
                    ref={heroImageRef}
                    className={`details-panel__main-image ${zoomActive ? 'zoom-active' : ''}`}
                    onMouseMove={handleZoomMouseMove}
                    onMouseEnter={handleZoomMouseEnter}
                    onMouseLeave={handleZoomMouseLeave}
                    onClick={() => openLightbox(mainImageIndex)}
                  >
                    <Image
                      src={selectedProduct.gallery[mainImageIndex]}
                      alt={selectedProduct.name}
                      fill
                      className="details-panel__main-img"
                      priority
                      style={zoomActive ? {
                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        transform: 'scale(2.5)',
                      } : undefined}
                    />
                    
                    {/* Zoom lens indicator */}
                    {zoomActive && (
                      <div
                        className="zoom-lens"
                        style={{
                          left: `${zoomPosition.x}%`,
                          top: `${zoomPosition.y}%`,
                        }}
                      />
                    )}
                    
                    {/* Animated Specification Labels - Hidden during zoom */}
                    {!zoomActive && (
                      <div className="details-panel__spec-labels">
                        {(productSpecifications[selectedProduct.id]?.[mainImageIndex] || productSpecifications[selectedProduct.id]?.[0] || []).map((spec, idx) => (
                          <div
                            key={`${mainImageIndex}-${idx}`}
                            className={`spec-label ${specsVisible ? 'visible' : ''}`}
                            style={{
                              ...spec.position,
                              transitionDelay: `${spec.delay}s`,
                            }}
                          >
                            <span className="spec-label__line" />
                            <span className="spec-label__text">{spec.text}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Click to zoom hint */}
                    {!zoomActive && (
                      <div className="details-panel__zoom-hint">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="11" cy="11" r="8" />
                          <path d="m21 21-4.35-4.35" />
                          <line x1="11" y1="8" x2="11" y2="14" />
                          <line x1="8" y1="11" x2="14" y2="11" />
                        </svg>
                        <span>Roll over image to zoom in</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Product Details & Buy Box */}
                <div className="details-panel__info-column">
                  {/* Product Title */}
                  <h1 className="details-panel__product-title">{selectedProduct.name}</h1>
                  
                  {/* Store/Brand Link */}
                  <div className="details-panel__store-link">
                    Visit the <Link href="/store">KBS Store</Link>
                  </div>
                  
                  {/* Ratings Row */}
                  <div className="details-panel__ratings-row">
                    <span className="details-panel__rating-number">{selectedProduct.rating}</span>
                    <div className="details-panel__stars">
                      {renderStars(selectedProduct.rating)}
                    </div>
                    <Link href="#reviews" className="details-panel__rating-link">
                      {selectedProduct.reviews} ratings
                    </Link>
                  </div>
                  
                  <div className="details-panel__divider" />
                  
                  {/* Price Section */}
                  <div className="details-panel__price-section">
                    <div className="details-panel__price-row">
                      <span className="details-panel__price-label">Deal Price:</span>
                      <span className="details-panel__price-symbol">$</span>
                      <span className="details-panel__price-amount">{selectedProduct.price}</span>
                    </div>
                    <div className="details-panel__mrp-row">
                      <span className="details-panel__mrp-label">M.R.P.:</span>
                      <span className="details-panel__mrp-price">${selectedProduct.originalPrice}</span>
                      <span className="details-panel__discount-badge">-{selectedProduct.discount}% off</span>
                    </div>
                    <div className="details-panel__tax-note">Inclusive of all taxes</div>
                  </div>
                  
                  <div className="details-panel__divider" />
                  
                  {/* About This Item */}
                  <div className="details-panel__about-section">
                    <h3 className="details-panel__about-title">About this item</h3>
                    <ul className="details-panel__about-list">
                      {selectedProduct.features.map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                      <li>{selectedProduct.description}</li>
                    </ul>
                  </div>
                </div>

                {/* Far Right Column - Buy Box */}
                <div className="details-panel__buy-box">
                  {/* Price in Buy Box */}
                  <div className="details-panel__buybox-price">
                    <span className="details-panel__buybox-symbol">$</span>
                    <span className="details-panel__buybox-amount">{selectedProduct.price}</span>
                  </div>
                  
                  {/* Delivery Info */}
                  <div className="details-panel__delivery-info">
                    <div className="details-panel__delivery-row">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="1" y="3" width="15" height="13" />
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                        <circle cx="5.5" cy="18.5" r="2.5" />
                        <circle cx="18.5" cy="18.5" r="2.5" />
                      </svg>
                      <div>
                        <span className="details-panel__delivery-label">FREE delivery</span>
                        <span className="details-panel__delivery-date">Tomorrow, Jan 5</span>
                      </div>
                    </div>
                    <div className="details-panel__delivery-row">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <Link href="/shipping">Deliver to your location</Link>
                    </div>
                  </div>
                  
                  {/* Stock Status */}
                  <div className="details-panel__stock-status">
                    <span className="in-stock">In Stock</span>
                  </div>
                  
                  {/* Quantity Selector */}
                  <div className="details-panel__quantity-row">
                    <label>Qty:</label>
                    <div className="details-panel__quantity-select">
                      <button
                        className="details-panel__qty-btn"
                        onClick={() => handleDetailsQuantityChange(-1)}
                        disabled={detailsQuantity <= 1}
                      >
                        −
                      </button>
                      <span className="details-panel__qty-value">{detailsQuantity}</span>
                      <button
                        className="details-panel__qty-btn"
                        onClick={() => handleDetailsQuantityChange(1)}
                        disabled={detailsQuantity >= 99}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  {/* Add to Cart Button - Amazon Orange Style */}
                  <button className="details-panel__add-cart-btn" onClick={addToCartFromDetails}>
                    Add to Cart
                  </button>
                  
                  {/* Buy Now Button - Amazon Yellow Style */}
                  <button className="details-panel__buy-now-btn" onClick={buyNowFromDetails}>
                    Buy Now
                  </button>
                  
                  {/* Secure Transaction */}
                  <div className="details-panel__secure-row">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <span>Secure transaction</span>
                  </div>
                  
                  {/* Seller Info */}
                  <div className="details-panel__seller-info">
                    <div className="details-panel__seller-row">
                      <span className="label">Ships from</span>
                      <span className="value">KBS Store</span>
                    </div>
                    <div className="details-panel__seller-row">
                      <span className="label">Sold by</span>
                      <span className="value">KBS Official</span>
                    </div>
                  </div>
                  
                  {/* Add to Wishlist */}
                  <button className="details-panel__wishlist-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    Add to Wish List
                  </button>
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

              {/* Combo Items - Accessories for this product */}
              <div className="details-panel__similar">
                <h3>Frequently Bought Together</h3>
                <p className="details-panel__combo-subtitle">Complete your purchase with these accessories</p>
                <div className="details-panel__similar-grid">
                  {(productComboItems[selectedProduct.id] || []).map((combo) => (
                    <div key={combo.id} className="details-panel__similar-item">
                      <div className="details-panel__similar-image">
                        <Image src={combo.cover} alt={combo.name} fill />
                        <span className="details-panel__similar-discount">-{combo.discount}%</span>
                      </div>
                      <div className="details-panel__similar-info">
                        <span className="details-panel__similar-name">{combo.name}</span>
                        <span className="details-panel__combo-desc">{combo.description}</span>
                        <div className="details-panel__similar-price">
                          <span className="original">${combo.originalPrice}</span>
                          <span className="current">${combo.price}</span>
                        </div>
                      </div>
                      <button
                        className="details-panel__similar-add icon-bulge"
                        onClick={() => {
                          if (!isAuthenticated) {
                            setShowLoginPrompt(true);
                            return;
                          }
                          setCartItems(prevItems => {
                            const existingItem = prevItems.find((item) => item.id === combo.id);
                            if (existingItem) {
                              return prevItems.map((item) =>
                                item.id === combo.id ? { ...item, quantity: item.quantity + 1 } : item
                              );
                            } else {
                              return [...prevItems, { id: combo.id, name: combo.name, price: combo.price, cover: combo.cover, quantity: 1 }];
                            }
                          });
                          cartButtonAnimationEnter();
                        }}
                        title="Add to Cart"
                      >
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

    {/* Image Lightbox Modal */}
    {lightboxOpen && selectedProduct && (
      <div className="lightbox-overlay" onClick={closeLightbox}>
        <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
          {/* Close button */}
          <button className="lightbox-close" onClick={closeLightbox}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          
          {/* Navigation arrows */}
          <button className="lightbox-nav lightbox-prev" onClick={lightboxPrev}>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          
          <button className="lightbox-nav lightbox-next" onClick={lightboxNext}>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
          
          {/* Main image */}
          <div className="lightbox-image-container">
            <Image
              src={selectedProduct.gallery[lightboxIndex]}
              alt={`${selectedProduct.name} - View ${lightboxIndex + 1}`}
              fill
              className="lightbox-image"
              priority
            />
          </div>
          
          {/* Thumbnail strip */}
          <div className="lightbox-thumbs">
            {selectedProduct.gallery.map((img, i) => (
              <button
                key={i}
                className={`lightbox-thumb ${lightboxIndex === i ? 'active' : ''}`}
                onClick={() => setLightboxIndex(i)}
              >
                <Image src={img} alt={`View ${i + 1}`} fill className="lightbox-thumb-img" />
              </button>
            ))}
          </div>
          
          {/* Image counter */}
          <div className="lightbox-counter">
            {lightboxIndex + 1} / {selectedProduct.gallery.length}
          </div>
        </div>
      </div>
    )}

    {/* Login Prompt Modal */}
    {showLoginPrompt && (
      <div className="login-prompt-overlay" onClick={() => setShowLoginPrompt(false)}>
        <div className="login-prompt-modal" onClick={e => e.stopPropagation()}>
          <button
            className="login-prompt-close"
            onClick={() => setShowLoginPrompt(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <div className="login-prompt-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h3 className="login-prompt-title">Sign In Required</h3>
          <p className="login-prompt-message">
            Please sign in or create an account to add items to your cart and make purchases.
          </p>
          <div className="login-prompt-buttons">
            <Link
              href="/account?redirect=/store"
              className="login-prompt-btn primary"
              onClick={() => setShowLoginPrompt(false)}
            >
              Sign In
            </Link>
            <button
              className="login-prompt-btn secondary"
              onClick={() => setShowLoginPrompt(false)}
            >
              Continue Browsing
            </button>
          </div>
        </div>
      </div>
    )}

      {/* Styles */}
      <style jsx global>{`
        /* Store Page Styles */
        .store-page {
          min-height: 100vh;
          background: #F5F0E6;
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
          background: #F5F0E6;
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
          background: rgba(245, 240, 230, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 50px;
          border: 1px solid rgba(229, 224, 214, 0.5);
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

        /* User Avatar */
        .user-avatar {
          width: clamp(24px, 3vw, 28px);
          height: clamp(24px, 3vw, 28px);
          border-radius: 50%;
          background: linear-gradient(135deg, #4A90D9 0%, #357abd 100%);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: clamp(11px, 1.3vw, 13px);
          font-weight: 600;
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

        /* Products Grid - Adidas Style 4-Column Layout */
        .products {
          width: 100%;
        }

        .products__list {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: clamp(12px, 1.5vw, 16px);
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .products__item {
          display: flex;
          flex-direction: column;
          gap: 0;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .products__item:hover {
          transform: translateY(-4px);
        }

        .products__item:hover .products__quick-add {
          opacity: 1;
          transform: translateY(0);
        }

        .products__images {
          position: relative;
          aspect-ratio: 1;
          overflow: hidden;
          background: #f0f0f0;
        }

        .products__main-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .products__item:hover .products__main-image {
          transform: scale(1.05);
        }

        /* Quick Add Button - Adidas Style */
        .products__quick-add {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 14px 20px;
          background: #000;
          color: #fff;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          border: none;
          cursor: pointer;
          opacity: 0;
          transform: translateY(100%);
          transition: all 0.3s ease;
          z-index: 5;
        }

        .products__quick-add:hover {
          background: #333;
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
          pointer-events: none;
          z-index: 10;
        }

        .products__gallery-item {
          width: 100%;
          height: 100%;
          object-fit: cover;
          grid-area: gallery;
          will-change: transform, opacity;
        }

        /* Product Info - Adidas Style */
        .products__info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 12px 0;
        }

        .products__price-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .products__sale-price {
          font-size: 14px;
          font-weight: 700;
          color: #008a00;
        }

        .products__original-price {
          font-size: 13px;
          color: #767677;
          text-decoration: line-through;
        }

        .products__discount-tag {
          font-size: 13px;
          font-weight: 600;
          color: #d9001b;
        }

        .products__name {
          font-size: 13px;
          font-weight: 400;
          color: #000;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .products__category {
          font-size: 13px;
          color: #767677;
          line-height: 1.3;
        }

        .products__colors {
          display: flex;
          gap: 6px;
          margin-top: 8px;
        }

        .products__color-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 1px solid #e0e0e0;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .products__color-dot:hover {
          transform: scale(1.15);
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

        /* ===== FEATURED SECTION - Nike Style ===== */
        .featured-section {
          margin-top: clamp(48px, 8vh, 80px);
          padding-bottom: clamp(32px, 5vh, 60px);
        }

        .featured-section__title {
          font-size: clamp(28px, 5vw, 42px);
          font-weight: 500;
          color: #000;
          margin: 0 0 clamp(20px, 3vh, 32px) 0;
          letter-spacing: -0.02em;
        }

        .featured-section__grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: clamp(12px, 1.5vw, 20px);
        }

        .featured-card {
          position: relative;
          display: block;
          aspect-ratio: 16/9;
          overflow: hidden;
          text-decoration: none;
        }

        .featured-card__media {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .featured-card__video,
        .featured-card__image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .featured-card:hover .featured-card__video,
        .featured-card:hover .featured-card__image {
          transform: scale(1.05);
        }

        .featured-card__overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.6) 0%,
            rgba(0, 0, 0, 0.2) 40%,
            rgba(0, 0, 0, 0) 70%
          );
        }

        .featured-card__content {
          position: absolute;
          bottom: 0;
          left: 0;
          padding: clamp(20px, 3vw, 40px);
          color: #fff;
          z-index: 2;
        }

        .featured-card__subtitle {
          display: block;
          font-size: clamp(12px, 1.4vw, 14px);
          color: rgba(255, 255, 255, 0.85);
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .featured-card__title {
          font-size: clamp(24px, 4vw, 40px);
          font-weight: 600;
          margin: 0 0 clamp(12px, 2vh, 20px) 0;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        .featured-card__cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: clamp(14px, 1.6vw, 16px);
          font-weight: 500;
          color: #fff;
          background: #000;
          padding: clamp(10px, 1.5vw, 14px) clamp(20px, 2.5vw, 28px);
          border-radius: 30px;
          transition: all 0.3s ease;
        }

        .featured-card:hover .featured-card__cta {
          background: #333;
          gap: 12px;
        }

        .featured-card__cta svg {
          transition: transform 0.3s ease;
        }

        .featured-card:hover .featured-card__cta svg {
          transform: translateX(4px);
        }

        /* ===== PRODUCT DETAILS PANEL - AMAZON STYLE ===== */
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
          background-color: rgba(245, 240, 230, 0.95);
          pointer-events: auto;
          cursor: pointer;
        }

        .details-panel__inner {
          position: absolute;
          top: 0;
          right: 0;
          width: 100%;
          height: 100%;
          overflow-y: auto;
          padding: clamp(16px, 3vw, 32px);
          pointer-events: auto;
        }

        .details-panel__inner-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #fff;
          z-index: 0;
        }

        .details-panel__close {
          position: fixed;
          top: clamp(16px, 2.5vw, 24px);
          right: clamp(16px, 2.5vw, 24px);
          cursor: pointer;
          z-index: 10;
          background: #fff;
          border: 1px solid #ddd;
          color: #333;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
        }

        .details-panel__close:hover {
          background: #f5f5f5;
          border-color: #999;
          transform: scale(1.05);
        }

        .details-panel__content {
          position: relative;
          z-index: 1;
          max-width: 1500px;
          margin: 0 auto;
          padding-top: 20px;
        }

        /* Breadcrumb */
        .details-panel__breadcrumb {
          font-size: 12px;
          color: #007185;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: nowrap;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .details-panel__breadcrumb::-webkit-scrollbar {
          display: none;
        }

        .details-panel__breadcrumb a {
          color: #007185;
          text-decoration: none;
          flex-shrink: 0;
          white-space: nowrap;
        }

        .details-panel__breadcrumb a:hover {
          color: #c45500;
          text-decoration: underline;
        }

        .details-panel__breadcrumb .separator {
          color: #565959;
          flex-shrink: 0;
        }

        .details-panel__breadcrumb .current {
          color: #565959;
          flex-shrink: 0;
          white-space: nowrap;
        }

        /* Amazon-style 4-Column Layout */
        .details-panel__amazon-layout {
          display: grid;
          grid-template-columns: 60px 1fr 1fr 280px;
          gap: 20px;
          margin-bottom: 40px;
        }

        /* Left Column - Vertical Thumbnails */
        .details-panel__thumb-column {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .details-panel__thumb-vertical {
          position: relative;
          width: 56px;
          height: 56px;
          border: 1px solid #ddd;
          border-radius: 4px;
          overflow: hidden;
          cursor: pointer;
          background: #fff;
          padding: 2px;
          transition: all 0.2s ease;
        }

        .details-panel__thumb-vertical:hover {
          border-color: #007185;
        }

        .details-panel__thumb-vertical.active {
          border-color: #007185;
          border-width: 2px;
          padding: 1px;
        }

        .details-panel__thumb-img {
          object-fit: contain;
        }

        /* Center Column - Main Image */
        .details-panel__image-column {
          display: flex;
          align-items: flex-start;
          justify-content: center;
        }

        .details-panel__main-image {
          position: relative;
          width: 100%;
          max-width: 500px;
          aspect-ratio: 1;
          background: #fff;
          border: 1px solid #eee;
          border-radius: 4px;
          overflow: hidden;
          cursor: crosshair;
        }

        .details-panel__main-image.zoom-active {
          cursor: none;
        }

        .details-panel__main-img {
          object-fit: contain;
          transition: transform 0.15s ease-out;
          will-change: transform;
        }

        /* Zoom lens indicator */
        .zoom-lens {
          position: absolute;
          width: 120px;
          height: 120px;
          border: 2px solid rgba(0, 113, 133, 0.5);
          border-radius: 50%;
          pointer-events: none;
          transform: translate(-50%, -50%);
          background: rgba(255, 255, 255, 0.15);
          box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
          z-index: 5;
        }

        /* Animated Specification Labels */
        .details-panel__spec-labels {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 2;
        }

        .spec-label {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 6px;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }

        .spec-label.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .spec-label__line {
          width: 25px;
          height: 1px;
          background: rgba(0, 0, 0, 0.4);
        }

        .spec-label__text {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: #333;
          letter-spacing: 0.05em;
          font-weight: 500;
          white-space: nowrap;
          background: rgba(255, 255, 255, 0.95);
          padding: 3px 8px;
          border-radius: 3px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
        }

        /* Zoom Hint */
        .details-panel__zoom-hint {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #007185;
          background: rgba(255, 255, 255, 0.95);
          padding: 6px 12px;
          border-radius: 4px;
          border: 1px solid #ddd;
        }

        .details-panel__zoom-hint svg {
          color: #007185;
        }

        /* Info Column - Product Details */
        .details-panel__info-column {
          padding-right: 20px;
        }

        .details-panel__product-title {
          font-size: clamp(18px, 2.5vw, 24px);
          font-weight: 400;
          line-height: 1.4;
          color: #0f1111;
          margin: 0 0 8px 0;
        }

        .details-panel__store-link {
          font-size: 14px;
          color: #565959;
          margin-bottom: 8px;
        }

        .details-panel__store-link a {
          color: #007185;
          text-decoration: none;
        }

        .details-panel__store-link a:hover {
          color: #c45500;
          text-decoration: underline;
        }

        .details-panel__ratings-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .details-panel__rating-number {
          font-size: 14px;
          color: #007185;
          font-weight: 500;
        }

        .details-panel__stars {
          display: flex;
          gap: 1px;
        }

        .star {
          color: #ddd;
          font-size: 16px;
        }

        .star.filled {
          color: #ff9900;
        }

        .details-panel__rating-link {
          font-size: 14px;
          color: #007185;
          text-decoration: none;
        }

        .details-panel__rating-link:hover {
          color: #c45500;
          text-decoration: underline;
        }

        .details-panel__divider {
          height: 1px;
          background: #ddd;
          margin: 16px 0;
        }

        /* Price Section */
        .details-panel__price-section {
          margin-bottom: 16px;
        }

        .details-panel__price-row {
          display: flex;
          align-items: baseline;
          gap: 4px;
          margin-bottom: 4px;
        }

        .details-panel__price-label {
          font-size: 14px;
          color: #565959;
        }

        .details-panel__price-symbol {
          font-size: 14px;
          color: #0f1111;
          position: relative;
          top: -6px;
        }

        .details-panel__price-amount {
          font-size: 28px;
          color: #0f1111;
          font-weight: 400;
        }

        .details-panel__mrp-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        .details-panel__mrp-label {
          font-size: 14px;
          color: #565959;
        }

        .details-panel__mrp-price {
          font-size: 14px;
          color: #565959;
          text-decoration: line-through;
        }

        .details-panel__discount-badge {
          font-size: 14px;
          color: #cc0c39;
          font-weight: 500;
        }

        .details-panel__tax-note {
          font-size: 12px;
          color: #565959;
        }

        /* About This Item */
        .details-panel__about-section {
          margin-top: 16px;
        }

        .details-panel__about-title {
          font-size: 16px;
          font-weight: 700;
          color: #0f1111;
          margin: 0 0 12px 0;
        }

        .details-panel__about-list {
          list-style: disc;
          padding-left: 20px;
          margin: 0;
        }

        .details-panel__about-list li {
          font-size: 14px;
          color: #333;
          line-height: 1.6;
          margin-bottom: 8px;
        }

        /* Buy Box - Right Column */
        .details-panel__buy-box {
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          height: fit-content;
          position: sticky;
          top: 20px;
        }

        .details-panel__buybox-price {
          display: flex;
          align-items: baseline;
        }

        .details-panel__buybox-symbol {
          font-size: 14px;
          color: #0f1111;
          position: relative;
          top: -8px;
        }

        .details-panel__buybox-amount {
          font-size: 28px;
          color: #0f1111;
        }

        .details-panel__delivery-info {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .details-panel__delivery-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 14px;
          color: #0f1111;
        }

        .details-panel__delivery-row svg {
          flex-shrink: 0;
          color: #565959;
          margin-top: 2px;
        }

        .details-panel__delivery-row a {
          color: #007185;
          text-decoration: none;
        }

        .details-panel__delivery-row a:hover {
          color: #c45500;
          text-decoration: underline;
        }

        .details-panel__delivery-label {
          display: block;
          color: #0f1111;
        }

        .details-panel__delivery-date {
          display: block;
          font-weight: 700;
          color: #0f1111;
        }

        .details-panel__stock-status {
          font-size: 18px;
        }

        .details-panel__stock-status .in-stock {
          color: #007600;
        }

        .details-panel__quantity-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .details-panel__quantity-row label {
          font-size: 14px;
          color: #0f1111;
        }

        .details-panel__quantity-select {
          display: flex;
          align-items: center;
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
          background: #f0f2f2;
        }

        .details-panel__qty-btn {
          background: transparent;
          border: none;
          font-size: 16px;
          color: #0f1111;
          cursor: pointer;
          padding: 8px 14px;
          transition: background 0.2s ease;
        }

        .details-panel__qty-btn:hover:not(:disabled) {
          background: #e3e6e6;
        }

        .details-panel__qty-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .details-panel__qty-value {
          font-size: 14px;
          font-weight: 500;
          min-width: 30px;
          text-align: center;
          color: #0f1111;
          padding: 8px 0;
          border-left: 1px solid #ddd;
          border-right: 1px solid #ddd;
          background: #fff;
        }

        /* Add to Cart Button - Black Style */
        .details-panel__add-cart-btn {
          width: 100%;
          padding: 10px 18px;
          background: #111;
          border: 1px solid #111;
          border-radius: 20px;
          font-size: 14px;
          color: #fff;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .details-panel__add-cart-btn:hover {
          background: #333;
          border-color: #333;
        }

        /* Buy Now Button - Black Outline Style */
        .details-panel__buy-now-btn {
          width: 100%;
          padding: 10px 18px;
          background: transparent;
          border: 2px solid #111;
          border-radius: 20px;
          font-size: 14px;
          color: #111;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .details-panel__buy-now-btn:hover {
          background: #111;
          color: #fff;
        }

        .details-panel__secure-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #007185;
        }

        .details-panel__seller-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 12px;
        }

        .details-panel__seller-row {
          display: flex;
          gap: 8px;
        }

        .details-panel__seller-row .label {
          color: #565959;
        }

        .details-panel__seller-row .value {
          color: #007185;
        }

        .details-panel__wishlist-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 8px;
          background: transparent;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 13px;
          color: #0f1111;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .details-panel__wishlist-btn:hover {
          background: #f7f8f8;
          border-color: #999;
        }

        .details-panel__wishlist-btn svg {
          color: #565959;
        }

        /* Tabs - Updated for Amazon style */
        .details-panel__tabs {
          border-top: 1px solid #ddd;
          padding-top: 24px;
          margin-bottom: 32px;
          background: #fff;
          margin-left: -32px;
          margin-right: -32px;
          padding-left: 32px;
          padding-right: 32px;
        }

        .details-panel__tab-headers {
          display: flex;
          align-items: center;
          gap: 0;
          margin-bottom: 20px;
          border-bottom: 1px solid #ddd;
        }

        .details-panel__tab-btn {
          background: none;
          border: none;
          font-size: 14px;
          font-weight: 500;
          color: #565959;
          cursor: pointer;
          transition: color 0.2s ease;
          padding: 12px 20px;
          position: relative;
        }

        .details-panel__tab-btn.active {
          color: #c45500;
        }

        .details-panel__tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 3px;
          background: #c45500;
        }

        .details-panel__tab-btn:hover {
          color: #c45500;
        }

        .details-panel__tab-divider {
          display: none;
        }

        .details-panel__tab-content {
          font-size: 14px;
          line-height: 1.7;
          color: #333;
        }

        .details-panel__tab-content p {
          margin-bottom: 14px;
          color: #333;
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
          border-bottom: 1px solid #eee;
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
          border-bottom: 1px solid #eee;
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

        /* Similar Products */
        .details-panel__similar {
          padding: clamp(20px, 3vw, 32px);
          background: #EDE8DE;
          border-radius: clamp(12px, 2vw, 20px);
          border: 1px solid #E5E0D6;
        }

        .details-panel__similar h3 {
          font-size: clamp(18px, 2.5vw, 24px);
          font-weight: 500;
          margin-bottom: 8px;
          color: #111;
        }

        .details-panel__combo-subtitle {
          font-size: clamp(12px, 1.4vw, 14px);
          color: #565959;
          margin-bottom: clamp(16px, 2.5vw, 24px);
        }

        .details-panel__combo-desc {
          font-size: clamp(10px, 1.2vw, 12px);
          color: #565959;
          display: block;
          margin-bottom: 4px;
          line-height: 1.4;
        }

        .details-panel__similar-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: clamp(12px, 2vw, 20px);
        }

        .details-panel__similar-item {
          position: relative;
          background: #F5F0E6;
          border-radius: clamp(8px, 1.2vw, 12px);
          padding: 8px;
          transition: all 0.3s ease;
        }

        .details-panel__similar-item:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .details-panel__similar-image {
          position: relative;
          aspect-ratio: 1;
          border-radius: clamp(6px, 1vw, 10px);
          overflow: hidden;
          margin-bottom: clamp(8px, 1.2vw, 12px);
          background: #EDE8DE;
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
          bottom: 8px;
          right: 8px;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #F5F0E6;
          border: 1px solid #E5E0D6;
          border-radius: 50%;
          cursor: pointer;
          color: #666;
          transition: all 0.3s ease;
        }

        .details-panel__similar-add:hover {
          border-color: #111;
          color: #111;
          background: #EDE8DE;
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
          background-color: rgba(245, 240, 230, 0.9);
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
          background: #F5F0E6;
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

        /* ===== LARGE DESKTOP (>1200px) ===== */
        @media (min-width: 1200px) {
          .details-panel__amazon-layout {
            grid-template-columns: 70px 1.2fr 1fr 320px;
            gap: 30px;
          }
          
          .details-panel__main-image {
            max-width: 550px;
          }
        }

        /* ===== TABLET BREAKPOINT (768px - 1199px) ===== */
        @media (min-width: 768px) and (max-width: 1199px) {
          .products__list {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .products__images {
            height: clamp(220px, 35vh, 350px);
          }
          
          .details-panel__amazon-layout {
            grid-template-columns: 50px 1fr 1fr;
            gap: 16px;
          }
          
          .details-panel__buy-box {
            grid-column: 1 / -1;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
            position: static;
          }
          
          .details-panel__buybox-price,
          .details-panel__delivery-info,
          .details-panel__stock-status {
            grid-column: 1 / -1;
          }
          
          .details-panel__main-image {
            max-width: 400px;
          }
          
          .details-panel__similar-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        /* ===== MOBILE BREAKPOINT (<768px) ===== */
        @media (max-width: 767px) {
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
          
          /* Featured Section - Full Width on Mobile */
          .featured-section__grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          .featured-card {
            aspect-ratio: 16/10;
          }
          
          .featured-card__content {
            padding: 20px;
          }
          
          .featured-card__title {
            font-size: 24px;
          }
          
          /* Details Panel - Mobile Layout */
          .details-panel__inner {
            padding: 60px 16px 24px;
          }
          
          .details-panel__close {
            top: 12px;
            right: 12px;
          }
          
          .details-panel__amazon-layout {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          .details-panel__thumb-column {
            flex-direction: row;
            overflow-x: auto;
            padding-bottom: 8px;
            order: 2;
          }
          
          .details-panel__thumb-vertical {
            width: 50px;
            height: 50px;
            flex-shrink: 0;
          }
          
          .details-panel__image-column {
            order: 1;
          }
          
          .details-panel__main-image {
            max-width: 100%;
            aspect-ratio: 1;
          }
          
          .details-panel__info-column {
            order: 3;
            padding-right: 0;
          }
          
          .details-panel__buy-box {
            order: 4;
            position: static;
          }
          
          .details-panel__product-title {
            font-size: 18px;
          }
          
          .details-panel__price-amount,
          .details-panel__buybox-amount {
            font-size: 22px;
          }
          
          .details-panel__zoom-hint {
            display: none;
          }
          
          .details-panel__similar-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          
          .spec-label__text {
            font-size: 9px;
            padding: 3px 6px;
          }
          
          .spec-label__line {
            width: 20px;
          }
          
          .details-panel__tabs {
            margin-left: -16px;
            margin-right: -16px;
            padding-left: 16px;
            padding-right: 16px;
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
          
          .details-panel__thumb-vertical {
            width: 45px;
            height: 45px;
          }
        }

        /* Locked body state */
        body.locked {
          overflow: hidden;
        }

        /* Login Prompt Modal */
        .login-prompt-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 20px;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .login-prompt-modal {
          background: #fff;
          border-radius: 16px;
          padding: clamp(24px, 4vw, 40px);
          max-width: 400px;
          width: 100%;
          text-align: center;
          position: relative;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .login-prompt-close {
          position: absolute;
          top: 12px;
          right: 12px;
          background: none;
          border: none;
          cursor: pointer;
          color: #999;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.3s ease;
        }

        .login-prompt-close:hover {
          color: #333;
        }

        .login-prompt-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f5f5f5 0%, #e5e5e5 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: #333;
        }

        .login-prompt-title {
          font-size: clamp(18px, 2.5vw, 24px);
          font-weight: 500;
          color: #111;
          margin: 0 0 12px 0;
        }

        .login-prompt-message {
          font-size: clamp(13px, 1.5vw, 15px);
          color: #666;
          line-height: 1.6;
          margin: 0 0 24px 0;
        }

        .login-prompt-buttons {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .login-prompt-btn {
          display: block;
          width: 100%;
          padding: clamp(12px, 1.5vw, 16px);
          border-radius: 50px;
          font-size: clamp(14px, 1.6vw, 16px);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          text-align: center;
          min-height: 44px;
        }

        .login-prompt-btn.primary {
          background: #111;
          color: #fff;
          border: none;
        }

        .login-prompt-btn.primary:hover {
          background: #333;
          transform: translateY(-2px);
        }

        .login-prompt-btn.secondary {
          background: transparent;
          color: #666;
          border: 1px solid #ddd;
        }

        .login-prompt-btn.secondary:hover {
          border-color: #999;
          color: #333;
        }
        /* ===== LIGHTBOX STYLES ===== */
        .lightbox-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.95);
          z-index: 3000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.3s ease;
        }

        .lightbox-content {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: clamp(40px, 5vh, 80px) clamp(60px, 8vw, 120px);
        }

        .lightbox-close {
          position: absolute;
          top: clamp(16px, 3vh, 32px);
          right: clamp(16px, 3vw, 32px);
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 50%;
          cursor: pointer;
          color: #fff;
          transition: all 0.3s ease;
          z-index: 10;
        }

        .lightbox-close:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }

        .lightbox-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 50%;
          cursor: pointer;
          color: #fff;
          transition: all 0.3s ease;
          z-index: 10;
        }

        .lightbox-nav:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-50%) scale(1.1);
        }

        .lightbox-prev {
          left: clamp(16px, 3vw, 32px);
        }

        .lightbox-next {
          right: clamp(16px, 3vw, 32px);
        }

        .lightbox-image-container {
          position: relative;
          width: 100%;
          height: calc(100% - 100px);
          max-width: 1200px;
        }

        .lightbox-image {
          object-fit: contain;
        }

        .lightbox-thumbs {
          position: absolute;
          bottom: clamp(16px, 3vh, 32px);
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: clamp(8px, 1vw, 12px);
          padding: 12px;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 12px;
          backdrop-filter: blur(10px);
        }

        .lightbox-thumb {
          position: relative;
          width: clamp(50px, 8vw, 70px);
          height: clamp(50px, 8vw, 70px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          padding: 0;
          background: transparent;
          transition: all 0.3s ease;
        }

        .lightbox-thumb:hover {
          border-color: rgba(255, 255, 255, 0.6);
        }

        .lightbox-thumb.active {
          border-color: #fff;
          box-shadow: 0 0 12px rgba(255, 255, 255, 0.4);
        }

        .lightbox-thumb-img {
          object-fit: cover;
        }

        .lightbox-counter {
          position: absolute;
          top: clamp(16px, 3vh, 32px);
          left: 50%;
          transform: translateX(-50%);
          font-size: clamp(14px, 1.5vw, 16px);
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
          letter-spacing: 0.1em;
        }

        /* Lightbox mobile adjustments */
        @media (max-width: 639px) {
          .lightbox-content {
            padding: 60px 16px 120px;
          }
          
          .lightbox-nav {
            width: 44px;
            height: 44px;
          }
          
          .lightbox-nav svg {
            width: 24px;
            height: 24px;
          }
          
          .lightbox-thumbs {
            gap: 6px;
            padding: 8px;
          }
          
          .lightbox-thumb {
            width: 45px;
            height: 45px;
          }
        }

        /* Disable zoom on touch devices */
        @media (hover: none) {
          .details-panel__hero-image {
            cursor: pointer;
          }
          
          .details-panel__hero-image.zoom-active .details-panel__hero-img {
            transform: none !important;
          }
          
          .zoom-lens {
            display: none;
          }
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