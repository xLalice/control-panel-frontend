import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getPriceHistory } from "@/api/api";

type PriceHistoryItem = {
  id: string;
  product: { name: string };
  oldPrice: number;
  newPrice: number;
  unit: string;
  updatedAt: string;
  updatedBy: string;
};



export default function PriceHistory({ productId }: { productId: string }) {
  const { data, isLoading } = useQuery({ queryKey: ["priceHistory", productId], queryFn: () => getPriceHistory(productId) });

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-40">
        <Loader className="animate-spin" />
      </div>
    );

  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Old Price</TableHead>
              <TableHead>New Price</TableHead>
              <TableHead>Updated By</TableHead>
              <TableHead>Updated At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item: PriceHistoryItem) => (
              <TableRow key={item.id}>
                <TableCell>{item.product.name}</TableCell>
                <TableCell>{item.oldPrice} {item.unit}</TableCell>
                <TableCell>{item.newPrice} {item.unit}</TableCell>
                <TableCell>{item.updatedBy}</TableCell>
                <TableCell>{new Date(item.updatedAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
