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
import { resolve as resolvePath } from 'path';
import { Plugin } from 'rollup';

/**
 * Rollup plugin that copies common asset directories to the dist folder.
 * This ensures that assets like migrations and templates are available
 * at predictable locations in built packages.
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

      for (const assetDir of assetDirs) {
        const sourcePath = resolvePath(targetDir, assetDir);
        const destPath = resolvePath(distDir, assetDir);

        try {
          if (await fs.pathExists(sourcePath)) {
            await fs.copy(sourcePath, destPath);
            console.log(`Copied ${assetDir} directory to dist`);
          }
        } catch (error) {
          // Non-critical error, continue build
          console.warn(`Warning: Could not copy ${assetDir} directory:`, error.message);
        }
      }
    },
  };
}