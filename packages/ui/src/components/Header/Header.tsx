/*
 * Copyright 2025 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { HeaderProps } from './types';
import { HeaderToolbar } from './HeaderToolbar';
import { Tabs, TabList, Tab } from '../Tabs';
import { useStyles } from '../../hooks/useStyles';
import { HeaderDefinition } from './definition';
import { type NavigateOptions } from 'react-router-dom';
import { useRef } from 'react';
import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect';
import styles from './Header.module.css';
import clsx from 'clsx';

declare module 'react-aria-components' {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

/**
 * A component that renders a toolbar.
 *
 * @public
 */
export const Header = (props: HeaderProps) => {
  const { classNames, cleanedProps } = useStyles(HeaderDefinition, props);
  const {
    className,
    tabs,
    icon,
    title,
    titleLink,
    customActions,
    onTabSelectionChange,
  } = cleanedProps;

  const hasTabs = tabs && tabs.length > 0;
  const headerRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return undefined;

    const updateHeight = () => {
      const height = el.offsetHeight;
      document.documentElement.style.setProperty(
        '--bui-header-height',
        `${height}px`,
      );
    };

    // Set height once immediately
    updateHeight();

    // Observe for resize changes if ResizeObserver is available
    // (not present in Jest/jsdom by default)
    if (typeof ResizeObserver === 'undefined') {
      return () => {
        document.documentElement.style.removeProperty('--bui-header-height');
      };
    }

    const observer = new ResizeObserver(updateHeight);
    observer.observe(el);

    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty('--bui-header-height');
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className={clsx(classNames.root, styles[classNames.root])}
    >
      <HeaderToolbar
        icon={icon}
        title={title}
        titleLink={titleLink}
        customActions={customActions}
        hasTabs={hasTabs}
      />
      {tabs && (
        <div
          className={clsx(
            classNames.tabsWrapper,
            styles[classNames.tabsWrapper],
            className,
          )}
        >
          <Tabs onSelectionChange={onTabSelectionChange}>
            <TabList>
              {tabs?.map(tab => (
                <Tab
                  key={tab.id}
                  id={tab.id}
                  href={tab.href}
                  matchStrategy={tab.matchStrategy}
                >
                  {tab.label}
                </Tab>
              ))}
            </TabList>
          </Tabs>
        </div>
      )}
    </header>
  );
};
