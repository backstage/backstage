'use client';

import styles from './styles.module.css';

export const Global = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles.global}>{children}</div>;
};
