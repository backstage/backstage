'use client';

import { useState, useEffect } from 'react';
import {
  RiArrowDownSLine,
  RiGithubLine,
  RiMoonLine,
  RiSearchLine,
  RiSunLine,
} from '@remixicon/react';
import {
  Button,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectValue,
  ToggleButton,
  ToggleButtonGroup,
} from 'react-aria-components';
import styles from './Toolbar.module.css';
import { usePlayground } from '@/utils/playground-context';
import { Logo } from '@/components/Sidebar/Logo';
import { CommandPalette } from '@/components/CommandPalette';

interface ToolbarProps {
  version: string;
}

const themes = [
  { name: 'Backstage', value: 'backstage' },
  { name: 'Spotify', value: 'spotify' },
  { name: 'Custom theme', value: 'custom' },
];

export const Toolbar = ({ version }: ToolbarProps) => {
  const {
    selectedTheme,
    setSelectedTheme,
    selectedThemeName,
    setSelectedThemeName,
  } = usePlayground();

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const isMac = /mac(os|intosh)/i.test(navigator.userAgent);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (isMac ? e.metaKey : e.ctrlKey)) {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={styles.toolbar}>
      <div className={styles.left}>
        <div className={styles.logoMobile}>
          <Logo />
        </div>
        <button
          type="button"
          className={styles.searchButton}
          onClick={() => setIsCommandPaletteOpen(true)}
        >
          <RiSearchLine size={14} />
          <span className={styles.searchLabel}>Search</span>
          <kbd className={styles.searchKbd}>⌘K</kbd>
        </button>
      </div>
      <div className={styles.actions}>
        <Select
          defaultValue="backstage"
          value={selectedThemeName}
          onChange={setSelectedThemeName}
        >
          <Button className={styles.bubble}>
            <SelectValue />
            <RiArrowDownSLine aria-hidden="true" size={16} />
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
        <a
          href="https://www.npmjs.com/package/@backstage/ui"
          target="_blank"
          className={styles.bubble}
          data-hide-tablet
        >
          Version {version}
        </a>
        <a
          href="https://github.com/backstage/backstage/tree/master/packages/ui"
          target="_blank"
          className={styles.bubble}
          data-hide-tablet
        >
          <RiGithubLine size={16} />
        </a>
        <ToggleButtonGroup
          defaultSelectedKeys={['light']}
          selectedKeys={selectedTheme}
          onSelectionChange={setSelectedTheme}
          disallowEmptySelection
          className={styles.buttonGroup}
        >
          <ToggleButton id="light">
            <RiSunLine aria-hidden="true" size={16} />
          </ToggleButton>
          <ToggleButton id="dark">
            <RiMoonLine aria-hidden="true" size={16} />
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onOpenChange={setIsCommandPaletteOpen}
      />
    </div>
  );
};
