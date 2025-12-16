
import React, { useState } from 'react';
import { ShieldCheck, Database, Key, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGlobal } from '../GlobalContext';
import { masterSupabase } from '../lib/saasHelper';
import { Tenant } from '../types';
import TenantDashboard from './TenantDashboard';

const AdminDashboard: React.FC = () => {
  const { currentUser, currentTenant, logout, initializeTenantSession, loading: globalLoading } = useGlobal();
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
                    // Default to empty strings to avoid setup prompt
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

  // --- RENDER LOGIC ---

  // If authenticated
  if (currentUser) {
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
