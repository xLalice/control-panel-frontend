import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePagination, DOTS } from "@/hooks/usePagination";

interface CustomPaginationProps {
  onPageChange: (page: number) => void;
  totalPages: number;
  currentPage: number;
  siblingCount?: number;
  className?: string;
}

export const CustomPagination: React.FC<CustomPaginationProps> = ({
  onPageChange,
  totalPages,
  currentPage,
  siblingCount = 1,
  className,
}) => {
  const paginationRange = usePagination({
    currentPage,
    totalPages,
    siblingCount,
  });

  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    console.log(
      "CustomPagination: Calling onPageChange with Next, new page:",
      currentPage + 1
    );
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    console.log(
      "CustomPagination: Calling onPageChange with Previous, new page:",
      currentPage - 1
    );
    onPageChange(currentPage - 1);
  };

  return (
    <div className={`flex items-center space-x-2 ${className || ""}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={onPrevious}
        disabled={currentPage === 1}
        className="flex items-center gap-1"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      <div className="flex items-center space-x-1">
        {paginationRange.map((pageNumber, index) => {
          if (pageNumber === DOTS) {
            return (
              <span
                key={index}
                className="px-2 py-1 text-sm text-muted-foreground"
              >
                &#8230;
              </span>
            );
          }

          return (
            <Button
              key={index}
              variant={pageNumber === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => {
                console.log(
                  "CustomPagination: Calling onPageChange with page:",
                  pageNumber
                );
                onPageChange(pageNumber as number);
              }}
              className="min-w-[32px] h-8"
            >
              {pageNumber}
            </Button>
          );
        })}
      </div>

      {/* Next button */}
      <Button
        variant="outline"
        size="sm"
        onClick={onNext}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
