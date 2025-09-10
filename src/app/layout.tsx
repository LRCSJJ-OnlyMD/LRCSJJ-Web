import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TRPCProvider } from "@/lib/trpc-provider";
import { Toaster } from "@/components/ui/primitives/sonner";
import { LanguageProvider } from "@/lib/language-context";
import { ThemeProvider } from "@/lib/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "LRCSJJ - Ligue Régionale Casablanca-Settat de Ju-Jitsu",
    template: "%s | LRCSJJ",
  },
  description:
    "Excellence, Discipline et Tradition Martiale - Sous l'égide de la Fédération Royale Marocaine de Ju-Jitsu. Découvrez notre communauté de champions et les témoignages de nos athlètes.",
  keywords:
    "Ju-Jitsu, casablanca, settat, morocco, martial arts, federation, champions, témoignages, athlètes, compétitions",
  authors: [{ name: "Casablanca-Settat Ju-Jitsu League" }],
  creator: "LRCSJJ",
  publisher: "Ligue Régionale Casablanca-Settat",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "LRCSJJ - Ligue Régionale Casablanca-Settat de Ju-Jitsu",
    description:
      "Excellence, Discipline et Tradition Martiale - Découvrez les témoignages de nos champions",
    type: "website",
    locale: "fr_MA",
    siteName: "LRCSJJ",
  },
  twitter: {
    card: "summary_large_image",
    title: "LRCSJJ - Ligue Régionale Casablanca-Settat de Ju-Jitsu",
    description: "Excellence, Discipline et Tradition Martiale",
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
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable}`} suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider defaultTheme="system" storageKey="lrcsjj-ui-theme">
          <LanguageProvider>
            <TRPCProvider>
              {children}
              <Toaster />
            </TRPCProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
