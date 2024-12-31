import Link from 'next/link';
import { components } from '@/utils/data';
import { Box, Checkbox, Text } from '@backstage/canon';
import { motion } from 'framer-motion';
import styles from './Sidebar.module.css';
import { usePathname } from 'next/navigation';

const breakpoints = [
  { title: 'XSmall', slug: 'xs' },
  { title: 'Small', slug: 'sm' },
  { title: 'Medium', slug: 'md' },
  { title: 'Large', slug: 'lg' },
  { title: 'XLarge', slug: 'xl' },
  { title: 'XXLarge', slug: '2xl' },
];

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
        <div className={styles.line}>
          <Text variant="body">{title}</Text>
          <Checkbox />
        </div>
      ))}
      <Box marginTop="md" marginBottom="xs">
        <Text variant="subtitle" weight="bold">
          Breakpoints
        </Text>
      </Box>
      {breakpoints.map(({ title }) => (
        <div className={styles.line}>
          <Text variant="body">{title}</Text>
          <Checkbox />
        </div>
      ))}
    </motion.div>
  );
};
