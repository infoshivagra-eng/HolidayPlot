
import React from 'react';
import { Search, Map, ShieldCheck, Heart, ArrowRight, Sparkles, Quote } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { TESTIMONIALS } from '../constants';
import PackageCard from '../components/PackageCard';
import AiPlannerSection from '../components/AiPlannerSection';
import { useGlobal } from '../GlobalContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { packages, companyProfile } = useGlobal(); // Use global packages and profile
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/packages');
  };

  const heroImage = companyProfile.heroImage || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80';

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="India Travel"
            className="w-full h-full object-cover transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-brand-dark/90"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 text-center lg:text-left">
            <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1 mb-6">
               <span className="text-brand-orange font-bold text-sm tracking-wide flex items-center gap-2">
                 <Sparkles size={14} className="fill-current"/> #1 Travel Planner for India
               </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-yellow-300">Incredible</span> <br/>
              India's Soul
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              From the royal forts of Rajasthan to the serene backwaters of Kerala. We craft experiences, not just tours.
            </p>
            
            {/* Search Box - simplified */}
            <div className="bg-white/10 backdrop-blur-lg p-2 rounded-2xl inline-block border border-white/20">
               <Link to="/packages" className="bg-brand-blue hover:bg-sky-500 text-white text-lg font-bold py-4 px-10 rounded-xl transition-all shadow-lg hover:shadow-sky-500/50 flex items-center gap-3">
                  Explore Packages <ArrowRight size={20}/>
               </Link>
            </div>
          </div>

          {/* AI Planner Embedded Widget */}
          <div className="lg:col-span-5">
             <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-blue to-brand-green"></div>
                <div className="mb-4">
                   <h3 className="text-2xl font-bold text-gray-900">AI Trip Planner</h3>
                   <p className="text-sm text-gray-500">Get a personalized itinerary in seconds.</p>
                </div>
                <AiPlannerSection embedded={true} />
             </div>
          </div>
        </div>
      </section>

      {/* Popular Packages */}
      <section className="py-24 bg-brand-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-3">Trending Destinations</h2>
              <p className="text-gray-500 text-lg">Handpicked experiences loved by travelers.</p>
            </div>
            <Link to="/packages" className="hidden md:flex items-center gap-2 text-brand-blue font-bold hover:gap-3 transition-all bg-blue-50 px-4 py-2 rounded-full">
              View All <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.slice(0, 6).map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
          
           <div className="mt-12 text-center md:hidden">
            <Link to="/packages" className="inline-flex items-center gap-2 bg-brand-blue text-white font-bold px-6 py-3 rounded-full">
              View All Packages <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-brand-blue font-bold tracking-wider uppercase text-sm">Our Promise</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">Why Travel with HolidayPot?</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">We specialize in Indian hospitality with global standards.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="group bg-gray-50 p-8 rounded-3xl hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100">
                <div className="w-20 h-20 bg-blue-100 text-brand-blue rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <ShieldCheck size={36} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">100% Verified</h3>
                <p className="text-gray-500">Every driver, hotel, and guide is vetted personally by our team for your safety.</p>
              </div>
              <div className="group bg-gray-50 p-8 rounded-3xl hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100">
                <div className="w-20 h-20 bg-green-100 text-brand-green rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Map size={36} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Hidden Gems</h3>
                <p className="text-gray-500">We take you to secret spots that standard tour operators don't even know about.</p>
              </div>
              <div className="group bg-gray-50 p-8 rounded-3xl hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100">
                <div className="w-20 h-20 bg-orange-100 text-brand-orange rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Heart size={36} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Best Price Guarantee</h3>
                <p className="text-gray-500">Direct rates from local providers. No hidden markup fees on currency conversion.</p>
              </div>
            </div>
         </div>
      </section>

      {/* Taxi CTA */}
      <section className="py-24 bg-brand-dark relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand-blue opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-brand-green opacity-10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-16">
             <div className="md:w-1/2 text-white">
                <div className="inline-block bg-white/10 px-4 py-1 rounded-full text-sm font-bold mb-4">🚖 Reliable Transport</div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Need a Ride? <br/> We've Got You.</h2>
                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                  Book intercity cabs for outstation trips or airport transfers. Verified drivers, clean cars, and transparent pricing per km.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/taxi" className="bg-brand-blue hover:bg-sky-500 text-white font-bold py-4 px-8 rounded-xl transition-colors shadow-lg shadow-sky-900/50">
                    Search Taxi
                  </Link>
                  <Link to="/taxi" className="bg-transparent border-2 border-white/20 hover:border-white text-white font-bold py-4 px-8 rounded-xl hover:bg-white/5 transition-all">
                    Register as Driver
                  </Link>
                </div>
             </div>
             <div className="md:w-1/2 relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue to-transparent opacity-20 rounded-2xl transform rotate-3"></div>
                <img src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Taxi" className="rounded-2xl shadow-2xl relative z-10 transform -rotate-2 hover:rotate-0 transition-transform duration-500 border-4 border-white/10" />
             </div>
          </div>
        </div>
      </section>

      {/* Attractive Testimonials */}
      <section className="py-24 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
             <h2 className="text-4xl font-bold text-gray-900 mb-4">Stories from the Road</h2>
             <p className="text-gray-600">Real experiences from our community of travelers.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-bl-full -mr-4 -mt-4 transition-all group-hover:scale-110"></div>
                <Quote size={40} className="text-brand-blue/10 mb-4 relative z-10 group-hover:text-brand-blue/20 transition-colors" />
                
                <p className="text-gray-600 mb-8 flex-grow relative z-10 text-sm leading-relaxed">
                  "{t.text}"
                </p>
                
                <div className="flex items-center gap-4 pt-4 border-t border-gray-50">
                  <img src={t.avatar || `https://ui-avatars.com/api/?name=${t.name}&background=random`} alt={t.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md" />
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{t.name}</h4>
                    <span className="text-xs text-gray-500 flex items-center gap-1"><Map size={10}/> {t.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
