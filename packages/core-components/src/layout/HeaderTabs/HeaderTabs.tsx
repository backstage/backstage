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

import {
  ShadcnTabs as Tabs,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs';
import { cn } from '../../lib/utils';
import {
  ComponentPropsWithoutRef,
  useCallback,
  useEffect,
  useState,
} from 'react';

// TODO(blam): Remove this implementation when the Tabs are ready
// This is just a temporary solution to implementing tabs for now

/** @public */
export type HeaderTabsClassKey =
  | 'tabsWrapper'
  | 'defaultTab'
  | 'selected'
  | 'tabRoot';

/**
 * Describes a single tab entry for the {@link HeaderTabs} component.
 *
 * @remarks
 * The `tabProps` field accepts standard HTML button attributes plus Radix UI's
 * `asChild` prop, which replaces the former MUI `component` prop pattern.
 * When `asChild` is `true`, the `TabsTrigger` merges its accessibility
 * attributes into the first child element instead of rendering its own button.
 *
 * @public
 */
export type Tab = {
  id: string;
  label: string;
  tabProps?: Omit<ComponentPropsWithoutRef<'button'>, 'value'> & {
    asChild?: boolean;
  };
};

type HeaderTabsProps = {
  tabs: Tab[];
  onChange?: (index: number) => void;
  selectedIndex?: number;
};

/**
 * Horizontal Tabs component
 *
 * @remarks
 * Migrated from MUI Tabs/Tab/makeStyles to shadcn/Radix Tabs primitives
 * with Tailwind CSS utility classes. The external API is preserved:
 * `tabs[]` array with string IDs, numeric `onChange(index)` callback,
 * and optional `selectedIndex` for controlled mode.
 *
 * Radix Tabs uses a string-based `value` internally, so the component
 * bridges between the numeric index API (for backward compatibility)
 * and the string-based tab ID that Radix expects.
 *
 * @public
 */
export function HeaderTabs(props: HeaderTabsProps) {
  const { tabs, onChange, selectedIndex } = props;
  const [selectedTab, setSelectedTab] = useState<number>(selectedIndex ?? 0);

  /**
   * Bridges Radix's string-based `onValueChange` callback to the numeric
   * index API that consumers expect from `onChange(index)`. Looks up the
   * tab ID in the `tabs` array to find the corresponding numeric index.
   */
  const handleValueChange = useCallback(
    (value: string) => {
      const index = tabs.findIndex(tab => tab.id === value);
      if (index === -1) return;
      if (selectedIndex === undefined) {
        setSelectedTab(index);
      }
      if (onChange) onChange(index);
    },
    [tabs, selectedIndex, onChange],
  );

  useEffect(() => {
    if (selectedIndex !== undefined) {
      setSelectedTab(selectedIndex);
    }
  }, [selectedIndex]);

  const currentTabId = tabs[selectedTab]?.id ?? tabs[0]?.id ?? '';

  return (
    <div
      className={cn(
        '[grid-area:pageSubheader]',
        'bg-background',
        'pl-6',
        'min-w-0',
      )}
    >
      <Tabs value={currentTabId} onValueChange={handleValueChange}>
        <TabsList
          className={cn(
            'bg-transparent',
            'h-auto',
            'w-full',
            'justify-start',
            'rounded-none',
            'border-b',
            'border-border',
            'p-0',
          )}
        >
          {tabs.map((tab, index) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              data-testid={`header-tab-${index}`}
              className={cn(
                'text-xs',
                'uppercase',
                'font-bold',
                'px-3',
                'py-3',
                'text-muted-foreground',
                'rounded-none',
                'border-b-2',
                'border-transparent',
                'shadow-none',
                'transition-colors',
                'data-[state=active]:text-foreground',
                'data-[state=active]:border-primary',
                'data-[state=active]:bg-transparent',
                'data-[state=active]:shadow-none',
                'hover:bg-accent',
                'hover:text-foreground',
              )}
              {...tab.tabProps}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
