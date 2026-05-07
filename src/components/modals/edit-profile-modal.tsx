"use client";

import { useState } from "react";
import { TUser } from "@/types/user.interface";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { EditProfileForm } from "@/components/forms/edit-profile-form";

interface EditProfileModalProps {
  user: TUser;
}

export function EditProfileModal({ user }: EditProfileModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const handleSuccess = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <Button onClick={() => setIsOpen(true)} size="lg">
        Edit Profile
      </Button>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Your Profile</DialogTitle>
          <DialogDescription>
            Update your profile information. Your email cannot be changed.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-4">
          <EditProfileForm user={user} onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
