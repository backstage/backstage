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
  mockBumpedTag,
  mockCalverProject,
  mockReleaseVersionCalver,
  mockSelectedPatchCommit,
  mockTagParts,
} from '../../../test-helpers/test-helpers';
import { patch } from './patch';

describe('patch', () => {
  beforeEach(jest.clearAllMocks);

  it('should work', async () => {
    const result = await patch({
      bumpedTag: mockBumpedTag,
      latestRelease: mockReleaseVersionCalver,
      pluginApiClient: mockApiClient,
      project: mockCalverProject,
      selectedPatchCommit: mockSelectedPatchCommit,
      tagParts: mockTagParts,
    });

    expect(result).toMatchInlineSnapshot(`
      Array [
        Object {
          "link": "mock_branch_links_html",
          "message": "Fetched release branch \\"rc/1.2.3\\"",
        },
        Object {
          "message": "Created temporary commit",
          "secondaryMessage": "with message \\"mock_commit_message\\"",
        },
        Object {
          "link": "mock_merge_html_url",
          "message": "Merged temporary commit into \\"rc/1.2.3\\"",
          "secondaryMessage": "with message \\"mock_merge_commit_message\\"",
        },
        Object {
          "message": "Cherry-picked patch commit to \\"mock_branch_commit_sha\\"",
          "secondaryMessage": "with message \\"mock_cherrypick_message\\"",
        },
        Object {
          "message": "Updated reference \\"mock_reference_ref\\"",
        },
        Object {
          "message": "Created new tag object",
          "secondaryMessage": "with name \\"mock_tag_object_tag\\"",
        },
        Object {
          "message": "Created new reference \\"mock_reference_ref\\"",
          "secondaryMessage": "for tag object \\"mock_tag_object_tag\\"",
        },
        Object {
          "link": "mock_update_release_html_url",
          "message": "Updated release \\"mock_update_release_name\\"",
          "secondaryMessage": "with tag mock_update_release_tag_name",
        },
      ]
    `);
  });
});
