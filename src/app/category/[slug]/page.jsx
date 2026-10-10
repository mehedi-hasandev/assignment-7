import ProductCard from '@/app/components/ProductCard';
import { fetchAPI, engToBnNum } from '@/lib/utils';
import Link from 'next/link';
export const instant = false;
export default async function CategoryPage({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const slug = resolvedParams?.slug;
  const sort = resolvedSearchParams?.sort || 'default';

  if (!slug) return null;

  const categoryMeta = {
    chal: { name: 'চাল', icon: '🍚' },
    dal: { name: 'ডাল', icon: '🫘' },
    tel: { name: 'তেল', icon: '🛢️' },
    sobji: { name: 'সবজি', icon: '🥬' },
    mach: { name: 'মাছ', icon: '🐟' },
    mangsho: { name: 'মাংস', icon: '🍗' },
    'dim-dui': { name: 'ডিম-দুধ', icon: '🥛' },
    mosla: { name: 'মসলা', icon: '🌶️' }
  };

  const apiCategory = slug === 'dim-dudh' ? 'dim-dui' : slug;

  let products = [];
  try {
    const data = await fetchAPI(`/products?category=${apiCategory}`);
    if (data && Array.isArray(data)) {
      products = data;
    }
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  let catName = categoryMeta[slug]?.name || slug;
  let catIcon = categoryMeta[slug]?.icon || '📦';

  try {
    const cats = await fetchAPI('/categories');
    if (cats && Array.isArray(cats)) {
      const found = cats.find(c => c.id === slug || c.slug === slug || c.id === apiCategory);
      if (found) {
        catName = found.nameBn || found.name || catName;
        catIcon = found.icon || found.categoryIcon || catIcon;
      }
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
  }

  if (products.length > 0 && catName === slug) {
    catName = products[0].categoryNameBn || catName;
    catIcon = products[0].categoryIcon || catIcon;
  }

  const sortedProducts = [...products].sort((a, b) => {
    if (sort === 'high') return (b.today || 0) - (a.today || 0);
    if (sort === 'low') return (a.today || 0) - (b.today || 0);
    return 0;
  });

  const countBn = engToBnNum(products.length);

  return (
    <div className="min-h-screen bg-[#F4F5F4] py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-6">

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-3xl border border-gray-100">
            {catIcon}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{catName}</h1>
            <p className="text-sm text-gray-500">{countBn}টি পণ্যের আজকের দাম ও পরিবর্তন</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex justify-end items-center">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600">সাজান</span>
            
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white cursor-pointer flex items-center gap-2 hover:border-[#0F8A43] transition-colors">
                {sort === 'low' ? 'কম দাম থেকে বেশি' : sort === 'high' ? 'বেশি দাম থেকে কম' : 'ডিফল্ট'}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-lg bg-white rounded-xl w-52 mt-2 border border-gray-100">
                <li>
                  <Link href={`/category/${slug}?sort=default`} className={sort === 'default' ? 'bg-gray-50 text-[#0F8A43] font-bold' : ''}>
                    ডিফল্ট
                  </Link>
                </li>
                <li>
                  <Link href={`/category/${slug}?sort=low`} className={sort === 'low' ? 'bg-gray-50 text-[#0F8A43] font-bold' : ''}>
                    কম দাম থেকে বেশি
                  </Link>
                </li>
                <li>
                  <Link href={`/category/${slug}?sort=high`} className={sort === 'high' ? 'bg-gray-50 text-[#0F8A43] font-bold' : ''}>
                    বেশি দাম থেকে কম
                  </Link>
                </li>
              </ul>
            </div>
            
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-4">মোট {countBn}টি পণ্য দেখানো হচ্ছে</p>
          
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedProducts.map((p) => (
                <ProductCard key={p.slug || p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <p className="text-gray-500">এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}