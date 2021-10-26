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

import { AppConfig } from '@backstage/config';
import { JsonObject } from '@backstage/types';
import { compileConfigSchemas } from './compile';
import { collectConfigSchemas } from './collect';
import { filterByVisibility, filterErrorsByVisibility } from './filtering';
import {
  ValidationError,
  ConfigSchema,
  ConfigSchemaPackageEntry,
  CONFIG_VISIBILITIES,
} from './types';

/**
 * Options that control the loading of configuration schema files in the backend.
 *
 * @public
 */
export type LoadConfigSchemaOptions =
  | {
      dependencies: string[];
      packagePaths?: string[];
    }
  | {
      serialized: JsonObject;
    };

function errorsToError(errors: ValidationError[]): Error {
  const messages = errors.map(({ dataPath, message, params }) => {
    const paramStr = Object.entries(params)
      .map(([name, value]) => `${name}=${value}`)
      .join(' ');
    return `Config ${message || ''} { ${paramStr} } at ${dataPath}`;
  });
  const error = new Error(`Config validation failed, ${messages.join('; ')}`);
  (error as any).messages = messages;
  return error;
}

/**
 * Loads config schema for a Backstage instance.
 *
 * @public
 */
export async function loadConfigSchema(
  options: LoadConfigSchemaOptions,
): Promise<ConfigSchema> {
  let schemas: ConfigSchemaPackageEntry[];

  if ('dependencies' in options) {
    schemas = await collectConfigSchemas(
      options.dependencies,
      options.packagePaths ?? [],
    );
  } else {
    const { serialized } = options;
    if (serialized?.backstageConfigSchemaVersion !== 1) {
      throw new Error(
        'Serialized configuration schema is invalid or has an invalid version number',
      );
    }
    schemas = serialized.schemas as ConfigSchemaPackageEntry[];
  }

  const validate = compileConfigSchemas(schemas);

  return {
    process(
      configs: AppConfig[],
      { visibility, valueTransform, withFilteredKeys } = {},
    ): AppConfig[] {
      const result = validate(configs);

      const visibleErrors = filterErrorsByVisibility(
        result.errors,
        visibility,
        result.visibilityByDataPath,
        result.visibilityBySchemaPath,
      );
      if (visibleErrors.length > 0) {
        throw errorsToError(visibleErrors);
      }

      let processedConfigs = configs;

      if (visibility) {
        processedConfigs = processedConfigs.map(({ data, context }) => ({
          context,
          ...filterByVisibility(
            data,
            visibility,
            result.visibilityByDataPath,
            valueTransform,
            withFilteredKeys,
          ),
        }));
      } else if (valueTransform) {
        processedConfigs = processedConfigs.map(({ data, context }) => ({
          context,
          ...filterByVisibility(
            data,
            Array.from(CONFIG_VISIBILITIES),
            result.visibilityByDataPath,
            valueTransform,
            withFilteredKeys,
          ),
        }));
      }

      return processedConfigs;
    },
    serialize(): JsonObject {
      return {
        schemas,
        backstageConfigSchemaVersion: 1,
      };
    },
  };
}
