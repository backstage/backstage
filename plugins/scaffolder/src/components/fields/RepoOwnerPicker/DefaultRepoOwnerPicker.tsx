/*
 * Copyright 2025 The Backstage Authors
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

import { Input, Label, cn } from '@backstage/core-components';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

import { BaseRepoOwnerPickerProps } from './types';
import { scaffolderTranslationRef } from '../../../translation';

/**
 * The underlying component that is rendered in the form for the `DefaultRepoOwnerPicker`
 * field extension.
 *
 * @public
 *
 */
export const DefaultRepoOwnerPicker = ({
  onChange,
  state,
  rawErrors,
  isDisabled,
  required,
  schema,
}: BaseRepoOwnerPickerProps) => {
  const { owner } = state;

  const { t } = useTranslationRef(scaffolderTranslationRef);

  return (
    <div className="space-y-2">
      <Label
        htmlFor="ownerInput"
        className={cn(rawErrors?.length > 0 && !owner && 'text-destructive')}
      >
        {schema?.title ?? t('fields.repoOwnerPicker.title')}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Input
        id="ownerInput"
        disabled={isDisabled}
        onChange={e => onChange({ owner: e.target.value })}
        value={owner ?? ''}
        required={required}
        className={cn(rawErrors?.length > 0 && !owner && 'border-destructive')}
      />
      <p
        className={cn(
          'text-sm',
          rawErrors?.length > 0 && !owner
            ? 'text-destructive'
            : 'text-muted-foreground',
        )}
      >
        {schema?.description ?? t('fields.repoOwnerPicker.description')}
      </p>
    </div>
  );
};
