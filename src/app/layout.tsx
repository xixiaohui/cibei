import type { Metadata } from "next";
import { Inter, Noto_Serif_SC, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoSerifSC = Noto_Serif_SC({
  variable: "--font-noto-serif-sc",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "慈悲空间 — 现代佛学研究与经典学习平台",
    template: "%s | 慈悲空间",
  },
  description:
    "深入经藏，智慧如海。慈悲空间是一个现代化佛学研究与学习平台，提供佛经原文阅读、佛学词典、百科知识库等功能。",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://cebei.space"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-Hans"
      className={`${inter.variable} ${notoSerifSC.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
