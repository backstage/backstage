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

import type {
  FilterPredicate,
  FilterPredicateExpression,
} from '@backstage/filter-predicates';
import {
  CATALOG_FILTER_EXISTS,
  EntityFilterQuery,
  QueryEntitiesCursorRequest,
  QueryEntitiesInitialRequest,
  QueryEntitiesRequest,
} from './types/api';

export function isQueryEntitiesInitialRequest(
  request: QueryEntitiesRequest,
): request is QueryEntitiesInitialRequest {
  return !(request as QueryEntitiesCursorRequest).cursor;
}

/**
 * Check if a cursor contains a predicate query by attempting to decode it.
 * @internal
 */
export function cursorContainsQuery(cursor: string): boolean {
  try {
    const decoded = JSON.parse(atob(cursor));
    return 'query' in decoded;
  } catch {
    return false;
  }
}

/**
 * Converts an {@link EntityFilterQuery} into a predicate query object.
 * @internal
 */
export function convertFilterToPredicate(filter: EntityFilterQuery):
  | FilterPredicateExpression
  | {
      $all: FilterPredicate[];
    }
  | {
      $any: FilterPredicate[];
    } {
  const records = [filter].flat();

  const clauses = records.map(record => {
    const parts: FilterPredicateExpression[] = [];

    for (const [key, value] of Object.entries(record)) {
      const values = [value].flat();
      const strings = values.filter((v): v is string => typeof v === 'string');
      const hasExists = values.some(v => v === CATALOG_FILTER_EXISTS);

      if (hasExists) {
        // Ignore whether there ALSO were some strings - that would boil down to
        // just existence anyway since there's effectively an OR between them
        parts.push({ [key]: { $exists: true } } as FilterPredicateExpression);
      } else if (strings.length === 1) {
        parts.push({ [key]: strings[0] } as FilterPredicateExpression);
      } else if (strings.length > 1) {
        parts.push({ [key]: { $in: strings } } as FilterPredicateExpression);
      }
    }

    return parts.length === 1 ? parts[0] : { $all: parts };
  });

  return clauses.length === 1 ? clauses[0] : { $any: clauses };
}

/**
 * Takes a set of entity refs, and splits them into chunks (groups) such that
 * the total string length in each chunk does not exceed the default Express.js
 * request body limit of 100 kB (with some margin) when JSON encoded as an
 * array.
 */
export function splitRefsIntoChunks(
  refs: string[],
  options?: {
    // No chunk has more than this many refs, no matter what
    maxCountPerChunk?: number;
    // The total string length (taking the extraStringLengthPerRef into account)
    // of each chunk never exceeds this many characters, no matter what
    maxStringLengthPerChunk?: number;
    // Add this many characters to the length of each ref when calculating
    // (default is 3, since eacn array entry is surrounded by quotes and a
    // comma)
    extraStringLengthPerRef?: number;
  },
): string[][] {
  if (!refs.length) {
    return [];
  }

  const {
    maxCountPerChunk = 1000,
    maxStringLengthPerChunk = 90 * 2 ** 10,
    extraStringLengthPerRef = 3,
  } = options ?? {};

  const chunks: string[][] = [];

  let currentChunkStart = 0;
  let currentChunkStringLength = 0;
  let currentChunkSize = 0;

  for (let i = 0; i < refs.length; ++i) {
    const refLength = refs[i].length + extraStringLengthPerRef;

    // always allow at least one element per chunk even in abnormal situations
    if (currentChunkSize > 0) {
      // emit chunk and start over if either the string length or the count
      // limit would be reached
      if (
        currentChunkStringLength + refLength > maxStringLengthPerChunk ||
        currentChunkSize + 1 > maxCountPerChunk
      ) {
        chunks.push(refs.slice(currentChunkStart, i));
        currentChunkStart = i;
        currentChunkStringLength = 0;
        currentChunkSize = 0;
      }
    }

    currentChunkStringLength += refLength;
    currentChunkSize += 1;
  }

  // emit whatever is left as the last chunk
  chunks.push(refs.slice(currentChunkStart, refs.length));

  return chunks;
}
