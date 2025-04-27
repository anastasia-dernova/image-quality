//good working
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { EvaluationProvider } from '@/contexts/EvaluationContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Image Quality Evaluator',
  description: 'Compare and evaluate image quality across different processing methods',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <EvaluationProvider>
          <main className="container mx-auto py-8 px-4">
            {children}
          </main>
        </EvaluationProvider>
      </body>
    </html>
  );
}

