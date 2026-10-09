"use client";

import Link from 'next/link';
import Image from 'next/image';
import { authClient } from '@/lib/auth-client';
import toast from 'react-hot-toast';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [banglaDate, setBanglaDate] = useState('');

  useEffect(() => {
    const today = new Intl.DateTimeFormat('bn-BD', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date());
    setBanglaDate(today);
  }, []);

  const handleLogout = async () => {
    await authClient.signOut();
    toast.success("সফলভাবে লগআউট হয়েছেন");
    router.push('/signin');
  };

  const categories = [
    { name: 'চাল', emoji: '🍚', slug: 'chal' },
    { name: 'ডাল', emoji: '🫘', slug: 'dal' },
    { name: 'তেল', emoji: '🛢️', slug: 'tel' },
    { name: 'সবজি', emoji: '🥬', slug: 'sobji' },
    { name: 'মাছ', emoji: '🐟', slug: 'mach' },
    { name: 'মাংস', emoji: '🍗', slug: 'mangsho' },
    { name: 'ডিম-দুধ', emoji: '🥛', slug: 'dim-dudh' },
    { name: 'মসলা', emoji: '🌶️', slug: 'mosla' }
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-[#0F8A43] p-2 rounded-xl flex items-center justify-center h-12 w-12">
            <Image src="/logo-icon.png" alt="Logo" width={32} height={32} />
          </div>
          <div className="flex flex-col">
            <Link href="/" className="text-2xl font-bold text-gray-900">বাজার দর</Link>
            <span className="text-sm text-gray-500 min-h-5">{banglaDate}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {session ? (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="flex items-center gap-2 hover:bg-gray-50 p-1.5 rounded-lg transition-colors cursor-pointer">
                <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
                  <Image 
                    src={session?.user?.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + session.user.name} 
                    alt="User" 
                    width={36} 
                    height={36} 
                  />
                </div>
                <span className="font-semibold text-gray-700 hidden sm:block">
                  {session.user.name?.split(' ')[0]}
                </span>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-xl bg-white rounded-2xl w-64 mt-3 border border-gray-100">
                <li className="p-3 border-b border-gray-100 pointer-events-none mb-1">
                  <div className="flex flex-col gap-0.5 p-0">
                    <span className="font-bold text-gray-800 text-base">{session.user.name}</span>
                    <span className="text-sm text-gray-500 truncate">{session.user.email}</span>
                  </div>
                </li>
                <li>
                  <Link href="/profile" className="flex items-center gap-3 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50">
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    আমার প্রোফাইল
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="flex items-center gap-3 text-red-500 font-medium py-3 rounded-xl hover:bg-red-50 hover:text-red-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    সাইন আউট
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <>
              <Link href="/signin" className="text-gray-800 font-semibold hover:text-[#0F8A43]">সাইন ইন</Link>
              <Link href="/signup" className="bg-[#0F8A43] hover:bg-green-800 text-white px-5 py-2 rounded-lg font-semibold transition-colors">সাইন আপ</Link>
            </>
          )}
        </div>
      </div>

      <div className="border-t border-b border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <ul className="flex items-center gap-2 overflow-x-auto py-2.5 text-sm font-semibold text-gray-700 whitespace-nowrap">
            {categories.map(c => {
              const isActive = pathname === `/category/${c.slug}`;
              return (
                <li key={c.slug}>
                  <Link 
                    href={`/category/${c.slug}`} 
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-full transition-all ${
                      isActive 
                        ? 'bg-[#0F8A43] text-white shadow-sm' 
                        : 'text-gray-700 hover:text-black hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-base">{c.emoji}</span>
                    <span>{c.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </header>
  );
}