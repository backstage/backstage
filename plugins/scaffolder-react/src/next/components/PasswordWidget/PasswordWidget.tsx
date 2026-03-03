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

import { Input, MarkdownContent } from '@backstage/core-components';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { WidgetProps } from '@rjsf/utils';

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
      <div className="space-y-2">
        <label
          htmlFor={title}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {title}
        </label>
        <Input
          id={title}
          type="password"
          aria-describedby={title}
          onChange={e => {
            onChange(e.target.value);
          }}
          value={value ?? ''}
          autoComplete="off"
        />
      </div>
      {/* eslint-disable-next-line react/forbid-elements -- MUI Typography replaced by native element in shadcn/ui migration */}
      <p className="text-sm text-destructive">
        <MarkdownContent content={t('passwordWidget.content')} />
      </p>
    </>
  );
};
