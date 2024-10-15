import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { ZustandProvider } from '@/providers/ZustandContextProvider';
import SessionProvider from '@/providers/SessionProvider';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Sistem Informasi Perpustakaan',
  description: 'Sistem Informasi Perpustakaan',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ZustandProvider>
          <SessionProvider>
            {children}
          </SessionProvider>
        </ZustandProvider>
      </body>
    </html>
  );
}
