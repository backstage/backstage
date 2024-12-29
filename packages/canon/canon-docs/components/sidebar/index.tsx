import styles from './Sidebar.module.css';
import Image from 'next/image';
import { TabsVersion, TabsTheme, TabsPages } from '../Tabs';
import { Grid } from '../../../src/components/Grid';
import Link from 'next/link';

export const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.content}>
        <Image src="/logo.svg" alt="Canon" width={89} height={27} priority />
        <div className={styles.actions}>
          <TabsVersion />
          <TabsTheme />
        </div>
        <TabsPages />
        <div className={styles.menu}>
          <h2 className={styles.title}>Core Concepts</h2>
          <Link href="/docs/core-concepts/introduction">Iconography</Link>
          <Link href="/docs/core-concepts/components">Layout</Link>
          <Link href="/docs/core-concepts/accessibility">Responsive</Link>
          <Link href="/docs/core-concepts/theming">Theming</Link>
          <h2 className={styles.title}>Components</h2>
          <Link href="/docs/components/button">Button</Link>
          <Link href="/docs/components/card">Card</Link>
          <Link href="/docs/components/input">Input</Link>
          <Link href="/docs/components/select">Select</Link>
        </div>
      </div>
    </div>
  );
};
