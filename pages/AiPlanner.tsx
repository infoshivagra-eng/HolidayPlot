import React from 'react';
import { Sparkles } from 'lucide-react';
import AiPlannerSection from '../components/AiPlannerSection';

const AiPlanner: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm text-brand-blue font-bold mb-4">
            <Sparkles size={20} />
            <span>AI Powered</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Smart Travel Planner</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tell us where you want to go, and our AI will craft the perfect Indian adventure for you in seconds.
          </p>
        </div>

        <AiPlannerSection />
      </div>
    </div>
  );
};

export default AiPlanner;