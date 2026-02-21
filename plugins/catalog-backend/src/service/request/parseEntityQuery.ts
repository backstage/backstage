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
import { QueryEntitiesByPredicateRequest } from '../../schema/openapi/generated/models/QueryEntitiesByPredicateRequest.model';
import { EntityOrder } from '../../catalog/types';
import { Cursor } from '../../catalog/types';
import { decodeCursor } from '../util';

const filterPredicateSchema = createZodV3FilterPredicateSchema(z);

function isSupportedFilterPredicateRoot(
  value: FilterPredicate | undefined,
): boolean {
  if (value === undefined) {
    return true;
  }
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  return true;
}

function parseOrderFields(
  orderField: string[] | undefined,
): EntityOrder[] | undefined {
  if (!orderField?.length) {
    return undefined;
  }
  return orderField.map(entry => {
    const [field, order] = entry.split(',');
    if (order !== undefined && order !== 'asc' && order !== 'desc') {
      throw new InputError('Invalid order field order, must be asc or desc');
    }
    return { field, order: order as 'asc' | 'desc' };
  });
}

export type ParsedEntityQuery =
  | {
      cursor: Cursor;
      fields?: string[];
      limit?: number;
    }
  | {
      query?: FilterPredicate;
      orderFields?: EntityOrder[];
      fullTextFilter?: { term: string; fields?: string[] };
      fields?: string[];
      limit?: number;
      offset?: number;
    };

export function parseEntityQuery(
  request: Readonly<QueryEntitiesByPredicateRequest>,
): ParsedEntityQuery {
  if (request.cursor !== undefined) {
    if (!request.cursor) {
      throw new InputError('Cursor cannot be empty');
    }

    const cursor = decodeCursor(request.cursor);
    return {
      cursor,
      fields: request.fields,
      limit: request.limit,
    };
  }

  let query: FilterPredicate | undefined;
  if (request.query !== undefined) {
    const result = filterPredicateSchema.safeParse(request.query);
    if (!result.success) {
      throw new InputError(`Invalid query: ${fromZodError(result.error)}`);
    }
    if (!isSupportedFilterPredicateRoot(result.data)) {
      throw new InputError('Query must be an object');
    }
    query = result.data;
  }

  const orderFields = parseOrderFields(request.orderField);

  return {
    query,
    orderFields,
    fullTextFilter: request.fullTextFilter
      ? {
          term: request.fullTextFilter.term ?? '',
          fields: request.fullTextFilter.fields,
        }
      : undefined,
    fields: request.fields,
    limit: request.limit,
  };
}
