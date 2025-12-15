
import React, { useState } from 'react';
import { Clock, Star, Users, Share2, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Package } from '../types';
import { useCurrency } from '../CurrencyContext';

interface PackageCardProps {
  pkg: Package;
}

const PackageCard: React.FC<PackageCardProps> = ({ pkg }) => {
  const { formatPrice } = useCurrency();
  const [copied, setCopied] = useState(false);

  // Calculate if package is new (within last 7 days)
  const isNew = React.useMemo(() => {
    if (!pkg.created_at) return false;
    const created = new Date(pkg.created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays <= 7;
  }, [pkg.created_at]);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/#/package/${pkg.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: pkg.name,
          text: `Check out this trip: ${pkg.name}`,
          url: url,
        });
      } catch (err) {
        console.log("Share skipped");
      }
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full relative">
      <div className="relative h-56 overflow-hidden">
        <img
          src={pkg.images[0]}
          alt={pkg.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm">
          {pkg.category}
        </div>
        
        {/* Badges Container */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
           {isNew && (
             <div className="bg-brand-green text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm animate-pulse">
                New Arrival
             </div>
           )}
           {pkg.price < 400 && ( 
             <div className="bg-brand-orange text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
               Best Value
             </div>
           )}
        </div>

        {/* Share Button Overlay */}
        <button 
          onClick={handleShare}
          className="absolute bottom-3 right-3 bg-white/90 backdrop-blur p-2 rounded-full text-gray-700 hover:text-brand-blue hover:scale-110 transition-all shadow-md z-10"
          title="Share Package"
        >
          {copied ? <Check size={16} className="text-green-600"/> : <Share2 size={16}/>}
        </button>
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
