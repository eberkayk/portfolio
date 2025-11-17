import "./globals.css";
import { ReactNode } from "react";
import { Montserrat } from "next/font/google";
import ClientLayout from "@/components/ClientLayout";
import LenisProvider from "@/components/LenisProvider";
import CustomCursor from "@/components/CustomCursor";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: "Anıl Emmiler Portfolio",
  description: "Istanbul Based Designer & Illustrator",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.className} bg-white text-black overflow-hidden`}
      >
        {/* 🧠 Lenis global smooth scroll */}
        <LenisProvider>
          <ClientLayout>{children}</ClientLayout>
          <CustomCursor />
        </LenisProvider>
      </body>
    </html>
  );
}
