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

import { z } from 'zod/v3';
import { jsonSchemaSchema } from '../jsonSchema/zod';

/**
 * Update the properties of an existing annotation.
 */
export const opUpdateAnnotationV1Schema = z.strictObject({
  op: z.literal('updateAnnotation.v1'),

  /**
   * The name of the annotation, e.g. "backstage.io/techdocs-ref".
   */
  name: z.string(),

  /**
   * The properties that apply to this annotation.
   */
  properties: z.strictObject({
    /**
     * A human-readable title that can be used for display purposes instead of
     * the technical name.
     */
    title: z.string().optional(),
    /**
     * A human-readable description of the annotation.
     */
    description: z.string().optional(),
    /**
     * The JSON schema that values of this annotation must conform to.
     *
     * @remarks
     *
     * If not provided, the annotation is assumed to be a simple string with no
     * particular schema.
     */
    schema: z
      .strictObject({
        jsonSchema: jsonSchemaSchema,
      })
      .optional(),
  }),
});

/** {@inheritDoc opUpdateAnnotationV1Schema} */
export type OpUpdateAnnotationV1 = z.infer<typeof opUpdateAnnotationV1Schema>;

/**
 * Creates a validated {@link OpUpdateAnnotationV1} operation instance.
 *
 * @remarks
 *
 * The `op` field is filled in automatically. The input is verified against the
 * schema before returning, ensuring that the resulting op is reliably valid.
 *
 * @param input - All fields of the op except `op` itself.
 * @returns A fully validated {@link OpUpdateAnnotationV1}.
 */
export function createUpdateAnnotationOp(
  input: Omit<OpUpdateAnnotationV1, 'op'> & { op?: never },
): OpUpdateAnnotationV1 {
  return opUpdateAnnotationV1Schema.parse({
    ...input,
    op: 'updateAnnotation.v1',
  });
}
