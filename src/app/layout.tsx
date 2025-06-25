import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'FIRC Clarity',
  description: 'Instantly calculate hidden costs in your Foreign Inward Remittance Certificate (FIRC).',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={cn("font-sans antialiased h-full")}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
