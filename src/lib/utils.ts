import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formatea un número como peso dominicano (RD$).
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return "Pago por definir";
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formatea una fecha en formato legible para República Dominicana.
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("es-DO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

/**
 * Formatea fecha y hora.
 */
export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("es-DO", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

/**
 * Formatea una hora (HH:mm).
 */
export function formatTime(time: string | null | undefined): string {
  if (!time) return "—";
  return time;
}

/**
 * Formatea un teléfono dominicano (809-555-1234).
 */
export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return "—";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

/**
 * Genera un enlace de WhatsApp.
 */
export function whatsappLink(phone: string | null | undefined, message?: string): string {
  const cleaned = (phone || "").replace(/\D/g, "");
  const base = `https://wa.me/1${cleaned}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/**
 * Genera un enlace de Google Maps a partir de coordenadas o dirección.
 */
export function mapsLink(latitude?: number | null, longitude?: number | null, address?: string | null): string {
  if (latitude && longitude) {
    return `https://www.google.com/maps?q=${latitude},${longitude}`;
  }
  if (address) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  }
  return "https://www.google.com/maps";
}

/**
 * Trunca un texto a una longitud máxima.
 */
export function truncate(text: string | null | undefined, maxLength = 100): string {
  if (!text) return "";
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}

/**
 * Convierte un slug a texto legible.
 */
export function slugToLabel(slug: string): string {
  return slug
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Obtiene la iniciales de un nombre.
 */
export function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}
