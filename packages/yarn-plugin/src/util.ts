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

import { ppath, xfs } from '@yarnpkg/fslib';
import { valid as semverValid } from 'semver';
import { memoize } from 'lodash';
import { getManifestByVersion as getManifestByVersionBase } from '@backstage/release-manifests';
import { BACKSTAGE_JSON, findPaths } from '@backstage/cli-common';
import { Descriptor, structUtils } from '@yarnpkg/core';
import { PROTOCOL } from './constants';

const getManifestByVersion = memoize(
  getManifestByVersionBase,
  ({ version }) => version,
);

export const getCurrentBackstageVersion = () => {
  const workspaceRoot = ppath.resolve(findPaths(ppath.cwd()).targetRoot);

  const backstageJson = xfs.readJsonSync(
    ppath.join(workspaceRoot, BACKSTAGE_JSON),
  );

  const backstageVersion = semverValid(backstageJson.version);

  if (backstageVersion === null) {
    throw new Error('Valid version string not found in backstage.json');
  }

  return backstageVersion;
};

export const bindBackstageVersion = (
  descriptor: Descriptor,
  backstageVersion: string,
) => {
  return structUtils.bindDescriptor(descriptor, { v: backstageVersion });
};

export const getPackageVersion = async (descriptor: Descriptor) => {
  const ident = structUtils.stringifyIdent(descriptor);
  const range = structUtils.parseRange(descriptor.range);

  if (range.protocol !== PROTOCOL) {
    throw new Error(
      `Unsupported version protocol in version range "${descriptor.range}" for package ${ident}`,
    );
  }

  if (range.selector !== '^') {
    throw new Error(
      `Unexpected version selector "${range.selector}" for package ${ident}`,
    );
  }

  if (!range.params?.v) {
    throw new Error(
      `Missing Backstage version parameter in range "${descriptor.range}" for package ${ident}`,
    );
  }

  if (Array.isArray(range.params.v)) {
    throw new Error(
      `Multiple Backstage versions specified in range "${descriptor.range}" for package ${ident}`,
    );
  }

  const manifest = await getManifestByVersion({
    version: range.params.v,
  });

  const manifestEntry = manifest.packages.find(
    candidate => candidate.name === ident,
  );

  if (!manifestEntry) {
    throw new Error(
      `Package ${ident} not found in manifest for Backstage v${range.selector}. ` +
        `This means the specified package is not included in this Backstage ` +
        `release. This may imply the package has been replaced with an alternative - ` +
        `please review the documentation for the package. If you need to continue ` +
        `using this package, it will be necessary to switch to manually managing its ` +
        `version.`,
    );
  }

  return manifestEntry.version;
};
