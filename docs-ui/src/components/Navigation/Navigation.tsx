'use client';

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
import { components, layoutComponents } from '@/utils/data';
import styles from './Navigation.module.css';

interface NavigationProps {
  onLinkClick?: () => void;
}

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

export const Navigation = ({ onLinkClick }: NavigationProps) => {
  const pathname = usePathname();

  return (
    <>
      <nav className={styles.topNav}>
        <ul>
          <li>
            <Link href="/" data-active={pathname === '/'} onClick={onLinkClick}>
              <RiHazeLine size={20} />
              Get Started
            </Link>
          </li>
          <li>
            <Link
              href="/tokens"
              data-active={pathname === '/tokens'}
              onClick={onLinkClick}
            >
              <RiPaletteLine size={20} />
              Tokens
            </Link>
          </li>
          <li>
            <Link
              href="/components"
              data-active={pathname.startsWith('/components')}
              onClick={onLinkClick}
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
              onClick={onLinkClick}
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
              const isActive = pathname === `${section.url}/${item.slug}`;

              return (
                <Link
                  href={`${section.url}/${item.slug}`}
                  key={item.slug}
                  className={clsx(styles.line, {
                    [styles.active]: isActive,
                  })}
                  onClick={onLinkClick}
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
    </>
  );
};
