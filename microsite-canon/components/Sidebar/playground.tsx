'use client';

import { components } from '@/utils/data';
import { Box, Checkbox, Text } from '@backstage/canon';
import { motion } from 'framer-motion';
import styles from './Sidebar.module.css';
import { usePathname } from 'next/navigation';
import { screenSizes, ScreenSize } from '@/utils/data';
import { usePlayground } from '@/utils/playground-context';

export const Playground = () => {
  const pathname = usePathname();
  const isPlayground = pathname.includes('/playground');
  const {
    selectedScreenSizes,
    setSelectedScreenSizes,
    selectedComponents,
    setSelectedComponents,
  } = usePlayground();

  const handleComponentCheckboxChange = (slug: string) => {
    if (selectedComponents.find(item => item === slug)) {
      const res = selectedComponents.filter(item => item !== slug);
      setSelectedComponents(res);
    } else {
      setSelectedComponents([...selectedComponents, slug]);
    }
  };

  const handleCheckboxChange = (slug: string) => {
    if (selectedScreenSizes.find(item => item === slug)) {
      const res = selectedScreenSizes.filter(item => item !== slug);
      setSelectedScreenSizes(res);
    } else {
      setSelectedScreenSizes([...selectedScreenSizes, slug]);
    }
  };

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
          <Checkbox
            checked={selectedComponents.includes(slug)}
            onChange={() => handleComponentCheckboxChange(slug)}
          />
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
          <Checkbox
            checked={selectedScreenSizes.includes(slug)}
            onChange={() => handleCheckboxChange(slug)}
          />
        </div>
      ))}
    </motion.div>
  );
};
