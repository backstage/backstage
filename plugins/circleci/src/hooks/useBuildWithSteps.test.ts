/*
 * Copyright 2020 The Backstage Authors
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

import { renderHook, waitFor } from '@testing-library/react';
import { errorApiRef } from '@backstage/core-plugin-api';
import { useBuildWithSteps } from './useBuildWithSteps';
import { makeWrapper } from '../__testUtils__/testUtils';
import { circleCIApiRef } from '../api';
import { MockErrorApi } from '@backstage/test-utils';

const mockResponse = {
  build_num: 1234,
  job_name: 'test',
};

describe('useBuildWithSteps', () => {
  const mockedCircleCIApi = {
    getBuild: jest.fn(),
  };

  afterEach(() => jest.resetAllMocks());

  it('should fetch pipelines from api', () => {
    renderHook(() => useBuildWithSteps(1234), {
      wrapper: makeWrapper({
        apis: [
          [circleCIApiRef, mockedCircleCIApi],
          [errorApiRef, new MockErrorApi()],
        ],
      }),
    });

    expect(mockedCircleCIApi.getBuild).toHaveBeenCalledWith(
      'github/my-org/dummy',
      1234,
    );
  });

  it('should return a build object', async () => {
    mockedCircleCIApi.getBuild.mockResolvedValue(mockResponse);
    const { result } = renderHook(() => useBuildWithSteps(1234), {
      wrapper: makeWrapper({
        apis: [
          [circleCIApiRef, mockedCircleCIApi],
          [errorApiRef, new MockErrorApi()],
        ],
      }),
    });

    await waitFor(() => !result.current.loading);
    expect(result.current.build).toEqual(mockResponse);
  });
});
