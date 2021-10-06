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

import {
  mockBumpedTag,
  mockCalverProject,
  mockReleaseVersionCalver,
  mockSelectedPatchCommit,
  mockTagParts,
  mockUser,
} from '../../../test-helpers/test-helpers';
import { usePatch } from './usePatch';
import { mockApiClient } from '../../../test-helpers/mock-api-client';

jest.mock('@backstage/core-plugin-api', () => ({
  ...jest.requireActual('@backstage/core-plugin-api'),
  useApi: () => mockApiClient,
}));
jest.mock('../../../contexts/UserContext', () => ({
  useUserContext: () => ({ user: mockUser }),
}));

describe('patch', () => {
  beforeEach(jest.clearAllMocks);

  it('should return the expected responseSteps (including patch validation sequence) and progress', async () => {
    const { result } = renderHook(() =>
      usePatch({
        bumpedTag: mockBumpedTag,
        latestRelease: mockReleaseVersionCalver,
        project: mockCalverProject,
        tagParts: mockTagParts,
      }),
    );

    await act(async () => {
      await waitFor(() => result.current.run(mockSelectedPatchCommit));
    });

    expect(result.error).toEqual(undefined);
    expect(result.current.responseSteps).toHaveLength(18);
  });

  it('should return the expected responseSteps (including patch validation sequence) and progress (with onSuccess)', async () => {
    const { result } = renderHook(() =>
      usePatch({
        bumpedTag: mockBumpedTag,
        latestRelease: mockReleaseVersionCalver,
        project: mockCalverProject,
        tagParts: mockTagParts,
        onSuccess: jest.fn(),
      }),
    );

    await act(async () => {
      await waitFor(() => result.current.run(mockSelectedPatchCommit));
    });

    expect(result.error).toEqual(undefined);
    expect(result.current.responseSteps).toHaveLength(19);
    expect(result.current).toMatchInlineSnapshot(`
      Object {
        "progress": 100,
        "responseSteps": Array [
          Object {
            "message": <PatchValidationMessage
              message="Fetched latest commit from \\"rc/2020.01.01_1\\""
            />,
          },
          Object {
            "message": <PatchValidationMessage
              message="Created temporary patch validating branch \\"rc/2020.01.01_1-backstage-grm-patch-validation\\""
            />,
          },
          Object {
            "message": <PatchValidationMessage
              message="Fetched release branch \\"rc/1.2.3\\""
            />,
          },
          Object {
            "message": <PatchValidationMessage
              message="Created temporary commit"
            />,
          },
          Object {
            "message": <PatchValidationMessage
              message="Forced branch \\"rc/2020.01.01_1-backstage-grm-patch-validation\\" to temporary commit \\"mock_commit_sha\\""
            />,
          },
          Object {
            "message": <PatchValidationMessage
              message="Merged temporary commit into \\"rc/2020.01.01_1-backstage-grm-patch-validation\\""
            />,
          },
          Object {
            "message": <PatchValidationMessage
              message="Cherry-picked patch commit to \\"mock_branch_commit_sha\\""
            />,
          },
          Object {
            "message": <PatchValidationMessage
              message="Updated reference \\"mock_update_ref_ref\\""
            />,
          },
          Object {
            "message": <PatchValidationMessage
              message="Deleted temporary patch prep branch \\"rc/2020.01.01_1-backstage-grm-patch-validation\\""
            />,
          },
          Object {
            "link": "https://mock_branch_links_html",
            "message": "Fetched release branch \\"rc/1.2.3\\"",
          },
          Object {
            "message": "Created temporary commit",
            "secondaryMessage": "with message \\"mock_commit_message\\"",
          },
          Object {
            "message": "Forced branch \\"rc/2020.01.01_1\\" to temporary commit \\"mock_commit_sha\\"",
          },
          Object {
            "link": "https://mock_merge_html_url",
            "message": "Merged temporary commit into \\"rc/2020.01.01_1\\"",
            "secondaryMessage": "with message \\"mock_merge_commit_message\\"",
          },
          Object {
            "message": "Cherry-picked patch commit to \\"mock_branch_commit_sha\\"",
            "secondaryMessage": "with message \\"mock_commit_message\\"",
          },
          Object {
            "message": "Updated reference \\"mock_update_ref_ref\\"",
          },
          Object {
            "message": "Created new tag object",
            "secondaryMessage": "with name \\"mock_tag_object_tag\\"",
          },
          Object {
            "message": "Created new reference \\"mock_createRef_ref\\"",
            "secondaryMessage": "for tag object \\"mock_tag_object_tag\\"",
          },
          Object {
            "link": "https://mock_update_release_html_url",
            "message": "Updated release \\"mock_update_release_name\\"",
            "secondaryMessage": "with tag mock_update_release_tag_name",
          },
          Object {
            "icon": "success",
            "message": "Success callback successfully called 🚀",
          },
        ],
        "run": [Function],
        "runInvoked": true,
      }
    `);
  });
});
