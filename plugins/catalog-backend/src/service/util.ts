/*
 * Copyright 2020 The Backstage Authors
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

import { InputError, NotAllowedError } from '@backstage/errors';
import { Request } from 'express';
import lodash from 'lodash';
import { z } from 'zod';
import {
  Cursor,
  QueryEntitiesCursorRequest,
  QueryEntitiesInitialRequest,
  QueryEntitiesRequest,
} from '../catalog/types';
import { EntityFilter } from '@backstage/plugin-catalog-node';
import {
  Entity,
  parseEntityRef,
  stringifyEntityRef,
} from '@backstage/catalog-model';

export async function requireRequestBody(req: Request): Promise<unknown> {
  const contentType = req.header('content-type');
  if (!contentType) {
    throw new InputError('Content-Type missing');
  } else if (!contentType.match(/^application\/json($|;)/)) {
    throw new InputError('Illegal Content-Type');
  }

  const body = req.body;
  if (!body) {
    throw new InputError('Missing request body');
  } else if (!lodash.isPlainObject(body)) {
    throw new InputError('Expected body to be a JSON object');
  } else if (Object.keys(body).length === 0) {
    // Because of how express.json() translates the empty body to {}
    throw new InputError('Empty request body');
  }

  return body;
}

export const locationInput = z
  .object({
    type: z.string(),
    target: z.string(),
    presence: z.literal('required').or(z.literal('optional')).optional(),
  })
  .strict(); // no unknown keys;

export async function validateRequestBody<T>(
  req: Request,
  schema: z.Schema<T>,
): Promise<T> {
  const body = await requireRequestBody(req);
  try {
    return await schema.parse(body);
  } catch (e) {
    throw new InputError(`Malformed request: ${e}`);
  }
}

export function disallowReadonlyMode(readonly: boolean) {
  if (readonly) {
    throw new NotAllowedError('This operation not allowed in readonly mode');
  }
}

export function isQueryEntitiesInitialRequest(
  input: QueryEntitiesRequest | undefined,
): input is QueryEntitiesInitialRequest {
  if (!input) {
    return false;
  }
  return !isQueryEntitiesCursorRequest(input);
}

export function isQueryEntitiesCursorRequest(
  input: QueryEntitiesRequest | undefined,
): input is QueryEntitiesCursorRequest {
  if (!input) {
    return false;
  }
  return !!(input as QueryEntitiesCursorRequest).cursor;
}

const entityFilterParser: z.ZodSchema<EntityFilter> = z.lazy(() =>
  z
    .object({
      key: z.string(),
      values: z.array(z.string()).optional(),
    })
    .or(z.object({ not: entityFilterParser }))
    .or(z.object({ anyOf: z.array(entityFilterParser) }))
    .or(z.object({ allOf: z.array(entityFilterParser) })),
);

export const cursorParser: z.ZodSchema<Cursor> = z.object({
  orderFields: z.array(
    z.object({ field: z.string(), order: z.enum(['asc', 'desc']) }),
  ),
  fullTextFilter: z
    .object({
      term: z.string(),
      fields: z.array(z.string()).optional(),
    })
    .optional(),
  orderFieldValues: z.array(z.string().or(z.null())),
  filter: entityFilterParser.optional(),
  isPrevious: z.boolean(),
  query: z.string().optional(),
  firstSortFieldValues: z.array(z.string().or(z.null())).optional(),
  totalItems: z.number().optional(),
});

export function encodeCursor(cursor: Cursor) {
  const json = JSON.stringify(cursor);
  return Buffer.from(json, 'utf8').toString('base64');
}

export function decodeCursor(encodedCursor: string) {
  try {
    const data = Buffer.from(encodedCursor, 'base64').toString('utf8');
    const result = cursorParser.safeParse(JSON.parse(data));

    if (!result.success) {
      throw new InputError(`Malformed cursor: ${result.error}`);
    }
    return result.data;
  } catch (e) {
    throw new InputError(`Malformed cursor: ${e}`);
  }
}

// TODO(freben): This is added as a compatibility guarantee, until we can be
// sure that all adopters have re-stitched their entities so that the new
// targetRef field is present on them, and that they have stopped consuming
// the now-removed old field
// TODO(patriko): Remove this in catalog 2.0
export function expandLegacyCompoundRelationsInEntity(entity: Entity): Entity {
  if (entity.relations) {
    for (const relation of entity.relations as any) {
      if (!relation.targetRef && relation.target) {
        // This is the case where an old-form entity, not yet stitched with
        // the updated code, was in the database
        relation.targetRef = stringifyEntityRef(relation.target);
      } else if (!relation.target && relation.targetRef) {
        // This is the case where a new-form entity, stitched with the
        // updated code, was in the database but we still want to produce
        // the old data shape as well for compatibility reasons
        relation.target = parseEntityRef(relation.targetRef);
      }
    }
  }
  return entity;
}
