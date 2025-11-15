export function TweetSkeleton() {
  return (
    <div className="border-b border-gray-800 p-4 animate-pulse">
      <div className="flex gap-3">
        {/* Avatar skeleton */}
        <div className="flex-shrink-0">
          <div className="h-12 w-12 bg-gray-800 rounded-full"></div>
        </div>

        <div className="flex-1 space-y-3">
          {/* Header skeleton */}
          <div className="flex items-center gap-2">
            <div className="h-4 w-32 bg-gray-800 rounded"></div>
            <div className="h-4 w-20 bg-gray-800 rounded"></div>
          </div>

          {/* Content skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-800 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-800 rounded"></div>
            <div className="h-4 w-4/6 bg-gray-800 rounded"></div>
          </div>

          {/* Actions skeleton */}
          <div className="flex items-center justify-between mt-3 max-w-md">
            <div className="h-5 w-16 bg-gray-800 rounded-full"></div>
            <div className="h-5 w-16 bg-gray-800 rounded-full"></div>
            <div className="h-5 w-16 bg-gray-800 rounded-full"></div>
            <div className="h-5 w-10 bg-gray-800 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TweetSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <TweetSkeleton key={i} />
      ))}
    </>
  );
}
