
import React, { useState } from 'react';
import { History, RotateCcw, Search, User } from 'lucide-react';
import { useGlobal } from '../../GlobalContext';

const AdminLogs: React.FC = () => {
  const { activityLogs, revertAction } = useGlobal();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = activityLogs.filter(log => 
     log.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
     log.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     log.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>
           <p className="text-sm text-gray-500">Audit trail of system actions and changes.</p>
        </div>
        <div className="relative">
           <Search className="absolute left-3 top-2.5 text-gray-400" size={18}/>
           <input 
              type="text" 
              placeholder="Search logs..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-blue"
           />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                     <th className="p-4 text-xs font-bold text-gray-500 uppercase">User</th>
                     <th className="p-4 text-xs font-bold text-gray-500 uppercase">Action</th>
                     <th className="p-4 text-xs font-bold text-gray-500 uppercase">Target</th>
                     <th className="p-4 text-xs font-bold text-gray-500 uppercase">Date</th>
                     <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Undo</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {filteredLogs.map(log => (
                     <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                           <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                 {log.actorName.charAt(0)}
                              </div>
                              <span className="text-sm font-medium text-gray-900">{log.actorName}</span>
                           </div>
                        </td>
                        <td className="p-4">
                           <div className="font-bold text-sm text-gray-800">{log.action}</div>
                           <div className="text-xs text-gray-500">{log.details}</div>
                        </td>
                        <td className="p-4">
                           <span className="bg-blue-50 text-brand-blue px-2 py-1 rounded text-xs font-bold">
                              {log.targetType} {log.targetId ? `#${log.targetId}` : ''}
                           </span>
                        </td>
                        <td className="p-4 text-sm text-gray-500">
                           {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="p-4 text-right">
                           {log.previousData && !log.isReverted && (
                              <button 
                                 onClick={() => { if(window.confirm('Revert this action?')) revertAction(log.id); }}
                                 className="text-orange-500 hover:text-orange-700 font-medium text-xs flex items-center gap-1 ml-auto"
                              >
                                 <RotateCcw size={14}/> Revert
                              </button>
                           )}
                           {log.isReverted && (
                              <span className="text-xs text-gray-400 italic">Reverted</span>
                           )}
                        </td>
                     </tr>
                  ))}
                  {filteredLogs.length === 0 && (
                     <tr>
                        <td colSpan={5} className="p-8 text-center text-gray-400">No logs found.</td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default AdminLogs;
