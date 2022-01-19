/*
 * Copyright 2022 The Backstage Authors
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

/**
 * Mapping between a Backstage release and individual package versions.
 * @public
 */
import { resolvePackagePath } from '@backstage/backend-common';
import fs from 'fs-extra';
import path from 'path';

const RELEASE_DIR = resolvePackagePath(
  '@backstage/release-manifest',
  'releases',
);

export type ReleaseManifest = {
  packages: Map<string, string>;
};

export async function getRelease(version: string): Promise<ReleaseManifest> {
  const pkgs = new Map<string, string>();
  try {
    const content = await fs.readFile(path.resolve(RELEASE_DIR, `${version}`));
    for (const line of content.toString().split('\n')) {
      const [pkg, version] = line.split('=');
      pkgs.set(pkg, version);
    }
  } catch (e) {
    throw new Error(`No release found for ${version} version`);
  }
  return { packages: pkgs };
}

export type ReleaseList = {
  items: {
    version: string;
  }[];
};

export async function listReleases(): Promise<ReleaseList> {
  const files = await fs.readdir(RELEASE_DIR);
  return { items: files.map(file => ({ version: file })) };
}
