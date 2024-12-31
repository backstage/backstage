'use client';

import Link from 'next/link';
import { components, coreConcepts, layoutComponents } from '@/utils/data';
import { Box, Text } from '@backstage/canon';
import { motion } from 'framer-motion';
import styles from './Sidebar.module.css';
import { usePathname } from 'next/navigation';

export const Docs = () => {
  const pathname = usePathname();
  const isPlayground = pathname.includes('/playground');

  return (
    <motion.div
      className={styles.section}
      animate={{
        x: isPlayground ? -10 : 0,
        opacity: isPlayground ? 0 : 1,
        visibility: isPlayground ? 'hidden' : 'visible',
      }}
      initial={{
        x: isPlayground ? -10 : 0,
        opacity: isPlayground ? 0 : 1,
        visibility: isPlayground ? 'hidden' : 'visible',
      }}
      transition={{ duration: 0.2 }}
    >
      <Box marginTop="md" marginBottom="xs">
        <Text variant="subtitle" weight="bold">
          Core Concepts
        </Text>
      </Box>
      {coreConcepts.map(concept => (
        <Link href={`/core-concepts/${concept.slug}`} key={concept.slug}>
          <Text variant="body">{concept.title}</Text>
        </Link>
      ))}
      <Box marginTop="md" marginBottom="xs">
        <Text variant="subtitle" weight="bold">
          Layout Components
        </Text>
      </Box>
      {layoutComponents.map(component => (
        <Link href={`/components/${component.slug}`} key={component.slug}>
          <Text variant="body">{component.title}</Text>
        </Link>
      ))}
      <Box marginTop="md" marginBottom="xs">
        <Text variant="subtitle" weight="bold">
          Components
        </Text>
      </Box>
      {components.map(component => (
        <Link href={`/components/${component.slug}`} key={component.slug}>
          <Text variant="body">{component.title}</Text>
        </Link>
      ))}
    </motion.div>
  );
};
