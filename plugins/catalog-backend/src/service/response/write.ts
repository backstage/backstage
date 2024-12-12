/*
 * Copyright 2024 The Backstage Authors
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

import { Response } from 'express';
import { EntitiesResponseItems } from '../../catalog/types';
import { JsonValue } from '@backstage/types';

const JSON_CONTENT_TYPE = 'application/json; charset=utf-8';

export function writeSingleEntityResponse(
  res: Response,
  response: EntitiesResponseItems,
): boolean {
  const entity = response.entities[0];
  if (!entity) {
    return false;
  }

  if (typeof entity === 'string') {
    res.setHeader('Content-Type', JSON_CONTENT_TYPE);
    res.status(200);
    res.write(entity);
  } else {
    res.json(entity);
  }

  return true;
}

export function writeEntitiesResponse(
  res: Response,
  response: EntitiesResponseItems,
  responseWrapper?: (entities: JsonValue) => JsonValue,
) {
  if (response.type === 'objects') {
    res.json(
      responseWrapper
        ? responseWrapper?.(response.entities)
        : response.entities,
    );
    return;
  }

  res.setHeader('Content-Type', JSON_CONTENT_TYPE);
  res.status(200);

  // responseWrapper allows the caller to render the entities within an object
  let trailing = '';
  if (responseWrapper) {
    const marker = `__MARKER_${Math.random().toString(36).slice(2, 10)}__`;
    const wrapped = JSON.stringify(responseWrapper(marker));
    const parts = wrapped.split(marker);
    if (parts.length !== 2) {
      throw new Error(
        `Entity items response was incorrectly wrapped into ${parts.length} different parts`,
      );
    }
    res.write(parts[0], 'utf8');
    trailing = parts[1];
  }

  let first = true;
  for (const entity of response.entities) {
    if (first) {
      res.write('[', 'utf8');
      first = false;
    } else {
      res.write(',', 'utf8');
    }
    res.write(entity, 'utf8');
  }
  res.end(']');
  if (trailing) {
    res.write(trailing, 'utf8');
  }
}
