// src/app/layout.tsx

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '../providers/QueryProvider';
import { Sidebar } from '../components/layout/Sidebar';
import { MobileNav } from '../components/layout/MobileNav';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CardioPredict - Cardiovascular Risk Assessment',
  description:
    'AI-powered cardiovascular risk prediction and analysis platform for healthcare professionals',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0F172A',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ErrorBoundary>
          <QueryProvider>
            <div className="flex h-screen overflow-hidden bg-background">
              {/* Desktop Sidebar */}
              <Sidebar />

              {/* Mobile Navigation */}
              <MobileNav />

              {/* Main Content */}
              <main className="flex-1 overflow-y-auto lg:ml-64">
                <div className="pt-16 lg:pt-0">{children}</div>
              </main>
            </div>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
