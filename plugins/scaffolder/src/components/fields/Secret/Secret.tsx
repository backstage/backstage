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
import { useTemplateSecrets } from '@backstage/plugin-scaffolder-react';
import { ScaffolderRJSFFieldProps } from '@backstage/plugin-scaffolder-react';
import { ScaffolderField } from '@backstage/plugin-scaffolder-react/alpha';
import { Input, InputLabel } from '@material-ui/core';

export const Secret = (props: ScaffolderRJSFFieldProps) => {
  const { setSecrets, secrets } = useTemplateSecrets();
  const {
    name,
    schema: { title, description },
    rawErrors,
    disabled,
    errors,
    onChange,
    required,
  } = props;

  return (
    <ScaffolderField
      rawErrors={rawErrors}
      rawDescription={description}
      disabled={disabled}
      errors={errors}
      required={required}
    >
      <InputLabel htmlFor={title}>{title}</InputLabel>
      <Input
        id={title}
        aria-describedby={title}
        onChange={e => {
          // TODO(blam): this is a bit of a hack. We need to to probably figure out
          // how to provide our own validator that can filter out the secrets from the
          // jsonschema, or merge the secrets with the formData for validation?
          // Makes the review step a little cleaner with this though.
          onChange(
            Array(e.target?.value.length ?? 0)
              .fill('*')
              .join(''),
          );
          setSecrets({ [name]: e.target?.value });
        }}
        value={secrets[name] ?? ''}
        type="password"
        autoComplete="off"
      />
    </ScaffolderField>
  );
};
