/*
 * Copyright 2025 The Backstage Authors
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
import type { AlertOwnProps } from './types';
import styles from './Alert.module.css';

/**
 * Component definition for Alert
 * @public
 */
export const AlertDefinition = defineComponent<AlertOwnProps>()({
  styles,
  classNames: {
    root: 'bui-Alert',
    content: 'bui-AlertContent',
    icon: 'bui-AlertIcon',
    spinner: 'bui-AlertSpinner',
    actions: 'bui-AlertActions',
  },
  surface: 'container',
  propDefs: {
    status: { dataAttribute: true, default: 'info' },
    loading: { dataAttribute: true },
    icon: {},
    customActions: {},
    surface: {},
    children: {},
    className: {},
    style: {},
  },
  utilityProps: [
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
