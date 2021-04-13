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
import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';

import {
  mockBumpedTag,
  mockRcRelease,
  mockReleaseBranch,
  mockReleaseVersion,
  mockTagParts,
  mockApiClient,
} from '../../test-helpers/test-helpers';

jest.mock('../../components/ProjectContext', () => ({
  useApiClientContext: () => mockApiClient,
}));

import { PatchBody } from './PatchBody';
import { TEST_IDS } from '../../test-helpers/test-ids';

describe('PatchBody', () => {
  beforeEach(jest.clearAllMocks);

  it('should render error', async () => {
    mockApiClient.getBranch.mockImplementationOnce(() => {
      throw new Error('banana');
    });

    const { getByTestId } = render(
      <PatchBody
        latestRelease={mockRcRelease}
        setRefetch={jest.fn()}
        releaseBranch={mockReleaseBranch}
        bumpedTag={mockBumpedTag}
        tagParts={mockTagParts}
      />,
    );

    expect(getByTestId(TEST_IDS.patch.loading)).toBeInTheDocument();

    await waitFor(() => screen.getByTestId(TEST_IDS.patch.error));

    expect(getByTestId(TEST_IDS.patch.error)).toBeInTheDocument();
  });

  it('should render not-prerelease description', async () => {
    const { getByTestId } = render(
      <PatchBody
        latestRelease={mockReleaseVersion}
        setRefetch={jest.fn()}
        releaseBranch={mockReleaseBranch}
        bumpedTag={mockBumpedTag}
        tagParts={mockTagParts}
      />,
    );

    expect(getByTestId(TEST_IDS.patch.loading)).toBeInTheDocument();

    await waitFor(() => screen.getByTestId(TEST_IDS.patch.notPrerelease));

    expect(getByTestId(TEST_IDS.patch.notPrerelease)).toBeInTheDocument();
  });
});
