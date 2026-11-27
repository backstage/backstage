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

// Used by `yarn lint:circular-deps`. Created with `depcruise --init` and
// reduced to what the check needs. All options are described in
// https://github.com/sverweij/dependency-cruiser/blob/main/doc/options-reference.md

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      comment:
        'This dependency is part of a circular relationship. You might want to revise ' +
        'your solution (i.e. use dependency inversion, make sure the modules have a single responsibility) ',
      from: {},
      to: {
        circular: true,
        // Allows cycles made only of these files: the existing cycle between
        // core-compat-api and catalog-react/alpha, which only uses the imports
        // from the other package inside functions. A cycle that includes any
        // other file is still reported.
        via: {
          pathNot:
            '^(packages/core-compat-api/src/(index|convertLegacyApp|collectLegacyRoutes|collectEntityPageContents)' +
            '|plugins/catalog-react/src/alpha/(index|converters/(index|convertLegacyEntityCardExtension|convertLegacyEntityContentExtension)))[.]tsx?$',
        },
      },
    },
  ],
  options: {
    doNotFollow: {
      path: ['node_modules'],
    },
    exclude: {
      // Build output
      path: ['(^|/)(dist|dist-types)/'],
      // Lazy import()s, as a cycle they close can't cause load order
      // problems, e.g. a plugin that lazy loads a component that imports the
      // plugin.
      dynamic: true,
    },
    // Only check the dependencies that remain after compiling TypeScript, so
    // that imports only used as types don't count.
    tsPreCompilationDeps: false,
    tsConfig: {
      fileName: 'tsconfig.json',
    },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default', 'types'],
      mainFields: ['main', 'types', 'typings'],
    },
    skipAnalysisNotInRules: true,
  },
};
