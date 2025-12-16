
import React, { useState } from 'react';
import { Filter, SlidersHorizontal, Check, LayoutGrid, List, MapPin, Clock, Users, Star } from 'lucide-react';
import PackageCard from '../components/PackageCard';
import { Link } from 'react-router-dom';
import { useCurrency } from '../CurrencyContext';
import { useGlobal } from '../GlobalContext';

const PackageList: React.FC = () => {
  const { formatPrice } = useCurrency();
  const { packages } = useGlobal();
  
  // Filters
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterDestination, setFilterDestination] = useState<string>('');
  const [filterDuration, setFilterDuration] = useState<string>('All');
  const [maxPriceUSD, setMaxPriceUSD] = useState<number>(3000);
  
  // View Mode
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = ['All', 'Adventure', 'Beach', 'Culture', 'Nature', 'Luxury', 'Pilgrimage', 'Budget'];
  const durations = ['All', 'Short (< 5 Days)', 'Medium (5-8 Days)', 'Long (> 8 Days)'];

  // Parse duration helper
  const getDays = (durationStr: string) => {
    const match = durationStr.match(/(\d+)\s*Days?/i);
    return match ? parseInt(match[1]) : 0;
  };

  const filteredPackages = packages.filter(pkg => {
    const matchCategory = filterCategory === 'All' || pkg.category === filterCategory;
    const matchPrice = pkg.price <= maxPriceUSD;
    const matchDest = pkg.destination.toLowerCase().includes(filterDestination.toLowerCase()) || pkg.name.toLowerCase().includes(filterDestination.toLowerCase());
    
    let matchDuration = true;
    const days = getDays(pkg.duration);
    if (filterDuration === 'Short (< 5 Days)') matchDuration = days > 0 && days < 5;
    else if (filterDuration === 'Medium (5-8 Days)') matchDuration = days >= 5 && days <= 8;
    else if (filterDuration === 'Long (> 8 Days)') matchDuration = days > 8;

    return matchCategory && matchPrice && matchDest && matchDuration;
  });

  const displayMaxPrice = formatPrice(maxPriceUSD);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore India Packages</h1>
          <p className="text-gray-500">Find the perfect getaway from our curated selection of Indian destinations.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
              <div className="flex items-center gap-2 mb-6 text-gray-900 font-bold border-b pb-2">
                <Filter size={20} />
                <span>Filters</span>
              </div>

              {/* Destination Search */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Destination</h3>
                <div className="relative">
                   <MapPin className="absolute left-3 top-3 text-gray-400" size={16}/>
                   <input 
                      type="text" 
                      placeholder="Where do you want to go?" 
                      value={filterDestination}
                      onChange={(e) => setFilterDestination(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-blue outline-none"
                   />
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Category</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                  {categories.map(cat => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${filterCategory === cat ? 'border-brand-blue bg-brand-blue' : 'border-gray-300 bg-white'}`}>
                        {filterCategory === cat && <Check size={12} className="text-white"/>}
                      </div>
                      <input 
                        type="radio" 
                        name="category" 
                        className="hidden" 
                        checked={filterCategory === cat}
                        onChange={() => setFilterCategory(cat)}
                      />
                      <span className={`text-sm group-hover:text-brand-blue transition-colors ${filterCategory === cat ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Duration Filter */}
              <div className="mb-6">
                 <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Duration</h3>
                 <select 
                    value={filterDuration}
                    onChange={(e) => setFilterDuration(e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                 >
                    {durations.map(d => <option key={d}>{d}</option>)}
                 </select>
              </div>

              {/* Price Filter */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Max Price ({displayMaxPrice})</h3>
                <input 
                  type="range" 
                  min="100" 
                  max="5000" 
                  step="50"
                  value={maxPriceUSD}
                  onChange={(e) => setMaxPriceUSD(Number(e.target.value))}
                  className="w-full accent-brand-blue cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>{formatPrice(100)}</span>
                  <span>{formatPrice(5000)}+</span>
                </div>
              </div>
              
              <button 
                  onClick={() => {setFilterCategory('All'); setMaxPriceUSD(5000); setFilterDestination(''); setFilterDuration('All');}}
                  className="w-full mt-6 py-2 text-brand-blue text-sm font-bold border border-brand-blue rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Reset All Filters
              </button>
            </div>
          </aside>

          {/* Listing Grid */}
          <div className="flex-1">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <p className="text-gray-500 text-sm">Showing <span className="font-bold text-gray-900">{filteredPackages.length}</span> packages</p>
              
              <div className="flex items-center gap-4">
                 {/* View Toggle */}
                 <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
                    <button 
                       onClick={() => setViewMode('grid')}
                       className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-gray-100 text-brand-blue' : 'text-gray-400 hover:text-gray-600'}`}
                       title="Grid View"
                    >
                       <LayoutGrid size={20}/>
                    </button>
                    <button 
                       onClick={() => setViewMode('list')}
                       className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-gray-100 text-brand-blue' : 'text-gray-400 hover:text-gray-600'}`}
                       title="List View"
                    >
                       <List size={20}/>
                    </button>
                 </div>

                 <button className="flex items-center gap-2 text-sm text-gray-600 font-medium hover:text-brand-blue bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
                   <SlidersHorizontal size={16} />
                   Sort
                 </button>
              </div>
            </div>

            {/* Grid/List Render */}
            {filteredPackages.length > 0 ? (
              <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-6"}>
                {filteredPackages.map(pkg => (
                  viewMode === 'grid' ? (
                     <PackageCard key={pkg.id} pkg={pkg} />
                  ) : (
                     // LIST VIEW CARD
                     <div key={pkg.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all flex flex-col md:flex-row h-auto md:h-56 group">
                        <div className="md:w-1/3 relative overflow-hidden h-48 md:h-full">
                           <img src={pkg.images[0]} alt={pkg.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                           <div className="absolute top-3 left-3 bg-brand-blue text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                              {pkg.category}
                           </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col justify-between">
                           <div>
                              <div className="flex justify-between items-start mb-2">
                                 <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-blue transition-colors line-clamp-1">{pkg.name}</h3>
                                 <div className="flex items-center gap-1 text-xs font-bold text-gray-600">
                                    <Star size={14} className="text-yellow-400 fill-current"/> {pkg.rating}
                                 </div>
                              </div>
                              <p className="text-sm text-gray-500 line-clamp-2 mb-4">{pkg.shortDesc}</p>
                              
                              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                 <div className="flex items-center gap-1.5"><Clock size={16} className="text-brand-green"/> {pkg.duration}</div>
                                 <div className="flex items-center gap-1.5"><Users size={16} className="text-brand-green"/> {pkg.groupSize}</div>
                                 <div className="flex items-center gap-1.5"><MapPin size={16} className="text-brand-green"/> {pkg.destination}</div>
                              </div>
                           </div>
                           
                           <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                              <div>
                                 <span className="text-xs text-gray-400">Starting from</span>
                                 <div className="text-xl font-bold text-brand-blue">{formatPrice(pkg.price)}</div>
                              </div>
                              <Link to={`/package/${pkg.id}`} className="bg-gray-900 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-brand-orange transition-colors">
                                 View Details
                              </Link>
                           </div>
                        </div>
                     </div>
                  )
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4 text-gray-400">
                  <Filter size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No packages found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters to find what you're looking for.</p>
                <button 
                  onClick={() => {setFilterCategory('All'); setMaxPriceUSD(5000); setFilterDestination(''); setFilterDuration('All');}}
                  className="text-brand-blue font-semibold hover:underline"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageList;
