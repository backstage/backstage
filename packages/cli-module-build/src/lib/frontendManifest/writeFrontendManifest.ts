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
import { readEntryPoints } from '../entryPoints';
import { analyzeFrontendPackage } from './analyzeFrontendPackage';
import { createPackageManifest } from './readPackageManifest';
import { FRONTEND_MANIFEST_PATH } from './types';

const MANIFEST_ROLES = ['frontend-plugin', 'frontend-plugin-module'];

/** Whether the role of a package gets a frontend manifest when it's built. */
export function hasFrontendManifest(packageJson: BackstagePackageJson) {
  return MANIFEST_ROLES.includes(packageJson.backstage?.role ?? '');
}

/**
 * Analyzes the source of a frontend plugin package and writes its manifest
 * to `dist/frontend-manifest.json`, which lets apps defer loading it.
 */
export async function writeFrontendManifest(
  packageDir: string,
  packageJson: BackstagePackageJson,
): Promise<void> {
  if (!hasFrontendManifest(packageJson)) {
    return;
  }
  const analysis = analyzeFrontendPackage({
    packageDir,
    entryPoints: readEntryPoints(packageJson),
  });
  await fs.outputJson(
    resolvePath(packageDir, FRONTEND_MANIFEST_PATH),
    createPackageManifest(analysis),
    { spaces: 2 },
  );
}
