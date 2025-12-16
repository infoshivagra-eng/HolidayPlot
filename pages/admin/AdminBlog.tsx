
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Sparkles, Loader2, Save, X, Globe, Eye, FileText, HelpCircle, Image as ImageIcon, CheckCircle, ExternalLink, Bold, Italic, Heading, Type, ImagePlus, PenTool, Hash, Settings2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGlobal } from '../../GlobalContext';
import { BlogPost, FaqItem } from '../../types';
import { generateAIContent } from '../../utils';

const AdminBlog: React.FC = () => {
  const { blogPosts, addBlogPost, updateBlogPost, deleteBlogPost } = useGlobal();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'faq' | 'gallery'>('content');
  
  // Editor States
  const [editorMode, setEditorMode] = useState<'write' | 'preview'>('write');
  const [showImageModal, setShowImageModal] = useState(false);
  const [imagePromptText, setImagePromptText] = useState('');
  
  // Enhanced Image Generation Params
  const [imageParams, setImageParams] = useState({
    style: 'Any',
    mood: 'Any',
    lighting: 'Any'
  });

  const styles = ['Any', 'Cinematic', 'Minimalist', 'Vintage', 'Vibrant', 'Black & White', 'Drone Shot', 'Wide Angle', 'Close Up'];
  const moods = ['Any', 'Happy', 'Serene', 'Dark', 'Romantic', 'Adventurous', 'Professional', 'Cozy', 'Mysterious'];
  const lightings = ['Any', 'Daylight', 'Golden Hour', 'Blue Hour', 'Night', 'Studio', 'Neon', 'Natural', 'Dramatic'];

  const [formData, setFormData] = useState<BlogPost>({
    id: '',
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image: '',
    author: 'Admin',
    date: new Date().toISOString().split('T')[0],
    tags: [],
    status: 'Draft',
    seoTitle: '',
    seoDescription: '',
    geoFocus: '',
    faq: [],
    gallery: []
  });

  // FAQ Handlers
  const addFaq = () => setFormData(prev => ({ ...prev, faq: [...(prev.faq || []), { question: '', answer: '' }] }));
  const updateFaq = (idx: number, field: keyof FaqItem, value: string) => {
    const newFaq = [...(formData.faq || [])];
    newFaq[idx][field] = value;
    setFormData(prev => ({ ...prev, faq: newFaq }));
  };
  const removeFaq = (idx: number) => {
    const newFaq = [...(formData.faq || [])];
    newFaq.splice(idx, 1);
    setFormData(prev => ({ ...prev, faq: newFaq }));
  };

  // Gallery Handlers
  const addGalleryImage = () => setFormData(prev => ({ ...prev, gallery: [...(prev.gallery || []), ''] }));
  const updateGalleryImage = (idx: number, value: string) => {
    const newGallery = [...(formData.gallery || [])];
    newGallery[idx] = value;
    setFormData(prev => ({ ...prev, gallery: newGallery }));
  };
  const removeGalleryImage = (idx: number) => {
    const newGallery = [...(formData.gallery || [])];
    newGallery.splice(idx, 1);
    setFormData(prev => ({ ...prev, gallery: newGallery }));
  };

  const filteredPosts = blogPosts.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const resetForm = () => {
    setFormData({
      id: '', title: '', slug: '', excerpt: '', content: '', image: '',
      author: 'Admin', date: new Date().toISOString().split('T')[0], tags: [],
      status: 'Draft', seoTitle: '', seoDescription: '', geoFocus: '', faq: [], gallery: []
    });
    setEditingId(null);
    setActiveTab('content');
    setEditorMode('write');
  };

  const handleEditClick = (post: BlogPost) => {
    setEditingId(post.id);
    setFormData(post);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent, statusOverride?: 'Draft' | 'Published') => {
    e.preventDefault();
    const finalStatus = statusOverride || formData.status;
    
    const post: BlogPost = {
      ...formData,
      id: editingId || `b_${Date.now()}`,
      slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      status: finalStatus
    };

    if (editingId) {
      updateBlogPost(post);
    } else {
      addBlogPost(post);
    }
    setIsModalOpen(false);
    resetForm();
  };

  // --- AI HANDLERS ---

  const handleAiSmartGenerate = async () => {
    if (!formData.title) {
        alert("Please enter a Title first to guide the AI.");
        return;
    }
    setIsGenerating(true);
    try {
        const prompt = `Write a comprehensive, SEO-optimized travel blog post for the title: "${formData.title}".
        Focus on: GEO location ${formData.geoFocus || 'India'}.
        
        Return ONLY a JSON object with this exact structure:
        {
            "excerpt": "Short engaging summary (150 chars)",
            "content": "<p>Rich HTML content using <h2> and <h3>...</p>",
            "tags": ["tag1", "tag2"],
            "seoTitle": "Optimized Title",
            "seoDescription": "Optimized Meta Description"
        }`;

        const jsonStr = await generateAIContent(prompt);
        const data = JSON.parse(jsonStr);

        setFormData(prev => ({
            ...prev,
            excerpt: data.excerpt || prev.excerpt,
            content: data.content || prev.content,
            tags: data.tags || prev.tags,
            seoTitle: data.seoTitle || prev.seoTitle,
            seoDescription: data.seoDescription || prev.seoDescription
        }));
        
        alert("Content generated! Check the Content tab.");
    } catch (e: any) {
        alert("AI Generation failed: " + e.message);
    } finally {
        setIsGenerating(false);
    }
  };

  const handleAiKeywords = async () => {
      if (!formData.title) { alert("Enter a title first."); return; }
      setIsGenerating(true);
      try {
          const prompt = `Generate 5 trending, high-traffic SEO keywords/tags for a travel blog post titled "${formData.title}" focused on "${formData.geoFocus}". Return ONLY a comma-separated list of words (e.g. "Travel, India, Food").`;
          const result = await generateAIContent(prompt);
          const tags = result.split(',').map(t => t.trim().replace(/^#/, '')); // Remove hashtags if AI adds them
          setFormData(prev => ({ ...prev, tags }));
      } catch (e) {
          alert("Failed to generate keywords.");
      } finally {
          setIsGenerating(false);
      }
  };

  const handleAiFaqs = async () => {
      if (!formData.title) { alert("Enter a title first."); return; }
      setIsGenerating(true);
      try {
          const prompt = `Generate 4 relevant FAQs for a blog post titled "${formData.title}". Return ONLY a JSON array: [{"question": "...", "answer": "..."}]`;
          const jsonStr = await generateAIContent(prompt);
          const faqs = JSON.parse(jsonStr);
          setFormData(prev => ({ ...prev, faq: faqs }));
      } catch (e) {
          alert("Failed to generate FAQs");
      } finally {
          setIsGenerating(false);
      }
  };

  const handleAiGallery = async () => {
      if (!formData.title) { alert("Enter a title first."); return; }
      setIsGenerating(true);
      try {
          const prompt = `Generate 4 single-word visual search keywords for a blog post titled "${formData.title}". Return ONLY a JSON array of strings: ["beach", "forest"]`;
          const jsonStr = await generateAIContent(prompt);
          const keywords = JSON.parse(jsonStr);
          const images = keywords.map((k: string) => `https://source.unsplash.com/800x600/?${encodeURIComponent(k)}`);
          setFormData(prev => ({ ...prev, gallery: images }));
      } catch (e) {
          alert("Failed to generate gallery");
      } finally {
          setIsGenerating(false);
      }
  };

  // --- EDITOR HELPERS ---

  const insertContent = (tagOpen: string, tagClose: string = '', placeholder: string = '') => {
      // Logic for Textarea Mode
      if (editorMode === 'write') {
          const textarea = document.getElementById('contentEditor') as HTMLTextAreaElement;
          if (!textarea) return;
          
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const text = textarea.value;
          const selectedText = text.substring(start, end) || placeholder;
          
          const newText = text.substring(0, start) + tagOpen + selectedText + tagClose + text.substring(end);
          setFormData({ ...formData, content: newText });
          
          // Restore focus
          setTimeout(() => {
              textarea.focus();
              textarea.setSelectionRange(start + tagOpen.length, start + tagOpen.length + selectedText.length);
          }, 0);
      } 
      // Logic for Visual Preview Mode
      else {
          const newHtml = formData.content + tagOpen + placeholder + tagClose;
          setFormData({ ...formData, content: newHtml });
          // Note: In visual mode we append to end to avoid complex cursor tracking without a library
      }
  };

  const handleImageInsertClick = () => {
      let initialText = '';
      
      // 1. Try to get selection from Textarea if in write mode
      if (editorMode === 'write') {
          const textarea = document.getElementById('contentEditor') as HTMLTextAreaElement;
          if (textarea && textarea.selectionStart !== textarea.selectionEnd) {
              initialText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
          }
      } 
      // 2. Try to get selection from Visual mode
      else {
          const selection = window.getSelection();
          if (selection && selection.toString().length > 0) {
              initialText = selection.toString();
          }
      }

      // 3. Fallback to Title + Context if no text selected
      if (!initialText.trim()) {
          initialText = formData.title ? `${formData.title} ${formData.geoFocus ? 'in ' + formData.geoFocus : ''}` : '';
      }

      setImagePromptText(initialText);
      setImageParams({ style: 'Any', mood: 'Any', lighting: 'Any' });
      setShowImageModal(true);
  };

  const executeImageInsert = async () => {
      if (!imagePromptText) return;
      setIsGenerating(true);
      setShowImageModal(false);
      try {
          // Construct a complex prompt based on params
          const prompt = `
            Analyze this image request:
            Description: "${imagePromptText}"
            Style Preference: "${imageParams.style}"
            Mood: "${imageParams.mood}"
            Lighting: "${imageParams.lighting}"

            Task: Provide ONE single highly relevant search keyword or short phrase (max 2-3 words) for a stock photo API (Unsplash) that best matches this description and style.
            Constraint: Return ONLY the keyword string. No explanations.
          `;
          
          const keywordRaw = await generateAIContent(prompt);
          const keyword = keywordRaw.replace(/[^a-zA-Z0-9 ]/g, '').trim();
          
          // Use params in caption if specific
          let caption = imagePromptText;
          if (imageParams.style !== 'Any') caption += ` (${imageParams.style} style)`;

          const imgTag = `\n<figure class="my-8">\n  <img src="https://source.unsplash.com/800x600/?${encodeURIComponent(keyword)}" alt="${keyword}" class="w-full rounded-xl shadow-md object-cover" />\n  <figcaption class="text-center text-xs text-gray-500 italic mt-2">${caption}</figcaption>\n</figure>\n`;
          
          insertContent(imgTag);
      } catch (e) {
          alert("Failed to generate image.");
      } finally {
          setIsGenerating(false);
      }
  };

  const inputClass = "w-full p-3 bg-white text-gray-900 border border-gray-300 rounded-lg outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue";

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Blog Manager</h1>
            <p className="text-sm text-gray-500">Create rich, SEO-friendly content with FAQs and Galleries.</p>
        </div>
        <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="bg-brand-blue text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-sky-600 transition-colors shadow-lg">
          <Plus size={20} /> New Post
        </button>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
         <div className="p-4 border-b border-gray-100 flex gap-4">
            <div className="relative flex-grow">
               <Search className="absolute left-3 top-2.5 text-gray-400" size={18}/>
               <input 
                  type="text" 
                  placeholder="Search posts..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-brand-blue"
               />
            </div>
         </div>
         <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
               <tr>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase">Post Title</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase">Author</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase">Date</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {filteredPosts.map(post => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                     <td className="p-4">
                        <div className="font-bold text-gray-900 line-clamp-1">{post.title}</div>
                        <div className="text-xs text-gray-500">/{post.slug}</div>
                     </td>
                     <td className="p-4 text-sm text-gray-600">{post.author}</td>
                     <td className="p-4 text-sm text-gray-600">{post.date}</td>
                     <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${post.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                           {post.status}
                        </span>
                     </td>
                     <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                           {post.status === 'Published' && (
                              <Link to={`/blog/${post.slug}`} target="_blank" className="p-1.5 text-blue-500 hover:bg-blue-50 rounded" title="View Live">
                                 <ExternalLink size={16}/>
                              </Link>
                           )}
                           <button onClick={() => handleEditClick(post)} className="p-1.5 text-gray-600 hover:bg-gray-200 rounded"><Edit size={16}/></button>
                           <button onClick={() => { if(window.confirm('Delete post?')) deleteBlogPost(post.id); }} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 size={16}/></button>
                        </div>
                     </td>
                  </tr>
               ))}
               {filteredPosts.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-400">No posts found.</td></tr>}
            </tbody>
         </table>
      </div>

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
           <div className="bg-white rounded-2xl w-full max-w-6xl h-[95vh] flex flex-col shadow-2xl overflow-hidden relative">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                 <h2 className="text-xl font-bold text-gray-900">{editingId ? 'Edit Post' : 'New Post'}</h2>
                 <div className="flex gap-2">
                    <button 
                       onClick={handleAiSmartGenerate} 
                       disabled={isGenerating}
                       className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-purple-200 transition-colors"
                    >
                       {isGenerating ? <Loader2 className="animate-spin" size={16}/> : <Sparkles size={16}/>} Auto-Write Post
                    </button>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:bg-gray-200 p-2 rounded-full"><X size={20}/></button>
                 </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-100 bg-white">
                 <button onClick={() => setActiveTab('content')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'content' ? 'border-brand-blue text-brand-blue bg-blue-50' : 'border-transparent text-gray-500'}`}>
                    <FileText size={16}/> Content & SEO
                 </button>
                 <button onClick={() => setActiveTab('faq')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'faq' ? 'border-brand-blue text-brand-blue bg-blue-50' : 'border-transparent text-gray-500'}`}>
                    <HelpCircle size={16}/> Q&A (AEO)
                 </button>
                 <button onClick={() => setActiveTab('gallery')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'gallery' ? 'border-brand-blue text-brand-blue bg-blue-50' : 'border-transparent text-gray-500'}`}>
                    <ImageIcon size={16}/> Gallery
                 </button>
              </div>
              
              <div className="flex-grow overflow-y-auto p-8 bg-gray-50/50 relative">
                 <form id="blogForm" className="space-y-6">
                    
                    {/* CONTENT TAB */}
                    {activeTab === 'content' && (
                        <>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                                    <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={inputClass} placeholder="Enter a catchy title..."/>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Slug (URL)</label>
                                    <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className={inputClass} placeholder="auto-generated-if-blank"/>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Author</label>
                                    <input type="text" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} className={inputClass}/>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Geo Focus (City/Region)</label>
                                    <input type="text" value={formData.geoFocus} onChange={e => setFormData({...formData, geoFocus: e.target.value})} className={inputClass} placeholder="e.g. Kerala"/>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cover Image URL</label>
                                    <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className={inputClass}/>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Excerpt (Meta Desc)</label>
                                <textarea rows={2} value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} className={inputClass + " resize-none"}></textarea>
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
                                        <div className="w-px h-6 bg-gray-300 mx-1"></div>
                                        <button 
                                            type="button" 
                                            onClick={handleImageInsertClick} 
                                            disabled={isGenerating}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/20 rounded text-xs font-bold transition-colors"
                                            title="Insert Image from AI"
                                        >
                                            {isGenerating ? <Loader2 className="animate-spin" size={14}/> : <ImagePlus size={14}/>} Insert AI Image
                                        </button>
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
                                        id="contentEditor"
                                        value={formData.content} 
                                        onChange={e => setFormData({...formData, content: e.target.value})} 
                                        className="w-full h-full p-6 bg-white text-gray-900 outline-none font-mono text-sm resize-none" 
                                        placeholder="<p>Start writing your amazing story here...</p>"
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
                                            dangerouslySetInnerHTML={{ __html: formData.content || '<p class="text-gray-400 italic">Start writing content to see a preview...</p>' }}
                                            onBlur={(e) => setFormData({ ...formData, content: e.currentTarget.innerHTML })}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-bold text-gray-800 flex items-center gap-2"><Globe size={16}/> SEO Override</h3>
                                    <button 
                                        type="button" 
                                        onClick={handleAiKeywords} 
                                        disabled={isGenerating}
                                        className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded font-bold hover:bg-orange-200 flex items-center gap-1"
                                    >
                                        <Hash size={12}/> Generate Trending Keywords
                                    </button>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <input type="text" placeholder="SEO Title (if different)" value={formData.seoTitle || ''} onChange={e => setFormData({...formData, seoTitle: e.target.value})} className={inputClass}/>
                                    <input type="text" placeholder="SEO Keywords (comma separated)" value={formData.tags.join(', ')} onChange={e => setFormData({...formData, tags: e.target.value.split(',').map(s=>s.trim())})} className={inputClass}/>
                                </div>
                            </div>
                        </>
                    )}

                    {/* FAQ TAB */}
                    {activeTab === 'faq' && (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-gray-800">Frequently Asked Questions (FAQ Schema)</h3>
                                <div className="flex gap-2">
                                    <button type="button" onClick={handleAiFaqs} disabled={isGenerating} className="text-sm bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg font-bold hover:bg-purple-100 flex items-center gap-1">
                                        {isGenerating ? <Loader2 className="animate-spin" size={14}/> : <Sparkles size={14}/>} Generate FAQs
                                    </button>
                                    <button type="button" onClick={addFaq} className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-100 flex items-center gap-1">
                                        <Plus size={16}/> Add Manual
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {formData.faq && formData.faq.map((item, idx) => (
                                    <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 relative group shadow-sm">
                                        <button type="button" onClick={() => removeFaq(idx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><X size={16}/></button>
                                        <div className="mb-2">
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Question</label>
                                            <input type="text" value={item.question} onChange={e => updateFaq(idx, 'question', e.target.value)} className={inputClass}/>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Answer</label>
                                            <textarea rows={2} value={item.answer} onChange={e => updateFaq(idx, 'answer', e.target.value)} className={inputClass + " resize-none"}></textarea>
                                        </div>
                                    </div>
                                ))}
                                {(!formData.faq || formData.faq.length === 0) && <div className="text-center p-12 text-gray-400 bg-gray-100 rounded-xl border border-dashed border-gray-300">No FAQs added yet. Use AI to generate some instantly.</div>}
                            </div>
                        </div>
                    )}

                    {/* GALLERY TAB */}
                    {activeTab === 'gallery' && (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-gray-800">Image Gallery</h3>
                                <div className="flex gap-2">
                                    <button type="button" onClick={handleAiGallery} disabled={isGenerating} className="text-sm bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg font-bold hover:bg-purple-100 flex items-center gap-1">
                                        {isGenerating ? <Loader2 className="animate-spin" size={14}/> : <Sparkles size={14}/>} Auto Gallery
                                    </button>
                                    <button type="button" onClick={addGalleryImage} className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-100 flex items-center gap-1">
                                        <Plus size={16}/> Add Manual
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {formData.gallery && formData.gallery.map((url, idx) => (
                                    <div key={idx} className="flex gap-2 items-center bg-white p-2 rounded-lg border border-gray-200">
                                        <div className="w-20 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                                            {url ? <img src={url} alt="" className="w-full h-full object-cover"/> : <ImageIcon className="text-gray-400 absolute inset-0 m-auto"/>}
                                        </div>
                                        <input type="text" value={url} onChange={e => updateGalleryImage(idx, e.target.value)} className={inputClass} placeholder="Image URL"/>
                                        <button type="button" onClick={() => removeGalleryImage(idx)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg"><Trash2 size={18}/></button>
                                    </div>
                                ))}
                                {(!formData.gallery || formData.gallery.length === 0) && <div className="text-center p-12 text-gray-400 bg-gray-100 rounded-xl border border-dashed border-gray-300">No images. Generate a gallery with AI.</div>}
                            </div>
                        </div>
                    )}

                 </form>
              </div>

              <div className="p-6 border-t border-gray-100 bg-white flex justify-between items-center">
                 <div className="text-sm text-gray-500">
                    Status: <span className={`font-bold ${formData.status === 'Published' ? 'text-green-600' : 'text-orange-500'}`}>{formData.status}</span>
                 </div>
                 <div className="flex gap-3">
                    <button onClick={(e) => handleSave(e, 'Draft')} className="bg-gray-100 text-gray-700 font-bold py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors">
                        Save Draft
                    </button>
                    <button onClick={(e) => handleSave(e, 'Published')} className="bg-brand-green text-white font-bold py-3 px-6 rounded-xl hover:bg-green-600 transition-colors shadow-lg flex items-center gap-2">
                        <CheckCircle size={20}/> Publish Now
                    </button>
                 </div>
              </div>

              {/* Image Insertion Modal (Nested Overlay) */}
              {showImageModal && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-fade-in">
                          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                              <Sparkles className="text-purple-600" size={20}/> AI Image Finder
                          </h3>
                          <div className="mb-4">
                              <label className="block text-sm font-bold text-gray-700 mb-2">Describe the image you want</label>
                              <textarea 
                                  value={imagePromptText}
                                  onChange={(e) => setImagePromptText(e.target.value)}
                                  className="w-full p-3 border border-gray-300 rounded-lg h-24 resize-none focus:ring-2 focus:ring-brand-blue outline-none"
                                  placeholder="e.g. A serene houseboat floating on Kerala backwaters at sunset"
                              ></textarea>
                              
                              <div className="mt-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                  <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-500 uppercase">
                                      <Settings2 size={12}/> Refine Results
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                      <select value={imageParams.style} onChange={e => setImageParams({...imageParams, style: e.target.value})} className="w-full p-2 bg-white text-gray-900 text-xs border border-gray-300 rounded outline-none">
                                          {styles.map(s => <option key={s} value={s}>{s === 'Any' ? 'Style: Any' : s}</option>)}
                                      </select>
                                      <select value={imageParams.mood} onChange={e => setImageParams({...imageParams, mood: e.target.value})} className="w-full p-2 bg-white text-gray-900 text-xs border border-gray-300 rounded outline-none">
                                          {moods.map(m => <option key={m} value={m}>{m === 'Any' ? 'Mood: Any' : m}</option>)}
                                      </select>
                                      <select value={imageParams.lighting} onChange={e => setImageParams({...imageParams, lighting: e.target.value})} className="w-full p-2 bg-white text-gray-900 text-xs border border-gray-300 rounded outline-none col-span-2">
                                          {lightings.map(l => <option key={l} value={l}>{l === 'Any' ? 'Lighting: Any' : l}</option>)}
                                      </select>
                                  </div>
                              </div>
                              <p className="text-xs text-gray-500 mt-2">AI will find the best visual match from stock libraries based on your description and filters.</p>
                          </div>
                          <div className="flex gap-3 justify-end">
                              <button onClick={() => setShowImageModal(false)} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg">Cancel</button>
                              <button 
                                  onClick={executeImageInsert} 
                                  disabled={!imagePromptText}
                                  className="px-4 py-2 bg-brand-blue text-white font-bold rounded-lg hover:bg-sky-600 disabled:opacity-50"
                              >
                                  Generate & Insert
                              </button>
                          </div>
                      </div>
                  </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlog;
