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
import { useFormState } from './useFormState';
import { useApi } from '@backstage/core-plugin-api';

jest.mock('@backstage/core-plugin-api', () => ({
  useApi: jest.fn(),
  storageApiRef: {},
}));

describe('useFormState', () => {
  const mockSnapshot = jest.fn();
  const mockSet = jest.fn().mockResolvedValue(undefined);
  const mockRemove = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    jest.clearAllMocks();

    (useApi as jest.Mock).mockReturnValue({
      forBucket: jest.fn().mockReturnValue({
        snapshot: mockSnapshot,
        set: mockSet,
        remove: mockRemove,
      }),
    });
  });

  it('should load existing state on mount if present', async () => {
    mockSnapshot.mockReturnValue({
      presence: 'present',
      value: { testKey: 'testValue' },
    });
    const onLoadMock = jest.fn();

    const { result } = renderHook(() =>
      useFormState({ id: 'test-draft', onLoad: onLoadMock }),
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(onLoadMock).toHaveBeenCalledWith({ testKey: 'testValue' });
  });

  it('should call onLoad with null if no state is present', async () => {
    mockSnapshot.mockReturnValue({ presence: 'absent' });
    const onLoadMock = jest.fn();

    const { result } = renderHook(() =>
      useFormState({ id: 'test-draft', onLoad: onLoadMock }),
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(onLoadMock).toHaveBeenCalledWith(null);
  });

  it('should debounce persistFormState calls', () => {
    jest.useFakeTimers();
    mockSnapshot.mockReturnValue({ presence: 'absent' });

    const { result } = renderHook(() =>
      useFormState({ id: 'test-draft', onLoad: jest.fn(), debounceTime: 500 }),
    );

    result.current.persistFormState({ step1: 'data' });
    result.current.persistFormState({ step1: 'data', step2: 'more-data' });

    expect(mockSet).not.toHaveBeenCalled();

    jest.advanceTimersByTime(500);

    expect(mockSet).toHaveBeenCalledTimes(1);
    expect(mockSet).toHaveBeenCalledWith('test-draft', {
      step1: 'data',
      step2: 'more-data',
    });

    jest.useRealTimers();
  });

  it('should remove the state from the bucket when cleanupFormState is called', () => {
    mockSnapshot.mockReturnValue({ presence: 'absent' });

    const { result } = renderHook(() =>
      useFormState({ id: 'test-draft', onLoad: jest.fn() }),
    );

    result.current.cleanupFormState();

    expect(mockRemove).toHaveBeenCalledWith('test-draft');
  });
});
