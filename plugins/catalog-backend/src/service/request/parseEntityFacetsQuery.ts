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

import { InputError } from '@backstage/errors';
import {
  createZodV3FilterPredicateSchema,
  FilterPredicate,
} from '@backstage/filter-predicates';
import { z } from 'zod/v3';
import { fromZodError } from 'zod-validation-error/v3';
import { QueryEntityFacetsByPredicateRequest } from '../../schema/openapi/generated/models/QueryEntityFacetsByPredicateRequest.model';

const filterPredicateSchema = createZodV3FilterPredicateSchema(z);

export interface ParsedEntityFacetsQuery {
  facets: string[];
  query?: FilterPredicate;
}

export function parseEntityFacetsQuery(
  request: Readonly<QueryEntityFacetsByPredicateRequest>,
): ParsedEntityFacetsQuery {
  // Parse facets
  if (!request.facets || request.facets.length === 0) {
    throw new InputError('Missing or empty facets parameter');
  }
  const facets = request.facets.filter(f => f.length > 0);
  if (facets.length === 0) {
    throw new InputError('Missing or empty facets parameter');
  }

  // Parse query predicate
  let query: FilterPredicate | undefined;
  if (request.query !== undefined) {
    const result = filterPredicateSchema.safeParse(request.query);
    if (!result.success) {
      throw new InputError(`Invalid query: ${fromZodError(result.error)}`);
    }
    query = result.data;
  }

  return { facets, query };
}
