import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date consistently across the application
 * @param date Date to format
 * @param includeTime Whether to include time in the output
 * @returns Formatted date string
 */
export function formatDate(date: Date | string | number, includeTime: boolean = false): string {
  const d = new Date(date);
  // Use a fixed locale and format to ensure consistency between server and client
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };
  
  if (includeTime) {
    return d.toLocaleString('en-US', {
      ...dateOptions,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }
  
  return d.toLocaleString('en-US', dateOptions);
}
