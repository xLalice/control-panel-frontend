import { CreateQuotationDialog } from "../CreateQuoteDialog/CreateQuoteDialog";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/Loader";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    MoreHorizontal,
    Eye,
    Trash2,
    FileDown
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiClient } from "@/api/axios";
import { BadgeStatus } from "../BadgeStatus";
import { useDeleteQuotation } from "../../hooks/useQuoteMutation";
import { useRelatedQuotations } from "../../hooks/useQuotesQueries";

interface Props {
    entityId: string;
    entityType: 'lead' | 'client';
    showButton: boolean;
}

export const RelatedQuotationsList = ({ entityId, entityType, showButton }: Props) => {
    const [isCreateOpen, setCreateOpen] = useState(false);
    const navigate = useNavigate();

    const { data: quotes, isLoading } = useRelatedQuotations(entityType, entityId);

    const handlePdfAction = async (id: string, quoteNumber: string, action: 'preview' | 'download') => {
        try {
            const response = await apiClient.get(`/quotes/${id}/pdf`, {
                responseType: 'blob'
            });

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);

            if (action === 'preview') {
                window.open(url, '_blank');
            } else {
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${quoteNumber}.pdf`);
                document.body.appendChild(link);
                link.click();

                link.remove();
                window.URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to retrieve PDF");
        }
    };



    const { mutate: deleteQuote, isPending: isDeleting } = useDeleteQuotation();

    const handleDelete = (id: string) => {
        if (!confirm("Are you sure?")) return;

        deleteQuote(id, {
            onSuccess: () => {
                toast.success("Quotation deleted successfully");

            },
            onError: (err) => {
                toast.error(err.message || "Failed to delete");
            }
        });
    };

    return (
        <div className="space-y-4">
            {showButton && (
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold">Quotations</h3>
                    <Button onClick={() => setCreateOpen(true)} size="sm">
                        + Create Quote
                    </Button>
                </div>
            )}

            <div className="border rounded-md bg-white">
                {isLoading ? (
                    <div className="p-4 flex justify-center"><Loader /></div>
                ) : quotes?.data.length === 0 ? (
                    <p className="p-4 text-gray-500 text-sm">No quotes yet.</p>
                ) : (
                    quotes?.data.map((quote) => (
                        <div
                            key={quote.id}
                            className="flex justify-between items-center p-4 border-b last:border-0 hover:bg-gray-50 transition-colors group"
                        >
                            <div
                                className="cursor-pointer flex-1"
                                onClick={() => navigate(`/quotations/${quote.id}`)}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="font-mono font-medium text-blue-600 hover:underline">
                                        {quote.quotationNumber}
                                    </span>
                                    <BadgeStatus status={quote.status} />
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                    {new Date(quote.createdAt).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="font-semibold text-sm">
                                    ₱{quote.total.toLocaleString()}
                                </div>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handlePdfAction(quote.id, quote.quotationNumber, 'preview');
                                    }}
                                    title="Quick Preview PDF"
                                >
                                    <Eye className="h-4 w-4 text-gray-500" />
                                </Button>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>

                                        <DropdownMenuItem onClick={() => navigate(`/quotes/${quote.id}`)}>
                                            View Details
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                            onClick={() => {
                                                handlePdfAction(quote.id, quote.quotationNumber, 'download');
                                            }}
                                        >
                                            <FileDown className="mr-2 h-4 w-4" /> Download PDF
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                            disabled={isDeleting}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(quote.id);
                                            }}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            {isDeleting ? "Deleting..." : "Delete"}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {isCreateOpen && (
                <CreateQuotationDialog
                    open={isCreateOpen}
                    onClose={() => setCreateOpen(false)}
                    entity={{ id: entityId, type: entityType }}
                />
            )}
        </div>
    );
};

