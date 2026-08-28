"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteProduct } from "@/actions/server/product.action";
import ConfirmAlertDialog from "@/components/shared/confirm-alert-dialog";
import { Button } from "@/components/ui/button";
import { TProduct } from "@/types/product.interface";
import { IconTrash } from "@tabler/icons-react";
import { toast } from "sonner";

interface DeleteProductButtonProps {
  product: TProduct;
}

const DeleteProductButton = ({ product }: DeleteProductButtonProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      const result = await deleteProduct(product.id);

      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error: unknown) {
      console.error("Error deleting product:", error);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ConfirmAlertDialog
      title={`Delete ${product.name}?`}
      description="This will permanently remove the product, its images, and all its variants. Products with order or restock history cannot be deleted. This action cannot be undone."
      confirmText={isLoading ? "Deleting..." : "Delete"}
      isLoading={isLoading}
      onConfirm={handleDelete}
      trigger={
        <Button
          variant="ghost"
          size="sm"
          title="Delete Product"
          className="h-8 w-8 p-0 hover:bg-destructive/10"
        >
          <IconTrash className="h-4 w-4 text-destructive" />
        </Button>
      }
    />
  );
};

export default DeleteProductButton;