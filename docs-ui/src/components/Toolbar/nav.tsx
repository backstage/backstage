'use client';

import { Tabs } from '@base-ui-components/react/tabs';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import styles from './nav.module.css';

export const Nav = () => {
  const pathname = usePathname();
  const router = useRouter();

  const onValueChange = (value: string) => {
    if (value === 'docs') {
      router.push('/');
    } else {
      router.push('/playground');
    }
  };

  return (
    <Tabs.Root
      className={styles.tabs}
      value={pathname.includes('playground') ? 'playground' : 'docs'}
      onValueChange={onValueChange}
    >
      <Tabs.List className={styles.list}>
        <Tabs.Tab
          className={styles.tab}
          value="docs"
          onClick={() => {
            router.push('/');
          }}
        >
          Documentation
        </Tabs.Tab>
        <Tabs.Tab
          className={styles.tab}
          value="playground"
          onClick={() => {
            router.push('/playground');
          }}
        >
          Playground
        </Tabs.Tab>
        <Tabs.Indicator className={styles.indicator} />
      </Tabs.List>
    </Tabs.Root>
  );
};
