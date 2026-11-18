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

/**
 * Jest resolver for the @backstage/ai-node package family: this copy in
 * @backstage/ai-node is the single original every family package's
 * package.json "jest" key references.
 *
 * The Pi dependency stack (@earendil-works/chord, -pi-ai, -pi-durable, ...) is
 * ESM-only: the packages declare "type": "module" and their export maps only
 * provide "import" conditions (plus "types" and "source"). Jest's default
 * resolver uses CommonJS conditions ("require", "node", "default"), so those
 * specifiers fail to resolve out of the box.
 *
 * This resolver adds the "import" export condition for specifiers under
 * @earendil-works/* only. Everything else keeps the default conditions, so
 * CommonJS dependencies in the graph (for example `pg`) are unaffected.
 *
 * It is referenced from the "jest" key of each family package's
 * package.json (as `<rootDir>/../../ai-node/jestResolver.js`), which the
 * Backstage CLI merges into the generated per-package Jest config.
 */

const PI_SPECIFIER = /(?:^|\/)@earendil-works\//;

module.exports = (request, options) => {
  if (PI_SPECIFIER.test(request)) {
    return options.defaultResolver(request, {
      ...options,
      conditions: [
        ...(options.conditions ?? ['require', 'node', 'default']),
        'import',
      ],
    });
  }
  return options.defaultResolver(request, options);
};
