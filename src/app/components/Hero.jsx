"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  const [todayBn, setTodayBn] = useState('');

  useEffect(() => {
    const dateOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    setTodayBn(new Date().toLocaleDateString('bn-BD', dateOptions));
  }, []);

  return (
    <div className="py-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-[#F9FAF9] border border-gray-100 rounded-2xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="flex-1 space-y-5 text-center md:text-left">
            
            <div className="inline-block bg-[#E5F3E9] text-[#0F8A43] px-4 py-1.5 rounded-full text-sm font-medium mb-2">
              {todayBn || 'লোড হচ্ছে...'} 
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              আজকের বাজারের দাম এক নজরে
            </h1>
            
            <p className="text-gray-600 text-sm md:text-base max-w-xl mx-auto md:mx-0 leading-relaxed">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
            </p>
            
            <div className="pt-2">
              <Link href="#সব-পণ্য" className="inline-block bg-[#0F8A43] hover:bg-green-800 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm">
                সব পণ্য দেখুন
              </Link>
            </div>
          </div>
          {/* right part */}
          <div className="flex-1 flex justify-center md:justify-end w-full shrink-0">
            <Image 
              src="/bazar-hero.png" 
              alt="বাজারের ঝুড়ি" 
              width={450} 
              height={450} 
              className="w-4/5 max-w-[280px] md:max-w-[320px] lg:max-w-md object-contain drop-shadow-sm" 
              priority 
            />
          </div>

        </div>
      </div>
    </div>
  );
}