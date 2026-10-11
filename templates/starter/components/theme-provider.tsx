"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/** Writes `light` / `dark` to <html class>, which Nukta tokens respond to. */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
