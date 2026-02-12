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
import { JsonValue } from '@backstage/types';
import { z } from 'zod/v3';
import { fromZodError } from 'zod-validation-error/v3';
import { GetLocationsByQueryRequest } from '../../schema/openapi/generated/models/GetLocationsByQueryRequest.model';

const filterPredicateSchema = createZodV3FilterPredicateSchema(z);

const locationCursorParser = z.object({
  limit: z.number().int().min(1),
  afterId: z.string().optional(),
  query: filterPredicateSchema.optional(),
});

export function parseLocationQuery(
  request: Readonly<GetLocationsByQueryRequest>,
): {
  limit: number;
  afterId?: string;
  query?: FilterPredicate;
} {
  if (request.cursor) {
    let parsed: JsonValue;
    try {
      const data = Buffer.from(request.cursor, 'base64').toString('utf8');
      parsed = JSON.parse(data);
    } catch {
      throw new InputError('Malformed cursor, unknown encoding');
    }

    const result = locationCursorParser.safeParse(parsed);
    if (!result.success) {
      throw new InputError(`Malformed cursor: ${fromZodError(result.error)}`);
    }
    return {
      limit: result.data.limit,
      afterId: result.data.afterId,
      query: result.data.query,
    };
  }

  const limit = request.limit ?? 1000;
  if (!Number.isInteger(limit) || limit < 1) {
    throw new InputError('Limit must be a positive integer >= 1');
  }

  let query: FilterPredicate | undefined;
  if (request.query !== undefined) {
    const result = filterPredicateSchema.safeParse(request.query);
    if (!result.success) {
      throw new InputError(`Invalid query: ${fromZodError(result.error)}`);
    }
    query = result.data;
  }

  return {
    limit,
    query,
  };
}

export function encodeLocationQueryCursor(cursor: {
  limit: number;
  afterId?: string;
  query?: FilterPredicate;
}): string {
  return Buffer.from(JSON.stringify(cursor), 'utf8').toString('base64');
}
