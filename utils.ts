
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
  // This ensures the app works immediately if env vars fail to propagate
  return "AIzaSyBwZxqDYvF5QJ_tq1S3829TlSQFncFEF4Q";
};
