
import React from 'react';
import { Users, Globe, Award, Heart } from 'lucide-react';
import { useGlobal } from '../GlobalContext';

const About: React.FC = () => {
  const { companyProfile, sitePages } = useGlobal();
  const pageContent = sitePages.find(p => p.id === 'about')?.content || '';

  const stats = [
    { label: 'Happy Travelers', value: '10k+', icon: Users },
    { label: 'Destinations', value: '50+', icon: Globe },
    { label: 'Awards Won', value: '12', icon: Award },
    { label: 'Years Experience', value: '8', icon: Heart },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="relative h-[400px]">
        <img 
          src="https://images.unsplash.com/photo-1526772662000-3f88f1424b74?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
          alt="About Us" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-5xl font-bold text-white tracking-tight">Our Story</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Redefining Travel in India</h2>
            {/* Dynamic Content */}
            <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: pageContent }}></div>
          </div>
          <div className="relative">
             <div className="absolute -inset-4 bg-brand-orange/20 rounded-2xl transform rotate-3"></div>
             <img 
               src="https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
               alt="Team" 
               className="relative rounded-2xl shadow-xl w-full h-auto"
             />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-brand-blue">
                <stat.icon size={24} />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="text-center max-w-3xl mx-auto">
           <h2 className="text-3xl font-bold text-gray-900 mb-12">Our Core Values</h2>
           <div className="grid md:grid-cols-3 gap-8">
              <div>
                 <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-blue text-2xl font-bold">1</div>
                 <h3 className="font-bold text-lg mb-2">Authenticity</h3>
                 <p className="text-gray-600 text-sm">We show you the real India, beyond the guidebooks.</p>
              </div>
              <div>
                 <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-green text-2xl font-bold">2</div>
                 <h3 className="font-bold text-lg mb-2">Transparency</h3>
                 <p className="text-gray-600 text-sm">No hidden costs. What you see is what you pay.</p>
              </div>
              <div>
                 <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-orange text-2xl font-bold">3</div>
                 <h3 className="font-bold text-lg mb-2">Safety First</h3>
                 <p className="text-gray-600 text-sm">24/7 support and vetted partners for your peace of mind.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default About;
