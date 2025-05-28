import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { previewDocument } from "@/api/api";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Img } from "react-image";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs"

interface DocumentPreviewProps {
  documentId: number | null;
  onClose: () => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  documentId,
  onClose,
}) => {
  const [previewData, setPreviewData] = useState<{
    url: string;
    mimeType: string;
    filename: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfNumPages, setPdfNumPages] = useState<number>(0);

  useEffect(() => {
    const fetchPreview = async () => {
      if (!documentId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await previewDocument(documentId);
        console.log("Response:", response);

        // Make sure we have mimeType in the response
        if (!response.mimeType) {
          console.error("Missing MIME type in response:", response);
          throw new Error("Invalid response format: missing MIME type");
        }

        // Create blob from the buffer
        const blob = new Blob([response.buffer], {
          type: response.mimeType,
        });

        const url = URL.createObjectURL(blob);
        console.log("Preview URL:", url);
        console.log("MIME type:", response.mimeType);

        setPreviewData({
          url,
          mimeType: response.mimeType,
          filename: response.filename,
        });
      } catch (err) {
        console.error("Preview error:", err);
        setError(
          axios.isAxiosError(err)
            ? err.response?.data?.message || "Preview failed"
            : err instanceof Error
            ? err.message
            : "An unexpected error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();

    // Cleanup
    return () => {
      if (previewData?.url) {
        URL.revokeObjectURL(previewData.url);
      }
    };
  }, [documentId]);

  const renderPreview = () => {
    if (loading) return <p className="text-center p-4">Loading preview...</p>;
    if (error) return <p className="text-red-500 p-4">Error: {error}</p>;
    if (!previewData)
      return <p className="text-center p-4">No preview available</p>;

    const { url, mimeType, filename } = previewData;

    switch (mimeType) {
      case "application/pdf":
        return (
          <div className="w-full h-[600px] overflow-auto">
            <Document
              file={url}
              onLoadSuccess={({ numPages }) => setPdfNumPages(numPages)}
              className="flex flex-col items-center"
            >
              {Array.from(new Array(pdfNumPages), (index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  width={800}
                  className="mb-4"
                />
              ))}
            </Document>
          </div>
        );

      case "text/plain":
      case "text/csv":
      case "application/json":
        return (
          <div className="w-full h-[600px] overflow-auto p-4">
            <SyntaxHighlighter
              language={
                mimeType === "application/json"
                  ? "json"
                  : mimeType === "text/csv"
                  ? "csv"
                  : "textile"
              }
              style={dracula}
              showLineNumbers
            >
              {atob(url.split(",")[1])}
            </SyntaxHighlighter>
          </div>
        );

      case "image/jpeg":
      case "image/png":
      case "image/gif":
      case "image/webp":
        return (
          <div className="w-full h-[600px] flex justify-center items-center overflow-auto">
            <Img
              src={url}
              alt={filename}
              loader={<p>Loading image...</p>}
              unloader={<p>Error loading image</p>}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        );

      default:
        return (
          <div className="p-4 text-center">
            <p>Unsupported file type</p>
            <a
              href={url}
              download={filename}
              className="text-blue-500 hover:underline"
            >
              Download File
            </a>
          </div>
        );
    }
  };

  return (
    <Dialog open={!!documentId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Document Preview</DialogTitle>
        </DialogHeader>
        {renderPreview()}
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreview;
