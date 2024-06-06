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
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { Select, SelectItem } from '@backstage/core-components';
import { RepoUrlPickerState } from './types';
import { BitbucketCloudClient } from '@backstage/plugin-bitbucket-cloud-common';

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
  const [availableProjects, setAvailableProjects] = useState<string[]>([]);
  const [availableRepositories, setAvailableRepositories] = useState<string[]>(
    [],
  );

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

  const onChangeWorkspace = async () => {
    if (client)
      if (!workspace) {
        setAvailableProjects([]);
      } else {
        for await (const page of client
          .listProjectsByWorkspace(workspace)
          .iteratePages()) {
          const keys = [...page.values!].map(p => p.key!);
          setAvailableProjects([...availableProjects, ...keys]);
        }
      }
  };

  const onChangeProject = async () => {
    if (client && workspace)
      if (!project) {
        setAvailableRepositories([]);
      } else {
        for await (const page of client
          .listRepositoriesByWorkspace(workspace, {
            q: `project.key="${project}"`,
          })
          .iteratePages()) {
          const keys = [...page.values!].map(p => p.slug!);
          setAvailableRepositories([...availableRepositories, ...keys]);
        }
      }
  };

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
            <>
              <InputLabel htmlFor="workspaceInput">Workspace</InputLabel>
              <Input
                id="workspaceInput"
                onChange={e => onChange({ workspace: e.target.value })}
                value={workspace}
                onBlur={() => onChangeWorkspace()}
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
          <>
            <InputLabel htmlFor="projectInput">Project</InputLabel>
            <Input
              id="projectInput"
              onChange={e => onChange({ project: e.target.value })}
              value={project}
              onBlur={() => onChangeProject()}
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
