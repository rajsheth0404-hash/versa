import React from 'react';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <AdminSidebar />
        <main className="flex-1 w-full">{children}</main>
      </div>
    </div>
  );
}
