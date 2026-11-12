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
import { analyzeFrontendPackage } from './analyzeFrontendPackage';
import {
  BACKSTAGE_MANIFEST_FILE_NAME,
  BACKSTAGE_MANIFEST_VERSION,
  BackstageManifest,
  FrontendPackageManifest,
} from './types';

/**
 * Analyzes the source of the entry points of a frontend package, and writes
 * the manifest of each one that is a plugin or module to the `frontend`
 * section of `backstage-manifest.json` in the output directory. The manifest
 * lets apps defer loading the plugins of the package.
 */
export async function writeBackstageManifest(options: {
  /** The directory of the package. */
  packageDir: string;
  /** The output directory, which is next to `mf-manifest.json` for a remote. */
  distDir: string;
  /**
   * The exposed modules of the package, keyed by their name in the exposes
   * option, for example "." or "./alpha", with the path of their source.
   */
  exposes: { [name: string]: string };
}): Promise<void> {
  const analysis = analyzeFrontendPackage({
    packageDir: options.packageDir,
    entryPoints: Object.entries(options.exposes).map(([mount, path]) => ({
      mount,
      path,
    })),
  });

  const frontend: FrontendPackageManifest = { exposedModules: {} };
  for (const [entryPoint, entry] of Object.entries(analysis.entryPoints)) {
    if ('manifest' in entry) {
      frontend.exposedModules[entryPoint] = entry.manifest;
    }
  }

  const packageJson = await fs.readJson(
    resolvePath(options.packageDir, 'package.json'),
  );
  const role = packageJson.backstage?.role;
  if (typeof packageJson.name !== 'string' || typeof role !== 'string') {
    throw new Error(
      `Unable to write the Backstage manifest, ${options.packageDir}/package.json must have a name and a backstage.role`,
    );
  }
  const manifest: BackstageManifest = {
    manifestVersion: BACKSTAGE_MANIFEST_VERSION,
    packageName: packageJson.name,
    role,
    frontend,
  };
  await fs.outputJson(
    resolvePath(options.distDir, BACKSTAGE_MANIFEST_FILE_NAME),
    manifest,
    { spaces: 2 },
  );
}
