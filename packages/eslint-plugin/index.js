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
const pkg = require('./package.json');

/** @type {import('eslint').ESLint.Plugin['rules']} */
const recommendedRules = {
  '@backstage/no-forbidden-package-imports': 'error',
  '@backstage/no-relative-monorepo-imports': 'error',
  '@backstage/no-undeclared-imports': 'error',
  '@backstage/no-mixed-plugin-imports': 'warn',
  '@backstage/no-ui-css-imports-in-non-frontend': 'error',
};

/** @type {import('eslint').ESLint.Plugin} */
const plugin = {
  meta: {
    name: pkg.name,
    version: pkg.version,
  },
  configs: {
    recommended: {
      plugins: ['@backstage'],
      rules: recommendedRules,
    },
  },
  rules: {
    'no-forbidden-package-imports': require('./rules/no-forbidden-package-imports'),
    'no-relative-monorepo-imports': require('./rules/no-relative-monorepo-imports'),
    'no-undeclared-imports': require('./rules/no-undeclared-imports'),
    'no-top-level-material-ui-4-imports': require('./rules/no-top-level-material-ui-4-imports'),
    'no-mixed-plugin-imports': require('./rules/no-mixed-plugin-imports'),
    'no-ui-css-imports-in-non-frontend': require('./rules/no-ui-css-imports-in-non-frontend'),
  },
};

// Assign configs here so we can reference `plugin` for flat config
// cf https://eslint.org/docs/v8.x/extend/plugin-migration-flat-config#migrating-configs-for-flat-config
Object.assign(plugin.configs, {
  // Flat config format (ESLint v8.24+ / v9+)
  // If flat config is enabled, this will be automatically used when `recommended` is loaded
  // cf https://eslint.org/docs/latest/extend/plugins#backwards-compatibility-for-legacy-configs
  'flat/recommended': {
    plugins: {
      '@backstage': plugin,
    },
    rules: recommendedRules,
  },

  // Legacy config format (ESLint v8 and earlier)
  recommended: {
    plugins: ['@backstage'],
    rules: recommendedRules,
  },
});

module.exports = plugin;
