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
import { customizeValidator } from '@rjsf/validator-ajv8';
import ajvErrors from 'ajv-errors';
import { FormValidation } from './createAsyncValidators';
import type { ParsedTemplateSchema } from '../../hooks/useTemplateSchema';

export const validator = customizeValidator();
ajvErrors(validator.ajv);

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

type OwnershipContext = {
  root: JsonObject;
  activeOnly: boolean;
  data?: JsonValue;
};

// Inspect declared fields without inferring schemas from retained values.
// Visible steps use active branches; hidden steps include inactive branches.
function declaresPath(
  schema: JsonValue | undefined,
  path: string[],
  context: OwnershipContext,
  visited = new Set<JsonObject>(),
): boolean {
  if (!isObject(schema) || visited.has(schema)) {
    return false;
  }
  visited.add(schema);
  const [key, ...rest] = path;
  let childData: JsonValue | undefined;
  if (Array.isArray(context.data)) {
    childData = context.data[Number(key)];
  } else if (isObject(context.data)) {
    childData = context.data[key];
  }
  const ownsChild = (child: JsonValue | undefined) =>
    child !== undefined &&
    (rest.length === 0 ||
      declaresPath(child, rest, { ...context, data: childData }));

  const explicitProperty =
    isObject(schema.properties) &&
    Object.prototype.hasOwnProperty.call(schema.properties, key);
  if (
    explicitProperty &&
    isObject(schema.properties) &&
    ownsChild(schema.properties[key])
  ) {
    return true;
  }
  if (/^(0|[1-9]\d*)$/.test(key)) {
    const item = Array.isArray(schema.items)
      ? schema.items[Number(key)] ?? schema.additionalItems
      : schema.items;
    if (ownsChild(item)) {
      return true;
    }
  }
  const patterns = isObject(schema.patternProperties)
    ? Object.entries(schema.patternProperties).filter(([pattern]) =>
        new RegExp(pattern).test(key),
      )
    : [];
  if (patterns.some(([, child]) => ownsChild(child))) {
    return true;
  }
  if (
    !explicitProperty &&
    patterns.length === 0 &&
    (schema.additionalProperties === true ||
      (isObject(schema.additionalProperties) &&
        ownsChild(schema.additionalProperties)))
  ) {
    return true;
  }

  const reference = schema.$ref;
  if (
    typeof reference === 'string' &&
    (reference === '#' || reference.startsWith('#/'))
  ) {
    let target: JsonValue | undefined = context.root;
    const segments = reference === '#' ? [] : reference.slice(2).split('/');
    for (const segment of segments) {
      const name = decodeURIComponent(segment)
        .replace(/~1/g, '/')
        .replace(/~0/g, '~');
      if (Array.isArray(target)) {
        target = target[Number(name)];
      } else {
        target = isObject(target) ? target[name] : undefined;
      }
    }
    if (declaresPath(target, path, context, visited)) {
      return true;
    }
  }

  for (const keyword of ['allOf', 'anyOf', 'oneOf']) {
    const branches = schema[keyword];
    if (
      Array.isArray(branches) &&
      branches.some(
        branch =>
          (!context.activeOnly ||
            keyword === 'allOf' ||
            (isObject(branch) &&
              validator.isValid(branch, context.data ?? {}, context.root))) &&
          declaresPath(branch, path, context, visited),
      )
    ) {
      return true;
    }
  }
  let conditionalBranches = [schema.then, schema.else];
  if (context.activeOnly) {
    const condition = schema.if;
    const matchesCondition =
      condition === true ||
      (isObject(condition) &&
        validator.isValid(condition, context.data ?? {}, context.root));
    conditionalBranches =
      condition === undefined
        ? []
        : [schema[matchesCondition ? 'then' : 'else']];
  }
  if (
    conditionalBranches.some(branch =>
      declaresPath(branch, path, context, visited),
    )
  ) {
    return true;
  }
  for (const keyword of ['dependencies', 'dependentSchemas']) {
    const dependencies = schema[keyword];
    if (
      isObject(dependencies) &&
      Object.entries(dependencies).some(
        ([trigger, branch]) =>
          (!context.activeOnly ||
            (isObject(context.data) &&
              Object.prototype.hasOwnProperty.call(context.data, trigger))) &&
          declaresPath(branch, path, context, visited),
      )
    ) {
      return true;
    }
  }
  return false;
}

export function filterReviewState(
  formState: JsonObject,
  visibleSteps: ParsedTemplateSchema[],
  hiddenSteps: ParsedTemplateSchema[],
): JsonObject {
  if (!hiddenSteps.length) {
    return formState;
  }
  const ownsPath = (
    steps: ParsedTemplateSchema[],
    path: string[],
    activeOnly: boolean,
  ) =>
    steps.some(({ mergedSchema }) =>
      declaresPath(mergedSchema, path, {
        root: mergedSchema,
        data: formState,
        activeOnly,
      }),
    );

  function filterValue(
    value: JsonValue | undefined,
    path: string[],
  ): JsonValue | undefined {
    if (
      !ownsPath(visibleSteps, path, true) &&
      ownsPath(hiddenSteps, path, false)
    ) {
      return undefined;
    }
    if (Array.isArray(value)) {
      // Keep array positions intact when an item is omitted from review.
      return value.map(
        (item, index) => filterValue(item, [...path, String(index)]) ?? null,
      );
    }
    return isObject(value) ? filterObject(value, path) : value;
  }

  function filterObject(value: JsonObject, parent: string[] = []): JsonObject {
    return Object.fromEntries(
      Object.entries(value).flatMap(([key, entry]) => {
        const filtered = filterValue(entry, [...parent, key]);
        return filtered === undefined ? [] : [[key, filtered]];
      }),
    );
  }
  return filterObject(formState);
}
