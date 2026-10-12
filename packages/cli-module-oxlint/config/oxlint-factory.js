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

// @ts-check

const { mkdirSync, readFileSync, writeFileSync } = require('node:fs');
const path = require('node:path');

const BASE_PLUGINS = [
  'eslint',
  'typescript',
  'unicorn',
  'oxc',
  'import',
  'promise',
];
const TEST_FILES = ['**/*.test.*', '**/*.spec.*', '**/__tests__/**'];
const JEST_RULES = { 'jest/no-focused-tests': 'error' };
const FRONTEND_ROLES = new Set([
  'web-library',
  'frontend',
  'frontend-plugin',
  'frontend-plugin-module',
  'frontend-dynamic-container',
]);
const BACKEND_ROLES = new Set([
  'cli',
  'cli-module',
  'node-library',
  'backend',
  'backend-plugin',
  'backend-plugin-module',
]);
const BACKSTAGE_PLUGIN = path.join(__dirname, 'index.js').replace(/\\/g, '/');
const BACKSTAGE_RULES = {
  'backstage/no-forbidden-package-imports': 'error',
  'backstage/no-relative-monorepo-imports': 'error',
  'backstage/no-undeclared-imports': 'error',
  'backstage/no-mixed-plugin-imports': ['warn'],
  'backstage/no-ui-css-imports-in-non-frontend': 'error',
  'backstage/no-self-package-imports': 'error',
  'backstage/no-deprecated-bui-tokens': 'warn',
  'import/no-duplicates': 'error',
  'promise/no-return-wrap': 'error',
  // Native autofixes for these rules can change source semantics.
  'use-isnan': 'off',
  'no-var': 'off',
};
const AGENTIC_RULES = {
  'backstage/no-unexplained-suppressions': 'error',
  'backstage/no-bare-to-lower-case': 'error',
  'backstage/no-bare-to-upper-case': 'error',
  'backstage/no-react-default-import': 'error',
  'backstage/no-winston-default-import': 'error',
  'backstage/no-dirname-in-src': 'error',
};

function withPlugins(plugins, additional = []) {
  return [...new Set([...plugins, ...additional])];
}

function isDisabled(rule) {
  const severity = Array.isArray(rule) ? rule[0] : rule;
  return severity === 'off' || severity === 'allow' || severity === 0;
}

function asError(rule) {
  if (isDisabled(rule)) {
    return rule;
  }
  return Array.isArray(rule) ? ['error', ...rule.slice(1)] : 'error';
}

function normalizeRules(rules) {
  return Object.fromEntries(
    Object.entries(rules).map(([name, rule]) => [name, asError(rule)]),
  );
}

function normalizeCategories(categories) {
  return Object.fromEntries(
    Object.entries(categories).map(([name, severity]) => [
      name,
      isDisabled(severity) ? severity : 'error',
    ]),
  );
}

function createOverrides(plugins, extraOverrides) {
  return [
    {
      files: TEST_FILES,
      plugins: withPlugins(plugins, ['jest']),
      rules: { ...JEST_RULES },
    },
    ...extraOverrides.map(override => ({
      ...override,
      ...(override.plugins
        ? { plugins: withPlugins(plugins, override.plugins) }
        : {}),
    })),
  ];
}

function prepareAgenticAudit(preset) {
  if (preset !== 'agentic') {
    return;
  }
  const auditDir = process.env.BACKSTAGE_OXLINT_AUDIT_DIR;
  if (!auditDir) {
    throw new Error(
      'The agentic preset requires BACKSTAGE_OXLINT_AUDIT_DIR from the Backstage CLI.',
    );
  }
  mkdirSync(auditDir, { recursive: true });
  writeFileSync(
    path.join(auditDir, 'agentic.json'),
    JSON.stringify({ version: 1 }),
  );
}

/**
 * Creates the native Oxlint configuration for a common library.
 *
 * @param {string} dir - Directory containing this configuration.
 * @param {Record<string, any>} extraConfig - Native Oxlint configuration overrides.
 */
function createConfig(dir, extraConfig = {}) {
  return createConfigForRole(dir, 'common-library', extraConfig);
}

/**
 * Creates the native Oxlint configuration for a Backstage package role.
 *
 * @param {string} dir - Directory containing this configuration.
 * @param {string} role - Value of `backstage.role`.
 * @param {Record<string, any>} extraConfig - Native Oxlint configuration overrides.
 */
