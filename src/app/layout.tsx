import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/providers/QueryProvider';

const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Workout Calendar',
  description: 'Manage your training workouts with drag and drop',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${openSans.className} antialiased`}>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
