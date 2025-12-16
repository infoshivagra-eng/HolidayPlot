
import React, { useState } from 'react';
import { Copy, Check, Database, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TENANT_SQL = `
-- =================================================================
-- AGENCY DATABASE SCHEMA
-- Run this on your Supabase Project to enable the backend
-- =================================================================

-- ENABLE EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PACKAGES
CREATE TABLE IF NOT EXISTS packages (
  "id" text PRIMARY KEY,
  "name" text NOT NULL,
  "slug" text NOT NULL,
  "destination" text NOT NULL,
  "duration" text NOT NULL,
  "price" numeric NOT NULL,
  "groupSize" text,
  "bestTime" text,
  "idealFor" text[], 
  "shortDesc" text,
  "longDesc" text,
  "images" text[], 
  "category" text,
  "inclusions" text[],
  "exclusions" text[],
  "itinerary" jsonb, 
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

-- 2. DRIVERS
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

-- 3. BOOKINGS
CREATE TABLE IF NOT EXISTS bookings (
  "id" text PRIMARY KEY,
  "userId" text,
  "itemId" text,
  "itemName" text,
  "customerName" text,
  "customerEmail" text,
  "customerPhone" text,
  "type" text, -- 'Package', 'Taxi', 'AI Plan', 'General'
  "date" timestamptz DEFAULT now(),
  "travelDate" text,
  "status" text DEFAULT 'Pending',
  "totalAmount" numeric,
  "paid" boolean DEFAULT false,
  "travelers" integer,
  "message" text, -- User message/notes
  "created_at" timestamptz DEFAULT now()
);

-- 4. BLOG POSTS
CREATE TABLE IF NOT EXISTS blog_posts (
  "id" text PRIMARY KEY,
  "title" text NOT NULL,
  "slug" text NOT NULL UNIQUE,
  "excerpt" text,
  "content" text, 
  "image" text,
  "author" text,
  "date" date DEFAULT CURRENT_DATE,
  "tags" text[],
  "status" text DEFAULT 'Draft', 
  "seoTitle" text,
  "seoDescription" text,
  "geoFocus" text,
  "faq" jsonb,           
  "gallery" text[],      
  "topActivities" jsonb, 
  "weatherData" jsonb,   
  "festivals" jsonb,     
  "adventurePairs" jsonb,
  "bestTimeDescription" text,
  "relatedPackageId" text,
  "created_at" timestamptz DEFAULT now()
);

-- 5. MANAGERS (Team)
CREATE TABLE IF NOT EXISTS managers (
  "id" text PRIMARY KEY,
  "name" text NOT NULL,
  "username" text UNIQUE NOT NULL,
  "email" text,
  "password" text, -- In production, use Supabase Auth instead of this table if possible
  "role" text DEFAULT 'Manager',
  "permissions" text[], 
  "avatar" text,
  "lastLogin" timestamptz,
  "created_at" timestamptz DEFAULT now()
);

-- 6. ACTIVITY LOGS
CREATE TABLE IF NOT EXISTS activity_logs (
  "id" text PRIMARY KEY,
  "actorId" text,
  "actorName" text,
  "action" text,
  "targetType" text,
  "targetId" text,
  "details" text,
  "timestamp" timestamptz DEFAULT now(),
  "previousData" jsonb,
  "isReverted" boolean DEFAULT false
);

-- 7. CMS SITE PAGES
CREATE TABLE IF NOT EXISTS site_pages (
  "id" text PRIMARY KEY, -- 'home', 'about', 'terms', 'privacy'
  "title" text,
  "content" text,
  "lastUpdated" timestamptz DEFAULT now()
);

-- 8. SETTINGS TABLES
CREATE TABLE IF NOT EXISTS company_profile (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" text, "address" text, "phone" text, "email" text,
  "website" text, "logo" text, "heroImage" text, "gstNumber" text,
  "customContactFormEmbed" text,
  "facebook" text, "twitter" text, "instagram" text
);

-- MIGRATIONS FOR EXISTING TABLES
DO $$
BEGIN
    ALTER TABLE company_profile ADD COLUMN IF NOT EXISTS "heroImage" text;
    ALTER TABLE company_profile ADD COLUMN IF NOT EXISTS "gstNumber" text;
    ALTER TABLE company_profile ADD COLUMN IF NOT EXISTS "customContactFormEmbed" text;
EXCEPTION
    WHEN others THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS seo_settings (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "title" text, "description" text, "keywords" text, "ogImage" text,
  "sitemapEnabled" boolean, "robotsTxtEnabled" boolean, "robotsTxtContent" text,
  "schemaMarkupEnabled" boolean, "analyticsId" text, "geoRegion" text,
  "enableFaqSchema" boolean, "entityType" text, "authoritativeTopic" text, "knowledgeGraphDesc" text
);

CREATE TABLE IF NOT EXISTS ai_settings (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "provider" text DEFAULT 'gemini',
  "primaryApiKey" text,
  "fallbackApiKeys" text[],
  "model" text,
  "customBaseUrl" text,
  "maxRetries" integer DEFAULT 3
);

CREATE TABLE IF NOT EXISTS email_settings (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "enableNotifications" boolean DEFAULT true,
  "recipients" jsonb -- Array of {address, notifyOn[]}
);

-- =================================================================
-- SEED DATA (INITIAL CONTENT)
-- =================================================================

-- Seed Company
INSERT INTO company_profile ("name", "address", "phone", "email", "heroImage", "facebook", "twitter", "instagram")
SELECT 'HolidayPot', 'MG Road, Bengaluru, Karnataka, India', '+91 98765 43210', 'hello@holidaypot.in', 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', '#', '#', '#'
WHERE NOT EXISTS (SELECT 1 FROM company_profile);

-- Seed SEO
INSERT INTO seo_settings ("title", "description", "keywords", "analyticsId")
SELECT 'HolidayPot - Explore the World', 'A modern, vibrant, mobile-responsive international travel agency.', 'travel, india, tours, taxi', 'UA-XXXXX-Y'
WHERE NOT EXISTS (SELECT 1 FROM seo_settings);

-- Seed Default Admin
INSERT INTO managers ("id", "name", "username", "email", "password", "role", "permissions", "avatar")
VALUES (
  'admin_01', 'Admin User', 'admin', 'admin@holidaypot.in', 'admin123', 'Manager', 
  ARRAY['manage_packages', 'manage_bookings', 'manage_drivers', 'manage_team', 'manage_settings', 'view_analytics'],
  'https://ui-avatars.com/api/?name=Admin+User&background=0EA5E9&color=fff'
) ON CONFLICT (id) DO NOTHING;

-- Seed Default Pages
INSERT INTO site_pages ("id", "title", "content") VALUES
('about', 'About Us', '<h1>Welcome to HolidayPot</h1><p>We are a premium travel agency...</p>'),
('terms', 'Terms & Conditions', '<h1>Terms of Service</h1><p>Please read carefully...</p>'),
('privacy', 'Privacy Policy', '<h1>Privacy Policy</h1><p>Your data is safe with us...</p>'),
('home', 'Home Page Content', '<h1>Discover Incredible India</h1>')
ON CONFLICT (id) DO NOTHING;

-- Seed Package
INSERT INTO packages ("id", "name", "slug", "destination", "duration", "price", "groupSize", "bestTime", "idealFor", "shortDesc", "longDesc", "images", "category", "inclusions", "exclusions", "itinerary", "rating", "reviewsCount")
VALUES (
  'p_demo_1', 
  'Majestic Rajasthan Royal Tour', 
  'rajasthan-royal-tour', 
  'Rajasthan, India', 
  '7 Days / 6 Nights', 
  650, 
  '2-15', 
  'Oct - Mar', 
  ARRAY['Culture', 'History', 'Luxury'], 
  'Experience the grandeur of forts, palaces, and desert safaris.', 
  'Journey through the Land of Kings. Visit the pink city of Jaipur, the blue city of Jodhpur, and the romantic lakes of Udaipur.', 
  ARRAY['https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'], 
  'Culture', 
  ARRAY['Heritage Hotels', 'Breakfast', 'AC Car', 'Camel Safari'], 
  ARRAY['Airfare', 'Lunch', 'Entry Fees'], 
  '[{"day": 1, "title": "Arrival in Jaipur", "activities": ["Airport Pickup", "Check-in"], "meals": ["Dinner"]}]'::jsonb, 
  4.8, 
  342
) ON CONFLICT (id) DO NOTHING;
`;

interface ViewerProps {
    embedded?: boolean;
}

const SupabaseSchemaViewer: React.FC<ViewerProps> = ({ embedded }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(TENANT_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`${embedded ? 'h-[600px] w-full rounded-2xl' : 'min-h-screen'} bg-gray-900 text-white p-6 flex flex-col items-center justify-center relative`}>
      {!embedded && (
        <div className="absolute top-6 left-6">
            <Link to="/admin" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-bold">
                <ArrowLeft size={18}/> Back to Admin
            </Link>
        </div>
      )}

      <div className={`max-w-5xl w-full ${embedded ? 'h-full' : 'h-[90vh]'} flex flex-col`}>
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b border-gray-800 pb-6 gap-4">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-gradient-to-br from-brand-blue to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
               <Database size={24} className="text-white"/>
             </div>
             <div>
               <h1 className="text-2xl font-bold text-white tracking-tight">Database Setup</h1>
               <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
                 <AlertCircle size={14}/> SQL Script for Supabase
               </p>
             </div>
          </div>
          
          <button 
            onClick={copyToClipboard}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg transform hover:scale-105 active:scale-95 ${copied ? 'bg-green-600 text-white ring-2 ring-green-400' : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700'}`}
          >
            {copied ? <Check size={18}/> : <Copy size={18}/>}
            {copied ? 'Copied!' : 'Copy SQL'}
          </button>
        </div>

        {/* Editor Area */}
        <div className="flex-grow bg-black rounded-2xl border border-gray-800 p-2 shadow-2xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 bg-gray-800 text-gray-400 text-xs px-4 py-2 rounded-bl-xl z-10 font-mono border-b border-l border-gray-700">
            agency_schema.sql
          </div>
          <div className="absolute top-0 left-0 h-1 w-full bg-brand-blue"></div>
          
          <textarea 
            readOnly
            value={TENANT_SQL}
            className="w-full h-full bg-gray-950 text-emerald-400 font-mono text-xs p-6 outline-none resize-none rounded-xl selection:bg-brand-blue selection:text-white leading-relaxed"
            onClick={(e) => e.currentTarget.select()}
            spellCheck={false}
          />
        </div>
        
        {/* Footer Instructions */}
        <div className="mt-6 text-sm text-gray-200">
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 grid md:grid-cols-2 gap-4">
                <div>
                    <strong className="text-brand-blue block mb-1">Step 1:</strong>
                    <p className="text-gray-300">Run this script in your Supabase project's SQL Editor to create the necessary tables.</p>
                </div>
                <div>
                    <strong className="text-white block mb-1">Step 2:</strong>
                    <p className="text-gray-300">Copy your Project URL and Anon Key, then paste them into the "Database Configuration" section of your admin panel.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseSchemaViewer;
