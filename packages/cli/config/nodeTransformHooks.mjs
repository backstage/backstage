/*
 * Copyright 2024 The Backstage Authors
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

import { dirname, extname, resolve as resolvePath } from 'path';
import { fileURLToPath } from 'url';
import { transformFile } from '@swc/core';
import { isBuiltin } from 'node:module';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';

// @ts-check

// No explicit file extension, no type in package.json
const DEFAULT_MODULE_FORMAT = 'commonjs';

// Source file extensions to look for when using bundle resolution strategy
const SRC_EXTS = ['.ts', '.js'];
const TS_EXTS = ['.ts', '.mts', '.cts'];
const moduleTypeTable = {
  '.mjs': 'module',
  '.mts': 'module',
  '.cjs': 'commonjs',
  '.cts': 'commonjs',
  '.ts': undefined,
  '.js': undefined,
};

/** @type {import('module').ResolveHook} */
export async function resolve(specifier, context, nextResolve) {
  // Built-in modules are handled by the default resolver
  if (isBuiltin(specifier)) {
    return nextResolve(specifier, context);
  }

  const ext = extname(specifier);

  // Unless there's an explicit import attribute, JSON files are loaded with our custom loader that's defined below.
  if (ext === '.json' && !context.importAttributes?.type) {
    const jsonResult = await nextResolve(specifier, context);
    return {
      ...jsonResult,
      format: 'commonjs',
      importAttributes: { type: 'json' },
    };
  }

  // Anything else with an explicit extension is handled by the default
  // resolver, except that we help determine the module type where needed.
  if (ext !== '') {
    return withDetectedModuleType(await nextResolve(specifier, context));
  }

  // Other external modules are handled by the default resolver, but again we
  // help determine the module type where needed.
  if (!specifier.startsWith('.')) {
    return withDetectedModuleType(await nextResolve(specifier, context));
  }

  // The rest of this function handles the case of resolving imports that do not
  // specify any extension and might point to a directory with an `index.*`
  // file. We resolve those using the same logic as most JS bundlers would, with
  // the addition of checking if there's an explicit module format listed in the
  // closest `package.json` file.
  //
  // We use a bundle resolution strategy in order to keep code consistent across
  // Backstage codebases that contains code both for Web and Node.js, and to
  // support packages with common code that can be used in both environments.
  try {
    // This is expected to throw, but in the event that this module specifier is
    // supported we prefer to use the default resolver.
    return await nextResolve(specifier, context);
  } catch (error) {
    if (error.code === 'ERR_UNSUPPORTED_DIR_IMPORT') {
      const spec = `${specifier}${specifier.endsWith('/') ? '' : '/'}index`;
      const resolved = await resolveWithoutExt(spec, context, nextResolve);
      if (resolved) {
        return withDetectedModuleType(resolved);
      }
    } else if (error.code === 'ERR_MODULE_NOT_FOUND') {
      const resolved = await resolveWithoutExt(specifier, context, nextResolve);
      if (resolved) {
        return withDetectedModuleType(resolved);
      }
    }

    // Unexpected error or no resolution found
    throw error;
  }
}

/**
 * Populates the `format` field in the resolved object based on the closest `package.json` file.
 *
 * @param {import('module').ResolveFnOutput} resolved
 * @returns {Promise<import('module').ResolveFnOutput>}
 */
async function withDetectedModuleType(resolved) {
  // Already has an explicit format
  if (resolved.format) {
    return resolved;
  }
  // Happens in Node.js v22 when there's a package.json without an explicit "type" field. Use the default.
  if (resolved.format === null) {
    return { ...resolved, format: DEFAULT_MODULE_FORMAT };
  }

  const ext = extname(resolved.url);

  const explicitFormat = moduleTypeTable[ext];
  if (explicitFormat) {
    return {
      ...resolved,
      format: explicitFormat,
    };
  }

  // TODO(Rugvip): Afaik this should never happen and we can remove this check, but want it here for a little while to verify.
  if (ext === '.js') {
    throw new Error('Unexpected .js file without explicit format');
  }

  // TODO(Rugvip): Does this need caching? kept it simple for now but worth exploring
  const packageJsonPath = await findPackageJSON(fileURLToPath(resolved.url));
  if (!packageJsonPath) {
    return resolved;
  }

  const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));
  return {
    ...resolved,
    format: packageJson.type ?? DEFAULT_MODULE_FORMAT,
  };
}

