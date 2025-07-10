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
} from 'react';
import type { TabsProps, TabProps } from './types';
import { useLocation, useNavigate, useHref } from 'react-router-dom';
import { HeaderTabsIndicators } from './HeaderTabsIndicators';
import {
  Tabs as AriaTabs,
  TabList as AriaTabList,
  Tab as AriaTab,
  RouterProvider,
} from 'react-aria-components';

import { useStyles } from '../../hooks/useStyles';

export const Tabs = (props: TabsProps) => {
  const { children } = props;
  const { classNames } = useStyles('Tabs');
  const tabsRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const prevHoveredKey = useRef<string | null>(null);
  const location = useLocation();
  let navigate = useNavigate();

  // If selectedKey is not provided, try to determine it from the current route
  const computedSelectedKey = (() => {
    const childrenArray = Children.toArray(children as ReactNode);
    for (const child of childrenArray) {
      if (isValidElement(child) && child.props.href === location.pathname) {
        return child.props.id;
      }
    }
    return undefined;
  })();

  const setTabRef = (key: string, element: HTMLDivElement | null) => {
    if (element) {
      tabRefs.current.set(key, element);
    } else {
      tabRefs.current.delete(key);
    }
  };

  const handleHover = (key: string | null) => {
    setHoveredKey(key);
  };

  // Clone children with additional props for hover and ref management
  const enhancedChildren = Children.map(children as ReactNode, child => {
    if (isValidElement(child)) {
      return cloneElement(child, {
        onHover: handleHover,
        onRegister: setTabRef,
      } as Partial<TabProps>);
    }
    return child;
  });

  if (!children) return null;

  return (
    <RouterProvider navigate={navigate} useHref={useHref}>
      <AriaTabs
        className={classNames.tabs}
        ref={tabsRef}
        keyboardActivation="manual"
        selectedKey={computedSelectedKey}
      >
        <AriaTabList className={classNames.tabList} aria-label="Toolbar tabs">
          {enhancedChildren}
        </AriaTabList>
        <HeaderTabsIndicators
          tabRefs={tabRefs}
          tabsRef={tabsRef}
          hoveredKey={hoveredKey}
          prevHoveredKey={prevHoveredKey}
        />
      </AriaTabs>
    </RouterProvider>
  );
};

export const Tab = (props: TabProps) => {
  const { href, children, id, onHover, onRegister } = props;
  const { classNames } = useStyles('Tabs');

  return (
    <AriaTab
      id={id}
      className={classNames.tab}
      ref={el => onRegister?.(id as string, el as HTMLDivElement)}
      onHoverStart={() => onHover?.(id as string)}
      onHoverEnd={() => onHover?.(null)}
      href={href}
    >
      {children}
    </AriaTab>
  );
};
