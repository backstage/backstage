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

import { renderHook } from '@testing-library/react-hooks';
import { useApi } from '@backstage/core-plugin-api';
import { useBuildWithSteps } from './useBuildWithSteps';

const mockResponse = {
  build_num: 1234,
  job_name: 'test',
};

jest.mock('@backstage/core-plugin-api', () => ({
  ...jest.requireActual('@backstage/core-plugin-api'),
  useApi: jest.fn(),
}));

jest.mock('./useProjectSlugFromEntity', () => ({
  useProjectSlugFromEntity: () => ({ projectSlug: 'github/my-org/dummy' }),
}));

const mockedUseApi = useApi as jest.Mocked<any>;

describe('useBuildWithSteps', () => {
  const circleCIApi = {
    getBuild: jest.fn(),
  };

  beforeEach(() => {
    mockedUseApi.mockReturnValue(circleCIApi);
  });

  afterEach(() => jest.resetAllMocks());

  it('should fetch pipelines from api', () => {
    renderHook(() => useBuildWithSteps(1234));

    expect(circleCIApi.getBuild).toHaveBeenCalledWith(
      'github/my-org/dummy',
      1234,
    );
  });

  it('should return a build object', async () => {
    circleCIApi.getBuild.mockResolvedValue(mockResponse);
    const { result, waitForValueToChange } = renderHook(() =>
      useBuildWithSteps(1234),
    );

    await waitForValueToChange(() => result.current.loading);
    expect(result.current.build).toEqual(mockResponse);
  });
});
