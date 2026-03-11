'use client';

import Link from 'next/link';
import { hooks } from '@/utils/data';
import styles from './HookGrid.module.css';

export const HookGrid = () => {
  return (
    <div className={styles.grid}>
      {hooks.map(item => (
        <Link
          key={item.slug}
          href={`/hooks/${item.slug}`}
          className={styles.item}
        >
          {item.title}
        </Link>
      ))}
    </div>
  );
};
