export const SITE_NAME = 'Country Drive';
export const LOGO_PATH = '/uploads/logo/Glossy Orange, White, and Teal Swoosh.png';
export const HERO_BANNER = '/uploads/Banners/Banner1.png?v=20261028';

export const BANNER_ICONS = {
  clock: '/uploads/banner_icons/Minimal White Clock Icon.png',
  shield: '/uploads/banner_icons/Shield Checkmark Emblem.png',
  rupee: '/uploads/banner_icons/White Rupee Symbol in Circular Icon.png',
  headset: '/uploads/banner_icons/White Headset Support Icon.png',
};

export const ICONS = {
  carOrange: '/uploads/icons/Minimal Orange Front-Facing Car Icon.png',
  scooty: '/uploads/icons/Glowing Neon Orange Scooter Icon.png',
  bike: '/uploads/icons/Vivid Orange Motorcycle Icon.png',
  location: '/uploads/icons/Glossy Neon Orange Location Pin.png',
  calendar: '/uploads/icons/Glossy Neon Orange Calendar Icon.png',
  clockOrange: '/uploads/icons/Glossy Neon Orange Clock Icon.png',
  carBlue: '/uploads/icons/Minimalist Blue Car Badge2.png',
  shieldBlue: '/uploads/icons/Blue Shield Verification Badge1.png',
  calendarBlue: '/uploads/icons/Glowing Blue Calendar Button1.png',
  rupeeBlue: '/uploads/icons/Glossy Blue Rupee Icon1.png',
  headsetBlue: '/uploads/icons/Minimal Blue Headset Icon.png',
  searchBlue: '/uploads/icons/Blue Search Icon on Soft Circular Badge2.png',
  carApp: '/uploads/icons/Modern Blue Car App Icon1.png',
};

export const benefits = [
  {
    icon: BANNER_ICONS.clock,
    title: 'Hourly Rentals',
    desc: 'Pay only for\nthe time you use'
  },
  {
    icon: BANNER_ICONS.shield,
    title: 'Verified Vehicles',
    desc: 'Well maintained\n& insured'
  },
  {
    icon: BANNER_ICONS.rupee,
    title: 'Affordable Prices',
    desc: 'Best rates in\nyour city'
  },
  {
    icon: BANNER_ICONS.headset,
    title: '24/7 Support',
    desc: "We're always\nhere to help"
  }
];

export const categories = [
  { id: 'all', name: 'All Vehicles', icon: ICONS.carOrange },
  { id: 'scooty', name: 'Scooty', icon: ICONS.scooty },
  { id: 'bike', name: 'Bike', icon: ICONS.bike },
  { id: 'car', name: 'Car', icon: ICONS.carOrange },
  { id: 'ev', name: 'EV', icon: ICONS.carOrange },
  { id: 'hybrid', name: 'Hybrid', icon: ICONS.carOrange },
  { id: 'diesel', name: 'Diesel', icon: ICONS.carOrange },
  { id: 'petrol', name: 'Petrol', icon: ICONS.carOrange },
];

export const navItems = [
  { label: 'Home', url: '#home' },
  { label: 'Vehicles', url: '#vehicles' },
  { label: 'Why Us', url: '#why-us' },
  { label: 'Top Picks', url: '#top-picks' },
  { label: 'Testimonials', url: '#testimonials' },
];

export const exploreCategories = [
  {
    name: 'Scooty',
    categoryKey: 'scooty',
    image: '/uploads/cards/Modern White Scooter Product Render.png',
    price: 49,
  },
  {
    name: 'Bike',
    categoryKey: 'bike',
    image: '/uploads/cards/Black and Orange Naked Street Motorcycle.png',
    price: 79,
  },
  {
    name: 'Car',
    categoryKey: 'car',
    image: '/uploads/cards/White Modern SUV Studio Render.png',
    price: 199,
  },
  {
    name: 'EV',
    categoryKey: 'ev',
    image: '/uploads/cards/Pastel Blue Modern Scooter Product Shot.png',
    price: 69,
  },
  {
    name: 'Hybrid',
    categoryKey: 'hybrid',
    image: '/uploads/cards/White Suzuki-Style MPV Studio Render.png',
    price: 249,
  },
  {
    name: 'Diesel',
    categoryKey: 'diesel',
    image: '/uploads/cards/Glossy Black Off-Road SUV on White.png',
    price: 299,
  },
];

