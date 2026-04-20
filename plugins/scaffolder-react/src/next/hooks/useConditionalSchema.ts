/*
 * Copyright 2024 The Backstage Authors
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
import { useMemo, useRef } from 'react';
import { JsonObject } from '@backstage/types';
import { resolveConditionalSchema } from '../lib';

/**
 * Reactively resolves conditional JSON Schema keywords (if/then/else, dependencies)
 * against the current form data. Returns a structurally-stable resolved schema
 * that only changes its object reference when the resolved output is
 * structurally different from the previous resolution.
 *
 * Structural stability is critical because `resolveConditionalSchema` always
 * returns a new object (via deep clone). Without equality comparison, RJSF
 * would receive a new `schema` prop reference on every `formData` change,
 * triggering an infinite re-render loop:
 *   new schema ref → RJSF re-render → onChange → stepsState update →
 *   new formData ref → useMemo recomputes → new schema ref → …
 *
 * The hook breaks this loop by caching the previous resolved schema and its
 * JSON serialization. When a new resolution produces an identical serialization,
 * the previous object reference is returned, preventing unnecessary RJSF
 * re-renders.
 *
 * @param schema - The JSON Schema potentially containing conditional keywords, or undefined
 * @param formData - The current form data to evaluate conditions against
 * @returns A resolved schema with active conditional branches merged in, or undefined if schema is undefined
 * @alpha
 */
export const useConditionalSchema = (
  schema: JsonObject | undefined,
  formData: JsonObject,
): JsonObject | undefined => {
  const cacheRef = useRef<{
    result: JsonObject | undefined;
    serialized: string;
  }>({
    result: undefined,
    serialized: '',
  });

  // Compute the resolved schema whenever the schema definition or form data
  // reference changes. This is a pure computation with no side effects.
  const resolved = useMemo(
    () => (schema ? resolveConditionalSchema(schema, formData) : undefined),
    [schema, formData],
  );

  // Structural equality check: serialize the resolved schema and compare
  // with the cached serialization. Return the cached reference when the
  // structure has not changed to avoid triggering downstream re-renders.
  const serialized =
    resolved !== undefined ? JSON.stringify(resolved) : '';

  if (serialized !== cacheRef.current.serialized) {
    cacheRef.current = { result: resolved, serialized };
  }

  return cacheRef.current.result;
};
