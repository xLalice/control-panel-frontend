import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React from "react";

const LeadDetailSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="h-8 bg-gray-200 rounded-md w-20 animate-pulse"></div>
        <div className="h-8 bg-gray-200 rounded-md w-20 animate-pulse"></div>
      </div>

      <div className="border-b">
        <div className="flex gap-4">
          <div className="h-9 bg-gray-200 rounded-md w-24 animate-pulse"></div>
          <div className="h-9 bg-gray-200 rounded-md w-32 animate-pulse"></div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded-md w-32 animate-pulse mb-2"></div>
          <div className="h-4 bg-gray-200 rounded-md w-64 animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {[...Array(5)].map((_, i) => (
                <div key={`left-${i}`} className="flex items-start gap-2">
                  <div className="h-5 w-5 bg-gray-300 rounded-full animate-pulse"></div>
                  <div className="w-full">
                    <div className="h-4 bg-gray-200 rounded-md w-24 animate-pulse mb-2"></div>
                    <div className="h-5 bg-gray-200 rounded-md w-36 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {[...Array(5)].map((_, i) => (
                <div key={`right-${i}`} className="flex items-start gap-2">
                  <div className="h-5 w-5 bg-gray-300 rounded-full animate-pulse"></div>
                  <div className="w-full">
                    <div className="h-4 bg-gray-200 rounded-md w-24 animate-pulse mb-2"></div>
                    <div className="h-5 bg-gray-200 rounded-md w-36 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Notes Skeleton */}
          <div className="flex items-start gap-2">
            <div className="h-5 w-5 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="w-full">
              <div className="h-4 bg-gray-200 rounded-md w-16 animate-pulse mb-2"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded-md w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded-md w-11/12 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded-md w-3/4 animate-pulse"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadDetailSkeleton;
