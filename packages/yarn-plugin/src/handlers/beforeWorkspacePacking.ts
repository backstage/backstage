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
import { inferPackageVersion } from '../util';
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
  for (const dependencyType of [
    'dependencies',
    'devDependencies',
    'peerDependencies',
  ] as const) {
    const entries = Array.from(
      workspace.manifest.getForScope(dependencyType).values(),
    ).filter(
      descriptor =>
        structUtils.parseRange(descriptor.range).protocol === PROTOCOL,
    );

    for (const descriptor of entries) {
      const finalDependencyType = getFinalDependencyType(
        dependencyType,
        descriptor,
        workspace,
      );
      const ident = structUtils.stringifyIdent(descriptor);

      rawManifest[finalDependencyType][ident] = await inferPackageVersion(
        descriptor,
      );
    }
  }
};
