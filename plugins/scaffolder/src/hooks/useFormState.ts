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
import { useCallback, useEffect, useRef, useState } from 'react';
import { useApi, storageApiRef } from '@backstage/core-plugin-api';
import { JsonValue } from '@backstage/types';

export interface UseFormStateOptions<T> {
  id: string;
  onLoad: (value: T | null) => void;
  debounceTime?: number;
}

export interface UseFormStateResult<T> {
  loading: boolean;
  persistFormState: (value: T) => void;
  cleanupFormState: () => void;
}

export const useFormState = <T extends JsonValue>(
  options: UseFormStateOptions<T>,
): UseFormStateResult<T> => {
  const { id, onLoad, debounceTime = 500 } = options;
  const storageApi = useApi(storageApiRef);

  const [loading, setLoading] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const onLoadRef = useRef(onLoad);
  const bucketRef = useRef(storageApi.forBucket('scaffolder-drafts'));

  useEffect(() => {
    onLoadRef.current = onLoad;
  }, [onLoad]);

  useEffect(() => {
    let isMounted = true;

    const load = () => {
      try {
        const snapshot = bucketRef.current.snapshot(id);
        if (isMounted) {
          if (snapshot.presence === 'present') {
            onLoadRef.current(snapshot.value as T);
          } else {
            onLoadRef.current(null);
          }
        }
      } catch (e) {
        if (isMounted) onLoadRef.current(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const persistFormState = useCallback(
    (value: T) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        bucketRef.current.set(id, value);
      }, debounceTime);
    },
    [id, debounceTime],
  );

  const cleanupFormState = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    bucketRef.current.remove(id);
  }, [id]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    loading,
    persistFormState,
    cleanupFormState,
  };
};
