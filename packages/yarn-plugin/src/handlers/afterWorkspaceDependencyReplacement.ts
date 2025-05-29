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

import { Descriptor, Workspace } from '@yarnpkg/core';
import { suggestUtils } from '@yarnpkg/plugin-essentials';

export const afterWorkspaceDependencyReplacement = async (
  _workspace: Workspace,
  _target: suggestUtils.Target,
  fromDescriptor: Descriptor,
  toDescriptor: Descriptor,
) => {
  if (
    toDescriptor.scope === 'backstage' &&
    toDescriptor.range !== 'backstage:^'
  ) {
    // is there a better way to log than console.log?
    console.log(
      `afterWorkspaceDependencyReplacement hook: Setting descriptor range from '${fromDescriptor.range}' to '${toDescriptor.range}' for ${fromDescriptor.scope}/${fromDescriptor.name}.  Are you sure you want to be doing that?`,
    );
  }
};
