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
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { SelectItem } from '@backstage/core-components';
import { RepoUrlPickerState } from './types';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

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
        <FormControl
          margin="normal"
          required
          error={rawErrors?.length > 0 && !workspace}
        >
          {allowedOwners?.length ? (
            <Autocomplete
              aria-label="Select a Workspace"
              options={ownerItems}
              defaultValue={ownerItems[0]}
              getOptionLabel={owners => owners.label || 'error getting label'}
              disabled={allowedOwners.length === 1}
              data-testid="select"
              getOptionSelected={(option, value) =>
                option.label === value.value
              }
              onChange={(_event, newValue) =>
                onChange({
                  workspace: newValue?.label,
                })
              }
              renderInput={params => (
                <TextField
                  {...params}
                  placeholder="Select a Workspace"
                  margin="dense"
                  FormHelperTextProps={{
                    margin: 'dense',
                    style: { marginLeft: 0 },
                  }}
                  variant="outlined"
                  onChange={e => onChange({ owner: e.target.value })}
                  value={workspace}
                  InputProps={params.InputProps}
                />
              )}
            />
          ) : (
            <>
              <InputLabel htmlFor="workspaceInput">Workspace</InputLabel>
              <Input
                id="workspaceInput"
                onChange={e => onChange({ workspace: e.target.value })}
                value={workspace}
              />
            </>
          )}
          <FormHelperText>
            The Workspace that this repo will belong to
          </FormHelperText>
        </FormControl>
      )}
      <FormControl
        margin="normal"
        required
        error={rawErrors?.length > 0 && !project}
      >
        {allowedProjects?.length ? (
          <Autocomplete
            aria-label="Select a Project"
            options={projectItems}
            defaultValue={projectItems[0]}
            getOptionLabel={projects => projects.label || 'error getting label'}
            disabled={allowedProjects.length === 1}
            data-testid="select"
            getOptionSelected={(option, value) => option.label === value.value}
            onChange={(_event, newValue) =>
              onChange({
                project: newValue?.label,
              })
            }
            renderInput={params => (
              <TextField
                {...params}
                placeholder="Select a Project"
                margin="dense"
                FormHelperTextProps={{
                  margin: 'dense',
                  style: { marginLeft: 0 },
                }}
                variant="outlined"
                onChange={e => onChange({ owner: e.target.value })}
                value={project}
                InputProps={params.InputProps}
              />
            )}
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
