import type { Metadata } from 'next';
import { Sidebar } from '../components/Sidebar';
import { Toolbar } from '@/components/Toolbar';
import { StickyHeader } from '../components/StickyHeader/StickyHeader';
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
      data-theme="light"
      data-theme-name="default"
      suppressHydrationWarning
    >
      <body>
        <Providers>
          <Sidebar />
          <Toolbar version={packageVersion} />
          <StickyHeader />
          <div className={styles.container}>
            <div className={styles.content}>{children}</div>
          </div>
          <CustomTheme />
        </Providers>
      </body>
    </html>
  );
}