export const vehiclesCatalog = [
  {
    id: 1,
    name: 'Pastel Blue Modern Scooter',
    type: 'Scooty',
    category: 'scooty',
    image: '/uploads/cards/Pastel Blue Modern Scooter Product Shot.png',
    price: 89,
    priceUnit: 'hour',
    seats: 2,
    fuel: 'Petrol',
    transmission: 'Automatic',
    rating: 4.8,
    reviews: 234,
    features: ['Helmet Included', 'Free Fuel 50km', '24/7 Roadside']
  },
  {
    id: 2,
    name: 'Modern White Scooter Pro',
    type: 'Scooty',
    category: 'scooty',
    image: '/uploads/cards/Modern White Scooter Product Render.png',
    price: 99,
    priceUnit: 'hour',
    seats: 2,
    fuel: 'Petrol',
    transmission: 'Automatic',
    rating: 4.9,
    reviews: 412,
    features: ['Helmet Included', 'Bluetooth', 'USB Charger']
  },
  {
    id: 3,
    name: 'Neo-Retro Motorcycle 150cc',
    type: 'Bike',
    category: 'bike',
    image: '/uploads/cards/Black and Orange Neo-Retro Motorcycle1.png',
    price: 149,
    priceUnit: 'hour',
    seats: 2,
    fuel: 'Petrol',
    transmission: 'Manual',
    rating: 4.9,
    reviews: 187,
    features: ['2 Helmets', 'Full Tank', 'Insurance Cover']
  },
  {
    id: 4,
    name: 'Naked Street Bike 200cc',
    type: 'Bike',
    category: 'bike',
    image: '/uploads/cards/Black and Orange Naked Street Motorcycle.png',
    price: 179,
    priceUnit: 'hour',
    seats: 2,
    fuel: 'Petrol',
    transmission: 'Manual',
    rating: 4.7,
    reviews: 156,
    features: ['2 Helmets', 'Sport Mode', 'Free Fuel 100km']
  },
  {
    id: 5,
    name: 'Modern White SUV Studio',
    type: 'Car',
    category: 'car',
    image: '/uploads/cards/White Modern SUV Studio Render.png',
    price: 399,
    priceUnit: 'hour',
    seats: 5,
    fuel: 'Petrol',
    transmission: 'Automatic',
    rating: 4.8,
    reviews: 321,
    features: ['AC', 'GPS', 'Bluetooth', 'Child Seat']
  },
  {
    id: 6,
    name: 'Glossy Black SUV Premium',
    type: 'Car',
    category: 'car',
    image: '/uploads/cards/Glossy Black Off-Road SUV on White.png',
    price: 499,
    priceUnit: 'hour',
    seats: 7,
    fuel: 'Diesel',
    transmission: 'Automatic',
    rating: 4.9,
    reviews: 267,
    features: ['4x4', 'Sunroof', 'Leather Seats', '360 Camera']
  },
  {
    id: 7,
    name: 'Toyota SUV Urban',
    type: 'Car',
    category: 'car',
    image: '/uploads/cards/Glossy Black Toyota SUV Studio Shot1.png',
    price: 449,
    priceUnit: 'hour',
    seats: 5,
    fuel: 'Hybrid',
    transmission: 'Automatic',
    rating: 4.8,
    reviews: 445,
    features: ['Hybrid Engine', 'Adaptive Cruise', 'Wireless Charging']
  },
  {
    id: 8,
    name: 'Suzuki MPV Family 7',
    type: 'Car',
    category: 'car',
    image: '/uploads/cards/White Suzuki MPV Studio Showcase1.png',
    price: 429,
    priceUnit: 'hour',
    seats: 7,
    fuel: 'Petrol',
    transmission: 'Manual',
    rating: 4.7,
    reviews: 198,
    features: ['7 Seater', 'Rear AC', 'Large Boot', 'Roof Rails']
  },
  {
    id: 9,
    name: 'Suzuki Style MPV Comfort',
    type: 'Car',
    category: 'car',
    image: '/uploads/cards/White Suzuki-Style MPV Studio Render.png',
    price: 459,
    priceUnit: 'hour',
    seats: 7,
    fuel: 'Diesel',
    transmission: 'Manual',
    rating: 4.6,
    reviews: 172,
    features: ['7 Seater', 'Diesel Engine', 'Captain Seats', 'Infotainment']
  },
  {
    id: 10,
    name: 'Electric Scooter Zero',
    type: 'Scooty',
    category: 'ev',
    image: '/uploads/cards/Modern White Scooter Product Card1.png',
    price: 109,
    priceUnit: 'hour',
    seats: 2,
    fuel: 'EV',
    transmission: 'Automatic',
    rating: 4.9,
    reviews: 389,
    features: ['100km Range', 'Fast Charge', 'Silent Ride', 'Digital Dash']
  }
];

