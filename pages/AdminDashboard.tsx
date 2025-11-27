import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Package as PkgIcon, DollarSign, Calendar, Plus, Lock, LogOut, MapPin, Search, Trash2, CheckCircle, Sparkles, Loader2, Image as ImageIcon, Edit, Save, FileJson, Layout } from 'lucide-react';
import { useCurrency } from '../CurrencyContext';
import { useGlobal } from '../GlobalContext';
import { formatDate } from '../utils';
import { GoogleGenAI } from "@google/genai";
import { Package } from '../types';

const data = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 2000 },
  { name: 'Thu', revenue: 2780 },
  { name: 'Fri', revenue: 1890 },
  { name: 'Sat', revenue: 6390 },
  { name: 'Sun', revenue: 3490 },
];

const AdminDashboard: React.FC = () => {
  const { formatPrice, currency } = useCurrency();
  const { packages, addPackage, updatePackage, bookings, drivers, deleteDriver, updateDriverStatus, updateBookingStatus } = useGlobal();
  
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // UI State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'packages' | 'enquiries' | 'drivers'>('dashboard');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [modalTab, setModalTab] = useState<'basic' | 'advanced'>('basic');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [newPackage, setNewPackage] = useState({
    name: '',
    destination: '',
    price: '',
    duration: '',
    category: 'Culture',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  });

  const [jsonInput, setJsonInput] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. Try admin / admin');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  const resetForm = () => {
    setNewPackage({ 
        name: '', 
        destination: '', 
        price: '', 
        duration: '', 
        category: 'Culture', 
        image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' 
    });
    setJsonInput('');
    setEditingId(null);
    setModalTab('basic');
  };

  const openNewPackageModal = () => {
     resetForm();
     setIsModalOpen(true);
  };

  const handleEditClick = (pkg: Package) => {
    setNewPackage({
        name: pkg.name,
        destination: pkg.destination,
        price: pkg.price.toString(),
        duration: pkg.duration,
        category: pkg.category,
        image: pkg.images[0] || ''
    });

    // Extract complex data for JSON editor
    const complexData = {
        shortDesc: pkg.shortDesc,
        longDesc: pkg.longDesc,
        idealFor: pkg.idealFor,
        bestTime: pkg.bestTime,
        inclusions: pkg.inclusions,
        exclusions: pkg.exclusions,
        itinerary: pkg.itinerary,
        hiddenGems: pkg.hiddenGems,
        packingList: pkg.packingList,
        foodGuide: pkg.foodGuide,
        safetyTips: pkg.safetyTips,
        visaInfo: pkg.visaInfo,
        airportInfo: pkg.airportInfo
    };

    setJsonInput(JSON.stringify(complexData, null, 2));
    setEditingId(pkg.id);
    setIsModalOpen(true);
  };

  const handleGenerateAI = async () => {
    if (!newPackage.destination || !newPackage.name) {
      alert("Please enter Package Name and Destination first.");
      return;
    }
    setIsGenerating(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Create a detailed JSON object for a travel package.
        Destination: "${newPackage.destination}"
        Title: "${newPackage.name}"
        Duration: "${newPackage.duration}"
        
        The JSON MUST strictly follow this structure and include specific, real details for the destination:
        {
          "shortDesc": "Catchy 1 sentence description",
          "longDesc": " Engaging 2-3 paragraph description",
          "idealFor": ["Type1", "Type2"],
          "bestTime": "e.g. Oct-Mar",
          "inclusions": ["List of 4-5 items"],
          "exclusions": ["List of 3 items"],
          "itinerary": [
            { "day": 1, "title": "Day Title", "activities": ["Activity 1", "Activity 2"], "meals": ["Dinner"] }
            // ... generate for all days
          ],
          "hiddenGems": [
            { "title": "Name of secret spot", "description": "Why it is special", "image": "https://source.unsplash.com/800x600/?${newPackage.destination},landmark" }
            // 2 items
          ],
          "packingList": [
            { "category": "Clothing", "items": ["Item 1", "Item 2"] },
            { "category": "Essentials", "items": ["Item 1", "Item 2"] }
          ],
          "foodGuide": [
            { "name": "Local Dish Name", "type": "Veg/Non-Veg", "cost": 5, "mustTry": true }
            // 2-3 items. Cost in USD.
          ],
          "safetyTips": [
            { "title": "Scam/Tip Title", "description": "Description" }
            // 2 items
          ],
          "visaInfo": { "requirements": "Brief requirement", "processingTime": "e.g. 3 days", "documents": ["Doc 1", "Doc 2"] },
          "airportInfo": { "bestLounge": "Lounge Name", "price": 25, "tips": "Tip for entry" }
        }

        Return ONLY raw JSON. No markdown formatting.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      let jsonStr = response.text;
      // Cleanup json string if it has markdown code blocks
      jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
      
      // Validate JSON
      JSON.parse(jsonStr); 
      setJsonInput(jsonStr);
      setModalTab('advanced'); // Switch to advanced tab to show result
    } catch (error) {
      console.error("AI Generation failed", error);
      alert("AI Generation failed. Please try again or fill manually.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();
    
    let complexData = {};
    
    // Parse JSON Input
    try {
        if (jsonInput) {
            complexData = JSON.parse(jsonInput);
        } else {
             // Fallback default structure
            complexData = {
                shortDesc: 'Experience ' + newPackage.destination,
                longDesc: `Journey to ${newPackage.destination}.`,
                idealFor: ['Family'],
                bestTime: 'Anytime',
                inclusions: [],
                exclusions: [],
                itinerary: [],
                hiddenGems: [],
                packingList: [],
                foodGuide: [],
                safetyTips: [],
                visaInfo: { requirements: '', processingTime: '', documents: [] },
                airportInfo: { bestLounge: '', price: 0, tips: '' }
            };
        }
    } catch (err) {
        alert("Invalid JSON in Advanced Details. Please fix syntax errors.");
        return;
    }

    const pkg: Package = {
      id: editingId || `p${Date.now()}`,
      name: newPackage.name,
      destination: newPackage.destination,
      price: Number(newPackage.price),
      duration: newPackage.duration,
      category: newPackage.category as any,
      groupSize: 'Variable',
      rating: editingId ? packages.find(p => p.id === editingId)?.rating || 0 : 0,
      reviewsCount: editingId ? packages.find(p => p.id === editingId)?.reviewsCount || 0 : 0,
      slug: newPackage.name.toLowerCase().replace(/\s+/g, '-'),
      images: [newPackage.image],
      ...complexData as any
    };
    
    if (editingId) {
        updatePackage(pkg);
    } else {
        addPackage(pkg);
    }

    setIsModalOpen(false);
    resetForm();
    setActiveTab('packages');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-brand-blue text-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Lock size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
            <p className="text-gray-500">Please sign in to continue</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none text-gray-900"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none text-gray-900"
                placeholder="Enter password"
              />
            </div>
            
            {loginError && <p className="text-red-500 text-sm text-center">{loginError}</p>}
            
            <button type="submit" className="w-full bg-brand-blue text-white font-bold py-3 rounded-xl hover:bg-sky-600 transition-colors shadow-lg">
              Login
            </button>
            <p className="text-xs text-center text-gray-400 mt-4">Hint: admin / admin</p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
       <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
             <div>
               <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
               <p className="text-gray-500 text-sm">Welcome back, Admin</p>
             </div>
             <div className="flex flex-wrap gap-2 md:gap-3 bg-white p-1.5 rounded-xl shadow-sm border border-gray-200">
               {[
                 { id: 'dashboard', label: 'Overview' },
                 { id: 'packages', label: 'Packages' },
                 { id: 'enquiries', label: 'Bookings' },
                 { id: 'drivers', label: 'Drivers' }
               ].map(tab => (
                 <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-brand-blue text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {tab.label}
                 </button>
               ))}
               <button 
                onClick={handleLogout}
                className="bg-red-50 text-red-500 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-100 flex items-center gap-2 ml-2 border-l border-gray-200"
               >
                  <LogOut size={16}/>
               </button>
             </div>
          </div>

          {activeTab === 'dashboard' && (
            <div className="animate-fade-in">
              {/* KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-blue-100 text-brand-blue rounded-lg"><DollarSign size={20}/></div>
                      <span className="text-green-500 text-xs font-bold">+12%</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{formatPrice(bookings.reduce((sum, b) => sum + (b.paid ? b.totalAmount : 0), 0))}</div>
                    <div className="text-xs text-gray-500">Total Revenue</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><Calendar size={20}/></div>
                      <span className="text-gray-400 text-xs">Total</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{bookings.length}</div>
                    <div className="text-xs text-gray-500">Bookings & Enquiries</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-orange-100 text-brand-orange rounded-lg"><Users size={20}/></div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{drivers.length}</div>
                    <div className="text-xs text-gray-500">Registered Drivers</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-green-100 text-brand-green rounded-lg"><PkgIcon size={20}/></div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{packages.length}</div>
                    <div className="text-xs text-gray-500">Active Packages</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-6">Revenue Overview (USD)</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip />
                            <Bar dataKey="revenue" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                          </BarChart>
                      </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Bookings Table */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                    <h3 className="font-bold text-gray-800 mb-6">Recent Activity</h3>
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 text-gray-500">
                          <tr>
                            <th className="p-3 rounded-l-lg">Customer</th>
                            <th className="p-3">Service</th>
                            <th className="p-3">Amount</th>
                            <th className="p-3 rounded-r-lg">Status</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {bookings.slice(0, 5).map(b => (
                          <tr key={b.id}>
                            <td className="p-3 text-gray-900 font-medium">{b.customerName}</td>
                            <td className="p-3 text-gray-500 truncate max-w-[150px]">{b.itemName}</td>
                            <td className="p-3 font-bold text-gray-900">{formatPrice(b.totalAmount)}</td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded text-xs font-bold ${b.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'packages' && (
             <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                   <h2 className="text-xl font-bold text-gray-900">Manage Packages</h2>
                   <button 
                    onClick={openNewPackageModal}
                    className="bg-brand-blue text-white px-5 py-2.5 rounded-xl font-bold hover:bg-sky-600 transition-colors shadow-lg flex items-center gap-2"
                   >
                      <Plus size={20}/> New Package
                   </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                   <table className="w-full text-left">
                      <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                         <tr>
                            <th className="p-4">Package Name</th>
                            <th className="p-4">Destination</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Action</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                         {packages.map((pkg) => (
                            <tr key={pkg.id} className="hover:bg-gray-50">
                               <td className="p-4">
                                  <div className="font-bold text-gray-900">{pkg.name}</div>
                                  <div className="text-xs text-gray-400">{pkg.duration}</div>
                               </td>
                               <td className="p-4 flex items-center gap-2 text-gray-700">
                                  <MapPin size={14} className="text-brand-orange"/> {pkg.destination}
                               </td>
                               <td className="p-4 font-bold text-brand-blue">{formatPrice(pkg.price)}</td>
                               <td className="p-4">
                                  <span className="bg-blue-50 text-brand-blue px-2 py-1 rounded text-xs font-bold border border-blue-100">
                                     {pkg.category}
                                  </span>
                               </td>
                               <td className="p-4">
                                  <button onClick={() => handleEditClick(pkg)} className="text-gray-400 hover:text-brand-blue font-medium text-sm flex items-center gap-1">
                                    <Edit size={14}/> Edit
                                  </button>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                   {packages.length === 0 && (
                      <div className="p-8 text-center text-gray-500">No packages found.</div>
                   )}
                </div>
             </div>
          )}

          {activeTab === 'enquiries' && (
             <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                   <h2 className="text-xl font-bold text-gray-900">Bookings & Enquiries</h2>
                   <div className="flex gap-2">
                      <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full flex items-center">Confirmed: {bookings.filter(b => b.status === 'Confirmed').length}</span>
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full flex items-center">Pending: {bookings.filter(b => b.status === 'Pending').length}</span>
                   </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                   <table className="w-full text-left whitespace-nowrap">
                      <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                         <tr>
                            <th className="p-4">Ref ID</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Item Details</th>
                            <th className="p-4">Total</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Action</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                         {bookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-gray-50">
                               <td className="p-4 font-mono text-xs text-gray-500">{booking.id}</td>
                               <td className="p-4 text-sm text-gray-700">{formatDate(booking.date)}</td>
                               <td className="p-4">
                                  <div className="font-bold text-gray-900 text-sm">{booking.customerName}</div>
                                  <div className="text-xs text-gray-500">{booking.customerPhone}</div>
                                  <div className="text-xs text-gray-400">{booking.customerEmail}</div>
                               </td>
                               <td className="p-4">
                                  <div className="text-sm font-medium text-gray-900 max-w-[200px] truncate" title={booking.itemName}>{booking.itemName}</div>
                                  <div className="text-xs text-gray-500 uppercase">{booking.type} • {booking.travelers} Pax</div>
                               </td>
                               <td className="p-4 font-bold text-brand-blue text-sm">{formatPrice(booking.totalAmount)}</td>
                               <td className="p-4">
                                  <span className={`px-2 py-1 rounded text-xs font-bold ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' : booking.status === 'Pending' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                                     {booking.status}
                                  </span>
                               </td>
                               <td className="p-4 flex gap-2">
                                  {booking.status === 'Pending' && (
                                     <button 
                                      onClick={() => updateBookingStatus(booking.id, 'Confirmed')}
                                      className="bg-green-500 text-white p-1.5 rounded hover:bg-green-600 transition-colors" title="Confirm">
                                        <CheckCircle size={16}/>
                                     </button>
                                  )}
                                  <button className="bg-gray-100 text-gray-500 p-1.5 rounded hover:bg-gray-200 transition-colors" title="View Details">
                                     <Search size={16}/>
                                  </button>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                   {bookings.length === 0 && (
                      <div className="p-8 text-center text-gray-500">No bookings yet.</div>
                   )}
                </div>
             </div>
          )}

          {activeTab === 'drivers' && (
             <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                   <h2 className="text-xl font-bold text-gray-900">Manage Drivers</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {drivers.map(driver => (
                      <div key={driver.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative group">
                         <div className="h-24 bg-brand-dark relative">
                            <div className="absolute top-2 right-2">
                               <span className={`px-2 py-1 rounded text-xs font-bold ${driver.status === 'Available' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                                  {driver.status}
                               </span>
                            </div>
                         </div>
                         <div className="px-6 pb-6 mt-[-40px]">
                            <img src={driver.photo} alt={driver.name} className="w-20 h-20 rounded-xl border-4 border-white shadow-md object-cover bg-gray-200" />
                            <div className="mt-3">
                               <h3 className="font-bold text-lg text-gray-900">{driver.name}</h3>
                               <p className="text-sm text-gray-500">{driver.vehicle.model} ({driver.vehicle.plateNumber})</p>
                               <div className="flex items-center gap-1 text-xs text-yellow-500 mt-1 font-bold">
                                  ⭐ {driver.rating} • {driver.totalRides} Rides
                               </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                               {driver.status === 'Busy' ? (
                                  <button onClick={() => updateDriverStatus(driver.id, 'Available')} className="flex-1 bg-green-50 text-green-700 py-2 rounded-lg text-xs font-bold hover:bg-green-100">Make Available</button>
                               ) : (
                                  <button onClick={() => updateDriverStatus(driver.id, 'Busy')} className="flex-1 bg-orange-50 text-orange-700 py-2 rounded-lg text-xs font-bold hover:bg-orange-100">Mark Busy</button>
                               )}
                               <button onClick={() => deleteDriver(driver.id)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100">
                                  <Trash2 size={16}/>
                               </button>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
                 {drivers.length === 0 && (
                      <div className="p-12 text-center bg-white rounded-xl border border-gray-100 text-gray-500">
                        No drivers registered yet.
                      </div>
                   )}
             </div>
          )}

          {/* New/Edit Package Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
               <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 animate-fade-in max-h-[90vh] overflow-y-auto flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="text-xl font-bold text-gray-900">{editingId ? 'Edit Package' : 'Add New Package'}</h3>
                     <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                        <Plus size={24} className="rotate-45"/>
                     </button>
                  </div>
                  
                  {/* Modal Tabs */}
                  <div className="flex gap-2 mb-6 border-b border-gray-100">
                     <button 
                        onClick={() => setModalTab('basic')}
                        className={`pb-2 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${modalTab === 'basic' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                     >
                        <Layout size={16}/> Basic Info
                     </button>
                     <button 
                        onClick={() => setModalTab('advanced')}
                        className={`pb-2 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${modalTab === 'advanced' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                     >
                        <FileJson size={16}/> Advanced Details (JSON)
                     </button>
                  </div>
                  
                  <form onSubmit={handleSavePackage} className="space-y-4">
                     
                     {modalTab === 'basic' && (
                        <div className="space-y-4 animate-fade-in">
                           <div>
                              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Package Name</label>
                              <input 
                                 required
                                 type="text" 
                                 className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue text-gray-900" 
                                 placeholder="e.g. Kashmir Winter Special"
                                 value={newPackage.name}
                                 onChange={e => setNewPackage({...newPackage, name: e.target.value})}
                              />
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <div>
                                 <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Destination</label>
                                 <input 
                                    required
                                    type="text" 
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue text-gray-900" 
                                    placeholder="e.g. Kashmir"
                                    value={newPackage.destination}
                                    onChange={e => setNewPackage({...newPackage, destination: e.target.value})}
                                 />
                              </div>
                              <div>
                                 <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Price (USD)</label>
                                 <input 
                                    required
                                    type="number" 
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue text-gray-900" 
                                    placeholder="e.g. 500"
                                    value={newPackage.price}
                                    onChange={e => setNewPackage({...newPackage, price: e.target.value})}
                                 />
                              </div>
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <div>
                                 <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Duration (Days)</label>
                                 <input 
                                    required
                                    type="text" 
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue text-gray-900" 
                                    placeholder="e.g. 5"
                                    value={newPackage.duration}
                                    onChange={e => setNewPackage({...newPackage, duration: e.target.value})}
                                 />
                              </div>
                              <div>
                                 <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category</label>
                                 <select 
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue text-gray-900"
                                    value={newPackage.category}
                                    onChange={e => setNewPackage({...newPackage, category: e.target.value})}
                                 >
                                    <option>Culture</option>
                                    <option>Nature</option>
                                    <option>Adventure</option>
                                    <option>Beach</option>
                                    <option>Luxury</option>
                                 </select>
                              </div>
                           </div>
                           <div>
                              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Cover Image URL</label>
                              <div className="relative">
                                <ImageIcon className="absolute left-3 top-3 text-gray-400" size={18}/>
                                <input 
                                  required
                                  type="text" 
                                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue text-gray-900" 
                                  placeholder="https://..."
                                  value={newPackage.image}
                                  onChange={e => setNewPackage({...newPackage, image: e.target.value})}
                                />
                              </div>
                           </div>

                           {!editingId && (
                              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                 <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-bold text-blue-800 text-sm flex items-center gap-2"><Sparkles size={16}/> AI Auto-Fill</h4>
                                 </div>
                                 <p className="text-xs text-blue-600 mb-3">
                                    Automatically generate Itinerary, Hidden Gems, Food Guide, and Smart Travel details.
                                 </p>
                                 <button 
                                    type="button"
                                    onClick={handleGenerateAI}
                                    disabled={isGenerating || !newPackage.destination}
                                    className="w-full bg-white text-blue-600 border border-blue-200 font-bold py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                 >
                                    {isGenerating ? <><Loader2 className="animate-spin" size={16}/> Generating Details...</> : <><Sparkles size={16}/> Auto-Fill with AI</>}
                                 </button>
                              </div>
                           )}
                        </div>
                     )}

                     {modalTab === 'advanced' && (
                        <div className="animate-fade-in h-[400px] flex flex-col">
                           <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 mb-2">
                              <p className="text-xs text-yellow-700 flex items-center gap-2">
                                 <Sparkles size={12}/> Edit Itinerary, Hidden Gems, Packing List, and more here. Valid JSON required.
                              </p>
                           </div>
                           <textarea
                              className="w-full flex-grow p-4 bg-gray-900 text-green-400 font-mono text-xs rounded-xl border border-gray-700 focus:ring-2 focus:ring-brand-blue outline-none resize-none"
                              value={jsonInput}
                              onChange={e => setJsonInput(e.target.value)}
                              placeholder="{ ... }"
                           ></textarea>
                        </div>
                     )}
                     
                     <div className="pt-4 flex gap-3 border-t border-gray-100 mt-4">
                        <button 
                           type="button" 
                           onClick={() => setIsModalOpen(false)}
                           className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors"
                        >
                           Cancel
                        </button>
                        <button 
                           type="submit" 
                           className="flex-1 bg-brand-blue text-white font-bold py-3 rounded-xl hover:bg-sky-600 transition-colors shadow-lg flex items-center justify-center gap-2"
                        >
                           <Save size={18}/> {editingId ? 'Update Package' : 'Create Package'}
                        </button>
                     </div>
                  </form>
               </div>
            </div>
          )}

       </div>
    </div>
  );
};

export default AdminDashboard;
