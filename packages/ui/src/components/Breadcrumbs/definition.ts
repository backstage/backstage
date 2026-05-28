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
import type {
  BreadcrumbsOwnProps,
  BreadcrumbSegmentOwnProps,
  BreadcrumbCurrentOwnProps,
} from './types';
import styles from './Breadcrumbs.module.css';

/**
 * Component definition for Breadcrumbs.
 * @public
 */
export const BreadcrumbsDefinition = defineComponent<BreadcrumbsOwnProps>()({
  styles,
  classNames: {
    root: 'bui-Breadcrumbs',
    ellipsis: 'bui-BreadcrumbEllipsis',
    ellipsisTrigger: 'bui-BreadcrumbEllipsisTrigger',
    separator: 'bui-BreadcrumbSeparator',
  },
  propDefs: {
    children: {},
    className: {},
    separator: {},
    variant: {},
    weight: {},
    color: {},
  },
});

/**
 * Component definition for BreadcrumbSegment.
 * @public
 */
export const BreadcrumbSegmentDefinition =
  defineComponent<BreadcrumbSegmentOwnProps>()({
    styles,
    classNames: {
      root: 'bui-Breadcrumb',
      label: 'bui-BreadcrumbLabel',
      separator: 'bui-BreadcrumbSeparator',
    },
    propDefs: {
      href: {},
      variant: {},
      weight: {},
      color: {},
      children: {},
    },
  });

/**
 * Component definition for BreadcrumbCurrent.
 * @public
 */
export const BreadcrumbCurrentDefinition =
  defineComponent<BreadcrumbCurrentOwnProps>()({
    styles,
    classNames: {
      root: 'bui-Breadcrumb',
      label: 'bui-BreadcrumbLabel',
      current: 'bui-BreadcrumbLabel--current',
    },
    propDefs: {
      as: { default: 'span' },
      variant: {},
      weight: {},
      color: {},
      children: {},
    },
  });
