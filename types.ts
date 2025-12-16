
// Travel Package Types
export interface ItineraryDay {
  day: number;
  title: string;
  activities: string[];
  meals: string[];
  stay?: string;
}

export interface HiddenGem {
  title: string;
  description: string;
  image: string;
}

export interface PackingItem {
  category: string;
  items: string[];
}

export interface FoodItem {
  name: string;
  type: 'Veg' | 'Non-Veg';
  cost: number; // in base currency
  mustTry: boolean;
}

export interface SafetyTip {
  title: string;
  description: string;
  image?: string;
}

export interface VisaInfo {
  requirements: string;
  processingTime: string;
  documents: string[];
}

export interface AirportInfo {
  bestLounge: string;
  price: number;
  tips: string;
}

export interface Package {
  id: string;
  name: string;
  slug: string;
  destination: string;
  duration: string;
  price: number;
  groupSize: string;
  bestTime: string;
  idealFor: string[];
  shortDesc: string;
  longDesc: string;
  images: string[];
  category: 'Adventure' | 'Beach' | 'Culture' | 'Luxury' | 'Budget' | 'Nature' | 'Pilgrimage';
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryDay[];
  rating: number;
  reviewsCount: number;
  mapEmbedUrl?: string;
  
  // New Enhanced Fields
  hiddenGems?: HiddenGem[];
  packingList?: PackingItem[];
  foodGuide?: FoodItem[];
  safetyTips?: SafetyTip[];
  visaInfo?: VisaInfo;
  airportInfo?: AirportInfo;
  
  // System fields
  created_at?: string;
}

// Driver & Taxi Types
export interface Vehicle {
  type: 'Sedan' | 'SUV' | 'Van' | 'Tempo';
  model: string;
  plateNumber: string;
  capacity: number;
  ac: boolean;
  image: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  photo: string;
  rating: number;
  totalRides: number;
  status: 'Available' | 'Busy' | 'Offline';
  vehicle: Vehicle;
  rates: {
    perKm: number;
    baseFare: number;
  };
  earnings: {
    today: number;
    total: number;
    commissionPaid: number;
  };
}

export interface RideRequest {
  id: string;
  from: string;
  to: string;
  date: string;
  passengers: number;
  status: 'Pending' | 'Accepted' | 'Completed' | 'Cancelled';
  price: number;
  driverId?: string;
}

// Booking Types
export interface Booking {
  id: string;
  userId: string;
  itemId: string; // Package ID, Ride ID, or AI Plan ID
  itemName: string; // Store name for display
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  type: 'Package' | 'Taxi' | 'AI Plan' | 'General'; // Added General for Contact Form
  date: string; // Booking creation date
  travelDate?: string; // Date of travel
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Resolved'; // Added Resolved for enquiries
  totalAmount: number;
  paid: boolean;
  travelers: number;
  message?: string; // User message
}

// Admin & System Types
export interface CompanyProfile {
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  logo: string;
  heroImage?: string; // New field for Home Page Banner
  gstNumber?: string; // Added GST Number
  facebook: string;
  twitter: string;
  instagram: string;
  customContactFormEmbed?: string; // Support for Google Forms/Typeform embedding
}

export interface SeoSettings {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  // Tech SEO
  sitemapEnabled: boolean;
  robotsTxtEnabled: boolean;
  robotsTxtContent: string;
  schemaMarkupEnabled: boolean;
  analyticsId: string;
  // Enhanced GEO & AEO
  geoRegion?: string; // e.g., IN-KA
  geoPlacename?: string; // e.g., Bangalore
  geoPosition?: string; // lat;long
  enableFaqSchema?: boolean; // AEO
  twitterHandle?: string;
  // AI Search Optimization (AEO)
  entityType?: 'TravelAgency' | 'Organization' | 'LocalBusiness';
  authoritativeTopic?: string; // e.g. "India Travel"
  knowledgeGraphDesc?: string; // Factual description for LLMs
}

export interface AiSettings {
  provider: 'gemini' | 'openai' | 'custom';
  primaryApiKey: string;
  fallbackApiKeys: string[]; // List of fallback keys
  model: string; // e.g. gemini-2.5-flash, gpt-4
  customBaseUrl?: string; // For custom/local LLMs
  maxRetries: number;
}

export interface EmailRecipient {
  address: string;
  notifyOn: ('Package' | 'Taxi' | 'AI Plan')[];
}

export interface EmailSettings {
  enableNotifications: boolean;
  recipients: EmailRecipient[]; // Changed to array for better management
}

export interface PageSettings {
  error404: {
    title: string;
    message: string;
    image: string;
  };
  maintenanceMode: boolean;
}

// --- CONTENT MANAGEMENT ---
export interface SitePage {
  id: 'about' | 'terms' | 'privacy' | 'home';
  title: string;
  content: string; // HTML allowed
  lastUpdated: string;
}

// --- NEW AUTH & LOGGING TYPES ---

export type Permission = 'manage_packages' | 'manage_bookings' | 'manage_drivers' | 'manage_team' | 'manage_settings' | 'view_analytics';

export interface Manager {
  id: string;
  name: string;
  username: string;
  password?: string; // In real app, this is hashed. Here simplistic.
  role: 'Super Admin' | 'Manager';
  email: string;
  avatar: string;
  permissions: Permission[];
  lastLogin?: string;
}

export interface ActivityLog {
  id: string;
  actorId: string;
  actorName: string;
  action: string; // e.g., "Updated Status", "Deleted Package"
  targetType: 'Booking' | 'Package' | 'Driver' | 'Settings' | 'Manager' | 'Blog' | 'Content';
  targetId?: string;
  details: string;
  timestamp: string;
  previousData?: any; // For revert functionality
  isReverted?: boolean;
}

// --- BLOG TYPES ---
export interface FaqItem {
  question: string;
  answer: string;
}

export interface WeatherData {
  month: string;
  tempHigh: string;
  tempLow: string;
  rain: string; // e.g., "Low", "High", "Moderate"
}

export interface FestivalData {
  name: string;
  month: string;
  description: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // HTML
  image: string;
  author: string;
  date: string;
  tags: string[];
  status: 'Published' | 'Draft';
  // Post specific SEO
  seoTitle?: string;
  seoDescription?: string;
  geoFocus?: string; // e.g., "Kerala, India"
  // Rich Content
  faq?: FaqItem[];
  gallery?: string[]; // URLs
  
  // New Rich Sections
  topActivities?: string[];
  weatherData?: WeatherData[];
  festivals?: FestivalData[];
  adventurePairs?: (string | any)[]; // Relaxed to allow objects for now
  bestTimeDescription?: string;
  relatedPackageId?: string; // Link to a booking package
}

// --- SAAS TYPES (SUPER ADMIN) ---
export interface Tenant {
  id: string;
  business_name: string;
  admin_email: string;
  admin_password?: string;
  status: 'active' | 'suspended';
  plan_id: 'basic' | 'pro' | 'enterprise';
  db_url?: string;
  db_key?: string;
  ai_key?: string;
  created_at?: string;
}

export interface SaaSPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  isPopular?: boolean;
}

export interface SaaSInvoice {
  id: string;
  tenantId: string;
  tenantName: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  planName: string;
}

export interface SaaSAnnouncement {
  id: string;
  title: string;
  content: string;
  date: string;
  status: 'Published' | 'Draft';
}
