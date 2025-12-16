
import React, { useState, useEffect } from 'react';
import { Building2, Mail, Sparkles, Upload, Globe, AlertOctagon, Database, Download, Search, Server, Plus, Trash2, Link as LinkIcon, Facebook, Twitter, Instagram, Clock, Lock } from 'lucide-react';
import { useGlobal } from '../../GlobalContext';
import { AiSettings, EmailSettings, CompanyProfile, SeoSettings, PageSettings } from '../../types';

const AdminSettings: React.FC = () => {
  const { 
    companyProfile, updateCompanyProfile, 
    emailSettings, updateEmailSettings,
    aiSettings, updateAiSettings,
    seoSettings, updateSeoSettings,
    pageSettings, updatePageSettings,
    packages, drivers, bookings, importData,
    lastBackupDate
  } = useGlobal();

  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'notifications' | 'ai' | 'backup' | 'seo' | 'pages' | 'db' | 'security'>('profile');

  // Local Form States
  const [profileForm, setProfileForm] = useState<CompanyProfile>(companyProfile);
  const [emailForm, setEmailForm] = useState<EmailSettings>(emailSettings);
  const [aiForm, setAiForm] = useState<AiSettings>(aiSettings);
  const [seoForm, setSeoForm] = useState<SeoSettings>(seoSettings);
  const [pageForm, setPageForm] = useState<PageSettings>(pageSettings);
  const [dbConfig, setDbConfig] = useState({ projectName: '', url: '', key: '' });
  const [securityForm, setSecurityForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  // Sync with global state on mount
  useEffect(() => {
    setProfileForm(companyProfile);
    setEmailForm(emailSettings);
    setAiForm(aiSettings);
    setSeoForm(seoSettings);
    setPageForm(pageSettings);
    
    const storedName = localStorage.getItem('holidaypot_supabase_project_name') || '';
    const storedUrl = localStorage.getItem('holidaypot_supabase_url') || '';
    const storedKey = localStorage.getItem('holidaypot_supabase_key') || '';
    setDbConfig({ projectName: storedName, url: storedUrl, key: storedKey });
  }, [companyProfile, emailSettings, aiSettings, seoSettings, pageSettings]);

  // Handlers
  const handleProfileSave = (e: React.FormEvent) => { e.preventDefault(); updateCompanyProfile(profileForm); alert('Profile Saved!'); };
  const handleEmailSave = (e: React.FormEvent) => { e.preventDefault(); updateEmailSettings(emailForm); alert('Notification Settings Saved!'); };
  const handleAiSave = (e: React.FormEvent) => { e.preventDefault(); updateAiSettings(aiForm); alert('AI Config Saved!'); };
  const handleSeoSave = (e: React.FormEvent) => { e.preventDefault(); updateSeoSettings(seoForm); alert('SEO Saved!'); };
  const handlePageSave = (e: React.FormEvent) => { e.preventDefault(); updatePageSettings(pageForm); alert('Page Settings Saved!'); };
  
  const handleDbSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('holidaypot_supabase_project_name', dbConfig.projectName);
    localStorage.setItem('holidaypot_supabase_url', dbConfig.url);
    localStorage.setItem('holidaypot_supabase_key', dbConfig.key);
    if(window.confirm('DB Config saved. Reload?')) window.location.reload();
  };

  const handleSecuritySave = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPwd = localStorage.getItem('holidayPot_admin_pwd') || 'admin';
    
    if (securityForm.currentPassword !== storedPwd) {
      alert("Incorrect Current Password!");
      return;
    }
    
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    
    if (securityForm.newPassword.length < 4) {
      alert("Password must be at least 4 characters.");
      return;
    }

    localStorage.setItem('holidayPot_admin_pwd', securityForm.newPassword);
    alert("Password updated successfully! Please login again with your new password.");
    setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleBackupExport = () => {
    const data = { packages, drivers, bookings, companyProfile, aiSettings, seoSettings, pageSettings, emailSettings, timestamp: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `holidaypot_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Update last backup date in local state/storage
    const now = new Date().toISOString();
    localStorage.setItem('holidaypot_last_backup', now);
  };

  const handleBackupImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        importData(json);
      } catch (err) { alert("Failed to parse backup file."); }
    };
    reader.readAsText(file);
  };

  const addAiFallbackKey = () => {
    setAiForm(prev => ({
        ...prev,
        fallbackApiKeys: [...prev.fallbackApiKeys, '']
    }));
  };

  const updateAiFallbackKey = (index: number, val: string) => {
    const newKeys = [...aiForm.fallbackApiKeys];
    newKeys[index] = val;
    setAiForm(prev => ({ ...prev, fallbackApiKeys: newKeys }));
  };

  const removeAiFallbackKey = (index: number) => {
    const newKeys = aiForm.fallbackApiKeys.filter((_, i) => i !== index);
    setAiForm(prev => ({ ...prev, fallbackApiKeys: newKeys }));
  };

  const toggleNotificationType = (index: number, type: 'Package' | 'Taxi' | 'AI Plan') => {
    const newRecipients = [...emailForm.recipients];
    const currentTypes = newRecipients[index].notifyOn;
    
    if (currentTypes.includes(type)) {
        newRecipients[index].notifyOn = currentTypes.filter(t => t !== type);
    } else {
        newRecipients[index].notifyOn = [...currentTypes, type];
    }
    setEmailForm({...emailForm, recipients: newRecipients});
  };

  const updateRecipientEmail = (index: number, email: string) => {
    const newRecipients = [...emailForm.recipients];
    newRecipients[index].address = email;
    setEmailForm({...emailForm, recipients: newRecipients});
  };

  const menuItems = [
    { id: 'profile', icon: Building2, label: 'Company Profile' },
    { id: 'notifications', icon: Mail, label: 'Notifications' },
    { id: 'ai', icon: Sparkles, label: 'AI Engine' },
    { id: 'backup', icon: Upload, label: 'Backup & Restore' },
    { id: 'seo', icon: Globe, label: 'SEO & Meta' },
    { id: 'pages', icon: AlertOctagon, label: 'Error Pages' },
    { id: 'db', icon: Database, label: 'Database' },
    { id: 'security', icon: Lock, label: 'Admin Security' },
  ];

  const inputClass = "w-full p-3 bg-white text-gray-900 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent placeholder-gray-500";

  return (
    <div className="animate-fade-in flex flex-col md:flex-row gap-8 pb-12">
      {/* Settings Sidebar */}
      <div className="w-full md:w-64 flex-shrink-0">
         <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-8">
            {menuItems.map((item) => (
               <button 
                  key={item.id}
                  onClick={() => setActiveSubTab(item.id as any)}
                  className={`w-full text-left px-6 py-4 flex items-center gap-3 text-sm font-bold border-l-4 transition-colors ${activeSubTab === item.id ? 'border-brand-blue bg-blue-50 text-brand-blue' : 'border-transparent text-gray-600 hover:bg-gray-50'}`}
               >
                  <item.icon size={18}/> {item.label}
               </button>
            ))}
         </div>
      </div>

      {/* Settings Content */}
      <div className="flex-grow">
         
         {/* PROFILE SETTINGS */}
         {activeSubTab === 'profile' && (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
               <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Building2 className="text-gray-600"/> Company Profile</h2>
               <form onSubmit={handleProfileSave} className="space-y-6">
                  {/* Visuals */}
                  <div className="grid md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Company Logo URL</label>
                        <div className="flex gap-2">
                           <div className="w-16 h-16 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                              <img src={profileForm.logo} alt="Logo" className="w-full h-full object-cover"/>
                           </div>
                           <input type="text" className={inputClass} value={profileForm.logo} onChange={(e) => setProfileForm({...profileForm, logo: e.target.value})} placeholder="https://..." />
                        </div>
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Home Hero Image URL</label>
                        <input type="text" className={inputClass} value={profileForm.heroImage} onChange={(e) => setProfileForm({...profileForm, heroImage: e.target.value})} placeholder="https://..." />
                     </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Company Name</label>
                        <input type="text" className={inputClass} value={profileForm.name} onChange={(e) => setProfileForm({...profileForm, name: e.target.value})} />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">GST Number</label>
                        <input type="text" className={inputClass} value={profileForm.gstNumber || ''} onChange={(e) => setProfileForm({...profileForm, gstNumber: e.target.value})} />
                     </div>
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Address</label>
                     <input type="text" className={inputClass} value={profileForm.address} onChange={(e) => setProfileForm({...profileForm, address: e.target.value})} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone</label>
                        <input type="text" className={inputClass} value={profileForm.phone} onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})} />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Public Email</label>
                        <input type="email" className={inputClass} value={profileForm.email} onChange={(e) => setProfileForm({...profileForm, email: e.target.value})} />
                     </div>
                  </div>
                  
                  {/* Socials */}
                  <div>
                     <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Social Media Links</label>
                     <div className="grid md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                           <Facebook size={20} className="text-blue-600"/>
                           <input placeholder="Facebook URL" value={profileForm.facebook} onChange={e => setProfileForm({...profileForm, facebook: e.target.value})} className={inputClass + " text-sm"} />
                        </div>
                        <div className="flex items-center gap-2">
                           <Twitter size={20} className="text-sky-400"/>
                           <input placeholder="Twitter URL" value={profileForm.twitter} onChange={e => setProfileForm({...profileForm, twitter: e.target.value})} className={inputClass + " text-sm"} />
                        </div>
                        <div className="flex items-center gap-2">
                           <Instagram size={20} className="text-pink-600"/>
                           <input placeholder="Instagram URL" value={profileForm.instagram} onChange={e => setProfileForm({...profileForm, instagram: e.target.value})} className={inputClass + " text-sm"} />
                        </div>
                     </div>
                  </div>

                  <button type="submit" className="bg-brand-blue text-white font-bold py-3 px-8 rounded-xl hover:bg-sky-600 transition-colors shadow-lg">Save Profile</button>
               </form>
            </div>
         )}

         {/* NOTIFICATIONS SETTINGS */}
         {activeSubTab === 'notifications' && (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
               <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Mail className="text-brand-orange"/> Notification Preferences</h2>
               <form onSubmit={handleEmailSave} className="space-y-6">
                  <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 mb-4 flex items-center justify-between">
                     <div>
                        <span className="font-bold text-orange-900 text-sm">System Notifications</span>
                        <p className="text-xs text-orange-700">Master switch for all email alerts.</p>
                     </div>
                     <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={emailForm.enableNotifications} onChange={e => setEmailForm({...emailForm, enableNotifications: e.target.checked})} className="sr-only peer"/>
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-orange"></div>
                     </label>
                  </div>

                  <div className="space-y-6">
                     {emailForm.recipients.map((recipient, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                           <div className="flex items-center gap-4 mb-3">
                              <span className="bg-gray-200 text-gray-600 font-bold px-3 py-1 rounded text-xs">Email {index + 1}</span>
                              <input 
                                 type="email" 
                                 placeholder={`recipient${index+1}@example.com`}
                                 className="flex-grow p-2 bg-white text-gray-900 border border-gray-300 rounded-lg text-sm"
                                 value={recipient.address}
                                 onChange={(e) => updateRecipientEmail(index, e.target.value)}
                              />
                           </div>
                           <div className="flex gap-4 pl-20">
                              <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                                 <input 
                                    type="checkbox" 
                                    checked={recipient.notifyOn.includes('Package')} 
                                    onChange={() => toggleNotificationType(index, 'Package')}
                                    className="rounded text-brand-blue"
                                 /> Package Enquiries
                              </label>
                              <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                                 <input 
                                    type="checkbox" 
                                    checked={recipient.notifyOn.includes('Taxi')} 
                                    onChange={() => toggleNotificationType(index, 'Taxi')}
                                    className="rounded text-brand-blue"
                                 /> Taxi Bookings
                              </label>
                              <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                                 <input 
                                    type="checkbox" 
                                    checked={recipient.notifyOn.includes('AI Plan')} 
                                    onChange={() => toggleNotificationType(index, 'AI Plan')}
                                    className="rounded text-brand-blue"
                                 /> AI Plans
                              </label>
                           </div>
                        </div>
                     ))}
                  </div>
                  <button type="submit" className="bg-brand-orange text-white font-bold py-3 px-8 rounded-xl hover:bg-orange-600 transition-colors shadow-lg">Save Notification Settings</button>
               </form>
            </div>
         )}

         {/* AI SETTINGS */}
         {activeSubTab === 'ai' && (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
               <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Sparkles className="text-brand-blue"/> AI Engine Configuration</h2>
                  <a href="https://openrouter.ai/models" target="_blank" rel="noreferrer" className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full font-bold hover:bg-blue-100 flex items-center gap-1">
                     <Search size={12}/> Find Free Models
                  </a>
               </div>
               
               <form onSubmit={handleAiSave} className="space-y-6">
                  <div>
                     <label className="block text-xs font-bold text-gray-700 uppercase mb-2">AI Provider</label>
                     <div className="grid grid-cols-3 gap-3">
                        {['gemini', 'openai', 'custom'].map((p) => (
                           <button 
                              type="button" 
                              key={p} 
                              onClick={() => setAiForm({...aiForm, provider: p as any})}
                              className={`py-3 px-4 rounded-xl border-2 font-bold text-sm capitalize transition-all ${aiForm.provider === p ? 'border-brand-blue bg-blue-50 text-brand-blue' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                           >
                              {p === 'gemini' ? 'Google Gemini' : p === 'openai' ? 'OpenAI (GPT)' : 'Custom / Free'}
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                     <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        {aiForm.provider === 'openai' ? 'OpenAI API Key (Primary)' : 'Primary API Key'}
                     </label>
                     <input 
                        type="password" 
                        className={inputClass + " font-mono text-sm"}
                        placeholder="sk-..."
                        value={aiForm.primaryApiKey}
                        onChange={(e) => setAiForm({...aiForm, primaryApiKey: e.target.value})}
                     />
                  </div>

                  {/* Multi-Key Fallback UI */}
                  {aiForm.provider === 'gemini' && (
                     <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Backup API Keys (Resilience)</label>
                        <div className="space-y-2">
                           {aiForm.fallbackApiKeys.map((key, index) => (
                              <div key={index} className="flex gap-2">
                                 <input 
                                    type="password"
                                    className={inputClass + " font-mono text-sm"}
                                    placeholder={`Backup Key #${index + 1}`}
                                    value={key}
                                    onChange={(e) => updateAiFallbackKey(index, e.target.value)}
                                 />
                                 <button type="button" onClick={() => removeAiFallbackKey(index)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl"><Trash2 size={18}/></button>
                              </div>
                           ))}
                           <button type="button" onClick={addAiFallbackKey} className="text-sm font-bold text-brand-blue flex items-center gap-1 hover:underline mt-2">
                              <Plus size={16}/> Add another backup key
                           </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">If the primary key hits a rate limit or fails, the system will automatically try these keys in order.</p>
                     </div>
                  )}

                  {aiForm.provider === 'custom' && (
                     <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Custom Base URL</label>
                        <input 
                           type="text" 
                           className={inputClass + " font-mono text-sm"}
                           placeholder="https://api.groq.com/openai/v1"
                           value={aiForm.customBaseUrl || ''}
                           onChange={(e) => setAiForm({...aiForm, customBaseUrl: e.target.value})}
                        />
                     </div>
                  )}

                  <div className="grid grid-cols-2 gap-6">
                     <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Model Name</label>
                        <input 
                           type="text"
                           className={inputClass}
                           placeholder={aiForm.provider === 'openai' ? 'gpt-3.5-turbo' : 'gemini-2.5-flash'}
                           value={aiForm.model}
                           onChange={(e) => setAiForm({...aiForm, model: e.target.value})}
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Max Retries</label>
                        <input 
                           type="number"
                           min="1"
                           max="10"
                           className={inputClass}
                           value={aiForm.maxRetries}
                           onChange={(e) => setAiForm({...aiForm, maxRetries: parseInt(e.target.value)})}
                        />
                     </div>
                  </div>

                  <button type="submit" className="bg-brand-blue text-white font-bold py-3 px-8 rounded-xl hover:bg-sky-600 transition-colors shadow-lg">
                     Save AI Configuration
                  </button>
               </form>
            </div>
         )}

         {/* BACKUP SETTINGS */}
         {activeSubTab === 'backup' && (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
               <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Upload className="text-purple-600"/> Backup & Restore</h2>
               
               <div className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                     <Clock size={20}/>
                  </div>
                  <div>
                     <h4 className="font-bold text-blue-900 text-sm">Last Backup Created</h4>
                     <p className="text-xs text-blue-700">{lastBackupDate ? new Date(lastBackupDate).toLocaleString() : 'Never backed up on this device'}</p>
                  </div>
               </div>

               <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 text-center">
                     <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-purple-600">
                        <Download size={32}/>
                     </div>
                     <h3 className="font-bold text-purple-900 text-lg mb-2">Export Data</h3>
                     <p className="text-sm text-purple-700 mb-6">Download a full JSON backup of packages, bookings, drivers, and settings.</p>
                     <button onClick={handleBackupExport} className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 w-full">
                        Download Backup
                     </button>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 text-center">
                     <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-gray-600">
                        <Upload size={32}/>
                     </div>
                     <h3 className="font-bold text-gray-900 text-lg mb-2">Import Data</h3>
                     <p className="text-sm text-gray-600 mb-6">Restore data from a previously exported JSON file. <span className="text-red-500">Overwrites current data.</span></p>
                     <label className="bg-gray-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-900 w-full cursor-pointer inline-block">
                        Select Backup File
                        <input type="file" accept=".json" onChange={handleBackupImport} className="hidden" />
                     </label>
                  </div>
               </div>
            </div>
         )}

         {/* SEO Settings */}
         {activeSubTab === 'seo' && (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
               <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Globe className="text-green-600"/> Global SEO Configuration</h2>
               <form onSubmit={handleSeoSave} className="space-y-4">
                  <div>
                     <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Global Site Title</label>
                     <input type="text" className={inputClass} value={seoForm.title} onChange={(e) => setSeoForm({...seoForm, title: e.target.value})} />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Meta Description</label>
                     <textarea className={inputClass + " h-24 resize-none"} value={seoForm.description} onChange={(e) => setSeoForm({...seoForm, description: e.target.value})} />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Meta Keywords</label>
                     <input type="text" className={inputClass} value={seoForm.keywords} onChange={(e) => setSeoForm({...seoForm, keywords: e.target.value})} />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Robots.txt Content</label>
                     <textarea 
                        className={inputClass + " h-32 resize-none font-mono text-sm"}
                        value={seoForm.robotsTxtContent} 
                        onChange={(e) => setSeoForm({...seoForm, robotsTxtContent: e.target.value})} 
                     />
                     <p className="text-xs text-gray-500 mt-1">Standard Allow/Disallow rules.</p>
                  </div>
                  <div className="flex gap-4 pt-2">
                     <label className="flex items-center gap-2 text-sm font-bold text-gray-700 cursor-pointer">
                        <input type="checkbox" checked={seoForm.sitemapEnabled} onChange={e => setSeoForm({...seoForm, sitemapEnabled: e.target.checked})} className="rounded text-brand-green"/> Enable Sitemap
                     </label>
                     <label className="flex items-center gap-2 text-sm font-bold text-gray-700 cursor-pointer">
                        <input type="checkbox" checked={seoForm.schemaMarkupEnabled} onChange={e => setSeoForm({...seoForm, schemaMarkupEnabled: e.target.checked})} className="rounded text-brand-green"/> JSON-LD Schema
                     </label>
                  </div>
                  <button type="submit" className="w-full bg-brand-green text-white font-bold py-3 px-8 rounded-xl hover:bg-green-600 shadow-lg mt-4">Save SEO Settings</button>
               </form>
            </div>
         )}

         {/* Pages Settings */}
         {activeSubTab === 'pages' && (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
               <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><AlertOctagon className="text-red-500"/> Error Pages & Maintenance</h2>
               <form onSubmit={handlePageSave} className="space-y-6">
                  <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                     <h3 className="font-bold text-gray-800 mb-3">404 Page Not Found</h3>
                     <div className="space-y-3">
                        <input type="text" className="w-full p-2 bg-white text-gray-900 border border-gray-300 rounded-lg text-sm" value={pageForm.error404.title} onChange={(e) => setPageForm({...pageForm, error404: {...pageForm.error404, title: e.target.value}})} />
                        <textarea className="w-full p-2 bg-white text-gray-900 border border-gray-300 rounded-lg text-sm resize-none h-20" value={pageForm.error404.message} onChange={(e) => setPageForm({...pageForm, error404: {...pageForm.error404, message: e.target.value}})} />
                        <input type="text" className="w-full p-2 bg-white text-gray-900 border border-gray-300 rounded-lg text-sm" value={pageForm.error404.image} onChange={(e) => setPageForm({...pageForm, error404: {...pageForm.error404, image: e.target.value}})} />
                     </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-100 rounded-xl">
                     <div>
                        <h4 className="font-bold text-orange-800 text-sm">Maintenance Mode</h4>
                        <p className="text-xs text-orange-600">Show a generic 503 Service Unavailable page.</p>
                     </div>
                     <input type="checkbox" checked={pageForm.maintenanceMode} onChange={(e) => setPageForm({...pageForm, maintenanceMode: e.target.checked})} className="w-5 h-5 accent-brand-orange"/>
                  </div>
                  <button type="submit" className="w-full bg-gray-900 text-white font-bold py-3 px-8 rounded-xl hover:bg-black shadow-lg">Save Page Settings</button>
               </form>
            </div>
         )}

         {/* Database Settings */}
         {activeSubTab === 'db' && (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
               <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Server className="text-purple-600"/> Database Configuration</h2>
               <form onSubmit={handleDbSave} className="space-y-4">
                  <input type="text" placeholder="Project Name" className={inputClass} value={dbConfig.projectName} onChange={(e) => setDbConfig({...dbConfig, projectName: e.target.value})} />
                  <input type="text" placeholder="Supabase URL" className={inputClass} value={dbConfig.url} onChange={(e) => setDbConfig({...dbConfig, url: e.target.value})} />
                  <input type="password" placeholder="Anon Key" className={inputClass} value={dbConfig.key} onChange={(e) => setDbConfig({...dbConfig, key: e.target.value})} />
                  <button type="submit" className="w-full bg-purple-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-purple-700 shadow-lg">Save & Connect</button>
               </form>
            </div>
         )}

         {/* Security Settings */}
         {activeSubTab === 'security' && (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
               <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Lock className="text-red-600"/> Admin Security</h2>
               <form onSubmit={handleSecuritySave} className="space-y-6 max-w-md">
                  <div>
                     <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Current Password</label>
                     <input 
                        type="password" 
                        required
                        className={inputClass}
                        value={securityForm.currentPassword}
                        onChange={e => setSecurityForm({...securityForm, currentPassword: e.target.value})}
                     />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-700 uppercase mb-1">New Password</label>
                     <input 
                        type="password" 
                        required
                        className={inputClass}
                        value={securityForm.newPassword}
                        onChange={e => setSecurityForm({...securityForm, newPassword: e.target.value})}
                     />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Confirm New Password</label>
                     <input 
                        type="password" 
                        required
                        className={inputClass}
                        value={securityForm.confirmPassword}
                        onChange={e => setSecurityForm({...securityForm, confirmPassword: e.target.value})}
                     />
                  </div>
                  <button type="submit" className="w-full bg-red-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-red-700 transition-colors shadow-lg">
                     Update Password
                  </button>
               </form>
            </div>
         )}

      </div>
    </div>
  );
};

export default AdminSettings;
