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
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import React from 'react';

/**
 * Secret Widget for overriding the default password input widget
 * @alpha
 */
export const SecretWidget = (
  props: Pick<WidgetProps, 'name' | 'onChange' | 'schema'>,
) => {
  const { setSecrets, secrets } = useTemplateSecrets();
  const {
    name,
    onChange,
    schema: { title },
  } = props;

  return (
    <>
      <InputLabel htmlFor={title}>{title}</InputLabel>
      <Input
        id={title}
        aria-describedby={title}
        onChange={e => {
          onChange(Array(e.target?.value.length).fill('*').join(''));
          setSecrets({ [name]: e.target?.value });
        }}
        value={secrets[name] ?? ''}
        type="password"
        autoComplete="off"
      />
    </>
  );
};
