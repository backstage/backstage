'use client';

import { RiGithubLine, RiNpmjsLine } from '@remixicon/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Logo } from './Logo';
import { ThemeSelector } from './theme';
import { ThemeNameSelector } from './theme-name';
import styles from './Toolbar.module.css';

interface ToolbarProps {
  version: string;
}

export const Toolbar = ({ version }: ToolbarProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  // Transform scroll velocity to vertical movement
  const y = useTransform(scrollY, [0, 100], [0, -20], {
    clamp: false,
  });

  return (
    <div className={styles.toolbar} ref={containerRef}>
      <div className={styles.left}>
        <Logo />
      </div>
      <motion.div className={styles.right} style={{ y }}>
        <div className={styles.version}>Version {version} - Alpha</div>
        <div className={styles.actions}>
          <div className={styles.versionLinks}>
            <a
              href="https://github.com/backstage/backstage/tree/master/packages/ui"
              target="_blank"
            >
              <RiGithubLine size={16} />
            </a>
            <a
              href="https://www.npmjs.com/package/@backstage/ui"
              target="_blank"
            >
              <RiNpmjsLine size={16} />
            </a>
          </div>
          <ThemeNameSelector />
          <ThemeSelector />
        </div>
      </motion.div>
    </div>
  );
};
