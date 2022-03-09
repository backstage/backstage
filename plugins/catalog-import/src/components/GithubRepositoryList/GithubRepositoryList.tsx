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
import {
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  Grid,
  Typography,
} from '@material-ui/core';
import { Progress } from '@backstage/core-components';
import {
  GithubRepository,
  useGithubRepositories,
} from '../../hooks/useGithubRepositories';
import { configApiRef, useApi } from '@backstage/core-plugin-api';

type GithubRepositoryListProps = {
  host: string;
  org: string;
};

function getLabel(repo: GithubRepository) {
  return (
    <div>
      <Typography variant="h6">
        {repo.name}{' '}
        {!!repo.descriptor_paths.length && (
          <Chip
            variant="outlined"
            size="small"
            label={`${repo.descriptor_paths.length} entities`}
          />
        )}
      </Typography>
      <Typography variant="body2">{repo.description}</Typography>
    </div>
  );
}

export const GithubRepositoryList = ({
  host,
  org,
}: GithubRepositoryListProps) => {
  const { loading, repositories } = useGithubRepositories({ host, org });
  const orgName =
    useApi(configApiRef).getOptionalString('organization.name') ?? 'Backstage';

  if (loading) {
    return <Progress />;
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h6">
          Select the repositories to import into the {orgName} software catalog:
        </Typography>
      </Grid>
      {repositories.map((repo, index) => (
        <Grid item xs={8} key={index}>
          <FormControlLabel
            control={
              <Checkbox
                name={repo.name}
                disabled={repo.descriptor_paths.length === 0}
              />
            }
            label={getLabel(repo)}
          />
        </Grid>
      ))}
      <Grid item xs={12}>
        {repositories.length ? (
          <Button variant="contained" color="primary">
            Import selected repositories
          </Button>
        ) : (
          'No repositories found'
        )}
      </Grid>
    </Grid>
  );
};
