import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const getInitials = (value: string) => {
  return value
    .replaceAll(/[^a-zA-Z0-9_]/g, "")
    .charAt(0)
    .toUpperCase();
};
