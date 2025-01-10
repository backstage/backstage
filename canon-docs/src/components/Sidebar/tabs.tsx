'use client';

import styles from './Tabs.module.css';
import { Tabs } from '@base-ui-components/react/tabs';
import { Icon } from '../../../../packages/canon/src/components/Icon';
import { Text } from '../../../../packages/canon/src/components/Text';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { usePlayground } from '@/utils/playground-context';

export const TabsVersion = () => {
  const { selectedThemeName, setSelectedThemeName } = usePlayground();
  return (
    <Tabs.Root
      className={styles.tabs}
      onValueChange={setSelectedThemeName}
      value={selectedThemeName}
    >
      <Tabs.List className={styles.list}>
        <Tabs.Tab className={styles.tab} value="legacy">
          <Text variant="caption" weight="bold">
            Theme 1
          </Text>
        </Tabs.Tab>
        <Tabs.Tab className={styles.tab} value="default">
          <Text variant="caption" weight="bold">
            Theme 2
          </Text>
        </Tabs.Tab>
        <Tabs.Indicator className={styles.indicator} />
      </Tabs.List>
    </Tabs.Root>
  );
};

export const TabsTheme = () => {
  const { selectedTheme, setSelectedTheme } = usePlayground();

  return (
    <Tabs.Root
      className={styles.tabsTheme}
      onValueChange={setSelectedTheme}
      value={selectedTheme}
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
