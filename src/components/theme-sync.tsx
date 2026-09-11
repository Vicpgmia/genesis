"use client";

import { useEffect } from "react";

/** Mantém a classe `.dark` no <html> alinhada ao tema do sistema. */
export function ThemeSync() {
  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const apply = () => {
      root.classList.toggle("dark", media.matches);
    };

    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  return null;
}
