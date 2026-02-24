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
import type { CheckboxOwnProps } from './types';
import styles from './Checkbox.module.css';

/**
 * Component definition for Checkbox
 * @public
 */
export const CheckboxDefinition = defineComponent<CheckboxOwnProps>()({
  styles,
  classNames: {
    root: 'bui-Checkbox',
    indicator: 'bui-CheckboxIndicator',
  },
  propDefs: {
    selected: { dataAttribute: true },
    indeterminate: { dataAttribute: true },
    children: {},
    className: {},
    style: {},
  },
});
