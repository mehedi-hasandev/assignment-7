"use client";

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchAPI, engToBnNum } from '@/lib/utils';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import toast from 'react-hot-toast';

function ProductSkeleton() {
  return (
    <div className="min-h-screen bg-[#F4F5F4] py-4 sm:py-6">
      <div className="max-w-6xl mx-auto px-4 space-y-4 sm:space-y-6">
        <div className="skeleton h-4 w-40 sm:w-48"></div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-4 sm:gap-5 w-full md:w-auto">
            <div className="skeleton w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shrink-0"></div>
            <div className="space-y-2 sm:space-y-3 w-full">
              <div className="skeleton h-5 sm:h-6 w-32 sm:w-40"></div>
              <div className="skeleton h-3 sm:h-4 w-24 sm:w-32"></div>
              <div className="skeleton h-3 sm:h-4 w-36 sm:w-48"></div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 w-full md:min-w-[140px] flex flex-col items-center justify-center border border-gray-100 space-y-2">
            <div className="skeleton h-3 w-16"></div>
            <div className="skeleton h-8 w-20"></div>
            <div className="skeleton h-3 w-16"></div>
          </div>
        </div>
        <div>
          <div className="skeleton h-5 sm:h-6 w-32 mb-3 sm:mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="skeleton h-24 w-full rounded-xl"></div>
            <div className="skeleton h-24 w-full rounded-xl"></div>
            <div className="skeleton h-24 w-full rounded-xl"></div>
          </div>
        </div>
        <div>
          <div className="skeleton h-5 sm:h-6 w-40 mb-3 sm:mb-4"></div>
          <div className="skeleton h-[400px] w-full rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}

function ProductDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug;

  const { data: session, isPending } = authClient.useSession();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !session) {
      toast.error("বিস্তারিত দেখতে অনুগ্রহ করে আগে সাইন ইন করুন!");
      router.push('/signin');
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (!slug || !session) return;

    const loadProductDetails = async () => {
      setIsLoading(true);
      try {
        const data = await fetchAPI(`/products/${slug}`);
        if (data) {
          setProduct(data);
        }
      } catch (err) {
        console.error(err);
      }
      setIsLoading(false);
    };

    loadProductDetails();
  }, [slug, session]);

  if (isPending || !session || isLoading) {
    return <ProductSkeleton />;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F4F5F4] flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-700 mb-3 sm:mb-4">পণ্যটি পাওয়া যায়নি</h2>
        <Link href="/" className="text-[#0F8A43] hover:underline font-medium">হোমে ফিরে যান</Link>
      </div>
    );
  }

  const isUp = product.change?.dir === 'up';
  const isDown = product.change?.dir === 'down';
  const price = product.today || 0;
  const yesterdayPrice = product.yesterday || price;

  const diffAmount = Math.abs(price - yesterdayPrice);
  const changePct = product.change?.pct || 0;

  const unitMap = { 'kg': 'কেজি', 'litre': 'লিটার', 'dozen': 'ডজন', 'piece': 'পিস' };
  const unit = unitMap[product.unit] || 'কেজি';
  const categoryName = product.categoryNameBn || product.category || "চাল";

  const markets = Array.isArray(product.markets) ? product.markets : [];

  let calculatedMin = price;
  let calculatedMax = price;
  let totalAvgSum = 0;

  if (markets.length > 0) {
    const mins = markets.map(m => m.min || price);
    const maxs = markets.map(m => m.max || price);
    calculatedMin = Math.min(...mins);
    calculatedMax = Math.max(...maxs);

    const avgs = markets.map(m => Math.round(((m.min || price) + (m.max || price)) / 2));
    totalAvgSum = avgs.reduce((acc, curr) => acc + curr, 0);
  }

  const overallAvg = markets.length > 0 ? Math.round(totalAvgSum / markets.length) : price;

  return (
    <div className="min-h-screen bg-[#F4F5F4] py-4 sm:py-6 lg:py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-5 sm:space-y-6">
        <div className="text-xs sm:text-sm text-gray-500 flex flex-wrap items-center gap-1.5 sm:gap-2">
          <Link href="/" className="hover:text-[#0F8A43] transition-colors">হোম</Link>
          <span className="mt-0.5">›</span>
          <Link href={`/category/${product.category || product.categoryId || 'chal'}`} className="hover:text-[#0F8A43] transition-colors">{categoryName}</Link>
          <span className="mt-0.5">›</span>
          <span className="text-gray-900 font-medium">{product.nameBn || product.name}</span>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl border border-gray-100 shrink-0 shadow-inner">
              {product.image || product.icon || '📦'}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-1.5">{product.nameBn || product.name}</h1>
              <p className="text-xs sm:text-sm text-gray-500 mb-1.5 sm:mb-2">প্রতি {unit} · {categoryName}</p>
              
              <p className="text-xs sm:text-sm font-medium text-gray-700">
                গতকালকের তুলনায় আজ দাম <span className={isUp ? 'text-red-600' : isDown ? 'text-[#0F8A43]' : 'text-gray-600'}>
                  {isUp ? 'বেড়েছে' : isDown ? 'কমেছে' : 'অপরিবর্তিত'}
                </span> {engToBnNum(diffAmount)} টাকা
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 w-full md:w-auto md:min-w-[150px] flex flex-col items-center justify-center border border-gray-100">
            <p className="text-[11px] sm:text-xs text-gray-500 mb-1">আজকের দাম</p>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{engToBnNum(price)}</div>
            <p className="text-[11px] sm:text-xs text-gray-500 mb-2">টাকা / {unit}</p>
            
            <div className={`text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1 ${
              isUp ? 'bg-red-100 text-red-600' : isDown ? 'bg-green-100 text-[#0F8A43]' : 'bg-gray-200 text-gray-700'
            }`}>
              {isUp ? '▲' : isDown ? '▼' : '—'} {engToBnNum(changePct)}%
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">দামের সারসংক্ষেপ</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-white border border-gray-100 rounded-xl p-4 sm:p-5 shadow-sm transition-shadow hover:shadow-md">
              <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-1.5">সর্বনিম্ন দাম</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-xl sm:text-2xl font-bold text-[#0F8A43]">{engToBnNum(calculatedMin)}</span>
                <span className="text-[#0F8A43] font-medium text-xs sm:text-sm">টাকা</span>
              </div>
              <p className="text-[11px] sm:text-xs text-gray-400">সবচেয়ে কম দামের বাজার</p>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl p-4 sm:p-5 shadow-sm transition-shadow hover:shadow-md">
              <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-1.5">সর্বাধিক দাম</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-xl sm:text-2xl font-bold text-red-500">{engToBnNum(calculatedMax)}</span>
                <span className="text-red-500 font-medium text-xs sm:text-sm">টাকা</span>
              </div>
              <p className="text-[11px] sm:text-xs text-gray-400">সবচেয়ে বেশি দামের বাজার</p>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl p-4 sm:p-5 shadow-sm transition-shadow hover:shadow-md sm:col-span-2 lg:col-span-1">
              <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-1.5">গড় দাম</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-xl sm:text-2xl font-bold text-[#0F8A43]">{engToBnNum(overallAvg)}</span>
                <span className="text-[#0F8A43] font-medium text-xs sm:text-sm">টাকা</span>
              </div>
              <p className="text-[11px] sm:text-xs text-gray-400">প্রতি {unit}-এর হিসাব</p>
            </div>
          </div>
        </div>

        {markets.length > 0 && (
          <div className="mt-6 sm:mt-8">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">বাজারভিত্তিক আজকের দাম</h2>
            <div className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse min-w-[500px] sm:min-w-[600px] whitespace-nowrap">
                  <thead>
                    <tr className="bg-[#F9FAF9] border-b border-gray-200 text-xs sm:text-sm font-medium text-gray-600">
                      <th className="py-3 sm:py-4 px-4 sm:px-6">বাজার</th>
                      <th className="py-3 sm:py-4 px-4 sm:px-6">বিভাগ</th>
                      <th className="py-3 sm:py-4 px-4 sm:px-6">সর্বনিম্ন</th>
                      <th className="py-3 sm:py-4 px-4 sm:px-6">সর্বাধিক</th>
                      <th className="py-3 sm:py-4 px-4 sm:px-6 text-right">গড়</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs sm:text-sm text-gray-800">
                    {markets.map((market, idx) => {
                      const mMin = market.min || 0;
                      const mMax = market.max || 0;
                      let mAvg = (mMin + mMax) / 2;
                      let mAvgStr = mAvg % 1 === 0 ? mAvg.toString() : mAvg.toFixed(2);

                      return (
                        <tr 
                          key={idx} 
                          className={`hover:bg-gray-50 transition-colors ${
                            idx !== markets.length - 1 ? "border-b border-gray-100" : ""
                          }`}
                        >
                          <td className="py-3 sm:py-4 px-4 sm:px-6 font-medium text-gray-900">{market.market}</td>
                          <td className="py-3 sm:py-4 px-4 sm:px-6">{market.division}</td>
                          <td className="py-3 sm:py-4 px-4 sm:px-6">{engToBnNum(mMin)} টাকা</td>
                          <td className="py-3 sm:py-4 px-4 sm:px-6">{engToBnNum(mMax)} টাকা</td>
                          <td className="py-3 sm:py-4 px-4 sm:px-6 font-bold text-gray-900 text-right">{engToBnNum(mAvgStr)} টাকা</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function ProductDetailsPage() {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductDetailsContent />
    </Suspense>
  );
}