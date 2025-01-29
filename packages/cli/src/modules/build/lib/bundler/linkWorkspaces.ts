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

import { relative as relativePath } from 'path';
import { getPackages } from '@manypkg/get-packages';
import webpack from 'webpack';
import { paths } from '../../../../lib/paths';

/**
 * This returns of collection of plugins that links a separate workspace into
 * the target one. Any packages that are present in the linked workspaces will
 * always be used in place of the ones in the target workspace, with the exception
 * of react and react-dom which are always resolved from the target workspace.
 */
export async function createWorkspaceLinkingPlugins(
  bundler: typeof webpack,
  workspace: string,
) {
  const { packages: linkedPackages, root: linkedRoot } = await getPackages(
    workspace,
  );

  // Matches all packages in the linked workspaces, as well as sub-path exports from them
  const replacementRegex = new RegExp(
    `^(?:${linkedPackages
      .map(pkg => pkg.packageJson.name)
      .join('|')})(?:/.*)?$`,
  );

  return [
    // Any imports of a package that is present in the linked workspace will
    // be redirected to be resolved within the context of the linked workspace
    new bundler.NormalModuleReplacementPlugin(replacementRegex, resource => {
      resource.context = linkedRoot.dir;
    }),
    // react and react-dom are always resolved from the target directory
    // Note: this often requires that the linked and target workspace use the same versions of React
    new bundler.NormalModuleReplacementPlugin(
      /^react(?:-router)?(?:-dom)?$/,
      resource => {
        if (!relativePath(linkedRoot.dir, resource.context).startsWith('..')) {
          resource.context = paths.targetDir;
        }
      },
    ),
  ];
}
