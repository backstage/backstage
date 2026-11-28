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

// The base of the configs created by ./eslint-factory.js, which extends this
// file by its path. ESLint resolves the shareable configs that a config file
// extends from the location of that file, so the ones below are loaded from
// the dependencies of this package, even when they aren't hoisted to the root
// of the repository.
//
// Plugins are different: the eslintrc format resolves every plugin from the
// directory of the config file of the package being linted, no matter which
// config declares it. This patch makes ESLint resolve each plugin from the
// config that declares it first, and from the default location if that fails,
// so the plugins below and those of the extended configs are loaded from their
// dependencies as well. It is applied when ESLint loads this file, before any
// of these plugins are loaded.
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  extends: [
    '@spotify/eslint-config-base',
    '@spotify/eslint-config-typescript',
    'prettier',
    'plugin:jest/recommended',
    'plugin:@backstage/recommended',
  ],
  plugins: ['import', 'unused-imports'],
};
