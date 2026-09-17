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
 * Make a declaration about the properties of a certain kind.
 */
export const opUpdateKindV1Schema = z.strictObject({
  op: z.literal('updateKind.v1'),

  /**
   * The kind to update, e.g. "Component".
   */
  kind: z.string(),

  /**
   * Updated properties that apply for this kind
   */
  properties: z.strictObject({
    /**
     * The singular form of the human-readable kind, e.g. "component".
     */
    singular: z.string().optional(),
    /**
     * The plural form of the human-readable kind, e.g. "components".
     */
    plural: z.string().optional(),
    /**
     * Short description of the kind.
     */
    description: z.string().optional(),
  }),
});

/** {@inheritDoc opUpdateKindV1Schema} */
export type OpUpdateKindV1 = z.infer<typeof opUpdateKindV1Schema>;

/**
 * Creates a validated {@link OpUpdateKindV1} operation instance.
 *
 * @remarks
 *
 * The `op` field is filled in automatically. The input is verified against the
 * schema before returning, ensuring that the resulting op is reliably valid.
 *
 * @param input - All fields of the op except `op` itself.
 * @returns A fully validated {@link OpUpdateKindV1}.
 */
export function createUpdateKindOp(
  input: Omit<OpUpdateKindV1, 'op'> & { op?: never },
): OpUpdateKindV1 {
  return opUpdateKindV1Schema.parse({ ...input, op: 'updateKind.v1' });
}
