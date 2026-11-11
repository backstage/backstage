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

import { BackstagePackageJson } from '@backstage/cli-node';
import fs from 'fs-extra';
import { resolve as resolvePath } from 'node:path';
import { FrontendPackageAnalysis } from './analyzeFrontendPackage';
import { FRONTEND_MANIFEST_VERSION, FrontendPackageManifest } from './types';

/**
 * Reads the manifest that `backstage-cli package build` wrote for a
 * published package, which is referenced by `backstage.frontendManifest` in
 * its package.json.
 *
 * @remarks
 *
 * A package without a manifest, or with a manifest of a version that this
 * CLI doesn't know, has no entry points that can be deferred.
 */
export async function readPackageManifest(
  packageDir: string,
  packageJson: BackstagePackageJson,
): Promise<FrontendPackageAnalysis | { skipped: string }> {
  const manifestPath = (
    packageJson.backstage as { frontendManifest?: unknown } | undefined
  )?.frontendManifest;
  if (typeof manifestPath !== 'string') {
    return { skipped: 'the package has no frontend manifest' };
  }

  let manifest: FrontendPackageManifest;
  try {
    manifest = await fs.readJson(resolvePath(packageDir, manifestPath));
  } catch (error) {
    return {
      skipped: `the frontend manifest of the package could not be read, ${error}`,
    };
  }
  if (manifest?.manifestVersion !== FRONTEND_MANIFEST_VERSION) {
    return {
      skipped: `the frontend manifest of the package has version ${manifest?.manifestVersion}, but only version ${FRONTEND_MANIFEST_VERSION} is supported`,
    };
  }

  const entryPoints: FrontendPackageAnalysis['entryPoints'] = {};
  for (const [entryPoint, entry] of Object.entries(
    manifest.entryPoints ?? {},
  )) {
    entryPoints[entryPoint] =
      entry?.manifestVersion === FRONTEND_MANIFEST_VERSION
        ? { manifest: entry }
        : { skipped: 'the manifest of the entry point is invalid' };
  }
  return { entryPoints };
}

/** Creates the manifest file of a package from the analysis of its source. */
export function createPackageManifest(
  analysis: FrontendPackageAnalysis,
): FrontendPackageManifest {
  const entryPoints: FrontendPackageManifest['entryPoints'] = {};
  for (const [entryPoint, entry] of Object.entries(analysis.entryPoints)) {
    if ('manifest' in entry) {
      entryPoints[entryPoint] = entry.manifest;
    }
  }
  return { manifestVersion: FRONTEND_MANIFEST_VERSION, entryPoints };
}
