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

import { useEffect, useState } from 'react';
import useDebounce from 'react-use/esm/useDebounce';
import { useApi } from '@backstage/core-plugin-api';
import {
  catalogApiRef,
  entityPresentationApiRef,
} from '@backstage/plugin-catalog-react';
import { Entity, parseEntityRef } from '@backstage/catalog-model';

export type EntitySelectionOption = {
  ref: string;
  label: string;
  missing?: boolean;
  entity?: Entity;
  /** Previous lookup result; prefer fresh data when merging duplicate refs. */
  stale?: boolean;
};

export function referenceLabel(ref: string): string {
  try {
    const { kind, name } = parseEntityRef(ref);
    return `${kind.charAt(0).toLocaleUpperCase('en-US')}${kind.slice(
      1,
    )} ${name}`;
  } catch {
    return ref;
  }
}

/**
 * Retain the last successful choices while checking a new set of references.
 * Disable for a closed picker or empty filter; an enabled empty refs array means
 * the user is still typing but the input has no valid candidates yet.
 */
export function useEntityRefCandidates(refs: string[], enabled: boolean) {
  const catalogApi = useApi(catalogApiRef);
  const presentationApi = useApi(entityPresentationApiRef);
  const key = enabled ? JSON.stringify(refs) : undefined;
  const [debouncedKey, setDebouncedKey] = useState<string>();
  const [state, setState] = useState<{
    key: string | undefined;
    status: 'loading' | 'ready' | 'error';
    options: EntitySelectionOption[];
  }>({ key: undefined, status: 'ready', options: [] });
  useDebounce(() => setDebouncedKey(key), 250, [key]);

  useEffect(() => {
    if (key === undefined) {
      setState({ key, status: 'ready', options: [] });
      return undefined;
    }
    // Cancel immediately on input changes, including during the debounce.
    if (key === '[]' || key !== debouncedKey) return undefined;
    const entityRefs = JSON.parse(key) as string[];
    let cancelled = false;
    setState(previous => ({ ...previous, key, status: 'loading' }));
    catalogApi
      .getEntitiesByRefs({ entityRefs })
      .then(async response =>
        Promise.all(
          entityRefs.map(async (ref, index) => {
            const entity = response.items[index];
            return entity
              ? {
                  ref,
                  entity,
                  label: (await presentationApi.forEntity(entity).promise)
                    .primaryTitle,
                }
              : { ref, label: referenceLabel(ref), missing: true };
          }),
        ),
      )
      .then(options => {
        if (!cancelled) setState({ key, status: 'ready', options });
      })
      .catch(() => {
        if (!cancelled)
          setState(previous => ({ ...previous, key, status: 'error' }));
      });
    return () => {
      cancelled = true;
    };
  }, [catalogApi, presentationApi, debouncedKey, key]);

  const current = key === debouncedKey && key === state.key;
  const active = enabled && refs.length > 0;
  const stale = !current || state.status !== 'ready';
  const options = enabled ? state.options : [];
  return {
    options: stale
      ? options.map(option => ({ ...option, stale: true }))
      : options,
    loading: active && (!current || state.status === 'loading'),
    error: active && current && state.status === 'error',
  };
}
