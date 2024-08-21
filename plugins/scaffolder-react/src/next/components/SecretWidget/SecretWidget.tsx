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

import React from 'react';
import { WidgetProps } from '@rjsf/utils';
import { useTemplateSecrets } from '@backstage/plugin-scaffolder-react';
import TextField from '@material-ui/core/TextField';
import get from 'lodash/get';
import set from 'lodash/set';

const getPath = (id: any, idSeparator?: string) => {
  if (typeof id !== 'string') return '';

  const [_root, ...parts] = id.split(idSeparator || '_');
  return parts.join('.');
};

/**
 * Secret Widget for overriding the default password input widget
 * @alpha
 */
export const SecretWidget = (
  props: Pick<
    WidgetProps,
    'onChange' | 'schema' | 'required' | 'disabled' | 'idSchema'
  > & {
    idSeparator?: string;
  },
) => {
  const { setSecrets, secrets } = useTemplateSecrets();

  const {
    onChange,
    schema: { title, minLength, maxLength },
    required,
    disabled,
    idSchema: { $id },
    idSeparator,
  } = props;

  const onChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const redactedValue = Array(value.length).fill('*').join('');
    onChange(redactedValue);

    const path = getPath($id, idSeparator);
    setSecrets(set({}, path, value));
  };

  const value = get(secrets, getPath($id, idSeparator), '');

  return (
    <TextField
      id={title}
      label={title}
      aria-describedby={title}
      onChange={onChangeText}
      value={value}
      type="password"
      autoComplete="off"
      required={required}
      disabled={disabled}
      inputProps={{
        minLength,
        maxLength,
      }}
    />
  );
};
