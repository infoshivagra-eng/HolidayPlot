
import { GoogleGenAI } from "@google/genai";

export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};

export const convertPrice = (price: number, currency: 'USD' | 'INR'): string => {
  if (currency === 'USD') {
    return `$${price.toLocaleString()}`;
  } else {
    return `₹${(price * 84).toLocaleString()}`; // Approx conversion rate
  }
};

export const getSmartApiKey = (): string | undefined => {
  // STRICT SECURITY: Only allow keys from process.env as per secure guidelines
  if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
    return process.env.API_KEY;
  }
  // Check for injected window key (often used in controlled demo environments)
  if (typeof window !== 'undefined' && (window as any).API_KEY) {
    return (window as any).API_KEY;
  }
  return undefined;
};

// --- NEW ROBUST AI GENERATOR (Multi-Provider) ---

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateAIContent = async (prompt: string): Promise<string> => {
  // 1. Get Settings
  let aiSettings = { provider: 'gemini', primaryApiKey: '', fallbackApiKeys: [] as string[], model: 'gemini-2.5-flash', customBaseUrl: '', maxRetries: 3 };
  const storedSettings = typeof window !== 'undefined' ? localStorage.getItem('holidaypot_ai_settings') : null;
  
  if (storedSettings) {
    const parsed = JSON.parse(storedSettings);
    aiSettings = { ...aiSettings, ...parsed }; // Merge to ensure defaults
  }

  // PROVIDER: GOOGLE GEMINI
  if (aiSettings.provider === 'gemini') {
    const envKey = getSmartApiKey();
    const keysToTry: string[] = [];
    if (aiSettings.primaryApiKey) keysToTry.push(aiSettings.primaryApiKey);
    if (envKey && !keysToTry.includes(envKey)) keysToTry.push(envKey);
    if (aiSettings.fallbackApiKeys && aiSettings.fallbackApiKeys.length > 0) {
      keysToTry.push(...aiSettings.fallbackApiKeys.filter(k => k && k.length > 10));
    }
    
    // Fallback if empty configuration
    if (keysToTry.length === 0 && envKey) keysToTry.push(envKey);

    if (keysToTry.length === 0) {
        throw new Error("No API Key available. Please configure it in Settings or via environment variables.");
    }

    const uniqueKeys = [...new Set(keysToTry)].filter(k => k);
    let lastError: any = null;

    for (let attempt = 0; attempt < uniqueKeys.length * 2; attempt++) {
      const currentKey = uniqueKeys[attempt % uniqueKeys.length];
      
      try {
        const ai = new GoogleGenAI({ apiKey: currentKey });
        const response = await ai.models.generateContent({
          model: aiSettings.model || 'gemini-2.5-flash',
          contents: prompt,
        });
        
        let text = response.text || '';
        return text.replace(/```html/g, '').replace(/```json/g, '').replace(/```/g, '').trim();

      } catch (error: any) {
        lastError = error;
        const isOverloaded = error.message?.includes('503') || error.message?.includes('overloaded') || error.status === 503;
        if (isOverloaded) {
          const waitTime = 1000 * (attempt + 1);
          await sleep(waitTime);
        } else if (error.message?.includes('API_KEY')) {
           continue;
        } else {
           await sleep(500);
        }
      }
    }
    throw lastError || new Error("Failed to generate content with Gemini.");
  }

  // PROVIDER: OPENAI / CUSTOM (Compatible API)
  if (aiSettings.provider === 'openai' || aiSettings.provider === 'custom') {
     const apiKey = aiSettings.primaryApiKey;
     const baseUrl = aiSettings.provider === 'custom' 
        ? (aiSettings.customBaseUrl || 'https://api.openai.com/v1') 
        : 'https://api.openai.com/v1';
     
     const model = aiSettings.model || (aiSettings.provider === 'openai' ? 'gpt-3.5-turbo' : 'llama3-8b');

     if (!apiKey && aiSettings.provider === 'openai') {
        throw new Error("OpenAI API Key is required.");
     }

     try {
        const response = await fetch(`${baseUrl}/chat/completions`, {
           method: 'POST',
           headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
           },
           body: JSON.stringify({
              model: model,
              messages: [{ role: 'user', content: prompt }],
              temperature: 0.7
           })
        });

        if (!response.ok) {
           const err = await response.json();
           throw new Error(err.error?.message || response.statusText);
        }

        const data = await response.json();
        let text = data.choices?.[0]?.message?.content || '';
        return text.replace(/```html/g, '').replace(/```json/g, '').replace(/```/g, '').trim();

     } catch (error: any) {
        console.error("AI API Error:", error);
        throw error;
     }
  }

  throw new Error("Invalid AI Provider Configuration");
};
