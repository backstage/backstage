import type { Metadata } from 'next';
import { Sidebar } from '../components/Sidebar';
import './globals.css';

import '../../packages/canon/src/css/core.css';
import '../../packages/canon/src/css/components.css';
import styles from './page.module.css';
import { Global } from '@/components/Global';
import { Providers } from './providers';

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
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Global>
            <Sidebar />
            <div className={styles.container}>{children}</div>
          </Global>
        </Providers>
      </body>
    </html>
  );
}
