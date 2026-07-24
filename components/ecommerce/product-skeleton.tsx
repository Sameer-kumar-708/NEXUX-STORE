'use client'

export function ProductSkeleton() {
  return (
    <div className="glow-card p-4 rounded-2xl overflow-hidden">
      {/* Image skeleton */}
      <div className="relative h-64 sm:h-72 rounded-xl mb-4 shimmer bg-white/[0.03]" />

      {/* Content skeleton */}
      <div className="space-y-3">
        <div className="h-3 w-20 rounded-full shimmer bg-white/[0.03]" />
        <div className="h-5 w-full rounded-full shimmer bg-white/[0.03]" />
        <div className="h-5 w-3/4 rounded-full shimmer bg-white/[0.03]" />

        {/* Price */}
        <div className="flex items-baseline gap-2 pt-1">
          <div className="h-6 w-16 rounded-full shimmer bg-white/[0.03]" />
          <div className="h-4 w-12 rounded-full shimmer bg-white/[0.03]" />
        </div>

        {/* Stock */}
        <div className="h-3 w-24 rounded-full shimmer bg-white/[0.03]" />

        {/* Buttons */}
        <div className="flex gap-2 pt-2">
          <div className="flex-1 h-10 rounded-xl shimmer bg-white/[0.03]" />
          <div className="w-10 h-10 rounded-xl shimmer bg-white/[0.03]" />
        </div>
      </div>
    </div>
  )
}

export function ProductSkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  )
}
