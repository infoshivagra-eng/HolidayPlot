
import React from 'react';
import { useGlobal } from '../GlobalContext';

const Terms: React.FC = () => {
  const { companyProfile, sitePages } = useGlobal();
  const page = sitePages.find(p => p.id === 'terms');

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-100">{page?.title || 'Terms and Conditions'}</h1>
        
        <div className="prose prose-blue max-w-none text-gray-600">
          <p className="mb-4 text-sm text-gray-400">Last Updated: {page?.lastUpdated ? new Date(page.lastUpdated).toLocaleDateString() : new Date().toLocaleDateString()}</p>
          <div dangerouslySetInnerHTML={{ __html: page?.content || '<p>Terms content not available.</p>' }} />
        </div>
      </div>
    </div>
  );
};

export default Terms;
