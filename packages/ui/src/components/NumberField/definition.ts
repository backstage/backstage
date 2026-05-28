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
import type { NumberFieldOwnProps } from './types';
import styles from './NumberField.module.css';

/**
 * Component definition for NumberField
 * @public
 */
export const NumberFieldDefinition = defineComponent<NumberFieldOwnProps>()({
  styles,
  classNames: {
    root: 'bui-NumberField',
    inputWrapper: 'bui-InputWrapper',
    input: 'bui-Input',
    inputIcon: 'bui-InputIcon',
    stepperButtons: 'bui-StepperButtons',
    stepperButton: 'bui-StepperButton',
  },
  bg: 'consumer',
  propDefs: {
    size: { dataAttribute: true, default: 'small' },
    className: {},
    icon: {},
    placeholder: {},
    label: {},
    description: {},
    secondaryLabel: {},
  },
});
