import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'FIRC Clarity',
  description: 'Instantly calculate hidden costs in your Foreign Inward Remittance Certificate (FIRC).',
};

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={cn("font-sans antialiased h-full", inter.variable)}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
