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
  TabProps as AriaTabProps,
  TabsProps as AriaTabsProps,
} from 'react-aria-components';
import { MutableRefObject } from 'react';

/**
 * Props for the Tabs component.
 *
 * @public
 */
export interface TabsProps extends AriaTabsProps {}

/**
 * Props for the Tab component.
 *
 * @public
 */
export interface TabProps extends AriaTabProps {
  onHover?: (key: string | null) => void;
  onRegister?: (key: string, element: HTMLDivElement | null) => void;
}

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
