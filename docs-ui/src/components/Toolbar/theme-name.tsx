'use client';

import {
  Button,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectValue,
} from 'react-aria-components';
import styles from './theme-name.module.css';
import { usePlayground } from '@/utils/playground-context';
import { RiArrowDownSLine } from '@remixicon/react';

const themes = [
  { name: 'Backstage', value: 'backstage' },
  { name: 'Spotify', value: 'spotify' },
  { name: 'Custom theme', value: 'custom' },
];

export const ThemeNameSelector = () => {
  const { selectedThemeName, setSelectedThemeName } = usePlayground();

  return (
    <Select
      selectedKey={selectedThemeName || 'backstage'}
      onSelectionChange={setSelectedThemeName}
    >
      <Button className={styles.Select}>
        <SelectValue />
        <RiArrowDownSLine aria-hidden="true" />
      </Button>
      <Popover className={styles.Popup}>
        <ListBox className={styles.ListBox}>
          {themes.map(({ name, value }) => (
            <ListBoxItem key={value} id={value} className={styles.Item}>
              {name}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </Select>
  );
};
