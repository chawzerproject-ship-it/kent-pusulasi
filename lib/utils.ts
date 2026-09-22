import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("tr-TR").format(value);
}

export function formatCurrency(value: number) {
  if (value >= 1_000_000) {
    return `${new Intl.NumberFormat("tr-TR", {
      maximumFractionDigits: 1,
    }).format(value / 1_000_000)} M TL`;
  }
  return `${formatNumber(value)} TL`;
}
