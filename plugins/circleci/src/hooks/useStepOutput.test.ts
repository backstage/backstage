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
import { useApi } from '@backstage/core-plugin-api';
import { useStepOutput } from './useStepOutput';

jest.mock('@backstage/core-plugin-api', () => ({
  ...jest.requireActual('@backstage/core-plugin-api'),
  useApi: jest.fn(),
}));

jest.mock('./useProjectSlugFromEntity', () => ({
  useProjectSlugFromEntity: () => ({ projectSlug: 'github/my-org/dummy' }),
}));

const mockedUseApi = useApi as jest.Mocked<any>;

describe('useStepOutput', () => {
  const circleCIApi = {
    getStepOutput: jest.fn(),
  };

  beforeEach(() => {
    mockedUseApi.mockReturnValue(circleCIApi);
  });

  afterEach(() => jest.resetAllMocks());

  it('should fetch pipelines from api', () => {
    renderHook(() => useStepOutput(1234, 1, 99));

    expect(circleCIApi.getStepOutput).toHaveBeenCalledWith(
      'github/my-org/dummy',
      1234,
      99,
      1,
    );
  });

  it('should return step output', async () => {
    circleCIApi.getStepOutput.mockReturnValue('This is the output!');
    const { result } = renderHook(() => useStepOutput(1234, 1, 99));

    await waitFor(() => !result.current.loading);
    expect(result.current.output).toEqual('This is the output!');
  });
});
