"use client";

import { AppProvider } from '@/contexts/AppContext';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider>
      {children}
    </AppProvider>
  );
} 