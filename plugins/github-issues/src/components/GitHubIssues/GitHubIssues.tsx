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

import { Box, IconButton, Typography } from '@material-ui/core';
import { InfoCard, Progress } from '@backstage/core-components';
import RefreshIcon from '@material-ui/icons/Refresh';

import { useEntityGitHubRepositories } from '../../hooks/useEntityGitHubRepositories';
import {
  RepoIssues,
  useGetIssuesByRepoFromGitHub,
} from '../../hooks/useGetIssuesByRepoFromGitHub';

import { IssueList } from './IssuesList';
import { NoRepositoriesInfo } from './NoRepositoriesInfo';

export type PluginMode = 'page' | 'card';

export type Props = {
  mode: PluginMode;
  itemsPerPage?: number;
  itemsPerRepo?: number;
};

export const GitHubIssues = ({
  itemsPerPage = 10,
  itemsPerRepo = 40,
}: Props) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeFilter, setActiveFilter] = React.useState<Array<string>>([]);

  const [issuesByRepository, setIssuesByRepository] =
    React.useState<Record<string, RepoIssues>>();

  const { repositories } = useEntityGitHubRepositories();
  const getIssues = useGetIssuesByRepoFromGitHub();

  const filters = React.useMemo(
    () =>
      issuesByRepository
        ? Object.keys(issuesByRepository)
            .filter(repo => issuesByRepository[repo].issues.totalCount > 0)
            .map(repo => ({
              label: `${repo} (${issuesByRepository[repo].issues.totalCount})`,
              value: repo,
            }))
        : [],
    [issuesByRepository],
  );

  const totalIssuesInGitHub = React.useMemo(
    () =>
      issuesByRepository
        ? Object.values(issuesByRepository).reduce(
            (acc, { issues: { totalCount } }) => acc + totalCount,
            0,
          )
        : 0,
    [issuesByRepository],
  );

  const filteredRepos = React.useMemo(
    () =>
      issuesByRepository && activeFilter.length
        ? activeFilter.reduce(
            (acc, val) => ({
              [val]: issuesByRepository[val],
              ...acc,
            }),
            {},
          )
        : issuesByRepository,
    [issuesByRepository, activeFilter],
  );

  const issues = React.useMemo(
    () =>
      filteredRepos
        ? Object.values(filteredRepos)
            .map(({ issues: { edges } }) => edges)
            .flat()
            .sort((a, b) => {
              if (a.node.updatedAt > b.node.updatedAt) {
                return -1;
              } else if (b.node.updatedAt > a.node.updatedAt) {
                return 1;
              }
              return 0;
            })
        : [],
    [filteredRepos],
  );

  const fetchGitHubIssues = React.useCallback(async () => {
    setIsLoading(true);
    const issuesByRepo = await getIssues(repositories, itemsPerRepo);

    setIssuesByRepository(issuesByRepo);
    setIsLoading(false);
  }, [itemsPerRepo, getIssues, repositories]);

  React.useEffect(() => {
    if (repositories.length) {
      fetchGitHubIssues();
    } else {
      setIsLoading(false);
    }
  }, [repositories.length, fetchGitHubIssues]);

  if (!repositories.length) {
    return <NoRepositoriesInfo />;
  }

  return (
    <InfoCard
      title={
        <Box display="flex" justifyContent="flex-start" alignItems="center">
          <Typography variant="h5">Open GitHub Issues</Typography>
          <IconButton color="secondary" onClick={fetchGitHubIssues}>
            <RefreshIcon />
          </IconButton>
        </Box>
      }
    >
      {isLoading && <Progress />}

      <IssueList
        itemsPerPage={itemsPerPage}
        issues={issues}
        totalIssuesInGitHub={totalIssuesInGitHub}
        setActiveFilter={setActiveFilter}
        filters={filters}
      />
    </InfoCard>
  );
};
