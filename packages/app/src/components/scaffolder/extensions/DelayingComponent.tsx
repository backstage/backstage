/*
 * Copyright 2023 The Backstage Authors
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
import {
  NextFieldExtensionComponentProps,
  createNextScaffolderFieldExtension,
} from '@backstage/plugin-scaffolder-react/alpha';
import type { FieldValidation } from '@rjsf/utils';
import {
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
} from '@material-ui/core';

export const DelayingComponent = createNextScaffolderFieldExtension({
  name: 'DelayingComponent',
  component: (props: NextFieldExtensionComponentProps<string>) => {
    const {
      onChange,
      formData,
      rawErrors = [],
      required,
      schema: { title, description },
    } = props;

    return (
      <FormControl
        margin="normal"
        required={required}
        error={(rawErrors ?? []).length > 0 && !formData}
      >
        <InputLabel htmlFor={title}>{title}</InputLabel>
        <Input
          id={title}
          aria-describedby="description"
          onChange={e => onChange(e.target?.value)}
          value={formData ?? ''}
        />
        <FormHelperText id="description">{description}</FormHelperText>
      </FormControl>
    );
  },
  validation: async (value: string, validation: FieldValidation) => {
    // delay 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));
    if (value !== 'pass') {
      validation.addError('value was not equal to pass');
    }
  },
});
