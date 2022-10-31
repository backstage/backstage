/*
 * Copyright 2021 The Backstage Authors
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

import { renderHook, act } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react';

import { mockApiClient } from '../test-helpers/mock-api-client';
import { mockSemverProject } from '../test-helpers/test-helpers';
import { useGetGitBatchInfo } from './useGetGitBatchInfo';

describe('useGetHubBatchInfo', () => {
  it('should handle repositories with releases', async () => {
    const { result } = renderHook(() =>
      useGetGitBatchInfo({
        pluginApiClient: mockApiClient,
        project: mockSemverProject,
      }),
    );

    await act(async () => {
      await waitFor(() => result.current.gitBatchInfo !== undefined);
    });

    expect(result.current.gitBatchInfo).toMatchInlineSnapshot(`
      {
        "loading": false,
        "value": {
          "latestRelease": {
            "htmlUrl": "https://mock_release_html_url",
            "id": 1,
            "prerelease": false,
            "tagName": "rc-2020.01.01_1",
            "targetCommitish": "rc/2020.01.01_1",
          },
          "releaseBranch": {
            "commit": {
              "commit": {
                "tree": {
                  "sha": "mock_branch_commit_commit_tree_sha",
                },
              },
              "sha": "mock_branch_commit_sha",
            },
            "links": {
              "html": "https://mock_branch_links_html",
            },
            "name": "rc/1.2.3",
          },
          "repository": {
            "defaultBranch": "mock_defaultBranch",
            "name": "mock_repo",
            "pushPermissions": true,
          },
        },
      }
    `);
  });

  it('should handle repositories without any releases', async () => {
    (mockApiClient.getLatestRelease as jest.Mock).mockResolvedValueOnce({
      latestRelease: null,
    });

    const { result } = renderHook(() =>
      useGetGitBatchInfo({
        pluginApiClient: mockApiClient,
        project: mockSemverProject,
      }),
    );

    await act(async () => {
      await waitFor(() => result.current.gitBatchInfo !== undefined);
    });

    expect(result.current.gitBatchInfo).toMatchInlineSnapshot(`
      {
        "loading": false,
        "value": {
          "latestRelease": null,
          "releaseBranch": null,
          "repository": {
            "defaultBranch": "mock_defaultBranch",
            "name": "mock_repo",
            "pushPermissions": true,
          },
        },
      }
    `);
  });
});
