"use client";

import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [pageLoading, setPageLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    setIsLoading(true);
    const { error } = await authClient.signUp.email({ 
      email, 
      password, 
      name 
    });
    setIsLoading(false);

    if (error) {
      toast.error(error.message || "সাইন আপ ব্যর্থ হয়েছে!");
    } else {
      toast.success("অ্যাকাউন্ট তৈরি সফল! অনুগ্রহ করে লগইন করুন।");
      router.push('/signin');
    }
  };

  const handleSocial = async (provider) => {
    await authClient.signIn.social({ 
      provider,
      callbackURL: "/" 
    });
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-12 bg-gray-50/50">
         <div className="flex w-full max-w-md flex-col gap-4">
          <div className="skeleton h-10 w-3/4 mx-auto mb-4"></div>
          <div className="skeleton h-96 w-full rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 bg-gray-50/50">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">অ্যাকাউন্ট তৈরি করুন</h1>
        <p className="text-gray-500">বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md">
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">নাম</label>
            <input 
              type="text" 
              placeholder="যেমন: রহিম উদ্দিন" 
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0F8A43] focus:border-transparent transition-all"
              value={name}
              onChange={e => setName(e.target.value)}
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ইমেইল</label>
            <input 
              type="email" 
              placeholder="you@example.com" 
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0F8A43] focus:border-transparent transition-all"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">পাসওয়ার্ড</label>
            <input 
              type="password" 
              placeholder="পাসওয়ার্ড লিখুন" 
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0F8A43] focus:border-transparent transition-all"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#0F8A43] hover:bg-green-800 text-white font-medium py-2.5 rounded-lg transition-colors mt-2 flex justify-center items-center h-11"
          >
            {isLoading ? <span className="loading loading-spinner loading-sm"></span> : "রেজিস্টার করুন"}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">অথবা</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => handleSocial('google')} 
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>
          <button 
            onClick={() => handleSocial('github')} 
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            GitHub
          </button>
        </div>

        <p className="text-center mt-6 text-sm text-gray-600">
          অ্যাকাউন্ট আছে? <Link href="/signin" className="text-[#0F8A43] font-semibold hover:underline">লগইন করুন</Link>
        </p>
      </div>

      <Link href="/" className="mt-8 text-sm text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-1">
        <span>&larr;</span> হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}