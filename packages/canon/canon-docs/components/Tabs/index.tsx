'use client';

import styles from './Tabs.module.css';
import { Tabs } from '@base-ui-components/react/tabs';
import { Icon } from '../../../src/components/Icon';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

export const TabsVersion = () => {
  return (
    <Tabs.Root className={styles.tabs} defaultValue="v1">
      <Tabs.List className={styles.list}>
        <Tabs.Tab className={styles.tab} value="v1">
          V1
        </Tabs.Tab>
        <Tabs.Tab className={styles.tab} value="v2">
          V2
        </Tabs.Tab>
        <Tabs.Indicator className={styles.indicator} />
      </Tabs.List>
    </Tabs.Root>
  );
};

export const TabsTheme = () => {
  const searchParams = useSearchParams();
  const theme = searchParams.get('theme') === 'dark' ? 'dark' : 'light';
  const current = new URLSearchParams(Array.from(searchParams.entries()));
  const router = useRouter();

  const onValueChange = (value: string) => {
    current.set('theme', value);
    router.push(`/?${current.toString()}`);
    document.documentElement.setAttribute('data-theme', value);
  };

  return (
    <Tabs.Root
      className={styles.tabs}
      value={theme}
      onValueChange={onValueChange}
    >
      <Tabs.List className={styles.list}>
        <Tabs.Tab className={styles.tab} value="light">
          <Icon name="sun" />
        </Tabs.Tab>
        <Tabs.Tab className={styles.tab} value="dark">
          <Icon name="moon" />
        </Tabs.Tab>
        <Tabs.Indicator className={styles.indicator} />
      </Tabs.List>
    </Tabs.Root>
  );
};

export const TabsPages = () => {
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
        <Tabs.Tab className={styles.tab} value="docs">
          Documentation
        </Tabs.Tab>
        <Tabs.Tab className={styles.tab} value="playground">
          Playground
        </Tabs.Tab>
        <Tabs.Indicator className={styles.indicator} />
      </Tabs.List>
    </Tabs.Root>
  );
};
