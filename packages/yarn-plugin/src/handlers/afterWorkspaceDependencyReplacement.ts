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

export const afterWorkspaceDependencyReplacement = async (
  workspace: Workspace,
  _target: suggestUtils.Target,
  _fromDescriptor: Descriptor,
  toDescriptor: Descriptor,
) => {
  const toDescriptorRange = structUtils.parseRange(toDescriptor.range);

  if (
    toDescriptor.scope === 'backstage' &&
    toDescriptorRange.protocol !== PROTOCOL
  ) {
    try {
      await getPackageVersion(toDescriptor, workspace.project.configuration);
      console.warn(
        `${toDescriptor.name} should be set to "${PROTOCOL}^" instead of "${toDescriptor.range}". Make sure this change is intentional and not a mistake.`,
      );
    } catch (_error: any) {
      // if there's no found version then this is likely a deprecated package
      // or otherwise the plugin won't be able to resolve the real version
      // and we should not warn them.
    }
  }
};
