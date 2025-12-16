
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Shield, X, Save, CheckCircle, User, Lock } from 'lucide-react';
import { useGlobal } from '../../GlobalContext';
import { Manager, Permission } from '../../types';

const AdminManagers: React.FC = () => {
  const { managers, addManager, updateManager, deleteManager, currentUser } = useGlobal();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Manager>>({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'Manager',
    permissions: [],
    avatar: 'https://ui-avatars.com/api/?background=random'
  });

  const availablePermissions: { id: Permission, label: string }[] = [
    { id: 'manage_packages', label: 'Manage Packages' },
    { id: 'manage_bookings', label: 'Manage Enquiries' },
    { id: 'manage_drivers', label: 'Manage Drivers' },
    { id: 'manage_settings', label: 'System Settings' },
    { id: 'view_analytics', label: 'View Analytics' },
    { id: 'manage_team', label: 'Manage Team (Super)' },
  ];

  const resetForm = () => {
    setFormData({
      name: '', username: '', email: '', password: '', role: 'Manager', permissions: [], avatar: 'https://ui-avatars.com/api/?background=random'
    });
    setEditingId(null);
  };

  const handleEditClick = (manager: Manager) => {
    setEditingId(manager.id);
    setFormData({ ...manager, password: '' }); // Don't show password
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.name) return;

    // Use existing manager data or defaults for new
    const managerData: Manager = {
      id: editingId || `m_${Date.now()}`,
      name: formData.name!,
      username: formData.username!,
      email: formData.email || '',
      role: formData.role as any,
      permissions: formData.permissions || [],
      avatar: formData.avatar || `https://ui-avatars.com/api/?name=${formData.name}`,
      lastLogin: editingId ? managers.find(m => m.id === editingId)?.lastLogin : undefined,
      // If editing and password is blank, keep old. If new, use provided.
      password: formData.password ? formData.password : (editingId ? managers.find(m => m.id === editingId)?.password : '123456')
    };

    if (editingId) {
       updateManager(managerData);
    } else {
       addManager(managerData);
    }
    setIsModalOpen(false);
    resetForm();
  };

  const togglePermission = (perm: Permission) => {
     const current = formData.permissions || [];
     if (current.includes(perm)) {
         setFormData({...formData, permissions: current.filter(p => p !== perm)});
     } else {
         setFormData({...formData, permissions: [...current, perm]});
     }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
           <p className="text-sm text-gray-500">Control access levels and manage sub-admins.</p>
        </div>
        <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="bg-brand-blue text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-sky-600 transition-colors shadow-lg">
          <Plus size={20} /> Add Manager
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {managers.map(manager => (
          <div key={manager.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
             <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                   <div className="flex items-center gap-3">
                      <img src={manager.avatar} alt={manager.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"/>
                      <div>
                         <h3 className="font-bold text-gray-900">{manager.name}</h3>
                         <p className="text-xs text-gray-500">@{manager.username}</p>
                      </div>
                   </div>
                   <span className={`px-2 py-1 rounded-full text-xs font-bold ${manager.role === 'Super Admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-50 text-brand-blue'}`}>
                      {manager.role}
                   </span>
                </div>
                
                <div className="space-y-2 mb-4">
                   <div className="text-xs text-gray-500 flex items-center gap-2">
                      <Lock size={12}/> {manager.permissions.length} Permissions Granted
                   </div>
                   <div className="flex flex-wrap gap-1">
                      {manager.permissions.slice(0, 3).map(p => (
                         <span key={p} className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{p.replace('manage_', '')}</span>
                      ))}
                      {manager.permissions.length > 3 && <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">+{manager.permissions.length - 3} more</span>}
                   </div>
                </div>

                <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                   <div className="text-xs text-gray-400">
                      Last login: {manager.lastLogin ? new Date(manager.lastLogin).toLocaleDateString() : 'Never'}
                   </div>
                   <div className="flex gap-2">
                      <button onClick={() => handleEditClick(manager)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"><Edit size={16}/></button>
                      {manager.id !== currentUser?.id && (
                        <button onClick={() => { if(window.confirm('Delete user?')) deleteManager(manager.id); }} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                      )}
                   </div>
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
           <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                 <h3 className="font-bold text-gray-900">{editingId ? 'Edit User' : 'New User'}</h3>
                 <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-gray-400 hover:text-gray-600"/></button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                       <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-brand-blue"/>
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Username</label>
                       <input required type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-brand-blue"/>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                        <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-brand-blue"/>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password</label>
                        <input type="password" placeholder={editingId ? "Unchanged" : "Required"} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-brand-blue"/>
                    </div>
                 </div>

                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Role</label>
                    <div className="flex gap-4">
                       <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="role" checked={formData.role === 'Manager'} onChange={() => setFormData({...formData, role: 'Manager'})} className="accent-brand-blue"/> Manager
                       </label>
                       <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="role" checked={formData.role === 'Super Admin'} onChange={() => setFormData({...formData, role: 'Super Admin'})} className="accent-brand-blue"/> Super Admin
                       </label>
                    </div>
                 </div>

                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Permissions</label>
                    <div className="grid grid-cols-2 gap-2">
                       {availablePermissions.map(perm => (
                          <div 
                             key={perm.id} 
                             onClick={() => togglePermission(perm.id)}
                             className={`text-sm px-3 py-2 rounded-lg border cursor-pointer flex items-center justify-between ${
                                (formData.permissions?.includes(perm.id) || formData.role === 'Super Admin') 
                                ? 'bg-blue-50 border-brand-blue text-brand-blue' 
                                : 'bg-white border-gray-200 text-gray-500'
                             }`}
                          >
                             {perm.label}
                             {(formData.permissions?.includes(perm.id) || formData.role === 'Super Admin') && <CheckCircle size={14}/>}
                          </div>
                       ))}
                    </div>
                 </div>

                 <button type="submit" className="w-full bg-brand-blue text-white font-bold py-3 rounded-xl hover:bg-sky-600 transition-colors shadow-lg mt-2">
                    Save User
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagers;
