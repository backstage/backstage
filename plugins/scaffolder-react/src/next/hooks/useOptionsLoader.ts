/*
 * Copyright 2022 The Backstage Authors
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

import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiHolder } from '@backstage/core-plugin-api';
import { JsonObject } from '@backstage/types';

/**
 * Function type for async option loading. Receives current form data and
 * a context with the Backstage ApiHolder for making API calls. An optional
 * AbortSignal is provided so that in-flight network requests can be
 * cancelled when the parent field value changes again or the component
 * unmounts.
 *
 * @alpha
 */
export type OptionsLoaderFn = (
  formData: JsonObject,
  context: { apiHolder: ApiHolder; signal?: AbortSignal },
) => Promise<Array<{ label: string; value: string | number }>>;

/**
 * Return type for the useOptionsLoader hook.
 *
 * @alpha
 */
export interface UseOptionsLoaderResult {
  /** Currently loaded options, empty array when loading or on error */
  options: Array<{ label: string; value: string | number }>;
  /** True while the optionsLoader function is executing */
  loading: boolean;
  /** Error from the last failed optionsLoader call, null when successful */
  error: Error | null;
  /** Re-invokes the optionsLoader, useful for retry after errors */
  retry: () => void;
}

/**
 * Custom React hook that manages the lifecycle of an optionsLoader for
 * scaffolder field extensions. Watches specified dependency fields in formData,
 * debounces calls to the optionsLoader, and manages loading/error/data state.
 *
 * @param fieldName - The name of the field this loader serves (used for logging)
 * @param dependencies - Array of sibling field names to watch for changes
 * @param optionsLoader - Async function that fetches options based on formData
 * @param formData - Current form data (entire form state)
 * @param apiHolder - Backstage ApiHolder for API access
 * @param options - Optional configuration (debounceMs)
 * @returns Object with options, loading, error, and retry
 *
 * @alpha
 */
export const useOptionsLoader = (
  fieldName: string,
  dependencies: string[],
  optionsLoader: OptionsLoaderFn,
  formData: JsonObject,
  apiHolder: ApiHolder,
  options?: { debounceMs?: number },
): UseOptionsLoaderResult => {
  // Tri-state management: loaded options, loading flag, and error
  const [loadedOptions, setLoadedOptions] = useState<
    Array<{ label: string; value: string | number }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Refs for tracking internal state without causing re-renders
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);
  const optionsLoaderRef = useRef(optionsLoader);

  // Keep refs up to date so callbacks always use latest values without
  // needing them in dependency arrays, which would cause unnecessary re-creation.
  optionsLoaderRef.current = optionsLoader;

  const formDataRef = useRef(formData);
  formDataRef.current = formData;

  const apiHolderRef = useRef(apiHolder);
  apiHolderRef.current = apiHolder;

  const fieldNameRef = useRef(fieldName);
  fieldNameRef.current = fieldName;

  const dependenciesRef = useRef(dependencies);
  dependenciesRef.current = dependencies;

  // Compute a serialized key from watched dependency field values.
  // This ensures the effect only re-runs when actual dependency values change,
  // not when unrelated formData fields change (which would alter the reference).
  const depKey = JSON.stringify(dependencies.map(dep => formData[dep]));

  /**
   * Internal callback that executes the options loader function.
   * Cancels any pending request before starting a new one, tracks latency,
   * and provides structured error logging for observability.
   * Uses refs for all external values to remain fully stable across renders.
   */
  const executeLoader = useCallback(
    async (currentFormData: JsonObject) => {
      // Cancel any previously pending request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      // Guard against state updates on unmounted components
      if (!mountedRef.current) return;
      setLoading(true);
      setError(null);

      const startTime = window.performance.now();

      try {
        const result = await optionsLoaderRef.current(currentFormData, {
          apiHolder: apiHolderRef.current,
          signal: controller.signal,
        });

        // Guard against state updates if unmounted or aborted during async call
        if (!mountedRef.current || controller.signal.aborted) return;

        setLoadedOptions(result);
        setLoading(false);
      } catch (err) {
        // Guard against state updates if unmounted or aborted during async call
        if (!mountedRef.current || controller.signal.aborted) return;

        const loadError = err instanceof Error ? err : new Error(String(err));
        setError(loadError);
        setLoading(false);
        setLoadedOptions([]);

        // Observability: structured logging for error paths with correlation data
        // eslint-disable-next-line no-console
        console.warn(
          `[useOptionsLoader] Failed to load options for field "${fieldNameRef.current}":`,
          {
            error: loadError.message,
            dependencies: dependenciesRef.current,
            latencyMs: Math.round(window.performance.now() - startTime),
          },
        );
      }
    },
    // All external values are accessed via refs, keeping the callback stable
    [],
  );

  // Watch dependency field values and trigger debounced loader execution.
  // Uses depKey (serialized dependency values) instead of formData reference
  // to avoid re-running the effect when unrelated form fields change.
  useEffect(() => {
    // No-op when there are no dependencies to watch
    if (dependencies.length === 0) return undefined;

    // Clear any existing debounce timer before scheduling a new one
    if (debounceTimerRef.current !== null) {
      clearTimeout(debounceTimerRef.current);
    }

    // Schedule the loader call after the debounce period
    const debounceMs = options?.debounceMs ?? 300;
    debounceTimerRef.current = setTimeout(() => {
      executeLoader(formDataRef.current);
    }, debounceMs);

    // Cleanup: cancel the pending debounce timer if the effect re-runs
    return () => {
      if (debounceTimerRef.current !== null) {
        clearTimeout(debounceTimerRef.current);
      }
    };
    // depKey changes only when watched dependency values change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depKey, dependencies.length, executeLoader, options?.debounceMs]);

  // Cleanup on component unmount: cancel pending debounce and abort pending fetch
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (debounceTimerRef.current !== null) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Memoized retry callback that re-executes the loader with current form data
  const retry = useCallback(() => {
    executeLoader(formData);
  }, [executeLoader, formData]);

  return {
    options: loadedOptions,
    loading,
    error,
    retry,
  };
};
