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

import { InputError } from '@backstage/errors';
import { parseStringsParam } from './common';

/**
 * Parses the facets part of a facet query, like
 * /entity-facets?filter=metadata.namespace=default,kind=Component&facet=metadata.namespace
 */
export function parseEntityFacetParams(
  params: Record<string, unknown>,
): string[] {
  // Each facet string is on the form a.b.c
  const facetStrings = parseStringsParam(params.facet, 'facet');
  if (facetStrings) {
    const filtered = facetStrings.filter(Boolean);
    if (filtered.length) {
      return filtered;
    }
  }

  throw new InputError('Missing facet parameter');
}
