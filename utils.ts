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