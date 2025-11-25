import { useQuery } from "@tanstack/react-query";
import { quotesApi } from "../../quotes.api";
import { CreateQuotationDialog } from "../CreateQuoteDialog/CreateQuoteDialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader } from "@/components/ui/Loader";

interface Props {
    entityId: string;
    entityType: 'lead' | 'client';
    showButton: boolean;
}

export const RelatedQuotationsList = ({ entityId, entityType, showButton }: Props) => {
    const [isCreateOpen, setCreateOpen] = useState(false);

    const { data: quotes, isLoading } = useQuery({
        queryKey: ['quotations', entityType, entityId],
        queryFn: () => quotesApi.fetch({ [`${entityType}Id`]: entityId })
    });

    return (
        <div className="space-y-4">
            {showButton && <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">Quotations</h3>
                <Button onClick={() => setCreateOpen(true)}>
                    + Create Quote
                </Button>
            </div>}

            <div className="border rounded-md">
                {isLoading ? <Loader /> : quotes?.data.length === 0 ? (
                    <p className="p-4 text-gray-500">No quotes yet.</p>
                ) : (
                    quotes?.data.map(quote => (
                        <div key={quote.id} className="flex justify-between p-4 border-b last:border-0 hover:bg-gray-50">
                            <div>
                                <span className="font-mono text-blue-600">{quote.quotationNumber}</span>
                                <span className={`ml-2 badge status-${quote.status}`}>{quote.status}</span>
                            </div>
                            <div>₱{quote.total}</div>
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