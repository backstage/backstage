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
  fromDescriptor: Descriptor,
  toDescriptor: Descriptor,
) => {
  const toDescriptorRange = structUtils.parseRange(toDescriptor.range);

  if (
    toDescriptor.scope === 'backstage' &&
    toDescriptorRange.protocol !== PROTOCOL
  ) {
    try {
      await getPackageVersion(toDescriptor, workspace.project.configuration);
      // is there a better way to log than console.log?
      console.log(
        `afterWorkspaceDependencyReplacement hook: Setting descriptor range from '${fromDescriptor.range}' to '${toDescriptor.range}' for ${fromDescriptor.scope}/${fromDescriptor.name}.  Are you sure you want to be doing that?`,
      );
    } catch (_error: any) {
      // if there's no found version then this is likely a deprecated package
      // or otherwise the plugin won't be able to resolve the real version
      // and we should not warn them.
    }
  }
};
