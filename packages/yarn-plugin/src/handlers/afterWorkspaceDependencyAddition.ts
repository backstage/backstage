/*
 * Copyright 2025 The Backstage Authors
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

import { Descriptor, structUtils, Workspace } from '@yarnpkg/core';
import { suggestUtils } from '@yarnpkg/plugin-essentials';
import { getPackageVersion } from '../util';
import { PROTOCOL } from '../constants';

export const afterWorkspaceDependencyAddition = async (
  workspace: Workspace,
  _target: suggestUtils.Target,
  descriptor: Descriptor,
  _strategies: Array<suggestUtils.Strategy>,
) => {
  const descriptorRange = structUtils.parseRange(descriptor.range);

  if (
    descriptor.scope === 'backstage' &&
    descriptorRange.protocol !== PROTOCOL
  ) {
    const originalRange = descriptor.range;
    try {
      descriptor.range = `${PROTOCOL}^`;
      await getPackageVersion(descriptor, workspace.project.configuration); // Verify that the actual version can be resolved
      console.info(
        `Setting ${descriptor.scope}/${descriptor.name} to ${PROTOCOL}^`,
      );
    } catch (_error: any) {
      // if there's no found version then this is likely a deprecated package
      // or otherwise the plugin won't be able to resolve the real version
      // and we should leave the desired range as is
      descriptor.range = originalRange;
    }
  }
};
