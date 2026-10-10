import './globals.css';
import { Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import Ticker from '@/app/components/Ticker';

export const metadata = { 
  title: 'বাজার দর | BazarDor', 
  description: 'প্রয়োজনীয় পণ্যের দাম এক নজরে' 
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn" data-theme="light">
      <body className="min-h-screen flex flex-col bg-white text-gray-800">
        <Toaster position="top-right" />

        <Suspense fallback={<div className="h-16 w-full border-b border-gray-100 bg-white" />}>
          <Navbar />
        </Suspense>
        
        <Suspense fallback={<div className="h-10 bg-slate-50 border-b border-gray-200" />}>
          <Ticker />
        </Suspense>
        
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}