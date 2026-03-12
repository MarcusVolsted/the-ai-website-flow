import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Premium Web Design on Subscription | Weblio",
  description:
    "Custom websites that convert, delivered on a flat monthly subscription. Unlimited revisions, no upfront cost, no lock-in.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${plusJakarta.variable} ${inter.variable} antialiased`}
      >
        {children}
        <GrainOverlay />
      </body>
    </html>
  );
}
