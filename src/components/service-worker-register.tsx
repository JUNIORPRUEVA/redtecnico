"use client";

import { useEffect } from "react";

/**
 * Registra el service worker para habilitar la PWA y el modo offline.
 * Solo se ejecuta en el cliente y en producción.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;

    const register = async () => {
      try {
        await navigator.serviceWorker.register("/sw.js");
      } catch (err) {
        // No bloquear la app si el registro falla
        console.warn("No se pudo registrar el service worker:", err);
      }
    };

    register();
  }, []);

  return null;
}
