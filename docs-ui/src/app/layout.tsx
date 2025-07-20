import type { Metadata } from 'next';
import { Sidebar } from '../components/Sidebar';
import { Toolbar } from '@/components/Toolbar';
import { Providers } from './providers';
import { CustomTheme } from '@/components/CustomTheme';
import styles from './layout.module.css';

import '../css/globals.css';
import '/public/theme-backstage.css';
import '/public/theme-spotify.css';

export const metadata: Metadata = {
  title: 'Backstage UI',
  description: 'UI library for Backstage',
  metadataBase: new URL('https://ui.backstage.io'),
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
          <Sidebar />
          <Toolbar />
          <div className={styles.container}>{children}</div>
          <CustomTheme />
        </Providers>
      </body>
    </html>
  );
}
