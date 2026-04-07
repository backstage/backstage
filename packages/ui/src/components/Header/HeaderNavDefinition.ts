/*
 * Copyright 2026 The Backstage Authors
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

import { defineComponent } from '../../hooks/useDefinition';
import type { HeaderNavTabItem } from './types';
import styles from './HeaderNav.module.css';

/** @public */
export const HeaderNavDefinition = defineComponent<{
  noTrack?: boolean;
  tabs: HeaderNavTabItem[];
  activeTabId?: string;
  children?: React.ReactNode;
  className?: string;
}>()({
  styles,
  classNames: {
    root: 'bui-HeaderNav',
    list: 'bui-HeaderNavList',
    active: 'bui-HeaderNavActive',
    hovered: 'bui-HeaderNavHovered',
  },
  analytics: true,
  propDefs: {
    noTrack: {},
    tabs: {},
    activeTabId: {},
    children: {},
    className: {},
  },
});

/** @public */
export const HeaderNavItemDefinition = defineComponent<{
  className?: string;
}>()({
  styles,
  classNames: {
    root: 'bui-HeaderNavItem',
  },
  propDefs: {
    className: {},
  },
});

/** @public */
export const HeaderNavGroupDefinition = defineComponent<{
  className?: string;
}>()({
  styles,
  classNames: {
    root: 'bui-HeaderNavGroup',
  },
  propDefs: {
    className: {},
  },
});
