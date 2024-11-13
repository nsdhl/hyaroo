import type { Metadata } from 'next';
import Script from 'next/script';
import { Manrope } from 'next/font/google';
import './globals.css';
import ThemeRegistry from './ThemeRegistry';
import HeaderLayout from '@/layouts/HeaderLayout';
import { Toaster } from 'react-hot-toast';
import { AppContextProvider } from '@/context';
import Footer from '@/layouts/Footer';

const manrope = Manrope({ subsets: ['greek'] });

export const metadata: Metadata = {
  title: 'Hyaroo',
  description: 'Buy what you like!',
  generator: 'Next.js',
  manifest: '/manifest.json',
  keywords: ['nextjs', 'nextjs13', 'next13', 'pwa', 'next-pwa'],
  authors: [
    {
      name: 'Nischal Dahal',
      url: 'https://nischal.dev',
    },
  ],
  icons: [
    { rel: 'apple-touch-icon', url: '/icons/apple-touch-icon.png' },
    { rel: 'icon', url: '/icons/android-chrome-192x192.png' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <meta name="theme-color" content="#FFF" />
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
      />
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-WNFMTPXNCL"
        ></Script>
        <Script id="google-analytics">
          {`

            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-WNFMTPXNCL');

        `}
        </Script>
      </head>
      <body
        className={manrope.className}
        style={{
          maxWidth: '1940px',
          margin: '0 auto',
          backgroundColor: '#fafafa',
        }}
      >
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
        <AppContextProvider>
          <ThemeRegistry options={{ key: 'mui' }}>
            <HeaderLayout />
            {children}
            <Footer />
          </ThemeRegistry>
        </AppContextProvider>
      </body>
    </html>
  );
}
