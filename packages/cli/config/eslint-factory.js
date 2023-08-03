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

const { join: joinPath } = require('path');

/**
 * Creates a ESLint configuration that extends the base Backstage configuration.
 * In addition to the standard ESLint configuration options, the `extraConfig`
 * parameter also accepts the following keys:
 *
 * - `tsRules`: Additional ESLint rules to apply to TypeScript
 * - `testRules`: Additional ESLint rules to apply to tests
 * - `restrictedImports`: Additional paths to add to no-restricted-imports
 * - `restrictedImportsPattern`: Additional patterns to add to no-restricted-imports
 * - `restrictedSrcImports`: Additional paths to add to no-restricted-imports in src files
 * - `restrictedTestImports`: Additional paths to add to no-restricted-imports in test files
 * - `restrictedSyntax`: Additional patterns to add to no-restricted-syntax
 * - `restrictedSrcSyntax`: Additional patterns to add to no-restricted-syntax in src files
 * - `restrictedTestSyntax`: Additional patterns to add to no-restricted-syntax in test files
 */
function createConfig(dir, extraConfig = {}) {
  const {
    extends: extraExtends,
    plugins,
    env,
    parserOptions,
    ignorePatterns,
    overrides,

    rules,
    tsRules,
    testRules,

    restrictedImports,
    restrictedImportPatterns,
    restrictedSrcImports,
    restrictedTestImports,
    restrictedSyntax,
    restrictedSrcSyntax,
    restrictedTestSyntax,

    ...otherConfig
  } = extraConfig;

  return {
    ...otherConfig,
    extends: [
      '@spotify/eslint-config-base',
      '@spotify/eslint-config-typescript',
      'prettier',
      'plugin:jest/recommended',
      'plugin:@backstage/recommended',
      ...(extraExtends ?? []),
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['import', ...(plugins ?? [])],
    env: {
      jest: true,
      ...env,
    },
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
      lib: require('./tsconfig.json').compilerOptions.lib,
      ...parserOptions,
    },
    ignorePatterns: [
      '.eslintrc.*',
      '**/dist/**',
      '**/dist-types/**',
      ...(ignorePatterns ?? []),
    ],
    rules: {
      'no-shadow': 'off',
      'no-redeclare': 'off',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-redeclare': 'error',
      'no-undef': 'off',
      'import/newline-after-import': 'error',
      'no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-expressions': 'error',
      '@typescript-eslint/consistent-type-assertions': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true,
          argsIgnorePattern: '^_',
        },
      ],

      'no-restricted-imports': [
        2,
        {
          paths: [
            ...(restrictedImports ?? []),
            ...(restrictedSrcImports ?? []),
          ],
          patterns: [
            // Prevent imports of stories or tests
            '*.stories*',
            '*.test*',
            '**/__testUtils__/**',
            '**/__mocks__/**',
            ...(restrictedImportPatterns ?? []),
          ],
        },
      ],

      'no-restricted-syntax': [
        'error',
        ...(restrictedSyntax ?? []),
        ...(restrictedSrcSyntax ?? []),
      ],

      ...rules,
    },
    overrides: [
      {
        files: ['**/*.ts?(x)'],
        rules: {
          '@typescript-eslint/no-unused-vars': 'off',
          'no-undef': 'off',
          ...tsRules,
        },
      },
      {
        files: [
          '**/*.test.*',
          '**/*.stories.*',
          '**/__testUtils__/**',
          '**/__mocks__/**',
          'src/setupTests.*',
          '!src/**',
        ],
        rules: {
          ...testRules,
          'no-restricted-syntax': [
            'error',
            ...(restrictedSyntax ?? []),
            ...(restrictedTestSyntax ?? []),
          ],
          'no-restricted-imports': [
            2,
            {
              paths: [
                ...(restrictedImports ?? []),
                ...(restrictedTestImports ?? []),
              ],
            },
          ],
        },
      },
      ...(overrides ?? []),
    ],
  };
}

/**
 * Creates a ESLint configuration for the given package role.
 * The `extraConfig` parameter accepts the same keys as for the `createConfig` function.
 */
function createConfigForRole(dir, role, extraConfig = {}) {
  switch (role) {
    case 'common-library':
      return createConfig(dir, extraConfig);

    case 'web-library':
    case 'frontend':
    case 'frontend-plugin':
    case 'frontend-plugin-module':
      return createConfig(dir, {
        ...extraConfig,
        extends: [
          '@spotify/eslint-config-react',
          ...(extraConfig.extends ?? []),
        ],
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
          ...extraConfig.parserOptions,
        },
        settings: {
          react: {
            version: 'detect',
          },
          ...extraConfig.settings,
        },
        restrictedImports: [
          {
            // Importing the entire Material UI icons packages impedes build performance as the list of icons is huge.
            name: '@material-ui/icons',
            message: "Please import '@material-ui/icons/<Icon>' instead.",
          },
          {
            name: '@material-ui/icons/', // because this is possible too ._.
            message: "Please import '@material-ui/icons/<Icon>' instead.",
          },
          {
            // https://mui.com/material-ui/guides/minimizing-bundle-size/
            name: '@mui/material',
            message: "Please import '@mui/material/...' instead.",
          },
          ...require('module').builtinModules,
          ...(extraConfig.restrictedImports ?? []),
        ],
        // https://mui.com/material-ui/guides/minimizing-bundle-size/
        restrictedImportPatterns: [
          '@mui/*/*/*',
          ...(extraConfig.restrictedImportPatterns ?? []),
        ],
        tsRules: {
          'react/prop-types': 0,
          ...extraConfig.tsRules,
        },
      });

    case 'cli':
    case 'node-library':
    case 'backend':
    case 'backend-plugin':
    case 'backend-plugin-module':
      return createConfig(dir, {
        ...extraConfig,
        globals: {
          __non_webpack_require__: 'readonly',
          ...extraConfig.globals,
        },
        rules: {
          'no-console': 0, // Permitted in console programs
          'new-cap': ['error', { capIsNew: false }], // Because Express constructs things e.g. like 'const r = express.Router()'
          ...extraConfig.rules,
        },
        restrictedSyntax: [
          {
            message:
              'Default import from winston is not allowed, import `* as winston` instead.',
            selector:
              'ImportDeclaration[source.value="winston"] ImportDefaultSpecifier',
          },
          ...(extraConfig.restrictedSyntax ?? []),
        ],
        restrictedSrcSyntax: [
          {
            message:
              "`__dirname` doesn't refer to the same dir in production builds, try `resolvePackagePath()` from `@backstage/backend-common` instead.",
            selector: 'Identifier[name="__dirname"]',
          },
          ...(extraConfig.restrictedSrcSyntax ?? []),
        ],
      });
    default:
      throw new Error(`Unknown package role ${role}`);
  }
}

/**
 * Creates a ESLint configuration for the package in the given directory.
 * The `extraConfig` parameter accepts the same keys as for the `createConfig` function.
 */
function createPackageConfig(dir, extraConfig) {
  const pkg = require(joinPath(dir, 'package.json'));
  const role = pkg.backstage?.role;
  if (!role) {
    throw new Error(`Package ${pkg.name} does not have a backstage.role`);
  }

  return createConfigForRole(dir, role, extraConfig);
}

module.exports = createPackageConfig; // Alias
module.exports.createConfig = createConfig;
module.exports.createConfigForRole = createConfigForRole;
module.exports.createPackageConfig = createPackageConfig;
