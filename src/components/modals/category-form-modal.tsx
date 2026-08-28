"use client";

import { useState } from "react";
import { TCategory } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CategoryForm from "@/components/forms/category-form";

interface CategoryFormModalProps {
  Trigger: React.ReactNode;
  category?: TCategory;
  onSuccess?: () => void;
}

const CategoryFormModal = ({
  Trigger,
  category,
  onSuccess,
}: CategoryFormModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{Trigger}</DialogTrigger>
      <DialogContent className="max-w-md data-[state=open]:zoom-in-0! data-[state=open]:duration-600">
        <DialogHeader>
          <DialogTitle>{category ? "Edit Category" : "Add Category"}</DialogTitle>
          <DialogDescription>
            {category
              ? "Update the category details below."
              : "Fill in the details below to add a new category."}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-4">
          <CategoryForm
            category={category}
            onSuccess={() => {
              setIsOpen(false);
              onSuccess?.();
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryFormModal;