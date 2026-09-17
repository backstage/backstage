'use client';

import Link from 'next/link';
import { components } from '@/utils/data';
import styles from './ComponentGrid.module.css';

export const ComponentGrid = () => {
  return (
    <div className={styles.grid}>
      {components.map(item => (
        <Link
          key={item.slug}
          href={`/components/${item.slug}`}
          className={styles.item}
        >
          {item.title}
        </Link>
      ))}
    </div>
  );
};
