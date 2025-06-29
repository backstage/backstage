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
 * Represents a tab item in the toolbar navigation.
 *
 * @public
 */
export interface ToolbarTab {
  label: string;
}

/**
 * Represents an option item in the toolbar dropdown menu.
 *
 * @public
 */
export interface ToolbarOption {
  label: string;
  value: string;
  onClick?: () => void;
}

/**
 * Props for the main Toolbar component.
 *
 * @public
 */
export interface ToolbarProps {
  icon?: React.ReactNode;
  name?: string;
  tabs?: ToolbarTab[];
  options?: ToolbarOption[];
}

/**
 * Props for individual toolbar tab components.
 *
 * @public
 */
export interface ToolbarTabProps {
  tab: ToolbarTab;
  setTabRef: (key: string, element: HTMLDivElement | null) => void;
  setHoveredKey: (key: string | null) => void;
}

/**
 * Props for the toolbar indicators component that handles tab highlighting and animation.
 *
 * @public
 */
export interface ToolbarIndicatorsProps {
  tabRefs: MutableRefObject<Map<string, HTMLDivElement>>;
  tabsRef: MutableRefObject<HTMLDivElement | null>;
  hoveredKey: string | null;
  prevHoveredKey: MutableRefObject<string | null>;
}
