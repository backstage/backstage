/*
 * Copyright 2025 The Backstage Authors
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

import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * A rule severity value.
 *
 * @public
 */
export type DummyRule = string | [string, ...unknown[]];

/**
 * A map of rule names to their configurations.
 *
 * @public
 */
export type DummyRuleMap = Record<string, DummyRule>;

/**
 * An override block scoped to specific file patterns.
 *
 * @public
 */
export interface OxlintOverride {
  files: string[];
  rules?: DummyRuleMap;
}

/**
 * The shape of an oxlint configuration object.
 *
 * @public
 */
export interface OxlintConfig {
  jsPlugins?: string[];
  ignorePatterns?: string[];
  rules?: DummyRuleMap;
  overrides?: OxlintOverride[];
  [key: string]: unknown;
}

/**
 * Merges two rule maps. When both base and user define the same rule as
 * `[severity, options]` arrays, the options objects are shallow-merged so
 * the user can add fields without repeating the base options.
 */
function mergeRules(base: DummyRuleMap, user?: DummyRuleMap): DummyRuleMap {
  if (!user) {
    return base;
  }
  const merged = { ...base };
  for (const [key, userValue] of Object.entries(user)) {
    const baseValue: DummyRule | undefined = merged[key];
    if (
      Array.isArray(baseValue) &&
      Array.isArray(userValue) &&
      baseValue.length === 2 &&
      userValue.length === 2 &&
      typeof baseValue[1] === 'object' &&
      baseValue[1] !== null &&
      typeof userValue[1] === 'object' &&
      userValue[1] !== null
    ) {
      merged[key] = [userValue[0], { ...baseValue[1], ...userValue[1] }];
    } else {
      merged[key] = userValue;
    }
  }
  return merged;
}

/**
 * Options for {@link defineBackstageConfig}.
 *
 * Accepts standard oxlint config fields (`rules`, `overrides`,
 * `ignorePatterns`, `jsPlugins`), which are merged into the generated
 * Backstage base config.
 *
 * @public
 */
export type BackstageOxlintConfigOptions = Partial<OxlintConfig>;

/**
 * Creates an oxlint configuration for a Backstage monorepo.
 *
 * The factory auto-includes the bundled Backstage JS plugin and enables the
 * default set of Backstage lint rules. All options are merged on top of the
 * defaults — `rules` are shallow-merged, `overrides` and `jsPlugins` are
 * appended, and `ignorePatterns` are passed through.
 *
 * @public
 */
export async function defineBackstageConfig(
  options: BackstageOxlintConfigOptions = {},
): Promise<OxlintConfig> {
  const {
    rules: userRules,
    overrides: userOverrides,
    ignorePatterns: userIgnorePatterns,
    jsPlugins: userJsPlugins,
    ...passthrough
  } = options;

  // Resolve the bundled plugin path relative to this file.
  // Use import.meta.url when loaded as ESM (e.g. by oxlint's native TS
  // config loader), fall back to __dirname for CJS contexts.
  const configDir =
    typeof __dirname !== 'undefined'
      ? __dirname
      : dirname(fileURLToPath(import.meta.url));
  const bundledPluginPath = resolve(configDir, 'index.js').replace(/\\/g, '/');

  const baseRules: DummyRuleMap = {
    'backstage/no-forbidden-package-imports': 'error',
    'backstage/no-relative-monorepo-imports': 'error',
    'backstage/no-undeclared-imports': 'error',
    'backstage/no-mixed-plugin-imports': 'error',
    'backstage/no-ui-css-imports-in-non-frontend': 'error',
    'backstage/no-top-level-material-ui-4-imports': 'warn',
    'backstage/no-self-package-imports': 'error',
  };

  return {
    ...passthrough,
    ...(userIgnorePatterns?.length
      ? { ignorePatterns: userIgnorePatterns }
      : {}),
    jsPlugins: [bundledPluginPath, ...(userJsPlugins ?? [])],
    rules: mergeRules(baseRules, userRules),
    overrides: [...(userOverrides ?? [])],
  };
}
