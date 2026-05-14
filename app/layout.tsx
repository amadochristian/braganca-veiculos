import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { StickyCtaMobile } from "@/components/layout/StickyCtaMobile";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteName = "Bragança Veículos";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: `${siteName} | Seminovos e novos em Bragança Paulista`,
    template: `%s | ${siteName}`,
  },
  description:
    "Concessionária com estoque selecionado, financiamento e atendimento consultivo em Bragança Paulista.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen flex flex-col font-sans">
        <Header />
        <main className="flex-1 pb-24 md:pb-6">{children}</main>
        <Footer />
        <WhatsAppFloat />
        <StickyCtaMobile />
      </body>
    </html>
  );
}
