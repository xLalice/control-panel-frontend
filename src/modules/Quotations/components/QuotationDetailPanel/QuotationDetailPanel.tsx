import { useState } from "react";
import {
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Separator,
  Badge,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui";
import {
  Pencil,
  Trash2,
  FileText,
  Send,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  User as UserIcon,
} from "lucide-react";
import { SlideInPanel } from "@/components/SlideInPanel/SlideInPanel";
import { useQuotation } from "../../hooks/useQuotesQueries";
import { useUpdateQuotation, useDeleteQuotation, useSendQuotation } from "../../hooks/useQuoteMutation";
import { QuotationItem, QuotationStatus } from "../../quotes.types";
import { CreateQuotationDialog } from "../CreateQuoteDialog/CreateQuoteDialog";
import { toast } from "react-toastify";
import { apiClient } from "@/api/axios";
import { ConfirmationDialog } from "@/components/AlertDialog";

interface QuotationDetailPanelProps {
  id: string | null;
  onClose: () => void;
  isOpen: boolean;
}

export const QuotationDetailPanel = ({
  id,
  onClose,
  isOpen,
}: QuotationDetailPanelProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSendConfirmOpen, setIsSendConfirmOpen] = useState(false);

  const { data: quote, isLoading, error } = useQuotation(id!);

  const { mutate: deleteQuote, isPending: isDeleting } = useDeleteQuotation();
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateQuotation();
  const { mutate: sendQuote, isPending: isSending } = useSendQuotation();

  const handleDelete = () => {
    if (!quote) return;
    deleteQuote(quote.id, {
      onSuccess: () => {
        setIsDeleteOpen(false);
        toast.success("Quote deleted")
        onClose();
      },
      onError: () => {
        toast.error("Failed to delete quote");
      }
    });
  };

  const handleSend = () => {
    if (!quote) return;

    sendQuote(quote.id, {
      onSuccess: () => {
        setIsSendConfirmOpen(false);
        toast.success("Quote sent to customer");
        onClose();
      },
      onError: () => {
        toast.error("Failed to send to customer");
      }
    })
  }

  const handleDownloadPdf = async () => {
    try {
      setIsDownloading(true)
      const response = await apiClient.get(`/quotes/${quote?.id}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${quote?.quotationNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setIsDownloading(false);
    } catch {
      setIsDownloading(false);
      toast.error("Failed to download PDF");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft": return "bg-gray-500 hover:bg-gray-600";
      case "Sent": return "bg-blue-500 hover:bg-blue-600";
      case "Accepted": return "bg-green-500 hover:bg-green-600";
      case "Rejected": return "bg-red-500 hover:bg-red-600";
      default: return "bg-gray-500";
    }
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(val);

  return (
    <>
      <SlideInPanel
        isOpen={isOpen}
        onClose={onClose}
        title={quote?.quotationNumber || "Quotation Details"}
        isLoading={isLoading}
        error={error}
      >
        {!quote ? (
          <div className="text-center p-4">Select a quotation to view details.</div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 mb-6">
              {quote.status === QuotationStatus.Draft && (
                <>
                  <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)}>
                    <Pencil className="h-4 w-4 mr-2" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setIsSendConfirmOpen(true)}
                    disabled={isSending}
                  >
                    <Send className="h-4 w-4 mr-2" /> {isSending ? 'Sending...' : 'Send to Customer'}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => setIsDeleteOpen(true)}>
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </Button>
                </>
              )}

              {quote.status === QuotationStatus.Sent && (
                <>
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => updateStatus({ id: quote.id, data: { status: QuotationStatus.Accepted } })}
                    disabled={isUpdating}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" /> Mark Accepted
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                    onClick={() => updateStatus({
                      id: quote.id,
                      data: { status: QuotationStatus.Rejected }
                    })}
                    disabled={isUpdating}
                  >
                    <XCircle className="h-4 w-4 mr-2" /> Mark Rejected
                  </Button>
                </>
              )}

              <Button variant="ghost" size="sm" onClick={handleDownloadPdf} className={isDownloading ? 'disabled ' : ""}>
                <Download className="h-4 w-4 mr-2" /> {isDownloading ? "Downloading..." : "PDF"}
              </Button>
            </div>

            <div className="mb-6 flex items-center justify-between bg-muted/50 p-3 rounded-lg border">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Current Status:</span>
                <Badge className={getStatusColor(quote.status)}>{quote.status}</Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                Created: {new Date(quote.createdAt).toLocaleDateString()}
              </div>
            </div>

            <Tabs defaultValue="details">
              <TabsList className="mb-4 grid w-full grid-cols-2">
                <TabsTrigger value="details">Details & Items</TabsTrigger>
                <TabsTrigger value="info">Info & Dates</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Line Items</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right">Qty</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {quote.items.map((item: QuotationItem) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.description}</TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.lineTotal)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>{formatCurrency(quote.subtotal)}</span>
                      </div>
                      {quote.discount > 0 && (
                        <div className="flex justify-between text-sm text-red-600">
                          <span>Discount</span>
                          <span>- {formatCurrency(quote.discount)}</span>
                        </div>
                      )}
                      {quote.tax > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Tax</span>
                          <span>{formatCurrency(quote.tax)}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between font-bold text-lg pt-2">
                        <span>Grand Total</span>
                        <span>{formatCurrency(quote.total)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="info" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Quotation Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Customer</p>
                        <p className="font-medium">{quote.client?.clientName || quote.lead?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Issue Date</p>
                        <p>{new Date(quote.issueDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Valid Until</p>
                        <p>{new Date(quote.validUntil).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Notes to Customer</p>
                        <p className="text-sm italic">{quote.notesToCustomer || "None"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {isEditOpen && (
              <CreateQuotationDialog
                open={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                defaultValues={quote}
                entity={{
                  id: quote.leadId || quote.clientId!,
                  type: quote.leadId ? 'lead' : 'client'
                }}
              />
            )}

            <ConfirmationDialog
              open={isDeleteOpen}
              onOpenChange={setIsDeleteOpen}
              title="Delete Quotation?"
              description={
                <span>
                  This action cannot be undone. This will permanently delete
                  Quotation <strong>{quote?.quotationNumber}</strong>.
                </span>
              }
              confirmText="Delete"
              variant="destructive"
              isLoading={isDeleting}
              onConfirm={handleDelete}
            />

            <ConfirmationDialog
              open={isSendConfirmOpen}
              onOpenChange={setIsSendConfirmOpen}
              title="Send to Customer?"
              description="This will lock the quotation and email the PDF."
              confirmText="Send Email"
              isLoading={isSending}
              onConfirm={handleSend}
            />

          </>
        )}
      </SlideInPanel>
    </>
  );
};