
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area, ComposedChart } from 'recharts';
import { Users, Package as PkgIcon, DollarSign, Calendar, Plus, Lock, LogOut, MapPin, Search, Trash2, CheckCircle, Sparkles, Loader2, Image as ImageIcon, Edit, Save, FileJson, Layout, Building2, Globe, Settings, Activity, Compass, Utensils, Briefcase, Database, Filter, Eye, TrendingUp, TrendingDown, MousePointer, Smartphone, Zap, AlertTriangle, Clock, Download, Key, Facebook, Twitter, Instagram, FileText, Server, AlertOctagon } from 'lucide-react';
import { useCurrency } from '../CurrencyContext';
import { useGlobal } from '../GlobalContext';
import { formatDate, generateAIContent } from '../utils';
import { Package, Booking, AiSettings, PageSettings } from '../types';

const AdminDashboard: React.FC = () => {
  const { formatPrice, currency } = useCurrency();
  const { 
    packages, addPackage, updatePackage, bookings, drivers, 
    deleteDriver, updateDriverStatus, updateBookingStatus,
    companyProfile, updateCompanyProfile, seoSettings, updateSeoSettings,
    deletePackage, aiSettings, updateAiSettings, pageSettings, updatePageSettings
  } = useGlobal();
  
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Password Change State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');

  // UI State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics' | 'packages' | 'enquiries' | 'drivers' | 'profile' | 'settings'>('dashboard');
  const [settingsSubTab, setSettingsSubTab] = useState<'ai' | 'seo' | 'pages' | 'db'>('ai');
  
  // Analytics State
  const [dateRange, setDateRange] = useState('30d');
  
  // Chart State
  const [chartData, setChartData] = useState<{name: string, revenue: number}[]>([]);
  
  // Enquiry Filter State
  const [enquiryFilter, setEnquiryFilter] = useState<{type: string, status: string}>({type: 'All', status: 'All'});
  const [selectedEnquiry, setSelectedEnquiry] = useState<Booking | null>(null); // For detail view

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [modalTab, setModalTab] = useState<'basic' | 'itinerary' | 'guide' | 'smart'>('basic');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [originalPackage, setOriginalPackage] = useState<Package | null>(null);

  // Form State - Basic Info
  const [newPackage, setNewPackage] = useState({
    name: '',
    destination: '',
    price: '',
    duration: '',
    category: 'Culture',
    groupSize: 'Couples / Family',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  });

  // Form State - Complex Sections (JSON Strings)
  const [itineraryJson, setItineraryJson] = useState('{}');
  const [guideJson, setGuideJson] = useState('{}');
  const [smartJson, setSmartJson] = useState('{}');

  // Profile & SEO Form States
  const [profileForm, setProfileForm] = useState(companyProfile);
  const [seoForm, setSeoForm] = useState(seoSettings);
  const [aiForm, setAiForm] = useState<AiSettings>(aiSettings);
  const [pageForm, setPageForm] = useState<PageSettings>(pageSettings);

  // Database Config State
  const [dbConfig, setDbConfig] = useState({
    projectName: '',
    url: '',
    key: ''
  });

  // Persistent Login Check & Load DB Config
  useEffect(() => {
    const storedAuth = localStorage.getItem('holidayPotAdminAuth');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
    // Initialize forms with context data
    setProfileForm(companyProfile);
    setSeoForm(seoSettings);
    setAiForm(aiSettings);
    setPageForm(pageSettings);

    // Load stored DB config
    const storedName = localStorage.getItem('holidaypot_supabase_project_name') || '';
    const storedUrl = localStorage.getItem('holidaypot_supabase_url') || '';
    const storedKey = localStorage.getItem('holidaypot_supabase_key') || '';
    setDbConfig({ projectName: storedName, url: storedUrl, key: storedKey });

  }, [companyProfile, seoSettings, aiSettings, pageSettings]);

  // Update chart data when bookings change
  useEffect(() => {
    if (bookings.length === 0) {
        setChartData([
           { name: 'Mon', revenue: 0 },
           { name: 'Tue', revenue: 0 },
           { name: 'Wed', revenue: 0 },
           { name: 'Thu', revenue: 0 },
           { name: 'Fri', revenue: 0 },
           { name: 'Sat', revenue: 0 },
           { name: 'Sun', revenue: 0 },
        ]);
        return;
    }

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const revenueByDay = { 0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0 };
    
    bookings.forEach(b => {
        // Count confirmed or paid bookings for revenue
        if(b.status === 'Confirmed' || b.paid) {
            const d = new Date(b.date);
            if(!isNaN(d.getTime())) {
                revenueByDay[d.getDay() as keyof typeof revenueByDay] += b.totalAmount;
            }
        }
    });

    const sortedDays = [1, 2, 3, 4, 5, 6, 0]; // Mon to Sun indices
    const processedData = sortedDays.map(dayIndex => ({
       name: days[dayIndex],
       revenue: revenueByDay[dayIndex as keyof typeof revenueByDay]
    }));

    setChartData(processedData);
  }, [bookings]);

  // Mock Data for Analytics Charts
  const trafficTrendData = [
    { name: 'Mon', sessions: 4000, prev: 2400 },
    { name: 'Tue', sessions: 3000, prev: 1398 },
    { name: 'Wed', sessions: 2000, prev: 9800 },
    { name: 'Thu', sessions: 2780, prev: 3908 },
    { name: 'Fri', sessions: 1890, prev: 4800 },
    { name: 'Sat', sessions: 2390, prev: 3800 },
    { name: 'Sun', sessions: 3490, prev: 4300 },
  ];

  const acquisitionData = [
    { name: 'Organic Search', percent: 65, sessions: '8,450', conversion: 3.2 },
    { name: 'Direct', percent: 20, sessions: '2,100', conversion: 4.5 },
    { name: 'Social Media', percent: 10, sessions: '1,250', conversion: 1.8 },
    { name: 'Referral', percent: 5, sessions: '650', conversion: 2.1 },
  ];

  const funnelData = [
    { name: 'Sessions', value: 12450, fill: '#0EA5E9' },
    { name: 'View Item', value: 8320, fill: '#38BDF8' },
    { name: 'Add to Cart', value: 3450, fill: '#7DD3FC' },
    { name: 'Checkout', value: 1200, fill: '#BAE6FD' },
    { name: 'Purchase', value: 350, fill: '#F0F9FF' },
  ];

  const topPagesData = [
    { title: 'Home Page', url: '/', views: '5,240', time: '1m 20s', bounce: '45%' },
    { title: 'Kerala Packages', url: '/package/kerala-gods-own-country', views: '2,100', time: '3m 15s', bounce: '32%' },
    { title: 'Goa Party Trip', url: '/package/goa-beach-party', views: '1,850', time: '2m 45s', bounce: '55%' },
    { title: 'Rajasthan Royal', url: '/package/rajasthan-royal-tour', views: '1,200', time: '4m 10s', bounce: '28%' },
    { title: 'Taxi Booking', url: '/taxi', views: '950', time: '1m 05s', bounce: '60%' },
  ];

  const deviceData = [
    { name: 'Mobile', value: 65, color: '#0EA5E9' },
    { name: 'Desktop', value: 30, color: '#10B981' },
    { name: 'Tablet', value: 5, color: '#F59E0B' },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPwd = localStorage.getItem('holidayPot_admin_pwd') || 'admin';
    
    if (username === 'admin' && password === storedPwd) {
      setIsAuthenticated(true);
      localStorage.setItem('holidayPotAdminAuth', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. Default is admin / admin');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('holidayPotAdminAuth');
    setUsername('');
    setPassword('');
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompanyProfile(profileForm);
    alert('Company Profile Updated!');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPwd = localStorage.getItem('holidayPot_admin_pwd') || 'admin';
    
    if (currentPasswordInput !== storedPwd) {
        alert("Current password is incorrect.");
        return;
    }
    if (newPassword !== confirmPassword) {
        alert("New passwords do not match.");
        return;
    }
    if (newPassword.length < 4) {
        alert("Password must be at least 4 characters.");
        return;
    }

    localStorage.setItem('holidayPot_admin_pwd', newPassword);
    alert("Password updated successfully. Please login again.");
    handleLogout();
  };

  const handleDbSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('holidaypot_supabase_project_name', dbConfig.projectName);
    localStorage.setItem('holidaypot_supabase_url', dbConfig.url);
    localStorage.setItem('holidaypot_supabase_key', dbConfig.key);
    if(window.confirm(`Database configuration for "${dbConfig.projectName}" saved. The page must reload to apply changes. Reload now?`)) {
        window.location.reload();
    }
  };

  const handleSeoSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSeoSettings(seoForm);
    alert('SEO Settings Updated!');
  };

  const handleAiSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateAiSettings(aiForm);
    alert('AI Engine Settings Saved. Fallback keys will be used if Primary fails.');
  };

  const handlePageSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePageSettings(pageForm);
    alert('Page Configurations Updated!');
  };

  const handleDeletePackage = (e: React.MouseEvent, id: string, name: string) => {
     e.preventDefault();
     e.stopPropagation();
     if(window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
         deletePackage(id);
     }
  };

  const exportToCSV = () => {
    if(bookings.length === 0) {
        alert("No bookings to export.");
        return;
    }
    
    // Define headers
    const headers = ["Ref ID", "Date", "Customer Name", "Phone", "Email", "Type", "Item Name", "Status", "Travelers", "Total Amount"];
    
    // Convert bookings to CSV rows
    const csvRows = bookings.map(b => [
        b.id,
        new Date(b.date).toLocaleDateString(),
        `"${b.customerName}"`, // Quote strings to handle commas
        b.customerPhone,
        b.customerEmail,
        b.type,
        `"${b.itemName}"`,
        b.status,
        b.travelers,
        b.totalAmount
    ]);

    // Combine headers and rows
    const csvContent = [
        headers.join(','),
        ...csvRows.map(row => row.join(','))
    ].join('\n');

    // Create a Blob and download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `enquiries_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const resetForm = () => {
    setNewPackage({ 
        name: '', 
        destination: '', 
        price: '', 
        duration: '', 
        category: 'Culture', 
        groupSize: 'Couples / Family',
        image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' 
    });
    setItineraryJson('{}');
    setGuideJson('{}');
    setSmartJson('{}');
    setEditingId(null);
    setOriginalPackage(null);
    setModalTab('basic');
  };

  const openNewPackageModal = () => {
     resetForm();
     setItineraryJson(JSON.stringify({
        shortDesc: "Short description...",
        longDesc: "Detailed description...",
        bestTime: "Oct - Mar",
        idealFor: ["Family"],
        inclusions: ["Hotel"],
        exclusions: ["Flights"],
        itinerary: []
     }, null, 2));
     setGuideJson(JSON.stringify({
        hiddenGems: [],
        foodGuide: []
     }, null, 2));
     setSmartJson(JSON.stringify({
        packingList: [],
        safetyTips: [],
        visaInfo: { requirements: "", processingTime: "", documents: [] },
        airportInfo: { bestLounge: "", price: 0, tips: "" }
     }, null, 2));
     setIsModalOpen(true);
  };

  const handleEditClick = (pkg: Package) => {
    setOriginalPackage(pkg);
    setNewPackage({
        name: pkg.name,
        destination: pkg.destination,
        price: pkg.price.toString(),
        duration: pkg.duration,
        category: pkg.category,
        groupSize: pkg.groupSize || 'Couples / Family',
        image: pkg.images[0] || ''
    });

    setItineraryJson(JSON.stringify({
        shortDesc: pkg.shortDesc,
        longDesc: pkg.longDesc,
        bestTime: pkg.bestTime,
        idealFor: pkg.idealFor,
        inclusions: pkg.inclusions,
        exclusions: pkg.exclusions,
        itinerary: pkg.itinerary
    }, null, 2));

    setGuideJson(JSON.stringify({
        hiddenGems: pkg.hiddenGems || [],
        foodGuide: pkg.foodGuide || []
    }, null, 2));

    setSmartJson(JSON.stringify({
        packingList: pkg.packingList || [],
        safetyTips: pkg.safetyTips || [],
        visaInfo: pkg.visaInfo,
        airportInfo: pkg.airportInfo
    }, null, 2));

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
      const prompt = `
        Create a detailed JSON object for a travel package.
        Destination: "${newPackage.destination}"
        Title: "${newPackage.name}"
        Duration: "${newPackage.duration}"
        
        The JSON MUST strictly follow this structure:
        {
          "overview": {
             "shortDesc": "Catchy 1 sentence description",
             "longDesc": "Engaging 2-3 paragraph description",
             "idealFor": ["Type1", "Type2"],
             "bestTime": "e.g. Oct-Mar",
             "inclusions": ["List of 4-5 items"],
             "exclusions": ["List of 3 items"],
             "itinerary": [
                { "day": 1, "title": "Day Title", "activities": ["Activity 1", "Activity 2"], "meals": ["Dinner"] }
             ]
          },
          "guide": {
             "hiddenGems": [
                { "title": "Name", "description": "Why it is special", "image": "https://source.unsplash.com/800x600/?${newPackage.destination},landmark" }
             ],
             "foodGuide": [
                { "name": "Dish Name", "type": "Veg/Non-Veg", "cost": 5, "mustTry": true }
             ]
          },
          "smart": {
             "packingList": [
                { "category": "Clothing", "items": ["Item 1"] }
             ],
             "safetyTips": [
                { "title": "Tip Title", "description": "Desc" }
             ],
             "visaInfo": { "requirements": "Req", "processingTime": "Time", "documents": ["Doc"] },
             "airportInfo": { "bestLounge": "Name", "price": 25, "tips": "Tips" }
          }
        }
        Return ONLY raw JSON.
      `;

      // Use Robust Utility
      const jsonStr = await generateAIContent(prompt);
      
      const generated = JSON.parse(jsonStr); 
      
      setItineraryJson(JSON.stringify(generated.overview, null, 2));
      setGuideJson(JSON.stringify(generated.guide, null, 2));
      setSmartJson(JSON.stringify(generated.smart, null, 2));
      
      setModalTab('itinerary');
    } catch (error: any) {
      console.error("AI Generation failed", error);
      alert(`AI Generation failed: ${error.message || 'Unknown Error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();
    
    let parsedOverview, parsedGuide, parsedSmart;
    try {
        parsedOverview = JSON.parse(itineraryJson);
        parsedGuide = JSON.parse(guideJson);
        parsedSmart = JSON.parse(smartJson);
    } catch (err) {
        alert("Invalid JSON in one of the tabs. Please check syntax.");
        return;
    }

    const pkg: Package = {
      id: editingId || `p${Date.now()}`,
      name: newPackage.name,
      destination: newPackage.destination,
      price: Number(newPackage.price),
      duration: newPackage.duration,
      category: newPackage.category as any,
      groupSize: newPackage.groupSize,
      rating: originalPackage ? originalPackage.rating : 5.0,
      reviewsCount: originalPackage ? originalPackage.reviewsCount : 0,
      slug: newPackage.name.toLowerCase().replace(/\s+/g, '-'),
      images: [newPackage.image], 
      created_at: originalPackage?.created_at || new Date().toISOString(),
      
      ...parsedOverview,
      ...parsedGuide,
      ...parsedSmart
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

  const filteredBookings = bookings.filter(b => {
      const matchType = enquiryFilter.type === 'All' || b.type === enquiryFilter.type;
      const matchStatus = enquiryFilter.status === 'All' || b.status === enquiryFilter.status;
      return matchType && matchStatus;
  });

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
             <div className="flex flex-wrap gap-2 md:gap-3 bg-white p-1.5 rounded-xl shadow-sm border border-gray-200 overflow-x-auto max-w-full">
               {[
                 { id: 'dashboard', label: 'Overview' },
                 { id: 'analytics', label: 'Analytics' },
                 { id: 'packages', label: 'Packages' },
                 { id: 'enquiries', label: 'Enquiries' },
                 { id: 'drivers', label: 'Drivers' },
                 { id: 'profile', label: 'Company' },
                 { id: 'settings', label: 'Settings' }
               ].map(tab => (
                 <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-brand-blue text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
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
              {/* KPIs - Clickable */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div onClick={() => setActiveTab('analytics')} className="cursor-pointer bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-blue-100 text-brand-blue rounded-lg"><DollarSign size={20}/></div>
                      <span className="text-green-500 text-xs font-bold">+12%</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{formatPrice(bookings.reduce((sum, b) => sum + (b.paid ? b.totalAmount : 0), 0))}</div>
                    <div className="text-xs text-gray-500">Total Revenue</div>
                </div>
                <div onClick={() => setActiveTab('enquiries')} className="cursor-pointer bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><Calendar size={20}/></div>
                      <span className="text-gray-400 text-xs">Total</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{bookings.length}</div>
                    <div className="text-xs text-gray-500">Bookings & Enquiries</div>
                </div>
                <div onClick={() => setActiveTab('drivers')} className="cursor-pointer bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-orange-100 text-brand-orange rounded-lg"><Users size={20}/></div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{drivers.length}</div>
                    <div className="text-xs text-gray-500">Registered Drivers</div>
                </div>
                <div onClick={() => setActiveTab('packages')} className="cursor-pointer bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
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
                    <h3 className="font-bold text-gray-800 mb-6">Revenue Trend (USD)</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip />
                            <Bar dataKey="revenue" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                          </BarChart>
                      </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                    <h3 className="font-bold text-gray-800 mb-6">Recent Enquiries</h3>
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 text-gray-500">
                          <tr>
                            <th className="p-3 rounded-l-lg">Customer</th>
                            <th className="p-3">Type</th>
                            <th className="p-3 rounded-r-lg">Status</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {bookings.slice(0, 5).map(b => (
                          <tr key={b.id}>
                            <td className="p-3 text-gray-900 font-medium">{b.customerName}</td>
                            <td className="p-3 text-gray-500">{b.type}</td>
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

          {activeTab === 'analytics' && (
              <div className="animate-fade-in space-y-8">
                {/* Header Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Performance Overview</h2>
                    <p className="text-xs text-gray-500">Track user behavior and outcomes</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <select 
                        className="appearance-none bg-gray-50 border border-gray-200 rounded-lg py-2 pl-3 pr-8 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                      >
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                        <option value="90d">Last 3 months</option>
                        <option value="1y">Last Year</option>
                      </select>
                      <Calendar size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none"/>
                    </div>
                    <button className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 flex items-center gap-2">
                       <Filter size={14}/> Filters
                    </button>
                    <div className="flex items-center gap-2 ml-2">
                       <span className="text-xs text-gray-500 font-medium">Compare</span>
                       <div className="w-10 h-5 bg-gray-200 rounded-full relative cursor-pointer">
                          <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm"></div>
                       </div>
                    </div>
                  </div>
                </div>

                {/* KPI Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                   <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                      <div className="flex justify-between items-start mb-2">
                         <div className="text-gray-500 text-sm">Total Sessions</div>
                         <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                           <TrendingUp size={10}/> 12.5%
                         </span>
                      </div>
                      <div className="text-3xl font-bold text-gray-900">12,450</div>
                      <div className="text-xs text-gray-400 mt-1">vs 10,890 prev</div>
                   </div>
                   <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                      <div className="flex justify-between items-start mb-2">
                         <div className="text-gray-500 text-sm">Conversion Rate</div>
                         <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                           <TrendingDown size={10}/> 1.2%
                         </span>
                      </div>
                      <div className="text-3xl font-bold text-gray-900">2.8%</div>
                      <div className="text-xs text-gray-400 mt-1">vs 3.0% prev</div>
                   </div>
                   <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                      <div className="flex justify-between items-start mb-2">
                         <div className="text-gray-500 text-sm">Avg. Engagement</div>
                         <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                           <TrendingUp size={10}/> 5.4%
                         </span>
                      </div>
                      <div className="text-3xl font-bold text-gray-900">2m 45s</div>
                      <div className="text-xs text-gray-400 mt-1">vs 2m 30s prev</div>
                   </div>
                   <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                      <div className="flex justify-between items-start mb-2">
                         <div className="text-gray-500 text-sm">Total Conversions</div>
                         <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                           <TrendingUp size={10}/> 8.1%
                         </span>
                      </div>
                      <div className="text-3xl font-bold text-gray-900">350</div>
                      <div className="text-xs text-gray-400 mt-1">Goal Completions</div>
                   </div>
                </div>

                {/* Traffic Overview */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                   <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-gray-800">Traffic Overview</h3>
                      <div className="flex items-center gap-4 text-sm">
                         <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-brand-blue"></span> Current Period
                         </div>
                         <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-gray-300"></span> Previous Period
                         </div>
                      </div>
                   </div>
                   <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={trafficTrendData}>
                            <defs>
                              <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb"/>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                            <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                            <Area type="monotone" dataKey="sessions" stroke="#0EA5E9" strokeWidth={3} fillOpacity={1} fill="url(#colorTraffic)" />
                            <Area type="monotone" dataKey="prev" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="4 4" fill="transparent" />
                          </AreaChart>
                      </ResponsiveContainer>
                   </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   {/* Acquisition Source */}
                   <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                      <h3 className="font-bold text-gray-800 mb-6">Acquisition Channels</h3>
                      <div className="space-y-4">
                        {acquisitionData.map((item, i) => (
                           <div key={i} className="flex items-center gap-4">
                              <div className="w-24 text-sm font-medium text-gray-600">{item.name}</div>
                              <div className="flex-1">
                                 <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-brand-blue rounded-full" style={{width: `${item.percent}%`}}></div>
                                 </div>
                              </div>
                              <div className="w-16 text-right text-sm font-bold text-gray-900">{item.sessions}</div>
                              <div className="w-16 text-right text-xs text-gray-500">{item.conversion}% CR</div>
                           </div>
                        ))}
                      </div>
                   </div>

                   {/* Conversion Funnel */}
                   <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                      <h3 className="font-bold text-gray-800 mb-6">Conversion Funnel</h3>
                      <div className="h-64">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={funnelData} barCategoryGap="15%">
                               <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                               <XAxis type="number" hide />
                               <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12}} />
                               <Tooltip />
                               <Bar dataKey="value" radius={[0, 4, 4, 0]} label={{position: 'right', fill: '#6b7280', fontSize: 12}}>
                                  {funnelData.map((entry, index) => (
                                     <Cell key={`cell-${index}`} fill={entry.fill} />
                                  ))}
                               </Bar>
                            </BarChart>
                         </ResponsiveContainer>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Top Pages */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                       <h3 className="font-bold text-gray-800 mb-6">Top Pages by Views</h3>
                       <div className="overflow-x-auto">
                          <table className="w-full text-left text-sm">
                             <thead className="bg-gray-50 text-gray-500 font-medium">
                                <tr>
                                   <th className="p-3 rounded-l-lg">Page Title</th>
                                   <th className="p-3">Views</th>
                                   <th className="p-3">Avg Time</th>
                                   <th className="p-3 rounded-r-lg">Bounce Rate</th>
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-gray-100">
                                {topPagesData.map((page, i) => (
                                   <tr key={i} className="hover:bg-gray-50">
                                      <td className="p-3">
                                         <div className="font-medium text-gray-900">{page.title}</div>
                                         <div className="text-xs text-gray-400">{page.url}</div>
                                      </td>
                                      <td className="p-3 text-gray-700">{page.views}</td>
                                      <td className="p-3 text-gray-700">{page.time}</td>
                                      <td className="p-3">
                                         <span className={`px-2 py-0.5 rounded text-xs font-bold ${parseInt(page.bounce) > 40 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                                            {page.bounce}
                                         </span>
                                      </td>
                                   </tr>
                                ))}
                             </tbody>
                          </table>
                       </div>
                    </div>

                    {/* Device Breakdown */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                       <h3 className="font-bold text-gray-800 mb-6">Audience Devices</h3>
                       <div className="h-48">
                          <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                  <Pie
                                      data={deviceData}
                                      innerRadius={60}
                                      outerRadius={80}
                                      paddingAngle={5}
                                      dataKey="value"
                                  >
                                      {deviceData.map((entry, index) => (
                                          <Cell key={`cell-${index}`} fill={entry.color} />
                                      ))}
                                  </Pie>
                                  <Tooltip />
                              </PieChart>
                          </ResponsiveContainer>
                       </div>
                       <div className="flex justify-center gap-6 mt-4">
                          {deviceData.map((item, i) => (
                             <div key={i} className="flex flex-col items-center">
                                <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                                   <span className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}}></span> {item.name}
                                </div>
                                <span className="font-bold text-gray-900">{item.value}%</span>
                             </div>
                          ))}
                       </div>
                    </div>
                </div>

                {/* Technical & Alerts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Zap size={18} className="text-yellow-500"/> Site Performance</h3>
                      <div className="space-y-4">
                         <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <div>
                               <div className="text-sm font-medium text-gray-900">Avg. Load Time</div>
                               <div className="text-xs text-gray-500">Target: &lt; 2.5s</div>
                            </div>
                            <div className="text-right">
                               <div className="text-lg font-bold text-green-600">1.2s</div>
                               <div className="text-xs text-green-600 font-bold bg-green-100 px-2 rounded">Fast</div>
                            </div>
                         </div>
                         <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <div>
                               <div className="text-sm font-medium text-gray-900">Core Web Vitals (LCP)</div>
                               <div className="text-xs text-gray-500">Largest Contentful Paint</div>
                            </div>
                            <div className="text-right">
                               <div className="text-lg font-bold text-orange-500">2.8s</div>
                               <div className="text-xs text-orange-600 font-bold bg-orange-100 px-2 rounded">Needs Improv</div>
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><AlertTriangle size={18} className="text-red-500"/> System Alerts</h3>
                      <div className="space-y-3">
                         <div className="flex gap-3 items-start p-3 bg-red-50 border border-red-100 rounded-lg">
                            <AlertTriangle size={16} className="text-red-500 mt-0.5 flex-shrink-0"/>
                            <div>
                               <div className="text-sm font-bold text-red-700">High Bounce Rate Detected</div>
                               <p className="text-xs text-red-600 mt-1">Bounce rate on /package/goa-beach-party increased by 15% yesterday.</p>
                               <div className="text-[10px] text-red-400 mt-1 font-mono">2 hours ago</div>
                            </div>
                         </div>
                         <div className="flex gap-3 items-start p-3 bg-blue-50 border border-blue-100 rounded-lg">
                            <Clock size={16} className="text-blue-500 mt-0.5 flex-shrink-0"/>
                            <div>
                               <div className="text-sm font-bold text-blue-700">Scheduled Maintenance</div>
                               <p className="text-xs text-blue-600 mt-1">Database optimization scheduled for Sunday 2 AM.</p>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="text-center text-xs text-gray-400 mt-8 pb-4">
                   <Activity size={12} className="inline mr-1"/> Data updated in real-time. Last refresh: {new Date().toLocaleTimeString()}
                </div>
              </div>
          )}

          {activeTab === 'packages' && (
             <div className="animate-fade-in">
                {/* ... existing package content ... */}
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
                                  <div className="flex gap-2">
                                     <button onClick={() => handleEditClick(pkg)} className="text-gray-400 hover:text-brand-blue font-medium text-sm flex items-center gap-1">
                                       <Edit size={14}/> Edit
                                     </button>
                                     <button 
                                      type="button"
                                      onClick={(e) => handleDeletePackage(e, pkg.id, pkg.name)} 
                                      className="text-gray-400 hover:text-red-500 font-medium text-sm flex items-center gap-1"
                                      >
                                       <Trash2 size={14}/>
                                     </button>
                                  </div>
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
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                   <h2 className="text-xl font-bold text-gray-900">Bookings & Enquiries</h2>
                   
                   <div className="flex gap-3 items-center flex-wrap">
                       {/* Filters */}
                       <div className="flex gap-2">
                          <div className="relative">
                              <Filter size={16} className="absolute left-3 top-3 text-gray-400"/>
                              <select 
                                 className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none"
                                 value={enquiryFilter.type}
                                 onChange={e => setEnquiryFilter({...enquiryFilter, type: e.target.value})}
                              >
                                 <option value="All">All Types</option>
                                 <option value="Package">Packages</option>
                                 <option value="Taxi">Taxi</option>
                                 <option value="AI Plan">AI Plans</option>
                              </select>
                          </div>
                          <select 
                             className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none"
                             value={enquiryFilter.status}
                             onChange={e => setEnquiryFilter({...enquiryFilter, status: e.target.value})}
                          >
                             <option value="All">All Status</option>
                             <option value="Confirmed">Confirmed</option>
                             <option value="Pending">Pending</option>
                             <option value="Cancelled">Cancelled</option>
                          </select>
                       </div>
                       
                       {/* Export Button */}
                       <button 
                        onClick={exportToCSV}
                        className="bg-green-50 text-green-600 px-4 py-2 rounded-lg text-sm font-bold border border-green-200 hover:bg-green-100 flex items-center gap-2"
                        title="Export to CSV (Excel)"
                       >
                          <Download size={16}/> Export CSV
                       </button>
                   </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                   <table className="w-full text-left whitespace-nowrap">
                      <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                         <tr>
                            <th className="p-4">Ref ID</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Service Details</th>
                            <th className="p-4">Travel Date</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Action</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                         {filteredBookings.map((booking) => (
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
                                  <div className="text-xs flex items-center gap-2 mt-1">
                                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase border ${
                                          booking.type === 'AI Plan' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                          booking.type === 'Taxi' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                          'bg-blue-50 text-blue-700 border-blue-100'
                                      }`}>
                                          {booking.type}
                                      </span>
                                      <span className="text-gray-500">{booking.travelers} Pax</span>
                                  </div>
                               </td>
                               <td className="p-4 text-sm font-bold text-brand-blue">
                                  {booking.travelDate ? formatDate(booking.travelDate) : '-'}
                               </td>
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
                                  <button 
                                    onClick={() => setSelectedEnquiry(booking)}
                                    className="bg-gray-100 text-gray-500 p-1.5 rounded hover:bg-gray-200 transition-colors" title="View Details"
                                   >
                                     <Eye size={16}/>
                                  </button>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                   {filteredBookings.length === 0 && (
                      <div className="p-8 text-center text-gray-500">No bookings match your filters.</div>
                   )}
                </div>
             </div>
          )}

          {activeTab === 'drivers' && (
             <div className="animate-fade-in">
                {/* ... existing drivers content ... */}
                <div className="flex justify-between items-center mb-6">
                   <h2 className="text-xl font-bold text-gray-900">Manage Drivers</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {drivers.map(driver => (
                      <div key={driver.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative group hover:shadow-lg transition-all">
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
                               <button 
                                type="button" 
                                onClick={() => deleteDriver(driver.id)} 
                                className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"
                               >
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

          {activeTab === 'profile' && (
            <div className="animate-fade-in">
               <div className="grid md:grid-cols-2 gap-8">
                  {/* Company Profile Section */}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Company Profile</h2>
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
                      <form onSubmit={handleProfileSave} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Company Name</label>
                          <div className="relative">
                            <Building2 className="absolute left-3 top-3 text-gray-400" size={18}/>
                            <input 
                                type="text" 
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue text-gray-900"
                                value={profileForm.name}
                                onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Address</label>
                          <input 
                              type="text" 
                              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue text-gray-900"
                              value={profileForm.address}
                              onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                          />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Website URL</label>
                           <div className="relative">
                             <Globe className="absolute left-3 top-3 text-gray-400" size={18}/>
                             <input 
                                 type="url" 
                                 className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue text-gray-900"
                                 value={profileForm.website || ''}
                                 placeholder="https://holidaypot.com"
                                 onChange={(e) => setProfileForm({...profileForm, website: e.target.value})}
                             />
                           </div>
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-gray-700 uppercase mb-1">GST Number</label>
                           <div className="relative">
                             <FileText className="absolute left-3 top-3 text-gray-400" size={18}/>
                             <input 
                                 type="text" 
                                 className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue text-gray-900"
                                 value={profileForm.gstNumber || ''}
                                 placeholder="29ABCDE1234F1Z5"
                                 onChange={(e) => setProfileForm({...profileForm, gstNumber: e.target.value})}
                             />
                           </div>
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Home Page Banner Image (URL)</label>
                           <div className="relative">
                             <ImageIcon className="absolute left-3 top-3 text-gray-400" size={18}/>
                             <input 
                                 type="text" 
                                 className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue text-gray-900"
                                 value={profileForm.heroImage || ''}
                                 placeholder="https://..."
                                 onChange={(e) => setProfileForm({...profileForm, heroImage: e.target.value})}
                             />
                           </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone</label>
                              <input 
                                  type="text" 
                                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue text-gray-900"
                                  value={profileForm.phone}
                                  onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email</label>
                              <input 
                                  type="email" 
                                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue text-gray-900"
                                  value={profileForm.email}
                                  onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                              />
                            </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Social Media Links</label>
                          <div className="space-y-3">
                              <div className="relative">
                                  <Facebook className="absolute left-3 top-3 text-blue-600" size={18}/>
                                  <input 
                                    placeholder="Facebook URL" 
                                    value={profileForm.facebook} 
                                    onChange={e => setProfileForm({...profileForm, facebook: e.target.value})} 
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue text-gray-900 text-sm" 
                                  />
                              </div>
                              <div className="relative">
                                  <Twitter className="absolute left-3 top-3 text-sky-400" size={18}/>
                                  <input 
                                    placeholder="Twitter / X URL" 
                                    value={profileForm.twitter} 
                                    onChange={e => setProfileForm({...profileForm, twitter: e.target.value})} 
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue text-gray-900 text-sm" 
                                  />
                              </div>
                              <div className="relative">
                                  <Instagram className="absolute left-3 top-3 text-pink-500" size={18}/>
                                  <input 
                                    placeholder="Instagram URL" 
                                    value={profileForm.instagram} 
                                    onChange={e => setProfileForm({...profileForm, instagram: e.target.value})} 
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue text-gray-900 text-sm" 
                                  />
                              </div>
                          </div>
                        </div>
                        <button type="submit" className="bg-brand-blue text-white font-bold py-3 px-8 rounded-xl hover:bg-sky-600 transition-colors shadow-lg w-full">
                            Save Profile
                        </button>
                      </form>
                    </div>

                    {/* Admin Security Section */}
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Admin Security</h2>
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Current Password</label>
                                <div className="relative">
                                    <Key className="absolute left-3 top-3 text-gray-400" size={18}/>
                                    <input 
                                        type="password" 
                                        required
                                        placeholder="••••••"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                                        value={currentPasswordInput}
                                        onChange={(e) => setCurrentPasswordInput(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">New Password</label>
                                    <input 
                                        type="password" 
                                        required
                                        placeholder="New pass"
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Confirm New</label>
                                    <input 
                                        type="password" 
                                        required
                                        placeholder="Confirm"
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-red-500 text-white font-bold py-3 px-8 rounded-xl hover:bg-red-600 transition-colors shadow-lg">
                                Change Password
                            </button>
                        </form>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="animate-fade-in">
               <div className="flex flex-col md:flex-row gap-8">
                  {/* Settings Sidebar */}
                  <div className="w-full md:w-64 flex-shrink-0">
                     <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-8">
                        <button 
                           onClick={() => setSettingsSubTab('ai')}
                           className={`w-full text-left px-6 py-4 flex items-center gap-3 text-sm font-bold border-l-4 transition-colors ${settingsSubTab === 'ai' ? 'border-brand-blue bg-blue-50 text-brand-blue' : 'border-transparent text-gray-600 hover:bg-gray-50'}`}
                        >
                           <Sparkles size={18}/> AI Engine
                        </button>
                        <button 
                           onClick={() => setSettingsSubTab('seo')}
                           className={`w-full text-left px-6 py-4 flex items-center gap-3 text-sm font-bold border-l-4 transition-colors ${settingsSubTab === 'seo' ? 'border-brand-blue bg-blue-50 text-brand-blue' : 'border-transparent text-gray-600 hover:bg-gray-50'}`}
                        >
                           <Globe size={18}/> SEO & Meta
                        </button>
                        <button 
                           onClick={() => setSettingsSubTab('pages')}
                           className={`w-full text-left px-6 py-4 flex items-center gap-3 text-sm font-bold border-l-4 transition-colors ${settingsSubTab === 'pages' ? 'border-brand-blue bg-blue-50 text-brand-blue' : 'border-transparent text-gray-600 hover:bg-gray-50'}`}
                        >
                           <AlertOctagon size={18}/> Error Pages
                        </button>
                        <button 
                           onClick={() => setSettingsSubTab('db')}
                           className={`w-full text-left px-6 py-4 flex items-center gap-3 text-sm font-bold border-l-4 transition-colors ${settingsSubTab === 'db' ? 'border-brand-blue bg-blue-50 text-brand-blue' : 'border-transparent text-gray-600 hover:bg-gray-50'}`}
                        >
                           <Database size={18}/> Database
                        </button>
                     </div>
                  </div>

                  {/* Settings Content */}
                  <div className="flex-grow">
                     
                     {/* AI SETTINGS */}
                     {settingsSubTab === 'ai' && (
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 animate-fade-in">
                           <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Sparkles className="text-brand-orange"/> AI Engine Configuration</h2>
                           
                           <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6">
                              <h4 className="font-bold text-blue-800 text-sm mb-1 flex items-center gap-2"><Activity size={16}/> High Availability Mode</h4>
                              <p className="text-xs text-blue-600">
                                 The system automatically handles "503 Overloaded" errors by retrying requests with exponential backoff. 
                                 Add multiple API keys below to distribute the load and prevent rate limits.
                              </p>
                           </div>

                           <form onSubmit={handleAiSave} className="space-y-6">
                              <div>
                                 <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Primary Google API Key</label>
                                 <input 
                                    type="password" 
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue text-gray-900 font-mono text-sm"
                                    placeholder="AIza..."
                                    value={aiForm.primaryApiKey}
                                    onChange={(e) => setAiForm({...aiForm, primaryApiKey: e.target.value})}
                                 />
                                 <p className="text-[10px] text-gray-400 mt-1">Leave empty to use Environment Variable (VITE_API_KEY)</p>
                              </div>

                              <div>
                                 <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Backup API Keys (One per line)</label>
                                 <textarea 
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue text-gray-900 font-mono text-sm h-32 resize-none"
                                    placeholder="AIza...&#10;AIza..."
                                    value={aiForm.fallbackApiKeys.join('\n')}
                                    onChange={(e) => setAiForm({...aiForm, fallbackApiKeys: e.target.value.split('\n')})}
                                 ></textarea>
                                 <p className="text-[10px] text-gray-400 mt-1">Used automatically if primary key fails or is overloaded.</p>
                              </div>

                              <div className="grid grid-cols-2 gap-6">
                                 <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Model Selection</label>
                                    <select 
                                       className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue text-gray-900"
                                       value={aiForm.model}
                                       onChange={(e) => setAiForm({...aiForm, model: e.target.value})}
                                    >
                                       <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended)</option>
                                       <option value="gemini-1.5-flash">Gemini 1.5 Flash (Legacy)</option>
                                       <option value="gemini-pro">Gemini Pro</option>
                                    </select>
                                 </div>
                                 <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Max Retries</label>
                                    <input 
                                       type="number"
                                       min="1"
                                       max="10"
                                       className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue text-gray-900"
                                       value={aiForm.maxRetries}
                                       onChange={(e) => setAiForm({...aiForm, maxRetries: parseInt(e.target.value)})}
                                    />
                                 </div>
                              </div>

                              <button type="submit" className="bg-brand-blue text-white font-bold py-3 px-8 rounded-xl hover:bg-sky-600 transition-colors shadow-lg">
                                 Save AI Settings
                              </button>
                           </form>
                        </div>
                     )}

                     {/* SEO SETTINGS */}
                     {settingsSubTab === 'seo' && (
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 animate-fade-in">
                           <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Globe className="text-green-600"/> Global SEO Configuration</h2>
                           <form onSubmit={handleSeoSave} className="space-y-4">
                              <div>
                                 <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Global Site Title</label>
                                 <input 
                                    type="text" 
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue text-gray-900"
                                    value={seoForm.title}
                                    onChange={(e) => setSeoForm({...seoForm, title: e.target.value})}
                                 />
                              </div>
                              <div>
                                 <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Meta Description</label>
                                 <textarea 
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue text-gray-900 h-24 resize-none"
                                    value={seoForm.description}
                                    onChange={(e) => setSeoForm({...seoForm, description: e.target.value})}
                                 />
                              </div>
                              <div>
                                 <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Keywords</label>
                                 <input 
                                    type="text" 
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue text-gray-900"
                                    value={seoForm.keywords}
                                    onChange={(e) => setSeoForm({...seoForm, keywords: e.target.value})}
                                 />
                              </div>
                              
                              <div className="pt-4 border-t border-gray-100 grid grid-cols-1 gap-3">
                                 <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-gray-700 flex items-center gap-2"><Settings size={14}/> Enable Sitemap.xml</span>
                                    <input type="checkbox" checked={seoForm.sitemapEnabled} onChange={e => setSeoForm({...seoForm, sitemapEnabled: e.target.checked})} className="accent-brand-blue w-4 h-4"/>
                                 </div>
                                 <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-gray-700 flex items-center gap-2"><Settings size={14}/> Enable Robots.txt</span>
                                    <input type="checkbox" checked={seoForm.robotsTxtEnabled} onChange={e => setSeoForm({...seoForm, robotsTxtEnabled: e.target.checked})} className="accent-brand-blue w-4 h-4"/>
                                 </div>
                              </div>

                              <button type="submit" className="w-full bg-brand-green text-white font-bold py-3 px-8 rounded-xl hover:bg-green-600 transition-colors shadow-lg mt-4">
                                 Save SEO Settings
                              </button>
                           </form>
                        </div>
                     )}

                     {/* ERROR PAGES SETTINGS */}
                     {settingsSubTab === 'pages' && (
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 animate-fade-in">
                           <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><AlertOctagon className="text-red-500"/> Error Pages & Maintenance</h2>
                           <form onSubmit={handlePageSave} className="space-y-6">
                              
                              {/* 404 Config */}
                              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                                 <h3 className="font-bold text-gray-800 mb-3">404 Page Not Found</h3>
                                 <div className="space-y-3">
                                    <div>
                                       <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Headline</label>
                                       <input 
                                          type="text" 
                                          className="w-full p-2 bg-white border border-gray-300 rounded-lg text-sm"
                                          value={pageForm.error404.title}
                                          onChange={(e) => setPageForm({...pageForm, error404: {...pageForm.error404, title: e.target.value}})}
                                       />
                                    </div>
                                    <div>
                                       <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Message</label>
                                       <textarea 
                                          className="w-full p-2 bg-white border border-gray-300 rounded-lg text-sm resize-none h-20"
                                          value={pageForm.error404.message}
                                          onChange={(e) => setPageForm({...pageForm, error404: {...pageForm.error404, message: e.target.value}})}
                                       />
                                    </div>
                                    <div>
                                       <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Image URL</label>
                                       <input 
                                          type="text" 
                                          className="w-full p-2 bg-white border border-gray-300 rounded-lg text-sm"
                                          value={pageForm.error404.image}
                                          onChange={(e) => setPageForm({...pageForm, error404: {...pageForm.error404, image: e.target.value}})}
                                       />
                                    </div>
                                 </div>
                              </div>

                              {/* Maintenance Mode */}
                              <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-100 rounded-xl">
                                 <div>
                                    <h4 className="font-bold text-orange-800 text-sm">Maintenance Mode</h4>
                                    <p className="text-xs text-orange-600">Show a generic 503 Service Unavailable page to all visitors.</p>
                                 </div>
                                 <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                                    <input 
                                       type="checkbox" 
                                       name="toggle" 
                                       id="toggle" 
                                       checked={pageForm.maintenanceMode}
                                       onChange={(e) => setPageForm({...pageForm, maintenanceMode: e.target.checked})}
                                       className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-orange-200 checked:right-0 checked:border-brand-orange"
                                    />
                                    <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-orange-200 cursor-pointer"></label>
                                 </div>
                              </div>

                              <button type="submit" className="w-full bg-gray-900 text-white font-bold py-3 px-8 rounded-xl hover:bg-black transition-colors shadow-lg">
                                 Save Page Settings
                              </button>
                           </form>
                        </div>
                     )}

                     {/* DB SETTINGS */}
                     {settingsSubTab === 'db' && (
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 animate-fade-in">
                           <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Server className="text-purple-600"/> Database Configuration</h2>
                           <div className="mb-4 p-4 bg-purple-50 border border-purple-100 rounded-lg text-sm text-purple-800">
                              <strong className="flex items-center gap-2 mb-1"><Database size={16}/> Advanced Settings</strong>
                              Override the default Supabase connection. Leave empty to use default. Page will reload on save.
                           </div>
                           <form onSubmit={handleDbSave} className="space-y-4">
                              <div>
                                 <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Project Name (Optional)</label>
                                 <input 
                                    type="text" 
                                    placeholder="My Production DB"
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue text-gray-900 font-mono text-sm"
                                    value={dbConfig.projectName}
                                    onChange={(e) => setDbConfig({...dbConfig, projectName: e.target.value})}
                                 />
                              </div>
                              <div>
                                 <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Supabase URL</label>
                                 <input 
                                    type="text" 
                                    placeholder="https://..."
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue text-gray-900 font-mono text-sm"
                                    value={dbConfig.url}
                                    onChange={(e) => setDbConfig({...dbConfig, url: e.target.value})}
                                 />
                              </div>
                              <div>
                                 <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Supabase Anon Key</label>
                                 <input 
                                    type="password" 
                                    placeholder="eyJ..."
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue text-gray-900 font-mono text-sm"
                                    value={dbConfig.key}
                                    onChange={(e) => setDbConfig({...dbConfig, key: e.target.value})}
                                 />
                              </div>
                              <button type="submit" className="w-full bg-purple-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-purple-700 transition-colors shadow-lg">
                                 Save & Connect
                              </button>
                           </form>
                        </div>
                     )}

                  </div>
               </div>
            </div>
          )}

          {/* New/Edit Package Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
               <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-6 animate-fade-in max-h-[95vh] overflow-y-auto flex flex-col">
                  {/* ... Modal content ... */}
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="text-xl font-bold text-gray-900">{editingId ? 'Edit Package' : 'Add New Package'}</h3>
                     <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                        <Plus size={24} className="rotate-45"/>
                     </button>
                  </div>
                  
                  {/* Modal Tabs */}
                  <div className="flex gap-1 mb-6 border-b border-gray-100 overflow-x-auto pb-2">
                     <button 
                        onClick={() => setModalTab('basic')}
                        className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${modalTab === 'basic' ? 'border-brand-blue text-brand-blue bg-blue-50/50 rounded-t-lg' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                     >
                        <Layout size={16}/> Basic Info
                     </button>
                     <button 
                        onClick={() => setModalTab('itinerary')}
                        className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${modalTab === 'itinerary' ? 'border-brand-blue text-brand-blue bg-blue-50/50 rounded-t-lg' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                     >
                        <Compass size={16}/> Itinerary & Overview
                     </button>
                     <button 
                        onClick={() => setModalTab('guide')}
                        className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${modalTab === 'guide' ? 'border-brand-blue text-brand-blue bg-blue-50/50 rounded-t-lg' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                     >
                        <Utensils size={16}/> Guide (Gems/Food)
                     </button>
                     <button 
                        onClick={() => setModalTab('smart')}
                        className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${modalTab === 'smart' ? 'border-brand-blue text-brand-blue bg-blue-50/50 rounded-t-lg' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                     >
                        <Briefcase size={16}/> Smart Travel
                     </button>
                  </div>
                  
                  <form onSubmit={handleSavePackage} className="space-y-4 flex-grow flex flex-col">
                     {/* ... Form fields based on tab (same as before) ... */}
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
                                    placeholder="e.g. 5 Days / 4 Nights"
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
                                    <option>Pilgrimage</option>
                                 </select>
                              </div>
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <div>
                                 <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Group Size</label>
                                 <input 
                                    type="text" 
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue text-gray-900" 
                                    placeholder="e.g. Couples / Family"
                                    value={newPackage.groupSize}
                                    onChange={e => setNewPackage({...newPackage, groupSize: e.target.value})}
                                 />
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
                              {newPackage.image && (
                                <img src={newPackage.image} alt="Preview" className="h-20 w-32 object-cover rounded mt-2 border border-gray-200" />
                              )}
                           </div>

                           {!editingId && (
                              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                 <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-bold text-blue-800 text-sm flex items-center gap-2"><Sparkles size={16}/> AI Auto-Fill</h4>
                                 </div>
                                 <p className="text-xs text-blue-600 mb-3">
                                    Automatically populate Itinerary, Hidden Gems, and Smart Travel tabs based on Name & Destination.
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

                     {/* Other form sections remain same */}
                     {modalTab === 'itinerary' && (
                        <div className="animate-fade-in flex flex-col h-[500px]">
                           <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-2">
                              <p className="text-xs text-blue-700 flex items-center gap-2">
                                 <FileJson size={12}/> JSON Editor for: shortDesc, longDesc, bestTime, idealFor, inclusions, exclusions, itinerary.
                              </p>
                           </div>
                           <textarea
                              className="w-full flex-grow p-4 bg-gray-900 text-green-400 font-mono text-xs rounded-xl border border-gray-700 focus:ring-2 focus:ring-brand-blue outline-none resize-none"
                              value={itineraryJson}
                              onChange={e => setItineraryJson(e.target.value)}
                              spellCheck={false}
                           ></textarea>
                        </div>
                     )}

                     {modalTab === 'guide' && (
                        <div className="animate-fade-in flex flex-col h-[500px]">
                           <div className="bg-orange-50 p-3 rounded-lg border border-orange-100 mb-2">
                              <p className="text-xs text-orange-700 flex items-center gap-2">
                                 <FileJson size={12}/> JSON Editor for: hiddenGems, foodGuide.
                              </p>
                           </div>
                           <textarea
                              className="w-full flex-grow p-4 bg-gray-900 text-green-400 font-mono text-xs rounded-xl border border-gray-700 focus:ring-2 focus:ring-brand-blue outline-none resize-none"
                              value={guideJson}
                              onChange={e => setGuideJson(e.target.value)}
                              spellCheck={false}
                           ></textarea>
                        </div>
                     )}

                     {modalTab === 'smart' && (
                        <div className="animate-fade-in flex flex-col h-[500px]">
                           <div className="bg-purple-50 p-3 rounded-lg border border-purple-100 mb-2">
                              <p className="text-xs text-purple-700 flex items-center gap-2">
                                 <FileJson size={12}/> JSON Editor for: packingList, safetyTips, visaInfo, airportInfo.
                              </p>
                           </div>
                           <textarea
                              className="w-full flex-grow p-4 bg-gray-900 text-green-400 font-mono text-xs rounded-xl border border-gray-700 focus:ring-2 focus:ring-brand-blue outline-none resize-none"
                              value={smartJson}
                              onChange={e => setSmartJson(e.target.value)}
                              spellCheck={false}
                           ></textarea>
                        </div>
                     )}
                     
                     <div className="pt-4 flex gap-3 border-t border-gray-100 mt-auto">
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

           {/* Enquiry Detail Modal (Same as before) */}
           {selectedEnquiry && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
               <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative">
                  <button onClick={() => setSelectedEnquiry(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                     <Plus size={24} className="rotate-45"/>
                  </button>
                  
                  <div className="mb-6 border-b border-gray-100 pb-4">
                     <span className={`px-2 py-1 rounded text-xs font-bold ${
                         selectedEnquiry.type === 'AI Plan' ? 'bg-purple-100 text-purple-700' :
                         selectedEnquiry.type === 'Taxi' ? 'bg-orange-100 text-orange-700' :
                         'bg-blue-100 text-blue-700'
                     }`}>
                        {selectedEnquiry.type} Enquiry
                     </span>
                     <h3 className="text-xl font-bold text-gray-900 mt-2">{selectedEnquiry.itemName}</h3>
                     <p className="text-sm text-gray-500">Ref: {selectedEnquiry.id}</p>
                  </div>

                  <div className="space-y-4 mb-6">
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="text-xs font-bold text-gray-500 uppercase">Customer</label>
                           <p className="font-semibold text-gray-900">{selectedEnquiry.customerName}</p>
                           <p className="text-sm text-gray-500">{selectedEnquiry.customerPhone}</p>
                           <p className="text-sm text-gray-500">{selectedEnquiry.customerEmail}</p>
                        </div>
                        <div>
                           <label className="text-xs font-bold text-gray-500 uppercase">Travel Details</label>
                           <p className="font-semibold text-gray-900">
                              {selectedEnquiry.travelDate ? formatDate(selectedEnquiry.travelDate) : 'Flexible'}
                           </p>
                           <p className="text-sm text-gray-500">{selectedEnquiry.travelers} Travelers</p>
                        </div>
                     </div>
                     
                     {selectedEnquiry.message && (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                           <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Customer Message</label>
                           <p className="text-sm text-gray-800 italic">"{selectedEnquiry.message}"</p>
                        </div>
                     )}
                  </div>

                  <div className="flex gap-3">
                     <button 
                        onClick={() => setSelectedEnquiry(null)}
                        className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors"
                     >
                        Close
                     </button>
                     <a href={`tel:${selectedEnquiry.customerPhone}`} className="flex-1 bg-brand-blue text-white font-bold py-3 rounded-xl hover:bg-sky-600 transition-colors shadow-lg flex items-center justify-center gap-2">
                        Call Customer
                     </a>
                  </div>
               </div>
            </div>
           )}

       </div>
    </div>
  );
};

export default AdminDashboard;
    