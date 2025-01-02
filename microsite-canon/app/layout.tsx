import type { Metadata } from 'next';
import { Sidebar } from '../components/Sidebar';

import styles from './page.module.css';
import { Providers } from './providers';
import { cookies } from 'next/headers';

import './globals.css';
import '@/public/core.css';
import '@/public/components.css';
import '@/public/backstage.css';

export const metadata: Metadata = {
  title: 'Canon',
  description: 'UI library for Backstage',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = cookieStore.get('theme')?.value || 'light';
  const themeName = cookieStore.get('theme-name')?.value || 'default';

  return (
    <html lang="en" data-theme={theme} data-theme-name={themeName}>
      <body>
        <Providers>
          <div className={styles.global}>
            <Sidebar />
            <div className={styles.container}>{children}</div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
