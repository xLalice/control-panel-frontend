export const ActivityTimelineSkeleton = () => (
  <div className="space-y-6">
    {[1, 2, 3].map((i) => (
      <div key={`activity-${i}`} className="flex">
        <div className="mr-4 flex flex-col items-center">
          <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-24 w-px bg-gray-200"></div>
        </div>
        <div className="pb-8 w-full">
          <div className="h-4 bg-gray-200 rounded-md w-32 animate-pulse mb-2"></div>
          <div className="h-5 bg-gray-200 rounded-md w-48 animate-pulse mb-2"></div>
          <div className="h-4 bg-gray-200 rounded-md w-64 animate-pulse mb-2"></div>
          <div className="h-4 bg-gray-200 rounded-md w-40 animate-pulse"></div>
        </div>
      </div>
    ))}
  </div>
);
