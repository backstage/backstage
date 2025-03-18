import type { Metadata } from 'next';

import styles from './layout.module.css';

export const metadata: Metadata = {
  title: 'Canon',
  description: 'UI library for Backstage',
};

export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className={styles.pageContainer}>{children}</div>;
}
