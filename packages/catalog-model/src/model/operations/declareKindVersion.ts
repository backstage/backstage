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

const relationFieldSchema = z.strictObject({
  /**
   * What field that shall be used to generate relations.
   *
   * @remarks
   *
   * The field value is expected to be a string or string array at runtime.
   */
  selector: z.strictObject({
    /**
     * A dot separated path on the common catalog form, e.g. `spec.owner`.
     */
    path: z.string(),
  }),
  /**
   * The relation type that this field generates, e.g. "ownedBy".
   */
  relation: z.string(),
  /**
   * If the given shorthand ref did not have a kind, use this kind as the
   * default. If no default kind is specified, the ref must contain a kind.
   */
  defaultKind: z.string().optional(),
  /**
   * If the given shorthand ref did not have a namespace, either inherit the
   * namespace of the entity itself, or choose the default namespace.
   */
  defaultNamespace: z.enum(['default', 'inherit']).optional(),
  /**
   * Only allow relations to be specified to the given kinds. This list must
   * include the default kind, if any. If no allowed kinds are specified,
   * all kinds are allowed.
   */
  allowedKinds: z.array(z.string()).optional(),
});

/**
 * Make a declaration about the version of a certain kind.
 */
export const opDeclareKindVersionV1Schema = z.strictObject({
  op: z.literal('declareKindVersion.v1'),

  /**
   * The kind that this version belongs to.
   */
  kind: z.string(),
  /**
   * The specific version name, e.g. "v1alpha1". This and the kind group form
   * the full apiVersion.
   */
  name: z.string(),
  /**
   * The spec type that this version applies to, if any.
   *
   * @remarks
   *
   * This can be used to make kinds whose spec effectively are discriminated
   * unions. If you don't specify this, the schema will apply to a spec that has
   * no type given at all, or to those where the type is not among the set of
   * any other known declared spec types.
   */
  specType: z.string().optional(),

  /**
   * The properties that apply to this version.
   */
  properties: z.strictObject({
    /**
     * A short description of this particular version (and type, where applicable).
     */
    description: z.string().optional(),

    /**
     * The fields that shall be used to generate relations, if any.
     */
    relationFields: z.array(relationFieldSchema).optional(),

    /**
     * The JSON schema of the version.
     */
    schema: z.strictObject({
      jsonSchema: jsonSchemaSchema,
    }),
  }),
});

/** {@inheritDoc opDeclareKindVersionV1Schema} */
export type OpDeclareKindVersionV1 = z.infer<
  typeof opDeclareKindVersionV1Schema
>;

/**
 * Creates a validated {@link OpDeclareKindVersionV1} operation instance.
 *
 * @remarks
 *
 * The `op` field is filled in automatically. The input is verified against the
 * schema before returning, ensuring that the resulting op is reliably valid.
 *
 * @param input - All fields of the op except `op` itself.
 * @returns A fully validated {@link OpDeclareKindVersionV1}.
 */
export function createDeclareKindVersionOp(
  input: Omit<OpDeclareKindVersionV1, 'op'> & { op?: never },
): OpDeclareKindVersionV1 {
  return opDeclareKindVersionV1Schema.parse({
    ...input,
    op: 'declareKindVersion.v1',
  });
}
