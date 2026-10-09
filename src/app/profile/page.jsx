import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h2 className="text-4xl font-bold text-red-500 mb-4">৪০৪ - পেজ পাওয়া যায়নি</h2>
      <p className="text-gray-500 mb-6">আপনি যে পেজটি খুঁজছেন তা মুছে ফেলা হয়েছে বা লিঙ্কটি ভুল।</p>
      <Link href="/" className="btn btn-primary">হোম পেজে ফিরে যান</Link>
    </div>
  );
}