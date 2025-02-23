/*
 * Copyright 2025 The Backstage Authors
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

import { EntityPredicate, EntityPredicateValue } from '.';
import type { z as zImpl, ZodType } from 'zod';

/** @internal */
export function createEntityPredicateSchema(z: typeof zImpl) {
  const primitiveSchema = z.union([z.string(), z.number(), z.boolean()]);

  const filterValueSchema = z.union([
    primitiveSchema,
    z.array(primitiveSchema),
    z.object({ $exists: z.boolean() }),
    z.object({ $eq: z.union([primitiveSchema, z.array(primitiveSchema)]) }),
    z.object({ $ne: z.union([primitiveSchema, z.array(primitiveSchema)]) }),
    z.object({ $in: z.array(primitiveSchema) }),
    z.object({ $nin: z.array(primitiveSchema) }),
    z.object({ $all: z.array(primitiveSchema) }),
    z.object({ $elemMatch: z.lazy(() => z.record(filterValueSchema)) }),
  ]) as ZodType<EntityPredicateValue>;

  const filterSchema = z.lazy(() =>
    z.union([
      z.object({ $and: z.array(filterSchema) }),
      z.object({ $or: z.array(filterSchema) }),
      z.object({ $not: filterSchema }),
      z.record(z.string().regex(/^(?!\$).*$/), filterValueSchema),
    ]),
  ) as ZodType<EntityPredicate>;

  return filterSchema;
}
