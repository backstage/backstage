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

import { forwardRef } from 'react';
import { Tabs as TabsPrimitive } from '@base-ui-components/react/tabs';
import type { TabsRootWithoutOrientation } from './types';
import clsx from 'clsx';

const TabsRoot = forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  TabsRootWithoutOrientation
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Root
    ref={ref}
    className={clsx('canon-TabsRoot', className)}
    {...props}
  />
));
TabsRoot.displayName = TabsPrimitive.Root.displayName;

const TabsList = forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, children, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={clsx('canon-TabsList', className)}
    {...props}
  >
    {children}
    <TabsPrimitive.Indicator className="canon-TabsIndicator" />
  </TabsPrimitive.List>
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTab = forwardRef<
  React.ElementRef<typeof TabsPrimitive.Tab>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Tab>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Tab
    ref={ref}
    className={clsx('canon-TabsTab', className)}
    {...props}
  />
));
TabsTab.displayName = TabsPrimitive.Tab.displayName;

const TabsPanel = forwardRef<
  React.ElementRef<typeof TabsPrimitive.Panel>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Panel>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Panel
    ref={ref}
    className={clsx('canon-TabsPanel', className)}
    {...props}
  />
));
TabsPanel.displayName = TabsPrimitive.Panel.displayName;

/** @public */
export const Tabs = {
  Root: TabsRoot,
  List: TabsList,
  Tab: TabsTab,
  Panel: TabsPanel,
};
