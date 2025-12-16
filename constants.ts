
import { Package, Driver, RideRequest, Manager, BlogPost } from './types';

// ... (Existing Constants for Packages, Drivers, Rides, Testimonials remain the same) ...
export const POPULAR_PACKAGES: Package[] = [
  {
    id: 'p1',
    name: 'Majestic Rajasthan Royal Tour',
    slug: 'rajasthan-royal-tour',
    destination: 'Rajasthan, India',
    duration: '7 Days / 6 Nights',
    price: 650, // Stored in USD base, approx ₹54,600
    groupSize: '2-15',
    bestTime: 'Oct - Mar',
    idealFor: ['Culture', 'History', 'Luxury'],
    shortDesc: 'Experience the grandeur of forts, palaces, and desert safaris.',
    longDesc: 'Journey through the Land of Kings. Visit the pink city of Jaipur, the blue city of Jodhpur, and the romantic lakes of Udaipur. Experience a night in the desert under the stars.',
    images: [
      'https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1598556776374-2c3e1e48c089?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    ],
    category: 'Culture',
    inclusions: ['Heritage Hotel Stays', 'Breakfast & Dinner', 'Private AC Car', 'Camel Safari', 'Guide Fees'],
    exclusions: ['Airfare', 'Lunch', 'Monument Entry Fees'],
    itinerary: [
      { day: 1, title: 'Arrival in Jaipur', activities: ['Airport Pickup', 'Check-in', 'Chokhi Dhani Dinner'], meals: ['Dinner'] },
      { day: 2, title: 'Jaipur Sightseeing', activities: ['Amber Fort', 'Hawa Mahal', 'City Palace'], meals: ['Breakfast'] },
      { day: 3, title: 'Jaipur to Jodhpur', activities: ['Drive to Jodhpur', 'Mehrangarh Fort'], meals: ['Breakfast', 'Dinner'] },
      { day: 4, title: 'Jaisalmer Desert', activities: ['Drive to Jaisalmer', 'Sam Sand Dunes', 'Campfire'], meals: ['Breakfast', 'Dinner'] },
      { day: 5, title: 'Jaisalmer Fort', activities: ['Golden Fort Tour', 'Patwon Ki Haveli'], meals: ['Breakfast'] },
      { day: 6, title: 'Udaipur Transfer', activities: ['Ranakpur Jain Temple enroute', 'Lake Pichola Boat Ride'], meals: ['Breakfast', 'Dinner'] },
      { day: 7, title: 'Departure', activities: ['Airport Drop'], meals: ['Breakfast'] }
    ],
    rating: 4.8,
    reviewsCount: 342,
    hiddenGems: [
      { title: 'Panna Meena Ka Kund', description: 'A visually stunning 16th-century stepwell in Jaipur, perfect for symmetrical photos minus the crowds.', image: 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?q=80&w=300&auto=format&fit=crop' },
      { title: 'Chandlai Lake', description: 'A secret flamingo watching spot 30km from Jaipur, best visited at sunset.', image: 'https://images.unsplash.com/photo-1605629636254-4d8051df51d3?q=80&w=300&auto=format&fit=crop' }
    ],
    packingList: [
      { category: 'Clothing', items: ['Cotton linens for day', 'Light jacket for desert nights', 'Scarf/Dupatta for temples'] },
      { category: 'Essentials', items: ['Sunscreen SPF 50+', 'Sunglasses', 'Power bank', 'Comfortable walking shoes'] }
    ],
    foodGuide: [
      { name: 'Dal Baati Churma', type: 'Veg', cost: 5, mustTry: true },
      { name: 'Laal Maas', type: 'Non-Veg', cost: 8, mustTry: true },
      { name: 'Ghevar', type: 'Veg', cost: 3, mustTry: false }
    ],
    safetyTips: [
      { title: 'Gemstone Scams', description: 'Avoid buying gemstones from guides who promise "export deals".' },
      { title: 'Authorized Guides', description: 'Only hire government-approved guides at monuments.' }
    ],
    visaInfo: {
      requirements: 'e-Visa available for 160+ countries.',
      processingTime: '3-4 business days',
      documents: ['Passport scan', 'Recent photo']
    },
    airportInfo: {
      bestLounge: 'Primus Lounge, Jaipur T2',
      price: 15,
      tips: 'Show your credit card for complimentary access.'
    }
  },
  {
    id: 'p2',
    name: 'Kerala Backwaters & Hills',
    slug: 'kerala-gods-own-country',
    destination: 'Kerala, India',
    duration: '5 Days / 4 Nights',
    price: 450, // Approx ₹37,800
    groupSize: 'Couples / Family',
    bestTime: 'Sep - Mar',
    idealFor: ['Nature', 'Relaxation', 'Honeymoon'],
    shortDesc: 'Float on houseboats and wander through lush tea plantations.',
    longDesc: 'Discover why Kerala is called God\'s Own Country. Cruise the Alleppey backwaters on a traditional houseboat and breathe in the fresh air of Munnar\'s tea gardens.',
    images: [
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1593693396885-5a5899195229?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    ],
    category: 'Nature', 
    inclusions: ['Houseboat Stay', 'Tea Museum Ticket', 'Daily Breakfast', 'AC Transport'],
    exclusions: ['Flights', 'Lunch', 'Personal Expenses'],
    itinerary: [
      { day: 1, title: 'Cochin to Munnar', activities: ['Cheeyappara Waterfalls', 'Tea Garden Visit'], meals: ['Dinner'] },
      { day: 2, title: 'Munnar Exploration', activities: ['Eravikulam National Park', 'Mattupetty Dam'], meals: ['Breakfast', 'Dinner'] },
      { day: 3, title: 'Thekkady Wilds', activities: ['Periyar Wildlife Sanctuary', 'Spice Plantation'], meals: ['Breakfast'] },
      { day: 4, title: 'Alleppey Houseboat', activities: ['Backwater Cruise', 'Overnight on Boat'], meals: ['Breakfast', 'Lunch', 'Dinner'] },
      { day: 5, title: 'Departure', activities: ['Transfer to Cochin Airport'], meals: ['Breakfast'] }
    ],
    rating: 4.9,
    reviewsCount: 512,
    hiddenGems: [
      { title: 'Vattakanal', description: 'Often called "Little Israel", a quiet hill station near Munnar with stunning views.', image: 'https://images.unsplash.com/photo-1595842838985-0676a6d6d76d?q=80&w=300&auto=format&fit=crop' }
    ],
    foodGuide: [
      { name: 'Karimeen Pollichathu', type: 'Non-Veg', cost: 10, mustTry: true },
      { name: 'Appam with Stew', type: 'Veg', cost: 4, mustTry: true }
    ]
  },
    {
    id: 'p3',
    name: 'Goa Sun, Sand & Party',
    slug: 'goa-beach-party',
    destination: 'Goa, India',
    duration: '4 Days / 3 Nights',
    price: 300, // Approx ₹25,200
    groupSize: 'Groups / Friends',
    bestTime: 'Nov - Feb',
    idealFor: ['Beach', 'Nightlife', 'Adventure'],
    shortDesc: 'The ultimate beach vacation with watersports and nightlife.',
    longDesc: 'Enjoy the vibrant beaches of North Goa and the serene vibes of South Goa. Indulge in parasailing, jet skiing, and the famous Goan seafood.',
    images: [
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1587922546307-776227941871?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    ],
    category: 'Beach',
    inclusions: ['3 Star Resort', 'Airport Transfers', 'Scooter Rental Assistance', 'Breakfast'],
    exclusions: ['Water Sports Fees', 'Club Entry', 'Lunch & Dinner'],
    itinerary: [
      { day: 1, title: 'Arrival & North Goa', activities: ['Check-in', 'Calangute Beach', 'Baga Nightlife'], meals: ['Dinner'] },
      { day: 2, title: 'Adventure Day', activities: ['Watersports at Anjuna', 'Chapora Fort'], meals: ['Breakfast'] },
      { day: 3, title: 'South Goa Vibes', activities: ['Basilica of Bom Jesus', 'Colva Beach', 'Cruise'], meals: ['Breakfast'] },
      { day: 4, title: 'Departure', activities: ['Souvenir Shopping', 'Airport Drop'], meals: ['Breakfast'] }
    ],
    rating: 4.6,
    reviewsCount: 890,
    hiddenGems: [
      { title: 'Butterfly Beach', description: 'A hidden cove accessible only by boat or trek, perfect for sunset.', image: 'https://images.unsplash.com/photo-1560851691-ebb6474668b5?q=80&w=300&auto=format&fit=crop' }
    ]
  },
  {
    id: 'p4',
    name: 'Ladakh Bike Expedition',
    slug: 'ladakh-bike-trip',
    destination: 'Ladakh, India',
    duration: '8 Days / 7 Nights',
    price: 800, // Approx ₹67,200
    groupSize: 'Adventure Group',
    bestTime: 'Jun - Sep',
    idealFor: ['Adventure', 'Biking', 'Photography'],
    shortDesc: 'Ride through the highest motorable roads in the world.',
    longDesc: 'An adrenaline-pumping journey through the barren beauty of Ladakh. Ride across Khardung La, camp by Pangong Lake, and visit ancient monasteries.',
    images: [
      'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    ],
    category: 'Adventure',
    inclusions: ['Royal Enfield 500cc', 'Fuel', 'Mechanic', 'Camps & Hotels', 'Permits'],
    exclusions: ['Flights', 'Riding Gear', 'Lunch'],
    itinerary: [
      { day: 1, title: 'Arrival in Leh', activities: ['Acclimatization', 'Leh Market'], meals: ['Dinner'] },
      { day: 2, title: 'Sham Valley', activities: ['Magnetic Hill', 'Gurudwara Pathar Sahib'], meals: ['Breakfast', 'Dinner'] },
      { day: 3, title: 'Nubra Valley', activities: ['Ride via Khardung La', 'Hunder Sand Dunes'], meals: ['Breakfast', 'Dinner'] },
      { day: 4, title: 'Turtuk Excursion', activities: ['Village Tour', 'Balti Culture'], meals: ['Breakfast', 'Dinner'] },
      { day: 5, title: 'Pangong Lake', activities: ['Ride via Shyok', 'Camping at Lake'], meals: ['Breakfast', 'Dinner'] },
      { day: 6, title: 'Back to Leh', activities: ['Ride via Chang La', 'Thiksey Monastery'], meals: ['Breakfast', 'Dinner'] },
      { day: 7, title: 'Departure', activities: ['Airport Drop'], meals: ['Breakfast'] }
    ],
    rating: 4.9,
    reviewsCount: 220
  },
  {
    id: 'p5',
    name: 'Varanasi Spiritual Awakening',
    slug: 'varanasi-spiritual',
    destination: 'Varanasi, India',
    duration: '3 Days / 2 Nights',
    price: 250,
    groupSize: 'Family / Senior Citizens',
    bestTime: 'Oct - Mar',
    idealFor: ['Culture', 'Spirituality', 'History'],
    shortDesc: 'Experience the oldest living city, Ganga Aarti, and divine spirituality.',
    longDesc: 'Immerse yourself in the spiritual energy of Kashi. Witness the mesmerizing Ganga Aarti at Dashashwamedh Ghat, visit the sacred Kashi Vishwanath Temple, and take a sunrise boat ride on the Ganges.',
    images: [
      'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1624694401729-1667d8d052d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    ],
    category: 'Pilgrimage',
    inclusions: ['Hotel Stay', 'Private Boat Ride', 'Temple VIP Darshan Assistance', 'Airport Transfers'],
    exclusions: ['Lunch & Dinner', 'Ritual Fees'],
    itinerary: [
      { day: 1, title: 'Arrival & Evening Aarti', activities: ['Airport Pickup', 'Dashashwamedh Ghat Aarti'], meals: ['Dinner'] },
      { day: 2, title: 'Kashi Darshan', activities: ['Sunrise Boat Ride', 'Kashi Vishwanath Temple', 'Sarnath Excursion'], meals: ['Breakfast'] },
      { day: 3, title: 'Departure', activities: ['Shopping in Godowlia', 'Airport Drop'], meals: ['Breakfast'] }
    ],
    rating: 4.7,
    reviewsCount: 156,
    hiddenGems: [
      { title: 'Manikarnika Ghat', description: 'Witness the eternal flame and the cycle of life and death.', image: 'https://images.unsplash.com/photo-1622303534888-2947a1677334?q=80&w=300&auto=format&fit=crop' }
    ]
  },
  {
    id: 'p6',
    name: 'Char Dham Yatra',
    slug: 'char-dham-yatra',
    destination: 'Uttarakhand, India',
    duration: '10 Days / 9 Nights',
    price: 900,
    groupSize: 'Group / Family',
    bestTime: 'May - Jun, Sep - Oct',
    idealFor: ['Pilgrimage', 'Nature', 'Adventure'],
    shortDesc: 'The ultimate pilgrimage to Yamunotri, Gangotri, Kedarnath, and Badrinath.',
    longDesc: 'A divine journey through the Himalayas to the four most sacred shrines of Hinduism. Experience the spiritual bliss and breathtaking mountain views.',
    images: [
      'https://images.unsplash.com/photo-1626084478179-8b438258384b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1598322695507-6b69c47c7293?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    ],
    category: 'Pilgrimage',
    inclusions: ['Helicopter tickets (Optional)', 'Hotels & Camps', 'All Meals', 'Transport'],
    exclusions: ['Pony/Palki Charges', 'Personal Medication'],
    itinerary: [
      { day: 1, title: 'Haridwar to Barkot', activities: ['Drive to Barkot', 'Yamuna River View'], meals: ['Dinner'] },
      { day: 2, title: 'Yamunotri Trek', activities: ['Trek to Yamunotri', 'Darshan', 'Return to Barkot'], meals: ['Breakfast', 'Dinner'] },
      { day: 3, title: 'Barkot to Uttarkashi', activities: ['Vishwanath Temple Visit'], meals: ['Breakfast', 'Dinner'] },
      { day: 4, title: 'Gangotri Darshan', activities: ['Drive to Gangotri', 'Darshan', 'Return to Uttarkashi'], meals: ['Breakfast', 'Dinner'] },
      { day: 5, title: 'Uttarkashi to Guptkashi', activities: ['Scenic Drive'], meals: ['Breakfast', 'Dinner'] },
      { day: 6, title: 'Kedarnath Trek', activities: ['Trek/Helicopter', 'Evening Aarti'], meals: ['Breakfast', 'Dinner'] },
      { day: 7, title: 'Return to Guptkashi', activities: ['Morning Darshan', 'Trek Down'], meals: ['Breakfast', 'Dinner'] },
      { day: 8, title: 'Guptkashi to Badrinath', activities: ['Drive to Badrinath', 'Evening Darshan'], meals: ['Breakfast', 'Dinner'] },
      { day: 9, title: 'Badrinath to Rudraprayag', activities: ['Mana Village', 'Drive Back'], meals: ['Breakfast', 'Dinner'] },
      { day: 10, title: 'Return to Haridwar', activities: ['Drop at Haridwar Station'], meals: ['Breakfast'] }
    ],
    rating: 4.9,
    reviewsCount: 412
  },
  {
    id: 'p7',
    name: 'Amritsar Golden Temple & Wagah Border',
    slug: 'amritsar-golden-temple',
    destination: 'Amritsar, Punjab',
    duration: '3 Days / 2 Nights',
    price: 200,
    groupSize: 'Family / Group',
    bestTime: 'Oct - Mar',
    idealFor: ['Pilgrimage', 'Culture', 'History'],
    shortDesc: 'Visit the holiest shrine of Sikhism and witness the patriotic Wagah Border ceremony.',
    longDesc: 'Soak in the divine atmosphere of Sri Harmandir Sahib (Golden Temple). Enjoy the Langar, visit Jallianwala Bagh, and cheer for the nation at the Wagah Border beating retreat ceremony.',
    images: [
      'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1580202313707-1c4b14d4d146?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    ],
    category: 'Pilgrimage',
    inclusions: ['Hotel Stay', 'Private Car for Sightseeing', 'Wagah Border VIP Pass assistance'],
    exclusions: ['Airfare', 'Lunch & Dinner'],
    itinerary: [
      { day: 1, title: 'Arrival & Wagah Border', activities: ['Airport Pickup', 'Wagah Border Ceremony'], meals: ['Dinner'] },
      { day: 2, title: 'Golden Temple & City Tour', activities: ['Golden Temple', 'Jallianwala Bagh', 'Partition Museum'], meals: ['Breakfast'] },
      { day: 3, title: 'Departure', activities: ['Shopping at Hall Bazaar', 'Airport Drop'], meals: ['Breakfast'] }
    ],
    rating: 4.8,
    reviewsCount: 305,
    foodGuide: [
        { name: 'Amritsari Kulcha', type: 'Veg', cost: 2, mustTry: true },
        { name: 'Lassi', type: 'Veg', cost: 1, mustTry: true }
    ]
  }
];

export const MOCK_DRIVERS: Driver[] = [
  {
    id: 'd1',
    name: 'Ramesh Singh',
    phone: '+91 9876543210',
    email: 'ramesh@example.com',
    photo: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    rating: 4.8,
    totalRides: 450,
    status: 'Available',
    vehicle: {
      type: 'Sedan',
      model: 'Maruti Dzire',
      plateNumber: 'DL-01-AB-1234',
      capacity: 4,
      ac: true,
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    rates: { perKm: 0.20, baseFare: 5 }, // USD base approx ₹16/km, ₹400 base
    earnings: { today: 45, total: 1250, commissionPaid: 125 }
  },
  {
    id: 'd2',
    name: 'Suresh Patil',
    phone: '+91 9822012345',
    email: 'suresh@example.com',
    photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    rating: 4.9,
    totalRides: 120,
    status: 'Busy',
    vehicle: {
      type: 'SUV',
      model: 'Toyota Innova Crysta',
      plateNumber: 'MH-12-TC-9999',
      capacity: 6,
      ac: true,
      image: 'https://images.unsplash.com/photo-1626077388041-33211b3018e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    rates: { perKm: 0.30, baseFare: 8 }, // USD base
    earnings: { today: 80, total: 540, commissionPaid: 54 }
  }
];

export const MOCK_RIDES: RideRequest[] = [
  { id: 'r1', from: 'Mumbai Airport T2', to: 'Taj Mahal Palace, Colaba', date: '25/10/2024 10:00 AM', passengers: 2, status: 'Pending', price: 25 },
  { id: 'r2', from: 'Connaught Place', to: 'Gurgaon Cyber Hub', date: '26/10/2024 02:30 PM', passengers: 4, status: 'Completed', price: 20, driverId: 'd1' }
];

export const TESTIMONIALS = [
  { 
    name: "Priya Sharma", 
    text: "The Rajasthan tour was tailored perfectly for my family. The hidden gems guide was a lifesaver!", 
    location: "Delhi",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
  },
  { 
    name: "Amit Patel", 
    text: "Booked a cab for Outstation to Lonavala. Driver Suresh was very polite and the car was spotless.", 
    location: "Mumbai",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
  },
  { 
    name: "Jessica Lee", 
    text: "Kerala backwaters were a dream. HolidayPot's food recommendations were spot on!", 
    location: "London, UK",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
  },
  {
    name: "Rahul Verma",
    text: "Used the AI Planner for a last minute Goa trip. It gave me the perfect itinerary under budget.",
    location: "Bangalore",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
  }
];

export const MOCK_MANAGERS: Manager[] = [
  {
    id: 'm1',
    name: 'Admin User',
    username: 'admin',
    email: 'admin@holidaypot.in',
    password: 'admin123', 
    role: 'Super Admin',
    permissions: ['manage_packages', 'manage_bookings', 'manage_drivers', 'manage_team', 'manage_settings', 'view_analytics'],
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0EA5E9&color=fff',
    lastLogin: new Date().toISOString()
  },
  {
    id: 'm2',
    name: 'Sarah Manager',
    username: 'sarah',
    email: 'sarah@holidaypot.in',
    password: 'admin123', 
    role: 'Manager',
    permissions: ['manage_bookings', 'view_analytics'],
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    lastLogin: new Date(Date.now() - 86400000).toISOString()
  }
];

export const MOCK_POSTS: BlogPost[] = [
  {
    id: 'b1',
    title: '5 Hidden Gems in Kerala You Must Visit',
    slug: 'hidden-gems-kerala',
    excerpt: 'Beyond the backwaters, Kerala hides secret waterfalls and misty hills perfect for solitude seekers.',
    content: `
      <h2>The Unexplored Side of God's Own Country</h2>
      <p>While Alleppey and Munnar steal the spotlight, Vattakanal offers a slice of Israel in India. The misty mountains here are perfect for trekking.</p>
      <h3>1. Vattakanal</h3>
      <p>Often called "Little Israel", this place offers stunning views of the Western Ghats. The dolphin's nose trek is a must-try experience here.</p>
      <h3>2. Marari Beach</h3>
      <p>A quiet alternative to Alleppey beach, perfect for sunset lovers who want to avoid the crowd. The fishermans village vibe is authentic and relaxing.</p>
    `,
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    author: 'Admin User',
    date: '2024-10-15',
    tags: ['Kerala', 'Nature', 'Hidden Gems'],
    status: 'Published',
    seoTitle: '5 Secret Places in Kerala 2024 Guide',
    seoDescription: 'Discover the top 5 hidden gems in Kerala including Vattakanal and Marari Beach. Complete travel guide.',
    faq: [
      { question: 'What is the best time to visit Kerala?', answer: 'The best time to visit Kerala is between September and March when the weather is pleasant.' },
      { question: 'How many days are enough for Kerala?', answer: 'Ideally, 5 to 7 days are sufficient to cover major attractions like Munnar, Alleppey, and Kochi.' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1593693396885-5a5899195229?w=800',
      'https://images.unsplash.com/photo-1595842838985-0676a6d6d76d?w=800',
      'https://images.unsplash.com/photo-1588258524675-c61995a98075?w=800'
    ]
  },
  {
    id: 'b2',
    title: 'A Foodie\'s Guide to Rajasthan',
    slug: 'food-guide-rajasthan',
    excerpt: 'From Dal Baati Churma to Laal Maas, explore the spicy and sweet flavors of the royal state.',
    content: '<p>Rajasthan is a paradise for food lovers. The arid land has given birth to a cuisine that uses plenty of milk, ghee, and buttermilk.</p><h3>Dal Baati Churma</h3><p>The flagship dish of Rajasthan. Hard wheat rolls (Baati) are dipped in ghee and eaten with spicy lentil curry (Dal) and sweetened crushed wheat (Churma).</p>',
    image: 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?q=80&w=1000&auto=format&fit=crop',
    author: 'Sarah Manager',
    date: '2024-10-20',
    tags: ['Food', 'Rajasthan', 'Culture'],
    status: 'Published',
    faq: [
      { question: 'Is Rajasthani food very spicy?', answer: 'Yes, traditional dishes like Laal Maas can be quite spicy due to the use of Mathania chillies.' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1626139576127-4589d97a022d?w=800',
      'https://images.unsplash.com/photo-1606471191009-63994c53433b?w=800'
    ]
  }
];
