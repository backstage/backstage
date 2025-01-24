import type { Metadata } from 'next';
import { Sidebar } from '../components/Sidebar';
import { Toolbar } from '@/components/Toolbar';
import { Providers } from './providers';
import { CustomTheme } from '@/components/CustomTheme';
import styles from './page.module.css';

import './globals.css';
import '/public/core.css';
import '/public/components.css';
import '/public/backstage.css';

export const metadata: Metadata = {
  title: 'Canon',
  description: 'UI library for Backstage',
  metadataBase: new URL('https://canon.backstage.io'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="light"
      data-theme-name="default"
      suppressHydrationWarning
    >
      <body>
        <Providers>
          <div className={styles.global}>
            <Sidebar />
            <div className={styles.container}>
              <Toolbar />
              {children}
            </div>
            <CustomTheme />
          </div>
        </Providers>
      </body>
    </html>
  );
}
