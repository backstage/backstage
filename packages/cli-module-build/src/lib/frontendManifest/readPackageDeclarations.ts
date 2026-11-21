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

import { relative as relativePath, resolve as resolvePath } from 'node:path';
import { targetPaths } from '@backstage/cli-common';
import { readFrontendManifestFromTypes } from './readFrontendManifestFromTypes';
import { FrontendPackageAnalysis } from './types';

/**
 * Reads the manifests of the entry points of a frontend package from the type
 * declarations that `yarn tsc` emits to `dist-types`.
 *
 * @remarks
 *
 * Entry points that aren't TypeScript files are ignored. Entry points that
 * aren't plugins have no manifest, and are skipped with the reason.
 *
 * @throws If the declarations of an entry point don't exist.
 */
export function readPackageDeclarations(options: {
  /** The directory of the package. */
  packageDir: string;
  /**
   * The entry points of the package, keyed by their mount point, for example
   * "." or "./alpha", with the path of their source, which is relative to the
   * package or absolute.
   */
  entryPoints: Array<{ mount: string; path: string }>;
  /**
   * The directory of the declarations of the package. Defaults to the folder
   * of the package in the `dist-types` folder of the repository.
   */
  declarationsDir?: string;
}): FrontendPackageAnalysis {
  const declarationsDir =
    options.declarationsDir ??
    targetPaths.resolveRoot(
      'dist-types',
      relativePath(targetPaths.rootDir, options.packageDir),
    );

  const result: FrontendPackageAnalysis = { entryPoints: {} };
  for (const { mount, path } of options.entryPoints) {
    if (!/\.tsx?$/.test(path)) {
      continue;
    }
    const packagePath = relativePath(
      options.packageDir,
      resolvePath(options.packageDir, path),
    );
    result.entryPoints[mount] = readFrontendManifestFromTypes({
      entryPoint: resolvePath(
        declarationsDir,
        packagePath.replace(/\.tsx?$/, '.d.ts'),
      ),
    });
  }
  return result;
}
