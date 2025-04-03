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

  const comparableValueSchema = z.union([
    primitiveSchema,
    z.array(primitiveSchema),
  ]);

  // eslint-disable-next-line prefer-const
  let valuePredicateSchema: ZodType<EntityPredicateValue>;

  const predicateSchema = z.lazy(() =>
    z.union([
      comparableValueSchema,
      z.object({ $all: z.array(predicateSchema) }),
      z.object({ $any: z.array(predicateSchema) }),
      z.object({ $not: predicateSchema }),
      z.record(z.string().regex(/^(?!\$).*$/), valuePredicateSchema),
    ]),
  ) as ZodType<EntityPredicate>;

  valuePredicateSchema = z.union([
    comparableValueSchema,
    z.object({ $exists: z.boolean() }),
    z.object({ $in: z.array(primitiveSchema) }),
    z.object({ $contains: predicateSchema }),
  ]) as ZodType<EntityPredicateValue>;

  return predicateSchema;
}
