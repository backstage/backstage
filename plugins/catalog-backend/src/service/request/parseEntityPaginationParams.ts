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

import { InputError } from '@backstage/errors';
import { EntityPagination } from '../../catalog/types';
import { parseIntegerParam, parseStringParam } from './common';

/**
 * Parses the pagination related parameters out of a query, e.g.
 * /entities?offset=100&limit=10
 */
export function parseEntityPaginationParams(
  offsetParam: string | undefined,
  limitParam: string | undefined,
  afterParam: string | undefined,
): EntityPagination | undefined {
  const offset = parseIntegerParam(offsetParam, 'offset');
  const limit = parseIntegerParam(limitParam, 'limit');
  const after = parseStringParam(afterParam, 'after');

  if (offset === undefined && limit === undefined && after === undefined) {
    return undefined;
  }

  if (offset !== undefined && offset < 0) {
    throw new InputError(`Invalid offset, must be zero or greater`);
  }
  if (limit !== undefined && limit <= 0) {
    throw new InputError(`Invalid limit, must be greater than zero`);
  }
  if (after !== undefined && !after) {
    throw new InputError(`Invalid after, must not be empty`);
  }

  return {
    ...(offset !== undefined ? { offset } : {}),
    ...(limit !== undefined ? { limit } : {}),
    ...(after !== undefined ? { after } : {}),
  };
}
