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

/**
 * An sub-set of configuration schema.
 */
export type ConfigSchemaPackageEntry = {
  /**
   * The configuration schema itself.
   */
  value: JsonObject;
  /**
   * The relative path that the configuration schema was discovered at.
   */
  path: string;
  /**
   * The package name for the package this belongs to
   */
  packageName: string;
};

/**
 * A list of all possible configuration value visibilities.
 */
export const CONFIG_VISIBILITIES = ['frontend', 'backend', 'secret'] as const;

/**
 * A type representing the possible configuration value visibilities
 *
 * @public
 */
export type ConfigVisibility = 'frontend' | 'backend' | 'secret';

/**
 * The default configuration visibility if no other values is given.
 */
export const DEFAULT_CONFIG_VISIBILITY: ConfigVisibility = 'backend';

/**
 * An explanation of a configuration validation error.
 */
export type ValidationError = {
  keyword: string;
  instancePath: string;
  schemaPath: string;
  params: Record<string, any>;
  propertyName?: string;
  message?: string;
};

/**
 * The result of validating configuration data using a schema.
 */
type ValidationResult = {
  /**
   * Errors that where emitted during validation, if any.
   */
  errors?: ValidationError[];
  /**
   * The configuration visibilities that were discovered during validation.
   *
   * The path in the key uses the form `/<key>/<sub-key>/<array-index>/<leaf-key>`
   */
  visibilityByDataPath: Map<string, ConfigVisibility>;

  /**
   * The configuration deep visibilities that were discovered during validation.
   *
   * The path in the key uses the form `/<key>/<sub-key>/<array-index>/<leaf-key>`
   */
  deepVisibilityByDataPath: Map<string, ConfigVisibility>;

  /**
   * The configuration visibilities that were discovered during validation.
   *
   * The path in the key uses the form `/properties/<key>/items/additionalProperties/<leaf-key>`
   */
  visibilityBySchemaPath: Map<string, ConfigVisibility>;

  /**
   * The deprecated options that were discovered during validation.
   *
   * The path in the key uses the form `/<key>/<sub-key>/<array-index>/<leaf-key>`
   */
  deprecationByDataPath: Map<string, string>;
};

/**
 * A function used validate configuration data.
 */
export type ValidationFunc = (configs: AppConfig[]) => ValidationResult;

/**
 * A function used to transform primitive configuration values.
 *
 * The "path" in the context is a JQ-style path to the current value from
 * within the original object passed to filterByVisibility().
 * For example, "field.list[2]" would refer to:
 * \{
 *   field: [
 *     "foo",
 *     "bar",
 *     "baz" -- this one
 *   ]
 * \}
 *
 * @public
 */
export type TransformFunc<T extends number | string | boolean> = (
  value: T,
  context: { visibility: ConfigVisibility; path: string },
) => T | undefined;

/**
 * Options used to process configuration data with a schema.
 *
 * @public
 */
export type ConfigSchemaProcessingOptions = {
  /**
   * The visibilities that should be included in the output data.
   * If omitted, the data will not be filtered by visibility.
   */
  visibility?: ConfigVisibility[];

  /**
   * When set to `true`, any schema errors in the provided configuration will be ignored.
   */
  ignoreSchemaErrors?: boolean;

  /**
   * A transform function that can be used to transform primitive configuration values
   * during validation. The value returned from the transform function will be used
   * instead of the original value. If the transform returns `undefined`, the value
   * will be omitted.
   */
  valueTransform?: TransformFunc<any>;

  /**
   * Whether or not to include the `filteredKeys` property in the output `AppConfig`s.
   *
   * Default: `false`.
   */
  withFilteredKeys?: boolean;

  /**
   * Whether or not to include the `deprecatedKeys` property in the output `AppConfig`s.
   *
   * Default: `true`.
   */
  withDeprecatedKeys?: boolean;
};

/**
 * A loaded configuration schema that is ready to process configuration data.
 *
 * @public
 */
export type ConfigSchema = {
  process(
    appConfigs: AppConfig[],
    options?: ConfigSchemaProcessingOptions,
  ): AppConfig[];

  serialize(): JsonObject;
};
