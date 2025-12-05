import { useParams, useNavigate } from "react-router-dom";
import { QuotationsList } from "./QuotationList";
import { QuotationDetailPanel } from "./components/QuotationDetailPanel/QuotationDetailPanel";

export const QuotationsPage = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();

    const isDialogOpen = !!id;

    const handleClose = () => {
        navigate("/quotes");
    };

    const handleOpen = (newId: string) => {
        navigate(`/quotes/${newId}`);
    };

    return (
        <>
            <QuotationsList 
                onQuoteSelect={handleOpen} 
            />

            {id && (
                <QuotationDetailPanel 
                    id={id} 
                    onClose={handleClose} 
                    isOpen={isDialogOpen} 
                />
            )}
        </>
    );
};