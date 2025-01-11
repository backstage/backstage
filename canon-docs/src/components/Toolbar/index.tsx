import Link from 'next/link';
import { TabsVersion, TabsTheme } from './tabs';
import styles from './styles.module.css';
import { Nav } from './nav';

export const Toolbar = () => {
  return (
    <div className={styles.toolbar}>
      <div>
        <Nav />
      </div>
      <div className={styles.actions}>
        <TabsVersion />
        <TabsTheme />
      </div>
    </div>
  );
};
