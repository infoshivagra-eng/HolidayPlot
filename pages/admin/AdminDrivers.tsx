
import React, { useState } from 'react';
import { Trash2, Phone, Star, Plus, Edit, X, Save, Car, CreditCard } from 'lucide-react';
import { useGlobal } from '../../GlobalContext';
import { Driver, Vehicle } from '../../types';
import { useCurrency } from '../../CurrencyContext';

const AdminDrivers: React.FC = () => {
  const { drivers, updateDriverStatus, deleteDriver, addDriver } = useGlobal();
  const { formatPrice } = useCurrency();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    photo: '',
    rating: '5.0',
    totalRides: '0',
    status: 'Available' as Driver['status'],
    // Vehicle
    vType: 'Sedan',
    vModel: '',
    vPlate: '',
    vCapacity: '4',
    vAc: true,
    vImage: '',
    // Rates
    ratePerKm: '0.25',
    baseFare: '10'
  });

  const resetForm = () => {
    setFormData({
      name: '', phone: '', email: '', photo: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200', rating: '5.0', totalRides: '0', status: 'Available',
      vType: 'Sedan', vModel: '', vPlate: '', vCapacity: '4', vAc: true, vImage: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500',
      ratePerKm: '0.25', baseFare: '10'
    });
    setEditingId(null);
  };

  const handleEditClick = (driver: Driver) => {
    setEditingId(driver.id);
    setFormData({
      name: driver.name,
      phone: driver.phone,
      email: driver.email,
      photo: driver.photo,
      rating: driver.rating.toString(),
      totalRides: driver.totalRides.toString(),
      status: driver.status,
      vType: driver.vehicle.type,
      vModel: driver.vehicle.model,
      vPlate: driver.vehicle.plateNumber,
      vCapacity: driver.vehicle.capacity.toString(),
      vAc: driver.vehicle.ac,
      vImage: driver.vehicle.image,
      ratePerKm: driver.rates.perKm.toString(),
      baseFare: driver.rates.baseFare.toString()
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const driver: Driver = {
      id: editingId || `d${Date.now()}`,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      photo: formData.photo,
      rating: parseFloat(formData.rating),
      totalRides: parseInt(formData.totalRides),
      status: formData.status,
      vehicle: {
        type: formData.vType as any,
        model: formData.vModel,
        plateNumber: formData.vPlate,
        capacity: parseInt(formData.vCapacity),
        ac: formData.vAc,
        image: formData.vImage
      },
      rates: {
        perKm: parseFloat(formData.ratePerKm),
        baseFare: parseFloat(formData.baseFare)
      },
      earnings: { today: 0, total: 0, commissionPaid: 0 } // Reset for simplicity in this demo editor
    };

    if (editingId) {
      // In a real app we would update, here we just delete old and add new to simulate update
      deleteDriver(editingId);
      addDriver(driver);
    } else {
      addDriver(driver);
    }
    setIsModalOpen(false);
    resetForm();
  };

  const inputClass = "w-full p-3 bg-white text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-blue placeholder-gray-500";

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Fleet Management</h1>
        <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="bg-brand-blue text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-sky-600 transition-colors shadow-lg">
          <Plus size={20} /> Add Driver
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drivers.map(driver => (
          <div key={driver.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
            <div className="p-6 flex-grow">
              <div className="flex items-center gap-4 mb-4">
                <img src={driver.photo} alt={driver.name} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"/>
                <div>
                  <h3 className="font-bold text-gray-900">{driver.name}</h3>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Phone size={12}/> {driver.phone}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
                 <div className="text-center">
                    <div className="text-xs text-gray-400 uppercase">Rating</div>
                    <div className="font-bold text-gray-900 flex items-center gap-1 justify-center"><Star size={12} className="fill-yellow-400 text-yellow-400"/> {driver.rating}</div>
                 </div>
                 <div className="w-px h-8 bg-gray-200"></div>
                 <div className="text-center">
                    <div className="text-xs text-gray-400 uppercase">Vehicle</div>
                    <div className="font-bold text-gray-900 text-sm">{driver.vehicle.model}</div>
                 </div>
              </div>
              
              <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded border border-blue-100 text-center">
                 Plate: <span className="font-mono font-bold text-blue-700">{driver.vehicle.plateNumber}</span>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
               <div className="flex gap-2">
                  <button onClick={() => handleEditClick(driver)} className="p-2 text-gray-600 hover:text-brand-blue hover:bg-white rounded-lg transition-colors">
                    <Edit size={18}/>
                  </button>
                  <button 
                    onClick={() => { if(window.confirm('Delete driver?')) deleteDriver(driver.id); }}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
                  >
                    <Trash2 size={18}/>
                  </button>
               </div>
               
               <select 
                 value={driver.status} 
                 onChange={(e) => updateDriverStatus(driver.id, e.target.value as any)}
                 className={`text-xs font-bold px-3 py-1.5 rounded-full border-none outline-none cursor-pointer ${
                    driver.status === 'Available' ? 'bg-green-100 text-green-700' : 
                    driver.status === 'Busy' ? 'bg-orange-100 text-orange-700' : 'bg-gray-200 text-gray-600'
                 }`}
               >
                 <option value="Available">Available</option>
                 <option value="Busy">Busy</option>
                 <option value="Offline">Offline</option>
               </select>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl h-[90vh] overflow-y-auto shadow-2xl">
             <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
                <h2 className="text-xl font-bold text-gray-900">{editingId ? 'Edit Driver & Vehicle' : 'Add New Driver'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700"><X size={24}/></button>
             </div>
             
             <div className="p-8">
                <form onSubmit={handleSave} className="space-y-8">
                   
                   {/* Driver Details */}
                   <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-blue-100 text-brand-blue flex items-center justify-center text-sm font-bold">1</div> Driver Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                         <input required type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={inputClass}/>
                         <input required type="text" placeholder="Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className={inputClass}/>
                         <input required type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={inputClass}/>
                         <input type="text" placeholder="Photo URL" value={formData.photo} onChange={e => setFormData({...formData, photo: e.target.value})} className={inputClass}/>
                      </div>
                   </div>

                   {/* Vehicle Details */}
                   <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-orange-100 text-brand-orange flex items-center justify-center text-sm font-bold">2</div> Vehicle Details</h3>
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type</label>
                            <select value={formData.vType} onChange={e => setFormData({...formData, vType: e.target.value})} className={inputClass}>
                               <option>Sedan</option><option>SUV</option><option>Van</option><option>Tempo</option>
                            </select>
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Model</label>
                            <input required type="text" placeholder="e.g. Innova Crysta" value={formData.vModel} onChange={e => setFormData({...formData, vModel: e.target.value})} className={inputClass}/>
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Plate Number</label>
                            <input required type="text" placeholder="MH-01-AB-1234" value={formData.vPlate} onChange={e => setFormData({...formData, vPlate: e.target.value})} className={inputClass}/>
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Capacity</label>
                            <input type="number" value={formData.vCapacity} onChange={e => setFormData({...formData, vCapacity: e.target.value})} className={inputClass}/>
                         </div>
                         <div className="col-span-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Car Image URL</label>
                            <input type="text" value={formData.vImage} onChange={e => setFormData({...formData, vImage: e.target.value})} className={inputClass}/>
                         </div>
                         <div className="flex items-center gap-2 mt-2">
                            <input type="checkbox" checked={formData.vAc} onChange={e => setFormData({...formData, vAc: e.target.checked})} className="w-5 h-5 accent-brand-blue"/>
                            <label className="text-gray-700">AC Available</label>
                         </div>
                      </div>
                   </div>

                   {/* Rates */}
                   <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold">3</div> Pricing</h3>
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Rate per KM (USD)</label>
                            <input type="number" step="0.01" value={formData.ratePerKm} onChange={e => setFormData({...formData, ratePerKm: e.target.value})} className={inputClass}/>
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Base Fare (USD)</label>
                            <input type="number" step="1" value={formData.baseFare} onChange={e => setFormData({...formData, baseFare: e.target.value})} className={inputClass}/>
                         </div>
                      </div>
                   </div>

                   <button type="submit" className="w-full bg-brand-blue text-white font-bold py-4 rounded-xl hover:bg-sky-600 transition-colors shadow-lg flex items-center justify-center gap-2">
                      <Save size={20}/> Save Driver & Vehicle
                   </button>
                </form>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDrivers;
