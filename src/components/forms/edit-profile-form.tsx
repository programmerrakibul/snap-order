"use client";

import React, { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  updateUserSchema,
  TUpdateUser,
  ACCEPTED_IMAGE_TYPES,
} from "@/schemas/user";
import { updateUserData } from "@/actions/server/user.action";
import { getErrorResponse } from "@/lib/error";
import useUserData from "@/hooks/useUserData";
import { Button } from "../ui/button";
import {
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../ui/field";
import { Input } from "../ui/input";
import { IconLoader, IconUpload } from "@tabler/icons-react";
import { TUser } from "@/types/user.interface";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

interface EditProfileFormProps {
  user: TUser;
  onSuccess?: () => void;
}

export function EditProfileForm({ user, onSuccess }: EditProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(
    user.photoURL || null,
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { setUser } = useUserData();

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<TUpdateUser>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user.name || "",
      phoneNumber: user.phoneNumber || "",
      photoURL: undefined,
    },
  });

  const photoFile = watch("photoURL");

  React.useEffect(() => {
    if (photoFile instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(photoFile);
    }
  }, [photoFile]);

  const handleEditProfile = async (data: TUpdateUser) => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      if (data.name) formData.append("name", data.name);
      if (data.phoneNumber) formData.append("phoneNumber", data.phoneNumber);
      if (data.photoURL instanceof File)
        formData.append("photoURL", data.photoURL);

      const response = await updateUserData(formData);

      if (!response.success) throw new Error(response.message);

      // Update user context
      const updatedUser = {
        ...user,
        ...(data.name && { name: data.name }),
        ...(data.phoneNumber && { phoneNumber: data.phoneNumber }),
        ...(previewImage && { photoURL: previewImage }),
      };
      setUser(updatedUser);

      toast.success(response.message);
      onSuccess?.();
    } catch (error: unknown) {
      const { message } = getErrorResponse(error);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <form
      onSubmit={(e) => handleSubmit(handleEditProfile)(e)}
      className="space-y-6"
    >
      {/* Profile Picture Section */}
      <FieldGroup>
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Avatar size="lg" className="size-24">
              <AvatarImage
                src={previewImage || undefined}
                alt={user.name || "User"}
              />
              <AvatarFallback className="text-xl font-semibold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={handleFileInputClick}
              className="absolute bottom-0 right-0 rounded-full bg-primary p-2 text-primary-foreground hover:bg-primary/90 transition-colors"
              title="Change profile picture"
            >
              <IconUpload size={18} />
            </button>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Click the camera icon to change your profile picture
          </p>
        </div>

        <Controller
          name="photoURL"
          control={control}
          render={({ field }) => (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_IMAGE_TYPES.join(",")}
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    field.onChange(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
              {errors.photoURL && (
                <FieldError>{errors.photoURL.message}</FieldError>
              )}
            </>
          )}
        />
      </FieldGroup>

      {/* Name Field */}
      <FieldGroup>
        <FieldLabel htmlFor="name">Full Name</FieldLabel>
        <FieldDescription>Your first and last name</FieldDescription>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              id="name"
              placeholder="Enter your full name"
              {...field}
              className="text-base"
            />
          )}
        />
        {errors.name && <FieldError>{errors.name.message}</FieldError>}
      </FieldGroup>

      {/* Phone Number Field */}
      <FieldGroup>
        <FieldLabel htmlFor="phoneNumber">Phone Number</FieldLabel>
        <FieldDescription>
          Your contact phone number (11 digits)
        </FieldDescription>
        <Controller
          name="phoneNumber"
          control={control}
          render={({ field }) => (
            <Input
              id="phoneNumber"
              placeholder="01234567890"
              {...field}
              className="text-base"
              type="tel"
            />
          )}
        />
        {errors.phoneNumber && (
          <FieldError>{errors.phoneNumber.message}</FieldError>
        )}
      </FieldGroup>

      {/* Email (Read-only) */}
      <FieldGroup>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <FieldDescription>Your email cannot be changed</FieldDescription>
        <Input
          id="email"
          value={user.email}
          disabled
          className="text-base bg-muted"
        />
      </FieldGroup>

      {/* Submit Button */}
      <Button type="submit" disabled={isLoading} className="w-full" size="lg">
        {isLoading && <IconLoader className="animate-spin" size={18} />}
        {isLoading ? "Updating Profile..." : "Save Changes"}
      </Button>
    </form>
  );
}
