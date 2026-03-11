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
import {
  createZodV3FilterPredicateSchema,
  FilterPredicate,
} from '@backstage/filter-predicates';
import { Request } from 'express';
import { z } from 'zod/v3';
import { fromZodError } from 'zod-validation-error/v3';

const filterPredicateSchema = createZodV3FilterPredicateSchema(z);

const schema = z.object({
  entityRefs: z.array(z.string()),
  fields: z.array(z.string()).optional(),
  query: filterPredicateSchema.optional(),
});

export interface ParsedEntitiesBatchRequest {
  entityRefs: string[];
  fields?: string[];
  query?: FilterPredicate;
}

export function entitiesBatchRequest(req: Request): ParsedEntitiesBatchRequest {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    throw new InputError(
      `Malformed request body (did you remember to specify an application/json content type?), ${fromZodError(
        result.error,
      )}`,
    );
  }
  return result.data;
}
