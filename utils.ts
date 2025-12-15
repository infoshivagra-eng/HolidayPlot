
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
  // Priority 1: Check standard process.env (Build tools)
  if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
    return process.env.API_KEY;
  }
  
  // Priority 2: Check Vite env vars
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) {
      // @ts-ignore
      return import.meta.env.VITE_API_KEY;
    }
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.API_KEY) {
       // @ts-ignore
      return import.meta.env.API_KEY;
    }
  } catch (e) {}

  // Priority 3: Check global window object (Runtime injection)
  if (typeof window !== 'undefined' && (window as any).API_KEY) {
    return (window as any).API_KEY;
  }

  // Priority 4: Fallback to the provided key
  return "AIzaSyBwZxqDYvF5QJ_tq1S3829TlSQFncFEF4Q";
};

// --- NEW ROBUST AI GENERATOR ---

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateAIContent = async (prompt: string): Promise<string> => {
  // 1. Get Settings from LocalStorage (managed by Admin)
  let aiSettings = { primaryApiKey: '', fallbackApiKeys: [] as string[], model: 'gemini-2.5-flash', maxRetries: 3 };
  const storedSettings = typeof window !== 'undefined' ? localStorage.getItem('holidaypot_ai_settings') : null;
  
  if (storedSettings) {
    aiSettings = JSON.parse(storedSettings);
  }

  // 2. Build list of keys to try: User Primary -> Env Var -> User Fallbacks -> Hardcoded Fallback
  const envKey = getSmartApiKey();
  const keysToTry: string[] = [];
  
  if (aiSettings.primaryApiKey) keysToTry.push(aiSettings.primaryApiKey);
  if (envKey && !keysToTry.includes(envKey)) keysToTry.push(envKey);
  if (aiSettings.fallbackApiKeys && aiSettings.fallbackApiKeys.length > 0) {
    keysToTry.push(...aiSettings.fallbackApiKeys.filter(k => k && k.length > 10));
  }

  // Remove duplicates
  const uniqueKeys = [...new Set(keysToTry)];

  if (uniqueKeys.length === 0) {
    throw new Error("No valid API Keys available. Please configure them in Admin Settings.");
  }

  let lastError: any = null;

  // 3. Retry Logic Loop
  // We iterate through available keys. If we run out of keys but still have retries, we loop back or wait.
  for (let attempt = 0; attempt < uniqueKeys.length * 2; attempt++) {
    const currentKey = uniqueKeys[attempt % uniqueKeys.length];
    
    try {
      const ai = new GoogleGenAI({ apiKey: currentKey });
      
      console.log(`[AI] Attempt ${attempt + 1} using key ending in ...${currentKey.slice(-4)}`);

      const response = await ai.models.generateContent({
        model: aiSettings.model || 'gemini-2.5-flash',
        contents: prompt,
      });

      // Success!
      let text = response.text || '';
      return text.replace(/```html/g, '').replace(/```json/g, '').replace(/```/g, '').trim();

    } catch (error: any) {
      console.warn(`[AI] Error with key ...${currentKey.slice(-4)}:`, error);
      lastError = error;

      const isOverloaded = error.message?.includes('503') || error.message?.includes('overloaded') || error.status === 503;
      
      // If it's a 503 Overload, wait a bit before trying the next key
      if (isOverloaded) {
        const waitTime = 1000 * (attempt + 1); // Exponential backoff: 1s, 2s, 3s...
        console.log(`[AI] Model overloaded. Waiting ${waitTime}ms before switching key...`);
        await sleep(waitTime);
      } else if (error.message?.includes('API_KEY')) {
         // Invalid key, immediately try next without waiting
         continue;
      } else {
         // Other error, maybe prompt related, but we try next key just in case
         await sleep(500);
      }
    }
  }

  throw lastError || new Error("Failed to generate content after multiple attempts.");
};
