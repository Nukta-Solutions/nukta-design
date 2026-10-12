import "@nukta-solutions/ui/fonts.css";
import "./index.css";
import { Toaster, TooltipProvider } from "@nukta-solutions/ui";
import { ThemeProvider } from "next-themes";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import { router } from "./router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Writes `light` / `dark` to <html class>, which Nukta tokens respond to. */}
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <TooltipProvider>
        <RouterProvider router={router} />
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  </StrictMode>,
);
