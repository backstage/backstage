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

import { MarkdownContent } from '@backstage/core-components';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import { WidgetProps } from '@rjsf/utils';
import React from 'react';

import { scaffolderReactTranslationRef } from '../../../translation';

export const PasswordWidget = (
  props: Pick<WidgetProps, 'onChange' | 'schema' | 'value'>,
) => {
  const { t } = useTranslationRef(scaffolderReactTranslationRef);

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
        <MarkdownContent content={t('passwordWidget.content')} />
      </FormHelperText>
    </>
  );
};
