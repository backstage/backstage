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
  PluginHeaderOwnProps,
  PluginHeaderToolbarOwnProps,
} from './types';
import styles from './PluginHeader.module.css';

/**
 * Component definition for PluginHeader
 * @public
 */
export const PluginHeaderDefinition = defineComponent<PluginHeaderOwnProps>()({
  styles,
  classNames: {
    root: 'bui-PluginHeader',
    tabsWrapper: 'bui-PluginHeaderTabsWrapper',
  },
  propDefs: {
    icon: {},
    title: {},
    titleLink: {},
    customActions: {},
    tabs: {},
    onTabSelectionChange: {},
    className: {},
  },
});

/**
 * Component definition for PluginHeaderToolbar
 * @internal
 */
export const PluginHeaderToolbarDefinition =
  defineComponent<PluginHeaderToolbarOwnProps>()({
    styles,
    classNames: {
      root: 'bui-PluginHeaderToolbar',
      wrapper: 'bui-PluginHeaderToolbarWrapper',
      content: 'bui-PluginHeaderToolbarContent',
      controls: 'bui-PluginHeaderToolbarControls',
      icon: 'bui-PluginHeaderToolbarIcon',
      name: 'bui-PluginHeaderToolbarName',
    },
    propDefs: {
      icon: {},
      title: {},
      titleLink: {},
      customActions: {},
      hasTabs: {},
      className: {},
    },
  });
