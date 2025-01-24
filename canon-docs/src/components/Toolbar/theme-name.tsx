'use client';

import { Select } from '@base-ui-components/react/select';
import styles from './theme-name.module.css';
import { Icon } from '@backstage/canon';
import { usePlayground } from '@/utils/playground-context';

const themes = [
  { name: 'Backstage Default', value: 'default' },
  { name: 'Backstage Legacy', value: 'legacy' },
  { name: 'Custom theme', value: 'custom' },
];

export const ThemeNameSelector = () => {
  const { selectedThemeName, setSelectedThemeName } = usePlayground();

  return (
    <Select.Root
      value={selectedThemeName || 'default'}
      onValueChange={setSelectedThemeName}
    >
      <Select.Trigger className={styles.Select}>
        <Select.Value
          className={styles.SelectValue}
          placeholder="Select a theme"
        />
        <Select.Icon className={styles.SelectIcon}>
          <Icon name="chevronDown" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner className={styles.Positioner} sideOffset={8}>
          <Select.Popup className={styles.Popup}>
            {themes.map(({ name, value }) => (
              <Select.Item className={styles.Item} value={value} key={value}>
                <Select.ItemIndicator className={styles.ItemIndicator}>
                  <Icon name="check" />
                </Select.ItemIndicator>
                <Select.ItemText className={styles.ItemText}>
                  {name}
                </Select.ItemText>
              </Select.Item>
            ))}
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
};
