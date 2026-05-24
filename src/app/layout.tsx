import type { Metadata, Viewport } from "next";
import {
  Anton,
  Bebas_Neue,
  Inter,
  JetBrains_Mono,
  Oswald,
} from "next/font/google";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import SiteLoader from "@/components/layout/SiteLoader";
import "./globals.css";

// Display / headline faces — single-weight, so an explicit weight is required.
const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
});
const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
});

// Variable fonts — no weight needed.
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald" });
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const fontVariables = [
  anton.variable,
  bebas.variable,
  oswald.variable,
  jetbrains.variable,
  inter.variable,
].join(" ");

export const metadata: Metadata = {
  title: {
    default: "Vector OS — Open source. Built different. Zero limits.",
    template: "%s · Vector OS",
  },
   icons: {
    icon: "/favicon.ico",
    shortcut: "/Vector OS new Logo.ico",
  },
  description:
    "A collective of engineers building open source security tools and low-level software at the boundary of possibility.",
  metadataBase: new URL("https://vectoros.dpdns.org"),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fontVariables}>
      <body className="flex min-h-full flex-col bg-vos-black">
        <SiteLoader />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
