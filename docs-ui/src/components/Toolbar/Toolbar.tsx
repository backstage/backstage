'use client';

import {
  RiArrowDownSLine,
  RiArrowRightSLine,
  RiGithubLine,
  RiMoonLine,
  RiSunLine,
} from '@remixicon/react';
import {
  Button,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectValue,
  ToggleButton,
  ToggleButtonGroup,
} from 'react-aria-components';
import styles from './Toolbar.module.css';
import { usePlayground } from '@/utils/playground-context';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { components } from '@/utils/data';
import { Logo } from '@/components/Sidebar/Logo';

interface ToolbarProps {
  version: string;
}

const themes = [
  { name: 'Backstage', value: 'backstage' },
  { name: 'Spotify', value: 'spotify' },
  { name: 'Custom theme', value: 'custom' },
];

export const Toolbar = ({ version }: ToolbarProps) => {
  const {
    selectedTheme,
    setSelectedTheme,
    selectedThemeName,
    setSelectedThemeName,
  } = usePlayground();

  const pathname = usePathname();

  // Determine breadcrumb content based on current path
  const getBreadcrumb = () => {
    const allComponents = components;

    // Components index page
    if (pathname === '/components') {
      return { section: null, title: 'Components' };
    }

    // Component detail pages
    if (pathname?.startsWith('/components/')) {
      const slug = pathname.split('/components/')[1];
      const component = allComponents.find(c => c.slug === slug);
      return {
        section: 'Components',
        sectionLink: '/components',
        title: component?.title || slug,
      };
    }

    // Tokens page
    if (pathname === '/tokens') {
      return { section: null, title: 'Tokens' };
    }

    // Changelog page
    if (pathname === '/changelog') {
      return { section: null, title: 'Changelog' };
    }

    return { section: null, title: '' };
  };

  const breadcrumb = getBreadcrumb();

  return (
    <div className={styles.toolbar}>
      <div className={styles.breadcrumb}>
        <div className={styles.logoMobile}>
          <Logo />
        </div>
        <div className={styles.breadcrumbDesktop}>
          {breadcrumb.section && breadcrumb.sectionLink ? (
            <>
              <Link
                href={breadcrumb.sectionLink}
                className={styles.breadcrumbLink}
              >
                {breadcrumb.section}
              </Link>
              <RiArrowRightSLine
                size={16}
                className={styles.breadcrumbSeparator}
              />
              <span className={styles.breadcrumbCurrent}>
                {breadcrumb.title}
              </span>
            </>
          ) : (
            <span className={styles.breadcrumbCurrent}>{breadcrumb.title}</span>
          )}
        </div>
      </div>
      <div className={styles.actions}>
        <Select
          defaultValue="backstage"
          value={selectedThemeName}
          onChange={setSelectedThemeName}
        >
          <Button className={styles.bubble}>
            <SelectValue />
            <RiArrowDownSLine aria-hidden="true" size={16} />
          </Button>
          <Popover className={styles.Popup}>
            <ListBox className={styles.ListBox}>
              {themes.map(({ name, value }) => (
                <ListBoxItem key={value} id={value} className={styles.Item}>
                  {name}
                </ListBoxItem>
              ))}
            </ListBox>
          </Popover>
        </Select>
        <a
          href="https://www.npmjs.com/package/@backstage/ui"
          target="_blank"
          className={styles.bubble}
          data-hide-tablet
        >
          Version {version}
        </a>
        <a
          href="https://github.com/backstage/backstage/tree/master/packages/ui"
          target="_blank"
          className={styles.bubble}
          data-hide-tablet
        >
          <RiGithubLine size={16} />
        </a>
        <ToggleButtonGroup
          defaultSelectedKeys={['light']}
          selectedKeys={selectedTheme}
          onSelectionChange={setSelectedTheme}
          disallowEmptySelection
          className={styles.buttonGroup}
        >
          <ToggleButton id="light">
            <RiSunLine aria-hidden="true" size={16} />
          </ToggleButton>
          <ToggleButton id="dark">
            <RiMoonLine aria-hidden="true" size={16} />
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
    </div>
  );
};
