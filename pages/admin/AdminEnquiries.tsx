
import React, { useState } from 'react';
import { Filter, Download, CheckCircle, XCircle, Clock, Package, Car, Sparkles, MessageSquare, LayoutGrid } from 'lucide-react';
import { useGlobal } from '../../GlobalContext';
import { useCurrency } from '../../CurrencyContext';

const AdminEnquiries: React.FC = () => {
  const { bookings, updateBookingStatus } = useGlobal();
  const { formatPrice } = useCurrency();
  const [activeTab, setActiveTab] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const tabs = [
    { id: 'All', label: 'All Enquiries', icon: LayoutGrid },
    { id: 'Package', label: 'Packages', icon: Package },
    { id: 'Taxi', label: 'Taxi Bookings', icon: Car },
    { id: 'AI Plan', label: 'AI Plans', icon: Sparkles },
    { id: 'General', label: 'General', icon: MessageSquare },
  ];

  const filteredBookings = bookings.filter(b => {
      const matchType = activeTab === 'All' || b.type === activeTab;
      const matchStatus = filterStatus === 'All' || b.status === filterStatus;
      return matchType && matchStatus;
  });

  const exportToCSV = () => {
    if(bookings.length === 0) return;
    const headers = ["Ref ID", "Date", "Customer", "Phone", "Email", "Type", "Item", "Status", "Amount"];
    const csvRows = bookings.map(b => [
        b.id, new Date(b.date).toLocaleDateString(), `"${b.customerName}"`, b.customerPhone, b.customerEmail, b.type, `"${b.itemName}"`, b.status, b.totalAmount
    ]);
    const csvContent = [headers.join(','), ...csvRows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `enquiries_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Enquiries & Bookings</h1>
        <button onClick={exportToCSV} className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
          <Download size={16}/> Export CSV
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-1">
        {tabs.map(tab => (
            <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-all ${
                    activeTab === tab.id 
                    ? 'border-brand-blue text-brand-blue bg-blue-50/50 rounded-t-lg' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-t-lg'
                }`}
            >
                <tab.icon size={16} />
                {tab.label}
                <span className={`ml-1 text-xs px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                    {tab.id === 'All' ? bookings.length : bookings.filter(b => b.type === tab.id).length}
                </span>
            </button>
        ))}
      </div>

      {/* Status Filter */}
      <div className="flex justify-end">
        <div className="bg-white px-3 py-2 rounded-lg border border-gray-200 flex items-center gap-2 shadow-sm">
           <div className={`w-2 h-2 rounded-full ${filterStatus === 'All' ? 'bg-gray-400' : filterStatus === 'Confirmed' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
           <select 
             value={filterStatus} 
             onChange={(e) => setFilterStatus(e.target.value)}
             className="bg-transparent outline-none text-sm font-medium cursor-pointer"
           >
             <option value="All">All Status</option>
             <option value="Confirmed">Confirmed</option>
             <option value="Pending">Pending</option>
             <option value="Cancelled">Cancelled</option>
             <option value="Resolved">Resolved</option>
           </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">ID & Date</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Customer</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Details</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Amount</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredBookings.map(booking => (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="font-mono text-xs font-bold text-gray-900">{booking.id}</div>
                    <div className="text-xs text-gray-500">{new Date(booking.date).toLocaleDateString()}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-sm text-gray-900">{booking.customerName}</div>
                    <div className="text-xs text-gray-500">{booking.customerPhone}</div>
                    <div className="text-xs text-gray-400 truncate max-w-[150px]">{booking.customerEmail}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-800 font-medium line-clamp-1" title={booking.itemName}>{booking.itemName}</div>
                    <div className="text-xs text-gray-500">
                        {booking.travelers} Travelers
                        {booking.travelDate && ` • ${booking.travelDate}`}
                    </div>
                    {booking.message && (
                        <div className="mt-1 text-xs text-gray-500 italic bg-gray-50 p-1 rounded border border-gray-100 line-clamp-1" title={booking.message}>
                            "{booking.message}"
                        </div>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                      booking.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                      booking.status === 'Resolved' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {booking.status === 'Confirmed' ? <CheckCircle size={10}/> : booking.status === 'Pending' ? <Clock size={10}/> : <XCircle size={10}/>}
                      {booking.status}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-gray-900">
                    {formatPrice(booking.totalAmount)}
                  </td>
                  <td className="p-4 text-right">
                    {/* Only show actions if not already in that state */}
                    <div className="flex justify-end gap-2">
                        {booking.status !== 'Confirmed' && (booking.type === 'Package' || booking.type === 'Taxi') && (
                            <button onClick={() => updateBookingStatus(booking.id, 'Confirmed')} className="p-1.5 text-green-600 hover:bg-green-50 rounded border border-gray-200 shadow-sm" title="Confirm Booking"><CheckCircle size={16}/></button>
                        )}
                        {booking.status === 'Pending' && (booking.type === 'General' || booking.type === 'AI Plan') && (
                            <button onClick={() => updateBookingStatus(booking.id, 'Resolved')} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded border border-gray-200 shadow-sm" title="Mark Resolved"><CheckCircle size={16}/></button>
                        )}
                        {booking.status !== 'Cancelled' && (
                            <button onClick={() => updateBookingStatus(booking.id, 'Cancelled')} className="p-1.5 text-red-500 hover:bg-red-50 rounded border border-gray-200 shadow-sm" title="Cancel"><XCircle size={16}/></button>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">No records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminEnquiries;
