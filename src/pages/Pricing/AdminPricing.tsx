import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAllPrices, updatePrice } from "@/api/api";

const priceSchema = z.object({
  productId: z.string(),
  price: z.coerce.number().positive(),
  unit: z.string().min(1),
  updatedBy: z.string(),
});


export default function AdminPricing() {
  const { data: products } = useQuery({ queryKey: ["prices"], queryFn: getAllPrices });
  const { register, handleSubmit, reset } = useForm({ resolver: zodResolver(priceSchema) });

  const updatePriceMutation = useMutation({
    mutationFn: async (formData: any) => await updatePrice(formData.productId, {
      price: formData.price,
      updatedBy: formData.updatedBy,
    }),
    onSuccess: () => {
      alert("Price updated successfully!");
      reset();
    },
  });

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Manage Pricing</h2>
      <form
        className="space-y-4"
        onSubmit={handleSubmit((formData) => updatePriceMutation.mutate(formData))}
      >
        <select {...register("productId")} className="p-2 border rounded w-full">
          {products?.map((product: any) => (
            <option key={product.id} value={product.id}>{product.name}</option>
          ))}
        </select>
        <Input {...register("price")} type="number" placeholder="New Price" />
        <Input {...register("unit")} placeholder="Unit (e.g., kg, piece)" />
        <Input {...register("updatedBy")} placeholder="Updated By" />
        <Button type="submit" className="w-full">Update Price</Button>
      </form>
    </div>
  );
}
