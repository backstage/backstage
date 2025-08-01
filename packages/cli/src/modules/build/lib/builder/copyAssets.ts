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

import fs from 'fs-extra';
import { resolve as resolvePath, relative as relativePath } from 'path';
import { Plugin } from 'rollup';

/**
 * Rollup plugin that copies common asset directories to the dist folder
 * and generates asset resolver modules for reliable runtime asset discovery.
 */
export function copyAssetDirectories(): Plugin {
  return {
    name: 'backstage-copy-assets',
    generateBundle: async (options, bundle) => {
      if (!options.dir) {
        return;
      }

      const targetDir = process.cwd();
      const distDir = options.dir;

      // Common asset directories to copy
      const assetDirs = ['migrations', 'assets', 'templates'];
      const resolverModules: string[] = [];

      for (const assetDir of assetDirs) {
        const sourcePath = resolvePath(targetDir, assetDir);
        const destPath = resolvePath(distDir, assetDir);

        try {
          if (await fs.pathExists(sourcePath)) {
            await fs.copy(sourcePath, destPath);
            console.log(`Copied ${assetDir} directory to dist`);

            // Generate a resolver module for this asset directory
            const resolverModuleName = `__${assetDir}_resolver__.js`;
            const resolverModulePath = resolvePath(distDir, resolverModuleName);
            
            // Create a module that exports the asset path relative to its location
            const resolverContent = `// Auto-generated asset resolver
const { resolve } = require('path');
module.exports = resolve(__dirname, '${assetDir}');
`;
            
            await fs.writeFile(resolverModulePath, resolverContent);
            resolverModules.push(resolverModuleName);
          }
        } catch (error) {
          // Non-critical error, continue build
          console.warn(`Warning: Could not copy ${assetDir} directory:`, error.message);
        }
      }

      // Generate a main asset resolver index
      if (resolverModules.length > 0) {
        const indexResolverPath = resolvePath(distDir, '__asset_resolvers__.js');
        const indexContent = `// Auto-generated asset resolver index
const { resolve } = require('path');

const resolvers = {
${resolverModules.map(module => {
  const assetName = module.replace('__', '').replace('_resolver__.js', '');
  return `  '${assetName}': () => require('./${module}'),`;
}).join('\n')}
};

module.exports = {
  resolveAsset: (assetName) => {
    const resolver = resolvers[assetName];
    return resolver ? resolver() : null;
  },
  getAvailableAssets: () => Object.keys(resolvers),
};
`;
        
        await fs.writeFile(indexResolverPath, indexContent);
      }
    },
  };
}