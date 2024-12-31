'use client';

import styles from './Tabs.module.css';
import { Tabs } from '@base-ui-components/react/tabs';
import { Icon, Text } from '@backstage/canon';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export const TabsVersion = () => {
  return (
    <Tabs.Root className={styles.tabs} defaultValue="v1">
      <Tabs.List className={styles.list}>
        <Tabs.Tab className={styles.tab} value="v1">
          <Text variant="caption" weight="bold">
            V1
          </Text>
        </Tabs.Tab>
        <Tabs.Tab className={styles.tab} value="v2">
          <Text variant="caption" weight="bold">
            V2
          </Text>
        </Tabs.Tab>
        <Tabs.Indicator className={styles.indicator} />
      </Tabs.List>
    </Tabs.Root>
  );
};

export const TabsTheme = () => {
  const { theme, setTheme } = useTheme();

  const onValueChange = (value: string) => {
    setTheme(value);
  };

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Tabs.Root
      className={styles.tabs}
      value={isClient ? theme : 'light'}
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
        <Tabs.Tab
          className={styles.tab}
          value="docs"
          onClick={() => {
            router.push('/');
          }}
        >
          <Text variant="caption" weight="bold">
            Documentation
          </Text>
        </Tabs.Tab>
        <Tabs.Tab
          className={styles.tab}
          value="playground"
          onClick={() => {
            router.push('/playground');
          }}
        >
          <Text variant="caption" weight="bold">
            Playground
          </Text>
        </Tabs.Tab>
        <Tabs.Indicator className={styles.indicator} />
      </Tabs.List>
    </Tabs.Root>
  );
};
