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
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import { Select, SelectItem } from '@backstage/core-components';
import { BaseRepoUrlPickerProps } from './types';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../../translation';

export const GiteaRepoPicker = (
  props: BaseRepoUrlPickerProps<{
    allowedOwners?: string[];
    allowedRepos?: string[];
  }>,
) => {
  const { allowedOwners = [], state, onChange, rawErrors, isDisabled } = props;
  const { t } = useTranslationRef(scaffolderTranslationRef);
  const ownerItems: SelectItem[] = allowedOwners
    ? allowedOwners.map(i => ({ label: i, value: i }))
    : [{ label: 'Loading...', value: 'loading' }];

  const { owner } = state;

  return (
    <>
      <FormControl
        margin="normal"
        required
        error={rawErrors?.length > 0 && !owner}
      >
        {allowedOwners?.length ? (
          <>
            <Select
              native
              label={t('fields.giteaRepoPicker.owner.title')}
              onChange={selected =>
                onChange({
                  owner: String(
                    Array.isArray(selected) ? selected[0] : selected,
                  ),
                })
              }
              disabled={isDisabled || allowedOwners.length === 1}
              selected={owner}
              items={ownerItems}
            />
            <FormHelperText>
              {t('fields.giteaRepoPicker.owner.description')}
            </FormHelperText>
          </>
        ) : (
          <>
            <TextField
              id="ownerInput"
              label={t('fields.giteaRepoPicker.owner.inputTitle')}
              onChange={e => onChange({ owner: e.target.value })}
              helperText={t('fields.giteaRepoPicker.owner.description')}
              disabled={isDisabled}
              value={owner}
            />
          </>
        )}
      </FormControl>
    </>
  );
};
