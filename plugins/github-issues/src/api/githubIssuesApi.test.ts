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

const mockGraphQLQuery = jest.fn(() => ({}));
jest.mock('octokit', () => ({
  Octokit: jest.fn(() => ({ graphql: mockGraphQLQuery })),
}));

import { ConfigApi, ErrorApi } from '@backstage/core-plugin-api';
import { ForwardedError } from '@backstage/errors';
import { createFilterByClause, githubIssuesApi } from './githubIssuesApi';
import type { GithubIssuesFilters } from './githubIssuesApi';

function getFragment(
  filterBy = '',
  orderBy = 'field: UPDATED_AT, direction: DESC',
) {
  return (
    '\n' +
    '    \n' +
    '    fragment issues on Repository {\n' +
    '      issues(\n' +
    '        states: OPEN\n' +
    '        first: 10\n' +
    `        filterBy: { ${filterBy} }\n` +
    `        orderBy: { ${orderBy} }\n` +
    '      ) {\n' +
    '        totalCount\n' +
    '        edges {\n' +
    '          node {\n' +
    '            assignees(first: 10) {\n' +
    '              edges {\n' +
    '                node {\n' +
    '                  avatarUrl\n' +
    '                  login\n' +
    '                }\n' +
    '              }\n' +
    '            }\n' +
    '            author {\n' +
    '              login\n' +
    '            }\n' +
    '            repository {\n' +
    '              nameWithOwner\n' +
    '            }\n' +
    '            title\n' +
    '            url\n' +
    '            participants {\n' +
    '              totalCount\n' +
    '            }\n' +
    '            updatedAt\n' +
    '            createdAt\n' +
    '            comments(last: 1) {\n' +
    '              totalCount\n' +
    '            }\n' +
    '          }\n' +
    '        }\n' +
    '      }\n' +
    '    }\n' +
    '  \n' +
    '\n' +
    '    query {\n' +
    '      \n' +
    '        yoyo: repository(name: "yo-yo", owner: "mrwolny") {\n' +
    '          ...issues\n' +
    '        }\n' +
    '      ,\n' +
    '        yoyox: repository(name: "yoyo", owner: "mrwolny") {\n' +
    '          ...issues\n' +
    '        }\n' +
    '      ,\n' +
    '        yoyoxx: repository(name: "yo.yo", owner: "mrwolny") {\n' +
    '          ...issues\n' +
    '        }\n' +
    '      \n' +
    '    }\n' +
    '  '
  );
}

