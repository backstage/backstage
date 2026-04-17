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
 * Update the properties of a certain relation type between a given pair of
 * kinds.
 *
 * @remarks
 *
 * Note that this is NOT the same as updating the properties of a certain field
 * that is a relation type - it updates the properties of a relation that was
 * generated between two kinds for any reason.
 */
export const opUpdateRelationV1Schema = z.strictObject({
  op: z.literal('updateRelation.v1'),

  /**
   * The kind that this relation originates from, e.g. "Component".
   */
  fromKind: z.string(),
  /**
   * The technical type of the relation, e.g. "ownedBy".
   */
  type: z.string(),
  /**
   * The kind that this relation points to, e.g. "Group".
   */
  toKind: z.string(),

  /**
   * The properties that apply to this relation.
   */
  properties: z.strictObject({
    /**
     * The technical type of the reverse relation, e.g. "ownerOf".
     */
    reverseType: z.string().optional(),
    /**
     * A human-readable title for the relation type, e.g. "owned by".
     */
    title: z.string().optional(),
    /**
     * A human-readable description of the relation.
     */
    description: z.string().optional(),
  }),
});

/** {@inheritDoc opUpdateRelationV1Schema} */
export type OpUpdateRelationV1 = z.infer<typeof opUpdateRelationV1Schema>;

/**
 * Creates a validated {@link OpUpdateRelationV1} operation instance.
 *
 * @remarks
 *
 * The `op` field is filled in automatically. The input is verified against the
 * schema before returning, ensuring that the resulting op is reliably valid.
 *
 * @param input - All fields of the op except `op` itself.
 * @returns A fully validated {@link OpUpdateRelationV1}.
 */
export function createUpdateRelationOp(
  input: Omit<OpUpdateRelationV1, 'op'> & { op?: never },
): OpUpdateRelationV1 {
  return opUpdateRelationV1Schema.parse({
    ...input,
    op: 'updateRelation.v1',
  });
}
