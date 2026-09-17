/*
 * Copyright 2026 The Backstage Authors
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

import { JsonObject } from '@backstage/types';
import { z } from 'zod/v3';
import { CatalogModelKindRootSchema } from './validateKindRootSchemaSemantics';

/**
 * The expected shape of the standard full kind schemas, which use an allOf
 * with a $ref to Entity and a second element with the kind-specific schema.
 */
const fullKindSchema = z
  .object({
    allOf: z.tuple([
      z.object({ $ref: z.literal('Entity') }),
      z
        .object({
          type: z.literal('object'),
          properties: z
            .object({
              apiVersion: z.record(z.string(), z.unknown()).optional(),
              kind: z.record(z.string(), z.unknown()).optional(),
            })
            .passthrough(),
        })
        .passthrough(),
    ]),
  })
  .passthrough();

/**
 * Reduces a full kind JSON schema to the form expected by the catalog model
 * layer system. The full schemas use an allOf with a $ref to Entity and
 * kind/apiVersion constraints that are not needed in the reduced form.
 *
 * If the schema does not match the expected shape, it is returned unchanged.
 */
export function reduceKindSchema(
  schema: JsonObject,
): CatalogModelKindRootSchema {
  const parsed = fullKindSchema.safeParse(schema);
  if (!parsed.success) {
    return schema as CatalogModelKindRootSchema;
  }

  const { allOf, ...rest } = parsed.data;
  const { type, properties: allProperties, ...kindRest } = allOf[1];
  const { apiVersion, kind, ...properties } = allProperties;

  return {
    ...rest,
    type,
    ...kindRest,
    properties,
  } as CatalogModelKindRootSchema;
}
