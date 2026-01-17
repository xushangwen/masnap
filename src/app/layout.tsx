import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

// const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const inter = { variable: "font-sans" };

export const metadata: Metadata = {
  title: "MaSnap 2026 - 马年新春双拼写真生成器",
  description: "生成你的马年专属双拼写真 | 2026 MaSnap",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
