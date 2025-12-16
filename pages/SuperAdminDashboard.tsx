import React, { useState, useEffect } from 'react';
import { LayoutDashboard, CreditCard, ScrollText, LogOut, Megaphone, Globe, CheckCircle, Plus, Download, Database, Settings as SettingsIcon, Key } from 'lucide-react';
import { masterSupabase } from '../lib/saasHelper';
import { Tenant, SaaSPlan, SaaSInvoice, SaaSAnnouncement } from '../types';
import SupabaseSchemaViewer from '../supabase_schema';

// Icons defined locally or imported
const Building2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>;
const Tag = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l5 5a2 2 0 0 0 2.828 0l7.172-7.172a2 2 0 0 0 0-2.828l-5-5z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></svg>;
const ArrowUp = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>;

interface SuperAdminDashboardProps {
    onLogout: () => void;
}

const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ onLogout }) => {
  const [superTab, setSuperTab] = useState('overview');
  
  // Data States
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [plans, setPlans] = useState<SaaSPlan[]>([
    { id: 'basic', name: 'Starter Agency', price: 29, features: ['Unlimited Packages', 'Booking Engine', 'Standard Support'] },
    { id: 'pro', name: 'Growth', price: 79, features: ['Unlimited Packages', 'Drivers Module', 'Blog Engine', 'Analytics'], isPopular: true },
    { id: 'enterprise', name: 'Agency Elite', price: 199, features: ['Everything in Pro', 'AI Planner', 'White Label', 'Priority Support'] }
  ]);
  const [invoices, setInvoices] = useState<SaaSInvoice[]>([
    { id: 'INV-001', tenantId: 't1', tenantName: 'HolidayPot Official', amount: 199, date: '2024-10-25', status: 'Paid', planName: 'Enterprise' },
    { id: 'INV-002', tenantId: 't2', tenantName: 'TravelVista', amount: 79, date: '2024-10-24', status: 'Paid', planName: 'Growth' },
    { id: 'INV-003', tenantId: 't3', tenantName: 'GoGo Travels', amount: 29, date: '2024-10-20', status: 'Overdue', planName: 'Starter' }
  ]);
  const [announcements, setAnnouncements] = useState<SaaSAnnouncement[]>([]);

  // Tenant Editing
  const [showTenantModal, setShowTenantModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [tenantForm, setTenantForm] = useState<Partial<Tenant>>({ plan_id: 'basic', status: 'active', admin_password: 'admin123' });

  // Master DB Config State
  const [masterDbConfig, setMasterDbConfig] = useState({ url: '', key: '' });

  // Init Data
  useEffect(() => {
      loadTenants();
      // Load master config
      const storedUrl = localStorage.getItem('holidaypot_master_url') || '';
      const storedKey = localStorage.getItem('holidaypot_master_key') || '';
      setMasterDbConfig({ url: storedUrl, key: storedKey });

      // Load Announcements (Simulate DB)
      const storedAnnouncements = localStorage.getItem('holidaypot_announcements');
      if (storedAnnouncements) {
          setAnnouncements(JSON.parse(storedAnnouncements));
      } else {
          const defaults: SaaSAnnouncement[] = [{ id: 'a1', title: 'System Maintenance Scheduled', content: 'We will be upgrading servers on Sunday.', date: '2024-10-26', status: 'Published' }];
          setAnnouncements(defaults);
          localStorage.setItem('holidaypot_announcements', JSON.stringify(defaults));
      }
  }, []);

  const loadTenants = async () => {
      const { data, error } = await masterSupabase.from('tenants').select('*');
      
      if (data && data.length > 0) {
          setTenants(data);
      } else {
          // If DB is empty or fails, load from LocalStorage (Demo Persistence)
          const localTenants = localStorage.getItem('holidaypot_mock_tenants');
          if (localTenants) {
              setTenants(JSON.parse(localTenants));
          } else {
              // Default Mocks
              const mocks: Tenant[] = [
                  { id: 't1', business_name: 'HolidayPot Official', admin_email: 'admin@holidaypot.in', admin_password: 'admin123', status: 'active', plan_id: 'enterprise', db_url: 'https://demo.supabase.co' },
                  { id: 't2', business_name: 'TravelVista', admin_email: 'info@travelvista.com', admin_password: 'admin123', status: 'active', plan_id: 'pro' },
                  { id: 't3', business_name: 'GoGo Travels', admin_email: 'hello@gogo.com', admin_password: 'admin123', status: 'suspended', plan_id: 'basic' }
              ];
              setTenants(mocks);
              localStorage.setItem('holidaypot_mock_tenants', JSON.stringify(mocks));
          }
      }
  };

  const handleSaveTenant = async (e: React.FormEvent) => {
      e.preventDefault();
      
      // Try Master DB Update
      const { error } = await masterSupabase.from('tenants').upsert([tenantForm]);
      
      // Fallback/Demo Mode Logic
      if (error || !masterDbConfig.url) {
          console.log("Demo Mode: Saving Tenant Locally");
          
          const newTenant = { 
              ...tenantForm, 
              id: tenantForm.id || `t_${Date.now()}`,
              admin_password: tenantForm.admin_password || 'admin123'
          } as Tenant;

          let updatedList: Tenant[] = [];
          setTenants(prev => {
              const existingIndex = prev.findIndex(t => t.id === newTenant.id);
              if (existingIndex >= 0) {
                  updatedList = [...prev];
                  updatedList[existingIndex] = newTenant;
              } else {
                  updatedList = [...prev, newTenant];
              }
              // CRITICAL: Save to localStorage so Login screen can find it
              localStorage.setItem('holidaypot_mock_tenants', JSON.stringify(updatedList));
              return updatedList;
          });
          
          alert('Tenant saved successfully (Local Mode)!');
      } else {
          alert('Tenant updated in Master DB!');
          loadTenants();
      }
      setShowTenantModal(false);
      setShowSettingsModal(false);
  };

  const handleSaveMasterDb = (e: React.FormEvent) => {
      e.preventDefault();
      localStorage.setItem('holidaypot_master_url', masterDbConfig.url);
      localStorage.setItem('holidaypot_master_key', masterDbConfig.key);
      alert('Master Database credentials updated. Reloading...');
      window.location.reload();
  };

  const handleAddAnnouncement = () => {
      const title = prompt("Enter announcement title:");
      if (!title) return;
      const content = prompt("Enter announcement content:");
      if (!content) return;

      const newAnn = {
          id: `a_${Date.now()}`,
          title,
          content,
          date: new Date().toISOString().split('T')[0],
          status: 'Published'
      } as SaaSAnnouncement;

      const updated = [newAnn, ...announcements];
      setAnnouncements(updated);
      localStorage.setItem('holidaypot_announcements', JSON.stringify(updated));
  };

  const handleLogoutClick = () => {
      onLogout();
  };

  const superNavItems = [
      { id: 'overview', label: 'Platform Overview', icon: LayoutDashboard },
      { id: 'agencies', label: 'Agency Control', icon: Building2 },
      { id: 'database', label: 'Database Manager', icon: Database },
      { id: 'plans', label: 'Price Plans', icon: Tag },
      { id: 'billing', label: 'Billing & Subscriptions', icon: CreditCard },
      { id: 'content', label: 'SaaS Content', icon: Globe },
      { id: 'logs', label: 'Announcements & Logs', icon: ScrollText },
  ];

  return (
      <div className="min-h-screen bg-slate-50 flex">
          {/* Super Admin Sidebar */}
          <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-50 shadow-2xl">
              <div className="p-6 pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center font-bold">S</div>
                      <span className="font-bold text-xl tracking-tight">SaaS Master</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">Super Admin Console</p>
                  
                  {/* Logout Button (Moved Top) */}
                  <button 
                    onClick={handleLogoutClick} 
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-900/20 text-red-300 hover:bg-red-900/40 hover:text-white rounded-lg text-sm font-bold transition-all border border-red-900/30 shadow-inner mb-2"
                  >
                      <LogOut size={16}/> Sign Out
                  </button>
              </div>
              <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                  {superNavItems.map(item => (
                      <button 
                        key={item.id}
                        onClick={() => setSuperTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${superTab === item.id ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                      >
                          <item.icon size={18}/> {item.label}
                      </button>
                  ))}
              </nav>
          </aside>

          {/* Super Admin Content */}
          <main className="flex-1 ml-64 p-8">
              {superTab === 'overview' && (
                  <div className="space-y-8 animate-fade-in">
                      <h1 className="text-3xl font-bold text-slate-900">Platform Overview</h1>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                              <div className="text-slate-500 text-sm mb-1">Total MRR</div>
                              <div className="text-3xl font-bold text-slate-900">$12,450</div>
                              <div className="text-green-500 text-xs mt-2 flex items-center gap-1"><ArrowUp size={12}/> +15% vs last month</div>
                          </div>
                          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                              <div className="text-slate-500 text-sm mb-1">Active Tenants</div>
                              <div className="text-3xl font-bold text-slate-900">{tenants.length}</div>
                              <div className="text-blue-500 text-xs mt-2">3 new this week</div>
                          </div>
                          {/* ... other stats ... */}
                      </div>
                  </div>
              )}

              {superTab === 'database' && (
                  <div className="animate-fade-in space-y-6">
                      {/* Master DB Configuration Form */}
                      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                          <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                              <Database size={20} className="text-purple-600"/> Master Connection
                          </h2>
                          <p className="text-sm text-gray-500 mb-4">
                              Configure the primary database used to store Tenant and Subscription data.
                          </p>
                          <form onSubmit={handleSaveMasterDb} className="flex flex-col md:flex-row gap-4 items-end">
                              <div className="flex-1 w-full">
                                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Project URL</label>
                                  <input 
                                    type="text" 
                                    value={masterDbConfig.url} 
                                    onChange={e => setMasterDbConfig({...masterDbConfig, url: e.target.value})} 
                                    className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-600 text-sm"
                                    placeholder="https://..."
                                  />
                              </div>
                              <div className="flex-1 w-full">
                                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Anon Key</label>
                                  <input 
                                    type="password" 
                                    value={masterDbConfig.key} 
                                    onChange={e => setMasterDbConfig({...masterDbConfig, key: e.target.value})} 
                                    className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-600 text-sm"
                                    placeholder="eyJ..."
                                  />
                              </div>
                              <button type="submit" className="bg-purple-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-purple-700 transition-colors h-[38px]">
                                  Update
                              </button>
                          </form>
                      </div>

                      {/* Embed the Schema Viewer here */}
                      <div className="rounded-xl overflow-hidden shadow-lg border border-gray-800">
                          <SupabaseSchemaViewer embedded={true} />
                      </div>
                  </div>
              )}

              {superTab === 'agencies' && (
                  <div className="space-y-6 animate-fade-in">
                      <div className="flex justify-between items-center">
                          <h1 className="text-3xl font-bold text-slate-900">Agency Control</h1>
                          <button onClick={() => { setTenantForm({ admin_password: 'admin123' }); setShowTenantModal(true); }} className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-purple-700 flex items-center gap-2"><Plus size={18}/> Add Tenant</button>
                      </div>
                      
                      {/* Password Info Banner */}
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                          <div className="flex items-center gap-2">
                              <Key size={18} className="text-blue-600"/>
                              <p className="text-sm text-blue-900">
                                  <strong>System Default:</strong> The default password for all new agencies is <span className="font-mono bg-blue-200 px-1 rounded text-blue-800 font-bold">admin123</span>. You can change this in the Edit settings.
                              </p>
                          </div>
                      </div>

                      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                          <table className="w-full text-left">
                              <thead className="bg-slate-50 border-b border-slate-200">
                                  <tr>
                                      <th className="p-4 text-xs font-bold text-slate-500 uppercase">Business Name</th>
                                      <th className="p-4 text-xs font-bold text-slate-500 uppercase">Admin Email</th>
                                      <th className="p-4 text-xs font-bold text-slate-500 uppercase">Plan</th>
                                      <th className="p-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                                      <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                  {tenants.map(t => (
                                      <tr key={t.id} className="hover:bg-slate-50">
                                          <td className="p-4 font-bold text-slate-900">{t.business_name}</td>
                                          <td className="p-4 text-slate-600">{t.admin_email}</td>
                                          <td className="p-4"><span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold uppercase">{t.plan_id}</span></td>
                                          <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-bold ${t.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{t.status}</span></td>
                                          <td className="p-4 text-right">
                                              <div className="flex justify-end gap-2">
                                                  <button onClick={() => { setTenantForm(t); setShowSettingsModal(true); }} className="text-gray-500 hover:text-purple-600 font-medium text-sm flex items-center gap-1"><SettingsIcon size={14}/> Settings</button>
                                                  <button onClick={() => { setTenantForm(t); setShowTenantModal(true); }} className="text-purple-600 hover:underline font-medium text-sm">Edit / Reset Pwd</button>
                                              </div>
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  </div>
              )}

              {/* Plans - READ ONLY MODE */}
              {superTab === 'plans' && (
                  <div className="space-y-6 animate-fade-in">
                      <h1 className="text-3xl font-bold text-slate-900">Subscription Tiers</h1>
                      <p className="text-slate-500">These plans are linked to tenant subscriptions. Modifying core plan structures requires database updates.</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {plans.map(plan => (
                              <div key={plan.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative hover:shadow-md transition-shadow">
                                  {plan.isPopular && <div className="absolute top-4 right-4 bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded-full">POPULAR</div>}
                                  <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                                  <div className="text-xs text-slate-400 font-mono uppercase mt-1 mb-4">ID: {plan.id}</div>
                                  <div className="text-3xl font-bold text-purple-600 mb-6">${plan.price}<span className="text-sm text-slate-400 font-normal">/mo</span></div>
                                  <div className="border-t border-slate-100 pt-4">
                                      <ul className="space-y-3">
                                          {plan.features.map((f, i) => (
                                              <li key={i} className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle size={14} className="text-green-500"/> {f}</li>
                                          ))}
                                      </ul>
                                  </div>
                                  {/* Edit button removed to make it read-only/reference */}
                              </div>
                          ))}
                      </div>
                  </div>
              )}
              
              {superTab === 'billing' && (
                  <div className="space-y-6 animate-fade-in">
                      <h1 className="text-3xl font-bold text-slate-900">Billing & Subscriptions</h1>
                      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                          <table className="w-full text-left">
                              <thead className="bg-slate-50 border-b border-slate-200">
                                  <tr>
                                      <th className="p-4 text-xs font-bold text-slate-500 uppercase">Invoice ID</th>
                                      <th className="p-4 text-xs font-bold text-slate-500 uppercase">Tenant</th>
                                      <th className="p-4 text-xs font-bold text-slate-500 uppercase">Date</th>
                                      <th className="p-4 text-xs font-bold text-slate-500 uppercase">Amount</th>
                                      <th className="p-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                                      <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Download</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                  {invoices.map(inv => (
                                      <tr key={inv.id} className="hover:bg-slate-50">
                                          <td className="p-4 font-mono text-xs font-bold text-slate-500">{inv.id}</td>
                                          <td className="p-4 font-bold text-slate-900">
                                              {inv.tenantName}
                                              <span className="block text-xs text-slate-400 font-normal">{inv.planName} Plan</span>
                                          </td>
                                          <td className="p-4 text-sm text-slate-600">{inv.date}</td>
                                          <td className="p-4 font-bold text-slate-900">${inv.amount}</td>
                                          <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-bold ${inv.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{inv.status}</span></td>
                                          <td className="p-4 text-right">
                                              <button className="text-slate-400 hover:text-purple-600"><Download size={18}/></button>
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  </div>
              )}

              {superTab === 'content' && (
                  <div className="space-y-6 animate-fade-in">
                      <h1 className="text-3xl font-bold text-slate-900">SaaS Landing Page Content</h1>
                      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center">
                          <Globe size={48} className="mx-auto text-slate-300 mb-4"/>
                          <h3 className="text-xl font-bold text-slate-900 mb-2">Manage Public Website</h3>
                          <p className="text-slate-500 mb-6">Edit headlines, features, and testimonials on the main HolidayPot SaaS homepage.</p>
                          <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800">Launch CMS Editor</button>
                      </div>
                  </div>
              )}

              {superTab === 'logs' && (
                  <div className="space-y-6 animate-fade-in">
                      <div className="flex justify-between items-center">
                          <h1 className="text-3xl font-bold text-slate-900">Announcements & Logs</h1>
                          <button onClick={handleAddAnnouncement} className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-purple-200 transition-colors"><Plus size={18}/> New Announcement</button>
                      </div>
                      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Megaphone size={18} className="text-purple-500"/> Active Announcements</h3>
                          <div className="space-y-4">
                              {announcements.map(a => (
                                  <div key={a.id} className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                                      <div className="flex justify-between mb-1">
                                          <span className="font-bold text-purple-900">{a.title}</span>
                                          <span className="text-xs text-purple-600 font-bold bg-white px-2 py-0.5 rounded">{a.status}</span>
                                      </div>
                                      <p className="text-sm text-purple-700 mb-2">{a.content}</p>
                                      <div className="text-xs text-purple-400">Posted on {a.date}</div>
                                  </div>
                              ))}
                              {announcements.length === 0 && <p className="text-slate-400 text-sm italic">No announcements posted.</p>}
                          </div>
                      </div>
                  </div>
              )}

              {/* Modals */}
              {showTenantModal && (
                  <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
                      <div className="bg-white rounded-xl w-full max-w-lg p-8 shadow-2xl">
                          <h2 className="text-xl font-bold mb-6 text-slate-900">Manage Tenant</h2>
                          <form onSubmit={handleSaveTenant} className="space-y-4">
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Business Name</label>
                                  <input className="w-full p-2 border rounded" value={tenantForm.business_name || ''} onChange={e => setTenantForm({...tenantForm, business_name: e.target.value})} required />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Admin Email</label>
                                  <input type="email" className="w-full p-2 border rounded" value={tenantForm.admin_email || ''} onChange={e => setTenantForm({...tenantForm, admin_email: e.target.value})} required />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Admin Password</label>
                                  <input type="text" className="w-full p-2 border rounded font-mono" value={tenantForm.admin_password || ''} onChange={e => setTenantForm({...tenantForm, admin_password: e.target.value})} placeholder="admin123" required />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                  <div>
                                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Plan</label>
                                      <select className="w-full p-2 border rounded" value={tenantForm.plan_id} onChange={e => setTenantForm({...tenantForm, plan_id: e.target.value as any})}>
                                          <option value="basic">Basic</option>
                                          <option value="pro">Pro</option>
                                          <option value="enterprise">Enterprise</option>
                                      </select>
                                  </div>
                                  <div>
                                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Status</label>
                                      <select className="w-full p-2 border rounded" value={tenantForm.status} onChange={e => setTenantForm({...tenantForm, status: e.target.value as any})}>
                                          <option value="active">Active</option>
                                          <option value="suspended">Suspended</option>
                                      </select>
                                  </div>
                              </div>
                              <div className="pt-4 flex gap-3">
                                  <button type="submit" className="flex-1 bg-purple-600 text-white font-bold py-2 rounded-lg hover:bg-purple-700">Save & Apply</button>
                                  <button type="button" onClick={() => setShowTenantModal(false)} className="flex-1 bg-slate-100 text-slate-700 font-bold py-2 rounded-lg">Cancel</button>
                              </div>
                          </form>
                      </div>
                  </div>
              )}

              {/* Settings Modal (Direct Database/Key Access) */}
              {showSettingsModal && (
                  <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
                      <div className="bg-white rounded-xl w-full max-w-lg p-8 shadow-2xl">
                          <h2 className="text-xl font-bold mb-6 text-slate-900 flex items-center gap-2"><SettingsIcon size={20}/> Agency Configuration</h2>
                          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded mb-4 text-xs text-yellow-800">
                              Warning: Changing these values will affect the tenant's connection to their database and AI services.
                          </div>
                          <form onSubmit={handleSaveTenant} className="space-y-4">
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Supabase Project URL</label>
                                  <input className="w-full p-2 border rounded font-mono text-sm" value={tenantForm.db_url || ''} onChange={e => setTenantForm({...tenantForm, db_url: e.target.value})} placeholder="https://..." />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Supabase Anon Key</label>
                                  <input className="w-full p-2 border rounded font-mono text-sm" value={tenantForm.db_key || ''} onChange={e => setTenantForm({...tenantForm, db_key: e.target.value})} placeholder="eyJ..." />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">OpenAI / Gemini Key</label>
                                  <input className="w-full p-2 border rounded font-mono text-sm" value={tenantForm.ai_key || ''} onChange={e => setTenantForm({...tenantForm, ai_key: e.target.value})} placeholder="sk-..." />
                              </div>
                              
                              <div className="pt-4 flex gap-3">
                                  <button type="submit" className="flex-1 bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700">Update Settings</button>
                                  <button type="button" onClick={() => setShowSettingsModal(false)} className="flex-1 bg-slate-100 text-slate-700 font-bold py-2 rounded-lg">Close</button>
                              </div>
                          </form>
                      </div>
                  </div>
              )}
          </main>
      </div>
  );
};

export default SuperAdminDashboard;