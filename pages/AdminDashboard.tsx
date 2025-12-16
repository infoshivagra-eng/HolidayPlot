
import React, { useState, useEffect } from 'react';
import { LogOut, LayoutDashboard, BarChart3, Package, Calendar, Car, Settings, Lock, Users, ScrollText, UserCircle, X, Camera } from 'lucide-react';
import { useGlobal } from '../GlobalContext';
import AdminOverview from './admin/AdminOverview';
import AdminAnalytics from './admin/AdminAnalytics';
import AdminPackages from './admin/AdminPackages';
import AdminEnquiries from './admin/AdminEnquiries';
import AdminDrivers from './admin/AdminDrivers';
import AdminSettings from './admin/AdminSettings';
import AdminManagers from './admin/AdminManagers';
import AdminLogs from './admin/AdminLogs';
import { Manager } from '../types';

const AdminDashboard: React.FC = () => {
  const { companyProfile, login, logout, currentUser, updateProfile } = useGlobal();
  
  // Auth State (Local to form)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // UI State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics' | 'packages' | 'enquiries' | 'drivers' | 'settings' | 'team' | 'logs'>('dashboard');
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Profile Edit State
  const [profileForm, setProfileForm] = useState<Partial<Manager>>({});

  useEffect(() => {
     if (currentUser) {
         setProfileForm(currentUser);
     }
  }, [currentUser]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(username, password);
    
    if (success) {
      setLoginError('');
      setUsername('');
      setPassword('');
    } else {
      setLoginError('Invalid credentials.');
    }
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
     e.preventDefault();
     updateProfile(profileForm);
     setShowProfileModal(false);
  };

  // Helper to check permission
  const hasPermission = (perm: string) => {
     if (!currentUser) return false;
     if (currentUser.role === 'Super Admin') return true;
     return currentUser.permissions.includes(perm as any);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 animate-fade-in">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-brand-blue text-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Lock size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
            <p className="text-gray-500">Sign in to manage HolidayPot</p>
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
            <p className="text-xs text-center text-gray-400 mt-4">Demo: admin / admin</p>
          </form>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <AdminOverview setActiveTab={setActiveTab} />;
      case 'analytics': return hasPermission('view_analytics') ? <AdminAnalytics /> : <div className="p-8 text-center text-gray-500">Access Denied</div>;
      case 'packages': return hasPermission('manage_packages') ? <AdminPackages /> : <div className="p-8 text-center text-gray-500">Access Denied</div>;
      case 'enquiries': return hasPermission('manage_bookings') ? <AdminEnquiries /> : <div className="p-8 text-center text-gray-500">Access Denied</div>;
      case 'drivers': return hasPermission('manage_drivers') ? <AdminDrivers /> : <div className="p-8 text-center text-gray-500">Access Denied</div>;
      case 'settings': return hasPermission('manage_settings') ? <AdminSettings /> : <div className="p-8 text-center text-gray-500">Access Denied</div>;
      case 'team': return hasPermission('manage_team') ? <AdminManagers /> : <div className="p-8 text-center text-gray-500">Access Denied</div>;
      case 'logs': return <AdminLogs />;
      default: return <AdminOverview setActiveTab={setActiveTab} />;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, perm: null },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, perm: 'view_analytics' },
    { id: 'packages', label: 'Packages', icon: Package, perm: 'manage_packages' },
    { id: 'enquiries', label: 'Enquiries', icon: Calendar, perm: 'manage_bookings' },
    { id: 'drivers', label: 'Drivers', icon: Car, perm: 'manage_drivers' },
    { id: 'team', label: 'Team', icon: Users, perm: 'manage_team' },
    { id: 'logs', label: 'Logs', icon: ScrollText, perm: 'manage_team' }, // Logs usually restrict to admins
    { id: 'settings', label: 'Settings', icon: Settings, perm: 'manage_settings' },
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
          
          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
             {navItems.filter(item => !item.perm || hasPermission(item.perm)).map((item) => (
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

          <div className="p-4 border-t border-gray-100 space-y-2">
             <button onClick={() => setShowProfileModal(true)} className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors">
                <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
                    <img src={currentUser.avatar} alt="Me" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 text-left truncate">
                    <div className="text-xs font-bold">{currentUser.name}</div>
                    <div className="text-[10px] text-gray-400">{currentUser.role}</div>
                </div>
             </button>
             <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors">
                <LogOut size={18} /> Logout
             </button>
          </div>
       </aside>

       {/* Mobile Nav Header */}
       <div className="md:hidden fixed top-0 w-full bg-white border-b border-gray-200 z-20 px-4 py-3 flex justify-between items-center">
          <span className="font-bold text-lg">Admin Panel</span>
          <button onClick={logout} className="text-red-500"><LogOut size={20}/></button>
       </div>
       
       {/* Mobile Bottom Nav */}
       <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 z-20 flex justify-around p-2">
          {navItems.filter(i => !i.perm || hasPermission(i.perm)).slice(0, 5).map((item) => (
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

       {/* Profile Modal */}
       {showProfileModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
           <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-fade-in">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                 <h3 className="font-bold text-gray-900">My Profile</h3>
                 <button onClick={() => setShowProfileModal(false)}><X size={20} className="text-gray-400 hover:text-gray-600"/></button>
              </div>
              <form onSubmit={handleProfileUpdate} className="p-6 space-y-4">
                 <div className="flex flex-col items-center mb-6">
                    <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg relative overflow-hidden bg-gray-100 mb-2">
                       <img src={profileForm.avatar} alt="Avatar" className="w-full h-full object-cover"/>
                    </div>
                    <p className="text-xs text-gray-500">Role: <span className="font-bold text-brand-blue">{currentUser.role}</span></p>
                 </div>
                 
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Display Name</label>
                    <input type="text" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg"/>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Avatar URL</label>
                    <input type="text" value={profileForm.avatar} onChange={e => setProfileForm({...profileForm, avatar: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg"/>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                    <input type="email" value={profileForm.email} onChange={e => setProfileForm({...profileForm, email: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg"/>
                 </div>
                 
                 <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-700">
                    Your username ({currentUser.username}) cannot be changed. Contact Super Admin for access changes.
                 </div>

                 <button type="submit" className="w-full bg-brand-blue text-white py-3 rounded-xl font-bold hover:bg-sky-600">Save Changes</button>
              </form>
           </div>
        </div>
       )}
    </div>
  );
};

export default AdminDashboard;
