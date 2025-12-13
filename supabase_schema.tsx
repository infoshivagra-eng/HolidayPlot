
import React, { useState } from 'react';
import { Copy, Check, Database, AlertCircle } from 'lucide-react';

export const SQL_SCHEMA = `
-- =================================================================
-- HOLIDAYPOT SUPABASE SCHEMA
-- COPY EVERYTHING BELOW THIS LINE TO YOUR SUPABASE SQL EDITOR
-- =================================================================

-- 1. ENABLE EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CREATE TABLES

-- Packages Table
CREATE TABLE IF NOT EXISTS packages (
  "id" text PRIMARY KEY,
  "name" text NOT NULL,
  "slug" text NOT NULL,
  "destination" text NOT NULL,
  "duration" text NOT NULL,
  "price" numeric NOT NULL,
  "groupSize" text,
  "bestTime" text,
  "idealFor" text[], -- Array of strings
  "shortDesc" text,
  "longDesc" text,
  "images" text[], -- Array of strings
  "category" text,
  "inclusions" text[],
  "exclusions" text[],
  "itinerary" jsonb, -- JSON Array
  "rating" numeric DEFAULT 5.0,
  "reviewsCount" integer DEFAULT 0,
  "mapEmbedUrl" text,
  "hiddenGems" jsonb,
  "packingList" jsonb,
  "foodGuide" jsonb,
  "safetyTips" jsonb,
  "visaInfo" jsonb,
  "airportInfo" jsonb,
  "created_at" timestamptz DEFAULT now()
);

-- Drivers Table
CREATE TABLE IF NOT EXISTS drivers (
  "id" text PRIMARY KEY,
  "name" text NOT NULL,
  "phone" text,
  "email" text,
  "photo" text,
  "rating" numeric DEFAULT 5.0,
  "totalRides" integer DEFAULT 0,
  "status" text DEFAULT 'Available',
  "vehicle" jsonb, -- { type, model, plateNumber, capacity, ac, image }
  "rates" jsonb,   -- { perKm, baseFare }
  "earnings" jsonb, -- { today, total, commissionPaid }
  "created_at" timestamptz DEFAULT now()
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  "id" text PRIMARY KEY,
  "userId" text,
  "itemId" text,
  "itemName" text,
  "customerName" text,
  "customerEmail" text,
  "customerPhone" text,
  "type" text, -- 'Package' or 'Taxi'
  "date" timestamptz DEFAULT now(),
  "travelDate" text,
  "status" text DEFAULT 'Pending',
  "totalAmount" numeric,
  "paid" boolean DEFAULT false,
  "travelers" integer,
  "created_at" timestamptz DEFAULT now()
);

-- Company Profile Table
CREATE TABLE IF NOT EXISTS company_profile (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" text,
  "address" text,
  "phone" text,
  "email" text,
  "logo" text,
  "heroImage" text,
  "facebook" text,
  "twitter" text,
  "instagram" text
);

-- SEO Settings Table
CREATE TABLE IF NOT EXISTS seo_settings (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "title" text,
  "description" text,
  "keywords" text,
  "ogImage" text,
  "sitemapEnabled" boolean DEFAULT true,
  "robotsTxtEnabled" boolean DEFAULT true,
  "schemaMarkupEnabled" boolean DEFAULT true,
  "analyticsId" text
);

-- 3. SEED DATA

-- Seed Packages
INSERT INTO packages ("id", "name", "slug", "destination", "duration", "price", "groupSize", "bestTime", "idealFor", "shortDesc", "longDesc", "images", "category", "inclusions", "exclusions", "itinerary", "rating", "reviewsCount", "hiddenGems", "packingList", "foodGuide", "safetyTips", "visaInfo", "airportInfo")
VALUES
(
  'p1',
  'Majestic Rajasthan Royal Tour',
  'rajasthan-royal-tour',
  'Rajasthan, India',
  '7 Days / 6 Nights',
  650,
  '2-15',
  'Oct - Mar',
  ARRAY['Culture', 'History', 'Luxury'],
  'Experience the grandeur of forts, palaces, and desert safaris.',
  'Journey through the Land of Kings. Visit the pink city of Jaipur, the blue city of Jodhpur, and the romantic lakes of Udaipur. Experience a night in the desert under the stars.',
  ARRAY['https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 'https://images.unsplash.com/photo-1599661046289-e31897846e41?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 'https://images.unsplash.com/photo-1598556776374-2c3e1e48c089?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
  'Culture',
  ARRAY['Heritage Hotel Stays', 'Breakfast & Dinner', 'Private AC Car', 'Camel Safari', 'Guide Fees'],
  ARRAY['Airfare', 'Lunch', 'Monument Entry Fees'],
  '[
      {"day": 1, "title": "Arrival in Jaipur", "activities": ["Airport Pickup", "Check-in", "Chokhi Dhani Dinner"], "meals": ["Dinner"]},
      {"day": 2, "title": "Jaipur Sightseeing", "activities": ["Amber Fort", "Hawa Mahal", "City Palace"], "meals": ["Breakfast"]},
      {"day": 3, "title": "Jaipur to Jodhpur", "activities": ["Drive to Jodhpur", "Mehrangarh Fort"], "meals": ["Breakfast", "Dinner"]},
      {"day": 4, "title": "Jaisalmer Desert", "activities": ["Drive to Jaisalmer", "Sam Sand Dunes", "Campfire"], "meals": ["Breakfast", "Dinner"]},
      {"day": 5, "title": "Jaisalmer Fort", "activities": ["Golden Fort Tour", "Patwon Ki Haveli"], "meals": ["Breakfast"]},
      {"day": 6, "title": "Udaipur Transfer", "activities": ["Ranakpur Jain Temple enroute", "Lake Pichola Boat Ride"], "meals": ["Breakfast", "Dinner"]},
      {"day": 7, "title": "Departure", "activities": ["Airport Drop"], "meals": ["Breakfast"]}
  ]'::jsonb,
  4.8,
  342,
  '[
      {"title": "Panna Meena Ka Kund", "description": "A visually stunning 16th-century stepwell in Jaipur, perfect for symmetrical photos minus the crowds.", "image": "https://images.unsplash.com/photo-1590766940554-634a7ed41450?q=80&w=300&auto=format&fit=crop"},
      {"title": "Chandlai Lake", "description": "A secret flamingo watching spot 30km from Jaipur, best visited at sunset.", "image": "https://images.unsplash.com/photo-1605629636254-4d8051df51d3?q=80&w=300&auto=format&fit=crop"}
  ]'::jsonb,
  '[
      {"category": "Clothing", "items": ["Cotton linens for day", "Light jacket for desert nights", "Scarf/Dupatta for temples"]},
      {"category": "Essentials", "items": ["Sunscreen SPF 50+", "Sunglasses", "Power bank", "Comfortable walking shoes"]}
  ]'::jsonb,
  '[
      {"name": "Dal Baati Churma", "type": "Veg", "cost": 5, "mustTry": true},
      {"name": "Laal Maas", "type": "Non-Veg", "cost": 8, "mustTry": true},
      {"name": "Ghevar", "type": "Veg", "cost": 3, "mustTry": false}
  ]'::jsonb,
  '[
      {"title": "Gemstone Scams", "description": "Avoid buying gemstones from guides who promise export deals."},
      {"title": "Authorized Guides", "description": "Only hire government-approved guides at monuments."}
  ]'::jsonb,
  '{"requirements": "e-Visa available for 160+ countries.", "processingTime": "3-4 business days", "documents": ["Passport scan", "Recent photo"]}'::jsonb,
  '{"bestLounge": "Primus Lounge, Jaipur T2", "price": 15, "tips": "Show your credit card for complimentary access."}'::jsonb
),
(
  'p2',
  'Kerala Backwaters & Hills',
  'kerala-gods-own-country',
  'Kerala, India',
  '5 Days / 4 Nights',
  450,
  'Couples / Family',
  'Sep - Mar',
  ARRAY['Nature', 'Relaxation', 'Honeymoon'],
  'Float on houseboats and wander through lush tea plantations.',
  'Discover why Kerala is called Gods Own Country. Cruise the Alleppey backwaters on a traditional houseboat and breathe in the fresh air of Munnars tea gardens.',
  ARRAY['https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 'https://images.unsplash.com/photo-1593693396885-5a5899195229?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
  'Nature',
  ARRAY['Houseboat Stay', 'Tea Museum Ticket', 'Daily Breakfast', 'AC Transport'],
  ARRAY['Flights', 'Lunch', 'Personal Expenses'],
  '[
      {"day": 1, "title": "Cochin to Munnar", "activities": ["Cheeyappara Waterfalls", "Tea Garden Visit"], "meals": ["Dinner"]},
      {"day": 2, "title": "Munnar Exploration", "activities": ["Eravikulam National Park", "Mattupetty Dam"], "meals": ["Breakfast", "Dinner"]},
      {"day": 3, "title": "Thekkady Wilds", "activities": ["Periyar Wildlife Sanctuary", "Spice Plantation"], "meals": ["Breakfast"]},
      {"day": 4, "title": "Alleppey Houseboat", "activities": ["Backwater Cruise", "Overnight on Boat"], "meals": ["Breakfast", "Lunch", "Dinner"]},
      {"day": 5, "title": "Departure", "activities": ["Transfer to Cochin Airport"], "meals": ["Breakfast"]}
  ]'::jsonb,
  4.9,
  512,
  '[{"title": "Vattakanal", "description": "Often called Little Israel, a quiet hill station near Munnar.", "image": "https://images.unsplash.com/photo-1595842838985-0676a6d6d76d?q=80&w=300&auto=format&fit=crop"}]'::jsonb,
  null,
  '[{"name": "Karimeen Pollichathu", "type": "Non-Veg", "cost": 10, "mustTry": true}]'::jsonb,
  null,
  null,
  null
),
(
  'p3',
  'Goa Sun, Sand & Party',
  'goa-beach-party',
  'Goa, India',
  '4 Days / 3 Nights',
  300,
  'Groups / Friends',
  'Nov - Feb',
  ARRAY['Beach', 'Nightlife', 'Adventure'],
  'The ultimate beach vacation with watersports and nightlife.',
  'Enjoy the vibrant beaches of North Goa and the serene vibes of South Goa.',
  ARRAY['https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 'https://images.unsplash.com/photo-1587922546307-776227941871?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
  'Beach',
  ARRAY['3 Star Resort', 'Airport Transfers', 'Breakfast'],
  ARRAY['Water Sports Fees', 'Club Entry'],
  '[
    {"day": 1, "title": "Arrival", "activities": ["Check-in", "Beach"], "meals": ["Dinner"]},
    {"day": 2, "title": "Adventure", "activities": ["Watersports", "Fort"], "meals": ["Breakfast"]},
    {"day": 3, "title": "South Goa", "activities": ["Churches", "Cruise"], "meals": ["Breakfast"]},
    {"day": 4, "title": "Departure", "activities": ["Airport Drop"], "meals": ["Breakfast"]}
  ]'::jsonb,
  4.6,
  890,
  '[{"title": "Butterfly Beach", "description": "Hidden cove.", "image": "https://images.unsplash.com/photo-1560851691-ebb6474668b5?q=80&w=300"}]'::jsonb,
  null,
  null,
  null,
  null,
  null
),
(
  'p4',
  'Ladakh Bike Expedition',
  'ladakh-bike-trip',
  'Ladakh, India',
  '8 Days / 7 Nights',
  800,
  'Adventure Group',
  'Jun - Sep',
  ARRAY['Adventure', 'Biking', 'Photography'],
  'Ride through the highest motorable roads in the world.',
  'An adrenaline-pumping journey through the barren beauty of Ladakh.',
  ARRAY['https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
  'Adventure',
  ARRAY['Bike', 'Fuel', 'Camps'],
  ARRAY['Flights', 'Gear'],
  '[{"day": 1, "title": "Arrival", "activities": ["Rest"], "meals": ["Dinner"]}]'::jsonb,
  4.9,
  220,
  null, null, null, null, null, null
),
(
  'p5',
  'Varanasi Spiritual Awakening',
  'varanasi-spiritual',
  'Varanasi, India',
  '3 Days / 2 Nights',
  250,
  'Family / Senior Citizens',
  'Oct - Mar',
  ARRAY['Culture', 'Spirituality'],
  'Experience the oldest living city.',
  'Immerse yourself in the spiritual energy of Kashi.',
  ARRAY['https://images.unsplash.com/photo-1561361513-2d000a50f0dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
  'Pilgrimage',
  ARRAY['Hotel', 'Boat Ride'],
  ARRAY['Ritual Fees'],
  '[{"day": 1, "title": "Arrival", "activities": ["Aarti"], "meals": ["Dinner"]}]'::jsonb,
  4.7,
  156,
  null, null, null, null, null, null
)
ON CONFLICT ("id") DO NOTHING;

-- Seed Drivers
INSERT INTO drivers ("id", "name", "phone", "email", "photo", "rating", "totalRides", "status", "vehicle", "rates", "earnings")
VALUES
(
  'd1',
  'Ramesh Singh',
  '+91 9876543210',
  'ramesh@example.com',
  'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
  4.8,
  450,
  'Available',
  '{"type": "Sedan", "model": "Maruti Dzire", "plateNumber": "DL-01-AB-1234", "capacity": 4, "ac": true, "image": "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"}'::jsonb,
  '{"perKm": 0.20, "baseFare": 5}'::jsonb,
  '{"today": 45, "total": 1250, "commissionPaid": 125}'::jsonb
),
(
  'd2',
  'Suresh Patil',
  '+91 9822012345',
  'suresh@example.com',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
  4.9,
  120,
  'Busy',
  '{"type": "SUV", "model": "Toyota Innova Crysta", "plateNumber": "MH-12-TC-9999", "capacity": 6, "ac": true, "image": "https://images.unsplash.com/photo-1626077388041-33211b3018e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"}'::jsonb,
  '{"perKm": 0.30, "baseFare": 8}'::jsonb,
  '{"today": 80, "total": 540, "commissionPaid": 54}'::jsonb
)
ON CONFLICT ("id") DO NOTHING;

-- Seed Settings
INSERT INTO company_profile ("name", "address", "phone", "email", "heroImage", "facebook", "twitter", "instagram")
SELECT 'HolidayPot', 'MG Road, Bengaluru, Karnataka, India', '+91 98765 43210', 'hello@holidaypot.in', 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', '#', '#', '#'
WHERE NOT EXISTS (SELECT 1 FROM company_profile);

INSERT INTO seo_settings ("title", "description", "keywords", "analyticsId")
SELECT 'HolidayPot - Explore the World', 'A modern, vibrant, mobile-responsive international travel agency.', 'travel, india, tours, taxi', 'UA-XXXXX-Y'
WHERE NOT EXISTS (SELECT 1 FROM seo_settings);
`;

