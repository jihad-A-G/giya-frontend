export function ProductCardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg animate-pulse">
      <div className="w-full h-48 bg-gray-300 rounded-lg mb-4"></div>
      <div className="h-6 bg-gray-300 rounded mb-3 w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded mb-2 w-full"></div>
      <div className="h-4 bg-gray-300 rounded mb-4 w-2/3"></div>
      <div className="h-10 bg-gray-300 rounded w-1/2"></div>
    </div>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-lg animate-pulse overflow-hidden">
      <div className="w-full h-64 bg-gray-300"></div>
    </div>
  );
}
