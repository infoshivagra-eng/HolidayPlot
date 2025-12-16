
import React, { useState, useEffect } from 'react';
import { Building2, Mail, Sparkles, Upload, Globe, AlertOctagon, Database, Download, Search, Server, Plus, Trash2, Link as LinkIcon, Facebook, Twitter, Instagram, Clock, Lock, MapPin, MessageCircle, FileText, Save, RefreshCw, Key, ShieldAlert, Bold, Italic, Heading, Eye, PenTool, ExternalLink, Loader2 } from 'lucide-react';
import { useGlobal } from '../../GlobalContext';
import { AiSettings, EmailSettings, CompanyProfile, SeoSettings, PageSettings, SitePage } from '../../types';
import { generateAIContent } from '../../utils';

const AdminSettings: React.FC = () => {
  const { 
    companyProfile, updateCompanyProfile, 
    emailSettings, updateEmailSettings,
    aiSettings, updateAiSettings,
    seoSettings, updateSeoSettings,
    pageSettings, updatePageSettings,
    sitePages, updateSitePage,
    packages, drivers, bookings, blogPosts, importData,
    lastBackupDate
  } = useGlobal();

  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'pages' | 'notifications' | 'ai' | 'backup' | 'seo' | 'error_pages' | 'db' | 'security'>('profile');

  // Local Form States
  const [profileForm, setProfileForm] = useState<CompanyProfile>(companyProfile);
  const [emailForm, setEmailForm] = useState<EmailSettings>(emailSettings);
  const [aiForm, setAiForm] = useState<AiSettings>(aiSettings);
  const [seoForm, setSeoForm] = useState<SeoSettings>(seoSettings);
  const [pageForm, setPageForm] = useState<PageSettings>(pageSettings);
  const [dbConfig, setDbConfig] = useState({ projectName: '', url: '', key: '' });
  const [securityForm, setSecurityForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [selectedPageId, setSelectedPageId] = useState<'about' | 'terms' | 'privacy' | 'home'>('about');
  const [pageContentForm, setPageContentForm] = useState<SitePage>(sitePages[0]);
  
  // Editor State
  const [editorMode, setEditorMode] = useState<'write' | 'preview'>('write');
  const [isGenerating, setIsGenerating] = useState(false);

  const geoOptions = [
    { code: 'IN', label: 'India (Country)' },
    { code: 'IN-DL', label: 'Delhi' },
    { code: 'IN-MH', label: 'Maharashtra' },
    { code: 'IN-KA', label: 'Karnataka' },
    { code: 'IN-KL', label: 'Kerala' },
    { code: 'IN-RJ', label: 'Rajasthan' },
    { code: 'IN-GA', label: 'Goa' },
    { code: 'US', label: 'United States' },
    { code: 'GB', label: 'United Kingdom' },
    { code: 'AE', label: 'United Arab Emirates' },
    { code: 'AU', label: 'Australia' },
  ];

  // Sync with global state on mount
  useEffect(() => {
    setProfileForm(companyProfile);
    setEmailForm(emailSettings);
    setAiForm(aiSettings);
    setSeoForm(seoSettings);
    setPageForm(pageSettings);
    
    const page = sitePages.find(p => p.id === selectedPageId);
    if(page) setPageContentForm(page);

    const storedName = localStorage.getItem('holidaypot_supabase_project_name') || '';
    const storedUrl = localStorage.getItem('holidaypot_supabase_url') || '';
    const storedKey = localStorage.getItem('holidaypot_supabase_key') || '';
    setDbConfig({ projectName: storedName, url: storedUrl, key: storedKey });
  }, [companyProfile, emailSettings, aiSettings, seoSettings, pageSettings, sitePages, selectedPageId]);

  // Handlers
  const handleProfileSave = (e: React.FormEvent) => { e.preventDefault(); updateCompanyProfile(profileForm); alert('Profile Saved!'); };
  const handleEmailSave = (e: React.FormEvent) => { e.preventDefault(); updateEmailSettings(emailForm); alert('Notification Settings Saved!'); };
  const handleAiSave = (e: React.FormEvent) => { e.preventDefault(); updateAiSettings(aiForm); alert('AI Config Saved!'); };
  const handleSeoSave = (e: React.FormEvent) => { e.preventDefault(); updateSeoSettings(seoForm); alert('SEO Saved!'); };
  const handlePageSave = (e: React.FormEvent) => { e.preventDefault(); updatePageSettings(pageForm); alert('Error Page Settings Saved!'); };
  const handleContentSave = (e: React.FormEvent) => { e.preventDefault(); updateSitePage({ ...pageContentForm, lastUpdated: new Date().toISOString() }); alert('Page Content Updated!'); };
  
  const handleDbSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('holidaypot_supabase_project_name', dbConfig.projectName);
    localStorage.setItem('holidaypot_supabase_url', dbConfig.url);
    localStorage.setItem('holidaypot_supabase_key', dbConfig.key);
    if(window.confirm('DB Config saved. Reload to apply changes?')) window.location.reload();
  };

  const handleSecuritySave = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPwd = localStorage.getItem('holidayPot_admin_pwd') || 'admin';
    if (securityForm.currentPassword !== storedPwd) { alert("Incorrect Current Password!"); return; }
    if (securityForm.newPassword !== securityForm.confirmPassword) { alert("New passwords do not match!"); return; }
    if (securityForm.newPassword.length < 4) { alert("Password must be at least 4 characters."); return; }
    localStorage.setItem('holidayPot_admin_pwd', securityForm.newPassword);
    alert("Password updated successfully! Please login again with your new password.");
    setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleBackupExport = () => {
    const data = { packages, drivers, bookings, blogPosts, companyProfile, aiSettings, seoSettings, pageSettings, emailSettings, sitePages, timestamp: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `holidaypot_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Update last backup date in local state manually to reflect immediately
    const now = new Date().toISOString();
    localStorage.setItem('holidaypot_last_backup', now);
    alert("Backup downloaded successfully!");
  };

  const handleBackupImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try { const json = JSON.parse(event.target?.result as string); importData(json); } catch (err) { alert("Failed to parse backup file."); }
    };
    reader.readAsText(file);
  };

  // AI Content Generator for Pages
  const handleAiPageGen = async () => {
    if (!pageContentForm.title) {
        alert("Please ensure the page has a title first.");
        return;
    }
    setIsGenerating(true);
    try {
        const type = selectedPageId;
        let prompt = `Generate professional, engaging, and SEO-friendly HTML content for a travel agency website's "${pageContentForm.title}" page.
        
        Company Name: ${companyProfile.name}
        Address: ${companyProfile.address}
        Email: ${companyProfile.email}
        Phone: ${companyProfile.phone}
        
        Requirements:
        - Return ONLY the HTML code (inside a <div>, but do not include the outer <div> tag).
        - Do NOT include markdown code blocks (like \`\`\`html).
        - Use Tailwind CSS classes where appropriate for typography (e.g., text-brand-blue, text-xl, font-bold).
        - Use <h2>, <h3>, <p>, <ul>, <li> tags for structure.
        `;

        if (type === 'home') {
            prompt += `
            - Create a welcoming introduction section.
            - Include a 'Why Choose Us' section with 3 key points (Verified, Best Price, Local Experts).
            - Include a call to action to browse packages.
            - Tone: Inspiring, Vibrant, Welcoming.
            `;
        } else if (type === 'about') {
            prompt += `
            - Write a company 'Our Story' section.
            - Include a 'Our Mission' section.
            - Include a 'Our Values' section.
            - Tone: Professional, Trustworthy, Passionate.
            `;
        } else if (type === 'terms' || type === 'privacy') {
            prompt += `
            - Write standard legal text for a travel agency in India.
            - Include sections for Booking Policy, Refunds, and Liability.
            - Tone: Formal, Clear, Legal.
            `;
        }

        const content = await generateAIContent(prompt);
        setPageContentForm(prev => ({ ...prev, content }));
    } catch (e: any) {
        alert("AI Generation failed: " + e.message);
    } finally {
        setIsGenerating(false);
    }
  };

  // Helper functions for array updates (AI keys, Email recipients)
  const addAiFallbackKey = () => setAiForm(prev => ({ ...prev, fallbackApiKeys: [...prev.fallbackApiKeys, ''] }));
  const updateAiFallbackKey = (index: number, val: string) => { const newKeys = [...aiForm.fallbackApiKeys]; newKeys[index] = val; setAiForm(prev => ({ ...prev, fallbackApiKeys: newKeys })); };
  const removeAiFallbackKey = (index: number) => { const newKeys = aiForm.fallbackApiKeys.filter((_, i) => i !== index); setAiForm(prev => ({ ...prev, fallbackApiKeys: newKeys })); };
  
  const addRecipient = () => setEmailForm(prev => ({ ...prev, recipients: [...prev.recipients, { address: '', notifyOn: ['Package'] }] }));
  const removeRecipient = (index: number) => setEmailForm(prev => ({ ...prev, recipients: prev.recipients.filter((_, i) => i !== index) }));
  
  const toggleNotificationType = (index: number, type: 'Package' | 'Taxi' | 'AI Plan') => {
    const newRecipients = [...emailForm.recipients];
    const currentTypes = newRecipients[index].notifyOn;
    if (currentTypes.includes(type)) { newRecipients[index].notifyOn = currentTypes.filter(t => t !== type); } else { newRecipients[index].notifyOn = [...currentTypes, type]; }
    setEmailForm({...emailForm, recipients: newRecipients});
  };
  const updateRecipientEmail = (index: number, email: string) => { const newRecipients = [...emailForm.recipients]; newRecipients[index].address = email; setEmailForm({...emailForm, recipients: newRecipients}); };

  // Editor Helpers
  const insertContent = (tagOpen: string, tagClose: string = '', placeholder: string = '') => {
      // Logic for Textarea Mode
      if (editorMode === 'write') {
          const textarea = document.getElementById('pageEditor') as HTMLTextAreaElement;
          if (!textarea) return;
          
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const text = textarea.value;
          const selectedText = text.substring(start, end) || placeholder;
          
          const newText = text.substring(0, start) + tagOpen + selectedText + tagClose + text.substring(end);
          setPageContentForm({ ...pageContentForm, content: newText });
          
          // Restore focus
          setTimeout(() => {
              textarea.focus();
              textarea.setSelectionRange(start + tagOpen.length, start + tagOpen.length + selectedText.length);
          }, 0);
      } 
      // Logic for Visual Preview Mode
      else {
          const newHtml = pageContentForm.content + tagOpen + placeholder + tagClose;
          setPageContentForm({ ...pageContentForm, content: newHtml });
      }
  };

  const menuItems = [
    { id: 'profile', icon: Building2, label: 'Company Profile' },
    { id: 'pages', icon: FileText, label: 'Manage Pages' },
    { id: 'notifications', icon: Mail, label: 'Notifications' },
    { id: 'ai', icon: Sparkles, label: 'AI Engine' },
    { id: 'backup', icon: Upload, label: 'Backup & Restore' },
    { id: 'seo', icon: Globe, label: 'SEO, AEO & GEO' },
    { id: 'error_pages', icon: AlertOctagon, label: 'Error Pages' },
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
         
         {activeSubTab === 'profile' && (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-8">
               <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Building2 className="text-brand-blue"/> Company Profile</h2>
               <form onSubmit={handleProfileSave} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Company Name</label>
                        <input required type="text" className={inputClass} value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">GST Number</label>
                        <input type="text" className={inputClass} value={profileForm.gstNumber} onChange={e => setProfileForm({...profileForm, gstNumber: e.target.value})} />
                     </div>
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Address</label>
                     <input required type="text" className={inputClass} value={profileForm.address} onChange={e => setProfileForm({...profileForm, address: e.target.value})} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone</label>
                        <input required type="tel" className={inputClass} value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email</label>
                        <input required type="email" className={inputClass} value={profileForm.email} onChange={e => setProfileForm({...profileForm, email: e.target.value})} />
                     </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Logo URL</label>
                        <input type="text" className={inputClass} value={profileForm.logo} onChange={e => setProfileForm({...profileForm, logo: e.target.value})} />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Hero Image URL (Home)</label>
                        <input type="text" className={inputClass} value={profileForm.heroImage || ''} onChange={e => setProfileForm({...profileForm, heroImage: e.target.value})} />
                     </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100">
                     <h3 className="font-bold text-gray-800 mb-3">Social Media Links</h3>
                     <div className="grid md:grid-cols-3 gap-4">
                        <div>
                           <label className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1"><Facebook size={12}/> Facebook</label>
                           <input type="text" className={inputClass} value={profileForm.facebook} onChange={e => setProfileForm({...profileForm, facebook: e.target.value})} />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1"><Twitter size={12}/> Twitter</label>
                           <input type="text" className={inputClass} value={profileForm.twitter} onChange={e => setProfileForm({...profileForm, twitter: e.target.value})} />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1"><Instagram size={12}/> Instagram</label>
                           <input type="text" className={inputClass} value={profileForm.instagram} onChange={e => setProfileForm({...profileForm, instagram: e.target.value})} />
                        </div>
                     </div>
                  </div>

                  <button type="submit" className="w-full bg-brand-blue text-white font-bold py-3 rounded-xl hover:bg-sky-600 shadow-lg mt-4">Save Changes</button>
               </form>
            </div>
         )}

         {activeSubTab === 'pages' && (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-8">
                <div className="flex justify-between items-center border-b border-gray-100 pb-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><FileText className="text-purple-600"/> Content Management</h2>
                    <select 
                        value={selectedPageId} 
                        onChange={(e) => setSelectedPageId(e.target.value as any)}
                        className="p-2 border border-gray-300 rounded-lg bg-gray-50 font-bold text-sm outline-none focus:ring-1 focus:ring-purple-500"
                    >
                        <option value="home">Home Page</option>
                        <option value="about">About Us</option>
                        <option value="terms">Terms & Conditions</option>
                        <option value="privacy">Privacy Policy</option>
                    </select>
                </div>

                <form onSubmit={handleContentSave} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Page Title</label>
                        <input 
                            type="text" 
                            className={inputClass} 
                            value={pageContentForm.title} 
                            onChange={(e) => setPageContentForm({...pageContentForm, title: e.target.value})} 
                        />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-xs font-bold text-gray-700 uppercase">Page Content</label>
                            <button
                                type="button"
                                onClick={handleAiPageGen}
                                disabled={isGenerating}
                                className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-lg font-bold hover:bg-purple-200 flex items-center gap-1 transition-colors"
                            >
                                {isGenerating ? <Loader2 className="animate-spin" size={12}/> : <Sparkles size={12}/>} Auto-Generate
                            </button>
                        </div>
                        {/* RICH TEXT EDITOR */}
                        <div className="bg-white rounded-xl border border-gray-300 overflow-hidden shadow-sm flex flex-col h-[500px]">
                            <div className="flex flex-wrap justify-between items-center gap-2 p-2 bg-gray-50 border-b border-gray-200">
                                <div className="flex items-center gap-1">
                                    <button type="button" onClick={() => insertContent('<b>', '</b>')} className="p-2 hover:bg-gray-200 rounded text-gray-600" title="Bold"><Bold size={16}/></button>
                                    <button type="button" onClick={() => insertContent('<i>', '</i>')} className="p-2 hover:bg-gray-200 rounded text-gray-600" title="Italic"><Italic size={16}/></button>
                                    <div className="w-px h-6 bg-gray-300 mx-1"></div>
                                    <button type="button" onClick={() => insertContent('<h2>', '</h2>')} className="p-2 hover:bg-gray-200 rounded text-gray-600 font-bold text-xs" title="Heading 2">H2</button>
                                    <button type="button" onClick={() => insertContent('<h3>', '</h3>')} className="p-2 hover:bg-gray-200 rounded text-gray-600 font-bold text-xs" title="Heading 3">H3</button>
                                    <button type="button" onClick={() => insertContent('<p>', '</p>')} className="p-2 hover:bg-gray-200 rounded text-gray-600 font-bold text-xs" title="Paragraph">P</button>
                                </div>
                                <div className="flex bg-gray-200 rounded-lg p-1">
                                    <button 
                                        type="button" 
                                        onClick={() => setEditorMode('write')} 
                                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${editorMode === 'write' ? 'bg-white text-brand-blue shadow-sm' : 'text-gray-500'}`}
                                    >
                                        <span className="flex items-center gap-1"><PenTool size={12}/> Write</span>
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => setEditorMode('preview')} 
                                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${editorMode === 'preview' ? 'bg-white text-brand-blue shadow-sm' : 'text-gray-500'}`}
                                    >
                                        <span className="flex items-center gap-1"><Eye size={12}/> Preview</span>
                                    </button>
                                </div>
                            </div>
                            {editorMode === 'write' ? (
                                <textarea 
                                    id="pageEditor"
                                    value={pageContentForm.content} 
                                    onChange={e => setPageContentForm({...pageContentForm, content: e.target.value})} 
                                    className="w-full h-full p-6 bg-white text-gray-900 outline-none font-mono text-sm resize-none" 
                                    placeholder="<p>Start writing your page content here...</p>"
                                ></textarea>
                            ) : (
                                <div className="w-full h-full p-8 bg-white overflow-y-auto border border-gray-200 rounded-b-xl relative group">
                                    <div className="absolute top-2 right-2 text-[10px] uppercase font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                        Visual Editor Enabled
                                    </div>
                                    <div 
                                        className="prose prose-lg prose-blue max-w-none text-gray-800 outline-none"
                                        contentEditable
                                        suppressContentEditableWarning
                                        dangerouslySetInnerHTML={{ __html: pageContentForm.content || '<p class="text-gray-400 italic">Start writing content to see a preview...</p>' }}
                                        onBlur={(e) => setPageContentForm({ ...pageContentForm, content: e.currentTarget.innerHTML })}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-500 pt-4 border-t border-gray-100">
                        <span>Last Updated: {new Date(pageContentForm.lastUpdated).toLocaleString()}</span>
                        <button type="submit" className="bg-brand-blue text-white font-bold py-2.5 px-6 rounded-xl hover:bg-sky-600 flex items-center gap-2 shadow-md">
                            <Save size={18}/> Save Page Content
                        </button>
                    </div>
                </form>
            </div>
         )}

         {activeSubTab === 'notifications' && (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-8">
               <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Mail className="text-orange-500"/> Email Notifications</h2>
                  <div className="flex items-center gap-2">
                     <span className="text-sm font-bold text-gray-700">Enable System Emails</span>
                     <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={emailForm.enableNotifications} onChange={e => setEmailForm({...emailForm, enableNotifications: e.target.checked})} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                     </label>
                  </div>
               </div>

               <form onSubmit={handleEmailSave} className="space-y-6">
                  {emailForm.recipients.map((recipient, idx) => (
                     <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-200 relative group">
                        <button type="button" onClick={() => removeRecipient(idx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-1"><Trash2 size={16}/></button>
                        <div className="mb-3">
                           <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Recipient Email</label>
                           <input type="email" value={recipient.address} onChange={(e) => updateRecipientEmail(idx, e.target.value)} className={inputClass} placeholder="admin@example.com" />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Notify On</label>
                           <div className="flex gap-4">
                              {['Package', 'Taxi', 'AI Plan'].map(type => (
                                 <label key={type} className="flex items-center gap-2 cursor-pointer text-sm font-bold text-gray-700">
                                    <input 
                                       type="checkbox" 
                                       checked={recipient.notifyOn.includes(type as any)} 
                                       onChange={() => toggleNotificationType(idx, type as any)}
                                       className="rounded text-brand-blue"
                                    />
                                    {type} Bookings
                                 </label>
                              ))}
                           </div>
                        </div>
                     </div>
                  ))}
                  
                  <div className="flex gap-3">
                     <button type="button" onClick={addRecipient} className="px-4 py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded-xl hover:border-brand-blue hover:text-brand-blue transition-colors text-sm font-bold flex items-center gap-2">
                        <Plus size={16}/> Add Recipient
                     </button>
                     <button type="submit" className="flex-grow bg-brand-blue text-white font-bold py-2 rounded-xl hover:bg-sky-600 shadow-lg">
                        Save Preferences
                     </button>
                  </div>
               </form>
            </div>
         )}

         {activeSubTab === 'ai' && (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-8">
               <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Sparkles className="text-purple-600"/> AI Engine Configuration</h2>
               
               <form onSubmit={handleAiSave} className="space-y-6">
                  <div>
                     <label className="block text-xs font-bold text-gray-700 uppercase mb-1">AI Provider</label>
                     <select value={aiForm.provider} onChange={e => setAiForm({...aiForm, provider: e.target.value as any})} className={inputClass}>
                        <option value="gemini">Google Gemini (Recommended)</option>
                        <option value="openai">OpenAI (GPT)</option>
                        <option value="custom">Custom LLM Endpoint</option>
                     </select>
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Model Name</label>
                     <input type="text" value={aiForm.model} onChange={e => setAiForm({...aiForm, model: e.target.value})} className={inputClass} placeholder="e.g. gemini-2.5-flash" />
                     <p className="text-xs text-gray-500 mt-1">Recommended: gemini-2.5-flash for speed, gemini-pro for quality.</p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                     <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-bold text-purple-800 uppercase flex items-center gap-1"><Key size={12}/> Primary API Key</label>
                        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-xs text-purple-600 hover:text-purple-800 font-bold flex items-center gap-1">
                           <ExternalLink size={10} /> Get Free Gemini Key
                        </a>
                     </div>
                     <input type="password" value={aiForm.primaryApiKey} onChange={e => setAiForm({...aiForm, primaryApiKey: e.target.value})} className={inputClass} placeholder="sk-..." />
                  </div>

                  <div>
                     <div className="flex justify-between items-center mb-2">
                        <label className="block text-xs font-bold text-gray-700 uppercase">Fallback API Keys (Round Robin)</label>
                        <button type="button" onClick={addAiFallbackKey} className="text-xs text-brand-blue hover:underline">+ Add Key</button>
                     </div>
                     <div className="space-y-2">
                        {aiForm.fallbackApiKeys.map((key, idx) => (
                           <div key={idx} className="flex gap-2">
                              <input type="password" value={key} onChange={e => updateAiFallbackKey(idx, e.target.value)} className={inputClass} placeholder={`Fallback Key ${idx + 1}`} />
                              <button type="button" onClick={() => removeAiFallbackKey(idx)} className="text-red-400 hover:text-red-600"><Trash2 size={18}/></button>
                           </div>
                        ))}
                        {aiForm.fallbackApiKeys.length === 0 && <p className="text-xs text-gray-400 italic">No fallback keys configured.</p>}
                     </div>
                  </div>

                  {aiForm.provider === 'custom' && (
                     <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Custom Base URL</label>
                        <input type="text" value={aiForm.customBaseUrl} onChange={e => setAiForm({...aiForm, customBaseUrl: e.target.value})} className={inputClass} placeholder="https://api.example.com/v1" />
                     </div>
                  )}

                  <button type="submit" className="w-full bg-brand-blue text-white font-bold py-3 rounded-xl hover:bg-sky-600 shadow-lg">Save Configuration</button>
               </form>
            </div>
         )}

         {activeSubTab === 'backup' && (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-8">
               <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Upload className="text-blue-600"/> Data Backup & Restore</h2>
               
               <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 text-center">
                     <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-blue-500">
                        <Download size={32}/>
                     </div>
                     <h3 className="font-bold text-lg text-gray-900 mb-2">Export Data</h3>
                     <p className="text-sm text-gray-600 mb-6">Download a complete JSON snapshot of packages, drivers, bookings, and settings.</p>
                     <button onClick={handleBackupExport} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg w-full">
                        Download Backup
                     </button>
                     {lastBackupDate && <p className="text-xs text-gray-400 mt-3">Last Export: {new Date(lastBackupDate).toLocaleString()}</p>}
                  </div>

                  <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 text-center">
                     <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-orange-500">
                        <RefreshCw size={32}/>
                     </div>
                     <h3 className="font-bold text-lg text-gray-900 mb-2">Restore Data</h3>
                     <p className="text-sm text-gray-600 mb-6">Upload a previously exported JSON file to overwrite current data.</p>
                     <label className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg w-full cursor-pointer inline-block">
                        <input type="file" accept=".json" onChange={handleBackupImport} className="hidden" />
                        Select File to Restore
                     </label>
                     <p className="text-xs text-red-400 mt-3 font-bold">Warning: This action cannot be undone.</p>
                  </div>
               </div>
            </div>
         )}

         {activeSubTab === 'seo' && (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-8">
               <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Globe className="text-green-600"/> Advanced SEO Configuration</h2>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">SEO/AEO/GEO Ready</span>
               </div>
               
               <form onSubmit={handleSeoSave} className="space-y-6">
                  {/* Basic Metadata */}
                  <div className="space-y-4">
                     <h3 className="font-bold text-gray-800 text-sm border-b pb-2">Global Metadata</h3>
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
                  </div>

                  {/* AEO Section */}
                  <div className="space-y-4">
                     <h3 className="font-bold text-purple-800 text-sm border-b border-purple-100 pb-2 flex items-center gap-2"><Sparkles size={14}/> Answer Engine Optimization (AI Search)</h3>
                     <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                           <div>
                              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Entity Type</label>
                              <select value={seoForm.entityType || 'TravelAgency'} onChange={e => setSeoForm({...seoForm, entityType: e.target.value as any})} className={inputClass}>
                                 <option value="TravelAgency">Travel Agency</option>
                                 <option value="LocalBusiness">Local Business</option>
                                 <option value="Organization">Organization</option>
                              </select>
                           </div>
                           <div>
                              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Authoritative Topic</label>
                              <input type="text" className={inputClass} value={seoForm.authoritativeTopic || ''} onChange={e => setSeoForm({...seoForm, authoritativeTopic: e.target.value})} placeholder="e.g. Luxury India Travel"/>
                           </div>
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Knowledge Graph Description</label>
                           <textarea 
                              className={inputClass + " h-20 text-sm"} 
                              value={seoForm.knowledgeGraphDesc || ''} 
                              onChange={e => setSeoForm({...seoForm, knowledgeGraphDesc: e.target.value})}
                              placeholder="Factual, concise description of your business for AI knowledge bases."
                           ></textarea>
                           <p className="text-[10px] text-gray-500 mt-1">Optimized for LLM ingestion (ChatGPT, Perplexity).</p>
                        </div>
                     </div>
                  </div>

                  {/* Technical SEO */}
                  <div className="space-y-4">
                     <h3 className="font-bold text-gray-800 text-sm border-b pb-2">Technical SEO</h3>
                     <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-gray-700">
                           <input type="checkbox" checked={seoForm.sitemapEnabled} onChange={e => setSeoForm({...seoForm, sitemapEnabled: e.target.checked})} className="accent-brand-green"/> Enable Sitemap
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-gray-700">
                           <input type="checkbox" checked={seoForm.robotsTxtEnabled} onChange={e => setSeoForm({...seoForm, robotsTxtEnabled: e.target.checked})} className="accent-brand-green"/> Enable robots.txt
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-gray-700">
                           <input type="checkbox" checked={seoForm.schemaMarkupEnabled} onChange={e => setSeoForm({...seoForm, schemaMarkupEnabled: e.target.checked})} className="accent-brand-green"/> Schema Markup
                        </label>
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Robots.txt Content</label>
                        <textarea className={inputClass + " font-mono text-xs h-24"} value={seoForm.robotsTxtContent} onChange={(e) => setSeoForm({...seoForm, robotsTxtContent: e.target.value})} />
                     </div>
                  </div>

                  {/* GEO & Analytics */}
                  <div className="grid md:grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Analytics ID (GA4)</label>
                        <input type="text" className={inputClass} value={seoForm.analyticsId} onChange={e => setSeoForm({...seoForm, analyticsId: e.target.value})} />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Geo Region Code</label>
                        <select 
                           value={seoForm.geoRegion} 
                           onChange={e => setSeoForm({...seoForm, geoRegion: e.target.value})} 
                           className={inputClass}
                        >
                           {geoOptions.map(opt => (
                              <option key={opt.code} value={opt.code}>{opt.code} - {opt.label}</option>
                           ))}
                        </select>
                     </div>
                  </div>

                  <button type="submit" className="w-full bg-brand-green text-white font-bold py-3 px-8 rounded-xl hover:bg-green-600 shadow-lg mt-4 transition-transform hover:-translate-y-0.5">Save Enhanced SEO Settings</button>
               </form>
            </div>
         )}

         {activeSubTab === 'error_pages' && (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-8">
               <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><AlertOctagon className="text-red-500"/> Error Pages & Maintenance</h2>
               
               <form onSubmit={handlePageSave} className="space-y-6">
                  <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-red-800">Maintenance Mode</h3>
                        <label className="relative inline-flex items-center cursor-pointer">
                           <input type="checkbox" className="sr-only peer" checked={pageForm.maintenanceMode} onChange={e => setPageForm({...pageForm, maintenanceMode: e.target.checked})} />
                           <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                        </label>
                     </div>
                     <p className="text-sm text-red-600">When enabled, only admins can access the site. All other users will see a maintenance screen.</p>
                  </div>

                  <div className="space-y-4">
                     <h3 className="font-bold text-gray-800 border-b pb-2">Custom 404 Page</h3>
                     <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Title</label>
                        <input type="text" className={inputClass} value={pageForm.error404.title} onChange={e => setPageForm({...pageForm, error404: {...pageForm.error404, title: e.target.value}})} />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Message</label>
                        <textarea className={inputClass} value={pageForm.error404.message} onChange={e => setPageForm({...pageForm, error404: {...pageForm.error404, message: e.target.value}})} />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Image URL</label>
                        <input type="text" className={inputClass} value={pageForm.error404.image} onChange={e => setPageForm({...pageForm, error404: {...pageForm.error404, image: e.target.value}})} />
                     </div>
                  </div>

                  <button type="submit" className="w-full bg-brand-blue text-white font-bold py-3 rounded-xl hover:bg-sky-600 shadow-lg">Save Page Settings</button>
               </form>
            </div>
         )}

         {activeSubTab === 'db' && (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-8">
               <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Database className="text-emerald-600"/> Database Configuration</h2>
               
               <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                  <div className="flex items-start">
                     <ShieldAlert size={20} className="text-yellow-500 mt-0.5 mr-2"/>
                     <div>
                        <p className="text-sm text-yellow-700 font-bold">Advanced Setting</p>
                        <p className="text-xs text-yellow-600">Changing these values will switch the backend connection to a different Supabase project. Ensure you have run the Schema SQL on the new project.</p>
                     </div>
                  </div>
               </div>

               <form onSubmit={handleDbSave} className="space-y-4">
                  <div>
                     <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Project Name (Reference)</label>
                     <input type="text" className={inputClass} value={dbConfig.projectName} onChange={e => setDbConfig({...dbConfig, projectName: e.target.value})} placeholder="My HolidayPot DB" />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Supabase URL</label>
                     <input type="text" className={inputClass} value={dbConfig.url} onChange={e => setDbConfig({...dbConfig, url: e.target.value})} placeholder="https://xyz.supabase.co" />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Anon Key</label>
                     <input type="password" className={inputClass} value={dbConfig.key} onChange={e => setDbConfig({...dbConfig, key: e.target.value})} placeholder="eyJ..." />
                  </div>
                  
                  <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 shadow-lg">Update Connection</button>
               </form>
            </div>
         )}

         {activeSubTab === 'security' && (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-8">
               <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Lock className="text-gray-700"/> Admin Security</h2>
               
               <form onSubmit={handleSecuritySave} className="space-y-4 max-w-md">
                  <div>
                     <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Current Password</label>
                     <input required type="password" className={inputClass} value={securityForm.currentPassword} onChange={e => setSecurityForm({...securityForm, currentPassword: e.target.value})} />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-700 uppercase mb-1">New Password</label>
                     <input required type="password" className={inputClass} value={securityForm.newPassword} onChange={e => setSecurityForm({...securityForm, newPassword: e.target.value})} />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Confirm New Password</label>
                     <input required type="password" className={inputClass} value={securityForm.confirmPassword} onChange={e => setSecurityForm({...securityForm, confirmPassword: e.target.value})} />
                  </div>
                  
                  <button type="submit" className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 shadow-lg">Change Password</button>
               </form>
            </div>
         )}

      </div>
    </div>
  );
};

export default AdminSettings;
