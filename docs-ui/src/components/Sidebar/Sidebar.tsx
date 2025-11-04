'use client';

import styles from './Sidebar.module.css';
import { components, layoutComponents } from '@/utils/data';
import { ScrollArea } from '@base-ui-components/react/scroll-area';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';
import clsx from 'clsx';
import {
  RiCollageLine,
  RiFileHistoryLine,
  RiHazeLine,
  RiPaletteLine,
  RiServiceLine,
  RiStackLine,
} from '@remixicon/react';
import { Logo } from './Logo';

const data = [
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

  return (
    <div className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <Logo />
      </div>
      <ScrollArea.Root className={styles.root}>
        <ScrollArea.Viewport className={styles.viewport}>
          <div className={styles.content}>
            <div className={styles.menu}>
              <nav className={styles.topNav}>
                <ul>
                  <li>
                    <Link href="/" data-active={pathname === '/'}>
                      <RiHazeLine size={20} />
                      Get Started
                    </Link>
                  </li>
                  <li>
                    <Link href="/tokens" data-active={pathname === '/tokens'}>
                      <RiPaletteLine size={20} />
                      Tokens
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/components"
                      data-active={pathname.startsWith('/components')}
                    >
                      <RiCollageLine size={20} />
                      Components
                    </Link>
                  </li>
                  <li>
                    <div data-disabled={true}>
                      <RiStackLine size={20} />
                      Recipes (Soon)
                    </div>
                  </li>
                  <li>
                    <div data-disabled={true}>
                      <RiServiceLine size={20} />
                      Guides (Soon)
                    </div>
                  </li>
                  <li>
                    <Link
                      href="/changelog"
                      data-active={pathname === '/changelog'}
                    >
                      <RiFileHistoryLine size={20} />
                      Changelog
                    </Link>
                  </li>
                </ul>
              </nav>
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
                          className={clsx(styles.line, {
                            [styles.active]: isActive,
                          })}
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
