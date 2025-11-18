import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WholesaleOS Elite - Real Estate Wholesaling Platform",
  description: "AI-powered property discovery for real estate wholesalers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
