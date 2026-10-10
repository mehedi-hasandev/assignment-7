"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/signin');
    } else if (session?.user?.name) {
      (session.user.name);
    }
  }, [session, isPending, router]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    const { error } = await authClient.updateUser({ name });
    setIsUpdating(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("প্রোফাইল আপডেট হয়েছে!");
    }
  };

  const handleLogout = async () => {
    await authClient.signOut();
    router.push('/signin');
  };

  if (isPending || !session) return <div className="min-h-screen flex justify-center pt-20"><span className="loading loading-spinner text-green-700"></span></div>;

  return (
    <div className="min-h-screen bg-[#F4F5F4] py-12">
      <div className="max-w-3xl mx-auto px-4">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">আমার প্রোফাইল</h1>
          <p className="text-gray-500">আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 border border-gray-200">
              <Image 
                src={session.user.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + session.user.name} 
                alt="Profile" 
                width={80} 
                height={80} 
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{session.user.name}</h2>
              <p className="text-gray-500">{session.user.email}</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-red-200 text-red-500 font-medium hover:bg-red-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            সাইন আউট
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">তথ্য</h3>
          
          <form onSubmit={handleUpdate}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">নাম</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isUpdating}
              className="w-full bg-[#0F8A43] hover:bg-green-800 text-white font-medium py-3 rounded-xl transition-colors flex justify-center items-center h-12"
            >
              {isUpdating ? <span className="loading loading-spinner loading-sm"></span> : "আপডেট"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}