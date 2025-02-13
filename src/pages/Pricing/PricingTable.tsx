import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { getAllPrices } from "@/api/api";

type Product = {
  id: string;
  name: string;
  category: { name: string };
  pricing: { price: number; unit: string; updatedBy: string };
};



export default function PricingTable() {
  const { data, isLoading } = useQuery({ queryKey: ["prices"], queryFn: getAllPrices });

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
              <TableHead>Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Updated By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((product: Product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category.name}</TableCell>
                <TableCell>{product.pricing.price} {product.pricing.unit}</TableCell>
                <TableCell>{product.pricing.updatedBy}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
