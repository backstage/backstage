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
 * Mark a field as a source of relations. The field is expected to be a string
 * or string array.
 */
export const opDeclareKindSpecFieldV1Schema = z.object({
  op: z.literal('declareKindSpecField.v1'),

  /**
   * The kind that this field belongs to.
   */
  kind: z.string(),
  /**
   * The API version that this declaration applies to.
   */
  apiVersion: z.string(),
  /**
   * The `spec.type` that this applies to.
   *
   * @remarks
   *
   * This can be used to make kinds whose spec effectively are discriminated
   * unions. If you don't specify this, the field will apply to a spec that has
   * no type given at all, or to those where the type is not among the set of
   * any other known declared spec types.
   */
  specType: z.string().optional(),
  /**
   * The path to the field.
   *
   * @remarks
   *
   * Each element in the path is a key of an object. Example: `["spec", "owner"]`.
   */
  path: z.array(z.string()).readonly(),

  /**
   * The properties that apply to this field.
   */
  properties: z.object({
    /**
     * Short description of the kind.
     */
    description: z.string(),
    /**
     * The schema of the field.
     */
    schema: z.object({
      jsonSchema: z.record(z.string(), z.unknown()),
    }),
    /**
     * Declares whether this field generates relations.
     *
     * @remarks
     *
     * It's expected that the actual field value is a string or array of
     * strings at runtime, for this to work.
     *
     * The actual meta properties of the relations are declared separately with
     * the `declareRelation.v1` operation.
     */
    generatesRelations: z.union([
      z.literal(false),
      z.object({
        /**
         * The technical type of the relation, e.g. "ownedBy".
         */
        type: z.string(),
        /**
         * If the given shorthand ref did not have a kind, use this kind as the
         * default. If no default kind is specified, the ref must contain a kind.
         */
        defaultKind: z.string().optional(),
        /**
         * If the given shorthand ref did not have a namespace, either inherit the
         * namespace of the entity itself, or choose the default namespace.
         */
        defaultNamespace: z.enum(['default', 'inherit']),
        /**
         * Only allow relations to be specified to the given kinds. This list must
         * include the default kind, if any.
         */
        allowedKinds: z.array(z.string()).optional(),
      }),
    ]),
  }),
});

/** {@inheritDoc opDeclareKindSpecFieldV1Schema} */
export type OpDeclareKindSpecFieldV1 = z.infer<
  typeof opDeclareKindSpecFieldV1Schema
>;