export const topPicks = [
  {
    id: 'top-1',
    name: 'TVS Jupiter',
    price: '₹59/hour',
    image: '/uploads/cards/Modern White Scooter Product Card1.png',
    badge: 'EV',
    badgeClass: 'is-ev',
    specs: ['Automatic', 'Electric', 'Good for City Ride'],
  },
  {
    id: 'top-2',
    name: 'Royal Enfield',
    price: '₹99/hour',
    image: '/uploads/cards/Black and Orange Neo-Retro Motorcycle1.png',
    badge: '',
    badgeClass: '',
    specs: ['Manual', 'Petrol', 'Best for Long Ride'],
  },
  {
    id: 'top-3',
    name: 'Hyundai i20',
    price: '₹249/hour',
    image: '/uploads/cards/White Suzuki MPV Studio Showcase1.png',
    badge: '',
    badgeClass: '',
    specs: ['Automatic', 'Petrol', '5 Seater'],
  },
  {
    id: 'top-4',
    name: 'Toyota Innova',
    price: '₹399/hour',
    image: '/uploads/cards/Glossy Black Toyota SUV Studio Shot1.png',
    badge: '',
    badgeClass: '',
    specs: ['Automatic', 'Diesel', '7 Seater'],
  },
];

export const whyFeatures = [
  {
    title: 'Wide Vehicle Options',
    icon: ICONS.carBlue,
    desc: 'Scooty, Bike, Car,\nEV, Hybrid & more',
  },
  {
    title: 'Verified & Insured',
    icon: ICONS.shieldBlue,
    desc: 'Well maintained\nvehicles',
  },
  {
    title: 'Affordable Prices',
    icon: ICONS.rupeeBlue,
    desc: 'Best rates in\nyour city',
  },
  {
    title: 'Easy Booking',
    icon: ICONS.calendarBlue,
    desc: 'Quick, simple\nand hassle free',
  },
  {
    title: '24/7 Support',
    icon: ICONS.headsetBlue,
    desc: "We're always\nhere to help",
  },
];

export const testimonials = [
  {
    id: 1,
    name: 'Rahul Sharma',
    location: 'Delhi',
    text: 'Super easy booking process and well-maintained vehicles. Loved the service! Saved almost 40% on hourly rates.',
    avatar: '/uploads/testimonial/Professional Circular Headshot Avatar.png',
    stars: 5,
    role: 'Weekend Traveler'
  },
  {
    id: 2,
    name: 'Priya Mehta',
    location: 'Noida',
    text: 'Rented a scooter for my daily office commute. Affordable, clean, and hassle free. The EV option was super quiet!',
    avatar: '/uploads/testimonial/Professional Circular Headshot Portrait.png',
    stars: 5,
    role: 'Marketing Professional'
  },
  {
    id: 3,
    name: 'Amit Verma',
    location: 'Gurgaon',
    text: 'Used an MPV for a family road trip to Jaipur. 7 seats, clean interiors, and friendly vehicle owner. Five stars!',
    avatar: '/uploads/testimonial/Friendly Professional Avatar.png',
    stars: 5,
    role: 'Business Owner'
  }
];

export const footerQuickLinks = [
  { label: 'Home', url: '#home' },
  { label: 'Vehicles', url: '#vehicles' },
  { label: 'Why Us', url: '#why-us' },
  { label: 'Top Picks', url: '#top-picks' },
  { label: 'Testimonials', url: '#testimonials' },
];

export const footerSupportLinks = [
  { label: 'Help Center', url: '#' },
  { label: 'Rental Policy', url: '#' },
  { label: 'Privacy Policy', url: '#' },
  { label: 'Terms & Conditions', url: '#' },
  { label: 'Contact Us', url: '#' },
];
