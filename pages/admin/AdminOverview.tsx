
import React from 'react';
import { DollarSign, Calendar, Users, Package, Car, Settings } from 'lucide-react';
import { useGlobal } from '../../GlobalContext';
import { useCurrency } from '../../CurrencyContext';

interface OverviewProps {
  setActiveTab: (tab: any) => void;
}

const AdminOverview: React.FC<OverviewProps> = ({ setActiveTab }) => {
  const { bookings, packages, drivers } = useGlobal();
  const { formatPrice } = useCurrency();

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.paid ? b.totalAmount : 0), 0);
  const pendingEnquiries = bookings.filter(b => b.status === 'Pending').length;

  const stats = [
    { label: 'Total Revenue', value: formatPrice(totalRevenue), icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100', link: 'analytics' },
    { label: 'Total Bookings', value: bookings.length, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-100', link: 'enquiries' },
    { label: 'Active Drivers', value: drivers.filter(d => d.status !== 'Offline').length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100', link: 'drivers' },
    { label: 'Live Packages', value: packages.length, icon: Package, color: 'text-orange-600', bg: 'bg-orange-100', link: 'packages' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-sm text-gray-500">Welcome back to your control center</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div 
            key={idx} 
            onClick={() => setActiveTab(stat.link)}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
              {stat.label === 'Total Bookings' && pendingEnquiries > 0 && (
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                  {pendingEnquiries} Pending
                </span>
              )}
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Enquiries */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-gray-900">Recent Activity</h3>
            <button onClick={() => setActiveTab('enquiries')} className="text-sm text-brand-blue hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {bookings.slice(0, 5).map(booking => (
              <div key={booking.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${booking.status === 'Confirmed' ? 'bg-green-500' : 'bg-orange-400'}`}>
                    {booking.customerName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{booking.customerName}</div>
                    <div className="text-xs text-gray-500">{new Date(booking.date).toLocaleDateString()} • {booking.type}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm">{formatPrice(booking.totalAmount)}</div>
                  <div className={`text-[10px] uppercase font-bold ${booking.status === 'Confirmed' ? 'text-green-600' : 'text-orange-500'}`}>
                    {booking.status}
                  </div>
                </div>
              </div>
            ))}
            {bookings.length === 0 && <p className="text-center text-gray-400 py-4">No recent activity.</p>}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-brand-blue to-cyan-600 p-6 rounded-2xl shadow-lg text-white">
           <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
           <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setActiveTab('packages')} className="bg-white/10 hover:bg-white/20 p-4 rounded-xl backdrop-blur-sm transition-colors text-left">
                 <Package className="mb-2" size={24}/>
                 <div className="font-bold">Add Package</div>
                 <div className="text-xs opacity-70">Create new tour</div>
              </button>
              <button onClick={() => setActiveTab('drivers')} className="bg-white/10 hover:bg-white/20 p-4 rounded-xl backdrop-blur-sm transition-colors text-left">
                 <Car className="mb-2" size={24}/>
                 <div className="font-bold">Verify Driver</div>
                 <div className="text-xs opacity-70">Check documents</div>
              </button>
              <button onClick={() => setActiveTab('settings')} className="bg-white/10 hover:bg-white/20 p-4 rounded-xl backdrop-blur-sm transition-colors text-left col-span-2">
                 <Settings className="mb-2" size={24}/>
                 <div className="font-bold">System Settings</div>
                 <div className="text-xs opacity-70">Configure SEO, AI & Notifications</div>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
