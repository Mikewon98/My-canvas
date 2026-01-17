import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
// @ts-ignore
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      default: "My Canvas",
      template: "%s · My Canvas",
    },
    description:
      "A simple web canvas for creating drawings — download your finished artwork as an image when you're done.",
    openGraph: {
      title: "My Canvas",
      description:
        "A simple web canvas for creating drawings — download your finished artwork as an image when you're done.",
      url: "https://mycanvas.michaelyze.com",
      siteName: "My Canvas",
      locale: "en_US",
      type: "website",
    },
    icons: {
      icon: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
