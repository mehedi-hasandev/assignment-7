const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://openapi.programming-hero.com/api/bazardor';

export const fetchAPI = async (endpoint) => {
  try {

    const res = await fetch(`${BASE_URL}${endpoint}`);
    if (!res.ok) {
  console.error("API Error Status:", res.status);
  return [];
}
    const json = await res.json();
    
    
    return json.data || json || []; 
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
};

export const engToBnNum = (num) => {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num?.toString().replace(/\d/g, (d) => bnDigits[d]);
};

export const bnToEngNum = (numStr) => {
  const engDigits = { '০': 0, '১': 1, '২': 2, '৩': 3, '৪': 4, '৫': 5, '৬': 6, '৭': 7, '৮': 8, '৯': 9 };
  const englishNum = String(numStr).replace(/[০-৯]/g, (match) => engDigits[match] || match);
  return Number(englishNum);
};