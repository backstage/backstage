/*
 * Copyright 2025 The Backstage Authors
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

import { renderHook, act, waitFor } from '@testing-library/react';
import { useOptionsLoader } from './useOptionsLoader';
import type { JsonObject } from '@backstage/types';
import type { ApiHolder } from '@backstage/core-plugin-api';

/**
 * Convenience type alias matching the OptionsLoaderFn export from the hook
 * module, used to type mock loader functions throughout the test suite.
 */
type OptionsLoaderFn = (
  formData: JsonObject,
  context: { apiHolder: ApiHolder },
) => Promise<Array<{ label: string; value: string | number }>>;

describe('useOptionsLoader', () => {
  const mockApiHolder = { get: jest.fn() } as unknown as ApiHolder;

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('starts with empty options, loading false, and no error', () => {
    const mockLoader: OptionsLoaderFn = jest.fn().mockResolvedValue([]);

    const { result } = renderHook(() =>
      useOptionsLoader(
        'myField',
        [],
        mockLoader,
        {} as JsonObject,
        mockApiHolder,
      ),
    );

    expect(result.current.options).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    // With empty dependencies, the loader should never be invoked
    expect(mockLoader).not.toHaveBeenCalled();
  });

  it('debounces optionsLoader calls with default 300ms delay', async () => {
    const mockLoader: OptionsLoaderFn = jest
      .fn()
      .mockResolvedValue([{ label: 'Option 1', value: 'opt1' }]);

    const { result, rerender } = renderHook(
      ({ formData }) =>
        useOptionsLoader(
          'myField',
          ['parentField'],
          mockLoader,
          formData,
          mockApiHolder,
        ),
      { initialProps: { formData: { parentField: 'a' } as JsonObject } },
    );

    // Rapidly rerender with different dependency values — each rerender
    // clears the previous debounce timer and schedules a new one
    rerender({ formData: { parentField: 'b' } as JsonObject });
    rerender({ formData: { parentField: 'c' } as JsonObject });
    rerender({ formData: { parentField: 'd' } as JsonObject });

    // Before the debounce window elapses, the loader must not have been called
    expect(mockLoader).not.toHaveBeenCalled();

    // Advance past the 300ms default debounce
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Wait for the async loader execution to complete
    await waitFor(() => {
      expect(mockLoader).toHaveBeenCalledTimes(1);
    });

    // The single invocation must receive the LAST formData (from 'd' rerender)
    expect(mockLoader).toHaveBeenCalledWith(
      { parentField: 'd' },
      expect.objectContaining({ apiHolder: mockApiHolder }),
    );

    // The resolved options should appear in the hook result
    await waitFor(() => {
      expect(result.current.options).toEqual([
        { label: 'Option 1', value: 'opt1' },
      ]);
    });
    expect(result.current.loading).toBe(false);
  });

  it('sets loading to true while optionsLoader is pending', async () => {
    // Deferred promise pattern to control resolution timing
    let resolveLoader!: (
      value: Array<{ label: string; value: string | number }>,
    ) => void;
    const mockLoader: OptionsLoaderFn = jest.fn().mockImplementation(
      () =>
        new Promise(resolve => {
          resolveLoader = resolve;
        }),
    );

    const { result } = renderHook(
      ({ formData }) =>
        useOptionsLoader(
          'myField',
          ['parentField'],
          mockLoader,
          formData,
          mockApiHolder,
        ),
      { initialProps: { formData: { parentField: 'AWS' } as JsonObject } },
    );

    // Advance past debounce to trigger the loader call
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Loading should be true while the promise is still pending
    await waitFor(() => {
      expect(result.current.loading).toBe(true);
    });
    expect(result.current.options).toEqual([]);

    // Resolve the deferred promise with option data
    await act(async () => {
      resolveLoader([{ label: 'US East', value: 'us-east-1' }]);
    });

    // After resolution, loading is false and options are populated
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.options).toEqual([
      { label: 'US East', value: 'us-east-1' },
    ]);
    expect(result.current.error).toBeNull();
  });

  it('sets error state when optionsLoader rejects', async () => {
    // Suppress the structured console.warn the hook emits on error
    const consoleWarnSpy = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => {});

    const mockLoader: OptionsLoaderFn = jest
      .fn()
      .mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(
      ({ formData }) =>
        useOptionsLoader(
          'myField',
          ['parentField'],
          mockLoader,
          formData,
          mockApiHolder,
        ),
      { initialProps: { formData: { parentField: 'AWS' } as JsonObject } },
    );

    // Trigger the loader via debounce
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Wait for the rejection to propagate through the async execution
    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
    });

    expect(result.current.error?.message).toBe('Network error');
    expect(result.current.loading).toBe(false);
    expect(result.current.options).toEqual([]);

    consoleWarnSpy.mockRestore();
  });

  it('retry function re-invokes the optionsLoader', async () => {
    // Suppress the structured console.warn the hook emits on error
    const consoleWarnSpy = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => {});

    const mockLoader: OptionsLoaderFn = jest
      .fn()
      .mockRejectedValueOnce(new Error('Failed'))
      .mockResolvedValueOnce([{ label: 'Retried', value: 'r1' }]);

    const { result } = renderHook(
      ({ formData }) =>
        useOptionsLoader(
          'myField',
          ['parentField'],
          mockLoader,
          formData,
          mockApiHolder,
        ),
      { initialProps: { formData: { parentField: 'AWS' } as JsonObject } },
    );

    // Trigger the initial load — first call will reject
    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
    });
    expect(result.current.error?.message).toBe('Failed');
    expect(mockLoader).toHaveBeenCalledTimes(1);

    // Invoke retry — bypasses debounce, calls executeLoader directly
    await act(async () => {
      result.current.retry();
    });

    // Wait for the second call (which resolves) to propagate
    await waitFor(() => {
      expect(result.current.error).toBeNull();
    });

    expect(result.current.options).toEqual([{ label: 'Retried', value: 'r1' }]);
    expect(result.current.loading).toBe(false);
    expect(mockLoader).toHaveBeenCalledTimes(2);

    consoleWarnSpy.mockRestore();
  });

  it('does not update state after unmount during pending fetch', async () => {
    // Deferred promise to keep the fetch pending until after unmount
    let resolveLoader!: (
      value: Array<{ label: string; value: string | number }>,
    ) => void;
    const mockLoader: OptionsLoaderFn = jest.fn().mockImplementation(
      () =>
        new Promise(resolve => {
          resolveLoader = resolve;
        }),
    );

    const { result, unmount } = renderHook(
      ({ formData }) =>
        useOptionsLoader(
          'myField',
          ['parentField'],
          mockLoader,
          formData,
          mockApiHolder,
        ),
      { initialProps: { formData: { parentField: 'AWS' } as JsonObject } },
    );

    // Trigger the debounce to start the async fetch
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Confirm the loader was invoked and loading is in progress
    await waitFor(() => {
      expect(result.current.loading).toBe(true);
    });
    expect(mockLoader).toHaveBeenCalledTimes(1);

    // Unmount the component while the fetch is still pending.
    // This sets mountedRef to false and aborts the AbortController.
    unmount();

    // Resolve the pending loader promise after unmount.
    // The hook's guard (mountedRef.current === false or signal.aborted)
    // prevents any setState calls, avoiding React warnings.
    await act(async () => {
      resolveLoader([{ label: 'Late', value: 'late' }]);
    });

    // Verify the loader was invoked but the component is cleanly unmounted
    // (no thrown errors or unhandled promise rejections reaching this point)
    expect(mockLoader).toHaveBeenCalledTimes(1);
  });

  it('only invokes optionsLoader when watched dependency field values change', async () => {
    const mockLoader: OptionsLoaderFn = jest
      .fn()
      .mockResolvedValue([{ label: 'US East', value: 'us-east-1' }]);

    const { rerender } = renderHook(
      ({ formData }) =>
        useOptionsLoader(
          'region',
          ['parentField'],
          mockLoader,
          formData,
          mockApiHolder,
        ),
      {
        initialProps: {
          formData: {
            parentField: 'AWS',
            unrelatedField: 'x',
          } as JsonObject,
        },
      },
    );

    // Initial debounce fires — first loader invocation
    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(mockLoader).toHaveBeenCalledTimes(1);
    });

    // Change ONLY an unrelated field (watched dependency 'parentField' is unchanged)
    rerender({
      formData: {
        parentField: 'AWS',
        unrelatedField: 'y',
      } as JsonObject,
    });

    // Advance past the debounce window — no new call should fire because
    // the serialized dependency key (JSON.stringify(['AWS'])) is unchanged
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(mockLoader).toHaveBeenCalledTimes(1);

    // Now change the actual watched dependency value
    rerender({
      formData: {
        parentField: 'GCP',
        unrelatedField: 'y',
      } as JsonObject,
    });

    // Advance past the debounce window — this time the dependency key changed
    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(mockLoader).toHaveBeenCalledTimes(2);
    });

    // The second call should include the updated dependency value
    expect(mockLoader).toHaveBeenLastCalledWith(
      { parentField: 'GCP', unrelatedField: 'y' },
      expect.objectContaining({ apiHolder: mockApiHolder }),
    );
  });

  it('respects custom debounceMs parameter', async () => {
    const mockLoader: OptionsLoaderFn = jest
      .fn()
      .mockResolvedValue([{ label: 'Custom', value: 'custom' }]);

    const { rerender } = renderHook(
      ({ formData }) =>
        useOptionsLoader(
          'myField',
          ['parentField'],
          mockLoader,
          formData,
          mockApiHolder,
          { debounceMs: 500 },
        ),
      { initialProps: { formData: { parentField: 'a' } as JsonObject } },
    );

    // Change the dependency to reset the debounce timer
    rerender({ formData: { parentField: 'b' } as JsonObject });

    // At 300ms — well within the 500ms custom debounce — the loader
    // should NOT have been called yet
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(mockLoader).not.toHaveBeenCalled();

    // At 500ms total (200ms more) — the custom debounce has elapsed
    act(() => {
      jest.advanceTimersByTime(200);
    });

    await waitFor(() => {
      expect(mockLoader).toHaveBeenCalledTimes(1);
    });

    // Verify the call was made with the latest formData
    expect(mockLoader).toHaveBeenCalledWith(
      { parentField: 'b' },
      expect.objectContaining({ apiHolder: mockApiHolder }),
    );
  });
});
