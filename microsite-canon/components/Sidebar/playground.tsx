'use client';

import { components } from '@/utils/data';
import { Box, Checkbox, Text } from '@backstage/canon';
import { motion } from 'framer-motion';
import styles from './Sidebar.module.css';
import { usePathname } from 'next/navigation';
import { screenSizes } from '@/utils/data';

export const Playground = () => {
  const pathname = usePathname();
  const isPlayground = pathname.includes('/playground');

  return (
    <motion.div
      className={styles.section}
      animate={{
        opacity: isPlayground ? 1 : 0,
        x: isPlayground ? 0 : 20,
        visibility: isPlayground ? 'visible' : 'hidden',
      }}
      initial={{
        opacity: isPlayground ? 1 : 0,
        x: isPlayground ? 0 : 20,
        visibility: isPlayground ? 'visible' : 'hidden',
      }}
      transition={{ duration: 0.2 }}
      style={{ position: 'absolute' }}
    >
      <Box marginTop="md" marginBottom="xs">
        <Text variant="subtitle" weight="bold">
          Components
        </Text>
      </Box>
      {components.map(({ slug, title }) => (
        <div className={styles.line} key={slug}>
          <Text variant="body">{title}</Text>
          <Checkbox />
        </div>
      ))}
      <Box marginTop="md" marginBottom="xs">
        <Text variant="subtitle" weight="bold">
          Screen sizes
        </Text>
      </Box>
      {screenSizes.map(({ slug, title }) => (
        <div className={styles.line} key={slug}>
          <Text variant="body">{title}</Text>
          <Checkbox />
        </div>
      ))}
    </motion.div>
  );
};
