import type { Metadata } from "next";
import { Geist, Geist_Mono, Lato } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  icons: {
    icon: "/tera_logo.jpg",
    shortcut: "/tera_logo.jpg",
    apple: "/tera_logo.jpg",
  },
  title: "tera — Cell-Free Biomanufacturing from First Principles",
  description:
    "tera re-imagines how powerful molecules from nature are made, through cell-free biomanufacturing and AI-driven reactor intelligence. Faster, purer, at industrial scale.",
  keywords: [
    "cell-free biomanufacturing",
    "enzyme manufacturing",
    "reactor intelligence",
    "biotech",
    "tera",
    "biocatalysis",
  ],
  openGraph: {
    title: "tera — Cell-Free Biomanufacturing from First Principles",
    description:
      "Re-imagining how powerful molecules from nature are made, from first principles.",
    type: "website",
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
      data-theme="dark"
      className={`${geistSans.variable} ${geistMono.variable} ${lato.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
