'use client';

import { Tabs } from '@base-ui-components/react/tabs';
import { Icon, Text } from '../../../../packages/canon';
import { usePlayground } from '@/utils/playground-context';
import styles from './tabs.module.css';

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
