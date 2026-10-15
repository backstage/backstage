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

// When ES modules import a CommonJS package, Node.js only exposes the named
// exports it can detect by statically analyzing the CommonJS source. Many
// popular packages such as lodash, fs-extra, knex, and winston build their
// exports dynamically, which means that something like
// `import { get } from 'lodash'` fails with a "Named export not found" error.
//
// This synchronous resolve hook fixes that for CommonJS packages in
// node_modules that are imported from ES modules. The package is loaded with
// `require()` and the import is resolved to a small ES module wrapper instead,
// with the actual `module.exports` as its default export, and each of its keys
// as named exports. The `require()` cache is shared, so the package is only
// evaluated once and the default export is the same object that `require()`
// returns.
//
// A synchronous hook is needed because the wrapper needs to know the export
// names of the evaluated package. The asynchronous hooks run in a separate
// thread, where loading the package would evaluate it a second time. The
// wrapper is a data: URL rather than the output of a load hook, because
// registering a synchronous load hook breaks loading of CommonJS modules in
// some Node.js versions.

const { registerHooks, createRequire } = require('node:module');
const { existsSync, readFileSync } = require('node:fs');
const { dirname, extname, join: joinPath } = require('node:path');
const { fileURLToPath } = require('node:url');

// File extensions that can be loaded as CommonJS
const COMMONJS_EXTS = ['.js', '.cjs', ''];

/**
 * The conditions are an Array for imports, but can be a Set for require calls.
 *
 * @param {Iterable<string> | undefined} conditions
 */
function hasImportCondition(conditions) {
  if (!conditions) {
    return false;
  }
  for (const condition of conditions) {
    if (condition === 'import') {
      return true;
    }
  }
  return false;
}

/** @type {Map<string, string>} */
const packageTypeCache = new Map();

/**
 * Returns the "type" field of the closest package.json file.
 *
 * @param {string} dir
 * @returns {string}
 */
function getPackageType(dir) {
  const cached = packageTypeCache.get(dir);
  if (cached) {
    return cached;
  }

  let type = 'commonjs';
  const packageJsonPath = joinPath(dir, 'package.json');
  if (existsSync(packageJsonPath)) {
    type = JSON.parse(readFileSync(packageJsonPath, 'utf8')).type ?? type;
  } else if (dirname(dir) !== dir) {
    type = getPackageType(dirname(dir));
  }
  packageTypeCache.set(dir, type);
  return type;
}

/**
 * Whether the importing module is an ES module. CommonJS modules can end up
 * here too, for example when Node.js loads them through its ES module loader,
 * and those imports are left as is.
 *
 * @param {string | undefined} parentURL
 */
function isModuleParent(parentURL) {
  if (!parentURL?.startsWith('file:')) {
    return false;
  }
  const parentPath = fileURLToPath(parentURL);
  const ext = extname(parentPath);
  if (ext === '.mjs' || ext === '.mts') {
    return true;
  }
  if (ext === '.cjs' || ext === '.cts') {
    return false;
  }
  return getPackageType(dirname(parentPath)) === 'module';
}

/**
 * Lists the export names of a CommonJS module, the default export excluded.
 *
 * @param {unknown} moduleExports
 * @returns {string[]}
 */
function getExportNames(moduleExports) {
  if (
    moduleExports === null ||
    (typeof moduleExports !== 'object' && typeof moduleExports !== 'function')
  ) {
    return [];
  }
  return Object.keys(moduleExports).filter(name => name !== 'default');
}

/**
 * Creates the source of an ES module that re-exports a CommonJS module.
 *
 * @param {string} filePath
 * @param {string[]} exportNames
 */
function createWrapperSource(filePath, exportNames) {
  const path = JSON.stringify(filePath);
  const lines = [
    // The wrapper avoids import statements, since data: URL modules with
    // imports fail to link in some Node.js versions.
    `const { createRequire } = process.getBuiltinModule('node:module');`,
    `const m = createRequire(${path})(${path});`,
    `export default m;`,
    `export { m as "module.exports" };`,
  ];
  // Export names can be any string, including reserved words like `static`,
  // so they are exported through generated local names.
  exportNames.forEach((name, index) => {
    const key = JSON.stringify(name);
    lines.push(
      `const e${index} = m[${key}];`,
      `export { e${index} as ${key} };`,
    );
  });
  return lines.join('\n');
}

/** @type {import('node:module').ResolveHookSync} */
function resolve(specifier, context, nextResolve) {
  const resolved = nextResolve(specifier, context);

  // Only imports from ES modules are affected, require calls work as usual.
  if (!hasImportCondition(context.conditions)) {
    return resolved;
  }
  if (!isModuleParent(context.parentURL)) {
    return resolved;
  }
  // Imports with attributes such as `with { type: 'json' }` are left alone.
  if (context.importAttributes?.type) {
    return resolved;
  }
  // The format is null for .js files in packages without a "type" field.
  if (resolved.format && resolved.format !== 'commonjs') {
    return resolved;
  }
  if (!resolved.url.startsWith('file:')) {
    return resolved;
  }

  const filePath = fileURLToPath(resolved.url);
  // Workspace packages are transformed or built by the Backstage CLI in a way
  // that lets Node.js detect their named exports, so only node_modules are
  // wrapped.
  if (!filePath.split(/[\\/]/).includes('node_modules')) {
    return resolved;
  }
  if (!COMMONJS_EXTS.includes(extname(filePath))) {
    return resolved;
  }

  let moduleExports;
  try {
    moduleExports = createRequire(filePath)(filePath);
  } catch {
    // Leave it to the default loader to load the module and report errors
    return resolved;
  }
  // Files in packages without a "type" field can still be ES modules, which
  // require() returns as a module namespace object.
  if (moduleExports?.[Symbol.toStringTag] === 'Module') {
    return resolved;
  }

  const source = createWrapperSource(filePath, getExportNames(moduleExports));
  return {
    url: `data:text/javascript,${encodeURIComponent(source)}`,
    format: 'module',
    shortCircuit: true,
  };
}

registerHooks({ resolve });
