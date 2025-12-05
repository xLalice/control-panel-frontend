import { useState } from "react";
import { QuotationsList } from "./QuotationList";
import { QuotationDetailPanel } from "./components/QuotationDetailPanel/QuotationDetailPanel";

export const QuotationsPage = () => {
    const [selectedId, setSelectedId] = useState<string>();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <>

            <QuotationsList setIsDialogOpen={setIsDialogOpen} setSelectedId={setSelectedId}/>

            {selectedId && <QuotationDetailPanel id={selectedId} onClose={() => {
                setSelectedId(undefined)
                setIsDialogOpen(false);
            }} isOpen={isDialogOpen} />}
        </>
    )
};