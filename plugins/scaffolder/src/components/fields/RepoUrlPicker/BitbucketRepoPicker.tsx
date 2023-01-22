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
import React, { useEffect } from 'react';
import { FormControl, Grid, TextField, Typography } from '@material-ui/core';
import { Select, SelectItem } from '@backstage/core-components';
import { RepoUrlPickerState } from './types';

/**
 * The underlying component that is rendered in the form for the `BitbucketRepoPicker`
 * field extension.
 *
 * @public
 * @param allowedOwners - Allowed workspaces for the Bitbucket cloud repository
 * @param allowedProjects - Allowed projects for the Bitbucket cloud repository
 *
 */
export const BitbucketRepoPicker = (props: {
  allowedOwners?: string[];
  allowedProjects?: string[];
  onChange: (state: RepoUrlPickerState) => void;
  state: RepoUrlPickerState;
  rawErrors: string[];
}) => {
  const {
    allowedOwners = [],
    allowedProjects = [],
    onChange,
    rawErrors,
    state,
  } = props;
  const { host, workspace, project } = state;
  const ownerItems: SelectItem[] = allowedOwners
    ? allowedOwners?.map(i => ({ label: i, value: i }))
    : [];
  const projectItems: SelectItem[] = allowedProjects
    ? allowedProjects?.map(i => ({ label: i, value: i }))
    : [];

  useEffect(() => {
    if (host === 'bitbucket.org' && allowedOwners.length) {
      onChange({ workspace: allowedOwners[0] });
    }
  }, [allowedOwners, host, onChange]);

  return (
    <>
      {host === 'bitbucket.org' && (
        <Grid item xs={12} style={{ marginBottom: '10px' }}>
          <FormControl
            required
            error={rawErrors?.length > 0 && !workspace}
            fullWidth
          >
            {allowedOwners?.length ? (
              <Select
                native
                label="Allowed Workspaces"
                onChange={s =>
                  onChange({ workspace: String(Array.isArray(s) ? s[0] : s) })
                }
                disabled={allowedOwners.length === 1}
                selected={workspace}
                items={ownerItems}
              />
            ) : (
              <TextField
                id="workspaceInput"
                label="Workspace"
                onChange={e => onChange({ workspace: e.target.value })}
                value={workspace}
              />
            )}
            <Typography variant="caption" color="textSecondary">
              The Workspace that this repo will belong to
            </Typography>
          </FormControl>
        </Grid>
      )}
      <Grid item xs={12} style={{ marginBottom: '10px' }}>
        <FormControl
          required
          error={rawErrors?.length > 0 && !project}
          fullWidth
        >
          {allowedProjects?.length ? (
            <Select
              native
              label="Allowed Projects"
              onChange={s =>
                onChange({ project: String(Array.isArray(s) ? s[0] : s) })
              }
              disabled={allowedProjects.length === 1}
              selected={project}
              items={projectItems}
            />
          ) : (
            <TextField
              id="projectInput"
              label="Project"
              onChange={e => onChange({ project: e.target.value })}
              value={project}
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
