import { fetchAPI, engToBnNum } from '@/lib/utils';

export default async function Ticker() {
  const products = await fetchAPI('/products');

  if (!products || products.length === 0) return null;

  const unitMap = { 'kg': 'প্রতি কেজি', 'litre': 'প্রতি লিটার', 'dozen': 'প্রতি ডজন', 'piece': 'প্রতি পিস' };

  return (
    <div className="w-full bg-slate-50 overflow-hidden whitespace-nowrap py-2.5 border-b border-gray-200 flex items-center">
      <div className="flex w-max animate-marquee-rtl">
        {[...products, ...products].map((p, i) => {
          const isUp = p.change?.dir === 'up';
          const isDown = p.change?.dir === 'down';
          const changePct = engToBnNum(p.change?.pct || 0);
          const displayUnit = unitMap[p.unit] || p.unit;
          const price = engToBnNum(p.today || 0);
          
          return (
            <span key={i} className="mx-6 text-sm font-medium text-gray-700 flex items-center gap-2">
              <span className="text-base">{p.image}</span> {p.nameBn || 'পণ্য'} - 
              <span className="font-bold text-black">{price} টাকা</span> 
              <span className="text-xs text-gray-400">({displayUnit})</span>
              <span className={`flex items-center text-xs px-1.5 py-0.5 rounded ${isUp ? 'bg-green-100 text-green-700' : isDown ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                {isUp ? '▲' : isDown ? '▼' : '—'} {changePct}%
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}