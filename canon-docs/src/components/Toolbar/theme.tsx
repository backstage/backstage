'use client';

import { Tabs } from '@base-ui-components/react/tabs';
import { Icon } from '@backstage/canon';
import { usePlayground } from '@/utils/playground-context';
import styles from './theme.module.css';

export const ThemeSelector = () => {
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
