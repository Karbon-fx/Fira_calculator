import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { cn } from '@/lib/utils';
import Script from 'next/script';

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
      <body className={cn("font-geist antialiased h-full")}>
        {children}
        <Toaster />
        <Script src="https://cdn.jotfor.ms/s/static/feedback2.js" type="text/javascript" />
        <Script id="jotform-init">
          {`
            const initJotform = () => {
              if (typeof JotformFeedback !== 'undefined') {
                window.JFL_251765324497062 = new JotformFeedback({
                  formId: '251765324497062',
                  base: 'https://form.jotform.com/',
                  windowTitle: '',
                  backgroundColor: '#0e4c96',
                  fontColor: '#FFFFFF',
                  type: 'lightbox',
                  height: 690,
                  width: 600,
                  openOnLoad: false
                });
              } else {
                setTimeout(initJotform, 100);
              }
            };
            initJotform();
          `}
        </Script>
      </body>
    </html>
  );
}
