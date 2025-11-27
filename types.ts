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
  category: 'Adventure' | 'Beach' | 'Culture' | 'Luxury' | 'Budget' | 'Nature';
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
  itemId: string; // Package ID or Ride ID
  itemName: string; // Store name for display
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  type: 'Package' | 'Taxi';
  date: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  totalAmount: number;
  paid: boolean;
  travelers: number;
}