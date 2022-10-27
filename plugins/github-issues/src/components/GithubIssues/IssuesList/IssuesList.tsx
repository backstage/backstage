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
import { Box } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { IssueCard } from '../IssueCard';
import { IssuesByRepo } from '../../../api';
import { RepositoryFilters } from './Filters';

export type PluginMode = 'page' | 'card';

export type IssueListProps = {
  itemsPerPage?: number;
  issuesByRepository?: IssuesByRepo;
};

const getIssuesCountForFilterLabel = (
  totalIssues: number,
  issuesAvailable: number,
) =>
  `(${totalIssues} ${totalIssues === 1 ? 'Issue' : `Issues`})${
    issuesAvailable < totalIssues ? '*' : ''
  }`;

export const IssuesList = ({
  itemsPerPage = 10,
  issuesByRepository,
}: IssueListProps) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [activeFilter, setActiveFilter] = React.useState<Array<string>>([]);

  const filters = React.useMemo(
    () =>
      issuesByRepository
        ? Object.keys(issuesByRepository)
            .filter(repo => issuesByRepository[repo].issues.totalCount > 0)
            .map(repo => ({
              label: `${repo} ${getIssuesCountForFilterLabel(
                issuesByRepository[repo].issues.totalCount,
                issuesByRepository[repo].issues.edges.length,
              )}`,
              value: repo,
            }))
        : [],
    [issuesByRepository],
  );

  const totalIssuesInGithub = React.useMemo(
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

  const displayIssues = issues.slice(
    (currentPage - 1) * itemsPerPage,
    (currentPage - 1) * itemsPerPage + itemsPerPage,
  );

  return (
    <Box>
      {issues.length > 0 && (
        <RepositoryFilters
          placeholder={`All repositories ${getIssuesCountForFilterLabel(
            totalIssuesInGithub,
            issues.length,
          )}`}
          items={filters}
          onChange={setActiveFilter}
          totalIssuesInGithub={totalIssuesInGithub}
        />
      )}

      {displayIssues.length > 0 ? (
        displayIssues.map(
          (
            {
              node: {
                title,
                comments,
                author,
                createdAt,
                updatedAt,
                repository,
                assignees,
                url,
              },
            },
            index,
          ) => (
            <IssueCard
              key={url}
              even={Boolean(index % 2)}
              title={title}
              createdAt={createdAt}
              assigneeAvatar={assignees.edges[0]?.node.avatarUrl}
              assigneeName={assignees.edges[0]?.node.login}
              authorName={author.login}
              updatedAt={updatedAt}
              repositoryName={repository.nameWithOwner}
              url={url}
              commentsCount={comments.totalCount}
            />
          ),
        )
      ) : (
        <h1 data-testid="no-issues-msg">Hurray! No Issues 🚀</h1>
      )}
      {issues.length / itemsPerPage > 1 ? (
        <Pagination
          count={Math.ceil(issues.length / itemsPerPage)}
          onChange={(_, page) => setCurrentPage(page)}
        />
      ) : null}
    </Box>
  );
};