/**
 * Find the closest package.json file from the given path.
 *
 * TODO(Rugvip): This can be replaced with the Node.js built-in with the same name once it is stable.
 * @param {string} startPath
 * @returns {Promise<string | undefined>}
 */
async function findPackageJSON(startPath) {
  let path = startPath;

  // Some confidence check to avoid infinite loop
  for (let i = 0; i < 1000; i++) {
    const packagePath = resolvePath(path, 'package.json');
    if (existsSync(packagePath)) {
      return packagePath;
    }

    const newPath = dirname(path);
    if (newPath === path) {
      return undefined;
    }
    path = newPath;
  }

  throw new Error(
    `Iteration limit reached when searching for package.json at ${startPath}`,
  );
}

/** @type {import('module').ResolveHook} */
async function resolveWithoutExt(specifier, context, nextResolve) {
  for (const tryExt of SRC_EXTS) {
    try {
      const resolved = await nextResolve(specifier + tryExt, {
        ...context,
        format: 'commonjs',
      });
      return {
        ...resolved,
        format: moduleTypeTable[tryExt] ?? resolved.format,
      };
    } catch {
      /* ignore */
    }
  }
  return undefined;
}

/** @type {import('module').LoadHook} */
export async function load(url, context, nextLoad) {
  // Non-file URLs are handled by the default loader
  if (!url.startsWith('file://')) {
    return nextLoad(url, context);
  }

  // JSON files loaded as CommonJS are handled by this custom loader, because
  // the default one doesn't work. For JSON loading to work we'd need the
  // synchronous hooks that aren't supported yet, or avoid using the CommonJS
  // compatibility.
  if (
    context.format === 'commonjs' &&
    context.importAttributes?.type === 'json'
  ) {
    try {
      // TODO(Rugvip): Make sure this is valid JSON
      const content = await readFile(fileURLToPath(url), 'utf8');
      return {
        source: `module.exports = (${content})`,
        format: 'commonjs',
        shortCircuit: true,
      };
    } catch {
      // Let the default loader generate the error
      return nextLoad(url, context);
    }
  }

  const ext = extname(url);

  // Non-TS files are handled by the default loader
  if (!TS_EXTS.includes(ext)) {
    return nextLoad(url, context);
  }

  const format = context.format ?? DEFAULT_MODULE_FORMAT;

  // We have two choices at this point, we can either transform CommonJS files
  // and return the transformed source code, or let the default loader handle
  // them. If we transform them ourselves we will enter CommonJS compatibility
  // mode in the new module system in Node.js, this effectively means all
  // CommonJS loaded via `require` calls from this point will all be treated as
  // if it was loaded via `import` calls from modules.
  //
  // The CommonJS compatibility layer will try to identify named exports and
  // make them available directly, which is convenient as it avoids things like
  // `import(...).then(m => m.default.foo)`, allowing you to instead write
  // `import(...).then(m => m.foo)`. The compatibility layer doesn't always work
  // all that well though, and can lead to module loading issues in many cases,
  // especially for older code.

  // This `if` block opts-out of using CommonJS compatibility mode by default,
  // and instead leaves it to our existing loader to transform CommonJS. We do
  // however use compatibility mode for the more explicit .cts file extension,
  // allows for a way to opt-in to the new behavior.
  //
  // TODO(Rugvip): Once the synchronous hooks API is available for us to use, we might be able to adopt that instead
  if (format === 'commonjs' && ext !== '.cts') {
    return nextLoad(url, { ...context, format });
  }

  const transformed = await transformFile(fileURLToPath(url), {
    sourceMaps: 'inline',
    module: {
      type: format === 'module' ? 'es6' : 'commonjs',
      ignoreDynamic: true,

      // This helps the Node.js CommonJS compat layer identify named exports.
      exportInteropAnnotation: true,
    },
    jsc: {
      target: 'es2022',
      parser: {
        syntax: 'typescript',
      },
    },
  });

  return {
    ...context,
    shortCircuit: true,
    source: transformed.code,
    format,
    responseURL: url,
  };
}
