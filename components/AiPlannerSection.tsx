
import React, { useState } from 'react';
import { Sparkles, Map, Calendar, Wallet, User, Loader2, ArrowRight, AlertTriangle, FileDown, X, Mail, Phone, MessageSquare } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { useCurrency } from '../CurrencyContext';
import { getSmartApiKey } from '../utils';
import { useGlobal } from '../GlobalContext';

interface AiPlannerSectionProps {
  embedded?: boolean;
}

const AiPlannerSection: React.FC<AiPlannerSectionProps> = ({ embedded = false }) => {
  const { currency } = useCurrency();
  const { companyProfile, addBooking } = useGlobal(); // Access global data and actions
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<string>('');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [userForm, setUserForm] = useState({ 
    name: '', 
    phone: '', 
    email: '',
    planningDate: '',
    message: '' 
  });
  
  const [formData, setFormData] = useState({
    destination: '',
    days: 3,
    budget: 'Moderate',
    travelers: 'Couple',
    interests: ''
  });

  const generateItinerary = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setItinerary('');

    try {
      const apiKey = getSmartApiKey();
      
      if (!apiKey) {
        throw new Error("Missing API Key. Please set API_KEY or VITE_API_KEY in your environment variables.");
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Create a detailed ${formData.days}-day travel itinerary for ${formData.destination || 'a surprise destination in India'}, India. 
      Budget: ${formData.budget} (${currency}). 
      Group: ${formData.travelers}. 
      Interests: ${formData.interests || 'General sightseeing'}. 
      
      Format the response using HTML tags for styling:
      - Use <h3 class="text-xl font-bold text-brand-blue mt-6 mb-2">Day X: Title</h3> for days.
      - Use <ul class="list-disc pl-5 space-y-2 mb-4 text-gray-700"> for lists.
      - Use <strong> for emphasis.
      - Use <p class="mb-2"> for paragraphs.
      
      Make it engaging, vibrant, and practical. Include estimated costs in ${currency}. 
      Do not include markdown code blocks (like \`\`\`html), just return the raw HTML content.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      // Clean up potential markdown code blocks if the model includes them despite instructions
      let text = response.text || '';
      text = text.replace(/```html/g, '').replace(/```/g, '');

      setItinerary(text);
    } catch (error: any) {
      console.error("Error generating itinerary:", error);
      const msg = error.message || "Unknown error occurred";
      
      // Detailed error message for UI
      setItinerary(`
        <div class="bg-red-50 p-6 rounded-xl border border-red-200 text-red-800">
          <div class="flex items-start gap-3">
             <div class="bg-red-100 p-2 rounded-full text-red-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
             </div>
             <div>
                <h4 class="font-bold text-lg mb-1">Planning Failed</h4>
                <p class="text-sm mb-3">We encountered an issue while generating your trip plan.</p>
                <div class="bg-white p-3 rounded-lg border border-red-100 font-mono text-xs text-red-600 break-all">
                   Error: ${msg}
                </div>
                ${msg.includes("Key") ? `<p class="text-xs mt-3 text-red-700"><strong>Note for Admin:</strong> Ensure <code>API_KEY</code> or <code>VITE_API_KEY</code> is set in your Netlify/Vercel environment settings.</p>` : ''}
             </div>
          </div>
        </div>
      `);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveClick = () => {
    setShowModal(true);
  };

  const handleConfirmSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Create Enquiry Record in System
    addBooking({
      id: `ENQ-${Date.now()}`,
      userId: 'guest',
      itemId: 'ai-plan',
      itemName: `AI Trip to ${formData.destination || 'India'}`,
      customerName: userForm.name,
      customerEmail: userForm.email,
      customerPhone: userForm.phone,
      type: 'AI Plan',
      date: new Date().toISOString(),
      travelDate: userForm.planningDate,
      status: 'Pending',
      totalAmount: 0, // AI Plans are initially enquiries
      paid: false,
      travelers: 1, // Default or parsed from group size
      message: userForm.message
    });

    // 2. WhatsApp Logic
    // Strip HTML to get clean text for message
    const plainText = itinerary.replace(/<[^>]+>/g, '\n').replace(/\n\s*\n/g, '\n').trim();
    
    const companyFooter = `
------------------------------
Explore with **${companyProfile.name}**
📍 ${companyProfile.address}
📞 ${companyProfile.phone}
🌐 ${companyProfile.website || window.location.origin}`;

    const whatsappText = `*My HolidayPot Itinerary for ${formData.destination || 'Trip'}*\n\n*Planned for:* ${userForm.planningDate || 'Flexible Dates'}\n*Traveler:* ${userForm.name}\n\n${userForm.message ? `*Note:* ${userForm.message}\n\n` : ''}${plainText}\n${companyFooter}`;
    
    // Clean phone number (remove non-digits)
    const phoneClean = userForm.phone.replace(/\D/g,'');
    const whatsappUrl = `https://wa.me/${phoneClean}?text=${encodeURIComponent(whatsappText)}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
    
    // 3. Email Simulation (Toast/Alert)
    alert(`Itinerary sent to ${userForm.email} & Enquiry logged!`);
    
    // 4. Trigger Browser Print (User can save as PDF)
    window.print();
    
    setShowModal(false);
  };

  return (
    <div className={`${embedded ? 'bg-transparent' : 'bg-white rounded-3xl shadow-xl border border-gray-100 p-8'}`}>
      {!embedded && (
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900">
          <span className="w-8 h-8 bg-brand-orange text-white rounded-lg flex items-center justify-center text-sm">1</span>
          Plan Your Trip
        </h2>
      )}
      
      <div className={`grid ${itinerary ? 'lg:grid-cols-2' : 'grid-cols-1'} gap-8 transition-all duration-500`}>
        <div className="h-fit">
           <form onSubmit={generateItinerary} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Destination (India)</label>
              <div className="relative">
                <Map className="absolute left-3 top-3 text-gray-400" size={18}/>
                <input 
                  type="text" 
                  value={formData.destination}
                  onChange={(e) => setFormData({...formData, destination: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-white text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none transition-all placeholder-gray-400"
                  placeholder="e.g. Kerala, Jaipur..."
                  required={!embedded}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Days</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 text-gray-400" size={18}/>
                  <input 
                    type="number" 
                    min="1" 
                    max="30"
                    value={formData.days}
                    onChange={(e) => setFormData({...formData, days: parseInt(e.target.value)})}
                    className="w-full pl-10 pr-4 py-3 bg-white text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                 <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Budget</label>
                 <div className="relative">
                  <Wallet className="absolute left-3 top-3 text-gray-400" size={18}/>
                  <select 
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-white text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none transition-all appearance-none"
                  >
                    <option>Budget</option>
                    <option>Moderate</option>
                    <option>Luxury</option>
                  </select>
                 </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Travelers</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={18}/>
                <select 
                  value={formData.travelers}
                  onChange={(e) => setFormData({...formData, travelers: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-white text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none transition-all appearance-none"
                >
                  <option>Solo</option>
                  <option>Couple</option>
                  <option>Family</option>
                  <option>Friends</option>
                </select>
              </div>
            </div>

            {!embedded && (
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Interests</label>
                <textarea 
                  value={formData.interests}
                  onChange={(e) => setFormData({...formData, interests: e.target.value})}
                  className="w-full p-3 bg-white text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none transition-all h-20 resize-none placeholder-gray-400"
                  placeholder="e.g. Vegan food, History, Hiking..."
                ></textarea>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-brand-orange to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 rounded-xl shadow-lg transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 className="animate-spin" size={18}/> Planning...</> : <><Sparkles size={18} /> Generate Plan</>}
            </button>
          </form>
        </div>

        {/* Results Pane - Visible when itinerary exists */}
        {itinerary && (
           <div className="bg-white rounded-xl shadow-inner p-6 border border-gray-100 max-h-[500px] overflow-y-auto custom-scrollbar animate-fade-in">
              <h3 className="text-xl font-bold mb-4 text-brand-blue flex items-center gap-2 sticky top-0 bg-white/95 backdrop-blur py-2 border-b border-gray-100">
                 <Sparkles size={20} className="text-yellow-400 fill-current"/> Your AI Itinerary
              </h3>
              <div id="printable-itinerary" className="prose prose-sm prose-blue max-w-none text-gray-700">
                <div dangerouslySetInnerHTML={{ __html: itinerary }} />
              </div>
              
              {!itinerary.includes("Planning Failed") && (
                <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                   <button 
                      onClick={handleSaveClick}
                      className="text-brand-orange font-bold text-sm hover:underline flex items-center justify-center gap-1 mx-auto bg-orange-50 px-4 py-2 rounded-full hover:bg-orange-100 transition-colors"
                   >
                      <FileDown size={16}/> Save & Send Enquiry
                   </button>
                </div>
              )}
           </div>
        )}
      </div>

      {/* User Details Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto">
                <button 
                    onClick={() => setShowModal(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X size={24}/>
                </button>
                
                <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <FileDown size={24}/>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Finalize Your Plan</h3>
                    <p className="text-sm text-gray-500">Save itinerary PDF, send to WhatsApp & alert our team.</p>
                </div>
                
                <form onSubmit={handleConfirmSave} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Your Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400" size={18}/>
                            <input 
                                required
                                type="text" 
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue"
                                placeholder="John Doe"
                                value={userForm.name}
                                onChange={e => setUserForm({...userForm, name: e.target.value})}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">WhatsApp Number</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 text-gray-400" size={18}/>
                            <input 
                                required
                                type="tel" 
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue"
                                placeholder="919876543210"
                                value={userForm.phone}
                                onChange={e => setUserForm({...userForm, phone: e.target.value})}
                            />
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">Include country code without + (e.g., 9198...)</p>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-gray-400" size={18}/>
                            <input 
                                required
                                type="email" 
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue"
                                placeholder="john@example.com"
                                value={userForm.email}
                                onChange={e => setUserForm({...userForm, email: e.target.value})}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Planning Travel Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3 text-gray-400" size={18}/>
                            <input 
                                required
                                type="date" 
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue text-gray-700"
                                value={userForm.planningDate}
                                onChange={e => setUserForm({...userForm, planningDate: e.target.value})}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Any Specific Message?</label>
                        <div className="relative">
                            <MessageSquare className="absolute left-3 top-3 text-gray-400" size={18}/>
                            <textarea
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue resize-none h-24"
                                placeholder="E.g., I want to add a visit to Taj Mahal..."
                                value={userForm.message}
                                onChange={e => setUserForm({...userForm, message: e.target.value})}
                            ></textarea>
                        </div>
                    </div>
                    
                    <button 
                        type="submit"
                        className="w-full bg-brand-green text-white font-bold py-3 rounded-xl hover:bg-green-600 transition-colors shadow-lg flex items-center justify-center gap-2"
                    >
                        Save & Send to WhatsApp
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default AiPlannerSection;
