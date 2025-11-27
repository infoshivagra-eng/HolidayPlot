import React, { useState } from 'react';
import { DollarSign, User, Check, X, Bell } from 'lucide-react';
import { MOCK_RIDES, MOCK_DRIVERS } from '../constants';
import { useCurrency } from '../CurrencyContext';

const DriverDashboard: React.FC = () => {
  const { formatPrice } = useCurrency();
  const driver = MOCK_DRIVERS[0]; // Simulating logged-in driver
  const [activeTab, setActiveTab] = useState('requests');

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
         <div className="p-6">
            <h2 className="text-2xl font-bold text-brand-blue mb-1">Driver Portal</h2>
            <p className="text-xs text-gray-400">Welcome back, {driver.name.split(' ')[0]}</p>
         </div>
         <nav className="px-4 space-y-2">
            <button 
              onClick={() => setActiveTab('requests')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'requests' ? 'bg-brand-blue/10 text-brand-blue' : 'text-gray-600 hover:bg-gray-50'}`}
            >
               <Bell size={18} /> Ride Requests
               <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">2</span>
            </button>
            <button 
              onClick={() => setActiveTab('earnings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'earnings' ? 'bg-brand-blue/10 text-brand-blue' : 'text-gray-600 hover:bg-gray-50'}`}
            >
               <DollarSign size={18} /> Earnings
            </button>
             <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-brand-blue/10 text-brand-blue' : 'text-gray-600 hover:bg-gray-50'}`}
            >
               <User size={18} /> Profile
            </button>
         </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
         
         {/* Top Stats */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
               <div className="text-gray-500 text-sm mb-1">Today's Earnings</div>
               <div className="text-3xl font-bold text-gray-900">{formatPrice(driver.earnings.today)}</div>
               <div className="text-green-500 text-xs mt-2">+12% from yesterday</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
               <div className="text-gray-500 text-sm mb-1">Completed Rides</div>
               <div className="text-3xl font-bold text-gray-900">{driver.totalRides}</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
               <div className="text-gray-500 text-sm mb-1">Driver Rating</div>
               <div className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                 {driver.rating} <span className="text-yellow-400 text-xl">★</span>
               </div>
            </div>
         </div>

         {activeTab === 'requests' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-bold text-lg">Incoming Requests</h3>
                  <div className="flex items-center gap-2 text-sm">
                     <span className="w-2 h-2 rounded-full bg-green-500"></span> Online
                  </div>
               </div>
               <div>
                  {MOCK_RIDES.filter(r => r.status === 'Pending').map(ride => (
                     <div key={ride.id} className="p-6 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-center mb-4">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold">
                                 {ride.passengers}
                              </div>
                              <div>
                                 <div className="font-bold text-gray-900">{formatPrice(ride.price)} <span className="text-xs font-normal text-gray-500">(Est. Fare)</span></div>
                                 <div className="text-xs text-gray-500">{ride.date}</div>
                              </div>
                           </div>
                           <div className="text-right">
                              <div className="text-xs text-gray-400 mb-1">Commission (10%)</div>
                              <div className="text-sm font-bold text-red-500">-{formatPrice(ride.price * 0.1)}</div>
                           </div>
                        </div>
                        
                        <div className="flex gap-8 mb-6 relative">
                           {/* Connecting Line */}
                           <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gray-200"></div>
                           
                           <div className="space-y-4 w-full">
                              <div className="flex items-start gap-4">
                                 <div className="w-4 h-4 rounded-full border-2 border-brand-green bg-white z-10"></div>
                                 <div>
                                    <div className="text-xs text-gray-400">PICKUP</div>
                                    <div className="font-medium text-gray-800">{ride.from}</div>
                                 </div>
                              </div>
                              <div className="flex items-start gap-4">
                                 <div className="w-4 h-4 rounded-full border-2 border-brand-orange bg-white z-10"></div>
                                 <div>
                                    <div className="text-xs text-gray-400">DROP OFF</div>
                                    <div className="font-medium text-gray-800">{ride.to}</div>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="flex gap-3">
                           <button className="flex-1 bg-brand-green text-white py-3 rounded-lg font-bold hover:bg-green-600 transition-colors flex justify-center items-center gap-2">
                              <Check size={18}/> Accept Ride
                           </button>
                           <button className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors flex justify-center items-center gap-2">
                              <X size={18}/> Decline
                           </button>
                        </div>
                     </div>
                  ))}
                  {MOCK_RIDES.filter(r => r.status === 'Pending').length === 0 && (
                     <div className="p-10 text-center text-gray-500">
                        No pending requests at the moment.
                     </div>
                  )}
               </div>
            </div>
         )}
         
         {activeTab === 'earnings' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
               <h3 className="font-bold text-lg mb-4">Payout Wallet</h3>
               <div className="text-4xl font-bold text-gray-900 mb-2">{formatPrice(driver.earnings.total - driver.earnings.commissionPaid)}</div>
               <p className="text-gray-400 text-sm mb-6">Available for withdrawal</p>
               <button className="bg-brand-blue text-white px-8 py-3 rounded-full font-bold hover:bg-sky-600">
                  Request Payout
               </button>
            </div>
         )}

      </div>
    </div>
  );
};

export default DriverDashboard;
