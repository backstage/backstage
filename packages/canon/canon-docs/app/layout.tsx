import type { Metadata } from 'next';
import { Sidebar } from '../components/sidebar';
import '../../src/css/core.css';
import '../../src/css/components.css';
import './globals.css';
import { CanonProvider } from '../../src/contexts/canon';

export const metadata: Metadata = {
  title: 'Canon',
  description: 'UI library for Backstage',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <CanonProvider>
          <>
            <Sidebar />
            {children}
          </>
        </CanonProvider>
      </body>
    </html>
  );
}
