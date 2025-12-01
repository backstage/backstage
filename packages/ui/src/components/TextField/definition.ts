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

import type { ComponentDefinition } from '../../types';

/**
 * Component definition for TextField
 * @public
 */
export const TextFieldDefinition = {
  classNames: {
    root: 'bui-TextField',
    inputWrapper: 'bui-InputWrapper',
    input: 'bui-Input',
    inputIcon: 'bui-InputIcon',
    inputAction: 'bui-InputAction',
  },
  dataAttributes: {
    invalid: [true, false] as const,
    disabled: [true, false] as const,
    size: ['small', 'medium'] as const,
  },
} as const satisfies ComponentDefinition;
