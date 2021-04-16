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
import { useNavigate } from 'react-router';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@material-ui/core';

import { usePluginApiClientContext } from '../../contexts/PluginApiClientContext';
import { useFormClasses } from './styles';
import { CenteredCircularProgress } from '../../components/CenteredCircularProgress';
import { Project } from '../../contexts/ProjectContext';
import { getNewQueryParams } from '../../helpers/getNewQueryParams';
import { useQuery } from '../../helpers/useQuery';

export function Repo({ project }: { project: Project }) {
  const pluginApiClient = usePluginApiClientContext();
  const navigate = useNavigate();
  const formClasses = useFormClasses();
  const query = useQuery();

  const { loading, error, value } = useAsync(
    async () => pluginApiClient.getRepositories({ owner: project.owner }),
    [project.owner],
  );

  const repositories = value?.repositories ?? [];
  const customRepoFromUrl = !repositories.concat(['']).includes(project.repo);

  return (
    <FormControl className={formClasses.formControl} required error={!!error}>
      {loading ? (
        <CenteredCircularProgress />
      ) : (
        <>
          <InputLabel id="repo-select-label">Repositories</InputLabel>
          <Select
            labelId="repo-select-label"
            id="repo-select"
            value={project.repo}
            defaultValue=""
            onChange={event => {
              const queryParams = getNewQueryParams({
                query,
                updates: [{ key: 'repo', value: event.target.value as string }],
              });

              navigate(`?${queryParams}`, { replace: true });
            }}
            className={formClasses.selectEmpty}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>

            {!error && customRepoFromUrl && (
              <MenuItem value={project.repo}>
                <strong>From URL: {project.repo}</strong>
              </MenuItem>
            )}

            {repositories.map((repositoryName, index) => (
              <MenuItem key={`repository-${index}`} value={repositoryName}>
                {repositoryName}
              </MenuItem>
            ))}
          </Select>

          {error && (
            <FormHelperText>
              Encountered an error ({error.message}")
            </FormHelperText>
          )}

          {!error && project.repo.length === 0 && (
            <>
              <FormHelperText>Select a repository</FormHelperText>
              <FormHelperText>
                Custom queries can be made via the query param{' '}
                <strong>repo</strong>
              </FormHelperText>
            </>
          )}
        </>
      )}
    </FormControl>
  );
}