describe('githubIssuesApi', () => {
  describe('fetchIssuesByRepoFromGithub', () => {
    let api: ReturnType<typeof githubIssuesApi>;

    afterEach(() => {
      jest.clearAllMocks();
    });

    beforeEach(() => {
      api = githubIssuesApi(
        { getAccessToken: jest.fn() },
        {
          getOptionalConfigArray: jest.fn(),
        } as unknown as ConfigApi,
        { post: jest.fn() } as unknown as ErrorApi,
      );
    });

    it('should call GitHub API with correct query with fragment for each repo', async () => {
      await api.fetchIssuesByRepoFromGithub(
        ['mrwolny/yo-yo', 'mrwolny/yoyo', 'mrwolny/yo.yo'],
        10,
      );

      expect(mockGraphQLQuery).toHaveBeenCalledTimes(1);
      expect(mockGraphQLQuery).toHaveBeenCalledWith(getFragment());
    });

    it('should call Github API with the correct filterBy and orderBy clauses', async () => {
      await api.fetchIssuesByRepoFromGithub(
        ['mrwolny/yo-yo', 'mrwolny/yoyo', 'mrwolny/yo.yo'],
        10,
        {
          filterBy: {
            labels: ['bug'],
            states: ['OPEN'],
            assignee: 'someone',
          },
          orderBy: {
            field: 'COMMENTS',
            direction: 'ASC',
          },
        },
      );

      const expectedFilterBy = `labels: [ "bug"], states: OPEN, assignee: "someone"`;
      const expectedOrderBy = 'field: COMMENTS, direction: ASC';

      expect(mockGraphQLQuery).toHaveBeenCalledTimes(1);
      expect(mockGraphQLQuery).toHaveBeenCalledWith(
        getFragment(expectedFilterBy, expectedOrderBy),
      );
    });

    describe('filterBy', () => {
      const cases: [GithubIssuesFilters | undefined, string][] = [
        [{}, ''],
        [undefined, ''],
        [{ states: ['OPEN'] }, 'states: OPEN'],
        [
          { labels: ['bug', 'enhancement'], assignee: 'someone' },
          `labels: [ \"bug\", \"enhancement\"], assignee: "someone"`,
        ],
        [
          {
            createdBy: 'someone',
            mentioned: 'someone else',
            milestone: 'milestone',
          },
          `createdBy: \"someone\", mentioned: \"someone else\", milestone: \"milestone\"`,
        ],
      ];

      test.each(cases)('filterBy(%s) should be %s', (filterBy, expected) => {
        expect(createFilterByClause(filterBy)).toEqual(expected);
      });
    });
  });

  it('should return data for repos with successfully retrieved issues when GitHub returns partial failure', async () => {
    mockGraphQLQuery.mockImplementationOnce(() =>
      Promise.reject({
        data: {
          yoyo: {
            issues: {
              totalCount: 1,
              edges: [
                {
                  node: {
                    assignees: {
                      edges: [],
                    },
                    author: {
                      login: 'mrwolny',
                    },
                    repository: {
                      nameWithOwner: 'mrwolny/yo-yo',
                    },
                    title: "It's the ISSUE!",
                    url: 'https://github.com/mrwolny/yo-yo/issues/1',
                    participants: {
                      totalCount: 1,
                    },
                    updatedAt: '2022-07-04T18:47:33Z',
                    createdAt: '2022-06-23T18:14:26Z',
                    comments: {
                      totalCount: 4,
                    },
                  },
                },
              ],
            },
          },
          notfound: null,
        },
        errors: [
          {
            type: 'NOT_FOUND',
            path: ['notfound'],
            locations: [
              {
                line: 48,
                column: 9,
              },
            ],
            message:
              "Could not resolve to a Repository with the name 'notfound/notfound'.",
          },
        ],
      }),
    );

    const api = githubIssuesApi(
      { getAccessToken: jest.fn() },
      {
        getOptionalConfigArray: jest.fn(),
      } as unknown as ConfigApi,
      { post: jest.fn() } as unknown as ErrorApi,
    );

    const data = await api.fetchIssuesByRepoFromGithub(
      ['mrwolny/yo-yo', 'mrwolny/notfound'],
      10,
    );

    expect(data).toEqual({
      'mrwolny/yo-yo': {
        issues: {
          totalCount: 1,
          edges: [
            {
              node: {
                assignees: {
                  edges: [],
                },
                author: {
                  login: 'mrwolny',
                },
                repository: {
                  nameWithOwner: 'mrwolny/yo-yo',
                },
                title: "It's the ISSUE!",
                url: 'https://github.com/mrwolny/yo-yo/issues/1',
                participants: {
                  totalCount: 1,
                },
                updatedAt: '2022-07-04T18:47:33Z',
                createdAt: '2022-06-23T18:14:26Z',
                comments: {
                  totalCount: 4,
                },
              },
            },
          ],
        },
      },
    });
  });

  it('should return empty object when GitHub returns failure with no data', async () => {
    mockGraphQLQuery.mockImplementationOnce(() =>
      Promise.reject({
        data: {
          notfound: null,
        },
        errors: [
          {
            type: 'NOT_FOUND',
            path: ['notfound'],
            locations: [
              {
                line: 48,
                column: 9,
              },
            ],
            message:
              "Could not resolve to a Repository with the name 'notfound/notfound'.",
          },
        ],
      }),
    );

    const api = githubIssuesApi(
      { getAccessToken: jest.fn() },
      {
        getOptionalConfigArray: jest.fn(),
      } as unknown as ConfigApi,
      { post: jest.fn() } as unknown as ErrorApi,
    );

    const data = await api.fetchIssuesByRepoFromGithub(
      ['mrwolny/notfound'],
      10,
    );

    expect(data).toEqual({});
  });

  it('should post error to the backstage error API when GitHub returns failure', async () => {
    mockGraphQLQuery.mockImplementationOnce(() =>
      Promise.reject({
        data: {
          notfound: null,
        },
        errors: [
          {
            type: 'NOT_FOUND',
            path: ['notfound'],
            locations: [
              {
                line: 48,
                column: 9,
              },
            ],
            message:
              "Could not resolve to a Repository with the name 'notfound/notfound'.",
          },
        ],
      }),
    );

    const mockErrorApi = { post: jest.fn() };

    const api = githubIssuesApi(
      { getAccessToken: jest.fn() },
      {
        getOptionalConfigArray: jest.fn(),
      } as unknown as ConfigApi,
      mockErrorApi as unknown as ErrorApi,
    );

    await api.fetchIssuesByRepoFromGithub(['mrwolny/notfound'], 10);

    expect(mockErrorApi.post).toHaveBeenCalledTimes(1);
    expect(mockErrorApi.post).toHaveBeenCalledWith(
      new ForwardedError('GitHub Issues Plugin failure', {
        data: {
          notfound: null,
        },
        errors: [
          {
            type: 'NOT_FOUND',
            path: ['notfound'],
            locations: [
              {
                line: 48,
                column: 9,
              },
            ],
            message:
              "Could not resolve to a Repository with the name 'notfound/notfound'.",
          },
        ],
      }),
    );
  });
});
