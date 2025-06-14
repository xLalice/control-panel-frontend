import { useState } from "react";
import {  useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { PlusCircle, Search, RefreshCw } from "lucide-react";
import { ProductTable } from "./components/ProductTable";
import {
  Product,
  defaultProduct,
  TAB_TO_CATEGORY_MAP,
  FormProduct,
} from "./types";
import {
  addProduct,
  deleteProduct,
  updateProduct,
} from "@/api/api";
import { ProductFormFields } from "./components/ProductFormFields";
import { useAppSelector } from "@/store/store";
import { selectUserHasPermission } from "@/store/slice/authSlice";
import { ProductDetailModal } from "./components/ProductDetailModal"; 
import { useProduct } from "./hooks/useProducts";

const ProductManagementSystem = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);
  const [isViewOnly, setIsViewOnly] = useState<boolean>(true);
  const [newProduct, setNewProduct] = useState<FormProduct>({
    ...defaultProduct,
  });
  const [sortField, setSortField] = useState<keyof Product>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const canWriteProducts = useAppSelector((state) =>
    selectUserHasPermission(state, "manage:products")
  );

  const {
    data: products = [],
    isLoading,
    refetch
  } = useProduct();

  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const addMutation = useMutation({
    mutationFn: (product: Omit<Product, "id">) => addProduct(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product added successfully");
      setIsAddDialogOpen(false);
      resetNewProduct();
    },
    onError: (error: Error) => {
      toast.error(`Failed to add product: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product updated successfully");
      setIsProductModalOpen(false);
      setSelectedProduct(null);
    },
    onError: (error: Error) => {
      toast.error(`Failed to update product: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete product: ${error.message}`);
    },
  });

  const filteredProducts = products.filter((product) => {
    const selectedCategory = TAB_TO_CATEGORY_MAP[activeTab];

    const matchesCategory =
      selectedCategory === null || product.category === selectedCategory;

    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false);
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aValue = a[sortField] ?? "";
    const bValue = b[sortField] ?? "";

    if (aValue === bValue) return 0;

    const comparison = String(aValue).localeCompare(String(bValue));
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.category) {
      toast.error("Product name and category are required");
      return;
    }

    addMutation.mutate(newProduct as Omit<Product, "id">);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    if (!updatedProduct.name || !updatedProduct.category) {
      toast.error("Product name and category are required");
      return;
    }

    updateMutation.mutate(updatedProduct);
  };

  const handleDeleteProduct = (id: string | number) => {
    deleteMutation.mutate(String(id));
    setSelectedProduct(null);
    setIsProductModalOpen(false);
  };

  const resetNewProduct = () => {
    setNewProduct({ ...defaultProduct });
  };

  const viewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsViewOnly(true);
    setIsProductModalOpen(true);
  };

  const editProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsViewOnly(false);
    setIsProductModalOpen(true);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Product Management</h1>
        {canWriteProducts && (
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-yellow-500 hover:bg-yellow-800"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Product
          </Button>
        )}
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search products..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={() => refetch()} title="Refresh">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={handleTabChange}
      >
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Products</TabsTrigger>
          <TabsTrigger value="aggregate">Aggregate</TabsTrigger>
          <TabsTrigger value="heavy equipment">Heavy Equipment</TabsTrigger>
          <TabsTrigger value="steel">Steel Products</TabsTrigger>
        </TabsList>

        {["all", "aggregate", "heavy equipment", "steel"].map((category) => (
          <TabsContent value={category} className="mt-0">
            <ProductTable
              products={sortedProducts}
              onView={viewProduct}
              onEdit={editProduct}
              onDelete={handleDeleteProduct}
              isLoading={isLoading}
              onSort={handleSort}
              canEdit={canWriteProducts}
              canDelete={canWriteProducts}
            />
          </TabsContent>
        ))}
      </Tabs>

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new product to your inventory.
            </DialogDescription>
          </DialogHeader>

          <ProductFormFields
            product={newProduct}
            setProduct={setNewProduct}
            isEdit={false}
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddProduct} disabled={addMutation.isPending}>
              {addMutation.isPending ? "Adding..." : "Add Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Product Detail Modal for viewing or editing */}
      <ProductDetailModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onSave={handleUpdateProduct}
        isLoading={updateMutation.isPending}
        onDelete={handleDeleteProduct}
        viewOnly={isViewOnly}
      />
    </div>
  );
};

export default ProductManagementSystem;