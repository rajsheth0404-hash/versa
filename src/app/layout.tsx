import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Versa',
  description: 'Academic notes, PPT slides, PYQs, YouTube video lectures, and study resources for engineering students.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#0F172A] text-slate-100 selection:bg-[#38BDF8] selection:text-slate-950">
        <Navbar />
        <main className="flex-1">
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="w-8 h-8 border-2 border-[#38BDF8] border-t-transparent rounded-full animate-spin"></div>
            </div>
          }>
            {children}
          </Suspense>
        </main>
      </body>
    </html>
  );
}
