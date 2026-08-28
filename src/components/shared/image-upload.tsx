"use client";

import { uploadToCloudinary } from "@/actions/server/uploadToCloudinary";
import { Button } from "@/components/ui/button";
import { IconLoader, IconTrash, IconUpload } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder: string;
  disabled?: boolean;
}

const ImageUpload = ({
  value,
  onChange,
  folder,
  disabled,
}: ImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const display = objectUrl || value || null;

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    const localUrl = URL.createObjectURL(file);
    setObjectUrl(localUrl);
    setIsUploading(true);

    try {
      const uploadedUrl = await uploadToCloudinary(file, { folder });

      onChange(uploadedUrl);
      toast.success("Image uploaded successfully!");
    } catch (error: unknown) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image!");
    } finally {
      setIsUploading(false);
      setObjectUrl(null);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
    }

    setObjectUrl(null);
    onChange("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      {display ? (
        <div className="relative overflow-hidden rounded-lg border border-border bg-muted/30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={display}
            alt="Upload preview"
            className="max-h-48 w-full object-cover"
          />

          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-sm font-medium">
                <IconLoader className="h-4 w-4 animate-spin" />
                Uploading...
              </div>
            </div>
          )}

          {!isUploading && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              title="Remove image"
              onClick={handleRemove}
              className="absolute top-2 right-2 h-8 w-8"
            >
              <IconTrash className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled || isUploading}
          onClick={() => inputRef.current?.click()}
          className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/20 text-muted-foreground transition hover:bg-muted/50 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUploading ? (
            <>
              <IconLoader className="h-6 w-6 animate-spin" />
              <span className="text-sm font-medium">Uploading...</span>
            </>
          ) : (
            <>
              <IconUpload className="h-6 w-6" />
              <span className="text-sm font-medium">
                Click to upload image
              </span>
              <span className="text-xs">
                PNG, JPG or WEBP. Instant preview after selection.
              </span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={disabled || isUploading}
        className="sr-only"
      />
    </div>
  );
};

export default ImageUpload;