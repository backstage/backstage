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

/**
 * Declare the existence of a well-known annotation and its properties.
 */
export const opDeclareAnnotationV1Schema = z.strictObject({
  op: z.literal('declareAnnotation.v1'),
  /**
   * The name of the annotation, e.g. "backstage.io/techdocs-ref".
   */
  name: z.string(),

  /**
   * The properties that apply to this annotation.
   */
  properties: z.strictObject({
    /**
     * A human-readable description of the annotation.
     */
    description: z.string(),
    /**
     * The JSON schema that values of this annotation must conform to.
     */
    schema: z.strictObject({
      jsonSchema: z.record(z.string(), z.unknown()),
    }),
  }),
});

/** {@inheritDoc opDeclareAnnotationV1Schema} */
export type OpDeclareAnnotationV1 = z.infer<typeof opDeclareAnnotationV1Schema>;

/**
 * Creates a validated {@link OpDeclareAnnotationV1} operation instance.
 *
 * @remarks
 *
 * The `op` field is filled in automatically. The input is verified against the
 * schema before returning, ensuring that the resulting op is reliably valid.
 *
 * @param input - All fields of the op except `op` itself.
 * @returns A fully validated {@link OpDeclareAnnotationV1}.
 */
export function createDeclareAnnotationOp(
  input: Omit<OpDeclareAnnotationV1, 'op'> & { op?: never },
): OpDeclareAnnotationV1 {
  return opDeclareAnnotationV1Schema.parse({
    ...input,
    op: 'declareAnnotation.v1',
  });
}
