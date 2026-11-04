/*
 * Copyright 2023 The Backstage Authors
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
import type { JsonObject, JsonValue } from '@backstage/types';
import {
  retrieveSchema,
  type FieldValidation,
  type RJSFSchema,
  type ValidatorType,
} from '@rjsf/utils';
import { cloneDeep } from 'lodash';
import { FormValidation } from './createAsyncValidators';

function isFieldValidation(error: any): error is FieldValidation {
  return !!error && '__errors' in error;
}

export function hasErrors(errors?: FormValidation): boolean {
  if (!errors) {
    return false;
  }

  for (const error of Object.values(errors)) {
    if (isFieldValidation(error)) {
      if ((error.__errors ?? []).length > 0) {
        return true;
      }

      continue;
    }

    if (hasErrors(error)) {
      return true;
    }
  }

  return false;
}

export function isObject(value: JsonValue | undefined): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// Capture only the inputs described by a step, using its active schema branches.
// Custom fields and opaque objects receive their complete value as validator input.
export function getValidationData(
  schema: JsonObject,
  formData: JsonObject,
  validator: ValidatorType,
): JsonObject {
  function project(
    currentSchema: RJSFSchema,
    data: JsonValue,
    root = false,
  ): JsonValue {
    if (!isObject(data)) return cloneDeep(data);
    const resolved = retrieveSchema(validator, currentSchema, schema, data);
    if (
      (!root && (resolved['ui:field'] || !resolved.properties)) ||
      resolved.additionalProperties ||
      resolved.patternProperties
    ) {
      return cloneDeep(data);
    }
    const triggers =
      currentSchema.if && typeof currentSchema.if === 'object'
        ? currentSchema.if.properties
        : undefined;
    const keys = new Set([
      ...Object.keys(resolved.properties ?? {}),
      ...(resolved.required ?? []),
      ...Object.keys(currentSchema.dependencies ?? {}),
      ...Object.keys(currentSchema.dependentSchemas ?? {}),
      ...Object.keys(triggers ?? {}),
    ]);
    return Object.fromEntries(
      [...keys]
        .filter(key => Object.hasOwn(data, key))
        .map(key => {
          const property = resolved.properties?.[key];
          return [
            key,
            property && typeof property === 'object'
              ? project(property, data[key] as JsonValue)
              : cloneDeep(data[key]),
          ];
        }),
    );
  }
  return project(schema, formData, true) as JsonObject;
}
