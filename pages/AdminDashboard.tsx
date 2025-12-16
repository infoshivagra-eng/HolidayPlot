
import React, { useState } from 'react';
import { ShieldCheck, Database } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGlobal } from '../GlobalContext';
import TenantDashboard from './TenantDashboard';

const AdminDashboard: React.FC = () => {
  const { currentUser, currentTenant, login, initializeTenantSession } = useGlobal();
  
  // Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // --- AUTH HANDLER ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
        const success = await login(username, password);
        
        if (success) {
            // Ensure a default tenant session exists for the single-agency view
            // This handles the case where we log in as a team member directly
            if (!currentTenant) {
               await initializeTenantSession({
                   id: 'holidaypot_default',
                   business_name: 'HolidayPot',
                   admin_email: 'admin@holidaypot.in',
                   status: 'active',
                   plan_id: 'enterprise'
               }, null as any); // Manager is already set by login()
            }
        } else {
            throw new Error('Invalid username or password.');
        }

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
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none"/>
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
                  <p className="text-xs text-gray-400">Default Access:</p>
                  <p className="text-xs text-gray-600 font-mono">admin / admin123</p>
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
