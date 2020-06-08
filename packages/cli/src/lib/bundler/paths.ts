/*
 * Copyright 2020 Spotify AB
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
import { paths } from '../paths';

export type BundlingPathsOptions = {
  // bundle entrypoint, e.g. 'src/index'
  entry: string;
};

export function resolveBundlingPaths(options: BundlingPathsOptions) {
  const { entry } = options;

  const resolveTargetModule = (path: string) => {
    for (const ext of ['mjs', 'js', 'ts', 'tsx', 'jsx']) {
      const filePath = paths.resolveTarget(`${path}.${ext}`);
      if (fs.pathExistsSync(filePath)) {
        return filePath;
      }
    }
    return paths.resolveTarget(`${path}.js`);
  };

  let targetPublic = undefined;
  let targetHtml = paths.resolveTarget('public/index.html');

  // Prefer public folder
  if (fs.pathExistsSync(targetHtml)) {
    targetPublic = paths.resolveTarget('public');
  } else {
    targetHtml = paths.resolveTarget(`${entry}.html`);
    if (!fs.pathExistsSync(targetHtml)) {
      targetHtml = paths.resolveOwn('templates/serve_index.html');
    }
  }

  return {
    targetHtml,
    targetPublic,
    targetPath: paths.resolveTarget('.'),
    targetDist: paths.resolveTarget('dist'),
    targetAssets: paths.resolveTarget('assets'),
    targetSrc: paths.resolveTarget('src'),
    targetDev: paths.resolveTarget('dev'),
    targetEntry: resolveTargetModule(entry),
    targetTsConfig: paths.resolveTargetRoot('tsconfig.json'),
    targetNodeModules: paths.resolveTarget('node_modules'),
    targetPackageJson: paths.resolveTarget('package.json'),
  };
}

export type BundlingPaths = ReturnType<typeof resolveBundlingPaths>;
