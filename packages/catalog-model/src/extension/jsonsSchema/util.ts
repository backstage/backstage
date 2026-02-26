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

export function isJsonObject(value?: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * This is how we expect the "apiVersion" and "kind" properties to be defined.
 * They can be either a single constant string, or an array of enum values.
 *
 * @example
 *
 * ```
 * "apiVersion": { "enum": ["backstage.io/v1alpha1", "backstage.io/v1beta1"] }
 * "kind": { "const": "Component" }
 * ```
 */
export const constantOrEnumSchema = z.union([
  z.object({
    enum: z.array(z.string().min(1)).min(1),
  }),
  z.object({
    const: z.string().min(1),
  }),
]);

/**
 * Used for checking that relations are only attached to fields that are strings
 * or string arrays.
 */
export const stringOrStringArraySchema = z.union([
  z.object({
    type: z.literal('string').or(z.array(z.enum(['string'])).min(1)),
  }),
  z.object({
    type: z.literal('array').or(z.array(z.enum(['string', 'array'])).min(1)),
    items: z.object({
      type: z.literal('string').or(z.array(z.enum(['string'])).min(1)),
    }),
  }),
]);

/**
 * This is the schema of the "relation" object of string fields / array
 * elements.
 *
 * @example
 *
 * ```
 * "owner": {
 *   "type": "string",
 *   "relation": {
 *     "defaultKind": "Group",
 *     "defaultNamespace": "inherit",
 *     "outgoingType": "ownedBy",
 *     "incomingType": "ownerOf"
 *   }
 * }
 * ```
 */
export const relationSchema = z.object({
  defaultKind: z.string().optional(),
  defaultNamespace: z.enum(['default', 'inherit']).optional(),
  allowedKinds: z.array(z.string().min(1)).optional(),
  outgoingType: z.string(),
  incomingType: z.string(),
});
