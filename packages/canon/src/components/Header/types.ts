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

import { MutableRefObject } from 'react';

/**
 * Props for the main Header component.
 *
 * @public
 */
export interface HeaderProps {
  icon?: React.ReactNode;
  title?: string;
  tabs?: HeaderTab[];
  options?: HeaderOption[];
  breadcrumbs?: HeaderBreadcrumb[];
}

/**
 * Represents a tab item in the header navigation.
 *
 * @public
 */
export interface HeaderTab {
  label: string;
  href?: string;
}

/**
 * Represents an option item in the header dropdown menu.
 *
 * @public
 */
export interface HeaderOption {
  label: string;
  value: string;
  onClick?: () => void;
}

/**
 * Represents a breadcrumb item in the header.
 *
 * @public
 */
export interface HeaderBreadcrumb {
  label: string;
  href: string;
}

/**
 * Props for individual header tab components.
 *
 * @public
 */
export interface HeaderTabProps {
  tab: HeaderTab;
  setTabRef: (key: string, element: HTMLDivElement | null) => void;
  setHoveredKey: (key: string | null) => void;
}

/**
 * Props for the header indicators component that handles tab highlighting and animation.
 *
 * @public
 */
export interface HeaderIndicatorsProps {
  tabRefs: MutableRefObject<Map<string, HTMLDivElement>>;
  tabsRef: MutableRefObject<HTMLDivElement | null>;
  hoveredKey: string | null;
  prevHoveredKey: MutableRefObject<string | null>;
}
