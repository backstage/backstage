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

import { WidgetProps } from '@rjsf/utils';
import { useTemplateSecrets } from '@backstage/plugin-scaffolder-react';
import TextField from '@material-ui/core/TextField';
import React, { useMemo, useState } from 'react';
import debounce from 'lodash/debounce';

/**
 * Secret Widget for overriding the default password input widget
 * @alpha
 */
export const SecretWidget = (
  props: Pick<
    WidgetProps,
    'name' | 'onChange' | 'schema' | 'required' | 'disabled'
  >,
) => {
  const { setSecrets, secrets } = useTemplateSecrets();
  const {
    name,
    onChange,
    schema: { title, minLength, maxLength },
    required,
    disabled,
  } = props;

  const [localValue, setLocalValue] = useState(secrets[name] ?? '');

  // Memoize the debounced function so it persists across re-renders
  const debouncedSetSecrets = useMemo(
    () =>
      debounce((value: string) => {
        setSecrets({ [name]: value });
      }, 300),
    [setSecrets, name],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(Array(newValue.length).fill('*').join(''));
    debouncedSetSecrets(newValue);
  };

  return (
    <TextField
      id={title}
      label={title}
      aria-describedby={title}
      onChange={handleChange}
      value={localValue}
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
