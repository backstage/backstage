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

/**
 * Resolves the current working directory from a lint rule context object.
 *
 * oxlint exposes `context.cwd` (a property), while ESLint ≤8 uses
 * `context.getCwd()` (a method). This helper normalises both APIs and
 * falls back to `process.cwd()` when neither is available.
 *
 * @param {object} context - The rule context (oxlint or ESLint compatible)
 * @returns {string}
 */
function resolveCwd(context) {
  if (typeof context.cwd === 'string') {
    return context.cwd;
  }
  if (typeof context.getCwd === 'function') {
    return context.getCwd();
  }
  return process.cwd();
}

/**
 * Resolves the physical file path being linted from a rule context object.
 *
 * oxlint provides `context.physicalFilename` (a property), while ESLint ≤8
 * uses `context.getPhysicalFilename()` (a method). When neither is available
 * the helper falls back to `context.getFilename?.()` and then
 * `context.filename`.
 *
 * @param {object} context - The rule context (oxlint or ESLint compatible)
 * @returns {string}
 */
function resolveFilePath(context) {
  if (typeof context.getPhysicalFilename === 'function') {
    return context.getPhysicalFilename();
  }
  if (typeof context.physicalFilename === 'string') {
    return context.physicalFilename;
  }
  if (typeof context.getFilename === 'function') {
    return context.getFilename();
  }
  if (typeof context.filename === 'string') {
    return context.filename;
  }
  return '<unknown>';
}

module.exports = { resolveCwd, resolveFilePath };
