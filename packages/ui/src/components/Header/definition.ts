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
import type { HeaderOwnProps } from './types';
import styles from './Header.module.css';

/**
 * Component definition for Header
 * @public
 */
export const HeaderDefinition = defineComponent<HeaderOwnProps>()({
  styles,
  bg: 'consumer',
  classNames: {
    headerTop: 'bui-HeaderTop',
    stickySentinel: 'bui-HeaderStickySentinel',
    content: 'bui-HeaderContent',
    headerBottom: 'bui-HeaderBottom',
    breadcrumbs: 'bui-HeaderBreadcrumbs',
    breadcrumbsSmall: 'bui-HeaderBreadcrumbsSmall',
    breadcrumbLink: 'bui-HeaderBreadcrumbLink',
    breadcrumbLinkSmall: 'bui-HeaderBreadcrumbLinkSmall',
    breadcrumbSeparator: 'bui-HeaderBreadcrumbSeparator',
    titleStack: 'bui-HeaderTitleStack',
    title: 'bui-HeaderTitle',
    titleSmall: 'bui-HeaderTitleSmall',
    tabsWrapper: 'bui-HeaderTabsWrapper',
    controls: 'bui-HeaderControls',
    tags: 'bui-HeaderTags',
    tag: 'bui-HeaderTag',
    description: 'bui-HeaderDescription',
    metaRow: 'bui-HeaderMetaRow',
    metaItem: 'bui-HeaderMetaItem',
  },
  propDefs: {
    title: {},
    customActions: {},
    tabs: {},
    activeTabId: {},
    breadcrumbs: {},
    description: {},
    tags: {},
    metadata: {},
    className: {},
    sticky: {},
  },
});

/**
 * @public
 * @deprecated Use {@link HeaderDefinition} instead.
 */
export const HeaderPageDefinition = HeaderDefinition;
