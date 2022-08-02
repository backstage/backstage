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
jest.mock('./useOctokitGraphQL', () => ({
  useOctokitGraphQL: jest.fn(() => mockGraphQLQuery),
}));

import React from 'react';
import { render } from '@testing-library/react';
import { useGetIssuesByRepoFromGitHub } from './useGetIssuesByRepoFromGitHub';

describe('useGetIssuesBeRepoFromGitHub', () => {
  it('should call GitHub API with correct query with fragment for each repo', async () => {
    const Helper = () => {
      const getIssues = useGetIssuesByRepoFromGitHub();

      getIssues(['mrwolny/yo-yo', 'mrwolny/yoyo', 'mrwolny/yo.yo'], 10);

      return <div />;
    };

    render(<Helper />);

    expect(mockGraphQLQuery).toHaveBeenCalledTimes(1);
    expect(mockGraphQLQuery).toHaveBeenCalledWith(
      '\n' +
        '    \n' +
        '    fragment issues on Repository {\n' +
        '      issues(\n' +
        '        states: OPEN\n' +
        '        first: 10\n' +
        '        orderBy: { field: UPDATED_AT, direction: DESC }\n' +
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
        '              avatarUrl\n' +
        '              url\n' +
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
        '    }    \n' +
        '  ',
    );
  });
});
