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
import { useOctokitGraphQL } from './useOctokitGraphQL';

type Assignee = {
  avatarUrl: string;
  login: string;
};

export type EdgesWithNodes<T> = {
  edges: Array<{
    node: T;
  }>;
};

export type Node<T> = {
  node: T;
};

type IssueAuthor = {
  login: string;
};

export type Issue = {
  assignees: EdgesWithNodes<Assignee>;
  author: IssueAuthor;
  repository: {
    nameWithOwner: string;
  };
  title: string;
  url: string;
  participants: {
    totalCount: number;
  };
  createdAt: string;
  updatedAt: string;
  comments: {
    totalCount: number;
  };
};

export type RepoIssues = {
  issues: {
    totalCount: number;
  } & EdgesWithNodes<Issue>;
};

export type RepoIssuesQueryResults = Record<string, RepoIssues>;

const createQuery = (
  repositories: Array<{
    safeName: string;
    name: string;
    owner: string;
  }>,
  itemsPerRepo: number,
): string => {
  const fragment = `
    fragment issues on Repository {
      issues(
        states: OPEN
        first: ${itemsPerRepo}
        orderBy: { field: UPDATED_AT, direction: DESC }
      ) {
        totalCount
        edges {
          node {
            assignees(first: 10) {
              edges {
                node {
                  avatarUrl
                  login
                }
              }
            }
            author {
              login
              avatarUrl
              url
            }
            repository {
              nameWithOwner
            }
            title
            url
            participants {
              totalCount
            }
            updatedAt
            createdAt
            comments(last: 1) {
              totalCount
            }
          }
        }
      }
    }
  `;

  const query = `
    ${fragment}

    query {
      ${repositories.map(
        ({ safeName, name, owner }) => `
        ${safeName}: repository(name: "${name}", owner: "${owner}") {
          ...issues
        }
      `,
      )}
    }    
  `;

  return query;
};

export const useGetIssuesByRepoFromGitHub = () => {
  const graphql = useOctokitGraphQL<RepoIssuesQueryResults>();

  const fn = React.useRef(
    async (
      repos: Array<string>,
      itemsPerRepo: number,
    ): Promise<Record<string, RepoIssues>> => {
      const safeNames: Array<string> = [];

      const repositories = repos.map(repo => {
        const [owner, name] = repo.split('/');

        const safeNameRegex = /-|\./gi;
        let safeName = name.replace(safeNameRegex, '');

        while (safeNames.includes(safeName)) {
          safeName += 'x';
        }

        safeNames.push(safeName);

        return {
          safeName,
          name,
          owner,
        };
      });

      const issuesByRepo: RepoIssuesQueryResults = await graphql(
        createQuery(repositories, itemsPerRepo),
      );

      return repositories.reduce((acc, { safeName, name, owner }) => {
        acc[`${owner}/${name}`] = issuesByRepo[safeName];

        return acc;
      }, {} as Record<string, RepoIssues>);
    },
  );

  return fn.current;
};
