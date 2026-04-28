"use server";

import {
  v2 as cloudinary,
  UploadApiOptions,
  UploadApiResponse,
  TransformationOptions,
} from "cloudinary";
import { BadRequestError } from "http-errors-enhanced";
import { getEnv } from "@/lib/env";

type TUploadToCloudinaryOptions = {
  folder: string;
  transformation?: TransformationOptions;
};

// Environment variables
const {
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = getEnv();

// Cloudinary
cloudinary.config({
  cloud_name: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const DEFAULT_TRANSFORMATION: TransformationOptions = {
  width: 500,
  height: 500,
  crop: "fill",
  quality: "auto",
  fetch_format: "auto",
};

export async function uploadToCloudinary(
  file: File,
  options: TUploadToCloudinaryOptions,
): Promise<string> {
  try {
    // Validation
    if (!file) throw new BadRequestError("No file provided!");

    if (!file.type.startsWith("image/")) {
      throw new BadRequestError("Only image files are allowed!");
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadOptions: UploadApiOptions = {
      folder: `snap_order/${options.folder}`,
      transformation: options.transformation || DEFAULT_TRANSFORMATION,
      resource_type: "image",
      overwrite: false,
      use_filename: false,
      unique_filename: true,
    };

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) reject(error);
          else if (result) resolve(result);
          else reject(new Error("Upload failed: No result returned"));
        },
      );

      uploadStream.end(buffer);
    });

    return result.secure_url;
  } catch (error: unknown) {
    throw error;
  }
}
