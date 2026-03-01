/*
 * Copyright 2020 The Backstage Authors
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

/**
 * HeaderTabs — migrated from MUI Tabs/Tab/makeStyles to Tailwind utility
 * classes and native HTML elements with accessible `data-state` attributes.
 * Radix Tabs primitives are available in `ui/tabs.tsx` for future adoption;
 * this component preserves the existing imperative `onChange(index)` API
 * for backward compatibility with consumers across Backstage.
 *
 * Supports the `tabProps.component` pattern used by RoutedTabs to render
 * tabs as `<Link>` elements (anchor tags) for react-router navigation.
 */

import { cn } from '../../lib/utils';
import {
  createElement,
  useCallback,
  useEffect,
  useState,
} from 'react';

/** @public */
export type HeaderTabsClassKey =
  | 'tabsWrapper'
  | 'defaultTab'
  | 'selected'
  | 'tabRoot';

export type Tab = {
  id: string;
  label: string;
  tabProps?: Record<string, any>;
};

type HeaderTabsProps = {
  tabs: Tab[];
  onChange?: (index: number) => void;
  selectedIndex?: number;
};

/**
 * Horizontal Tabs component
 *
 * @public
 *
 */
export function HeaderTabs(props: HeaderTabsProps) {
  const { tabs, onChange, selectedIndex } = props;
  const [selectedTab, setSelectedTab] = useState<number>(selectedIndex ?? 0);

  const handleChange = useCallback(
    (index: number) => {
      if (selectedIndex === undefined) {
        setSelectedTab(index);
      }
      if (onChange) onChange(index);
    },
    [selectedIndex, onChange],
  );

  useEffect(() => {
    if (selectedIndex !== undefined) {
      setSelectedTab(selectedIndex);
    }
  }, [selectedIndex]);

  return (
    <div
      className={cn(
        'bg-card pl-3 min-w-0',
        '[grid-area:pageSubheader]',
      )}
    >
      <div
        role="tablist"
        aria-label="tabs"
        className="flex overflow-x-auto scrollbar-none"
      >
        {tabs.map((tab, index) => {
          const isActive = (selectedIndex ?? selectedTab) === index;
          const { component, ...restTabProps } = tab.tabProps ?? {};

          /**
           * Common attributes applied to the tab element, whether it's
           * a plain <button> or a custom component (e.g. <Link>).
           */
          const commonProps: Record<string, any> = {
            key: tab.id,
            role: 'tab',
            'data-testid': `header-tab-${index}`,
            'data-state': isActive ? 'active' : 'inactive',
            'aria-selected': isActive ? 'true' : 'false',
            tabIndex: isActive ? 0 : -1,
            className: cn(
              'px-3 py-3 text-xs uppercase font-bold whitespace-nowrap',
              'transition-colors border-b-2 border-transparent',
              'text-muted-foreground',
              'hover:bg-accent hover:text-foreground',
              isActive && 'text-foreground border-b-primary',
            ),
            onClick: () => handleChange(index),
            ...restTabProps,
          };

          /**
           * When tabProps.component is specified (e.g. `Link`), render
           * using that component so the tab becomes an <a> tag with
           * proper href / react-router navigation. Otherwise, render
           * a standard <button>.
           */
          if (component) {
            return createElement(
              component,
              commonProps,
              <span>{tab.label}</span>,
            );
          }

          return (
            <button
              {...commonProps}
              type="button"
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
