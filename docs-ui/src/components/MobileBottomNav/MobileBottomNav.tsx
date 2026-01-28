'use client';

import { useState } from 'react';
import { RiMoonLine, RiSunLine } from '@remixicon/react';
import { Button, ToggleButton, ToggleButtonGroup } from 'react-aria-components';
import styles from './MobileBottomNav.module.css';
import { usePlayground } from '@/utils/playground-context';
import { MobileMenu } from './MobileMenu';
import { AnimatedMenuIcon } from './AnimatedMenuIcon';

export const MobileBottomNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { selectedTheme, setSelectedTheme } = usePlayground();

  return (
    <>
      <div className={styles.mobileBottomNav}>
        <div className={styles.island}>
          <Button
            className={styles.menuButton}
            onPress={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <AnimatedMenuIcon isOpen={isMenuOpen} size={20} />
          </Button>
          <ToggleButtonGroup
            selectedKeys={selectedTheme}
            onSelectionChange={setSelectedTheme}
            disallowEmptySelection
            className={styles.buttonGroup}
          >
            <ToggleButton id="light" aria-label="Light mode">
              <RiSunLine size={20} />
            </ToggleButton>
            <ToggleButton id="dark" aria-label="Dark mode">
              <RiMoonLine size={20} />
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      </div>
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};
