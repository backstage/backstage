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

import {
  QueryEntitiesCursorRequest,
  QueryEntitiesInitialRequest,
  QueryEntitiesRequest,
} from '../../catalog/types';
import { decodeCursor } from '../util';
import { parseIntegerParam, parseStringParam } from './common';
import { parseEntityFilterParams } from './parseEntityFilterParams';
import { parseEntityOrderFieldParams } from './parseEntityOrderFieldParams';
import { parseEntityTransformParams } from './parseEntityTransformParams';
import { parseFullTextFilterFields } from './parseFullTextFilterFields';

export function parseQueryEntitiesParams(
  params: Record<string, unknown>,
): Omit<QueryEntitiesRequest, 'authorizationToken'> {
  const fields = parseEntityTransformParams(params);
  const limit = parseIntegerParam(params.limit, 'limit');
  const cursor = parseStringParam(params.cursor, 'cursor');
  if (cursor) {
    const decodedCursor = decodeCursor(cursor);
    const response: Omit<QueryEntitiesCursorRequest, 'authorizationToken'> = {
      cursor: decodedCursor,
      fields,
      limit,
    };
    return response;
  }

  const filter = parseEntityFilterParams(params);
  const fullTextFilterTerm = parseStringParam(
    params.fullTextFilterTerm,
    'fullTextFilterTerm',
  );
  const fullTextFilterFields = parseFullTextFilterFields(params);

  const orderFields = parseEntityOrderFieldParams(params);

  const response: Omit<QueryEntitiesInitialRequest, 'authorizationToken'> = {
    fields,
    filter,
    limit,
    orderFields,
    fullTextFilter: {
      term: fullTextFilterTerm || '',
      fields: fullTextFilterFields,
    },
  };

  return response;
}
