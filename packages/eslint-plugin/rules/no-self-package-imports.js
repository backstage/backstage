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

const fs = require('node:fs');
const path = require('node:path');
const visitImports = require('../lib/visitImports');
const getPackages = require('../lib/getPackages');

/**
 * @typedef EntryInfo
 * @type {object}
 * @property {string} key - The exports key, e.g. '.' or './alpha'.
 * @property {string} sourceFile - The source file for the entry, relative to the package dir.
 */

const SOURCE_EXTENSIONS = [
  '.ts',
  '.tsx',
  '.mts',
  '.cts',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
];

// Cache the per-package analysis across files lint invocations. The key is the
// absolute package dir; the value is a Map from absolute file path to the set
// of entry keys whose bundle reaches that file.
/** @type {Map<string, Map<string, Set<string>>>} */
const bundleCache = new Map();

/**
 * Build a list of entries from the package.json exports field. Entries that
 * don't point to a script (e.g. `./package.json`) are ignored.
 *
 * @param {unknown} exportsField
 * @returns {EntryInfo[]}
 */
function readEntries(exportsField) {
  if (!exportsField || typeof exportsField !== 'object') {
    return [{ key: '.', sourceFile: 'src/index.ts' }];
  }
  /** @type {EntryInfo[]} */
  const entries = [];
  for (const [key, value] of Object.entries(exportsField)) {
    if (typeof value !== 'string') continue;
    if (key === './package.json') continue;
    const rel = value.replace(/^\.\//, '');
    entries.push({ key, sourceFile: rel });
  }
  return entries;
}

/**
 * Resolve a relative module specifier against a containing file.
 * Tries source extensions and index files, in that order.
 *
 * @param {string} fromFile
 * @param {string} specifier
 * @returns {string | undefined}
 */
function resolveSourcePath(fromFile, specifier) {
  const base = path.resolve(path.dirname(fromFile), specifier);
  // If the specifier already carries an extension, only try the exact path.
  if (/\.[cm]?[jt]sx?$/i.test(specifier)) {
    return fs.existsSync(base) ? base : undefined;
  }
  for (const ext of SOURCE_EXTENSIONS) {
    const candidate = base + ext;
    if (fs.existsSync(candidate)) return candidate;
  }
  for (const ext of SOURCE_EXTENSIONS) {
    const candidate = path.join(base, 'index' + ext);
    if (fs.existsSync(candidate)) return candidate;
  }
  return undefined;
}

// Matches `from '...'` specifiers in `import`/`export ... from` statements.
// Uses a non-greedy body so multi-line imports match cleanly. The negative
// lookahead skips `import type` / `export type` statements because type-only
// edges are erased at runtime and can't pull files into a runtime bundle.
const FROM_SPEC_RE =
  /(?:^|[\s;}])(?:import|export)\b(?!\s+type\b)[^"';]*?\bfrom\s*["']([^"']+)["']/gm;
// Matches side-effect imports: `import '...';`.
const SIDE_EFFECT_IMPORT_RE = /(?:^|[\s;}])import\s*["']([^"']+)["']/gm;

/**
 * Extract relative module specifiers from a source file's contents.
 *
 * @param {string} contents
 * @returns {string[]}
 */
function collectRelativeSpecifiers(contents) {
  const specs = new Set();
  for (const m of contents.matchAll(FROM_SPEC_RE)) {
    if (m[1].startsWith('.')) specs.add(m[1]);
  }
  for (const m of contents.matchAll(SIDE_EFFECT_IMPORT_RE)) {
    if (m[1].startsWith('.')) specs.add(m[1]);
  }
  return [...specs];
}

/**
 * Walk the relative import/export graph of each entry's source file and build
 * a map of absolute file paths to the set of entries whose bundles include
 * them. Files that aren't reachable from any entry (e.g. tests, scripts)
 * aren't present in the map.
 *
 * @param {string} pkgDir
 * @param {EntryInfo[]} entries
 * @returns {Map<string, Set<string>>}
 */
function buildFileToEntriesMap(pkgDir, entries) {
  /** @type {Map<string, Set<string>>} */
  const fileToEntries = new Map();
  for (const entry of entries) {
    const sourceFile = path.join(pkgDir, entry.sourceFile);
    if (!fs.existsSync(sourceFile)) continue;
    /** @type {Set<string>} */
    const visited = new Set();
    const queue = [sourceFile];
    while (queue.length > 0) {
      const current = /** @type {string} */ (queue.pop());
      if (visited.has(current)) continue;
      visited.add(current);

      let set = fileToEntries.get(current);
      if (!set) {
        set = new Set();
        fileToEntries.set(current, set);
      }
      set.add(entry.key);

      let contents;
      try {
        contents = fs.readFileSync(current, 'utf8');
      } catch {
        continue;
      }

      for (const spec of collectRelativeSpecifiers(contents)) {
        const resolved = resolveSourcePath(current, spec);
        if (resolved) queue.push(resolved);
      }
    }
  }
  return fileToEntries;
}

/**
 * @param {string} pkgDir
 * @param {EntryInfo[]} entries
 * @returns {Map<string, Set<string>>}
 */
function getFileToEntriesMap(pkgDir, entries) {
  let cached = bundleCache.get(pkgDir);
  if (!cached) {
    cached = buildFileToEntriesMap(pkgDir, entries);
    bundleCache.set(pkgDir, cached);
  }
  return cached;
}

/**
 * Find which entry an import targets based on its subpath. Returns undefined
 * when the import doesn't match any declared entry.
 *
 * @param {string} subPath - The part after the package name, without leading slash. Empty for the root entry.
 * @param {EntryInfo[]} entries
 * @returns {EntryInfo | undefined}
 */
function findEntryForImport(subPath, entries) {
  const key = subPath ? `./${subPath}` : '.';
  return entries.find(e => e.key === key);
}

/** @type {import('eslint').Rule.RuleModule} */
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
      url: 'https://github.com/backstage/backstage/blob/master/packages/eslint-plugin/docs/rules/no-self-package-imports.md',
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
  create(context) {
    const options = context.options[0] || {};
    const allowCrossEntry = options.allowCrossEntry !== false;

    const packages = getPackages(context.getCwd());
    const filename = context.getFilename();
    const selfPkg = packages?.byPath(filename);
    if (!selfPkg) {
      return {};
    }
    const selfName = selfPkg.packageJson.name;
    const entries = readEntries(selfPkg.packageJson.exports);
    const fileToEntries = getFileToEntriesMap(selfPkg.dir, entries);
    const fileEntries = fileToEntries.get(filename);

    // If the file isn't part of any entry's bundle (tests, scripts, orphans),
    // a self-package import from it can't create a circular-initialization
    // problem in a published bundle. Skip.
    if (!fileEntries || fileEntries.size === 0) {
      return {};
    }

    return visitImports(context, (node, imp) => {
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
    });
  },
};
