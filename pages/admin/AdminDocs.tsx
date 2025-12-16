
import React from 'react';
import { BookOpen, Search, Package, Users, Settings, FileText, CheckCircle } from 'lucide-react';

const AdminDocs: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="bg-gradient-to-r from-blue-900 to-brand-blue p-8 rounded-2xl text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
           <BookOpen size={32}/> System Guide
        </h1>
        <p className="text-blue-100 max-w-2xl">
           Welcome to the backend documentation for HolidayPot. This guide explains how to manage content, bookings, and settings efficiently.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
         <div className="md:col-span-2 space-y-8">
            
            {/* Packages */}
            <section id="packages" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
               <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><Package className="text-orange-500"/> Managing Packages</h2>
               <div className="prose prose-sm text-gray-600">
                  <p>Packages are the core product. You can create, edit, or delete packages from the "Packages" tab.</p>
                  <ul className="list-disc pl-5 space-y-2">
                     <li><strong>AI Generation:</strong> Use the "Magic Wand" icon to auto-generate itineraries, hidden gems, and packing lists based on just a destination name.</li>
                     <li><strong>Images:</strong> Currently supports direct URL links (e.g., Unsplash). Ensure links are publicly accessible.</li>
                     <li><strong>Itinerary:</strong> Building a day-by-day plan is crucial. Use the "Add Day" button or let AI draft it for you.</li>
                  </ul>
               </div>
            </section>

            {/* Drivers */}
            <section id="drivers" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
               <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><Users className="text-blue-500"/> Driver Fleet</h2>
               <div className="prose prose-sm text-gray-600">
                  <p>Manage your taxi fleet under the "Drivers" tab.</p>
                  <ul className="list-disc pl-5 space-y-2">
                     <li><strong>Status:</strong> Drivers can be set to 'Available', 'Busy', or 'Offline'. Only 'Available' drivers appear in customer searches.</li>
                     <li><strong>Rates:</strong> Set base fare (flag fall) and per-km rates in the driver edit modal.</li>
                  </ul>
               </div>
            </section>

            {/* Content */}
            <section id="content" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
               <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><FileText className="text-purple-500"/> Page Content</h2>
               <div className="prose prose-sm text-gray-600">
                  <p>To edit legal and informational pages:</p>
                  <ol className="list-decimal pl-5 space-y-2">
                     <li>Go to <strong>Settings</strong> via the sidebar.</li>
                     <li>Select the <strong>Manage Pages</strong> tab.</li>
                     <li>Choose the page (About, Terms, Privacy) from the dropdown.</li>
                     <li>Edit the HTML content directly in the text area. You can use tags like <code>&lt;h2&gt;</code>, <code>&lt;p&gt;</code>, and <code>&lt;strong&gt;</code>.</li>
                     <li>Click Save. Changes are reflected immediately on the live site.</li>
                  </ol>
               </div>
            </section>

         </div>

         {/* Quick Links */}
         <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-6">
               <h3 className="font-bold text-gray-900 mb-4">Quick Tips</h3>
               <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex gap-2">
                     <CheckCircle size={16} className="text-green-500 flex-shrink-0"/>
                     <span>Always check the "SEO" tab in Settings to update meta tags for better Google ranking.</span>
                  </li>
                  <li className="flex gap-2">
                     <CheckCircle size={16} className="text-green-500 flex-shrink-0"/>
                     <span>Use the "Backup" feature in Settings regularly to download a JSON snapshot of your data.</span>
                  </li>
                  <li className="flex gap-2">
                     <CheckCircle size={16} className="text-green-500 flex-shrink-0"/>
                     <span>Contact enquiries appear under "Enquiries" with type "General".</span>
                  </li>
               </ul>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminDocs;
