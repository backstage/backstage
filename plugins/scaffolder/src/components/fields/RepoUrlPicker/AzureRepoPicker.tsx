/*
 * Copyright 2022 The Backstage Authors
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
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { RepoUrlPickerState } from './types';
import { Select, SelectItem } from '@backstage/core-components';

import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../../translation';

export const AzureRepoPicker = (props: {
  allowedOrganizations?: string[];
  allowedOwners?: string[];
  rawErrors: string[];
  state: RepoUrlPickerState;
  onChange: (state: RepoUrlPickerState) => void;
}) => {
  const { t } = useTranslationRef(scaffolderTranslationRef);

  const {
    allowedOrganizations = [],
    allowedOwners = [],
    rawErrors,
    state,
    onChange,
  } = props;

  const organizationItems: SelectItem[] = allowedOrganizations
    ? allowedOrganizations.map(i => ({ label: i, value: i }))
    : [{ label: t('loading'), value: 'loading' }];

  const ownerItems: SelectItem[] = allowedOwners
    ? allowedOwners.map(i => ({ label: i, value: i }))
    : [{ label: t('loading'), value: 'loading' }];

  const { organization, owner } = state;

  return (
    <>
      <FormControl
        margin="normal"
        required
        error={rawErrors?.length > 0 && !organization}
      >
        {allowedOrganizations?.length ? (
          <Select
            native
            label={t('organization')}
            onChange={s =>
              onChange({ organization: String(Array.isArray(s) ? s[0] : s) })
            }
            disabled={allowedOrganizations.length === 1}
            selected={organization}
            items={organizationItems}
          />
        ) : (
          <>
            <InputLabel htmlFor="orgInput">{t('organization')}</InputLabel>
            <Input
              id="orgInput"
              onChange={e => onChange({ organization: e.target.value })}
              value={organization}
            />
          </>
        )}
        <FormHelperText>
          {t('repo_picker_organization_help_text')}
        </FormHelperText>
      </FormControl>
      <FormControl
        margin="normal"
        required
        error={rawErrors?.length > 0 && !owner}
      >
        {allowedOwners?.length ? (
          <Select
            native
            label={t('owner')}
            onChange={s =>
              onChange({ owner: String(Array.isArray(s) ? s[0] : s) })
            }
            disabled={allowedOwners.length === 1}
            selected={owner}
            items={ownerItems}
          />
        ) : (
          <>
            <InputLabel htmlFor="ownerInput">{t('project')}</InputLabel>
            <Input
              id="ownerInput"
              onChange={e => onChange({ owner: e.target.value })}
              value={owner}
            />
          </>
        )}
        <FormHelperText>{t('repo_picker_project_help_text')}</FormHelperText>
      </FormControl>
    </>
  );
};
