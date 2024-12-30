import type { Metadata } from 'next';
import { Sidebar } from '../components/Sidebar';
import './globals.css';
import { CanonProvider } from '@backstage/canon';

import '../../packages/canon/src/css/core.css';
import '../../packages/canon/src/css/components.css';
import styles from './page.module.css';

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
            <div className={styles.container}>{children}</div>
          </>
        </CanonProvider>
      </body>
    </html>
  );
}
