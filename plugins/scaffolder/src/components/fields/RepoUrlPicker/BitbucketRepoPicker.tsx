/* eslint-disable no-restricted-syntax */
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
import React, { useEffect, useState } from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import { Select, SelectItem } from '@backstage/core-components';
import { RepoUrlPickerState } from './types';
import { BitbucketCloudClient } from '@backstage/plugin-bitbucket-cloud-common';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import useDebounce from 'react-use/esm/useDebounce';

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
  accessToken?: string;
}) => {
  const {
    allowedOwners = [],
    allowedProjects = [],
    onChange,
    rawErrors,
    state,
    accessToken,
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

  const [client, setClient] = useState<BitbucketCloudClient>();
  const [availableWorkspaces, setAvailableWorkspaces] = useState<string[]>([]);
  const [availableProjects, setAvailableProjects] = useState<string[]>([]);

  useEffect(() => {
    if (accessToken)
      setClient(
        BitbucketCloudClient.fromConfig({
          host: 'bitbucket.org',
          apiBaseUrl: 'https://api.bitbucket.org/2.0',
          accessToken,
        }),
      );
  }, [accessToken]);

  // Update available workspaces when host changes
  useDebounce(
    () => {
      const updateAvailableWorkspaces = async () => {
        if (client)
          if (!host) {
            setAvailableWorkspaces([]);
          } else {
            const result: string[] = [];

            for await (const page of client.listWorkspaces().iteratePages()) {
              const keys = [...page.values!].map(p => p.slug!);
              result.push(...keys);
            }

            setAvailableWorkspaces(result);
          }
      };

      updateAvailableWorkspaces().catch(() => setAvailableWorkspaces([]));
    },
    500,
    [client, host],
  );

  // Update available projects when workspace changes
  useDebounce(
    () => {
      const updateAvailableProjects = async () => {
        if (client)
          if (!workspace) {
            setAvailableProjects([]);
          } else {
            const result: string[] = [];

            for await (const page of client
              .listProjectsByWorkspace(workspace)
              .iteratePages()) {
              const keys = [...page.values!].map(p => p.key!);
              result.push(...keys);
            }

            setAvailableProjects(result);
          }
      };

      updateAvailableProjects().catch(() => setAvailableProjects([]));
    },
    500,
    [client, workspace],
  );

  // Update available repositories when workspace or project changes
  useDebounce(
    () => {
      const updateAvailableRepositories = async () => {
        if (client && workspace)
          if (!project) {
            onChange({ availableRepos: [] });
          } else {
            const availableRepos: string[] = [];

            for await (const page of client
              .listRepositoriesByWorkspace(workspace, {
                q: `project.key="${project}"`,
              })
              .iteratePages()) {
              const keys = [...page.values!].map(p => p.slug!);
              availableRepos.push(...keys);
            }

            onChange({ availableRepos });
          }
      };

      updateAvailableRepositories().catch(() =>
        onChange({ availableRepos: [] }),
      );
    },
    500,
    [client, workspace, project, onChange],
  );

  return (
    <>
      {host === 'bitbucket.org' && (
        <FormControl
          margin="normal"
          required
          error={rawErrors?.length > 0 && !workspace}
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
            <Autocomplete
              value={workspace}
              onInputChange={(_, newValue) => {
                onChange({ workspace: newValue || '' });
              }}
              options={availableWorkspaces}
              renderInput={params => (
                <TextField {...params} label="Workspace" required />
              )}
              freeSolo
              autoSelect
            />
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
          <Autocomplete
            value={project}
            onInputChange={(_, newValue) => {
              onChange({ project: newValue || '' });
            }}
            options={availableProjects}
            renderInput={params => (
              <TextField {...params} label="Project" required />
            )}
            freeSolo
            autoSelect
          />
        )}
        <FormHelperText>
          The Project that this repo will belong to
        </FormHelperText>
      </FormControl>
    </>
  );
};
