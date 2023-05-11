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

import { Octokit } from 'octokit';
import {
  createApiRef,
  ConfigApi,
  ErrorApi,
  OAuthApi,
} from '@backstage/core-plugin-api';
import { readGithubIntegrationConfigs } from '@backstage/integration';
import { ForwardedError } from '@backstage/errors';

/** @internal */
export type Assignee = {
  avatarUrl: string;
  login: string;
};

/** @internal */
export type EdgesWithNodes<T> = {
  edges: Array<{
    node: T;
  }>;
};

/** @internal */
export type IssueAuthor = {
  login: string;
};

/** @internal */
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

/** @internal */
export type RepoIssues = {
  issues: {
    totalCount: number;
  } & EdgesWithNodes<Issue>;
};

/** @internal */
export type IssuesByRepo = Record<string, RepoIssues>;

/** @internal */
export type GithubIssuesApi = ReturnType<typeof githubIssuesApi>;

/**
 * @public
 */
export interface GithubIssuesFilters {
  assignee?: string;
  createdBy?: string;
  labels?: string[];
  mentioned?: string;
  milestone?: string;
  states?: ('OPEN' | 'CLOSED')[];
}

/**
 * @public
 */
export interface GithubIssuesOrdering {
  field: 'CREATED_AT' | 'UPDATED_AT' | 'COMMENTS';
  direction?: 'ASC' | 'DESC';
}

/**
 * @public
 */
export interface GithubIssuesByRepoOptions {
  filterBy?: GithubIssuesFilters;
  orderBy?: GithubIssuesOrdering;
}

/** @internal */
export const githubIssuesApiRef = createApiRef<GithubIssuesApi>({
  id: 'plugin.githubissues.service',
});

/** @internal */
export const githubIssuesApi = (
  githubAuthApi: OAuthApi,
  configApi: ConfigApi,
  errorApi: ErrorApi,
) => {
  let octokit: Octokit;

  const getOctokit = async () => {
    const baseUrl = readGithubIntegrationConfigs(
      configApi.getOptionalConfigArray('integrations.github') ?? [],
    )[0].apiBaseUrl;

    const token = await githubAuthApi.getAccessToken(['repo']);

    if (!octokit) {
      octokit = new Octokit({ auth: token, ...(baseUrl && { baseUrl }) });
    }

    return octokit.graphql;
  };

  const fetchIssuesByRepoFromGithub = async (
    repos: Array<string>,
    itemsPerRepo: number,
    {
      filterBy,
      orderBy = {
        field: 'UPDATED_AT',
        direction: 'DESC',
      },
    }: GithubIssuesByRepoOptions = {},
  ): Promise<IssuesByRepo> => {
    const graphql = await getOctokit();
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

    let issuesByRepo: IssuesByRepo = {};
    try {
      issuesByRepo = await graphql(
        createIssueByRepoQuery(repositories, itemsPerRepo, {
          filterBy,
          orderBy,
        }),
      );
    } catch (e) {
      if (e.data) {
        issuesByRepo = e.data;
      }

      errorApi.post(new ForwardedError('GitHub Issues Plugin failure', e));
    }

    return repositories.reduce((acc, { safeName, name, owner }) => {
      if (issuesByRepo[safeName]) {
        acc[`${owner}/${name}`] = issuesByRepo[safeName];
      }

      return acc;
    }, {} as IssuesByRepo);
  };

  return { fetchIssuesByRepoFromGithub };
};

function formatFilterValue(
  value: GithubIssuesFilters[keyof GithubIssuesFilters],
): string {
  if (Array.isArray(value)) {
    return `[ ${value.map(formatFilterValue).join(', ')}]`;
  }

  return typeof value === 'string' ? `\"${value}\"` : `${value}`;
}

/** @internal */
export function createFilterByClause(filterBy?: GithubIssuesFilters): string {
  if (!filterBy) {
    return '';
  }

  return Object.entries(filterBy)
    .filter(value => value)
    .map(([field, value]) => {
      if (field === 'states') {
        return `${field}: ${value.join(', ')}`;
      }

      return `${field}: ${formatFilterValue(value)}`;
    })
    .join(', ');
}

function createIssueByRepoQuery(
  repositories: Array<{
    safeName: string;
    name: string;
    owner: string;
  }>,
  itemsPerRepo: number,
  { filterBy, orderBy }: GithubIssuesByRepoOptions,
): string {
  const fragment = `
    fragment issues on Repository {
      issues(
        states: OPEN
        first: ${itemsPerRepo}
        filterBy: { ${createFilterByClause(filterBy)} }
        orderBy: { field: ${orderBy?.field}, direction: ${orderBy?.direction} }
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
}
