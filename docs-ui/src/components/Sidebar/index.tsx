'use client';

import styles from './Sidebar.module.css';
import {
  components,
  overview,
  layoutComponents,
  coreConcepts,
} from '@/utils/data';
import { ScrollArea } from '@base-ui-components/react/scroll-area';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { Fragment } from 'react';

const data = [
  {
    title: 'Overview',
    content: overview,
    url: '',
  },
  {
    title: 'Core Concepts',
    content: coreConcepts,
    url: '',
  },
  {
    title: 'Layout Components',
    content: layoutComponents,
    url: '/components',
  },
  {
    title: 'Components',
    content: components,
    url: '/components',
  },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const isPlayground = pathname.includes('/playground');

  return (
    <div className={styles.sidebar}>
      <ScrollArea.Root className={styles.root}>
        <ScrollArea.Viewport className={styles.viewport}>
          <div className={styles.content}>
            <div className={styles.menu}>
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
                {data.map(section => {
                  return (
                    <Fragment key={section.title}>
                      <div className={styles.sectionTitle}>{section.title}</div>

                      {section.content.map(item => {
                        const isActive =
                          pathname === `${section.url}/${item.slug}`;

                        return (
                          <Link
                            href={`${section.url}/${item.slug}`}
                            key={item.slug}
                            className={`${styles.line} ${
                              isActive ? styles.active : ''
                            }`}
                          >
                            <div className={styles.lineTitle}>{item.title}</div>
                            <div className={styles.lineStatus}>
                              {item.status === 'alpha' && 'Alpha'}
                              {item.status === 'beta' && 'Beta'}
                              {item.status === 'inProgress' && 'In Progress'}
                              {item.status === 'stable' && 'Stable'}
                              {item.status === 'deprecated' && 'Deprecated'}
                            </div>
                          </Link>
                        );
                      })}
                    </Fragment>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar className={styles.scrollbar}>
          <ScrollArea.Thumb className={styles.thumb} />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </div>
  );
};
