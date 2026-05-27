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

import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import MuiTextField from '@material-ui/core/TextField';
import { BaseRepoUrlPickerProps } from './types';
import { Select as MuiSelect, SelectItem } from '@backstage/core-components';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../../translation';
import { useScaffolderTheme } from '@backstage/plugin-scaffolder-react/alpha';
import { TextField as BuiTextField, Select as BuiSelect } from '@backstage/ui';
import overrides from '../scaffolderFieldOverrides.module.css';
import type { Key } from 'react-aria-components';

export const AzureRepoPicker = (
  props: BaseRepoUrlPickerProps<{
    allowedOrganizations?: string[];
    allowedProject?: string[];
  }>,
) => {
  const theme = useScaffolderTheme();
  const {
    allowedOrganizations = [],
    allowedProject = [],
    rawErrors,
    state,
    onChange,
    isDisabled,
  } = props;
  const { t } = useTranslationRef(scaffolderTranslationRef);

  const { organization, project } = state;

  if (theme === 'bui') {
    const renderOrganizationPicker = () => {
      if (allowedOrganizations?.length) {
        const organizationItems = allowedOrganizations.map(i => ({
          label: i,
          value: i,
        }));

        return (
          <BuiSelect
            className={overrides.select}
            label={t('fields.azureRepoPicker.organization.title')}
            description={t('fields.azureRepoPicker.organization.description')}
            isDisabled={isDisabled || allowedOrganizations.length === 1}
            isInvalid={rawErrors?.length > 0 && !organization}
            selectedKey={organization ?? null}
            onSelectionChange={(key: Key | null) => {
              if (key !== null) onChange({ organization: String(key) });
            }}
            options={organizationItems}
            isRequired
          />
        );
      }

      return (
        <BuiTextField
          label={t('fields.azureRepoPicker.organization.title')}
          description={t('fields.azureRepoPicker.organization.description')}
          onChange={value => onChange({ organization: value })}
          isDisabled={isDisabled}
          value={organization ?? ''}
          isInvalid={rawErrors?.length > 0 && !organization}
          isRequired
        />
      );
    };

    const renderProjectPicker = () => {
      if (allowedProject?.length) {
        const projectItems = allowedProject.map(i => ({
          label: i,
          value: i,
        }));

        return (
          <BuiSelect
            className={overrides.select}
            label={t('fields.azureRepoPicker.project.title')}
            description={t('fields.azureRepoPicker.project.description')}
            isDisabled={isDisabled || allowedProject.length === 1}
            isInvalid={rawErrors?.length > 0 && !project}
            selectedKey={project ?? null}
            onSelectionChange={(key: Key | null) => {
              if (key !== null) onChange({ project: String(key) });
            }}
            options={projectItems}
            isRequired
          />
        );
      }

      return (
        <BuiTextField
          label={t('fields.azureRepoPicker.project.title')}
          description={t('fields.azureRepoPicker.project.description')}
          onChange={value => onChange({ project: value })}
          value={project ?? ''}
          isDisabled={isDisabled}
          isInvalid={rawErrors?.length > 0 && !project}
          isRequired
        />
      );
    };

    return (
      <>
        {renderOrganizationPicker()}
        {renderProjectPicker()}
      </>
    );
  }

  const organizationItems: SelectItem[] = allowedOrganizations
    ? allowedOrganizations.map(i => ({ label: i, value: i }))
    : [{ label: 'Loading...', value: 'loading' }];

  const projectItems: SelectItem[] = allowedProject
    ? allowedProject.map(i => ({ label: i, value: i }))
    : [{ label: 'Loading...', value: 'loading' }];

  return (
    <>
      <FormControl
        margin="normal"
        required
        error={rawErrors?.length > 0 && !organization}
      >
        {allowedOrganizations?.length ? (
          <>
            <MuiSelect
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
          <MuiTextField
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
            <MuiSelect
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
          <MuiTextField
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
