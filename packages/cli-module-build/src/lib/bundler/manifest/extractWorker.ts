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

/* eslint-disable no-restricted-syntax, @typescript-eslint/no-require-imports */

// This file is run as a script in a child Node.js process to extract
// manifests, see extractManifests.ts. Results are written to stdout as one
// marked JSON line per package.

import Module from 'node:module';
import path from 'node:path';
import { MANIFEST_RESULT_MARKER, ManifestWorkerInput } from './protocol';

const input: ManifestWorkerInput = JSON.parse(
  process.env.BACKSTAGE_MANIFEST_INPUT!,
);

function report(result: object) {
  process.stdout.write(
    `\n${MANIFEST_RESULT_MARKER}${JSON.stringify(result)}\n`,
  );
}

function errorMessage(error: unknown): string {
  return String((error as Error | undefined)?.message ?? error);
}

// Asset imports are only meaningful to the bundler, so stub them out
const assetExtensions = [
  '.css',
  '.scss',
  '.sass',
  '.less',
  '.svg',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.ico',
  '.bmp',
  '.avif',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot',
  '.otf',
  '.mp3',
  '.mp4',
  '.webm',
  '.md',
  '.txt',
  '.yaml',
  '.yml',
];
const extensions = (Module as any)._extensions;
for (const ext of assetExtensions) {
  extensions[ext] = (mod: any, filename: string) => {
    mod.exports = { __esModule: true, default: filename };
  };
}

// The node transform only handles .ts, but plugin entry points use TSX too
{
  const resolveFrom = (id: string) =>
    require.resolve(id, { paths: [input.transformDir] });
  const { addHook } = require(resolveFrom('pirates'));
  const { transformSync } = require(resolveFrom('@swc/core'));
  addHook(
    (code: string, filename: string) =>
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
const registerHooks = (Module as any).registerHooks;
if (registerHooks) {
  registerHooks({
    resolve(specifier: string, context: unknown, nextResolve: any) {
      try {
        return nextResolve(specifier, context);
      } catch (error) {
        if (
          (error as any)?.code === 'ERR_MODULE_NOT_FOUND' &&
          !path.extname(specifier)
        ) {
          return nextResolve(`${specifier}.js`, context);
        }
        throw error;
      }
    },
  });
}

// Plugins commonly touch window and document when imported
try {
  const jsdomPath = require.resolve('jsdom', {
    paths: [input.appDir, __dirname, process.cwd()],
  });
  const { JSDOM } = require(jsdomPath);
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'http://localhost/',
    pretendToBeVisual: true,
  });
  const win = dom.window;
  const g = global as any;
  g.window = win;
  for (const key of Object.getOwnPropertyNames(win)) {
    if (!(key in g)) {
      try {
        g[key] = win[key];
      } catch {
        // some window properties are read-only or throw on access
      }
    }
  }
  for (const key of [
    'document',
    'navigator',
    'localStorage',
    'sessionStorage',
    'location',
    'history',
  ]) {
    try {
      Object.defineProperty(g, key, {
        value: win[key],
        configurable: true,
        writable: true,
      });
    } catch {
      // some window properties are read-only or throw on access
    }
  }
} catch (error) {
  process.stderr.write(
    `jsdom is not available, extracting without a DOM: ${errorMessage(
      error,
    )}\n`,
  );
}

async function main() {
  // Resolved from the app so that the manifest code matches the app's version
  const alphaPath = require.resolve('@backstage/frontend-app-api/alpha', {
    paths: [input.appDir],
  });
  const { createFrontendFeatureManifest } = require(alphaPath);

  for (const pkg of input.packages) {
    let timer: NodeJS.Timeout | undefined;
    try {
      const result = await Promise.race([
        (async () => {
          const importPath = require.resolve(pkg.import, {
            paths: [input.appDir],
          });
          const feature = require(importPath).default;
          if (!feature) {
            return { skipped: 'no default export' };
          }
          let sync;
          if (pkg.syncImport) {
            const syncPath = require.resolve(pkg.syncImport, {
              paths: [input.appDir],
            });
            sync = require(syncPath).default;
            if (!sync) {
              return {
                error: `the sync entry point ${pkg.syncImport} has no default export`,
              };
            }
          }
          return {
            manifest: createFrontendFeatureManifest(
              feature,
              sync ? { sync } : undefined,
            ),
          };
        })(),
        new Promise<never>((_, reject) => {
          timer = setTimeout(
            () => reject(new Error(`timed out after ${input.timeoutMs}ms`)),
            input.timeoutMs,
          );
        }),
      ]);
      report({ key: pkg.key, ...result });
    } catch (error) {
      report({ key: pkg.key, error: errorMessage(error) });
    } finally {
      clearTimeout(timer);
    }
  }
}

main().then(
  () => process.exit(0),
  error => {
    process.stderr.write(`${String(error?.stack ?? error)}\n`);
    process.exit(1);
  },
);
