import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Edit, Trash2 } from "lucide-react";
import { Product, Category } from "../types";
import { useAppSelector } from "@/store/store";
import { selectUserHasPermission } from "@/store/slice/authSlice";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
  onSort: (field: keyof Product) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export const ProductTable = ({
  products,
  onEdit,
  onDelete,
  isLoading,
  onSort,
  canEdit,
  canDelete,
}: ProductTableProps) => {
  const canReadProducts = useAppSelector((state) => 
    selectUserHasPermission(state, "read:all_reports")
  );

  if (!canReadProducts) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-500 font-medium">Access Denied</p>
          <p className="text-gray-500 mt-2">You don't have permission to view these products.</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading products...</p>
        </CardContent>
      </Card>
    );
  }

  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No products found</p>
        </CardContent>
      </Card>
    );
  }

  const formatCategory = (category: Category): string => {
    switch (category) {
      case Category.AGGREGATE:
        return "Aggregate";
      case Category.HEAVY_EQUIPMENT:
        return "Heavy Equipment";
      case Category.STEEL:
        return "Steel";
      default:
        return category;
    }
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => onSort("name")}
              >
                Name <ArrowUpDown className="inline h-4 w-4 ml-1" />
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => onSort("category")}
              >
                Category <ArrowUpDown className="inline h-4 w-4 ml-1" />
              </TableHead>
              <TableHead
                className="text-right cursor-pointer"
                onClick={() => onSort("basePrice")}
              >
                Base Price <ArrowUpDown className="inline h-4 w-4 ml-1" />
              </TableHead>
              <TableHead
                className="text-right cursor-pointer"
                onClick={() => onSort("pickUpPrice")}
              >
                Pick Up Price <ArrowUpDown className="inline h-4 w-4 ml-1" />
              </TableHead>
              <TableHead
                className="text-right cursor-pointer"
                onClick={() => onSort("deliveryPrice")}
              >
                Delivery Price <ArrowUpDown className="inline h-4 w-4 ml-1" />
              </TableHead>
              {(canEdit || canDelete) && (
                <TableHead className="text-center">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{formatCategory(product.category)}</TableCell>
                <TableCell className="text-right">
                  {`₱${product.basePrice.toLocaleString()} ${product.pricingUnit ? `/ ${product.pricingUnit}` : ""}`}
                </TableCell>
                <TableCell className="text-right">
                  {product.pickUpPrice
                    ? `₱${product.pickUpPrice.toLocaleString()} ${
                        product.unit && `/ ${product.unit}`
                      }`
                    : "N/A"}
                </TableCell>
                <TableCell className="text-right">
                  {product.deliveryPrice
                    ? `₱${product.deliveryPrice.toLocaleString()} ${
                        product.unit && `/ ${product.unit}`
                      }`
                    : "N/A"}
                </TableCell>
                {(canEdit || canDelete) && (
                  <TableCell className="text-center">
                    <div className="flex justify-center space-x-2">
                      {canEdit && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {canDelete && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500"
                          onClick={() => onDelete(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};