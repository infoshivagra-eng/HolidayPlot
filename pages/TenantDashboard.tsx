
import React, { useState } from 'react';
import { LogOut, LayoutDashboard, BarChart3, Package, Calendar, Car, Settings, Users, ScrollText, BookOpen, HelpCircle } from 'lucide-react';
import { useGlobal } from '../GlobalContext';
import AdminOverview from './admin/AdminOverview';
import AdminAnalytics from './admin/AdminAnalytics';
import AdminPackages from './admin/AdminPackages';
import AdminEnquiries from './admin/AdminEnquiries';
import AdminDrivers from './admin/AdminDrivers';
import AdminSettings from './admin/AdminSettings';
import AdminManagers from './admin/AdminManagers';
import AdminLogs from './admin/AdminLogs';
import AdminBlog from './admin/AdminBlog';
import AdminDocs from './admin/AdminDocs';
import AdminChangelog from './admin/AdminChangelog';

const TenantDashboard: React.FC = () => {
  const { currentTenant, logout, featureFlags, bookings } = useGlobal();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Calculate Pending counts for badges
  const pendingEnquiries = bookings.filter(b => b.status === 'Pending').length;

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, flag: null },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, flag: 'analytics' },
    { id: 'packages', label: 'Packages', icon: Package, flag: 'packages' },
    { 
      id: 'enquiries', 
      label: 'Enquiries & Inbox', 
      icon: Calendar, 
      flag: 'bookings',
      badge: pendingEnquiries > 0 ? pendingEnquiries : null 
    },
    { id: 'drivers', label: 'Drivers', icon: Car, flag: 'drivers' },
    { id: 'blog', label: 'Blog', icon: BookOpen, flag: 'blog' },
    { id: 'team', label: 'Team', icon: Users, flag: 'white_label' },
    { id: 'logs', label: 'Logs', icon: ScrollText, flag: 'white_label' },
    { id: 'settings', label: 'Settings', icon: Settings, flag: null },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <AdminOverview setActiveTab={setActiveTab} />;
      case 'analytics': return <AdminAnalytics />;
      case 'packages': return <AdminPackages />;
      case 'enquiries': return <AdminEnquiries />;
      case 'drivers': return <AdminDrivers />;
      case 'blog': return <AdminBlog />;
      case 'team': return <AdminManagers />;
      case 'logs': return <AdminLogs />;
      case 'settings': return <AdminSettings />;
      case 'docs': return <AdminDocs />;
      case 'changelog': return <AdminChangelog />;
      default: return <AdminOverview setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
       {/* Sidebar */}
       <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed h-full z-10">
          <div className="p-6">
             <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center text-white font-bold">
                    {currentTenant?.business_name?.charAt(0) || 'H'}
                </div>
                <span className="font-bold text-xl tracking-tight truncate">{currentTenant?.business_name || 'Admin'}</span>
             </div>
             <p className="text-xs text-gray-400 pl-10">
                 Plan: <span className="uppercase font-bold text-brand-blue">{currentTenant?.plan_id}</span>
             </p>
          </div>
          
          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
             {navItems.filter(item => !item.flag || featureFlags.includes(item.flag)).map((item) => (
                <button
                   key={item.id}
                   onClick={() => setActiveTab(item.id)}
                   className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      activeTab === item.id 
                      ? 'bg-brand-blue text-white shadow-md shadow-blue-100' 
                      : 'text-gray-600 hover:bg-gray-50'
                   }`}
                >
                   <div className="flex items-center gap-3">
                      <item.icon size={18} /> {item.label}
                   </div>
                   {item.badge && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${activeTab === item.id ? 'bg-white text-brand-blue' : 'bg-red-100 text-red-600'}`}>
                         {item.badge}
                      </span>
                   )}
                </button>
             ))}
             
             <div className="pt-4 mt-4 border-t border-gray-100">
                <button onClick={() => setActiveTab('docs')} className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
                   <HelpCircle size={18} /> Guide
                </button>
             </div>
          </nav>

          <div className="p-4 border-t border-gray-100">
             <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors">
                <LogOut size={18} /> Logout
             </button>
          </div>
       </aside>

       {/* Mobile Nav */}
       <div className="md:hidden fixed top-0 w-full bg-white border-b border-gray-200 z-20 px-4 py-3 flex justify-between items-center">
          <span className="font-bold text-lg">{currentTenant?.business_name}</span>
          <button onClick={logout} className="text-red-500"><LogOut size={20}/></button>
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

export default TenantDashboard;
