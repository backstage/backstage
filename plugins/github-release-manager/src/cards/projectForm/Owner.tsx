/*
 * Copyright 2021 Spotify AB
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
import { useAsync } from 'react-use';
import { ControllerRenderProps } from 'react-hook-form';
import { Alert } from '@material-ui/lab';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';

import { usePluginApiClientContext } from '../../contexts/PluginApiClientContext';
import { useFormClasses } from './styles';
import { CenteredCircularProgress } from '../../components/CenteredCircularProgress';
import { Project } from '../../contexts/ProjectContext';

export function Owner({
  controllerRenderProps,
  username,
}: {
  controllerRenderProps: ControllerRenderProps;
  username: string;
}) {
  const pluginApiClient = usePluginApiClientContext();
  const formClasses = useFormClasses();
  const project: Project = controllerRenderProps.value;

  const { loading, error, value } = useAsync(() =>
    pluginApiClient.getOrganizations(),
  );

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  if (loading) {
    return <CenteredCircularProgress />;
  }

  if (!value?.orgs) {
    return <Alert severity="error">Could not fetch organizations</Alert>;
  }

  return (
    <FormControl className={formClasses.formControl}>
      <InputLabel id="owner-select-label">Organizations</InputLabel>
      <Select
        labelId="owner-select-label"
        id="owner-select"
        value={project.owner}
        onChange={event => {
          controllerRenderProps.onChange({
            ...project,
            owner: event.target.value,
            repo: '',
          } as Project);
        }}
        className={formClasses.selectEmpty}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value={username}>
          <strong>{username}</strong>
        </MenuItem>
        {value.orgs.map((org, index) => (
          <MenuItem key={`organization-${index}`} value={org.login}>
            {org.login}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
