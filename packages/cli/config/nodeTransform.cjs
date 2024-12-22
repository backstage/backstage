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

const { transformSync } = require('@swc/core');
const { addHook } = require('pirates');
const { Module } = require('module');

// This hooks into module resolution and overrides imports of packages that
// exist in the linked workspace to instead be resolved from the linked workspace.
if (process.env.BACKSTAGE_CLI_LINKED_WORKSPACE) {
  const { join: joinPath } = require('path');
  const { getPackagesSync } = require('@manypkg/get-packages');
  const { packages: linkedPackages, root: linkedRoot } = getPackagesSync(
    process.env.BACKSTAGE_CLI_LINKED_WORKSPACE,
  );

  // Matches all packages in the linked workspaces, as well as sub-path exports from them
  const replacementRegex = new RegExp(
    `^(?:${linkedPackages
      .map(pkg => pkg.packageJson.name)
      .join('|')})(?:/.*)?$`,
  );

  const origLoad = Module._load;
  Module._load = function requireHook(request, parent) {
    if (!replacementRegex.test(request)) {
      return origLoad.call(this, request, parent);
    }

    // The package import that we're overriding will always existing in the root
    // node_modules of the linked workspace, so it's enough to override the
    // parent paths with that single entry
    return origLoad.call(this, request, {
      ...parent,
      paths: [joinPath(linkedRoot.dir, 'node_modules')],
    });
  };
}

addHook(
  (code, filename) => {
    const transformed = transformSync(code, {
      filename,
      sourceMaps: 'inline',
      module: { type: 'commonjs' },
      jsc: {
        target: 'es2022',
        parser: {
          syntax: 'typescript',
        },
      },
    });
    process.send?.({ type: 'watch', path: filename });
    return transformed.code;
  },
  { extensions: ['.ts', '.cts'], ignoreNodeModules: true },
);

addHook(
  (code, filename) => {
    process.send?.({ type: 'watch', path: filename });
    return code;
  },
  { extensions: ['.js', '.cjs'], ignoreNodeModules: true },
);
