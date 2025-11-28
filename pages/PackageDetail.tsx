
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Users, CheckCircle2, XCircle, Map as MapIcon, Star, Camera, Utensils, AlertTriangle, FileText, Briefcase, ChevronRight, Share2, ShieldCheck, Facebook, Twitter, Link as LinkIcon, MessageCircle } from 'lucide-react';
import { useCurrency } from '../CurrencyContext';
import { useGlobal } from '../GlobalContext';
import { formatDate } from '../utils';

const PackageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { formatPrice, currency } = useCurrency();
  const { packages } = useGlobal(); // Use global packages
  const pkg = packages.find((p) => p.id === id);
  const [activeTab, setActiveTab] = useState('itinerary');
  
  // New state for dynamic pricing and travel date
  const [travelers, setTravelers] = useState(2);
  const [travelDate, setTravelDate] = useState('');

  // Sharing State
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  if (!pkg) {
    return <div className="p-10 text-center text-gray-500">Package not found</div>;
  }

  const handleBookNow = () => {
    navigate('/booking', { 
        state: { 
            type: 'Package', 
            item: pkg, 
            travelers: travelers,
            travelDate: travelDate 
        } 
    });
  };

  const shareUrl = window.location.href;
  const shareText = `Check out this amazing trip to ${pkg.destination}: ${pkg.name} on HolidayPot!`;

  const handleShare = async () => {
    // Try Native Share first (Mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: pkg.name,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }
    // Fallback to dropdown
    setIsShareOpen(!isShareOpen);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
    setIsShareOpen(false);
  };

  const tabs = [
    { id: 'itinerary', label: 'Itinerary', icon: <Clock size={16}/> },
    { id: 'guide', label: 'Hidden Gems & Food', icon: <Utensils size={16}/> },
    { id: 'smart', label: 'Smart Travel', icon: <Briefcase size={16}/> },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-sans" onClick={() => isShareOpen && setIsShareOpen(false)}>
      {/* Immersive Header */}
      <div className="relative h-[65vh] min-h-[500px]">
        <img 
          src={pkg.images[0]} 
          alt={pkg.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        {/* Navigation & Actions */}
        <div className="absolute top-6 left-0 w-full px-6 flex justify-between items-center z-20">
           <Link to="/packages" className="bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/30 transition-colors">
              <ChevronRight size={20} className="rotate-180"/>
           </Link>
           
           <div className="relative">
             <button 
                onClick={(e) => { e.stopPropagation(); handleShare(); }}
                className="bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/30 transition-colors"
             >
                <Share2 size={20}/>
             </button>

             {/* Social Share Dropdown */}
             {isShareOpen && (
                <div className="absolute right-0 top-14 w-56 bg-white rounded-xl shadow-2xl p-2 z-50 animate-fade-in border border-gray-100">
                    <div className="text-xs font-bold text-gray-400 px-3 py-2 uppercase">Share via</div>
                    
                    <a 
                      href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-green-50 text-gray-700 rounded-lg transition-colors"
                    >
                        <MessageCircle size={18} className="text-green-500"/> WhatsApp
                    </a>
                    
                    <a 
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 text-gray-700 rounded-lg transition-colors"
                    >
                        <Facebook size={18} className="text-blue-600"/> Facebook
                    </a>
                    
                    <a 
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-sky-50 text-gray-700 rounded-lg transition-colors"
                    >
                        <Twitter size={18} className="text-sky-400"/> Twitter / X
                    </a>
                    
                    <button 
                      onClick={copyToClipboard}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors text-left"
                    >
                        <LinkIcon size={18} className="text-gray-500"/> Copy Link
                    </button>
                </div>
             )}
             
             {/* Copy Success Toast */}
             {copySuccess && (
                <div className="absolute right-0 top-14 bg-black/80 text-white text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap animate-fade-in">
                    Link Copied!
                </div>
             )}
           </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white">
          <div className="max-w-7xl mx-auto">
             <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="bg-brand-blue/90 backdrop-blur px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">{pkg.category}</span>
                <span className="bg-white/20 backdrop-blur px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1">
                   <Star size={14} className="fill-yellow-400 text-yellow-400"/> {pkg.rating} ({pkg.reviewsCount} reviews)
                </span>
             </div>
             <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-lg">{pkg.name}</h1>
             <div className="flex flex-wrap gap-6 text-sm md:text-base font-medium">
                <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-lg backdrop-blur-sm"><MapPin size={18} className="text-brand-orange"/> {pkg.destination}</div>
                <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-lg backdrop-blur-sm"><Clock size={18} className="text-brand-green"/> {pkg.duration}</div>
                <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-lg backdrop-blur-sm"><Users size={18} className="text-purple-400"/> {pkg.groupSize}</div>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content Area */}
          <div className="flex-1">
             {/* Tab Navigation */}
             <div className="bg-white rounded-t-2xl p-2 flex gap-2 shadow-sm border-b border-gray-100 overflow-x-auto">
                {tabs.map(tab => (
                   <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-brand-blue text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                   >
                      {tab.icon} {tab.label}
                   </button>
                ))}
             </div>

            <div className="bg-white rounded-b-3xl shadow-sm p-6 md:p-8 min-h-[500px]">
              
              {/* TAB: ITINERARY (Overview + Day Wise) */}
              {activeTab === 'itinerary' && (
                <div className="animate-fade-in space-y-10">
                  <div>
                    <h2 className="text-2xl font-bold mb-4 text-gray-900">Experience the Magic</h2>
                    <p className="text-gray-600 leading-relaxed mb-6 text-lg">{pkg.longDesc}</p>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                          <span className="text-xs text-orange-600 font-bold uppercase mb-1 block">Best Time</span>
                          <span className="font-semibold text-gray-800">{pkg.bestTime}</span>
                       </div>
                       <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                          <span className="text-xs text-blue-600 font-bold uppercase mb-1 block">Perfect For</span>
                          <span className="font-semibold text-gray-800">{pkg.idealFor.join(', ')}</span>
                       </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><MapIcon size={20} className="text-brand-blue"/> Day-by-Day Journey</h3>
                    <div className="space-y-6">
                      {pkg.itinerary.map((day, idx) => (
                        <div key={idx} className="flex gap-4 group"> 
                          <div className="flex-shrink-0 flex flex-col items-center">
                             <div className="w-12 h-12 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-lg shadow-lg z-10 group-hover:scale-110 transition-transform">
                                {day.day}
                             </div>
                             {idx !== pkg.itinerary.length - 1 && <div className="w-0.5 h-full bg-gray-200 my-2"></div>}
                          </div>
                          <div className="flex-grow bg-white p-5 rounded-2xl border border-gray-100 hover:border-brand-blue/30 hover:shadow-md transition-all">
                            <h4 className="text-lg font-bold text-gray-900 mb-2">{day.title}</h4>
                            <div className="space-y-2 mb-3">
                              {day.activities.map((act, i) => (
                                <div key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                                   <div className="w-1.5 h-1.5 bg-brand-orange rounded-full mt-1.5 flex-shrink-0"></div>
                                   {act}
                                </div>
                              ))}
                            </div>
                            {day.meals.length > 0 && (
                               <div className="inline-flex items-center gap-2 text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-full">
                                  <Utensils size={12}/> {day.meals.join(' + ')}
                               </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Inclusions */}
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                     <h3 className="font-bold text-gray-900 mb-4">What's Included</h3>
                     <div className="grid md:grid-cols-2 gap-4">
                        {pkg.inclusions.map((inc, i) => (
                           <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                              <CheckCircle2 size={16} className="text-green-500 flex-shrink-0"/> {inc}
                           </div>
                        ))}
                        {pkg.exclusions.map((exc, i) => (
                           <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                              <XCircle size={16} className="text-red-300 flex-shrink-0"/> <span className="line-through">{exc}</span>
                           </div>
                        ))}
                     </div>
                  </div>
                </div>
              )}

              {/* TAB: GUIDE (Hidden Gems + Food) */}
              {activeTab === 'guide' && (
                <div className="animate-fade-in space-y-10">
                   
                   {/* Hidden Gems */}
                   <div>
                      <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-purple-600">
                         <Camera size={20}/> Hidden Gem Spots
                         <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-normal ml-2">Curated</span>
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                         {pkg.hiddenGems ? pkg.hiddenGems.map((gem, i) => (
                            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
                               <div className="h-40 overflow-hidden">
                                  <img src={gem.image} alt={gem.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                               </div>
                               <div className="p-4">
                                  <h4 className="font-bold text-gray-900 mb-1">{gem.title}</h4>
                                  <p className="text-sm text-gray-500">{gem.description}</p>
                               </div>
                            </div>
                         )) : <p className="text-gray-500 italic">Hidden gems coming soon for this package.</p>}
                      </div>
                   </div>

                   {/* Food Guide */}
                   <div>
                      <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-orange-600">
                         <Utensils size={20}/> Meals to Try
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {pkg.foodGuide ? pkg.foodGuide.map((food, i) => (
                            <div key={i} className="flex items-center justify-between bg-orange-50 p-4 rounded-xl border border-orange-100">
                               <div>
                                  <div className="font-bold text-gray-800 flex items-center gap-2">
                                     {food.name}
                                     {food.mustTry && <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded font-bold uppercase">Must Try</span>}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                     <span className={`w-2 h-2 rounded-full ${food.type === 'Veg' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                     {food.type} • Approx {formatPrice(food.cost)}
                                  </div>
                               </div>
                            </div>
                         )) : <p className="text-gray-500 italic">Food guide coming soon.</p>}
                      </div>
                   </div>

                </div>
              )}

              {/* TAB: SMART TRAVEL (Packing, Visa, Safety, Airport) */}
              {activeTab === 'smart' && (
                <div className="animate-fade-in grid md:grid-cols-2 gap-8">
                   
                   {/* Packing List */}
                   <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                      <h3 className="font-bold text-blue-800 mb-4 flex items-center gap-2"><Briefcase size={18}/> Smart Packing List</h3>
                      {pkg.packingList ? pkg.packingList.map((cat, i) => (
                         <div key={i} className="mb-4 last:mb-0">
                            <h4 className="text-xs font-bold text-blue-600 uppercase mb-2">{cat.category}</h4>
                            <ul className="space-y-2">
                               {cat.items.map((item, j) => (
                                  <li key={j} className="flex items-center gap-2 text-sm text-gray-700 bg-white p-2 rounded-lg border border-blue-100/50">
                                     <span className="w-4 h-4 rounded border border-gray-300 flex-shrink-0"></span> {item}
                                  </li>
                               ))}
                            </ul>
                         </div>
                      )) : <p className="text-sm text-gray-500">Standard travel kit recommended.</p>}
                   </div>

                   <div className="space-y-6">
                      {/* Safety / Scams */}
                      <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                         <h3 className="font-bold text-red-800 mb-4 flex items-center gap-2"><AlertTriangle size={18}/> Scam Shield</h3>
                         {pkg.safetyTips ? (
                            <ul className="space-y-3">
                               {pkg.safetyTips.map((tip, i) => (
                                  <li key={i} className="text-sm text-gray-700">
                                     <span className="font-bold text-red-700 block mb-0.5">{tip.title}</span>
                                     {tip.description}
                                  </li>
                               ))}
                            </ul>
                         ) : <p className="text-sm text-gray-500">General caution advised.</p>}
                      </div>

                      {/* Visa & Airport */}
                      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                         <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><FileText size={18}/> Visa & Airport</h3>
                         
                         {pkg.visaInfo && (
                            <div className="mb-4 pb-4 border-b border-gray-200">
                               <div className="text-xs font-bold text-gray-400 uppercase mb-1">Visa Requirement</div>
                               <p className="text-sm text-gray-700 font-medium">{pkg.visaInfo.requirements}</p>
                               <p className="text-xs text-gray-500 mt-1">Process: {pkg.visaInfo.processingTime}</p>
                            </div>
                         )}

                         {pkg.airportInfo && (
                            <div>
                               <div className="text-xs font-bold text-gray-400 uppercase mb-1">Lounge Finder</div>
                               <div className="flex justify-between items-start">
                                  <div>
                                     <p className="text-sm text-gray-800 font-bold">{pkg.airportInfo.bestLounge}</p>
                                     <p className="text-xs text-gray-500">{pkg.airportInfo.tips}</p>
                                  </div>
                                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
                                     {formatPrice(pkg.airportInfo.price)}
                                  </span>
                               </div>
                            </div>
                         )}
                      </div>
                   </div>

                </div>
              )}

            </div>
          </div>

          {/* Sticky Booking Card */}
          <div className="lg:w-96 flex-shrink-0">
             <div className="sticky top-28 bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
                <div className="flex justify-between items-end mb-6 pb-6 border-b border-gray-100">
                   <div>
                      <span className="text-sm text-gray-400">Total Price</span>
                      <div className="text-3xl font-bold text-gray-900">{formatPrice(pkg.price * travelers)}</div>
                      <span className="text-xs text-green-600 font-medium">Includes taxes & fees</span>
                   </div>
                   <div className="text-right">
                       <div className="flex items-center gap-1 justify-end text-sm font-bold text-gray-800 mb-1">
                          <Star size={14} className="fill-yellow-400 text-yellow-400"/> {pkg.rating}
                       </div>
                       <span className="text-xs text-gray-400 underline">{pkg.reviewsCount} reviews</span>
                   </div>
                </div>

                <div className="space-y-4 mb-6">
                   <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 hover:border-brand-blue transition-colors group">
                      <label className="block text-xs font-bold text-gray-500 mb-1 uppercase group-hover:text-brand-blue">Travel Date</label>
                      <input 
                        type="date" 
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        className="w-full bg-transparent outline-none text-sm font-semibold text-gray-900"
                      />
                   </div>
                   <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 hover:border-brand-blue transition-colors group">
                      <label className="block text-xs font-bold text-gray-500 mb-1 uppercase group-hover:text-brand-blue">Travelers</label>
                      <select 
                        value={travelers}
                        onChange={(e) => setTravelers(Number(e.target.value))}
                        className="w-full bg-transparent outline-none text-sm font-semibold text-gray-900"
                      >
                        <option value={1}>1 Adult</option>
                        <option value={2}>2 Adults</option>
                        <option value={3}>3 Adults</option>
                        <option value={4}>4 Adults</option>
                        <option value={5}>5 Adults</option>
                        <option value={6}>6 Adults</option>
                        <option value={10}>Group (10+)</option>
                      </select>
                   </div>
                </div>

                <button 
                  onClick={handleBookNow}
                  className="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-200 transition-all mb-4 transform hover:-translate-y-0.5"
                >
                  Book Adventure Now
                </button>
                
                <button className="w-full border-2 border-gray-100 hover:border-brand-blue text-gray-600 hover:text-brand-blue font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                  <FileText size={18}/> Download PDF
                </button>

                <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-400">
                   <span className="flex items-center gap-1"><CheckCircle2 size={12}/> Instant Confirm</span>
                   <span className="flex items-center gap-1"><ShieldCheck size={12}/> Secure Payment</span>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PackageDetail;
