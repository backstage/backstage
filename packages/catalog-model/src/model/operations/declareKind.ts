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
export const opDeclareKindV1Schema = z.strictObject({
  op: z.literal('declareKind.v1'),

  /**
   * The kind to declare, e.g. "Component".
   */
  kind: z.string(),
  /**
   * The apiVersion group of the kind, e.g. "backstage.io".
   */
  group: z.string(),

  /**
   * Properties that apply for this kind
   */
  properties: z.strictObject({
    /**
     * The singular form of the human-readable kind, e.g. "component".
     */
    singular: z.string(),
    /**
     * The plural form of the human-readable kind, e.g. "components".
     */
    plural: z.string(),
    /**
     * Short description of the kind.
     */
    description: z.string(),
  }),
});

/** {@inheritDoc opDeclareKindV1Schema} */
export type OpDeclareKindV1 = z.infer<typeof opDeclareKindV1Schema>;

/**
 * Creates a validated {@link OpDeclareKindV1} operation instance.
 *
 * @remarks
 *
 * The `op` field is filled in automatically. The input is verified against the
 * schema before returning, ensuring that the resulting op is reliably valid.
 *
 * @param input - All fields of the op except `op` itself.
 * @returns A fully validated {@link OpDeclareKindV1}.
 */
export function createDeclareKindOp(
  input: Omit<OpDeclareKindV1, 'op'> & { op?: never },
): OpDeclareKindV1 {
  return opDeclareKindV1Schema.parse({ ...input, op: 'declareKind.v1' });
}
