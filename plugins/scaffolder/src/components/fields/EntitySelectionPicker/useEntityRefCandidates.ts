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

/** Exact lookups distinguish missing entities from paginated or failed results. */
export function useEntityRefCandidates(refs: string[], enabled: boolean) {
  const catalogApi = useApi(catalogApiRef);
  const presentationApi = useApi(entityPresentationApiRef);
  const key = JSON.stringify(enabled ? refs : []);
  const [debouncedKey, setDebouncedKey] = useState('[]');
  const [state, setState] = useState<{
    key: string;
    status: 'loading' | 'ready' | 'error';
    options: EntitySelectionOption[];
  }>({ key: '[]', status: 'ready', options: [] });
  useDebounce(() => setDebouncedKey(key), 250, [key]);

  useEffect(() => {
    const entityRefs = JSON.parse(debouncedKey) as string[];
    let cancelled = false;
    if (!entityRefs.length) return undefined;
    setState({ key: debouncedKey, status: 'loading', options: [] });
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
        if (!cancelled)
          setState({ key: debouncedKey, status: 'ready', options });
      })
      .catch(() => {
        if (!cancelled)
          setState({ key: debouncedKey, status: 'error', options: [] });
      });
    return () => {
      cancelled = true;
    };
  }, [catalogApi, presentationApi, debouncedKey]);

  const current = key === debouncedKey && key === state.key;
  return {
    options: enabled && current ? state.options : [],
    loading:
      enabled && refs.length > 0 && (!current || state.status === 'loading'),
    error: enabled && current && state.status === 'error',
  };
}