const SupabaseSchemaViewer: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center justify-center">
      <div className="max-w-5xl w-full h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-6">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-brand-green rounded-xl flex items-center justify-center">
               <Database size={24} className="text-white"/>
             </div>
             <div>
               <h1 className="text-3xl font-bold text-white tracking-tight">Supabase Setup</h1>
               <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
                 <AlertCircle size={14}/> Run this SQL script in your Supabase SQL Editor
               </p>
             </div>
          </div>
          <button 
            onClick={copyToClipboard}
            className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold transition-all shadow-lg transform hover:scale-105 active:scale-95 ${copied ? 'bg-green-600 text-white ring-2 ring-green-400' : 'bg-brand-blue text-white hover:bg-sky-500'}`}
          >
            {copied ? <Check size={24}/> : <Copy size={24}/>}
            {copied ? 'Copied to Clipboard!' : 'Copy SQL Script'}
          </button>
        </div>

        {/* Editor Area */}
        <div className="flex-grow bg-black rounded-2xl border border-gray-800 p-2 shadow-2xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 bg-gray-800 text-gray-400 text-xs px-3 py-1 rounded-bl-lg z-10 font-mono">
            schema.sql
          </div>
          <textarea 
            readOnly
            value={SQL_SCHEMA}
            className="w-full h-full bg-gray-950 text-emerald-400 font-mono text-xs p-6 outline-none resize-none rounded-xl selection:bg-brand-blue selection:text-white"
            onClick={(e) => e.currentTarget.select()}
            spellCheck={false}
          />
        </div>
        
        {/* Footer Instructions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-400">
           <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-800">
              <span className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold mb-2 text-xs">1</span>
              <p>Copy the SQL using the button above.</p>
           </div>
           <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-800">
              <span className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold mb-2 text-xs">2</span>
              <p>Go to Supabase Dashboard &gt; SQL Editor &gt; New Query.</p>
           </div>
           <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-800">
              <span className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold mb-2 text-xs">3</span>
              <p>Paste & Run. The tables and demo data will be created.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseSchemaViewer;
