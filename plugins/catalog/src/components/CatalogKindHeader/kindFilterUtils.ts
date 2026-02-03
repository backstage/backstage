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

import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import useAsync from 'react-use/esm/useAsync';

/**
 * Fetch and return all available kinds.
 */
export function useAllKinds(): {
  loading: boolean;
  error?: Error;
  allKinds: Map<string, string>;
} {
  const catalogApi = useApi(catalogApiRef);

  const {
    error,
    loading,
    value: allKinds,
  } = useAsync(async () => {
    const { facets } = await catalogApi.getEntityFacets({ facets: ['kind'] });
    const kindFacets = (facets.kind ?? []).map(f => f.value);
    return new Map(
      kindFacets.map(kind => [kind.toLocaleLowerCase('en-US'), kind]),
    );
  }, [catalogApi]);

  return { loading, error, allKinds: allKinds ?? new Map() };
}

/**
 * Filter and capitalize accessible kinds.
 */
export function filterKinds(
  allKinds: Map<string, string>,
  allowedKinds?: string[],
  forcedKinds?: string,
): Map<string, string> {
  // Before allKinds is loaded, or when a kind is entered manually in the URL, selectedKind may not
  // be present in allKinds. It should still be shown in the dropdown, but may not have the nice
  // enforced casing from the catalog-backend. This makes a key/value record for the Select options,
  // including selectedKind if it's unknown - but allows the selectedKind to get clobbered by the
  // more proper catalog kind if it exists.
  let availableKinds = Array.from(allKinds.keys());
  if (allowedKinds) {
    availableKinds = allowedKinds
      .map(k => k.toLocaleLowerCase('en-US'))
      .filter(k => allKinds.has(k));
  }

  const kindsMap = new Map(
    availableKinds.map(kind => [kind, allKinds.get(kind) || kind]),
  );

  if (forcedKinds && !kindsMap.has(forcedKinds)) {
    // this is the only time we set a label for a kind which is not properly capitalized
    kindsMap.set(forcedKinds.toLocaleLowerCase('en-US'), forcedKinds);
  }

  return kindsMap;
}
