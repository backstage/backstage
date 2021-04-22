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
  it('should export the correct things', () => {
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
          "getOwners": [MockFunction],
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
          "stats": Object {
            "getAllReleases": [MockFunction],
            "getAllTags": [MockFunction],
          },
        },
        "mockBumpedTag": "rc-2020.01.01_1337",
        "mockCalverProject": Object {
          "isProvidedViaProps": false,
          "owner": "mock_owner",
          "repo": "mock_repo",
          "versioningStrategy": "calver",
        },
        "mockDefaultBranch": "mock_defaultBranch",
        "mockNextGitHubInfoCalver": Object {
          "rcBranch": "rc/2020.01.01_1",
          "rcReleaseTag": "rc-2020.01.01_1",
          "releaseName": "Version 2020.01.01_1",
        },
        "mockNextGitHubInfoSemver": Object {
          "rcBranch": "rc/1.2.3",
          "rcReleaseTag": "rc-1.2.3",
          "releaseName": "Version 1.2.3",
        },
        "mockReleaseBranch": Object {
          "commit": Object {
            "commit": Object {
              "tree": Object {
                "sha": "mock_branch_commit_commit_tree_sha",
              },
            },
            "sha": "mock_branch_commit_sha",
          },
          "links": Object {
            "html": "mock_branch_links_html",
          },
          "name": "rc/1.2.3",
        },
        "mockReleaseCandidateCalver": Object {
          "htmlUrl": "mock_release_html_url",
          "id": 1,
          "prerelease": true,
          "tagName": "rc-2020.01.01_1",
          "targetCommitish": "rc/2020.01.01_1",
        },
        "mockReleaseCandidateSemver": Object {
          "htmlUrl": "mock_release_html_url",
          "id": 1,
          "prerelease": true,
          "tagName": "rc-1.2.3",
          "targetCommitish": "rc/1.2.3",
        },
        "mockReleaseVersionCalver": Object {
          "htmlUrl": "mock_release_html_url",
          "id": 1,
          "prerelease": false,
          "tagName": "version-2020.01.01_1",
          "targetCommitish": "rc/2020.01.01_1",
        },
        "mockReleaseVersionSemver": Object {
          "htmlUrl": "mock_release_html_url",
          "id": 1,
          "prerelease": false,
          "tagName": "version-1.2.3",
          "targetCommitish": "rc/1.2.3",
        },
        "mockSearchCalver": "?versioningStrategy=calver&owner=mock_owner&repo=mock_repo",
        "mockSearchSemver": "?versioningStrategy=semver&owner=mock_owner&repo=mock_repo",
        "mockSelectedPatchCommit": Object {
          "author": Object {
            "htmlUrl": "author_html_url",
            "login": "author_login",
          },
          "commit": Object {
            "message": "commit_message",
          },
          "firstParentSha": "mock_first_parent_sha",
          "htmlUrl": "mock_htmlUrl",
          "sha": "mock_sha_selected_patch_commit",
        },
        "mockSemverProject": Object {
          "isProvidedViaProps": false,
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
