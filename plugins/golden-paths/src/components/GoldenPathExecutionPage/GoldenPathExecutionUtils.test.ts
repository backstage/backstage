/*
 * Copyright 2026 The Backstage Authors
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
import { useApi } from '@backstage/core-plugin-api';
import { goldenPathsApiRef } from '@backstage/plugin-golden-paths-react';
import { renderHook } from '@testing-library/react';
import { useParams } from 'react-router-dom';

import { useGoldenPathTask } from './GoldenPathExecution.utils';
import { GP_TASK } from '../../mocks';
import { waitFor } from '@testing-library/react';

const TASK_ID = '12345';
const GP_REF = "They're taking the hobbits to Isengard!";
jest.mock('@backstage/plugin-golden-paths-react', () => {
  const getTask = jest.fn(() => Promise.resolve(GP_TASK));
  return {
    useGoldenPathRef: jest.fn(() => GP_REF),
    goldenPathsApiRef: {
      id: 'golden-paths',
      T: { getTask },
    },
  };
});

jest.mock('@backstage/core-plugin-api', () => ({
  useApi: jest.fn(({ T }) => ({ ...T })),
}));

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(() => ({})),
}));

describe('useGoldenPathTask', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a proper initial structure of an object', () => {
    const { result } = renderHook(() => useGoldenPathTask());

    expect(result.current).toEqual({
      error: undefined,
      loading: true,
      task: undefined,
      getGoldenPathTask: expect.any(Function),
    });
  });

  it('should return an error if there is no taskID in URL params', async () => {
    const { result } = renderHook(() => useGoldenPathTask());

    await waitFor(() =>
      expect(result.current.error?.message).toBe('No task ID provided!'),
    );
  });

  it('should call `getTask` with a proper argument', async () => {
    const getSpy = jest.spyOn(useApi(goldenPathsApiRef), 'getTask');
    (useParams as jest.Mock).mockReturnValueOnce({ taskId: TASK_ID });

    renderHook(() => useGoldenPathTask());

    await waitFor(() => {
      expect(getSpy).toHaveBeenCalledWith(TASK_ID);
    });
  });

  it('should return a proper structure of an object after API call is finished', async () => {
    (useParams as jest.Mock).mockReturnValueOnce({ taskId: TASK_ID });

    const { result } = renderHook(() => useGoldenPathTask());

    await waitFor(() => {
      expect(result.current).toEqual({
        error: undefined,
        loading: false,
        task: GP_TASK,
        getGoldenPathTask: expect.any(Function),
      });
    });
  });
});
