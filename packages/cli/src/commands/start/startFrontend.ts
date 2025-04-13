/*
 * Copyright 2020 The Backstage Authors
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

import { readJson } from 'fs-extra';
import { resolve as resolvePath } from 'path';
import {
  getModuleFederationOptions,
  serveBundle,
} from '../../modules/build/lib/bundler';
import { paths } from '../../lib/paths';
import { BackstagePackageJson } from '@backstage/cli-node';

interface StartAppOptions {
  verifyVersions?: boolean;
  entry: string;

  checksEnabled: boolean;
  configPaths: string[];
  skipOpenBrowser?: boolean;
  isModuleFederationRemote?: boolean;
  linkedWorkspace?: string;
}

export async function startFrontend(options: StartAppOptions) {
  const packageJson = (await readJson(
    paths.resolveTarget('package.json'),
  )) as BackstagePackageJson;

  const waitForExit = await serveBundle({
    entry: options.entry,
    checksEnabled: options.checksEnabled,
    configPaths: options.configPaths,
    verifyVersions: options.verifyVersions,
    skipOpenBrowser: options.skipOpenBrowser,
    linkedWorkspace: options.linkedWorkspace,
    moduleFederation: await getModuleFederationOptions(
      packageJson,
      resolvePath(paths.targetDir),
      options.isModuleFederationRemote,
    ),
  });

  await waitForExit();
}
