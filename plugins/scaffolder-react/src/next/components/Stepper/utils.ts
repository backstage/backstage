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
import type { FieldValidation } from '@rjsf/utils';
import { FormValidation } from './createAsyncValidators';
import type { ParsedTemplateSchema } from '../../hooks/useTemplateSchema';
import { findSchemaForKey } from '../ReviewState/util';

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

export function filterReviewState(
  formState: JsonObject,
  visibleSteps: ParsedTemplateSchema[],
  hiddenSteps: ParsedTemplateSchema[],
): JsonObject {
  if (!hiddenSteps.length) {
    return formState;
  }

  function filterValue(
    value: JsonValue | undefined,
    path: string,
  ): JsonValue | undefined {
    if (
      !findSchemaForKey(path, visibleSteps, formState) &&
      findSchemaForKey(path, hiddenSteps, formState)
    ) {
      return undefined;
    }
    if (Array.isArray(value)) {
      // Keep array positions intact when an item is omitted from review.
      return value.map(
        (item, index) => filterValue(item, `${path}/${index}`) ?? null,
      );
    }
    return isObject(value) ? filterObject(value, path) : value;
  }

  function filterObject(value: JsonObject, parent?: string): JsonObject {
    return Object.fromEntries(
      Object.entries(value).flatMap(([key, entry]) => {
        const pointerKey = key.replace(/~/g, '~0').replace(/\//g, '~1');
        const path =
          parent === undefined ? pointerKey : `${parent}/${pointerKey}`;
        const filtered = filterValue(entry, path);
        return filtered === undefined ? [] : [[key, filtered]];
      }),
    );
  }

  return filterObject(formState);
}
