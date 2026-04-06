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
import { useMemo } from 'react';
import { JsonObject } from '@backstage/types';
import { resolveConditionalSchema } from '../lib';

/**
 * Reactively resolves conditional JSON Schema keywords (if/then/else, dependencies)
 * against the current form data. Returns a memoized resolved schema that only
 * recomputes when the schema or formData reference changes.
 *
 * This hook wraps the pure `resolveConditionalSchema()` utility with React
 * memoization for efficient use in component render cycles.
 *
 * @param schema - The JSON Schema potentially containing conditional keywords
 * @param formData - The current form data to evaluate conditions against
 * @returns A resolved schema with active conditional branches merged in
 * @alpha
 */
export const useConditionalSchema = (
  schema: JsonObject,
  formData: JsonObject,
): JsonObject => {
  return useMemo(
    () => resolveConditionalSchema(schema, formData),
    [schema, formData],
  );
};
