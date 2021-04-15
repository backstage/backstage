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
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { ControllerRenderProps } from 'react-hook-form';

import { usePluginApiClientContext } from '../../contexts/PluginApiClientContext';
import { useFormClasses } from './styles';
import { CenteredCircularProgress } from '../../components/CenteredCircularProgress';
import { Project } from '../../contexts/ProjectContext';

export function Repo({
  controllerRenderProps,
}: {
  controllerRenderProps: ControllerRenderProps;
}) {
  const pluginApiClient = usePluginApiClientContext();
  const formClasses = useFormClasses();
  const project: Project = controllerRenderProps.value;

  const { loading, error, value } = useAsync(
    async () => pluginApiClient.getRepositories({ owner: project.owner }),
    [project.owner],
  );

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  if (loading) {
    return <CenteredCircularProgress />;
  }

  if (!value?.repositories) {
    return (
      <Alert severity="error">
        Could not fetch repositories for "{project.owner}"
      </Alert>
    );
  }

  return (
    <FormControl className={formClasses.formControl}>
      <InputLabel id="repo-select-label">Repositories</InputLabel>
      <Select
        labelId="repo-select-label"
        id="repo-select"
        value={project.repo}
        onChange={event => {
          controllerRenderProps.onChange({
            ...project,
            repo: event.target.value,
          } as Project);
        }}
        className={formClasses.selectEmpty}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {value.repositories.map((repositoryName, index) => (
          <MenuItem key={`repository-${index}`} value={repositoryName}>
            {repositoryName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
