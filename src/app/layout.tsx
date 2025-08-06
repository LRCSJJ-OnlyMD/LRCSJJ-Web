import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TRPCProvider } from "@/lib/trpc-provider";
import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "@/lib/language-context";
import { ThemeProvider } from "@/lib/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Ligue Régionale de Casablanca-Settat de Ju-Jitsu",
  description: "Excellence, Discipline et Tradition Martiale - Sous l'égide de la Fédération Royale Marocaine de Ju-Jitsu",
  keywords: "Ju-Jitsu, casablanca, settat, morocco, martial arts, federation",
  authors: [{ name: "Casablanca-Settat Ju-Jitsu League" }],
  openGraph: {
    title: "Ligue Régionale de Casablanca-Settat de Ju-Jitsu",
    description: "Excellence, Discipline et Tradition Martiale",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable}`} suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
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
