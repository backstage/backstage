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
import { useWorkflowJobs } from './useWorkflowJobs';

const mockResponse = {
  items: [
    {
      job_number: 1122,
      name: 'job-test-1',
    },
    {
      job_number: 1123,
      name: 'job-test-2',
    },
  ],
};

jest.mock('@backstage/core-plugin-api', () => ({
  ...jest.requireActual('@backstage/core-plugin-api'),
  useApi: jest.fn(),
}));

const mockedUseApi = useApi as jest.Mocked<any>;

describe('useWorkflowJobs', () => {
  const circleCIApi = {
    getWorkflowJobs: jest.fn(),
  };

  beforeEach(() => {
    mockedUseApi.mockReturnValue(circleCIApi);
  });

  afterEach(() => jest.resetAllMocks());

  it('should fetch pipelines from api', () => {
    renderHook(() => useWorkflowJobs('workflow-id'));

    expect(circleCIApi.getWorkflowJobs).toHaveBeenCalledWith('workflow-id');
  });

  it('should return objects', async () => {
    circleCIApi.getWorkflowJobs.mockResolvedValue(mockResponse);
    const { result, waitForValueToChange } = renderHook(() =>
      useWorkflowJobs('workflow-id'),
    );

    await waitForValueToChange(() => result.current.loading);
    expect(result.current.jobs).toEqual(mockResponse.items);
  });
});
