import { Equipment, Steel, Aggregate } from "@/types";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";


interface PriceHistoryButtonProps {
  item: Equipment | Steel | Aggregate;
}

const PriceHistoryButton: React.FC<PriceHistoryButtonProps> = ({ item }) => (
  <Sheet>
    <SheetTrigger asChild>
      <Button variant="ghost" size="sm">
        <History className="w-4 h-4 mr-2" />
        View History
      </Button>
    </SheetTrigger>
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Price History - { "name" in item ? item.name : "Steel (No Name)" }</SheetTitle>
      </SheetHeader>
      <div className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Old Price</TableHead>
              <TableHead>New Price</TableHead>
              <TableHead>Changed By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {item.priceHistory?.map((history, index) => (
              <TableRow key={index}>
                <TableCell>
                  {new Date(history.date).toLocaleDateString()}
                </TableCell>
                <TableCell>₱{history.oldPrice.toLocaleString()}</TableCell>
                <TableCell>₱{history.newPrice.toLocaleString()}</TableCell>
                <TableCell>{history.changedBy}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </SheetContent>
  </Sheet>
);

export default PriceHistoryButton;