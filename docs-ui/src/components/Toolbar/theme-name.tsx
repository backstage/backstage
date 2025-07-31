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
import { Icon } from '@backstage/ui';
import { usePlayground } from '@/utils/playground-context';

const themes = [
  { name: 'Backstage', value: 'default' },
  { name: 'Spotify', value: 'spotify' },
  { name: 'Custom theme', value: 'custom' },
];

export const ThemeNameSelector = () => {
  const { selectedThemeName, setSelectedThemeName } = usePlayground();

  return (
    <Select
      selectedKey={selectedThemeName || 'default'}
      onSelectionChange={setSelectedThemeName}
    >
      <Button className={styles.Select}>
        <SelectValue />
        <Icon name="chevron-down" />
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
