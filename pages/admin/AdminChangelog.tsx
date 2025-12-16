
import React from 'react';
import { GitCommit, Tag, Calendar } from 'lucide-react';

const AdminChangelog: React.FC = () => {
  const versions = [
    {
      version: 'v1.2.0',
      date: '2024-10-27',
      title: 'Content Management & Enquiries',
      changes: [
        'Added "Manage Pages" section in Settings to edit About, Terms, and Privacy pages.',
        'Connected Contact Us form to the Enquiries system (General type).',
        'Added internal documentation and changelog pages.',
        'Improved global state persistence for page content.'
      ]
    },
    {
      version: 'v1.1.0',
      date: '2024-10-25',
      title: 'Blog & SEO Expansion',
      changes: [
        'Launched full Blog Management system with AI content generation.',
        'Added FAQ Schema and rich snippets for SEO.',
        'Implemented Image Gallery support in blog posts.',
        'Added Draft/Publish workflow for articles.'
      ]
    },
    {
      version: 'v1.0.0',
      date: '2024-10-20',
      title: 'Initial Release',
      changes: [
        'Core booking engine for Packages and Taxis.',
        'AI Travel Planner integration.',
        'Driver Dashboard and fleet management.',
        'Basic Admin Dashboard with Analytics.',
        'Responsive UI with Tailwind CSS.'
      ]
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex items-center justify-between">
         <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <GitCommit className="text-brand-blue"/> System Updates
         </h1>
         <span className="text-sm text-gray-500">Current Version: <span className="font-mono font-bold text-gray-900">v1.2.0</span></span>
      </div>

      <div className="relative border-l-2 border-gray-200 ml-4 space-y-12">
         {versions.map((ver, idx) => (
            <div key={idx} className="relative pl-8">
               <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-brand-blue border-4 border-white shadow-sm"></div>
               <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full flex items-center w-fit gap-1">
                     <Tag size={12}/> {ver.version}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                     <Calendar size={12}/> {ver.date}
                  </span>
               </div>
               <h3 className="text-lg font-bold text-gray-900 mb-2">{ver.title}</h3>
               <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                  {ver.changes.map((change, cIdx) => (
                     <li key={cIdx}>{change}</li>
                  ))}
               </ul>
            </div>
         ))}
      </div>
    </div>
  );
};

export default AdminChangelog;
