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
import React from 'react';
import type { FieldValidation } from '@rjsf/utils';
import { scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { TextField } from '@material-ui/core';
import {
  NextFieldExtensionComponentProps,
  createNextScaffolderFieldExtension,
} from '@backstage/plugin-scaffolder-react/alpha';
import {
  createScaffolderFieldExtension,
  FieldExtensionComponentProps,
} from '@backstage/plugin-scaffolder-react';

const TextValuePicker = (props: FieldExtensionComponentProps<string>) => {
  const {
    onChange,
    required,
    schema: { title, description },
    rawErrors,
    formData,
    uiSchema: { 'ui:autofocus': autoFocus },
    idSchema,
    placeholder,
  } = props;

  return (
    <TextField
      id={idSchema?.$id}
      label={title}
      placeholder={placeholder}
      helperText={description}
      required={required}
      value={formData ?? ''}
      onChange={({ target: { value } }) => onChange(value)}
      margin="normal"
      error={rawErrors?.length > 0 && !formData}
      inputProps={{ autoFocus }}
    />
  );
};

export const LowerCaseValuePickerFieldExtension = scaffolderPlugin.provide(
  createScaffolderFieldExtension({
    name: 'LowerCaseValuePicker',
    component: TextValuePicker,
    validation: (value: string, validation: FieldValidation) => {
      if (value.toLocaleLowerCase('en-US') !== value) {
        validation.addError('Only lowercase values are allowed.');
      }
    },
  }),
);

const MockDelayComponent = (
  props: NextFieldExtensionComponentProps<{ test?: string }>,
) => {
  const { onChange, formData, rawErrors } = props;
  return (
    <TextField
      label="test"
      helperText="description"
      value={formData?.test ?? ''}
      onChange={({ target: { value } }) => onChange({ test: value })}
      margin="normal"
      error={rawErrors?.length > 0 && !formData}
    />
  );
};

export const DelayingComponentFieldExtension = scaffolderPlugin.provide(
  createNextScaffolderFieldExtension({
    name: 'DelayingComponent',
    component: MockDelayComponent,
    validation: async (
      value: { test?: string },
      validation: FieldValidation,
    ) => {
      // delay 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (value.test !== 'pass') {
        validation.addError('value was not equal to pass');
      }
    },
  }),
);
