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
import useAsync from 'react-use/esm/useAsync';
import { catalogApiRef } from '../../api';

/**
 * Fetch and return all availible kinds.
 */
export function useAllKinds(): {
  loading: boolean;
  error?: Error;
  allKinds: string[];
} {
  const catalogApi = useApi(catalogApiRef);

  const {
    error,
    loading,
    value: allKinds,
  } = useAsync(async () => {
    const items = await catalogApi
      .getEntityFacets({ facets: ['kind'] })
      .then(response => response.facets.kind?.map(f => f.value).sort() || []);
    return items;
  }, [catalogApi]);

  return { loading, error, allKinds: allKinds ?? [] };
}

/**
 * Filter and capitalize accessible kinds.
 */
export function filterKinds(
  allKinds: string[],
  allowedKinds?: string[],
  forcedKinds?: string,
): Record<string, string> {
  // Before allKinds is loaded, or when a kind is entered manually in the URL, selectedKind may not
  // be present in allKinds. It should still be shown in the dropdown, but may not have the nice
  // enforced casing from the catalog-backend. This makes a key/value record for the Select options,
  // including selectedKind if it's unknown - but allows the selectedKind to get clobbered by the
  // more proper catalog kind if it exists.
  let availableKinds = allKinds;
  if (allowedKinds) {
    availableKinds = availableKinds.filter(k =>
      allowedKinds.some(
        a => a.toLocaleLowerCase('en-US') === k.toLocaleLowerCase('en-US'),
      ),
    );
  }
  if (
    forcedKinds &&
    !allKinds.some(
      a =>
        a.toLocaleLowerCase('en-US') === forcedKinds.toLocaleLowerCase('en-US'),
    )
  ) {
    availableKinds = availableKinds.concat([forcedKinds]);
  }

  const kindsMap = availableKinds.sort().reduce(
    (acc, kind) => {
      acc[kind.toLocaleLowerCase('en-US')] = kind;
      return acc;
    },
    {} as Record<string, string>,
  );

  return kindsMap;
}
