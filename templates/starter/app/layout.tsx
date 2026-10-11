import "@nukta-solutions/ui/fonts.css";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nukta Starter",
  description: "A new Nukta product, built on Nukta UI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
