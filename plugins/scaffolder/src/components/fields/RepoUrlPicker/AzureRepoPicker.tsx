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

export const AzureRepoPicker = (props: {
  allowedOrganizations?: string[];
  allowedProject?: string[];
  rawErrors: string[];
  state: RepoUrlPickerState;
  onChange: (state: RepoUrlPickerState) => void;
}) => {
  const {
    allowedOrganizations = [],
    allowedProject = [],
    rawErrors,
    state,
    onChange,
  } = props;

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
          <Select
            native
            label="Organization"
            onChange={s =>
              onChange({ organization: String(Array.isArray(s) ? s[0] : s) })
            }
            disabled={allowedOrganizations.length === 1}
            selected={organization}
            items={organizationItems}
          />
        ) : (
          <>
            <InputLabel htmlFor="orgInput">Organization</InputLabel>
            <Input
              id="orgInput"
              onChange={e => onChange({ organization: e.target.value })}
              value={organization}
            />
          </>
        )}
        <FormHelperText>
          The Organization that this repo will belong to
        </FormHelperText>
      </FormControl>
      <FormControl
        margin="normal"
        required
        error={rawErrors?.length > 0 && !project}
      >
        {allowedProject?.length ? (
          <Select
            native
            label="Project"
            onChange={s =>
              onChange({ project: String(Array.isArray(s) ? s[0] : s) })
            }
            disabled={allowedProject.length === 1}
            selected={project}
            items={projectItems}
          />
        ) : (
          <>
            <InputLabel htmlFor="projectInput">Project</InputLabel>
            <Input
              id="projectInput"
              onChange={e => onChange({ project: e.target.value })}
              value={project}
            />
          </>
        )}
        <FormHelperText>
          The Project that this repo will belong to
        </FormHelperText>
      </FormControl>
    </>
  );
};
