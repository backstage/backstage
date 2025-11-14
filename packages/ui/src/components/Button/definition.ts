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

import type { RAExtendingComponentDefinition } from '../../types';
import { defineOwnProps } from '../../utils/defineOwnProps';
import { ButtonOwnProps } from './types';

/**
 * Component definition for Button
 * @public
 */
export const ButtonDefinition = {
  classNames: {
    root: 'bui-Button',
    content: 'bui-ButtonContent',
    spinner: 'bui-ButtonSpinner',
  } as const,
  dataAttributes: ['size', 'variant', 'loading'] as const,
  ownProps: defineOwnProps([
    'size',
    'variant',
    'iconStart',
    'iconEnd',
    'loading',
    'children',
    'className',
  ]),
  defaults: {
    size: 'small',
    variant: 'primary',
  },
} as const satisfies RAExtendingComponentDefinition<ButtonOwnProps>;
