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

const visitImports = require('../lib/visitImports');
const getPackages = require('../lib/getPackages');
const {
  readEntries,
  getFileToEntriesMap,
  findEntryForImport,
} = require('../lib/selfPackageGraph');

/** @type {Parameters<import('oxlint/plugins-dev').RuleTester['run']>[1]} */
module.exports = {
  meta: {
    type: 'problem',
    messages: {
      sameEntrySelfImport:
        "Do not import from your own package '{{packageName}}'. This causes a circular dependency because '{{entry}}' re-exports this file. Switch to a relative import, or use `import type` if only types are needed (type-only imports are erased at runtime).",
      crossEntrySelfImport:
        "Avoid importing from your own package '{{packageName}}' via '{{importPath}}'. Even across entry points this can lead to subtle circular initialization issues. Prefer a relative import, or use `import type` if only types are needed (type-only imports are erased at runtime).",
    },
    docs: {
      description:
        'Disallow a package from importing itself by its own name, which causes circular initialization issues in bundled ESM.',
      url: 'https://github.com/backstage/backstage/blob/master/packages/cli-module-oxlint/docs/rules/no-self-package-imports.md',
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowCrossEntry: {
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },
    ],
  },
  createOnce(context) {
    let allowCrossEntry = true;
    /** @type {import('../lib/getPackages.js').ExtendedPackage | undefined} */
    let selfPkg;
    /** @type {string | undefined} */
    let selfName;
    /** @type {ReturnType<typeof readEntries>} */
    let entries;
    /** @type {Set<string> | undefined} */
    let fileEntries;

    return {
      before() {
        const options = /** @type {{ allowCrossEntry?: boolean }} */ (
          context.options?.[0] || {}
        );
        allowCrossEntry = options.allowCrossEntry !== false;

        const packages = getPackages(context.cwd);
        const filename = context.physicalFilename;
        selfPkg = packages?.byPath(filename);
        if (!selfPkg) {
          return false;
        }
        selfName = selfPkg.packageJson.name;
        entries = readEntries(selfPkg.packageJson.exports);
        const fileToEntries = getFileToEntriesMap(selfPkg.dir, entries);
        fileEntries = fileToEntries.get(filename);

        // If the file isn't part of any entry's bundle (tests, scripts, orphans),
        // a self-package import from it can't create a circular-initialization
        // problem in a published bundle. Skip.
        if (!fileEntries || fileEntries.size === 0) {
          return false;
        }
      },
      ...visitImports(context, (node, imp) => {
        if (!selfPkg || !selfName || !fileEntries) return;
        if (imp.type !== 'internal') return;
        if (imp.packageName !== selfName) return;
        // Type-only imports are erased at runtime and can't cause circular init.
        if (imp.kind === 'type') return;
        // Importing a non-script asset (e.g. `package.json`) doesn't go through
        // the module barrel, so it can't cause circular init issues.
        if (imp.path === 'package.json' || imp.path.endsWith('/package.json')) {
          return;
        }

        const importEntry = findEntryForImport(imp.path, entries);
        if (!importEntry) return;

        const importPath = imp.path ? `${selfName}/${imp.path}` : selfName;

        if (fileEntries.has(importEntry.key)) {
          context.report({
            node,
            messageId: 'sameEntrySelfImport',
            data: {
              packageName: selfName,
              entry: importEntry.key,
            },
          });
          return;
        }

        if (!allowCrossEntry) {
          context.report({
            node,
            messageId: 'crossEntrySelfImport',
            data: {
              packageName: selfName,
              importPath,
            },
          });
        }
      }),
    };
  },
};
