/*
 * Copyright 2020 The Backstage Authors
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

import { JsonObject, JsonValue } from '@backstage/types';
import {
  ConfigVisibility,
  DEFAULT_CONFIG_VISIBILITY,
  TransformFunc,
  ValidationError,
} from './types';
import { normalizeAjvPath } from './utils';

/**
 * This filters data by visibility by discovering the visibility of each
 * value, and then only keeping the ones that are specified in `includeVisibilities`.
 */
export function filterByVisibility(
  data: JsonObject,
  includeVisibilities: ConfigVisibility[],
  visibilityByDataPath: Map<string, ConfigVisibility>,
  deepVisibilityByDataPath: Map<string, ConfigVisibility>,
  deprecationByDataPath: Map<string, string>,
  transformFunc?: TransformFunc<number | string | boolean>,
  withFilteredKeys?: boolean,
  withDeprecatedKeys?: boolean,
): {
  data: JsonObject;
  filteredKeys?: string[];
  deprecatedKeys?: { key: string; description: string }[];
} {
  const filteredKeys = new Array<string>();
  const deprecatedKeys = new Array<{ key: string; description: string }>();

  function transform(
    jsonVal: JsonValue,
    visibilityPath: string, // Matches the format we get from ajv
    filterPath: string, // Matches the format of the ConfigReader
    inheritedVisibility: ConfigVisibility,
  ): JsonValue | undefined {
    const visibility =
      visibilityByDataPath.get(visibilityPath) ?? inheritedVisibility;
    const isVisible = includeVisibilities.includes(visibility);

    // If a deep visibility is set for our current path, then we that as our
    // default visibility for all children until we encounter a different deep visibility
    const newInheritedVisibility =
      deepVisibilityByDataPath.get(visibilityPath) ?? inheritedVisibility;

    // deprecated keys are added regardless of visibility indicator
    const deprecation = deprecationByDataPath.get(visibilityPath);
    if (deprecation) {
      deprecatedKeys.push({ key: filterPath, description: deprecation });
    }

    if (typeof jsonVal !== 'object') {
      if (isVisible) {
        if (transformFunc) {
          return transformFunc(jsonVal, { visibility, path: filterPath });
        }
        return jsonVal;
      }
      if (withFilteredKeys) {
        filteredKeys.push(filterPath);
      }
      return undefined;
    } else if (jsonVal === null) {
      return undefined;
    } else if (Array.isArray(jsonVal)) {
      const arr = new Array<JsonValue>();

      for (const [index, value] of jsonVal.entries()) {
        let path = visibilityPath;
        const hasVisibilityInIndex = visibilityByDataPath.get(
          `${visibilityPath}/${index}`,
        );

        if (hasVisibilityInIndex || typeof value === 'object') {
          path = `${visibilityPath}/${index}`;
        }

        const out = transform(
          value,
          path,
          `${filterPath}[${index}]`,
          newInheritedVisibility,
        );

        if (out !== undefined) {
          arr.push(out);
        }
      }

      if (arr.length > 0 || isVisible) {
        return arr;
      }
      return undefined;
    }

    const outObj: JsonObject = {};
    let hasOutput = false;

    for (const [key, value] of Object.entries(jsonVal)) {
      if (value === undefined) {
        continue;
      }
      const out = transform(
        value,
        `${visibilityPath}/${key}`,
        filterPath ? `${filterPath}.${key}` : key,
        newInheritedVisibility,
      );
      if (out !== undefined) {
        outObj[key] = out;
        hasOutput = true;
      }
    }

    if (hasOutput || isVisible) {
      return outObj;
    }
    return undefined;
  }

  return {
    filteredKeys: withFilteredKeys ? filteredKeys : undefined,
    deprecatedKeys: withDeprecatedKeys ? deprecatedKeys : undefined,
    data:
      (transform(data, '', '', DEFAULT_CONFIG_VISIBILITY) as JsonObject) ?? {},
  };
}

export function filterErrorsByVisibility(
  errors: ValidationError[] | undefined,
  includeVisibilities: ConfigVisibility[] | undefined,
  visibilityByDataPath: Map<string, ConfigVisibility>,
  visibilityBySchemaPath: Map<string, ConfigVisibility>,
): ValidationError[] {
  if (!errors) {
    return [];
  }
  if (!includeVisibilities) {
    return errors;
  }

  const visibleSchemaPaths = Array.from(visibilityBySchemaPath)
    .filter(([, v]) => includeVisibilities.includes(v))
    .map(([k]) => k);

  // If we're filtering by visibility we only care about the errors that happened
  // in a visible path.
  return errors.filter(error => {
    // We always include structural errors as we don't know whether there are
    // any visible paths within the structures.
    if (
      error.keyword === 'type' &&
      ['object', 'array'].includes(error.params.type)
    ) {
      return true;
    }

    // For fields that were required we use the schema path to determine whether
    // it was visible in addition to the data path. This is because the data path
    // visibilities are only populated for values that we reached, which we won't
    // if the value is missing.
    // We don't use this method for all the errors as the data path is more robust
    // and doesn't require us to properly trim the schema path.
    if (error.keyword === 'required') {
      const trimmedPath = normalizeAjvPath(error.schemaPath).slice(
        1,
        -'/required'.length,
      );
      const fullPath = `${trimmedPath}/properties/${error.params.missingProperty}`;
      if (
        visibleSchemaPaths.some(visiblePath => visiblePath.startsWith(fullPath))
      ) {
        return true;
      }
    }

    const vis =
      visibilityByDataPath.get(normalizeAjvPath(error.instancePath)) ??
      DEFAULT_CONFIG_VISIBILITY;
    return vis && includeVisibilities.includes(vis);
  });
}
