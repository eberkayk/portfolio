import "./globals.css";
import { ReactNode } from "react";
import { Montserrat } from "next/font/google";
import ClientLayout from "@/components/ClientLayout";
import LenisProvider from "@/components/LenisProvider";
import type { Metadata } from "next";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { client } from "@/lib/sanity";
import { ABOUT_PAGE } from "@/lib/queries";
import Script from "next/script";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

// Statik metadata yerine dinamik generateMetadata fonksiyonu kullanıyoruz
export async function generateMetadata(): Promise<Metadata> {
  // Sanity'den verileri çekiyoruz
  const aboutData = await client.fetch(ABOUT_PAGE);
  
  // Sanity'den resim gelirse onu, gelmezse varsayılanı kullan
  const ogImage = aboutData?.ogImage || "https://anilemmiler.com/og-image.jpg";
  
  const title = "Anıl Emmiler - Designer & Illustrator | Istanbul";
  const description = "Professional designer and illustrator based in Istanbul. Specializing in illustration, UI/UX design, and animation. View my creative portfolio and contact me for collaborations.";

  return {
    title,
    description,
    keywords: "Anıl Emmiler, designer, illustrator, Istanbul, UI/UX design, illustration, animation, graphic design, portfolio, Turkey",
    authors: [{ name: "Anıl Emmiler" }],
    creator: "Anıl Emmiler",
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "https://anilemmiler.com",
      title: "Anıl Emmiler - Designer & Illustrator",
      description: "Professional designer and illustrator based in Istanbul. Specializing in illustration, UI/UX design, and animation.",
      siteName: "Anıl Emmiler Portfolio",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "Anıl Emmiler Portfolio",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Anıl Emmiler - Designer & Illustrator",
      description: "Professional designer and illustrator based in Istanbul",
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: "google-site-verification-code-will-be-added-later",
    },
    icons: {
      icon: "/favicon.svg",
    },
    other: {
      "dns-prefetch": "https://cdn.sanity.io",
      preconnect: "https://cdn.sanity.io",
    },
  };
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
      </head>
      <body className={montserrat.className}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-FWPN2JPPC3"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FWPN2JPPC3');
          `}
        </Script>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Anıl Emmiler",
              jobTitle: "Designer & Illustrator",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Istanbul",
                addressCountry: "TR",
              },
              email: "anilemmiler@gmail.com",
              url: "https://anilemmiler.com",
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}