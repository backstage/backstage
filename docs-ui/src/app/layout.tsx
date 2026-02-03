import type { Metadata } from 'next';
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

async function getLatestPackageVersion(): Promise<string> {
  try {
    const response = await fetch('https://registry.npmjs.org/@backstage/ui', {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error('Failed to fetch package info');
    }

    const data = await response.json();
    return data['dist-tags']?.latest;
  } catch (error) {
    console.error('Error fetching package version:', error);
    return '0.0.0';
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const packageVersion = await getLatestPackageVersion();

  return (
    <html
      lang="en"
      data-theme-mode="light"
      data-theme-name="backstage"
      suppressHydrationWarning
    >
      <head>
        <link rel="stylesheet" href="/theme-backstage.css" />
        <link rel="stylesheet" href="/theme-spotify.css" />
      </head>
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
