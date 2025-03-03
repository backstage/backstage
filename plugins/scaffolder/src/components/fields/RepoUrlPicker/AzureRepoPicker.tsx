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
import TextField from '@material-ui/core/TextField';
import { BaseRepoUrlPickerProps } from './types';
import { Select, SelectItem } from '@backstage/core-components';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../../translation';

export const AzureRepoPicker = (
  props: BaseRepoUrlPickerProps<{
    allowedOrganizations?: string[];
    allowedProject?: string[];
  }>,
) => {
  const {
    allowedOrganizations = [],
    allowedProject = [],
    rawErrors,
    state,
    onChange,
    isDisabled,
  } = props;
  const { t } = useTranslationRef(scaffolderTranslationRef);

  const organizationItems: SelectItem[] = allowedOrganizations
    ? allowedOrganizations.map(i => ({ label: i, value: i }))
    : [{ label: 'Loading...', value: 'loading' }];

  const projectItems: SelectItem[] = allowedProject
    ? allowedProject.map(i => ({ label: i, value: i }))
    : [{ label: 'Loading...', value: 'loading' }];

  const { organization, project } = state;

  return (
    <>
      <FormControl
        margin="normal"
        required
        error={rawErrors?.length > 0 && !organization}
      >
        {allowedOrganizations?.length ? (
          <>
            <Select
              native
              label={t('fields.azureRepoPicker.organization.title')}
              onChange={s =>
                onChange({ organization: String(Array.isArray(s) ? s[0] : s) })
              }
              disabled={isDisabled || allowedOrganizations.length === 1}
              selected={organization}
              items={organizationItems}
            />
            <FormHelperText>
              {t('fields.azureRepoPicker.organization.description')}
            </FormHelperText>
          </>
        ) : (
          <TextField
            id="orgInput"
            label={t('fields.azureRepoPicker.organization.title')}
            onChange={e => onChange({ organization: e.target.value })}
            helperText={t('fields.azureRepoPicker.organization.description')}
            disabled={isDisabled}
            value={organization}
          />
        )}
      </FormControl>
      <FormControl
        margin="normal"
        required
        error={rawErrors?.length > 0 && !project}
      >
        {allowedProject?.length ? (
          <>
            <Select
              native
              label={t('fields.azureRepoPicker.project.title')}
              onChange={s =>
                onChange({ project: String(Array.isArray(s) ? s[0] : s) })
              }
              disabled={isDisabled || allowedProject.length === 1}
              selected={project}
              items={projectItems}
            />
            <FormHelperText>
              {t('fields.azureRepoPicker.project.description')}
            </FormHelperText>
          </>
        ) : (
          <TextField
            id="projectInput"
            label={t('fields.azureRepoPicker.project.title')}
            onChange={e => onChange({ project: e.target.value })}
            value={project}
            disabled={isDisabled}
            helperText={t('fields.azureRepoPicker.project.description')}
          />
        )}
      </FormControl>
    </>
  );
};
