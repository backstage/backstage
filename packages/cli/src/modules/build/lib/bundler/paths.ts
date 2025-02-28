/*
 * Copyright 2020 The Backstage Authors
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
import { paths } from '../../../../lib/paths';

export type BundlingPathsOptions = {
  // bundle entrypoint, e.g. 'src/index'
  entry: string;
  // Target directory, defaulting to paths.targetDir
  targetDir?: string;
  // Relative dist directory, defaulting to 'dist'
  dist?: string;
};

export function resolveBundlingPaths(options: BundlingPathsOptions) {
  const { entry, targetDir = paths.targetDir } = options;

  const resolveTargetModule = (pathString: string) => {
    for (const ext of ['mjs', 'js', 'ts', 'tsx', 'jsx']) {
      const filePath = resolvePath(targetDir, `${pathString}.${ext}`);
      if (fs.pathExistsSync(filePath)) {
        return filePath;
      }
    }
    return resolvePath(targetDir, `${pathString}.js`);
  };

  let targetPublic = undefined;
  let targetHtml = resolvePath(targetDir, 'public/index.html');

  // Prefer public folder
  if (fs.pathExistsSync(targetHtml)) {
    targetPublic = resolvePath(targetDir, 'public');
  } else {
    targetHtml = resolvePath(targetDir, `${entry}.html`);
    if (!fs.pathExistsSync(targetHtml)) {
      targetHtml = paths.resolveOwn('templates/serve_index.html');
    }
  }

  // Backend plugin dev run file
  const targetRunFile = resolvePath(targetDir, 'src/run.ts');
  const runFileExists = fs.pathExistsSync(targetRunFile);

  return {
    targetHtml,
    targetPublic,
    targetPath: resolvePath(targetDir, '.'),
    targetRunFile: runFileExists ? targetRunFile : undefined,
    targetDist: resolvePath(targetDir, options.dist ?? 'dist'),
    targetAssets: resolvePath(targetDir, 'assets'),
    targetSrc: resolvePath(targetDir, 'src'),
    targetDev: resolvePath(targetDir, 'dev'),
    targetEntry: resolveTargetModule(entry),
    targetTsConfig: paths.resolveTargetRoot('tsconfig.json'),
    targetPackageJson: resolvePath(targetDir, 'package.json'),
    rootNodeModules: paths.resolveTargetRoot('node_modules'),
    root: paths.targetRoot,
  };
}

export async function resolveOptionalBundlingPaths(
  options: BundlingPathsOptions,
) {
  const resolvedPaths = resolveBundlingPaths(options);
  if (await fs.pathExists(resolvedPaths.targetEntry)) {
    return resolvedPaths;
  }
  return undefined;
}

export type BundlingPaths = ReturnType<typeof resolveBundlingPaths>;
