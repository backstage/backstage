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
import { MockErrorApi } from '@backstage/test-utils';
import { useWorkflow } from './useWorkflow';
import { circleCIApiRef } from '../api';
import { makeWrapper } from '../__testUtils__/testUtils';

const mockResponse = { name: 'Test workflow' };

describe('useWorkflow', () => {
  const mockedCircleCIApi = {
    getWorkflow: jest.fn(),
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
    renderHook(() => useWorkflow('workflow-id'), { wrapper });

    expect(mockedCircleCIApi.getWorkflow).toHaveBeenCalledWith('workflow-id');
  });

  it('should return a workflow object', async () => {
    mockedCircleCIApi.getWorkflow.mockResolvedValue(mockResponse);
    const { result } = renderHook(() => useWorkflow('workflow-id'), {
      wrapper,
    });

    await waitFor(() => !result.current.loading);
    expect(result.current.workflow).toEqual(mockResponse);
  });
});
