import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KBS Project - Go Further",
  description: "Experience innovation with our cutting-edge solutions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preload custom font for performance */}
        <link
          rel="preload"
          href="/fonts/new-science-extended.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
