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
import { FormControl, Grid, TextField, Typography } from '@material-ui/core';
import { Select, SelectItem } from '@backstage/core-components';
import { RepoUrlPickerState } from './types';

export const GithubRepoPicker = (props: {
  allowedOwners?: string[];
  rawErrors: string[];
  state: RepoUrlPickerState;
  onChange: (state: RepoUrlPickerState) => void;
}) => {
  const { allowedOwners = [], rawErrors, state, onChange } = props;
  const ownerItems: SelectItem[] = allowedOwners
    ? allowedOwners.map(i => ({ label: i, value: i }))
    : [{ label: 'Loading...', value: 'loading' }];

  const { owner } = state;

  return (
    <Grid item xs={12} style={{ marginBottom: '10px' }}>
      <FormControl required error={rawErrors?.length > 0 && !owner} fullWidth>
        {allowedOwners?.length ? (
          <Select
            native
            label="Owner Available"
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
            label="Owner"
            onChange={e => onChange({ owner: e.target.value })}
            value={owner}
          />
        )}
        <Typography variant="caption" color="textSecondary">
          The organization, user or project that this repo will belong to
        </Typography>
      </FormControl>
    </Grid>
  );
};
