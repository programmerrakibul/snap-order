import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/providers/theme-provider";

const geistMonoHeading = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-heading",
});

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Snap Order - Smart Order Management Dashboard",
    template: "%s | Snap Order",
  },
  description:
    "Streamline your business operations, track inventory, and manage client orders effortlessly with Snap Order.",
  metadataBase: new URL("https://snap-order-sigma.vercel.app"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "https://res.cloudinary.com/dqh5dajig/image/upload/v1780568710/logo_gjx9bu.png",
    apple:
      "https://res.cloudinary.com/dqh5dajig/image/upload/v1780568710/logo_gjx9bu.png",
  },
  openGraph: {
    title: "Snap Order - Smart Order Management Dashboard",
    description:
      "Streamline your business operations, track inventory, and manage client orders effortlessly.",
    url: "https://snap-order-sigma.vercel.app",
    siteName: "Snap Order",
    images: [
      {
        url: "https://res.cloudinary.com/dqh5dajig/image/upload/v1780568710/logo_gjx9bu.png", // Swap out for a proper OG image banner if you have one later
        width: 1200,
        height: 630,
        alt: "Snap Order Dashboard Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Snap Order - Smart Order Management Dashboard",
    description:
      "Streamline your business operations, track inventory, and manage client orders effortlessly.",
    images: [
      "https://res.cloudinary.com/dqh5dajig/image/upload/v1780568710/logo_gjx9bu.png",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        figtree.variable,
        geistMonoHeading.variable,
      )}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
          <ThemeProvider>
            {children}
            <Toaster />
          </ThemeProvider>
      </body>
    </html>
  );
}
