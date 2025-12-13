
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
  // Check process.env.API_KEY (Standard for many builds)
  if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
    return process.env.API_KEY;
  }
  
  // Check Vite env vars (import.meta.env.VITE_API_KEY)
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
  } catch (e) {
    // Ignore errors if import.meta is not available
  }

  // Check global window object (Last resort fallback)
  if (typeof window !== 'undefined' && (window as any).API_KEY) {
    return (window as any).API_KEY;
  }

  return undefined;
};
