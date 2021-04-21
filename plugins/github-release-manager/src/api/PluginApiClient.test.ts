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

import { OAuthApi } from '@backstage/core';

import { PluginApiClient } from './PluginApiClient';

jest.mock('@backstage/integration', () => ({
  readGitHubIntegrationConfigs: jest.fn(() => []),
}));

describe('PluginApiClient', () => {
  it('should return the default plugin api client', () => {
    const configApi = {
      getOptionalConfigArray: jest.fn(),
    } as any;
    const githubAuthApi: OAuthApi = {
      getAccessToken: jest.fn(),
    };
    const pluginApiClient = new PluginApiClient({ configApi, githubAuthApi });

    expect(pluginApiClient).toMatchInlineSnapshot(`
      PluginApiClient {
        "baseUrl": "https://api.github.com",
        "createRc": Object {
          "createRef": [Function],
          "createRelease": [Function],
          "getComparison": [Function],
        },
        "githubAuthApi": Object {
          "getAccessToken": [MockFunction],
        },
        "host": "github.com",
        "patch": Object {
          "createCherryPickCommit": [Function],
          "createReference": [Function],
          "createTagObject": [Function],
          "createTempCommit": [Function],
          "forceBranchHeadToTempCommit": [Function],
          "merge": [Function],
          "replaceTempCommit": [Function],
          "updateRelease": [Function],
        },
        "promoteRc": Object {
          "promoteRelease": [Function],
        },
      }
    `);
  });
});
