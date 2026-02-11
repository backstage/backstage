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

import { InputError } from '@backstage/errors';
import { fromZodError } from 'zod-validation-error/v3';
import * as zodV3 from 'zod/v3';
import {
  FilterPredicate,
  FilterPredicateExpression,
  FilterPredicatePrimitive,
  FilterPredicateValue,
} from './types';

/**
 * Create a Zod schema for validating filter predicates.
 *
 * @public
 */
export function createZodV3FilterPredicateSchema(
  z: typeof zodV3.z,
): zodV3.ZodType<FilterPredicate> {
  const primitiveSchema = z.union([
    z.string(),
    z.number(),
    z.boolean(),
  ]) as zodV3.ZodType<FilterPredicatePrimitive>;

  // eslint-disable-next-line prefer-const
  let valuePredicateSchema: zodV3.ZodType<FilterPredicateValue>;

  const expressionSchema = z.lazy(() =>
    z.union([
      z.record(z.string().regex(/^(?!\$).*$/), valuePredicateSchema),
      z.record(z.string().regex(/^\$/), z.never()),
    ]),
  ) as zodV3.ZodType<FilterPredicateExpression>;

  const predicateSchema = z.lazy(() =>
    z.union([
      expressionSchema,
      primitiveSchema,
      z.object({ $all: z.array(predicateSchema) }),
      z.object({ $any: z.array(predicateSchema) }),
      z.object({ $not: predicateSchema }),
    ]),
  ) as zodV3.ZodType<FilterPredicate>;

  valuePredicateSchema = z.union([
    primitiveSchema,
    z.object({ $exists: z.boolean() }),
    z.object({ $in: z.array(primitiveSchema) }),
    z.object({ $contains: predicateSchema }),
  ]) as zodV3.ZodType<FilterPredicateValue>;

  return predicateSchema;
}

/**
 * Parses a value to check that it's a valid filter predicate.
 *
 * @public
 * @param value - The value to parse.
 * @returns A valid filter predicate.
 * @throws An error if the value is not a valid filter predicate.
 */
export function parseFilterPredicate(value: unknown): FilterPredicate {
  const schema = createZodV3FilterPredicateSchema(zodV3.z);
  const result = schema.safeParse(value);
  if (!result.success) {
    throw new InputError(
      `Invalid filter predicate: ${fromZodError(result.error)}`,
    );
  }
  return result.data;
}
