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
import { renderHook, waitFor } from '@testing-library/react';
import { useApi, useRouteRef, errorApiRef } from '@backstage/core-plugin-api';

import { useStart } from './StartButton.utils';
import { goldenPathsApiRef } from '../../api';
import { executeRouteRef } from '../../routes';

const executeRoute = jest.fn(() => 'Rohan');

jest.mock('@backstage/core-plugin-api', () => ({
  errorApiRef: { id: 'test', T: { post: jest.fn() } },
  useRouteRef: jest.fn(() => executeRoute),
  useApi: jest.fn(({ T }) => ({ ...T })),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

const TASK_ID = 'Mordor';
jest.mock('../../api', () => {
  const startGoldenPath = jest.fn(() => Promise.resolve({ taskId: TASK_ID }));
  return {
    goldenPathsApiRef: {
      id: 'golden-paths',
      T: { startGoldenPath },
    },
  };
});

const GP_REF = 'The Two Towers';
jest.mock('../../hooks', () => ({
  useGoldenPathRef: () => GP_REF,
}));

jest.mock('../../routes', () => ({
  executeRouteRef: { path: '/shire/:taskId' },
}));

const errorApi = { id: 'test', post: jest.fn() };
const goldenPathsApi = { startGoldenPath: jest.fn() };

describe('StartButtonUtils - useStart', () => {
  beforeEach(() => {
    goldenPathsApi.startGoldenPath.mockResolvedValue({ taskId: TASK_ID });

    (useApi as jest.Mock).mockImplementation(ref => {
      if (ref === errorApiRef) {
        return errorApi;
      }

      return goldenPathsApi;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return defined values for `handleStart` and `isStarting`', async () => {
    const { result } = renderHook(() => useStart());

    expect(result.current.handleStart).toBeDefined();
    expect(result.current.isStarting).toBeDefined();
  });

  it('should change `isLoading` to true after calling `handleStart`', async () => {
    goldenPathsApi.startGoldenPath.mockImplementation(
      () =>
        new Promise(resolve =>
          setTimeout(() => {
            resolve({ taskId: TASK_ID });
          }, 500),
        ),
    );

    const { result } = renderHook(() => useStart());

    await waitFor(async () => {
      await result.current.handleStart();

      expect(result.current.isStarting).toBe(true);
    });
  });

  it('should change `isStarting` to false after resolving `handleStart`', async () => {
    const { result } = renderHook(() => useStart());

    await waitFor(async () => {
      await result.current.handleStart();

      expect(goldenPathsApi.startGoldenPath).toHaveBeenCalled();
      expect(executeRoute).toHaveBeenCalled();
      expect(result.current.isStarting).toBe(false);
    });
  });

  it('should call `handleStart` with initial parameters when they are provided', async () => {
    const INITIAL_PARAMS = { test: 123 };
    const startGoldenPathSpy = jest.spyOn(
      useApi(goldenPathsApiRef),
      'startGoldenPath',
    );
    const { result } = renderHook(() => useStart(INITIAL_PARAMS));

    await waitFor(async () => {
      await result.current.handleStart();
    });

    expect(startGoldenPathSpy).toHaveBeenCalledWith({
      goldenPathRef: GP_REF,
      values: INITIAL_PARAMS,
    });
  });

  it('should navigate to a path with proper `taskId` after `startGoldenPath` API call is finished', async () => {
    const executeRouteSpy = jest.mocked(useRouteRef(executeRouteRef));
    const navigateSpy = jest.spyOn(require('react-router-dom'), 'useNavigate');
    const { result } = renderHook(() => useStart());

    await waitFor(async () => {
      await result.current.handleStart();
    });

    expect(executeRouteSpy).toHaveBeenCalledWith({ taskId: TASK_ID });
    expect(navigateSpy).toHaveBeenCalled();
  });

  it('should handle error if API throws', async () => {
    const ERROR_MSG = 'Sauron saw you.';
    const errorPostSpy = jest.spyOn(useApi(errorApiRef), 'post');
    jest
      .spyOn(useApi(goldenPathsApiRef), 'startGoldenPath')
      .mockImplementation(() => Promise.reject(ERROR_MSG));
    const { result } = renderHook(() => useStart());

    await waitFor(async () => {
      await result.current.handleStart();
    });
    expect(errorPostSpy).toHaveBeenCalledWith(
      new Error(`Failed to start Golden Path, ${ERROR_MSG}`),
    );
  });
});
