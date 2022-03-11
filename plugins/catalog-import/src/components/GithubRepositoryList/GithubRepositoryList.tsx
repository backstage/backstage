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

import React, { useState } from 'react';
import {
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  FormControlLabel,
  Grid,
  Typography,
} from '@material-ui/core';
import { ContentHeader, Progress } from '@backstage/core-components';
import {
  GithubRepository,
  useGithubRepositories,
} from '../../hooks/useGithubRepositories';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { useNavigate } from 'react-router';
import { useApi } from '@backstage/core-plugin-api';

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
            label={`${repo.descriptor_paths.length} entity file${
              repo.descriptor_paths.length === 1 ? '' : 's'
            }`}
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
  const catalogApi = useApi(catalogApiRef);
  const navigate = useNavigate();
  const { loading, repositories } = useGithubRepositories({ host, org });
  const [saving, setSaving] = useState(false);
  const [selectedRepoNames, setSelectedRepoNames] = useState<string[]>([]);

  if (loading) {
    return <Progress />;
  }

  async function handleClick() {
    setSaving(true);
    const selectedRepos = repositories.filter(repo =>
      selectedRepoNames.includes(repo.name),
    );
    // TODO(catalog-import-flow): Handle conflicts
    await Promise.all(
      selectedRepos
        .map(repo =>
          repo.descriptor_paths.map(d =>
            catalogApi.addLocation({
              type: 'url',
              target: `https://${host}/${org}/${repo.name}/blob/${repo.default_branch}/${d}`,
            }),
          ),
        )
        .flat(),
    );
    // Adding locations to the catalog does not fetch and return the entities immediately; borrow
    // the scaffolder's technique to add locations and then dryRun to get the actual list.
    const responses = await Promise.all(
      selectedRepos
        .map(repo =>
          repo.descriptor_paths.map(d =>
            catalogApi.addLocation({
              dryRun: true,
              type: 'url',
              target: `https://${host}/${org}/${repo.name}/blob/${repo.default_branch}/${d}`,
            }),
          ),
        )
        .flat(),
    );
    const entities = responses.map(r => r.entities).flat();
    navigate('/catalog-import/components/github/results', {
      state: { kind: 'repositories', entities },
    });
  }

  function handleChange(repo: string) {
    setSelectedRepoNames(prevSelected =>
      prevSelected.includes(repo)
        ? prevSelected.filter(s => s !== repo)
        : [...prevSelected, repo],
    );
  }

  return (
    <>
      <ContentHeader title="Select the repositories to import:" />
      <Grid container>
        {repositories.map((repo, index) => (
          <Grid item xs={8} key={index}>
            <FormControlLabel
              control={
                <Checkbox
                  name={repo.name}
                  onChange={() => handleChange(repo.name)}
                  disabled={saving || repo.descriptor_paths.length === 0}
                />
              }
              label={getLabel(repo)}
            />
          </Grid>
        ))}
        <Grid item xs={12}>
          {repositories.length ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleClick}
              disabled={saving}
            >
              {saving && (
                <CircularProgress size={14} style={{ marginRight: 8 }} />
              )}
              {saving ? 'Importing...' : 'Import selected repositories'}
            </Button>
          ) : (
            'No repositories found'
          )}
        </Grid>
      </Grid>
    </>
  );
};
