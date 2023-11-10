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
import { useStepOutput } from './useStepOutput';
import { MockErrorApi } from '@backstage/test-utils';
import { circleCIApiRef } from '../api';
import { makeWrapper } from '../__testUtils__/testUtils';

describe('useStepOutput', () => {
  const mockedCircleCIApi = {
    getStepOutput: jest.fn(),
  };

  const wrapper = ({ children }: { children: React.ReactElement }) =>
    makeWrapper({
      apis: [
        [circleCIApiRef, mockedCircleCIApi],
        [errorApiRef, new MockErrorApi()],
      ],
    })({ children });

  afterEach(() => jest.resetAllMocks());

  it('should fetch pipelines from api', () => {
    renderHook(() => useStepOutput(1234, 1, 99), { wrapper });

    expect(mockedCircleCIApi.getStepOutput).toHaveBeenCalledWith({
      projectSlug: 'github/my-org/dummy',
      buildNumber: 1234,
      index: 99,
      step: 1,
    });
  });

  it('should return step output', async () => {
    mockedCircleCIApi.getStepOutput.mockReturnValue('This is the output!');
    const { result } = renderHook(() => useStepOutput(1234, 1, 99), {
      wrapper,
    });

    await waitFor(() => !result.current.loading);
    expect(result.current.output).toEqual('This is the output!');
  });
});
