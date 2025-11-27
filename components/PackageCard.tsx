import React from 'react';
import { Clock, Star, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Package } from '../types';
import { useCurrency } from '../CurrencyContext';

interface PackageCardProps {
  pkg: Package;
}

const PackageCard: React.FC<PackageCardProps> = ({ pkg }) => {
  const { formatPrice } = useCurrency();

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
      <div className="relative h-56 overflow-hidden">
        <img
          src={pkg.images[0]}
          alt={pkg.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm">
          {pkg.category}
        </div>
        {pkg.price < 400 && ( // Threshold adjusted for USD prices
          <div className="absolute top-4 left-4 bg-brand-orange text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
            Best Value
          </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div className="text-xs font-semibold text-brand-blue uppercase tracking-wide">
            {pkg.destination}
          </div>
          <div className="flex items-center gap-1">
            <Star size={14} className="text-yellow-400 fill-current" />
            <span className="text-xs font-bold text-gray-700">{pkg.rating}</span>
            <span className="text-xs text-gray-400">({pkg.reviewsCount})</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-brand-blue transition-colors">
          <Link to={`/package/${pkg.id}`}>{pkg.name}</Link>
        </h3>
        
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
          {pkg.shortDesc}
        </p>

        <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
          <div className="flex items-center gap-1.5">
            <Clock size={16} className="text-brand-green" />
            <span>{pkg.duration}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users size={16} className="text-brand-green" />
            <span>{pkg.groupSize}</span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
          <div>
            <span className="text-xs text-gray-400 block">From</span>
            <span className="text-xl font-bold text-brand-blue">{formatPrice(pkg.price)}</span>
          </div>
          <Link 
            to={`/package/${pkg.id}`}
            className="px-5 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-brand-orange transition-colors"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
