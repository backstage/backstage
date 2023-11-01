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
import { useWorkflow } from './useWorkflow';

const mockResponse = { name: 'Test workflow' };

jest.mock('@backstage/core-plugin-api', () => ({
  ...jest.requireActual('@backstage/core-plugin-api'),
  useApi: jest.fn(),
}));

const mockedUseApi = useApi as jest.Mocked<any>;

describe('useWorkflow', () => {
  const circleCIApi = {
    getWorkflow: jest.fn(),
  };

  beforeEach(() => {
    mockedUseApi.mockReturnValue(circleCIApi);
  });

  afterEach(() => jest.resetAllMocks());

  it('should fetch pipelines from api', () => {
    renderHook(() => useWorkflow('workflow-id'));

    expect(circleCIApi.getWorkflow).toHaveBeenCalledWith('workflow-id');
  });

  it('should return a workflow object', async () => {
    circleCIApi.getWorkflow.mockResolvedValue(mockResponse);
    const { result, waitForValueToChange } = renderHook(() =>
      useWorkflow('workflow-id'),
    );

    await waitForValueToChange(() => result.current.loading);
    expect(result.current.workflow).toEqual(mockResponse);
  });
});
