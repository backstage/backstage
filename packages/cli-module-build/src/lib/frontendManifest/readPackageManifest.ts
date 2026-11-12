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

import fs from 'fs-extra';
import { resolve as resolvePath } from 'node:path';
import { FrontendPackageAnalysis } from './analyzeFrontendPackage';
import {
  BACKSTAGE_MANIFEST_FILE_NAME,
  BACKSTAGE_MANIFEST_VERSION,
  BackstageManifest,
  FRONTEND_MANIFEST_VERSION,
} from './types';

/**
 * Reads the `frontend` section of the `dist/backstage-manifest.json` file
 * that `backstage-cli package prepack` writes to a published package.
 *
 * @remarks
 *
 * A package without the file, or with a manifest of a version that this CLI
 * doesn't know, has no entry points that can be deferred.
 */
export async function readPackageManifest(
  packageDir: string,
): Promise<FrontendPackageAnalysis | { skipped: string }> {
  const manifestPath = resolvePath(
    packageDir,
    'dist',
    BACKSTAGE_MANIFEST_FILE_NAME,
  );
  if (!(await fs.pathExists(manifestPath))) {
    return { skipped: 'the package has no Backstage manifest' };
  }

  let manifest: Partial<BackstageManifest>;
  try {
    manifest = await fs.readJson(manifestPath);
  } catch (error) {
    return {
      skipped: `the Backstage manifest of the package could not be read, ${error}`,
    };
  }
  if (manifest?.manifestVersion !== BACKSTAGE_MANIFEST_VERSION) {
    return {
      skipped: `the Backstage manifest of the package has version ${manifest?.manifestVersion}, but only version ${BACKSTAGE_MANIFEST_VERSION} is supported`,
    };
  }

  const entryPoints: FrontendPackageAnalysis['entryPoints'] = {};
  for (const [entryPoint, entry] of Object.entries(
    manifest.frontend?.exposedModules ?? {},
  )) {
    entryPoints[entryPoint] =
      entry?.manifestVersion === FRONTEND_MANIFEST_VERSION
        ? { manifest: entry }
        : {
            skipped: `the manifest of the entry point has version ${entry?.manifestVersion}, but only version ${FRONTEND_MANIFEST_VERSION} is supported`,
          };
  }
  return { entryPoints };
}
