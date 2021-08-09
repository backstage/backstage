/*
 * Copyright 2021 The Backstage Authors
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

import type { FieldValidation } from '@rjsf/core';
import {
  createScaffolderFieldExtension,
  TextValuePicker,
  scaffolderPlugin,
} from '@backstage/plugin-scaffolder';

export const LowerCaseValuePickerFieldExtension = scaffolderPlugin.provide(
  createScaffolderFieldExtension({
    name: 'LowerCaseValuePicker',
    component: TextValuePicker,
    validation: (value: string, validation: FieldValidation) => {
      if (value.toLowerCase() !== value) {
        validation.addError('Only lowercase values are allowed.');
      }
    },
  }),
);
