'use client';

import { Tabs } from '@base-ui-components/react/tabs';
import { usePlayground } from '@/utils/playground-context';
import styles from './theme.module.css';
import { RiMoonLine, RiSunLine } from '@remixicon/react';

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
          <RiSunLine aria-hidden="true" size={16} />
        </Tabs.Tab>
        <Tabs.Tab className={styles.tab} value="dark">
          <RiMoonLine aria-hidden="true" size={16} />
        </Tabs.Tab>
        <Tabs.Indicator className={styles.indicator} />
      </Tabs.List>
    </Tabs.Root>
  );
};
