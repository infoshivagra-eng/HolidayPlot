import React, { useState } from 'react';
import { Car, CheckCircle, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../CurrencyContext';
import { useGlobal } from '../GlobalContext';

const Taxi: React.FC = () => {
  const { formatPrice } = useCurrency();
  const { drivers, addDriver } = useGlobal(); // Use global drivers and addDriver function
  const [activeTab, setActiveTab] = useState<'book' | 'driver'>('book');
  const [searchResult, setSearchResult] = useState<boolean>(false);
  const navigate = useNavigate();

  // Driver Registration State
  const [driverForm, setDriverForm] = useState({
     firstName: '',
     lastName: '',
     phone: '',
     email: '',
     vehicleType: 'Sedan',
     model: '',
     plate: ''
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchResult(true);
  };

  const handleBookDriver = (driverId: string) => {
    const driver = drivers.find(d => d.id === driverId);
    if(driver) {
       navigate('/booking', { state: { type: 'Taxi', item: driver } });
    }
  };

  const handleRegisterDriver = (e: React.FormEvent) => {
     e.preventDefault();
     const newDriver: any = {
        id: `d${Date.now()}`,
        name: `${driverForm.firstName} ${driverForm.lastName}`,
        phone: driverForm.phone,
        email: driverForm.email,
        photo: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
        rating: 5.0,
        totalRides: 0,
        status: 'Available',
        vehicle: {
           type: driverForm.vehicleType,
           model: driverForm.model,
           plateNumber: driverForm.plate,
           capacity: 4,
           ac: true,
           image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        rates: { perKm: 0.25, baseFare: 10 },
        earnings: { today: 0, total: 0, commissionPaid: 0 }
     };

     addDriver(newDriver);
     navigate('/driver-dashboard');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-brand-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">HolidayPot Transport</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">Book a reliable ride across India or join our fleet.</p>
          
          <div className="flex justify-center mt-8 gap-4">
            <button 
              onClick={() => {setActiveTab('book'); setSearchResult(false);}}
              className={`px-8 py-3 rounded-full font-bold transition-all ${activeTab === 'book' ? 'bg-brand-orange text-white shadow-lg scale-105' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            >
              Book a Ride
            </button>
            <button 
              onClick={() => setActiveTab('driver')}
              className={`px-8 py-3 rounded-full font-bold transition-all ${activeTab === 'driver' ? 'bg-brand-blue text-white shadow-lg scale-105' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            >
              Become a Driver
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 -mt-8 relative z-10">
        
        {/* CUSTOMER BOOKING FLOW */}
        {activeTab === 'book' && (
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
               <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <label className="block text-xs text-gray-500 mb-1">Pickup</label>
                  <input type="text" placeholder="e.g. Mumbai Airport" className="w-full bg-transparent outline-none text-sm text-gray-900 placeholder-gray-400"/>
               </div>
               <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <label className="block text-xs text-gray-500 mb-1">Dropoff</label>
                  <input type="text" placeholder="e.g. Pune City" className="w-full bg-transparent outline-none text-sm text-gray-900 placeholder-gray-400"/>
               </div>
               <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <label className="block text-xs text-gray-500 mb-1">Date & Time</label>
                  <input type="datetime-local" className="w-full bg-transparent outline-none text-sm text-gray-900"/>
               </div>
               <button type="submit" className="bg-brand-orange text-white font-bold rounded-xl hover:bg-orange-600 transition-colors h-full min-h-[50px]">
                 Search Taxis
               </button>
            </form>

            {searchResult && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="font-bold text-gray-800 mb-4">Available Drivers</h3>
                {drivers.filter(d => d.status === 'Available').map((driver) => (
                  <div key={driver.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow flex flex-col md:flex-row items-center gap-6">
                    <img src={driver.vehicle.image} alt={driver.vehicle.model} className="w-32 h-24 object-cover rounded-lg" />
                    
                    <div className="flex-grow text-center md:text-left">
                       <h4 className="font-bold text-lg text-gray-900">{driver.vehicle.model} <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded ml-2">{driver.vehicle.type}</span></h4>
                       <div className="text-sm text-gray-500 mb-1">Driver: {driver.name} ⭐ {driver.rating}</div>
                       <div className="flex items-center justify-center md:justify-start gap-4 text-xs text-gray-400">
                          <span className="flex items-center gap-1"><Car size={12}/> AC Available</span>
                          <span className="flex items-center gap-1"><CheckCircle size={12}/> {driver.totalRides} rides</span>
                       </div>
                    </div>

                    <div className="text-right">
                       <div className="text-2xl font-bold text-brand-blue">{formatPrice(driver.rates.baseFare + 25)}</div>
                       <div className="text-xs text-gray-400 mb-3">Est. total fare</div>
                       <button 
                        onClick={() => handleBookDriver(driver.id)}
                        className="bg-gray-900 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-brand-blue transition-colors"
                       >
                         Book Now
                       </button>
                    </div>
                  </div>
                ))}
                {drivers.filter(d => d.status === 'Available').length === 0 && (
                   <div className="text-center py-8 text-gray-500">No drivers available right now.</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* DRIVER REGISTRATION FLOW */}
        {activeTab === 'driver' && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
             <div className="grid md:grid-cols-2">
                <div className="p-8">
                   <h2 className="text-2xl font-bold text-gray-900 mb-6">Register as a Driver</h2>
                   <form className="space-y-4" onSubmit={handleRegisterDriver}>
                      <div className="grid grid-cols-2 gap-4">
                        <input required type="text" placeholder="First Name" value={driverForm.firstName} onChange={e => setDriverForm({...driverForm, firstName: e.target.value})} className="w-full p-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-lg outline-none focus:border-brand-blue placeholder-gray-400"/>
                        <input required type="text" placeholder="Last Name" value={driverForm.lastName} onChange={e => setDriverForm({...driverForm, lastName: e.target.value})} className="w-full p-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-lg outline-none focus:border-brand-blue placeholder-gray-400"/>
                      </div>
                      <input required type="tel" placeholder="Phone Number" value={driverForm.phone} onChange={e => setDriverForm({...driverForm, phone: e.target.value})} className="w-full p-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-lg outline-none focus:border-brand-blue placeholder-gray-400"/>
                      <input required type="email" placeholder="Email Address" value={driverForm.email} onChange={e => setDriverForm({...driverForm, email: e.target.value})} className="w-full p-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-lg outline-none focus:border-brand-blue placeholder-gray-400"/>
                      
                      <div className="pt-4 border-t border-gray-100">
                         <h3 className="font-semibold text-gray-700 mb-3">Vehicle Details</h3>
                         <div className="grid grid-cols-2 gap-4 mb-4">
                            <select value={driverForm.vehicleType} onChange={e => setDriverForm({...driverForm, vehicleType: e.target.value})} className="w-full p-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-lg outline-none">
                              <option>Sedan</option>
                              <option>SUV</option>
                              <option>Tempo Traveller</option>
                            </select>
                            <input required type="text" placeholder="Model (e.g. Innova)" value={driverForm.model} onChange={e => setDriverForm({...driverForm, model: e.target.value})} className="w-full p-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-lg outline-none placeholder-gray-400"/>
                         </div>
                         <input required type="text" placeholder="License Plate Number" value={driverForm.plate} onChange={e => setDriverForm({...driverForm, plate: e.target.value})} className="w-full p-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-lg outline-none mb-4 placeholder-gray-400"/>
                      </div>

                      <div className="pt-4 border-t border-gray-100">
                         <h3 className="font-semibold text-gray-700 mb-3">Documents</h3>
                         <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 cursor-pointer">
                            <Upload className="mx-auto text-gray-400 mb-2"/>
                            <p className="text-sm text-gray-500">Upload Driving License & Vehicle RC</p>
                         </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-500 pt-2">
                        <input type="checkbox" id="terms" required className="rounded text-brand-blue"/>
                        <label htmlFor="terms">I agree to the Terms & Conditions</label>
                      </div>

                      <button type="submit" className="w-full bg-brand-green hover:bg-green-600 text-white font-bold py-4 rounded-xl shadow-md transition-all">
                        Submit Application
                      </button>
                      <p className="text-xs text-center text-gray-400 mt-2">Click submit to register and see dashboard.</p>
                   </form>
                </div>
                <div className="bg-gray-50 p-8 hidden md:flex flex-col justify-center">
                   <h3 className="text-xl font-bold mb-4">Why drive with HolidayPot?</h3>
                   <ul className="space-y-4 text-gray-600">
                      <li className="flex items-start gap-3">
                         <div className="w-8 h-8 rounded-full bg-blue-100 text-brand-blue flex items-center justify-center flex-shrink-0 font-bold">1</div>
                         <p><span className="font-bold text-gray-900">Low Commission</span> <br/> We charge only 10% per ride.</p>
                      </li>
                      <li className="flex items-start gap-3">
                         <div className="w-8 h-8 rounded-full bg-green-100 text-brand-green flex items-center justify-center flex-shrink-0 font-bold">2</div>
                         <p><span className="font-bold text-gray-900">Flexible Hours</span> <br/> Work whenever you want.</p>
                      </li>
                      <li className="flex items-start gap-3">
                         <div className="w-8 h-8 rounded-full bg-orange-100 text-brand-orange flex items-center justify-center flex-shrink-0 font-bold">3</div>
                         <p><span className="font-bold text-gray-900">Daily Payouts</span> <br/> Get earnings deposited daily.</p>
                      </li>
                   </ul>
                </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Taxi;