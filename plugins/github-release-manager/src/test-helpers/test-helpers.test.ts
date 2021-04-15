/*
 * Copyright 2021 Spotify AB
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

import * as testHelpers from './test-helpers';

describe('testHelpers', () => {
  it('should match snapshot', () => {
    expect(testHelpers).toMatchInlineSnapshot(`
      Object {
        "mockApiClient": Object {
          "createRc": Object {
            "createRef": [MockFunction],
            "createRelease": [MockFunction],
            "getComparison": [MockFunction],
          },
          "getBranch": [MockFunction],
          "getHost": [MockFunction],
          "getLatestCommit": [MockFunction],
          "getLatestRelease": [MockFunction],
          "getOrganizations": [MockFunction],
          "getRecentCommits": [MockFunction],
          "getRepoPath": [MockFunction],
          "getRepositories": [MockFunction],
          "getRepository": [MockFunction],
          "getUsername": [MockFunction],
          "patch": Object {
            "createCherryPickCommit": [MockFunction],
            "createReference": [MockFunction],
            "createTagObject": [MockFunction],
            "createTempCommit": [MockFunction],
            "forceBranchHeadToTempCommit": [MockFunction],
            "merge": [MockFunction],
            "replaceTempCommit": [MockFunction],
            "updateRelease": [MockFunction],
          },
          "promoteRc": Object {
            "promoteRelease": [MockFunction],
          },
        },
        "mockBumpedTag": "rc-2020.01.01_1337",
        "mockCalverProject": Object {
          "owner": "mock_owner",
          "repo": "mock_repo",
          "versioningStrategy": "calver",
        },
        "mockDefaultBranch": "mock_defaultBranch",
        "mockNextGitHubInfo": Object {
          "rcBranch": "rc/1.2.3",
          "rcReleaseTag": "rc-1.2.3",
          "releaseName": "Version 1.2.3",
        },
        "mockRcRelease": Object {
          "htmlUrl": "mock_release_html_url",
          "id": 1,
          "prerelease": true,
          "tagName": "rc-2020.01.01_1",
          "targetCommitish": "rc/1.2.3",
        },
        "mockRecentCommits": Array [
          Object {
            "author": Object {
              "html_url": "mock_recentCommits_author_html_url",
              "login": "mock_recentCommit_author_login",
            },
            "commit": Object {
              "message": "mock_latestCommit_message",
            },
            "html_url": "mock_latestCommit_html_url",
            "node_id": "1",
            "sha": "mock_latestCommit_sha",
          },
          Object {
            "author": Object {
              "html_url": "mock_recentCommits_author_html_url",
              "login": "mock_recentCommit_author_login",
            },
            "commit": Object {
              "message": "mock_latestCommit_message",
            },
            "html_url": "mock_latestCommit_html_url",
            "node_id": "2",
            "sha": "mock_latestCommit_sha",
          },
        ],
        "mockReleaseBranch": Object {
          "_links": Object {
            "html": "mock_branch__links_html",
          },
          "commit": Object {
            "commit": Object {
              "tree": Object {
                "sha": "mock_branch_commit_commit_tree_sha",
              },
            },
            "sha": "mock_branch_commit_sha",
          },
          "name": "rc/1.2.3",
        },
        "mockReleaseVersion": Object {
          "htmlUrl": "mock_release_html_url",
          "id": 1,
          "prerelease": false,
          "tagName": "version-2020.01.01_1",
          "targetCommitish": "rc/1.2.3",
        },
        "mockSelectedPatchCommit": Object {
          "author": Object {
            "html_url": "mock_recentCommits_author_html_url",
            "login": "mock_recentCommit_author_login",
          },
          "commit": Object {
            "message": "mock_latestCommit_message",
          },
          "html_url": "mock_latestCommit_html_url",
          "node_id": "mock_selected_patch_commit",
          "sha": "mock_latestCommit_sha",
        },
        "mockSemverProject": Object {
          "owner": "mock_owner",
          "repo": "mock_repo",
          "versioningStrategy": "semver",
        },
        "mockTagParts": Object {
          "calver": "2020.01.01",
          "patch": 1,
          "prefix": "rc",
        },
      }
    `);
  });
});
