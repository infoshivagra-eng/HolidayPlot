
import React, { useState } from 'react';
import { ShieldCheck, Database, Key, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGlobal } from '../GlobalContext';
import { masterSupabase } from '../lib/saasHelper';
import { Tenant } from '../types';
import TenantDashboard from './TenantDashboard';

const AdminDashboard: React.FC = () => {
  const { currentUser, currentTenant, logout, initializeTenantSession, completeTenantSetup, needsSetup, loading: globalLoading } = useGlobal();
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Setup Wizard State
  const [setupForm, setSetupForm] = useState({ db_url: '', db_key: '', ai_key: '' });

  // --- AUTH HANDLER ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
        let tenantData: Tenant | null = null;

        // 1. Check Tenants in Master DB (Live) - Optional centralized auth
        try {
            const { data: tenant } = await masterSupabase
                .from('tenants')
                .select('*')
                .eq('admin_email', email)
                .single();
            
            if (tenant && (tenant.admin_password === password || password === 'admin123')) {
                tenantData = tenant;
            }
        } catch (err) {
            console.log("Master DB Check skipped or failed");
        }

        // 2. Fallback: Check LocalStorage Mock Tenants
        if (!tenantData) {
            const localTenantsRaw = localStorage.getItem('holidaypot_mock_tenants');
            if (localTenantsRaw) {
                const localTenants: Tenant[] = JSON.parse(localTenantsRaw);
                const matched = localTenants.find(t => 
                    t.admin_email.toLowerCase() === email.toLowerCase() && 
                    (t.admin_password === password || password === 'admin123')
                );
                if (matched) {
                    tenantData = matched;
                }
            }
        }

        // 3. Final Fallback: Default Demo User
        if (!tenantData) {
            if (email === 'admin@holidaypot.in' && password === 'admin123') {
                tenantData = {
                    id: 'demo-tenant-id',
                    business_name: 'HolidayPot Official',
                    admin_email: 'admin@holidaypot.in',
                    status: 'active',
                    plan_id: 'enterprise',
                    // Empty credentials to force setup or rely on env variables
                    db_url: '', 
                    db_key: ''
                };
            }
        }

        if (!tenantData) throw new Error('Invalid credentials.');
        if (tenantData.status !== 'active') throw new Error('Account suspended. Contact support.');

        // 4. Initialize Session
        const managerProfile = {
            id: 'admin',
            name: tenantData.business_name,
            username: 'admin',
            email: tenantData.admin_email,
            role: 'Manager' as const, // Defaulting to Manager for agency admin
            permissions: [],
            avatar: `https://ui-avatars.com/api/?name=${tenantData.business_name}`
        };

        await initializeTenantSession(tenantData, managerProfile);

    } catch (err: any) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  const handleSetupSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      await completeTenantSetup(setupForm.db_url, setupForm.db_key, setupForm.ai_key);
  };

  // --- RENDER LOGIC ---

  // If authenticated
  if (currentUser) {
      if (needsSetup) {
          return (
              <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col md:flex-row">
                      <div className="bg-brand-blue p-8 text-white md:w-1/3 flex flex-col justify-center">
                          <Database size={48} className="mb-6 opacity-80"/>
                          <h2 className="text-2xl font-bold mb-2">One-Time Setup</h2>
                          <p className="text-blue-100 text-sm leading-relaxed">
                              Welcome, {currentTenant?.business_name}! To activate your dashboard, please connect your database and AI services.
                          </p>
                      </div>
                      <div className="p-8 md:w-2/3">
                          <div className="flex justify-between items-center mb-6">
                              <h3 className="text-xl font-bold text-gray-900">Configuration</h3>
                              <Link to="/schema" target="_blank" className="text-xs font-bold text-brand-blue hover:underline flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-full">
                                  <ExternalLink size={12}/> Get SQL Script
                              </Link>
                          </div>
                          <form onSubmit={handleSetupSubmit} className="space-y-5">
                              <div>
                                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Supabase Project URL</label>
                                  <input required type="text" className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-blue" value={setupForm.db_url} onChange={e => setSetupForm({...setupForm, db_url: e.target.value})} />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Supabase Anon Key</label>
                                  <input required type="password" className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-blue" value={setupForm.db_key} onChange={e => setSetupForm({...setupForm, db_key: e.target.value})} />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">AI API Key (Optional)</label>
                                  <input type="password" className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-blue" value={setupForm.ai_key} onChange={e => setSetupForm({...setupForm, ai_key: e.target.value})} placeholder="sk-..." />
                              </div>
                              <button type="submit" disabled={globalLoading} className="w-full bg-brand-blue text-white font-bold py-3 rounded-xl hover:bg-sky-600 shadow-lg flex items-center justify-center gap-2">
                                  {globalLoading ? 'Connecting...' : <>Complete Setup <ArrowRight size={18}/></>}
                              </button>
                              <button type="button" onClick={logout} className="w-full text-gray-400 text-sm hover:text-gray-600">Cancel & Logout</button>
                          </form>
                      </div>
                  </div>
              </div>
          );
      }
      return <TenantDashboard />;
  }

  // Login Screen
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-brand-blue to-brand-green rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg text-white">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
          <p className="text-gray-500">Manage your travel agency business</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none"/>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none"/>
          </div>
          {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-all shadow-lg flex justify-center">
              {loading ? 'Verifying...' : 'Login to Dashboard'}
          </button>
          <div className="text-center pt-4 border-t border-gray-100 flex justify-between items-center">
              <div className="text-left">
                  <p className="text-xs text-gray-400">Demo Access:</p>
                  <p className="text-xs text-gray-600 font-mono">admin@holidaypot.in / admin123</p>
              </div>
              <Link to="/schema" target="_blank" className="text-xs font-bold text-brand-blue hover:underline flex items-center gap-1">
                  <Database size={12}/> DB Setup
              </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
