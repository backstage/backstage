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
 * The marker that prefixes every result line written to stdout by the
 * extraction script, since plugin code is free to log anything else.
 */
export const MANIFEST_RESULT_MARKER = '__backstage_manifest__ ';

/**
 * The source of the script that is run in a child Node.js process to extract
 * manifests. It is kept as a string so that it works the same way whether the
 * CLI is run from source or from a built package.
 *
 * The input is passed as JSON in the BACKSTAGE_MANIFEST_INPUT environment
 * variable, and results are written to stdout as one marked JSON line per
 * package.
 */
export const EXTRACT_SCRIPT = `
const Module = require('node:module');
const path = require('node:path');

const input = JSON.parse(process.env.BACKSTAGE_MANIFEST_INPUT);
const MARKER = ${JSON.stringify(MANIFEST_RESULT_MARKER)};

function report(result) {
  process.stdout.write('\\n' + MARKER + JSON.stringify(result) + '\\n');
}

// Asset imports are only meaningful to the bundler, so stub them out
const assetExtensions = [
  '.css', '.scss', '.sass', '.less', '.svg', '.png', '.jpg', '.jpeg', '.gif',
  '.webp', '.ico', '.bmp', '.avif', '.woff', '.woff2', '.ttf', '.eot', '.otf',
  '.mp3', '.mp4', '.webm', '.md', '.txt', '.yaml', '.yml',
];
for (const ext of assetExtensions) {
  Module._extensions[ext] = (module, filename) => {
    module.exports = { __esModule: true, default: filename };
  };
}

// The node transform only handles .ts, but plugin entry points use TSX too
{
  const { addHook } = require(require.resolve('pirates', { paths: [input.transformDir] }));
  const { transformSync } = require(require.resolve('@swc/core', { paths: [input.transformDir] }));
  addHook(
    (code, filename) =>
      transformSync(code, {
        filename,
        sourceMaps: 'inline',
        module: { type: 'commonjs', ignoreDynamic: true },
        jsc: {
          target: 'es2024',
          parser: { syntax: 'typescript', tsx: true },
          transform: { react: { runtime: 'automatic' } },
        },
      }).code,
    { extensions: ['.tsx', '.jsx'], ignoreNodeModules: true },
  );
}

// Some packages import sub-paths without a file extension, which bundlers
// accept but the Node.js ESM resolver doesn't, so retry those with .js
if (Module.registerHooks) {
  Module.registerHooks({
    resolve(specifier, context, nextResolve) {
      try {
        return nextResolve(specifier, context);
      } catch (error) {
        if (error && error.code === 'ERR_MODULE_NOT_FOUND' && !path.extname(specifier)) {
          return nextResolve(specifier + '.js', context);
        }
        throw error;
      }
    },
  });
}

// Plugins commonly touch window and document when imported
try {
  const jsdomPath = require.resolve('jsdom', { paths: [input.appDir, __dirname, process.cwd()] });
  const { JSDOM } = require(jsdomPath);
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'http://localhost/',
    pretendToBeVisual: true,
  });
  const win = dom.window;
  global.window = win;
  for (const key of Object.getOwnPropertyNames(win)) {
    if (!(key in global)) {
      try {
        global[key] = win[key];
      } catch {}
    }
  }
  for (const key of ['document', 'navigator', 'localStorage', 'sessionStorage', 'location', 'history']) {
    try {
      Object.defineProperty(global, key, { value: win[key], configurable: true, writable: true });
    } catch {}
  }
} catch (error) {
  process.stderr.write('jsdom is not available, extracting without a DOM: ' + error.message + '\\n');
}

async function main() {
  // Resolved from the app so that the manifest code matches the app's version
  const alphaPath = require.resolve('@backstage/frontend-app-api/alpha', { paths: [input.appDir] });
  const { createFrontendFeatureManifest } = require(alphaPath);

  for (const pkg of input.packages) {
    let timer;
    try {
      const result = await Promise.race([
        (async () => {
          const importPath = require.resolve(pkg.import, { paths: [input.appDir] });
          const feature = require(importPath).default;
          if (!feature) {
            return { skipped: 'no default export' };
          }
          return { manifest: await createFrontendFeatureManifest(feature) };
        })(),
        new Promise((_, reject) => {
          timer = setTimeout(
            () => reject(new Error('timed out after ' + input.timeoutMs + 'ms')),
            input.timeoutMs,
          );
        }),
      ]);
      report({ key: pkg.key, ...result });
    } catch (error) {
      report({ key: pkg.key, error: String((error && error.message) || error) });
    } finally {
      clearTimeout(timer);
    }
  }
}

main().then(
  () => process.exit(0),
  error => {
    process.stderr.write(String((error && error.stack) || error) + '\\n');
    process.exit(1);
  },
);
`;
