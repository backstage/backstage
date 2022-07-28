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
const mockGraphQLQuery = jest.fn(() => 'ti ri ri ri ra!');
jest.mock('./useOctokitGraphQL', () => ({
  useOctokitGraphQL: jest.fn(() => mockGraphQLQuery),
}));

import React from 'react';
import { render } from '@testing-library/react';
import { useGetIssuesByRepoFromGitHub } from './useGetIssuesByRepoFromGitHub';

// fragment issues on Repository {
//   issues(
//     states: OPEN
//     first: 40
//     orderBy: { field: UPDATED_AT, direction: DESC }
//   ) {
//     totalCount
//     edges {
//       cursor
//       node {
//         assignees(first: 10) {
//           edges {
//             node {
//               avatarUrl
//               login
//             }
//           }
//         }
//         author {
//           login
//           avatarUrl
//           url
//         }
//         repository {
//           nameWithOwner
//         }
//         body
//         title
//         url
//         participants {
//           totalCount
//         }
//         updatedAt
//         createdAt
//         comments(last: 1) {
//           totalCount
//         }
//       }
//     }
//   }
// }

// query {
//   rateLimit {
//     cost
//     remaining
//   }

//     yomovie: repository(name: "yo-movie", owner: "mrwolny") {
//       ...issues
//     }
//   ,
//     yoanchor: repository(name: "yo-anchor", owner: "mrwolny") {
//       ...issues
//     }
//   ,
//     yomoviex: repository(name: "yo-movie", owner: "mrwolny") {
//       ...issues
//     }
//   ,
//     yoanchorx: repository(name: "yo-anchor", owner: "mrwolny") {
//       ...issues
//     }

// }

describe('useGetIssuesBeRepoFromGitHub', () => {
  it('should rock!', async () => {
    const Helper = () => {
      const getIssues = useGetIssuesByRepoFromGitHub();

      getIssues(['mrwolny/yo-yo', 'mrwolny/yoyo'], 10);

      return <></>;
    };

    render(<Helper />);

    expect(mockGraphQLQuery).toHaveBeenCalled();
  });
});
