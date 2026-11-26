import type { Metadata } from 'next';
import { version as packageVersion } from '../../../packages/ui/package.json';
import { Sidebar } from '@/components/Sidebar/Sidebar';
import { Toolbar } from '@/components/Toolbar';
import { Providers } from './providers';
import { CustomTheme } from '@/components/CustomTheme';
import { TableOfContents } from '@/components/TableOfContents';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import styles from './layout.module.css';

import '../css/globals.css';
import '../css/theme-backstage.css';
import '../css/theme-spotify.css';

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
      data-theme-mode="light"
      data-theme-name="backstage"
      suppressHydrationWarning
    >
      <body>
        <Providers>
          <Sidebar />
          <div className={styles.container}>
            <div className={styles.contentWrapper}>
              <Toolbar version={packageVersion} />
              <div className={styles.content}>
                <div className={styles.contentInner}>{children}</div>
                <aside className={styles.toc}>
                  <TableOfContents />
                </aside>
              </div>
            </div>
          </div>
          <MobileBottomNav />
          <CustomTheme />
        </Providers>
      </body>
    </html>
  );
}
