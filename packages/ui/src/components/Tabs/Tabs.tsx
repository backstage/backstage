/*
 * Copyright 2024 The Backstage Authors
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

import {
  useRef,
  useState,
  Children,
  cloneElement,
  isValidElement,
  ReactNode,
  createContext,
  useContext,
} from 'react';
import type {
  TabsProps,
  TabListProps,
  TabPanelProps,
  TabsContextValue,
  TabProps,
} from './types';
import { useLocation, useNavigate, useHref } from 'react-router-dom';
import { TabsIndicators } from './TabsIndicators';
import {
  Tabs as AriaTabs,
  TabList as AriaTabList,
  Tab as AriaTab,
  TabPanel as AriaTabPanel,
  RouterProvider,
  TabProps as AriaTabProps,
} from 'react-aria-components';
import { useStyles } from '../../hooks/useStyles';
import { TabsDefinition } from './definition';
import styles from './Tabs.module.css';
import clsx from 'clsx';

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tab components must be used within a Tabs component');
  }
  return context;
};

/**
 * Utility function to determine if a tab should be active based on the matching strategy.
 * This follows the pattern used in WorkaroundNavLink from the sidebar.
 */
const isTabActive = (
  tabHref: string,
  currentPathname: string,
  matchStrategy: 'exact' | 'prefix',
): boolean => {
  if (matchStrategy === 'exact') {
    return tabHref === currentPathname;
  }

  // Prefix matching - similar to WorkaroundNavLink behavior
  if (tabHref === currentPathname) {
    return true;
  }

  // Check if current path starts with tab href followed by a slash
  // This prevents /foo matching /foobar
  return currentPathname.startsWith(`${tabHref}/`);
};

/**
 * A component that renders a list of tabs.
 *
 * @public
 */
export const Tabs = (props: TabsProps) => {
  const { classNames, cleanedProps } = useStyles(TabsDefinition, props);
  const { className, children, ...rest } = cleanedProps;
  const tabsRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const prevHoveredKey = useRef<string | null>(null);
  let navigate = useNavigate();
  const location = useLocation();

  const setTabRef = (key: string, element: HTMLDivElement | null) => {
    if (element) {
      tabRefs.current.set(key, element);
    } else {
      tabRefs.current.delete(key);
    }
  };

  // If selectedKey is not provided, try to determine it from the current route
  const computedSelectedKey = (() => {
    const childrenArray = Children.toArray(children as ReactNode);
    for (const child of childrenArray) {
      if (isValidElement(child) && child.type === TabList) {
        const tabListChildren = Children.toArray(child.props.children);
        for (const tabChild of tabListChildren) {
          if (isValidElement(tabChild) && tabChild.props.href) {
            // Use tab-specific strategy, defaulting to 'exact'
            const strategy = tabChild.props.matchStrategy || 'exact';
            if (isTabActive(tabChild.props.href, location.pathname, strategy)) {
              return tabChild.props.id;
            }
          }
        }

        //No route matches - check if all tabs have hrefs (pure navigation)
        const allTabsHaveHref = tabListChildren.every(
          child => isValidElement(child) && child.props.href,
        );

        if (allTabsHaveHref) {
          // Pure navigation tabs, no route match
          return null;
        } else {
          // Mixed tabs or pure local state
          return undefined;
        }
      }
    }
    return undefined;
  })();

  if (!children) return null;

  const contextValue: TabsContextValue = {
    tabsRef,
    tabRefs,
    hoveredKey,
    prevHoveredKey,
    setHoveredKey,
    setTabRef,
  };

  return (
    <TabsContext.Provider value={contextValue}>
      <RouterProvider navigate={navigate} useHref={useHref}>
        <AriaTabs
          className={clsx(classNames.tabs, styles[classNames.tabs], className)}
          keyboardActivation="manual"
          selectedKey={computedSelectedKey}
          ref={tabsRef}
          {...rest}
        >
          {children as ReactNode}
        </AriaTabs>
      </RouterProvider>
    </TabsContext.Provider>
  );
};

/**
 * A component that renders a list of tabs.
 *
 * @public
 */
export const TabList = (props: TabListProps) => {
  const { classNames, cleanedProps } = useStyles(TabsDefinition, props);
  const { className, children, ...rest } = cleanedProps;
  const { setHoveredKey, tabRefs, tabsRef, hoveredKey, prevHoveredKey } =
    useTabsContext();

  const handleHover = (key: string | null) => {
    setHoveredKey(key);
  };

  // Clone children with additional props for hover and ref management
  const enhancedChildren = Children.map(children as ReactNode, child => {
    if (isValidElement(child)) {
      return cloneElement(child, {
        onHoverStart: () => handleHover(child.props.id as string),
        onHoverEnd: () => handleHover(null),
      } as Partial<AriaTabProps>);
    }
    return child;
  });

  return (
    <div
      className={clsx(
        classNames.tabListWrapper,
        styles[classNames.tabListWrapper],
        className,
      )}
    >
      <AriaTabList
        className={clsx(classNames.tabList, styles[classNames.tabList])}
        aria-label="Toolbar tabs"
        {...rest}
      >
        {enhancedChildren}
      </AriaTabList>
      <TabsIndicators
        tabRefs={tabRefs}
        tabsRef={tabsRef}
        hoveredKey={hoveredKey}
        prevHoveredKey={prevHoveredKey}
      />
    </div>
  );
};

/**
 * A component that renders a tab.
 *
 * @public
 */
export const Tab = (props: TabProps) => {
  const { classNames, cleanedProps } = useStyles(TabsDefinition, props);
  const {
    className,
    href,
    children,
    id,
    matchStrategy: _matchStrategy,
    ...rest
  } = cleanedProps;
  const { setTabRef } = useTabsContext();

  return (
    <AriaTab
      id={id}
      className={clsx(classNames.tab, styles[classNames.tab], className)}
      ref={el => setTabRef(id as string, el as HTMLDivElement)}
      href={href}
      {...rest}
    >
      {children}
    </AriaTab>
  );
};

/**
 * A component that renders the content of a tab.
 *
 * @public
 */
export const TabPanel = (props: TabPanelProps) => {
  const { classNames, cleanedProps } = useStyles(TabsDefinition, props);
  const { className, children, ...rest } = cleanedProps;

  return (
    <AriaTabPanel
      className={clsx(classNames.panel, styles[classNames.panel], className)}
      {...rest}
    >
      {children}
    </AriaTabPanel>
  );
};
