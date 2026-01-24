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

import {
  EntityPredicate,
  EntityPredicateExpression,
  EntityPredicatePrimitive,
  EntityPredicateValue,
} from './types';
import type { z as zImpl, ZodType } from 'zod';

/** @internal */
export function createEntityPredicateSchema(z: typeof zImpl) {
  const primitiveSchema = z.union([
    z.string(),
    z.number(),
    z.boolean(),
  ]) as ZodType<EntityPredicatePrimitive>;

  // eslint-disable-next-line prefer-const
  let valuePredicateSchema: ZodType<EntityPredicateValue>;

  const expressionSchema = z.lazy(() =>
    z.union([
      z.record(z.string().regex(/^(?!\$).*$/), valuePredicateSchema),
      z.record(z.string().regex(/^\$/), z.never()),
    ]),
  ) as ZodType<EntityPredicateExpression>;

  const predicateSchema = z.lazy(() =>
    z.union([
      expressionSchema,
      primitiveSchema,
      z.object({ $all: z.array(predicateSchema) }),
      z.object({ $any: z.array(predicateSchema) }),
      z.object({ $not: predicateSchema }),
    ]),
  ) as ZodType<EntityPredicate>;

  valuePredicateSchema = z.union([
    primitiveSchema,
    z.object({ $exists: z.boolean() }),
    z.object({ $in: z.array(primitiveSchema) }),
    z.object({ $contains: predicateSchema }),
  ]) as ZodType<EntityPredicateValue>;

  return predicateSchema;
}
