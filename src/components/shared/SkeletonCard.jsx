export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-slate-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-4 bg-slate-200 rounded w-1/2" />
        <div className="flex justify-between items-center mt-4">
          <div className="h-6 bg-slate-200 rounded w-16" />
          <div className="h-8 bg-slate-200 rounded w-16" />
        </div>
      </div>
    </div>
  )
}
