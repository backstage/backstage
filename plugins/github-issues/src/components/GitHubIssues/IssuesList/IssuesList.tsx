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
import { Issue } from '../../../hooks/useGetIssuesByRepoFromGitHub';
import { Filters, FilterItem } from './Filters';

export type PluginMode = 'page' | 'card';

export type Props = {
  itemsPerPage?: number;
  issues: Array<{
    node: Issue;
  }>;
  filters: Array<FilterItem>;
  totalIssuesInGitHub: number;
  setActiveFilter: (active: Array<string>) => void;
};

export const IssueList = ({
  itemsPerPage = 10,
  issues,
  filters,
  setActiveFilter,
  totalIssuesInGitHub,
}: Props) => {
  const [currentPage, setCurrentPage] = React.useState(1);

  const displayIssues = issues.slice(
    (currentPage - 1) * itemsPerPage,
    (currentPage - 1) * itemsPerPage + itemsPerPage,
  );

  return (
    <Box>
      <Filters
        items={filters}
        onChange={setActiveFilter}
        totalIssuesInGitHub={totalIssuesInGitHub}
      />

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
        <h1>No issues 🚀</h1>
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
