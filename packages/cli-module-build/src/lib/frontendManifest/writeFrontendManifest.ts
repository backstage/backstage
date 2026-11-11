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
  FRONTEND_MANIFEST_FILE_NAME,
  FRONTEND_MANIFEST_VERSION,
  FrontendPackageManifest,
} from './types';

/**
 * Analyzes the source of the modules that a module federation remote
 * exposes, and writes the manifest of each one that is a plugin or module to
 * `frontend-manifest.json` in the output directory of the remote. The
 * manifest lets apps defer loading the plugins of the remote.
 */
export async function writeFrontendManifest(options: {
  /** The directory of the package. */
  packageDir: string;
  /** The output directory of the remote, next to `mf-manifest.json`. */
  distDir: string;
  /**
   * The exposed modules of the remote, keyed by their name in the exposes
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

  const manifest: FrontendPackageManifest = {
    manifestVersion: FRONTEND_MANIFEST_VERSION,
    entryPoints: {},
  };
  for (const [entryPoint, entry] of Object.entries(analysis.entryPoints)) {
    if ('manifest' in entry) {
      manifest.entryPoints[entryPoint] = entry.manifest;
    }
  }
  await fs.outputJson(
    resolvePath(options.distDir, FRONTEND_MANIFEST_FILE_NAME),
    manifest,
    { spaces: 2 },
  );
}
