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
  useMemo,
  Children,
  cloneElement,
  isValidElement,
  createContext,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import type { ReactNode } from 'react';
import type {
  TabsProps,
  TabListProps,
  TabPanelProps,
  TabsContextValue,
  TabProps,
} from './types';
import { useLocation } from 'react-router-dom';
import { TabsIndicators } from './TabsIndicators';
import {
  Tabs as AriaTabs,
  TabList as AriaTabList,
  Tab as AriaTab,
  TabPanel as AriaTabPanel,
  TabProps as AriaTabProps,
} from 'react-aria-components';
import { useStyles } from '../../hooks/useStyles';
import { TabsDefinition } from './definition';
import {
  isInternalLink,
  createRoutingRegistration,
} from '../InternalLinkProvider';
import styles from './Tabs.module.css';
import clsx from 'clsx';

const { RoutingProvider, useRoutingRegistrationEffect } =
  createRoutingRegistration();

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tab components must be used within a Tabs component');
  }
  return context;
};

type TabSelectionContextValue = {
  registerRoutedTab: (id: string) => void;
  unregisterRoutedTab: (id: string) => void;
  registerActiveTab: (id: string, segmentCount: number) => void;
  unregisterActiveTab: (id: string) => void;
};

const TabSelectionContext = createContext<TabSelectionContextValue | null>(
  null,
);

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

  // State for tracking routed tabs (tabs with hrefs)
  const [routedTabs, setRoutedTabs] = useState<Set<string>>(() => new Set());

  // State for tracking active tabs reported by TabRouteRegistration components
  const [activeTabs, setActiveTabs] = useState<Map<string, number>>(
    () => new Map(),
  );

  const setTabRef = (key: string, element: HTMLDivElement | null) => {
    if (element) {
      tabRefs.current.set(key, element);
    } else {
      tabRefs.current.delete(key);
    }
  };

  // Compute the selected tab based on active tabs with highest segment count
  const selectedTabId = useMemo(() => {
    // No routed tabs - let React Aria handle selection (uncontrolled mode)
    if (routedTabs.size === 0) {
      return undefined;
    }

    // Has routed tabs but none are active - controlled mode with no selection
    if (activeTabs.size === 0) {
      return null;
    }

    let selectedId: string | null = null;
    let maxSegments = -1;

    activeTabs.forEach((segmentCount, id) => {
      // Pick tab with highest segment count, first one wins on tie
      if (segmentCount > maxSegments) {
        maxSegments = segmentCount;
        selectedId = id;
      }
    });

    return selectedId;
  }, [routedTabs, activeTabs]);

  const registerRoutedTab = useCallback((id: string) => {
    setRoutedTabs(prev => new Set(prev).add(id));
  }, []);

  const unregisterRoutedTab = useCallback((id: string) => {
    setRoutedTabs(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const registerActiveTab = useCallback((id: string, segmentCount: number) => {
    setActiveTabs(prev => new Map(prev).set(id, segmentCount));
  }, []);

  const unregisterActiveTab = useCallback((id: string) => {
    setActiveTabs(prev => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  if (!children) return null;

  const tabsContextValue: TabsContextValue = {
    tabsRef,
    tabRefs,
    hoveredKey,
    prevHoveredKey,
    setHoveredKey,
    setTabRef,
  };

  const selectionContextValue: TabSelectionContextValue = useMemo(
    () => ({
      registerRoutedTab,
      unregisterRoutedTab,
      registerActiveTab,
      unregisterActiveTab,
    }),
    [
      registerRoutedTab,
      unregisterRoutedTab,
      registerActiveTab,
      unregisterActiveTab,
    ],
  );

  return (
    <RoutingProvider>
      <TabsContext.Provider value={tabsContextValue}>
        <TabSelectionContext.Provider value={selectionContextValue}>
          <AriaTabs
            className={clsx(
              classNames.tabs,
              styles[classNames.tabs],
              className,
            )}
            keyboardActivation="manual"
            selectedKey={selectedTabId}
            ref={tabsRef}
            {...rest}
          >
            {children as ReactNode}
          </AriaTabs>
        </TabSelectionContext.Provider>
      </TabsContext.Provider>
    </RoutingProvider>
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
 * Internal component for tabs with internal hrefs.
 * Handles routing registration and active tab tracking.
 * Separated to avoid conditional hook usage in Tab component.
 * @internal
 */
function RoutedTabEffects({
  id,
  href,
  matchStrategy = 'exact',
}: {
  id: string;
  href: string;
  matchStrategy?: 'exact' | 'prefix';
}) {
  const selectionCtx = useContext(TabSelectionContext);
  const location = useLocation();

  // Register with RoutingProvider for conditional RouterProvider wrapping
  useRoutingRegistrationEffect(href);

  // Register as a routed tab (for controlled vs uncontrolled mode)
  useEffect(() => {
    if (selectionCtx) {
      selectionCtx.registerRoutedTab(id);
      return () => selectionCtx.unregisterRoutedTab(id);
    }
    return undefined;
  }, [id, selectionCtx]);

  // Register as active tab when URL matches (for tab selection)
  const isActive = isTabActive(href, location.pathname, matchStrategy);
  const segmentCount = href.split('/').filter(Boolean).length;

  useEffect(() => {
    if (isActive && selectionCtx) {
      selectionCtx.registerActiveTab(id, segmentCount);
      return () => selectionCtx.unregisterActiveTab(id);
    }
    return undefined;
  }, [isActive, id, segmentCount, selectionCtx]);

  return null;
}

/**
 * A component that renders a tab.
 *
 * @public
 */
export const Tab = (props: TabProps) => {
  const { classNames, cleanedProps } = useStyles(TabsDefinition, props);
  const { className, href, children, id, matchStrategy, ...rest } =
    cleanedProps;
  const { setTabRef } = useTabsContext();

  return (
    <>
      {isInternalLink(href) && (
        <RoutedTabEffects
          id={id as string}
          href={href}
          matchStrategy={matchStrategy}
        />
      )}
      <AriaTab
        id={id}
        className={clsx(classNames.tab, styles[classNames.tab], className)}
        ref={el => setTabRef(id as string, el as HTMLDivElement)}
        href={href}
        {...rest}
      >
        {children}
      </AriaTab>
    </>
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
