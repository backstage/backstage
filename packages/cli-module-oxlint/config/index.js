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

// @ts-check

const noForbiddenPackageImports = require('./rules/no-forbidden-package-imports');
const noMixedPluginImports = require('./rules/no-mixed-plugin-imports');
const noRelativeMonorepoImports = require('./rules/no-relative-monorepo-imports');
const noTopLevelMaterialUi4Imports = require('./rules/no-top-level-material-ui-4-imports');
const noUiCssImportsInNonFrontend = require('./rules/no-ui-css-imports-in-non-frontend');
const noSelfPackageImports = require('./rules/no-self-package-imports');
const noUndeclaredImports = require('./rules/no-undeclared-imports');
const noDeprecatedBuiTokens = require('./rules/no-deprecated-bui-tokens');
const noUnexplainedSuppressions = require('./rules/no-unexplained-suppressions');
const notice = require('./rules/notice');
const noDirnameInSrc = require('./rules/no-dirname-in-src');

/**
 * Backstage oxlint JS plugin.
 *
 * Exports the `backstage` namespace with Backstage-specific lint rules.
 *
 * @type {{ meta: { name: string }, rules: Record<string, Parameters<import('oxlint/plugins-dev').RuleTester['run']>[1]> }}
 */
module.exports = {
  meta: { name: 'backstage' },
  rules: {
    'no-forbidden-package-imports': noForbiddenPackageImports,
    'no-mixed-plugin-imports': noMixedPluginImports,
    'no-relative-monorepo-imports': noRelativeMonorepoImports,
    'no-self-package-imports': noSelfPackageImports,
    'no-top-level-material-ui-4-imports': noTopLevelMaterialUi4Imports,
    'no-ui-css-imports-in-non-frontend': noUiCssImportsInNonFrontend,
    'no-undeclared-imports': noUndeclaredImports,
    'no-deprecated-bui-tokens': noDeprecatedBuiTokens,
    'no-unexplained-suppressions': noUnexplainedSuppressions,
    notice: notice,
    'no-dirname-in-src': noDirnameInSrc,
  },
};
