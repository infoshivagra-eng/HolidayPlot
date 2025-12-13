
import React, { useState } from 'react';
import { Sparkles, Map, Calendar, Wallet, User, Loader2, ArrowRight } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { useCurrency } from '../CurrencyContext';

interface AiPlannerSectionProps {
  embedded?: boolean;
}

const AiPlannerSection: React.FC<AiPlannerSectionProps> = ({ embedded = false }) => {
  const { currency } = useCurrency();
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<string>('');
  
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
      // Validate API Key existence before making request
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        throw new Error("API Key is missing. Please check your environment configuration.");
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Create a detailed ${formData.days}-day travel itinerary for ${formData.destination || 'a surprise destination in India'}, India. 
      Budget: ${formData.budget} (${currency}). 
      Group: ${formData.travelers}. 
      Interests: ${formData.interests || 'General sightseeing'}. 
      
      Format the response using HTML tags for styling (e.g., <h3 class="text-xl font-bold text-brand-blue mt-4">Day 1</h3>, <ul class="list-disc pl-5 space-y-2 mt-2"><li>Activity</li></ul>, <strong>Bold</strong>). 
      Make it engaging and practical. Include estimated costs in ${currency}.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      setItinerary(response.text);
    } catch (error: any) {
      console.error("Error generating itinerary:", error);
      const msg = error.message || "Unknown error occurred";
      
      // Detailed error message for UI
      setItinerary(`
        <div class="bg-red-50 p-4 rounded-xl border border-red-200 text-red-700">
          <div class="font-bold flex items-center gap-2">
             <span>⚠️</span>
             Planning Failed
          </div>
          <p class="text-sm mt-1">We couldn't generate your plan.</p>
          <p class="text-xs mt-2 font-mono bg-red-100 p-2 rounded">Error: ${msg}</p>
        </div>
      `);
    } finally {
      setLoading(false);
    }
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
              <h3 className="text-xl font-bold mb-4 text-brand-blue flex items-center gap-2">
                 <Sparkles size={20} className="text-yellow-400 fill-current"/> Your AI Itinerary
              </h3>
              <div className="prose prose-sm prose-blue max-w-none text-gray-700">
                <div dangerouslySetInnerHTML={{ __html: itinerary }} />
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                 <button className="text-brand-orange font-bold text-sm hover:underline flex items-center justify-center gap-1 mx-auto">
                    Save this Plan (PDF) <ArrowRight size={14}/>
                 </button>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default AiPlannerSection;
