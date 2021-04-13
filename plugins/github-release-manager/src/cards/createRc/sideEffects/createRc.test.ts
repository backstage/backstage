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
import {
  mockApiClient,
  mockDefaultBranch,
  mockNextGitHubInfo,
  mockReleaseVersion,
} from '../../../test-helpers/test-helpers';
import { createRc } from './createRc';

describe('createRc', () => {
  beforeEach(jest.clearAllMocks);

  it('should work', async () => {
    const result = await createRc({
      apiClient: mockApiClient,
      defaultBranch: mockDefaultBranch,
      latestRelease: mockReleaseVersion,
      nextGitHubInfo: mockNextGitHubInfo,
    });

    expect(result).toMatchInlineSnapshot(`
      Array [
        Object {
          "link": "mock_latestCommit_html_url",
          "message": "Fetched latest commit from \\"mock_defaultBranch\\"",
          "secondaryMessage": "with message \\"mock_latestCommit_message\\"",
        },
        Object {
          "message": "Cut Release Branch",
          "secondaryMessage": "with ref \\"mock_createRef_ref\\"",
        },
        Object {
          "link": "mock_compareCommits_html_url",
          "message": "Fetched commit comparision",
          "secondaryMessage": "rc/1.2.3...rc/1.2.3",
        },
        Object {
          "link": "mock_createRelease_html_url",
          "message": "Created Release Candidate \\"mock_createRelease_name\\"",
          "secondaryMessage": "with tag \\"rc-1.2.3\\"",
        },
      ]
    `);
  });
});
