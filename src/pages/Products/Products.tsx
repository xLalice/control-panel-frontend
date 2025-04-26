import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import {
  PlusCircle,
  Search,
  RefreshCw
} from "lucide-react";
import { ProductTable } from "./components/ProductTable"; // Add this import
import {
  Product,
  defaultProduct,
  TAB_TO_CATEGORY_MAP,
  FormProduct,
} from "./types";
import {
  addProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from "@/api/api";
import { ProductFormFields } from "./components/ProductFormFields";
import { useAppSelector } from "@/store/store";
import { selectUserHasPermission } from "@/store/slice/authSlice";


const ProductManagementSystem = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [newProduct, setNewProduct] = useState<FormProduct>({
    ...defaultProduct,
  });
  const [sortField, setSortField] = useState<keyof Product>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const canWriteProducts = useAppSelector((state) => selectUserHasPermission(state, "manage:products"));

  const {
    data: products = [],
    isLoading,
    refetch,
  } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

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
      setIsEditDialogOpen(false);
      setEditingProduct(null);
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

  const handleUpdateProduct = () => {
    if (editingProduct) {
      if (!editingProduct.name || !editingProduct.category) {
        toast.error("Product name and category are required");
        return;
      }

      updateMutation.mutate(editingProduct);
    }
  };

  const handleDeleteProduct = (id: string | number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteMutation.mutate(String(id));
    }
  };

  const resetNewProduct = () => {
    setNewProduct({ ...defaultProduct });
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Product Management</h1>
        {canWriteProducts && <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-yellow-500 hover:bg-yellow-800"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Product
        </Button>}
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

        <TabsContent value="all" className="mt-0">
          <ProductTable
            products={sortedProducts}
            onEdit={openEditDialog}
            onDelete={handleDeleteProduct}
            isLoading={isLoading}
            onSort={handleSort}
          />
        </TabsContent>

        <TabsContent value="aggregate" className="mt-0">
          <ProductTable
            products={sortedProducts}
            onEdit={openEditDialog}
            onDelete={handleDeleteProduct}
            isLoading={isLoading}
            onSort={handleSort}
          />
        </TabsContent>

        <TabsContent value="heavy equipment" className="mt-0">
          <ProductTable
            products={sortedProducts}
            onEdit={openEditDialog}
            onDelete={handleDeleteProduct}
            isLoading={isLoading}
            onSort={handleSort}
          />
        </TabsContent>

        <TabsContent value="steel" className="mt-0">
          <ProductTable
            products={sortedProducts}
            onEdit={openEditDialog}
            onDelete={handleDeleteProduct}
            isLoading={isLoading}
            onSort={handleSort}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new product to your inventory.
            </DialogDescription>
          </DialogHeader>

          <ProductFormFields product={newProduct} setProduct={setNewProduct} isEdit={false}/>

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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the details of the selected product.
            </DialogDescription>
          </DialogHeader>

          {editingProduct && (
            <ProductFormFields
              product={editingProduct!}
              setProduct={(updatedProduct) =>
                setEditingProduct(updatedProduct as Product)
              }
              isEdit={true}
            />
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateProduct}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManagementSystem;