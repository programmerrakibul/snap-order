import { clsx, type ClassValue } from "clsx"
import { BadRequestError } from "http-errors-enhanced"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export async function uploadImage(imageFile:Blob) {

  try {
    
    const formData = new FormData()

    formData.append('file', imageFile)
    
  } catch (error) {

    console.error(error);

    throw new BadRequestError("Failed to upload image!");
  }
  
}