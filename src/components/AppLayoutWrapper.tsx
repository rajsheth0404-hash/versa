'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <>
      {!isHomePage && <Navbar />}
      <div className={`flex-1 flex flex-col min-w-0 ${!isHomePage ? 'md:pl-64' : ''}`}>
        <main className="flex-1 w-full">
          {children}
        </main>
      </div>
    </>
  );
}
