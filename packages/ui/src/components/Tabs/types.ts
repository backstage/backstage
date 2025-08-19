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

import type {
  TabsProps as AriaTabsProps,
  TabListProps as AriaTabListProps,
  TabPanelProps as AriaTabPanelProps,
  TabProps as AriaTabProps,
} from 'react-aria-components';
import { MutableRefObject } from 'react';

/**
 * Strategies for matching the current route to determine which tab should be active.
 *
 * @public
 */
export type TabMatchStrategy = 'exact' | 'prefix';

/**
 * Props for the Tabs component.
 *
 * @public
 */
export interface TabsProps extends AriaTabsProps {}

/**
 * Props for the TabList component.
 *
 * @public
 */
export interface TabListProps extends Omit<AriaTabListProps<object>, 'items'> {}

/**
 * Props for the Tab component.
 *
 * @public
 */
export interface TabProps extends AriaTabProps {
  /**
   * Strategy for matching the current route to determine if this tab should be active.
   * - 'exact': Tab href must exactly match the current pathname (default)
   * - 'prefix': Tab is active if current pathname starts with tab href
   */
  matchStrategy?: 'exact' | 'prefix';
}

/** Context for sharing refs between Tabs and TabList
 *
 * @internal
 */
export interface TabsContextValue {
  tabsRef: React.RefObject<HTMLDivElement>;
  tabRefs: React.MutableRefObject<Map<string, HTMLDivElement>>;
  hoveredKey: string | null;
  prevHoveredKey: React.MutableRefObject<string | null>;
  setHoveredKey: (key: string | null) => void;
  setTabRef: (key: string, element: HTMLDivElement | null) => void;
}

/**
 * Props for the TabPanel component.
 *
 * @public
 */
export interface TabPanelProps extends AriaTabPanelProps {}

/**
 * Props for the TabsIndicators component.
 *
 * @internal
 */
export interface TabsIndicatorsProps {
  tabRefs: MutableRefObject<Map<string, HTMLDivElement>>;
  tabsRef: MutableRefObject<HTMLDivElement | null>;
  hoveredKey: string | null;
  prevHoveredKey: MutableRefObject<string | null>;
}
