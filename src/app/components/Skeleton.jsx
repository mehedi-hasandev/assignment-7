export default function Skeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4].map(i => <div key={i} className="skeleton h-32 w-full"></div>)}
    </div>
  );
}