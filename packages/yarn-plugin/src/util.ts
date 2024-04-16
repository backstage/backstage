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

import { npath, xfs } from '@yarnpkg/fslib';
import { valid as semverValid } from 'semver';
import { getManifestByVersion } from '@backstage/release-manifests';
import { Descriptor, structUtils } from '@yarnpkg/core';
import { PROTOCOL } from './constants';

export const getCurrentBackstageVersion = () => {
  const backstageJson = xfs.readJsonSync(
    npath.toPortablePath('./backstage.json'),
  );

  const backstageVersion = semverValid(backstageJson.version);

  if (backstageVersion === null) {
    throw new Error('Valid version string not found in backstage.json');
  }

  return backstageVersion;
};

export const getPackageVersion = async (descriptor: Descriptor) => {
  const ident = structUtils.stringifyIdent(descriptor);
  const range = structUtils.parseRange(descriptor.range);

  if (range.protocol !== PROTOCOL) {
    throw new Error(`Unexpected ${range.protocol} range when packing`);
  }

  if (!semverValid(range.selector)) {
    throw new Error(`Missing backstage version in range ${descriptor.range}`);
  }

  const manifest = await getManifestByVersion({
    version: range.selector,
  });

  const manifestEntry = manifest.packages.find(
    candidate => candidate.name === ident,
  );

  if (!manifestEntry) {
    throw new Error(`Package ${ident} not found in manifest`);
  }

  return manifestEntry.version;
};
