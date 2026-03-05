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

import { defineComponent } from '../../hooks/useDefinition';
import type {
  TabsOwnProps,
  TabListOwnProps,
  TabOwnProps,
  TabPanelOwnProps,
  TabsIndicatorsOwnProps,
} from './types';
import styles from './Tabs.module.css';

/**
 * Component definition for Tabs
 * @public
 */
export const TabsDefinition = defineComponent<TabsOwnProps>()({
  styles,
  classNames: {
    root: 'bui-Tabs',
  },
  propDefs: {
    className: {},
    children: {},
  },
});

/** @internal */
export const TabListDefinition = defineComponent<TabListOwnProps>()({
  styles,
  classNames: {
    root: 'bui-TabListWrapper',
    tabList: 'bui-TabList',
  },
  propDefs: {
    className: {},
    children: {},
  },
});

/** @internal */
export const TabDefinition = defineComponent<TabOwnProps>()({
  styles,
  classNames: {
    root: 'bui-Tab',
  },
  propDefs: {
    className: {},
    matchStrategy: {},
    href: {},
    id: {},
  },
});

/** @internal */
export const TabPanelDefinition = defineComponent<TabPanelOwnProps>()({
  styles,
  classNames: {
    root: 'bui-TabPanel',
  },
  propDefs: {
    className: {},
  },
});

/** @internal */
export const TabsIndicatorsDefinition =
  defineComponent<TabsIndicatorsOwnProps>()({
    styles,
    classNames: {
      root: 'bui-TabActive',
      hovered: 'bui-TabHovered',
    },
    propDefs: {
      tabRefs: {},
      tabsRef: {},
      hoveredKey: {},
      prevHoveredKey: {},
    },
  });
