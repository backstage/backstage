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

import { BaseRepoUrlPickerProps } from './types';
import {
  Select,
  SelectItem,
  Input,
  Label,
  cn,
} from '@backstage/core-components';
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
      <div
        className={cn(
          'mt-4 mb-2',
          rawErrors?.length > 0 && !organization && 'text-destructive',
        )}
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
            <p className="mt-1 text-sm text-muted-foreground">
              {t('fields.azureRepoPicker.organization.description')}
            </p>
          </>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="orgInput">
              {t('fields.azureRepoPicker.organization.title')}
            </Label>
            <Input
              id="orgInput"
              onChange={e => onChange({ organization: e.target.value })}
              disabled={isDisabled}
              value={organization}
            />
            <p className="text-sm text-muted-foreground">
              {t('fields.azureRepoPicker.organization.description')}
            </p>
          </div>
        )}
      </div>
      <div
        className={cn(
          'mt-4 mb-2',
          rawErrors?.length > 0 && !project && 'text-destructive',
        )}
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
            <p className="mt-1 text-sm text-muted-foreground">
              {t('fields.azureRepoPicker.project.description')}
            </p>
          </>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="projectInput">
              {t('fields.azureRepoPicker.project.title')}
            </Label>
            <Input
              id="projectInput"
              onChange={e => onChange({ project: e.target.value })}
              disabled={isDisabled}
              value={project}
            />
            <p className="text-sm text-muted-foreground">
              {t('fields.azureRepoPicker.project.description')}
            </p>
          </div>
        )}
      </div>
    </>
  );
};
