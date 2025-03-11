import React, { useState, useEffect } from "react";
import { useDocument } from "../hooks/useDocuments";
import { getDocumentPreviewUrl, getDocumentDownloadUrl } from "@/api/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DownloadIcon, XIcon, ExternalLinkIcon, FileIcon } from "lucide-react";
import { formatFileSize, formatDate } from "../utils/utils";

interface DocumentPreviewProps {
  documentId: number;
  onClose: () => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  documentId,
  onClose,
}) => {
  const { data: document, isLoading, error } = useDocument(documentId);
  const [previewError, setPreviewError] = useState(false);
  const [previewLoaded, setPreviewLoaded] = useState(false);

  useEffect(() => {
    // Reset state when document changes
    setPreviewError(false);
    setPreviewLoaded(false);
  }, [documentId]);

  const handlePreviewLoad = () => {
    setPreviewLoaded(true);
  };

  const handlePreviewError = () => {
    setPreviewError(true);
  };

  const renderPreview = () => {
    if (!document) return null;
    const previewUrl = getDocumentPreviewUrl(document.id);
    
    // If we've already had an error loading the preview, show fallback
    if (previewError) {
      return renderFallbackPreview(previewUrl);
    }

    if (document.fileType.includes("image")) {
      return (
        <div className="flex justify-center overflow-auto max-h-96">
          <img
            src={previewUrl}
            alt={document.title}
            className="object-contain max-h-full max-w-full"
            onLoad={handlePreviewLoad}
            onError={handlePreviewError}
          />
        </div>
      );
    }
    
    if (document.fileType.includes("pdf")) {
      // Try using object tag instead of iframe for PDF files
      return (
        <div className="w-full h-96 relative">
          {!previewLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <p>Loading preview...</p>
            </div>
          )}
          <object
            data={previewUrl}
            type="application/pdf"
            className="w-full h-full"
            onLoad={handlePreviewLoad}
            onError={handlePreviewError}
          >
            <embed src={previewUrl} type="application/pdf" className="w-full h-full" />
            <p>Your browser doesn't support PDF previews.</p>
          </object>
        </div>
      );
    }
    
    // For other file types that can't be previewed
    return renderFallbackPreview(previewUrl);
  };

  const renderFallbackPreview = (previewUrl: string) => {
    return (
      <div className="text-center p-8 flex flex-col items-center">
        <FileIcon className="h-16 w-16 text-gray-400 mb-4" />
        <p className="mb-6">
          {previewError 
            ? "Unable to display preview in this window." 
            : `Preview not available for this file type (${document?.fileType}).`}
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild>
            <a href={previewUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLinkIcon className="h-4 w-4 mr-2" />
              Open in New Tab
            </a>
          </Button>
          {document && (
            <Button variant="outline" asChild>
              <a
                href={getDocumentDownloadUrl(document.id)}
                download={document.filename}
              >
                <DownloadIcon className="h-4 w-4 mr-2" />
                Download
              </a>
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={!!documentId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl">
        {isLoading ? (
          <div className="p-8 text-center">
            <p>Loading document preview...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p>Error loading document: {String(error)}</p>
          </div>
        ) : document ? (
          <>
            <DialogHeader>
              <DialogTitle>{document.title}</DialogTitle>
              <div className="text-sm text-muted-foreground flex flex-wrap gap-x-6 mt-2">
                <span>File: {document.filename}</span>
                <span>Size: {formatFileSize(document.fileSize)}</span>
                <span>Uploaded: {formatDate(document.createdAt)}</span>
              </div>
            </DialogHeader>
            <div className="py-4">{renderPreview()}</div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                <XIcon className="h-4 w-4 mr-2" />
                Close
              </Button>
              {document && (
                <Button asChild>
                  <a
                    href={getDocumentDownloadUrl(document.id)}
                    download={document.filename}
                  >
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Download
                  </a>
                </Button>
              )}
            </DialogFooter>
          </>
        ) : (
          <p>Document not found</p>
        )}
      </DialogContent>
    </Dialog>
  );
};