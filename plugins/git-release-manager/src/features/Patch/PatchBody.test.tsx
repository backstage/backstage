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

import React from 'react';
import { waitFor, screen, render } from '@testing-library/react';

import {
  mockBumpedTag,
  mockCalverProject,
  mockReleaseBranch,
  mockReleaseCandidateCalver,
  mockReleaseVersionCalver,
  mockTagParts,
  mockCtaMessage,
} from '../../test-helpers/test-helpers';
import { mockApiClient } from '../../test-helpers/mock-api-client';
import { PatchBody } from './PatchBody';
import { TEST_IDS } from '../../test-helpers/test-ids';
import { MockErrorApi, TestApiProvider } from '@backstage/test-utils';
import { translationApiRef } from '@backstage/core-plugin-api/alpha';
import { MockTranslationApi } from '@backstage/test-utils/alpha';
import { errorApiRef } from '@backstage/core-plugin-api';

jest.mock('@backstage/core-plugin-api', () => ({
  ...jest.requireActual('@backstage/core-plugin-api'),
  useApi: () => mockApiClient,
}));
jest.mock('../../contexts/ProjectContext', () => ({
  useProjectContext: () => ({
    project: mockCalverProject,
  }),
}));
jest.mock('./hooks/usePatch', () => ({
  usePatch: () => ({
    run: jest.fn(),
    responseSteps: [],
    progress: 0,
  }),
}));

describe('PatchBody', () => {
  beforeEach(jest.clearAllMocks);

  it('should render error', async () => {
    (mockApiClient.getRecentCommits as jest.Mock).mockImplementationOnce(() => {
      throw new Error('banana');
    });

    const { getByTestId } = render(
      <TestApiProvider
        apis={[
          [translationApiRef, MockTranslationApi.create()],
          [errorApiRef, new MockErrorApi()],
        ]}
      >
        <PatchBody
          bumpedTag={mockBumpedTag}
          latestRelease={mockReleaseCandidateCalver}
          releaseBranch={mockReleaseBranch}
          tagParts={mockTagParts}
          ctaMessage={mockCtaMessage}
        />
        ,
      </TestApiProvider>,
    );

    expect(getByTestId(TEST_IDS.patch.loading)).toBeInTheDocument();

    await waitFor(() => screen.getByTestId(TEST_IDS.patch.error));

    expect(getByTestId(TEST_IDS.patch.error)).toBeInTheDocument();
  });

  it('should render not-prerelease description', async () => {
    const { getByTestId } = render(
      <TestApiProvider
        apis={[
          [translationApiRef, MockTranslationApi.create()],
          [errorApiRef, new MockErrorApi()],
        ]}
      >
        <PatchBody
          latestRelease={mockReleaseVersionCalver}
          releaseBranch={mockReleaseBranch}
          bumpedTag={mockBumpedTag}
          tagParts={mockTagParts}
          ctaMessage={mockCtaMessage}
        />
      </TestApiProvider>,
    );

    expect(getByTestId(TEST_IDS.patch.loading)).toBeInTheDocument();

    await waitFor(() => screen.getByTestId(TEST_IDS.patch.notPrerelease));

    expect(getByTestId(TEST_IDS.patch.notPrerelease)).toBeInTheDocument();
  });
});
