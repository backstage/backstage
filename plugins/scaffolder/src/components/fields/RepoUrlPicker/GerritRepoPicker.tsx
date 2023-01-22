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

export const GerritRepoPicker = (props: {
  onChange: (state: RepoUrlPickerState) => void;
  state: RepoUrlPickerState;
  rawErrors: string[];
}) => {
  const { onChange, rawErrors, state } = props;
  const { workspace, owner } = state;
  return (
    <>
      <Grid item xs={12} style={{ marginBottom: '10px' }}>
        <FormControl error={rawErrors?.length > 0 && !workspace} fullWidth>
          <TextField
            id="ownerInput"
            label="Owner"
            onChange={e => onChange({ owner: e.target.value })}
            value={owner}
          />
          <Typography variant="caption" color="textSecondary">
            The owner of the project (optional)
          </Typography>
        </FormControl>
      </Grid>
      <Grid item xs={12} style={{ marginBottom: '10px' }}>
        <FormControl
          required
          error={rawErrors?.length > 0 && !workspace}
          fullWidth
        >
          <TextField
            id="parentInput"
            label="Parent"
            onChange={e => onChange({ workspace: e.target.value })}
            value={workspace}
          />
          <Typography variant="caption" color="textSecondary">
            The project parent that the repo will belong to
          </Typography>
        </FormControl>
      </Grid>
    </>
  );
};
