import "./globals.css";
import { ReactNode } from "react";
import { Montserrat } from "next/font/google";
import ClientLayout from "@/components/ClientLayout";
import LenisProvider from "@/components/LenisProvider";
import type { Metadata } from "next";


const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: 'Anıl Emmiler - Portfolio',
  description: 'Istanbul Based Designer & Illustrator',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.className} antialiased`}>
        {/* 🧠 Lenis global smooth scroll */}
        <LenisProvider>
          <ClientLayout>{children}</ClientLayout>
          
        </LenisProvider>
      </body>
    </html>
  );
}
