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
import { mockApiClient } from '../test-helpers/test-helpers';
import { getLatestRelease } from './getLatestRelease';

describe('getLatestRelease', () => {
  beforeEach(jest.clearAllMocks);

  it('should return the latest release with id=1', async () => {
    const result = await getLatestRelease({ apiClient: mockApiClient });

    expect(result).toMatchInlineSnapshot(`
      Object {
        "body": "mock_latest_release",
        "html_url": "mock_release_html_url",
        "id": 1,
        "prerelease": false,
      }
    `);
  });

  it('should return early with `null` if no releases found', async () => {
    mockApiClient.getReleases.mockImplementationOnce(() => ({ releases: [] }));

    const result = await getLatestRelease({ apiClient: mockApiClient });

    expect(result).toMatchInlineSnapshot(`null`);
  });
});
