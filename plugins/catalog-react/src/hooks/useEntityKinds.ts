/*
 * Copyright 2021 The Backstage Authors
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

import useAsync from 'react-use/lib/useAsync';
import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '../api';

// Retrieve a list of unique entity kinds present in the catalog
export function useEntityKinds() {
  const catalogApi = useApi(catalogApiRef);

  const {
    error,
    loading,
    value: kinds,
  } = useAsync(async () => {
    const facet = 'kind';

    const { facets } = await catalogApi.getEntityFacets({ facets: [facet] });

    return facets[facet]
      .reduce<string[]>((acc, f) => {
        acc.push(f.value);
        return acc;
      }, [])
      .sort();
  });
  return { error, loading, kinds };
}
