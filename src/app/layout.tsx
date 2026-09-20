import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import FirebaseSyncProvider from '@/components/FirebaseSyncProvider';
import AppLayoutWrapper from '@/components/AppLayoutWrapper';

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
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--brand-accent)] selection:text-black">
        <FirebaseSyncProvider>
          <AppLayoutWrapper>
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-8 h-8 border-2 border-[var(--brand-accent)] border-t-transparent rounded-full animate-spin"></div>
              </div>
            }>
              {children}
            </Suspense>
          </AppLayoutWrapper>
        </FirebaseSyncProvider>
      </body>
    </html>
  );
}

