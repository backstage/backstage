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
  mockRcRelease,
  mockApiClient,
} from '../../../test-helpers/test-helpers';
import { promoteRc } from './promoteRc';

describe('promoteRc', () => {
  beforeEach(jest.clearAllMocks);

  it('should work', async () => {
    const result = await promoteRc({
      pluginApiClient: mockApiClient,
      rcRelease: mockRcRelease,
      releaseVersion: 'version-1.2.3',
    })();

    expect(result).toMatchInlineSnapshot(`
      Array [
        Object {
          "link": "mock_release_html_url",
          "message": "Promoted \\"mock_release_name\\"",
          "secondaryMessage": "from \\"rc-2020.01.01_1\\" to \\"mock_release_tag_name\\"",
        },
      ]
    `);
  });
});
