'use client';

import styles from './Sidebar.module.css';
import { ScrollArea } from '@base-ui-components/react/scroll-area';
import { Logo } from './Logo';
import { Navigation } from '@/components/Navigation';

export const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <Logo />
      </div>
      <ScrollArea.Root className={styles.root}>
        <ScrollArea.Viewport className={styles.viewport}>
          <div className={styles.content}>
            <div className={styles.menu}>
              <Navigation />
            </div>
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar className={styles.scrollbar}>
          <ScrollArea.Thumb className={styles.thumb} />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </div>
  );
};
