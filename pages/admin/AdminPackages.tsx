
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Sparkles, Loader2, Save, X, ChevronDown, ChevronUp, MapPin, List, Utensils, Camera, Briefcase, Info, LayoutGrid, Filter } from 'lucide-react';
import { useGlobal } from '../../GlobalContext';
import { useCurrency } from '../../CurrencyContext';
import { generateAIContent } from '../../utils';
import { Package, ItineraryDay, HiddenGem, FoodItem, PackingItem, SafetyTip, VisaInfo, AirportInfo } from '../../types';

const AdminPackages: React.FC = () => {
  const { packages, addPackage, updatePackage, deletePackage } = useGlobal();
  const { formatPrice } = useCurrency();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  
  // View Mode State
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [modalTab, setModalTab] = useState<'basic' | 'details' | 'itinerary' | 'guide' | 'smart'>('basic');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeDayIndex, setActiveDayIndex] = useState<number | null>(null); // For accordion behavior in itinerary
  
  // Complex State
  const [pkgForm, setPkgForm] = useState({
    name: '',
    destination: '',
    price: '',
    duration: '',
    category: 'Culture',
    groupSize: 'Couples / Family',
    image: '',
    shortDesc: '',
    longDesc: '',
    bestTime: '',
    idealFor: '', // Comma separated
    inclusions: '', // Newline separated
    exclusions: '', // Newline separated
    
    // Complex Objects
    itinerary: [] as ItineraryDay[],
    hiddenGems: [] as HiddenGem[],
    foodGuide: [] as FoodItem[],
    packingList: [] as PackingItem[],
    safetyTips: [] as SafetyTip[],
    visaInfo: { requirements: '', processingTime: '', documents: [] as string[] } as VisaInfo,
    airportInfo: { bestLounge: '', price: 0, tips: '' } as AirportInfo
  });

  const categories = ['All', 'Culture', 'Nature', 'Adventure', 'Beach', 'Pilgrimage', 'Luxury', 'Budget'];

  const filteredPackages = packages.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const resetForm = () => {
    setPkgForm({ 
        name: '', destination: '', price: '', duration: '', category: 'Culture', groupSize: 'Couples / Family', image: '',
        shortDesc: '', longDesc: '', bestTime: '', idealFor: '', inclusions: '', exclusions: '',
        itinerary: [], hiddenGems: [], foodGuide: [], packingList: [], safetyTips: [], 
        visaInfo: { requirements: '', processingTime: '', documents: [] }, 
        airportInfo: { bestLounge: '', price: 0, tips: '' }
    });
    setEditingId(null);
    setModalTab('basic');
    setActiveDayIndex(null);
  };

  const openNewPackageModal = () => {
     resetForm();
     setIsModalOpen(true);
  };

  const handleEditClick = (pkg: Package) => {
    setEditingId(pkg.id);
    setPkgForm({
        name: pkg.name,
        destination: pkg.destination,
        price: pkg.price.toString(),
        duration: pkg.duration,
        category: pkg.category,
        groupSize: pkg.groupSize || '',
        image: pkg.images[0] || '',
        shortDesc: pkg.shortDesc,
        longDesc: pkg.longDesc,
        bestTime: pkg.bestTime,
        idealFor: pkg.idealFor.join(', '),
        inclusions: pkg.inclusions.join('\n'),
        exclusions: pkg.exclusions.join('\n'),
        itinerary: pkg.itinerary || [],
        hiddenGems: pkg.hiddenGems || [],
        foodGuide: pkg.foodGuide || [],
        packingList: pkg.packingList || [],
        safetyTips: pkg.safetyTips || [],
        visaInfo: pkg.visaInfo || { requirements: '', processingTime: '', documents: [] },
        airportInfo: pkg.airportInfo || { bestLounge: '', price: 0, tips: '' }
    });
    setIsModalOpen(true);
  };

  const handleGenerateAI = async () => {
    if (!pkgForm.destination || !pkgForm.name) {
      alert("Please enter Package Name and Destination first to generate content.");
      return;
    }
    setIsGenerating(true);

    try {
      const prompt = `
        Create a comprehensive travel package JSON for:
        Destination: "${pkgForm.destination}"
        Title: "${pkgForm.name}"
        Duration: "${pkgForm.duration}"
        Price: ${pkgForm.price}
        
        Return ONLY raw JSON with this exact structure:
        {
          "shortDesc": "...",
          "longDesc": "...",
          "bestTime": "...",
          "idealFor": ["Tag1", "Tag2"],
          "inclusions": ["Item1", "Item2"],
          "exclusions": ["Item1"],
          "itinerary": [{ "day": 1, "title": "...", "activities": ["..."], "meals": ["..."] }],
          "hiddenGems": [{ "title": "...", "description": "...", "image": "..." }],
          "foodGuide": [{ "name": "...", "type": "Veg/Non-Veg", "cost": 5, "mustTry": true }],
          "packingList": [{ "category": "...", "items": ["..."] }],
          "safetyTips": [{ "title": "...", "description": "..." }],
          "visaInfo": { "requirements": "...", "processingTime": "...", "documents": ["..."] },
          "airportInfo": { "bestLounge": "...", "price": 0, "tips": "..." }
        }
      `;

      const jsonStr = await generateAIContent(prompt);
      const data = JSON.parse(jsonStr); 
      
      setPkgForm(prev => ({
          ...prev,
          shortDesc: data.shortDesc || prev.shortDesc,
          longDesc: data.longDesc || prev.longDesc,
          bestTime: data.bestTime || prev.bestTime,
          idealFor: Array.isArray(data.idealFor) ? data.idealFor.join(', ') : prev.idealFor,
          inclusions: Array.isArray(data.inclusions) ? data.inclusions.join('\n') : prev.inclusions,
          exclusions: Array.isArray(data.exclusions) ? data.exclusions.join('\n') : prev.exclusions,
          itinerary: data.itinerary || [],
          hiddenGems: data.hiddenGems || [],
          foodGuide: data.foodGuide || [],
          packingList: data.packingList || [],
          safetyTips: data.safetyTips || [],
          visaInfo: data.visaInfo || prev.visaInfo,
          airportInfo: data.airportInfo || prev.airportInfo
      }));
      
      alert("Content Generated! Please review all tabs.");
    } catch (error: any) {
      console.error("AI Generation failed", error);
      alert(`AI Generation failed: ${error.message}. Try again.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGranularAI = async (section: 'itinerary' | 'gems' | 'food' | 'smart') => {
    if (!pkgForm.destination) {
        alert("Please enter a Destination in Basic Info first.");
        return;
    }
    setIsGenerating(true);

    try {
        let prompt = "";
        const baseContext = `Destination: ${pkgForm.destination}. Duration: ${pkgForm.duration || '5 Days'}.`;
        
        if (section === 'itinerary') {
            prompt = `${baseContext} Create a daily itinerary. Return JSON: { "itinerary": [{ "day": 1, "title": "...", "activities": ["..."], "meals": ["..."] }] }`;
        } else if (section === 'gems') {
            prompt = `${baseContext} List 3 hidden gems. Return JSON: { "hiddenGems": [{ "title": "...", "description": "...", "image": "..." }] }`;
        } else if (section === 'food') {
            prompt = `${baseContext} List 4 must-try foods. Return JSON: { "foodGuide": [{ "name": "...", "type": "Veg/Non-Veg", "cost": 5, "mustTry": true }] }`;
        } else if (section === 'smart') {
            prompt = `${baseContext} Provide smart travel info. Return JSON: { 
                "packingList": [{ "category": "...", "items": ["..."] }],
                "safetyTips": [{ "title": "...", "description": "..." }],
                "visaInfo": { "requirements": "...", "processingTime": "...", "documents": ["..."] },
                "airportInfo": { "bestLounge": "...", "price": 0, "tips": "..." }
            }`;
        }

        const jsonStr = await generateAIContent(prompt);
        const data = JSON.parse(jsonStr);

        setPkgForm(prev => ({
            ...prev,
            itinerary: section === 'itinerary' && data.itinerary ? data.itinerary : prev.itinerary,
            hiddenGems: section === 'gems' && data.hiddenGems ? data.hiddenGems : prev.hiddenGems,
            foodGuide: section === 'food' && data.foodGuide ? data.foodGuide : prev.foodGuide,
            packingList: section === 'smart' && data.packingList ? data.packingList : prev.packingList,
            safetyTips: section === 'smart' && data.safetyTips ? data.safetyTips : prev.safetyTips,
            visaInfo: section === 'smart' && data.visaInfo ? data.visaInfo : prev.visaInfo,
            airportInfo: section === 'smart' && data.airportInfo ? data.airportInfo : prev.airportInfo,
        }));
    } catch (e: any) {
        alert("AI Error: " + e.message);
    } finally {
        setIsGenerating(false);
    }
  };

  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
        const pkg: Package = {
          id: editingId || `p${Date.now()}`,
          name: pkgForm.name,
          slug: pkgForm.name.toLowerCase().replace(/\s+/g, '-'),
          destination: pkgForm.destination,
          price: Number(pkgForm.price),
          duration: pkgForm.duration,
          category: pkgForm.category as any,
          groupSize: pkgForm.groupSize,
          images: [pkgForm.image],
          rating: 5.0,
          reviewsCount: 0,
          
          shortDesc: pkgForm.shortDesc,
          longDesc: pkgForm.longDesc,
          bestTime: pkgForm.bestTime,
          idealFor: pkgForm.idealFor.split(',').map(s => s.trim()).filter(s => s),
          inclusions: pkgForm.inclusions.split('\n').filter(s => s.trim()),
          exclusions: pkgForm.exclusions.split('\n').filter(s => s.trim()),
          
          itinerary: pkgForm.itinerary,
          hiddenGems: pkgForm.hiddenGems,
          foodGuide: pkgForm.foodGuide,
          packingList: pkgForm.packingList,
          safetyTips: pkgForm.safetyTips,
          visaInfo: { ...pkgForm.visaInfo, documents: pkgForm.visaInfo.documents.map(d => d.trim()).filter(d => d) },
          airportInfo: pkgForm.airportInfo,
          
          created_at: new Date().toISOString()
        };
        
        if (editingId) {
            updatePackage(pkg);
        } else {
            addPackage(pkg);
        }

        setIsModalOpen(false);
        resetForm();
    } catch (err: any) {
        alert(`Validation Error: ${err.message}`);
    }
  };

  // Helper Functions for Dynamic Arrays
  const addItineraryDay = () => setPkgForm(p => ({...p, itinerary: [...p.itinerary, { day: p.itinerary.length + 1, title: '', activities: [], meals: [] }]}));
  const updateItineraryDay = (idx: number, field: string, val: any) => {
     const newItinerary = [...pkgForm.itinerary];
     (newItinerary[idx] as any)[field] = val;
     setPkgForm(p => ({...p, itinerary: newItinerary}));
  };
  const removeItineraryDay = (idx: number) => setPkgForm(p => ({...p, itinerary: p.itinerary.filter((_, i) => i !== idx)}));

  const addGem = () => setPkgForm(p => ({...p, hiddenGems: [...p.hiddenGems, { title: '', description: '', image: '' }]}));
  const updateGem = (idx: number, field: string, val: string) => {
     const newGems = [...pkgForm.hiddenGems];
     (newGems[idx] as any)[field] = val;
     setPkgForm(p => ({...p, hiddenGems: newGems}));
  };
  const removeGem = (idx: number) => setPkgForm(p => ({...p, hiddenGems: p.hiddenGems.filter((_, i) => i !== idx)}));

  const addFood = () => setPkgForm(p => ({...p, foodGuide: [...p.foodGuide, { name: '', type: 'Veg', cost: 0, mustTry: false }]}));
  const updateFood = (idx: number, field: string, val: any) => {
     const newFood = [...pkgForm.foodGuide];
     (newFood[idx] as any)[field] = val;
     setPkgForm(p => ({...p, foodGuide: newFood}));
  };
  const removeFood = (idx: number) => setPkgForm(p => ({...p, foodGuide: p.foodGuide.filter((_, i) => i !== idx)}));

  const inputClass = "w-full p-3 bg-white text-gray-900 border border-gray-300 rounded-lg outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue placeholder-gray-500";

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Manage Packages</h1>
        <button onClick={openNewPackageModal} className="bg-brand-blue text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-sky-600 transition-colors shadow-lg">
          <Plus size={20} /> Add Package
        </button>
      </div>

      {/* Controls: Search, Filter & Toggle */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-grow w-full">
          <Search className="absolute left-3 top-3 text-gray-400" size={20}/>
          <input 
            type="text" 
            placeholder="Search by name or destination..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={inputClass + " pl-10"}
          />
        </div>

        {/* Category Filter */}
        <div className="relative w-full md:w-48 flex-shrink-0">
            <Filter className="absolute left-3 top-3 text-gray-400" size={18}/>
            <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className={inputClass + " pl-10 cursor-pointer"}
            >
                {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>
        </div>
        
        {/* View Toggle */}
        <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm flex-shrink-0">
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
      </div>

      {/* Packages Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map(pkg => (
            <div key={pkg.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
              <div className="h-48 overflow-hidden relative">
                <img src={pkg.images[0]} alt={pkg.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold shadow-sm">
                  {pkg.category}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1 truncate">{pkg.name}</h3>
                <p className="text-sm text-gray-500 mb-3 truncate">{pkg.destination}</p>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
                  <span className="font-bold text-brand-blue">{formatPrice(pkg.price)}</span>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditClick(pkg)} className="p-2 text-gray-600 hover:text-brand-blue hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit size={18}/>
                    </button>
                    <button onClick={() => { if(window.confirm('Delete this package?')) deletePackage(pkg.id); }} className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={18}/>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                       <th className="p-4 text-xs font-bold text-gray-500 uppercase">Package</th>
                       <th className="p-4 text-xs font-bold text-gray-500 uppercase">Destination</th>
                       <th className="p-4 text-xs font-bold text-gray-500 uppercase">Category</th>
                       <th className="p-4 text-xs font-bold text-gray-500 uppercase">Duration</th>
                       <th className="p-4 text-xs font-bold text-gray-500 uppercase">Price</th>
                       <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                    {filteredPackages.map(pkg => (
                       <tr key={pkg.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4 flex items-center gap-3">
                             <img src={pkg.images[0]} alt={pkg.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                             <span className="font-bold text-gray-900 text-sm line-clamp-1">{pkg.name}</span>
                          </td>
                          <td className="p-4 text-sm text-gray-600">{pkg.destination}</td>
                          <td className="p-4">
                             <span className="inline-block bg-blue-50 text-brand-blue px-2.5 py-0.5 rounded-full text-xs font-bold border border-blue-100">
                                {pkg.category}
                             </span>
                          </td>
                          <td className="p-4 text-sm text-gray-600">{pkg.duration}</td>
                          <td className="p-4 text-sm font-bold text-gray-900">{formatPrice(pkg.price)}</td>
                          <td className="p-4 text-right">
                             <div className="flex justify-end gap-2">
                                <button onClick={() => handleEditClick(pkg)} className="p-1.5 text-gray-500 hover:text-brand-blue hover:bg-blue-50 rounded transition-colors" title="Edit">
                                   <Edit size={16}/>
                                </button>
                                <button onClick={() => { if(window.confirm('Delete this package?')) deletePackage(pkg.id); }} className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded transition-colors" title="Delete">
                                   <Trash2 size={16}/>
                                </button>
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
           {filteredPackages.length === 0 && <div className="p-8 text-center text-gray-400">No packages found for this category.</div>}
        </div>
      )}

      {/* Full Screen Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-900">{editingId ? 'Edit Package' : 'Create New Package'}</h2>
              <div className="flex gap-3">
                 <button 
                   onClick={handleGenerateAI} 
                   disabled={isGenerating}
                   className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-purple-200 transition-colors"
                 >
                    {isGenerating ? <Loader2 className="animate-spin" size={16}/> : <Sparkles size={16}/>} 
                    {editingId ? 'Regenerate All' : 'Auto-Fill All'}
                 </button>
                 <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-200 rounded-full"><X size={20}/></button>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b border-gray-100 bg-white overflow-x-auto flex-shrink-0">
               {[
                 { id: 'basic', label: 'Basic Info', icon: Info },
                 { id: 'details', label: 'Descriptions', icon: List },
                 { id: 'itinerary', label: 'Itinerary', icon: MapPin },
                 { id: 'guide', label: 'Gems & Food', icon: Utensils },
                 { id: 'smart', label: 'Smart Travel', icon: Briefcase }
               ].map(tab => (
                 <button 
                    key={tab.id}
                    onClick={() => setModalTab(tab.id as any)} 
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${modalTab === tab.id ? 'border-brand-blue text-brand-blue bg-blue-50/50' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
                 >
                    <tab.icon size={16}/> {tab.label}
                 </button>
               ))}
            </div>

            {/* Content Body */}
            <div className="p-8 overflow-y-auto flex-grow bg-white">
               <form id="pkgForm" onSubmit={handleSavePackage} className="space-y-6">
                  
                  {modalTab === 'basic' && (
                     <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2">
                           <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Package Name</label>
                           <input required type="text" value={pkgForm.name} onChange={e => setPkgForm({...pkgForm, name: e.target.value})} className={inputClass} placeholder="e.g. Magical Kerala"/>
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Destination</label>
                           <input required type="text" value={pkgForm.destination} onChange={e => setPkgForm({...pkgForm, destination: e.target.value})} className={inputClass} placeholder="e.g. Kerala, India"/>
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price (USD)</label>
                           <input required type="number" value={pkgForm.price} onChange={e => setPkgForm({...pkgForm, price: e.target.value})} className={inputClass} placeholder="450"/>
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Duration</label>
                           <input required type="text" value={pkgForm.duration} onChange={e => setPkgForm({...pkgForm, duration: e.target.value})} className={inputClass} placeholder="5 Days / 4 Nights"/>
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                           <select value={pkgForm.category} onChange={e => setPkgForm({...pkgForm, category: e.target.value})} className={inputClass}>
                              {categories.filter(c => c !== 'All').map(c => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                           </select>
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Group Size</label>
                           <input type="text" value={pkgForm.groupSize} onChange={e => setPkgForm({...pkgForm, groupSize: e.target.value})} className={inputClass} placeholder="Couple / Family"/>
                        </div>
                        <div className="col-span-2">
                           <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Image URL</label>
                           <input required type="text" value={pkgForm.image} onChange={e => setPkgForm({...pkgForm, image: e.target.value})} className={inputClass} placeholder="https://..."/>
                        </div>
                     </div>
                  )}

                  {modalTab === 'details' && (
                     <div className="space-y-4">
                        <div>
                           <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Short Description</label>
                           <input type="text" value={pkgForm.shortDesc} onChange={e => setPkgForm({...pkgForm, shortDesc: e.target.value})} className={inputClass} placeholder="One liner..."/>
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Long Description</label>
                           <textarea rows={4} value={pkgForm.longDesc} onChange={e => setPkgForm({...pkgForm, longDesc: e.target.value})} className={inputClass + " resize-none"}></textarea>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Best Time</label>
                              <input type="text" value={pkgForm.bestTime} onChange={e => setPkgForm({...pkgForm, bestTime: e.target.value})} className={inputClass}/>
                           </div>
                           <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ideal For (Comma Separated)</label>
                              <input type="text" value={pkgForm.idealFor} onChange={e => setPkgForm({...pkgForm, idealFor: e.target.value})} className={inputClass} placeholder="Family, History, Art"/>
                           </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Inclusions (One per line)</label>
                              <textarea rows={6} value={pkgForm.inclusions} onChange={e => setPkgForm({...pkgForm, inclusions: e.target.value})} className={inputClass + " resize-none"}></textarea>
                           </div>
                           <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Exclusions (One per line)</label>
                              <textarea rows={6} value={pkgForm.exclusions} onChange={e => setPkgForm({...pkgForm, exclusions: e.target.value})} className={inputClass + " resize-none"}></textarea>
                           </div>
                        </div>
                     </div>
                  )}

                  {/* DYNAMIC ITINERARY BUILDER */}
                  {modalTab === 'itinerary' && (
                     <div>
                        <div className="flex justify-between items-center mb-4">
                           <h3 className="font-bold text-lg text-gray-800">Daily Schedule</h3>
                           <div className="flex gap-2">
                                <button type="button" onClick={() => handleGranularAI('itinerary')} disabled={isGenerating} className="text-sm bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg font-bold hover:bg-purple-100 flex items-center gap-1 transition-colors">
                                    {isGenerating ? <Loader2 className="animate-spin" size={14}/> : <Sparkles size={14}/>} AI Itinerary
                                </button>
                                <button type="button" onClick={addItineraryDay} className="text-sm bg-blue-50 text-brand-blue px-3 py-1.5 rounded-lg font-bold hover:bg-blue-100 flex items-center gap-1 transition-colors">
                                    <Plus size={16}/> Add Day
                                </button>
                           </div>
                        </div>
                        <div className="space-y-4">
                           {pkgForm.itinerary.map((day, idx) => (
                              <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                                 <div 
                                    className="p-4 bg-white border-b border-gray-100 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                                    onClick={() => setActiveDayIndex(activeDayIndex === idx ? null : idx)}
                                 >
                                    <div className="flex items-center gap-3">
                                       <span className="bg-brand-blue text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                                          {day.day}
                                       </span>
                                       <input 
                                          type="text" 
                                          value={day.title}
                                          onClick={(e) => e.stopPropagation()}
                                          onChange={(e) => updateItineraryDay(idx, 'title', e.target.value)}
                                          className="font-bold text-gray-900 bg-white border border-gray-300 rounded-md px-3 py-1 outline-none focus:ring-1 focus:ring-brand-blue w-64"
                                          placeholder="Day Title"
                                       />
                                    </div>
                                    <div className="flex items-center gap-2">
                                       <button type="button" onClick={(e) => { e.stopPropagation(); removeItineraryDay(idx); }} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full"><Trash2 size={16}/></button>
                                       {activeDayIndex === idx ? <ChevronUp size={20} className="text-gray-400"/> : <ChevronDown size={20} className="text-gray-400"/>}
                                    </div>
                                 </div>
                                 
                                 {/* Expanded Content */}
                                 {activeDayIndex === idx && (
                                    <div className="p-4 space-y-4 bg-white animate-fade-in">
                                       <div>
                                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Activities (One per line)</label>
                                          <textarea 
                                             rows={3} 
                                             value={day.activities.join('\n')} 
                                             onChange={(e) => updateItineraryDay(idx, 'activities', e.target.value.split('\n'))}
                                             className={inputClass + " text-sm"}
                                          ></textarea>
                                       </div>
                                       <div>
                                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Meals (Comma Separated)</label>
                                          <input 
                                             type="text" 
                                             value={day.meals.join(', ')} 
                                             onChange={(e) => updateItineraryDay(idx, 'meals', e.target.value.split(',').map((s: string) => s.trim()))}
                                             className={inputClass + " text-sm"}
                                             placeholder="Breakfast, Lunch, Dinner"
                                          />
                                       </div>
                                    </div>
                                 )}
                              </div>
                           ))}
                           {pkgForm.itinerary.length === 0 && <div className="text-center p-8 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">No itinerary days added. Use AI or Add Day manually.</div>}
                        </div>
                     </div>
                  )}

                  {/* DYNAMIC GEMS & FOOD */}
                  {modalTab === 'guide' && (
                     <div className="space-y-8">
                        {/* Hidden Gems Section */}
                        <div>
                           <div className="flex justify-between items-center mb-4">
                              <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2"><Camera size={18}/> Hidden Gems</h3>
                              <div className="flex gap-2">
                                    <button type="button" onClick={() => handleGranularAI('gems')} disabled={isGenerating} className="text-sm bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg font-bold hover:bg-purple-100 flex items-center gap-1 transition-colors">
                                        <Sparkles size={14}/> AI Gems
                                    </button>
                                    <button type="button" onClick={addGem} className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-100 flex items-center gap-1 transition-colors">
                                        <Plus size={16}/> Add Gem
                                    </button>
                              </div>
                           </div>
                           <div className="grid md:grid-cols-2 gap-4">
                              {pkgForm.hiddenGems.map((gem, idx) => (
                                 <div key={idx} className="border border-gray-200 rounded-xl p-4 bg-gray-50 relative group">
                                    <button type="button" onClick={() => removeGem(idx)} className="absolute top-2 right-2 p-1.5 bg-white text-red-400 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-600"><Trash2 size={14}/></button>
                                    <input 
                                       type="text" 
                                       placeholder="Gem Title" 
                                       className="w-full font-bold bg-white text-gray-900 border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-brand-blue outline-none mb-2"
                                       value={gem.title}
                                       onChange={(e) => updateGem(idx, 'title', e.target.value)}
                                    />
                                    <textarea 
                                       placeholder="Why it's special..." 
                                       rows={2}
                                       className="w-full text-sm bg-white text-gray-900 border border-gray-300 rounded p-2 mb-2 resize-none outline-none focus:ring-1 focus:ring-brand-blue"
                                       value={gem.description}
                                       onChange={(e) => updateGem(idx, 'description', e.target.value)}
                                    ></textarea>
                                    <input 
                                       type="text" 
                                       placeholder="Image URL" 
                                       className="w-full text-xs text-gray-900 bg-white border border-gray-300 rounded p-2 outline-none focus:ring-1 focus:ring-brand-blue"
                                       value={gem.image}
                                       onChange={(e) => updateGem(idx, 'image', e.target.value)}
                                    />
                                 </div>
                              ))}
                           </div>
                        </div>

                        {/* Food Guide Section */}
                        <div>
                           <div className="flex justify-between items-center mb-4">
                              <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2"><Utensils size={18}/> Food Guide</h3>
                              <div className="flex gap-2">
                                <button type="button" onClick={() => handleGranularAI('food')} disabled={isGenerating} className="text-sm bg-orange-50 text-orange-600 px-3 py-1.5 rounded-lg font-bold hover:bg-orange-100 flex items-center gap-1 transition-colors">
                                    <Sparkles size={14}/> AI Food
                                </button>
                                <button type="button" onClick={addFood} className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-100 flex items-center gap-1 transition-colors">
                                    <Plus size={16}/> Add Food
                                </button>
                              </div>
                           </div>
                           <div className="grid md:grid-cols-2 gap-4">
                              {pkgForm.foodGuide.map((food, idx) => (
                                 <div key={idx} className="border border-gray-200 rounded-xl p-4 bg-white relative group flex flex-col gap-2">
                                    <button type="button" onClick={() => removeFood(idx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><X size={16}/></button>
                                    <div className="flex gap-2">
                                       <input 
                                          type="text" 
                                          placeholder="Dish Name" 
                                          className="flex-grow font-bold border border-gray-300 rounded p-2 text-sm bg-white text-gray-900 outline-none focus:ring-1 focus:ring-brand-blue"
                                          value={food.name}
                                          onChange={(e) => updateFood(idx, 'name', e.target.value)}
                                       />
                                       <select 
                                          value={food.type} 
                                          onChange={(e) => updateFood(idx, 'type', e.target.value)}
                                          className="border border-gray-300 rounded p-2 text-sm bg-white text-gray-900 outline-none"
                                       >
                                          <option>Veg</option><option>Non-Veg</option>
                                       </select>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                       <input 
                                          type="number" 
                                          placeholder="Cost" 
                                          className="w-20 border border-gray-300 rounded p-2 text-sm bg-white text-gray-900 outline-none focus:ring-1 focus:ring-brand-blue"
                                          value={food.cost}
                                          onChange={(e) => updateFood(idx, 'cost', parseInt(e.target.value))}
                                       />
                                       <label className="flex items-center gap-1 text-sm text-gray-600 cursor-pointer select-none">
                                          <input 
                                             type="checkbox" 
                                             checked={food.mustTry} 
                                             onChange={(e) => updateFood(idx, 'mustTry', e.target.checked)}
                                             className="accent-brand-orange"
                                          /> Must Try
                                       </label>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  )}

                  {/* DYNAMIC SMART TRAVEL */}
                  {modalTab === 'smart' && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                        {/* Granular AI Button for Smart Travel */}
                        <div className="absolute -top-12 right-0">
                            <button type="button" onClick={() => handleGranularAI('smart')} disabled={isGenerating} className="text-sm bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg font-bold hover:bg-purple-100 flex items-center gap-1 transition-colors">
                                {isGenerating ? <Loader2 className="animate-spin" size={14}/> : <Sparkles size={14}/>} Auto-Fill Smart Info
                            </button>
                        </div>

                        {/* Packing & Safety */}
                        <div className="space-y-6">
                           <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                              <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2"><Briefcase size={16}/> Packing List Categories</h4>
                              <textarea 
                                 className={inputClass + " h-32 font-mono"}
                                 placeholder={`Clothing: Shirt, Pants\nElectronics: Charger, Powerbank`}
                                 value={pkgForm.packingList.map(p => `${p.category}: ${p.items.join(', ')}`).join('\n')}
                                 onChange={(e) => {
                                    const lines = e.target.value.split('\n');
                                    const newList = lines.map(line => {
                                       const [cat, items] = line.split(':');
                                       return { category: cat?.trim() || 'General', items: items ? items.split(',').map(i => i.trim()) : [] };
                                    }).filter(i => i.items.length > 0);
                                    setPkgForm(p => ({...p, packingList: newList}));
                                 }}
                              ></textarea>
                              <p className="text-xs text-gray-400 mt-1">Format: "Category: Item1, Item2"</p>
                           </div>

                           <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                              <h4 className="font-bold text-gray-700 mb-3">Safety Tips</h4>
                              <textarea 
                                 className={inputClass + " h-32"}
                                 placeholder={`Scams: Avoid unauthorized guides\nHealth: Drink bottled water`}
                                 value={pkgForm.safetyTips.map(t => `${t.title}: ${t.description}`).join('\n')}
                                 onChange={(e) => {
                                    const lines = e.target.value.split('\n');
                                    const newTips = lines.map(line => {
                                       const [title, desc] = line.split(':');
                                       return { title: title?.trim() || 'Tip', description: desc?.trim() || '' };
                                    }).filter(t => t.description);
                                    setPkgForm(p => ({...p, safetyTips: newTips}));
                                 }}
                              ></textarea>
                              <p className="text-xs text-gray-400 mt-1">Format: "Title: Description"</p>
                           </div>
                        </div>

                        {/* Visa & Airport */}
                        <div className="space-y-6">
                           <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                              <h4 className="font-bold text-gray-700 mb-3">Visa Information</h4>
                              <div className="space-y-3">
                                 <input type="text" placeholder="Requirements" value={pkgForm.visaInfo.requirements} onChange={e => setPkgForm(p => ({...p, visaInfo: {...p.visaInfo, requirements: e.target.value}}))} className={inputClass + " py-2 text-sm"}/>
                                 <input type="text" placeholder="Processing Time" value={pkgForm.visaInfo.processingTime} onChange={e => setPkgForm(p => ({...p, visaInfo: {...p.visaInfo, processingTime: e.target.value}}))} className={inputClass + " py-2 text-sm"}/>
                                 <input type="text" placeholder="Documents (comma separated)" value={pkgForm.visaInfo.documents.join(', ')} onChange={e => setPkgForm(p => ({...p, visaInfo: {...p.visaInfo, documents: e.target.value.split(',')}}))} className={inputClass + " py-2 text-sm"}/>
                              </div>
                           </div>

                           <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                              <h4 className="font-bold text-gray-700 mb-3">Airport Info</h4>
                              <div className="space-y-3">
                                 <input type="text" placeholder="Best Lounge Name" value={pkgForm.airportInfo.bestLounge} onChange={e => setPkgForm(p => ({...p, airportInfo: {...p.airportInfo, bestLounge: e.target.value}}))} className={inputClass + " py-2 text-sm"}/>
                                 <div className="flex gap-2">
                                    <input type="number" placeholder="Price" value={pkgForm.airportInfo.price} onChange={e => setPkgForm(p => ({...p, airportInfo: {...p.airportInfo, price: parseInt(e.target.value)}}))} className="w-1/3 p-2 bg-white text-gray-900 border border-gray-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-brand-blue"/>
                                    <input type="text" placeholder="Access Tips" value={pkgForm.airportInfo.tips} onChange={e => setPkgForm(p => ({...p, airportInfo: {...p.airportInfo, tips: e.target.value}}))} className="w-2/3 p-2 bg-white text-gray-900 border border-gray-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-brand-blue"/>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  )}
               </form>
            </div>

            <div className="p-6 border-t border-gray-100 bg-white flex-shrink-0">
               <button form="pkgForm" type="submit" className="w-full bg-brand-blue text-white font-bold py-3 rounded-xl hover:bg-sky-600 transition-colors shadow-lg flex items-center justify-center gap-2">
                  <Save size={20}/> Save Package
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPackages;
