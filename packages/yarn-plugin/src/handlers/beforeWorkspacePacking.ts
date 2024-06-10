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

import { Descriptor, Workspace, structUtils } from '@yarnpkg/core';
import { getCurrentBackstageVersion, getPackageVersion } from '../util';
import { PROTOCOL } from '../constants';

const getFinalDependencyType = (
  dependencyType: string,
  descriptor: Descriptor,
  workspace: Workspace,
) => {
  if (dependencyType !== 'dependencies') {
    return dependencyType;
  }

  return workspace.manifest.ensureDependencyMeta(
    structUtils.makeDescriptor(descriptor, 'unknown'),
  ).optional
    ? 'optionalDependencies'
    : dependencyType;
};

export const beforeWorkspacePacking = async (
  workspace: Workspace,
  rawManifest: any,
) => {
  const backstageVersion = getCurrentBackstageVersion();

  for (const dependencyType of ['dependencies', 'devDependencies'] as const) {
    const entries = Array.from(
      workspace.manifest.getForScope(dependencyType).values(),
    ).filter(descriptor => descriptor.range.startsWith(PROTOCOL));

    for (const descriptor of entries) {
      const ident = structUtils.stringifyIdent(descriptor);
      const range = structUtils.parseRange(descriptor.range);

      if (range.selector !== '^') {
        throw new Error(
          `Unexpected version range "${descriptor.range}" for dependency on "${ident}"`,
        );
      }

      const finalDependencyType = getFinalDependencyType(
        dependencyType,
        descriptor,
        workspace,
      );

      rawManifest[finalDependencyType][ident] = `^${await getPackageVersion(
        structUtils.makeDescriptor(
          descriptor,
          `${PROTOCOL}${backstageVersion}`,
        ),
      )}`;
    }
  }
};
