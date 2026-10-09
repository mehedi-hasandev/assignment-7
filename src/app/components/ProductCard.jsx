"use client";

import { engToBnNum } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const handleClick = () => {
    if (!session) {
      toast.error("বিস্তারিত দেখতে অনুগ্রহ করে আগে সাইন ইন করুন!");
      router.push('/signin');
      return;
    }
    router.push(`/product/${product.id || product.slug}`);
  };

  const isUp = product.change?.dir === 'up';
  const isDown = product.change?.dir === 'down';
  const price = engToBnNum(product.today || 0);
  const changePct = engToBnNum(product.change?.pct || 0);

  const unitMap = { 'kg': 'কেজি', 'litre': 'লিটার', 'dozen': 'ডজন', 'piece': 'পিস' };
  const unit = unitMap[product.unit] || 'কেজি';

  return (
    <div onClick={handleClick} className="block cursor-pointer h-full">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow h-full flex flex-col justify-between">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-2xl border border-gray-100 shrink-0">
            {product.image || product.icon || '📦'}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg leading-tight">{product.nameBn || product.name}</h3>
            <p className="text-sm text-gray-500 mt-1">প্রতি {unit}</p>
          </div>
        </div>

        <div className="flex items-end justify-between mt-auto">
          <div>
            <p className="text-xs text-gray-500 mb-1">আজকের দাম</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-gray-900">{price}</span>
              <span className="text-sm text-gray-700">টাকা</span>
            </div>
          </div>
          
          {product.change && (
            <div className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-md ${
              isUp ? 'bg-red-50 text-red-600' : isDown ? 'bg-green-50 text-[#0F8A43]' : 'bg-gray-50 text-gray-600'
            }`}>
              {isUp ? '▲' : isDown ? '▼' : '—'} {changePct}%
            </div>
          )}
        </div>
      </div>
    </div>
  );
}