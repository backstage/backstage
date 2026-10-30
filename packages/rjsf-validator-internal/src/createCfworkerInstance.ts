/*
 * Copyright 2026 The Backstage Authors
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

// Adapted from @rjsf/validator-cfworker 6.11.0 (Apache-2.0) for use with RJSF 5.
// See the package README for details.

import * as CFWorkerJsonSchema from '@cfworker/json-schema';
import type { Schema } from '@cfworker/json-schema';
import { Validator } from '@cfworker/json-schema';

import type {
  CFWorkerFormatChecker,
  CustomValidatorOptionsType,
} from './types';

/** Regular expression used to validate RJSF's `color` format. */
export const COLOR_FORMAT_REGEX =
  /^(#?([0-9A-Fa-f]{3}){1,2}\b|aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|yellow|(rgb\(\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*,\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*,\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*\))|(rgb\(\s*(\d?\d%|100%)+\s*,\s*(\d?\d%|100%)+\s*,\s*(\d?\d%|100%)+\s*\)))$/;

/** Regular expression used to validate RJSF's `data-url` format. */
export const DATA_URL_FORMAT_REGEX =
  /^data:([a-z]+\/[a-z0-9-+.]+)?;(?:name=(.*);)?base64,(.*)$/;

/** The shape of the `@cfworker/json-schema` module used to reach its runtime format registry. */
interface FormatRegistryModule {
  /** The engine's runtime format registry, when the module exposes it. */
  format?: Record<string, CFWorkerFormatChecker>;
}

/** Converts a supported custom-format declaration into a format checker.
 *
 * @param spec - The custom-format function, regular expression, or regular-expression source
 * @returns - A function that checks whether a string satisfies the format
 */
function asFormatChecker(
  spec: string | RegExp | CFWorkerFormatChecker,
): CFWorkerFormatChecker {
  if (typeof spec === 'function') {
    return spec;
  }
  const regex = spec instanceof RegExp ? spec : new RegExp(spec);
  return (value: string) => regex.test(value);
}

/** Installs the built-in RJSF formats and any user-provided formats into the engine registry.
 *
 * @param customFormats - The custom formats to add after the built-in `color` and `data-url` formats
 * @param [targetRegistry] - The format registry to update; defaults to the `@cfworker/json-schema` module registry
 */
export function installFormats(
  customFormats: CustomValidatorOptionsType['customFormats'],
  targetRegistry = (CFWorkerJsonSchema as unknown as FormatRegistryModule)
    .format,
): void {
  // `format` is a runtime export in @cfworker/json-schema 4.1.1, although its
  // generated declaration file omits it. The engine reads this registry while
  // validating, so adding entries here is its supported runtime extension seam.
  if (!targetRegistry) {
    throw new Error('@cfworker/json-schema did not expose its format registry');
  }

  const registry = targetRegistry;
  registry.color = asFormatChecker(COLOR_FORMAT_REGEX);
  registry['data-url'] = asFormatChecker(DATA_URL_FORMAT_REGEX);
  for (const [name, spec] of Object.entries(customFormats ?? {})) {
    registry[name] = asFormatChecker(spec);
  }
}

/** Builds a schema-bound `@cfworker/json-schema` validator.
 *
 * @param schema - The schema the validator will use
 * @param [options={}] - The options used to configure formats, schemas, draft behavior, and engine extension
 * @param [rootSchema] - The root schema to register for cross-schema `$ref` resolution
 * @returns - The configured schema-bound validator
 */
export default function createCfworkerInstance(
  schema: Schema | boolean,
  options: CustomValidatorOptionsType = {},
  rootSchema?: Schema,
): Validator {
  const {
    additionalMetaSchemas,
    customFormats,
    draft = '7',
    extenderFn,
    shortCircuit = false,
  } = options;

  installFormats(customFormats);
  // The engine annotates schemas during dereferencing. Clone every user-owned
  // schema so frozen RJSF fixtures and application schemas remain untouched.
  let validator = new Validator(structuredClone(schema), draft, shortCircuit);

  for (const additionalSchema of additionalMetaSchemas ?? []) {
    validator.addSchema(
      structuredClone(additionalSchema),
      additionalSchema.$id,
    );
  }
  if (rootSchema && rootSchema !== schema) {
    validator.addSchema(structuredClone(rootSchema), rootSchema.$id);
  }
  if (typeof extenderFn === 'function') {
    validator = extenderFn(validator);
  }
  return validator;
}
