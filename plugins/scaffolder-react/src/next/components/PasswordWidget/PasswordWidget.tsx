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
import TextField from '@material-ui/core/TextField';
import React from 'react';
import FormHelperText from '@material-ui/core/FormHelperText';
import { MarkdownContent } from '@backstage/core-components';

export const PasswordWidget = (
  props: Pick<WidgetProps, 'onChange' | 'schema' | 'value'>,
) => {
  const {
    value,
    onChange,
    schema: { title },
  } = props;

  return (
    <>
      <TextField
        id={title}
        label={title}
        aria-describedby={title}
        onChange={e => {
          onChange(e.target.value);
        }}
        value={value}
        autoComplete="off"
      />
      <FormHelperText error>
        <MarkdownContent
          content="This widget is insecure. Please use [`ui:field: Secret`](https://backstage.io/docs/features/software-templates/writing-templates/#using-secrets) instead of
          `ui:widget: password`"
        />
      </FormHelperText>
    </>
  );
};
