import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Codebase Autopilot | Turn Any Codebase Into an Intelligent System",
  description:
    "AI-powered developer intelligence platform that transforms any codebase into a navigable, explainable, and interactive system. Google Maps for Software Engineering.",
  keywords: [
    "AI",
    "code analysis",
    "developer tools",
    "codebase intelligence",
    "IBM Bob",
  ],
  authors: [{ name: "AI Codebase Autopilot Team" }],
  openGraph: {
    title: "AI Codebase Autopilot",
    description: "Transform any codebase into an intelligent, navigable system",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-background text-foreground">
        <Providers>
          {children}
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
