"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface RestockRequestCancelModalProps {
  isCancelOpen: boolean;
  setIsCancelOpen: (open: boolean) => void;
  handleCancel: () => void;
  Trigger: React.ReactNode;
}

const RestockRequestCancelModal = ({
  isCancelOpen,
  setIsCancelOpen,
  handleCancel,
  Trigger,
}: RestockRequestCancelModalProps) => {
  return (
    <>
      <Dialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
        <DialogTrigger asChild>{Trigger}</DialogTrigger>
        <DialogContent className="max-w-md data-[state=open]:zoom-in-0! data-[state=open]:duration-600">
          <DialogHeader>
            <DialogTitle className="text-destructive">
              Confirm Cancel Restock
            </DialogTitle>
            <DialogDescription>
              Cancelling this restock request will keep current inventory
              unchanged.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 text-sm text-muted-foreground">
            Are you sure you want to cancel this restock request?
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelOpen(false)}>
              Back
            </Button>
            <Button variant="destructive" onClick={handleCancel}>
              Confirm Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RestockRequestCancelModal;
