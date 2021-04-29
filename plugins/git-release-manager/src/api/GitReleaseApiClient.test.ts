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

import { ConfigReader, OAuthApi } from '@backstage/core';

import { GitReleaseApiClient } from './GitReleaseApiClient';

describe('GitReleaseApiClient', () => {
  it('should return the default plugin api client', () => {
    const configApi = new ConfigReader({});
    const githubAuthApi: OAuthApi = {
      getAccessToken: jest.fn(),
    };
    const gitReleaseApiClient = new GitReleaseApiClient({
      configApi,
      githubAuthApi,
    });

    expect(gitReleaseApiClient).toMatchInlineSnapshot(`
      GitReleaseApiClient {
        "baseUrl": "https://api.github.com",
        "createRc": Object {
          "createRelease": [Function],
          "getComparison": [Function],
        },
        "createRef": [Function],
        "createTagObject": [Function],
        "getBranch": [Function],
        "getHost": [Function],
        "getLatestCommit": [Function],
        "getLatestRelease": [Function],
        "getOwners": [Function],
        "getRecentCommits": [Function],
        "getRepoPath": [Function],
        "getRepositories": [Function],
        "getRepository": [Function],
        "getUser": [Function],
        "githubAuthApi": Object {
          "getAccessToken": [MockFunction],
        },
        "host": "github.com",
        "patch": Object {
          "createCherryPickCommit": [Function],
          "createReference": [Function],
          "createTempCommit": [Function],
          "forceBranchHeadToTempCommit": [Function],
          "merge": [Function],
          "replaceTempCommit": [Function],
          "updateRelease": [Function],
        },
        "promoteRc": Object {
          "promoteRelease": [Function],
        },
        "stats": Object {
          "getAllReleases": [Function],
          "getAllTags": [Function],
          "getCommit": [Function],
          "getSingleTag": [Function],
        },
      }
    `);
  });
});
