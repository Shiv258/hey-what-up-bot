import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/common/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "World's First AI Influencer SaaS",
  description: "Meet your AI Influencer - the digital brand ambassador that creates content, engages followers, generates leads, and books appointments 24/7 in 15+ languages.",
  openGraph: {
    title: "World's First AI Influencer SaaS",
    description: "The future of marketing is here.",
    images: [{ url: "/og-image.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "World's First AI Influencer SaaS",
    description: "The future of marketing is here.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-dvh flex-col bg-background">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
