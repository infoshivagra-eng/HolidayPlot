
import React, { useState } from 'react';
import { Filter, SlidersHorizontal, Check } from 'lucide-react';
import PackageCard from '../components/PackageCard';
import { useCurrency } from '../CurrencyContext';
import { useGlobal } from '../GlobalContext';

const PackageList: React.FC = () => {
  const { currency, formatPrice } = useCurrency();
  const { packages } = useGlobal(); // Use global packages
  const [filterCategory, setFilterCategory] = useState<string>('All');
  
  // Max price state in Base Currency (USD)
  const [maxPriceUSD, setMaxPriceUSD] = useState<number>(3000); 

  const filteredPackages = packages.filter(pkg => {
    const matchCategory = filterCategory === 'All' || pkg.category === filterCategory;
    const matchPrice = pkg.price <= maxPriceUSD;
    return matchCategory && matchPrice;
  });

  const categories = ['All', 'Adventure', 'Beach', 'Culture', 'Nature', 'Luxury', 'Pilgrimage', 'Budget'];

  // Calculate display value for range slider
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
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
              <div className="flex items-center gap-2 mb-6 text-gray-900 font-bold border-b pb-2">
                <Filter size={20} />
                <span>Filters</span>
              </div>

              {/* Category Filter */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Category</h3>
                <div className="space-y-2">
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
            </div>
          </aside>

          {/* Listing Grid */}
          <div className="flex-1">
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-500 text-sm">Showing <span className="font-bold text-gray-900">{filteredPackages.length}</span> packages</p>
              <button className="flex items-center gap-2 text-sm text-gray-600 font-medium hover:text-brand-blue">
                <SlidersHorizontal size={16} />
                Sort by Recommended
              </button>
            </div>

            {/* Grid */}
            {filteredPackages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPackages.map(pkg => (
                  <PackageCard key={pkg.id} pkg={pkg} />
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
                  onClick={() => {setFilterCategory('All'); setMaxPriceUSD(5000);}}
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
