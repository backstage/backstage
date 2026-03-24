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
import type { GridOwnProps, GridItemOwnProps } from './types';
import styles from './Grid.module.css';

/**
 * Component definition for Grid
 * @public
 */
export const GridDefinition = defineComponent<GridOwnProps>()({
  styles,
  classNames: {
    root: 'bui-Grid',
  },
  bg: 'provider',
  propDefs: {
    bg: { dataAttribute: true },
    children: {},
    className: {},
    style: {},
  },
  utilityProps: [
    'columns',
    'gap',
    'm',
    'mb',
    'ml',
    'mr',
    'mt',
    'mx',
    'my',
    'p',
    'pb',
    'pl',
    'pr',
    'pt',
    'px',
    'py',
  ],
});

/**
 * Component definition for GridItem
 * @public
 */
export const GridItemDefinition = defineComponent<GridItemOwnProps>()({
  styles,
  classNames: {
    root: 'bui-GridItem',
  },
  bg: 'provider',
  propDefs: {
    bg: { dataAttribute: true },
    children: {},
    className: {},
    style: {},
  },
  utilityProps: ['colSpan', 'colEnd', 'colStart', 'rowSpan'],
});
