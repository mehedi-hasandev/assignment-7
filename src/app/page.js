'use cache';

import Hero from '@/app/components/Hero';
import ProductCard from '@/app/components/ProductCard';
import { fetchAPI, engToBnNum } from '@/lib/utils';

export default async function Home() {
  const products = (await fetchAPI('/products')) || [];

  const risers = products.filter(p => p.change?.dir === 'up').slice(0, 6);
  const fallers = products.filter(p => p.change?.dir === 'down').slice(0, 6);

  return (
    <div>
      <Hero />

      <section className="max-w-6xl mx-auto p-4 space-y-12 my-8">
        {risers.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              <span className="text-red-600">▲</span> আজ দাম বেড়েছে
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {risers.map(p => (
                <ProductCard key={p.slug || p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {fallers.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              <span className="text-green-600">▼</span> আজ দাম কমেছে
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {fallers.map(p => (
                <ProductCard key={p.slug || p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        <div id="সব-পণ্য">
          <h2 className="text-2xl font-bold mb-1">সব পণ্য</h2>
          <p className="text-gray-500 text-sm mb-6">
            মোট {engToBnNum(products.length)}টি পণ্য দেখানো হচ্ছে
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.length > 0 ? (
              products.map(p => (
                <ProductCard key={p.slug || p.id} product={p} />
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-full py-10">
                কোনো পণ্য পাওয়া যায়নি
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}