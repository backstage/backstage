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

import React, { useEffect, useState } from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { RepoUrlPickerState } from '../types';
import { Select, SelectItem } from '@backstage/core-components';
import { proxyAzurePluginApiRef } from './plugin';
import { useApi } from '@backstage/core-plugin-api';

export const AzureRepoPickerStatic = (props: {
  allowedOrganizations?: string[];
  allowedOwners?: string[];
  rawErrors: string[];
  state: RepoUrlPickerState;
  onChange: (state: RepoUrlPickerState) => void;
}) => {
  const {
    allowedOrganizations = [],
    allowedOwners = [],
    rawErrors,
    state,
    onChange,
  } = props;

  const { organization, owner } = state;

  const organizationItems: SelectItem[] = allowedOrganizations.map(i => ({
    label: i,
    value: i,
  }));
  const ownerItems: SelectItem[] = allowedOwners.map(i => ({
    label: i,
    value: i,
  }));

  return (
    <>
      <FormControl
        margin="normal"
        required
        error={rawErrors?.length > 0 && !organization}
      >
        {organizationItems?.length ? (
          <Select
            native
            label="Organization"
            onChange={s =>
              onChange({ organization: String(Array.isArray(s) ? s[0] : s) })
            }
            disabled={organizationItems.length === 1}
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
        error={rawErrors?.length > 0 && !owner}
      >
        {ownerItems?.length ? (
          <Select
            native
            label="Owner"
            onChange={s =>
              onChange({ owner: String(Array.isArray(s) ? s[0] : s) })
            }
            disabled={ownerItems.length === 1}
            selected={owner}
            items={ownerItems}
          />
        ) : (
          <>
            <InputLabel htmlFor="ownerInput">Project</InputLabel>
            <Input
              id="ownerInput"
              onChange={e => onChange({ owner: e.target.value })}
              value={owner}
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
