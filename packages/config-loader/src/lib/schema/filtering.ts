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

/**
 * This filters data by visibility by discovering the visibility of each
 * value, and then only keeping the ones that are specified in `includeVisibilities`.
 */
export function filterByVisibility(
  data: JsonObject,
  includeVisibilities: ConfigVisibility[],
  visibilityByDataPath: Map<string, ConfigVisibility>,
  transformFunc?: TransformFunc<number | string | boolean>,
  withFilteredKeys?: boolean,
): { data: JsonObject; filteredKeys?: string[] } {
  const filteredKeys = new Array<string>();

  function transform(
    jsonVal: JsonValue,
    visibilityPath: string, // Matches the format we get from ajv
    filterPath: string, // Matches the format of the ConfigReader
  ): JsonValue | undefined {
    const visibility =
      visibilityByDataPath.get(visibilityPath) ?? DEFAULT_CONFIG_VISIBILITY;
    const isVisible = includeVisibilities.includes(visibility);

    if (typeof jsonVal !== 'object') {
      if (isVisible) {
        if (transformFunc) {
          return transformFunc(jsonVal, { visibility });
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
        const out = transform(
          value,
          `${visibilityPath}/${index}`,
          `${filterPath}[${index}]`,
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
    data: (transform(data, '', '') as JsonObject) ?? {},
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
      const trimmedPath = error.schemaPath.slice(1, -'/required'.length);
      const fullPath = `${trimmedPath}/properties/${error.params.missingProperty}`;
      if (
        visibleSchemaPaths.some(visiblePath => visiblePath.startsWith(fullPath))
      ) {
        return true;
      }
    }

    const vis =
      visibilityByDataPath.get(error.dataPath) ?? DEFAULT_CONFIG_VISIBILITY;
    return vis && includeVisibilities.includes(vis);
  });
}
