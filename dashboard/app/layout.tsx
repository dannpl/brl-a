import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BRL-A Agent Dashboard",
  description: "Autonomous market maker for BRL stablecoin on Solana",
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
