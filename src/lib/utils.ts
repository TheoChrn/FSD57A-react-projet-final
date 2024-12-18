import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const API_URL = import.meta.env.VITE_API_BASE_URL;
export const getIdFromUrl = ({ url }: { url: string }) =>
  url.split("/").filter(Boolean).pop();