function createConfigForRole(dir, role, extraConfig = {}) {
  const supportedRoles = new Set([
    'common-library',
    'web-library',
    'frontend',
    'frontend-plugin',
    'frontend-plugin-module',
    'frontend-dynamic-container',
    'cli',
    'cli-module',
    'node-library',
    'backend',
    'backend-plugin',
    'backend-plugin-module',
  ]);
  if (!supportedRoles.has(role)) {
    throw new Error(`Unknown package role ${role}`);
  }

  const {
    preset = 'backstage',
    plugins: extraPlugins = [],
    jsPlugins: extraJsPlugins = [],
    rules: extraRules = {},
    overrides: extraOverrides = [],
    ignorePatterns: extraIgnorePatterns = [],
    categories: extraCategories = {},
    options: extraOptions = {},
    ...extraConfigFields
  } = extraConfig;
  if (preset !== 'backstage' && preset !== 'agentic') {
    throw new Error(`Unknown Oxlint preset: ${String(preset)}`);
  }
  if (preset === 'agentic' && isDisabled(extraCategories.correctness)) {
    throw new Error(
      'The agentic preset cannot disable the correctness category',
    );
  }
  const rolePlugins = withPlugins(BASE_PLUGINS, [
    ...(FRONTEND_ROLES.has(role) ? ['react', 'jsx-a11y'] : []),
    ...(BACKEND_ROLES.has(role) ? ['node'] : []),
    ...extraPlugins,
  ]);
  const baseRules = {
    ...BACKSTAGE_RULES,
    'oxc/no-const-enum': 'error',
    'typescript/no-explicit-any': 'warn',
    ...(FRONTEND_ROLES.has(role)
      ? {
          'react/rules-of-hooks': 'error',
          'react/jsx-key': 'error',
          'jsx-a11y/alt-text': 'error',
        }
      : {}),
    ...(BACKEND_ROLES.has(role) ? { 'node/no-path-concat': 'error' } : {}),
  };
  const rules = { ...baseRules, ...extraRules };
  const overrides = createOverrides(rolePlugins, extraOverrides);
  if (preset === 'agentic') {
    const protectedRules = new Set([
      ...Object.entries(baseRules)
        .filter(([, rule]) => !isDisabled(rule))
        .map(([rule]) => rule),
      ...Object.keys(AGENTIC_RULES),
      ...Object.keys(JEST_RULES),
    ]);
    for (const rule of protectedRules) {
      if (isDisabled(extraRules[rule])) {
        throw new Error(`The agentic preset cannot disable ${rule}`);
      }
      if (extraOverrides.some(override => isDisabled(override.rules?.[rule]))) {
        throw new Error(
          `The agentic preset cannot disable ${rule} in an override`,
        );
      }
    }
    Object.assign(rules, AGENTIC_RULES);
    Object.assign(rules, normalizeRules(rules));
    for (const override of overrides) {
      if (override.rules) {
        override.rules = normalizeRules(override.rules);
      }
    }
  }
  prepareAgenticAudit(preset);

  return {
    ...extraConfigFields,
    plugins: rolePlugins,
    jsPlugins: withPlugins([BACKSTAGE_PLUGIN], extraJsPlugins),
    categories: {
      correctness: 'error',
      ...extraCategories,
      ...(preset === 'agentic' ? normalizeCategories(extraCategories) : {}),
    },
    rules,
    overrides,
    ignorePatterns: [
      '.eslintrc.*',
      '.oxlintrc.*',
      '**/dist/**',
      '**/dist-types/**',
      ...extraIgnorePatterns,
    ],
    options: {
      ...extraOptions,
      ...(preset === 'agentic'
        ? {
            typeAware: true,
            typeCheck: true,
            reportUnusedDisableDirectives: 'error',
            respectEslintDisableDirectives: true,
          }
        : {}),
    },
  };
}

/**
 * Creates the native Oxlint configuration for the package in `dir`.
 *
 * @param {string} dir - Package directory containing `package.json` and config.
 * @param {Record<string, any>} extraConfig - Native Oxlint configuration overrides.
 */
function createPackageConfig(dir, extraConfig) {
  const packagePath = path.join(path.resolve(dir), 'package.json');
  const pkg = JSON.parse(readFileSync(packagePath, 'utf8'));
  if (!pkg.backstage?.role) {
    throw new Error(`Package ${pkg.name} does not have a backstage.role`);
  }
  return createConfigForRole(dir, pkg.backstage.role, extraConfig);
}

module.exports = createPackageConfig;
module.exports.createConfig = createConfig;
module.exports.createConfigForRole = createConfigForRole;
module.exports.createPackageConfig = createPackageConfig;
