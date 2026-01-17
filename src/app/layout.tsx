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
  title: 'Anıl Emmiler - Designer & Illustrator | Istanbul',
  description: 'Professional designer and illustrator based in Istanbul. Specializing in illustration, UI/UX design, and animation. View my creative portfolio and contact me for collaborations.',
  keywords: 'Anıl Emmiler, designer, illustrator, Istanbul, UI/UX design, illustration, animation, graphic design, portfolio, Turkey',
  authors: [{ name: 'Anıl Emmiler' }],
  creator: 'Anıl Emmiler',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://anilemmiler.com',
    title: 'Anıl Emmiler - Designer & Illustrator',
    description: 'Professional designer and illustrator based in Istanbul. Specializing in illustration, UI/UX design, and animation.',
    siteName: 'Anıl Emmiler Portfolio',
    images: [
      {
        url: 'https://anilemmiler.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Anıl Emmiler Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anıl Emmiler - Designer & Illustrator',
    description: 'Professional designer and illustrator based in Istanbul',
    images: ['https://anilemmiler.com/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code-will-be-added-later',
  },
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Anıl Emmiler',
        jobTitle: 'Designer & Illustrator',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Istanbul',
          addressCountry: 'TR',
        },
        email: 'anilemmiler@gmail.com',
        url: 'https://anilemmiler.com',
      }),
    }}
  />
  {children}
</body>
    </html>
  );
}
