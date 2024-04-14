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

import { Descriptor, structUtils } from '@yarnpkg/core';
import { npath, xfs } from '@yarnpkg/fslib';
import { valid as semverValid } from 'semver';
import { getManifestByVersion } from '@backstage/release-manifests';
import { PROTOCOL } from './constants';

export const inferBackstageVersion = (descriptor: Descriptor) => {
  const range = structUtils.parseRange(descriptor.range);

  if (range.protocol !== PROTOCOL) {
    throw new Error(
      `inferBackstageVersion called with unexpected protocol ${range.protocol}`,
    );
  }

  let selector = range.selector;

  // For backstage:^ we look up the version from backstage.json
  if (selector === `^`) {
    const backstageJson = xfs.readJsonSync(
      npath.toPortablePath('./backstage.json'),
    );

    selector = backstageJson.version;
  }

  if (!semverValid(selector)) {
    throw new Error(
      `Invalid "backstage:" version string found for ${structUtils.stringifyIdent(
        descriptor,
      )}. Version must be either "backstage:*" or "backstage:<version>", where version is a single Backstage release version.`,
    );
  }

  return selector;
};

export const inferPackageVersion = async (descriptor: Descriptor) => {
  const ident = structUtils.stringifyIdent(descriptor);
  const backstageVersion = inferBackstageVersion(descriptor);

  const manifest = await getManifestByVersion({
    version: backstageVersion,
  });

  const manifestEntry = manifest.packages.find(
    candidate => candidate.name === ident,
  );

  if (!manifestEntry) {
    throw new Error(`Package ${ident} not found in manifest`);
  }

  return manifestEntry.version;
};
