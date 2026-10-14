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

/**
 * The lint script convention for packages that lint with this module. The
 * `repo lint` command selects packages by this exact prefix, so it must stay
 * in sync with the module's own `package.json` lint script.
 *
 * @type {string}
 */
const OXLINT_PACKAGE_LINT_SCRIPT =
  'node bin/backstage-cli-module-oxlint package lint';

module.exports = { OXLINT_PACKAGE_LINT_SCRIPT };
