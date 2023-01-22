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
import { FormControl, Grid, TextField, Typography } from '@material-ui/core';
import { RepoUrlPickerState } from './types';
import { Select, SelectItem } from '@backstage/core-components';

export const AzureRepoPicker = (props: {
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

  const organizationItems: SelectItem[] = allowedOrganizations
    ? allowedOrganizations.map(i => ({ label: i, value: i }))
    : [{ label: 'Loading...', value: 'loading' }];

  const ownerItems: SelectItem[] = allowedOwners
    ? allowedOwners.map(i => ({ label: i, value: i }))
    : [{ label: 'Loading...', value: 'loading' }];

  const { organization, owner } = state;

  return (
    <>
      <Grid item xs={12} style={{ marginBottom: '10px' }}>
        <FormControl
          required
          error={rawErrors?.length > 0 && !organization}
          fullWidth
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
            <TextField
              id="orgInput"
              label="Organization"
              onChange={e => onChange({ organization: e.target.value })}
              value={organization}
            />
          )}
          <Typography variant="caption" color="textSecondary">
            The Organization that this repo will belong to
          </Typography>
        </FormControl>
      </Grid>
      <Grid item xs={12} style={{ marginBottom: '10px' }}>
        <FormControl required error={rawErrors?.length > 0 && !owner} fullWidth>
          {allowedOwners?.length ? (
            <Select
              native
              label="Owner"
              onChange={s =>
                onChange({ owner: String(Array.isArray(s) ? s[0] : s) })
              }
              disabled={allowedOwners.length === 1}
              selected={owner}
              items={ownerItems}
            />
          ) : (
            <TextField
              id="ownerInput"
              label="Project"
              onChange={e => onChange({ owner: e.target.value })}
              value={owner}
            />
          )}
          <Typography variant="caption" color="textSecondary">
            The Project that this repo will belong to
          </Typography>
        </FormControl>
      </Grid>
    </>
  );
};
