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

/// <reference types="node" />
// @ts-check

// Ported from the ESLint plugin (packages/eslint-plugin) and adapted to the
// Oxlint plugin host; behavior between the two can drift.

const fs = require('node:fs');
const path = require('node:path');

/**
 * @typedef EntryInfo
 * @type {object}
 * @property {string} key
 * @property {string} sourceFile
 */

const sourceExtensions = [
  '.ts',
  '.tsx',
  '.mts',
  '.cts',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
];

/** @type {Map<string, Map<string, Set<string>>>} */
const bundleCache = new Map();

/**
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
    if (typeof value !== 'string' || key === './package.json') {
      continue;
    }
    entries.push({ key, sourceFile: value.replace(/^\.\//, '') });
  }
  return entries;
}

/**
 * @param {string} fromFile
 * @param {string} specifier
 * @returns {string | undefined}
 */
function resolveSourcePath(fromFile, specifier) {
  const base = path.resolve(path.dirname(fromFile), specifier);
  if (/\.[cm]?[jt]sx?$/i.test(specifier)) {
    return fs.existsSync(base) ? base : undefined;
  }
  for (const extension of sourceExtensions) {
    const candidate = base + extension;
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  for (const extension of sourceExtensions) {
    const candidate = path.join(base, `index${extension}`);
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return undefined;
}

const fromSpecifierPattern =
  /(?:^|[\s;}])(?:import|export)\b(?!\s+type\b)[^"';]*?\bfrom\s*["']([^"']+)["']/gm;
const sideEffectSpecifierPattern = /(?:^|[\s;}])import\s*["']([^"']+)["']/gm;

/** @param {string} contents */
function collectRelativeSpecifiers(contents) {
  const specifiers = new Set();
  for (const match of contents.matchAll(fromSpecifierPattern)) {
    if (match[1].startsWith('.')) {
      specifiers.add(match[1]);
    }
  }
  for (const match of contents.matchAll(sideEffectSpecifierPattern)) {
    if (match[1].startsWith('.')) {
      specifiers.add(match[1]);
    }
  }
  return [...specifiers];
}

/**
 * @param {string} packageDir
 * @param {EntryInfo[]} entries
 */
function buildFileToEntriesMap(packageDir, entries) {
  /** @type {Map<string, Set<string>>} */
  const fileToEntries = new Map();
  for (const entry of entries) {
    const sourceFile = path.join(packageDir, entry.sourceFile);
    if (!fs.existsSync(sourceFile)) {
      continue;
    }

    const visited = new Set();
    const queue = [sourceFile];
    while (queue.length > 0) {
      const current = /** @type {string} */ (queue.pop());
      if (visited.has(current)) {
        continue;
      }
      visited.add(current);

      let entryKeys = fileToEntries.get(current);
      if (!entryKeys) {
        entryKeys = new Set();
        fileToEntries.set(current, entryKeys);
      }
      entryKeys.add(entry.key);

      let contents;
      try {
        contents = fs.readFileSync(current, 'utf8');
      } catch {
        continue;
      }
      for (const specifier of collectRelativeSpecifiers(contents)) {
        const resolved = resolveSourcePath(current, specifier);
        if (resolved) {
          queue.push(resolved);
        }
      }
    }
  }
  return fileToEntries;
}

/**
 * @param {string} packageDir
 * @param {EntryInfo[]} entries
 */
function getFileToEntriesMap(packageDir, entries) {
  let cached = bundleCache.get(packageDir);
  if (!cached) {
    cached = buildFileToEntriesMap(packageDir, entries);
    bundleCache.set(packageDir, cached);
  }
  return cached;
}

/**
 * @param {string} subPath
 * @param {EntryInfo[]} entries
 * @returns {EntryInfo | undefined}
 */
function findEntryForImport(subPath, entries) {
  const key = subPath ? `./${subPath}` : '.';
  return entries.find(entry => entry.key === key);
}

module.exports = {
  readEntries,
  getFileToEntriesMap,
  findEntryForImport,
};
