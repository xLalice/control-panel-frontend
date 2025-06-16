import React, { useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface SlideInPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  widthClass?: string;
  isLoading?: boolean;
  error?: Error | null;
  skeleton?: React.FC;
  headerContent?: React.ReactNode;
  headerClassName?: string;
}

export const SlideInPanel = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  widthClass = "w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5",
  isLoading = false,
  error = null,
  skeleton: SkeletonComponent,
  headerContent,
  headerClassName = "bg-gradient-to-r from-blue-600 to-blue-700 text-white",
}: SlideInPanelProps) => {
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Slide Panel */}
      <aside
        className={`fixed inset-y-0 right-0 ${widthClass} bg-white shadow-2xl z-50
                   transform transition-transform duration-300 ease-in-out
                   ${isOpen ? "translate-x-0" : "translate-x-full"}
                   overflow-hidden flex flex-col`}
        aria-label={title ? `${title} details` : "Details panel"}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        {(title || headerContent) && (
          <div className={`relative p-6 ${headerClassName}`}>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="absolute top-4 right-4 h-8 w-8 p-0 text-white hover:bg-white/20"
              aria-label="Close panel"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
            
            {headerContent ? (
              headerContent
            ) : (
              <div>
                {title && <h2 className="text-2xl font-bold mb-1">{title}</h2>}
                {subtitle && <p className="text-blue-100 text-sm">{subtitle}</p>}
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            SkeletonComponent ? (
              <div className="p-6">
                <SkeletonComponent />
              </div>
            ) : (
              <div className="flex justify-center items-center h-48">
                <p>Loading...</p>
              </div>
            )
          ) : error ? (
            <div className="text-red-500 text-center p-6">
              Error loading details. Please try again.
            </div>
          ) : (
            <div className="p-6">
              {children}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};