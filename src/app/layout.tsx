import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shoe Sole Injection Moulding Machine Manufacturer | DEYU Wenzhou China",
  description:
    "Leading shoe sole injection moulding machine manufacturer in Wenzhou, China. 15+ years experience, ISO 9001 & CE certified. TPU, PVC, rubber sole machines for global markets. Get a quote today.",
  metadataBase: new URL("https://deyusolemachine.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
