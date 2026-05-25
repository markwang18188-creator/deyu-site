import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import ChatWidget from '@/components/chatbot/ChatWidget';
import '../globals.css';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Shoe Sole Injection Moulding Machine Manufacturer | DEYU Wenzhou China',
    template: '%s | DEYU',
  },
  description:
    'Leading shoe sole injection moulding machine manufacturer in Wenzhou, China. 15+ years experience, ISO 9001 & CE certified. TPU, PVC, TPR, TR sole machines exported to 30+ countries.',
  metadataBase: new URL('https://deyusolemachine.com'),
  applicationName: 'DEYU Machinery',
  authors: [{ name: 'Wenzhou Deyu Machinery Co., Ltd', url: 'https://deyusolemachine.com' }],
  keywords: [
    'shoe sole injection moulding machine',
    'PVC sole machine',
    'TPU sole machine',
    'TR sole machine',
    'rotary disc sole machine',
    'shoe machinery manufacturer',
    'Wenzhou shoe machinery',
    'footwear injection machine',
    'sole injection moulding machine manufacturer',
    'DEYU Machinery',
  ],
  verification: {
    google: 'b1VWCNF1SFj5L8G39qmE18mrugzqKOs6CX2-MzHIR2U',
  },
  openGraph: {
    type: 'website',
    siteName: 'DEYU Machinery',
    title: 'Shoe Sole Injection Moulding Machine Manufacturer | DEYU',
    description:
      'PVC · TPR · TPU · TR sole machines from Wenzhou, China. ISO 9001 & CE certified. 15+ years exporting to 30+ countries.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DEYU — Shoe Sole Injection Moulding Machines, Made in Wenzhou, China',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DEYU — Shoe Sole Injection Moulding Machine Manufacturer',
    description:
      'PVC · TPR · TPU · TR sole machines from Wenzhou, China. Exported to 30+ countries.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <GoogleAnalytics />
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <ChatWidget />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
