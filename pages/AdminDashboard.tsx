
import React, { useState, useEffect } from 'react';
import { LogOut, LayoutDashboard, BarChart3, Package, Calendar, Car, Settings, Lock } from 'lucide-react';
import { useGlobal } from '../GlobalContext';
import AdminOverview from './admin/AdminOverview';
import AdminAnalytics from './admin/AdminAnalytics';
import AdminPackages from './admin/AdminPackages';
import AdminEnquiries from './admin/AdminEnquiries';
import AdminDrivers from './admin/AdminDrivers';
import AdminSettings from './admin/AdminSettings';

const AdminDashboard: React.FC = () => {
  const { companyProfile } = useGlobal();
  
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics' | 'packages' | 'enquiries' | 'drivers' | 'settings'>('dashboard');

  useEffect(() => {
    const storedAuth = localStorage.getItem('holidayPotAdminAuth');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 animate-fade-in">
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
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none"/>
            </div>
            {loginError && <p className="text-red-500 text-sm text-center">{loginError}</p>}
            <button type="submit" className="w-full bg-brand-blue text-white font-bold py-3 rounded-xl hover:bg-sky-600 transition-colors shadow-lg">Login</button>
            <p className="text-xs text-center text-gray-400 mt-4">Hint: admin / admin</p>
          </form>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <AdminOverview setActiveTab={setActiveTab} />;
      case 'analytics': return <AdminAnalytics />;
      case 'packages': return <AdminPackages />;
      case 'enquiries': return <AdminEnquiries />;
      case 'drivers': return <AdminDrivers />;
      case 'settings': return <AdminSettings />;
      default: return <AdminOverview setActiveTab={setActiveTab} />;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'packages', label: 'Packages', icon: Package },
    { id: 'enquiries', label: 'Enquiries', icon: Calendar },
    { id: 'drivers', label: 'Drivers', icon: Car },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
       {/* Sidebar */}
       <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed h-full z-10">
          <div className="p-6">
             <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center text-white font-bold">H</div>
                <span className="font-bold text-xl tracking-tight">Admin</span>
             </div>
             <p className="text-xs text-gray-400 pl-10">Manage {companyProfile.name}</p>
          </div>
          
          <nav className="flex-1 px-4 space-y-1">
             {navItems.map((item) => (
                <button
                   key={item.id}
                   onClick={() => setActiveTab(item.id as any)}
                   className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      activeTab === item.id 
                      ? 'bg-brand-blue text-white shadow-md shadow-blue-100' 
                      : 'text-gray-600 hover:bg-gray-50'
                   }`}
                >
                   <item.icon size={18} /> {item.label}
                </button>
             ))}
          </nav>

          <div className="p-4 border-t border-gray-100">
             <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors">
                <LogOut size={18} /> Logout
             </button>
          </div>
       </aside>

       {/* Mobile Nav Header */}
       <div className="md:hidden fixed top-0 w-full bg-white border-b border-gray-200 z-20 px-4 py-3 flex justify-between items-center">
          <span className="font-bold text-lg">Admin Panel</span>
          <button onClick={handleLogout} className="text-red-500"><LogOut size={20}/></button>
       </div>
       
       {/* Mobile Bottom Nav */}
       <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 z-20 flex justify-around p-2">
          {navItems.map((item) => (
             <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`p-2 rounded-lg ${activeTab === item.id ? 'text-brand-blue bg-blue-50' : 'text-gray-400'}`}
             >
                <item.icon size={24} />
             </button>
          ))}
       </div>

       {/* Main Content */}
       <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 pb-20 md:pb-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
             {renderContent()}
          </div>
       </main>
    </div>
  );
};

export default AdminDashboard;
