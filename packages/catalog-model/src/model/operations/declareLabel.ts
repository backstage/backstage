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
 * Declare the existence of a well-known label and its properties.
 */
export const opDeclareLabelV1Schema = z.strictObject({
  op: z.literal('declareLabel.v1'),
  /**
   * The name of the label, e.g. "backstage.io/source-location".
   */
  name: z.string(),

  /**
   * The properties that apply to this label.
   */
  properties: z.strictObject({
    /**
     * A human-readable title that can be used for display purposes instead of
     * the technical name.
     */
    title: z.string().optional(),
    /**
     * A human-readable description of the label.
     */
    description: z.string(),
    /**
     * The JSON schema that values of this label must conform to.
     *
     * @remarks
     *
     * If not provided, the label is assumed to be a simple string with no
     * particular schema.
     */
    schema: z
      .strictObject({
        jsonSchema: jsonSchemaSchema,
      })
      .optional(),
  }),
});

/** {@inheritDoc opDeclareLabelV1Schema} */
export type OpDeclareLabelV1 = z.infer<typeof opDeclareLabelV1Schema>;

/**
 * Creates a validated {@link OpDeclareLabelV1} operation instance.
 *
 * @remarks
 *
 * The `op` field is filled in automatically. The input is verified against the
 * schema before returning, ensuring that the resulting op is reliably valid.
 *
 * @param input - All fields of the op except `op` itself.
 * @returns A fully validated {@link OpDeclareLabelV1}.
 */
export function createDeclareLabelOp(
  input: Omit<OpDeclareLabelV1, 'op'> & { op?: never },
): OpDeclareLabelV1 {
  return opDeclareLabelV1Schema.parse({
    ...input,
    op: 'declareLabel.v1',
  });
}
