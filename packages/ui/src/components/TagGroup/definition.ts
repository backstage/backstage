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
import type { TagGroupOwnProps, TagOwnProps } from './types';
import styles from './TagGroup.module.css';

/**
 * Component definition for TagGroup
 * @public
 */
export const TagGroupDefinition = defineComponent<TagGroupOwnProps>()({
  styles,
  classNames: {
    root: 'bui-TagGroup',
    list: 'bui-TagList',
  },
  propDefs: {
    items: {},
    children: {},
    renderEmptyState: {},
    className: {},
  },
});

/** @internal */
export const TagDefinition = defineComponent<TagOwnProps>()({
  styles,
  classNames: {
    root: 'bui-Tag',
    icon: 'bui-TagIcon',
    removeButton: 'bui-TagRemoveButton',
  },
  propDefs: {
    icon: {},
    size: { dataAttribute: true, default: 'small' },
    href: {},
    children: {},
    className: {},
  },
});
