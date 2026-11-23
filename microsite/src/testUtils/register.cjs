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

// Preloaded with `--require` next to `@backstage/cli/config/nodeTransform.cjs`
// when running the plugin directory tests. nodeTransform only compiles `.ts`,
// so this adds the pieces the component tests need on top of it: `.tsx`
// compilation, stubbed styles, and stand-ins for the modules that Docusaurus
// provides at build time.

const path = require('node:path');
const fs = require('node:fs');
const Module = require('node:module');

// Use the same copy of swc as nodeTransform does. Loading a second copy of its
// native binding into one process crashes it.
const { transformSync } = require(require.resolve('@swc/core', {
  paths: [require.resolve('@backstage/cli-node/config/nodeTransform.cjs')],
}));

Module._extensions['.tsx'] = (module, filename) => {
  const { code } = transformSync(fs.readFileSync(filename, 'utf8'), {
    filename,
    sourceMaps: 'inline',
    module: { type: 'commonjs', ignoreDynamic: true },
    jsc: {
      target: 'es2024',
      parser: { syntax: 'typescript', tsx: true },
      transform: { react: { runtime: 'automatic' } },
    },
  });
  module._compile(code, filename);
};

// CSS modules resolve to their own class names.
Module._extensions['.scss'] = module => {
  module.exports = {
    __esModule: true,
    default: new Proxy({}, { get: (_target, property) => String(property) }),
  };
};

const mocks = path.join(__dirname, 'docusaurusMocks');
const aliases = {
  '@docusaurus/Link': path.join(mocks, 'Link.tsx'),
  '@docusaurus/router': path.join(mocks, 'router.ts'),
  '@theme/Layout': path.join(mocks, 'Layout.tsx'),
  '@theme/Tabs': path.join(mocks, 'Tabs.tsx'),
  '@theme/TabItem': path.join(mocks, 'TabItem.tsx'),
};

const resolveFilename = Module._resolveFilename;
Module._resolveFilename = function resolveWithAliases(request, ...rest) {
  return resolveFilename.call(this, aliases[request] ?? request, ...rest);
};
