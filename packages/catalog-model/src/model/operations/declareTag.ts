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
 * Declare the existence of a well-known tag and its properties.
 */
export const opDeclareTagV1Schema = z.strictObject({
  op: z.literal('declareTag.v1'),
  /**
   * The name of the tag, e.g. "java".
   */
  name: z.string(),

  /**
   * The properties that apply to this tag.
   */
  properties: z.strictObject({
    /**
     * A human-readable title that can be used for display purposes instead of
     * the technical name.
     */
    title: z.string().optional(),
    /**
     * A human-readable description of the tag.
     */
    description: z.string(),
  }),
});

/** {@inheritDoc opDeclareTagV1Schema} */
export type OpDeclareTagV1 = z.infer<typeof opDeclareTagV1Schema>;

/**
 * Creates a validated {@link OpDeclareTagV1} operation instance.
 *
 * @remarks
 *
 * The `op` field is filled in automatically. The input is verified against the
 * schema before returning, ensuring that the resulting op is reliably valid.
 *
 * @param input - All fields of the op except `op` itself.
 * @returns A fully validated {@link OpDeclareTagV1}.
 */
export function createDeclareTagOp(
  input: Omit<OpDeclareTagV1, 'op'> & { op?: never },
): OpDeclareTagV1 {
  return opDeclareTagV1Schema.parse({
    ...input,
    op: 'declareTag.v1',
  });
}
