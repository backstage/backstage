import type { Metadata } from 'next';
import { Sidebar } from '../components/Sidebar';

import styles from './page.module.css';
import { Providers } from './providers';

import './globals.css';
import '/public/core.css';
import '/public/components.css';
import '/public/backstage.css';

export const metadata: Metadata = {
  title: 'Canon',
  description: 'UI library for Backstage',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const cookieStore = await cookies();
  // const theme = cookieStore.get('theme')?.value || 'light';
  // const themeName = cookieStore.get('theme-name')?.value || 'default';

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
            <div className={styles.container}>{children}</div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
