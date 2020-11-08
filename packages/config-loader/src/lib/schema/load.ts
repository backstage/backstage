/*
 * Copyright 2020 Spotify AB
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

import { AppConfig, JsonObject } from '@backstage/config';
import { compileConfigSchemas } from './compile';
import { collectConfigSchemas } from './collect';
import { filterByVisibility } from './filtering';
import { ConfigSchema, ConfigSchemaPackageEntry } from './types';

type Options =
  | {
      dependencies: string[];
    }
  | {
      serialized: JsonObject;
    };

/**
 * Loads config schema for a Backstage instance.
 */
export async function loadConfigSchema(
  options: Options,
): Promise<ConfigSchema> {
  let schemas: ConfigSchemaPackageEntry[];

  if ('dependencies' in options) {
    schemas = await collectConfigSchemas(options.dependencies);
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
    process(configs: AppConfig[], { visibilities } = {}): AppConfig[] {
      const result = validate(configs);
      if (result.errors) {
        throw new Error(
          `Config validation failed, ${result.errors.join('; ')}`,
        );
      }

      let processedConfigs = configs;

      if (visibilities) {
        processedConfigs = processedConfigs.map(({ data, context }) => ({
          context,
          data: filterByVisibility(data, visibilities, result.visibilityByPath),
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
