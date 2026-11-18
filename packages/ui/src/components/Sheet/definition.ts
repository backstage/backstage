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
  SheetBodyOwnProps,
  SheetFooterOwnProps,
  SheetHeaderOwnProps,
  SheetOwnProps,
} from './types';
import styles from './Sheet.module.css';

/**
 * Component definition for Sheet
 * @public
 */
export const SheetDefinition = defineComponent<SheetOwnProps>()({
  styles,
  classNames: {
    root: 'bui-SheetOverlay',
    backdrop: 'bui-SheetBackdrop',
    container: 'bui-Sheet',
    content: 'bui-SheetContent',
    inner: 'bui-SheetInner',
  },
  propDefs: {
    children: {},
    className: {},
    width: {},
    height: {},
    style: {},
    'aria-label': {},
    'aria-labelledby': {},
    swipeAnimation: {},
    swipeAnimationRange: {},
    stackAnimation: { default: 'bui-sheet-stack' },
    overscrollPadding: { default: true },
  },
});

/**
 * Component definition for SheetHeader
 * @public
 */
export const SheetHeaderDefinition = defineComponent<SheetHeaderOwnProps>()({
  styles,
  classNames: {
    root: 'bui-SheetHeader',
    title: 'bui-SheetHeaderTitle',
  },
  propDefs: {
    children: {},
    className: {},
    level: {},
  },
});

/**
 * Component definition for SheetBody
 * @public
 */
export const SheetBodyDefinition = defineComponent<SheetBodyOwnProps>()({
  styles,
  classNames: {
    root: 'bui-SheetBody',
  },
  propDefs: {
    children: {},
    className: {},
  },
});

/**
 * Component definition for SheetFooter
 * @public
 */
export const SheetFooterDefinition = defineComponent<SheetFooterOwnProps>()({
  styles,
  classNames: {
    root: 'bui-SheetFooter',
  },
  propDefs: {
    children: {},
    className: {},
  },
});
