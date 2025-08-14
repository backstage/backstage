'use client';

import { motion, useScroll, useTransform, circOut } from 'framer-motion';
import { RiGithubLine, RiNpmjsLine } from '@remixicon/react';
import { ThemeSelector } from '../Toolbar/theme';
import { ThemeNameSelector } from '../Toolbar/theme-name';
import { useCurrentPage } from '@/hooks/useCurrentPage';
import styles from './StickyHeader.module.css';

export const StickyHeader = () => {
  const { scrollY } = useScroll();
  const currentPage = useCurrentPage();

  // Transform scroll position to opacity only
  const opacity = useTransform(scrollY, [100, 200], [0, 1], {
    clamp: false,
  });

  const yPos = useTransform(scrollY, [200, 500], [-60, 0], {
    clamp: true,
    ease: circOut,
  });

  return (
    <motion.div
      className={styles.stickyHeader}
      style={{
        opacity,
        y: yPos,
      }}
    >
      <div className={styles.name}>{currentPage || 'Backstage UI'}</div>
      <div className={styles.actions}>
        <div className={styles.versionLinks}>
          <a
            href="https://github.com/backstage/backstage/tree/master/packages/ui"
            target="_blank"
          >
            <RiGithubLine size={16} />
          </a>
          <a href="https://www.npmjs.com/package/@backstage/ui" target="_blank">
            <RiNpmjsLine size={16} />
          </a>
        </div>
        <ThemeNameSelector />
        <ThemeSelector />
      </div>
    </motion.div>
  );
};
