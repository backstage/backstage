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
import { resolve as resolvePath } from 'node:path';
import {
  getModuleFederationRemoteOptions,
  serveBundle,
} from '../../../../build/lib/bundler';
import { targetPaths } from '@backstage/cli-common';

import { BackstagePackageJson } from '@backstage/cli-node';
import { hasReactDomClient } from '../../../../build/lib/bundler/hasReactDomClient';

interface StartAppOptions {
  verifyVersions?: boolean;
  entry: string;
  targetDir?: string;

  checksEnabled: boolean;
  configPaths: string[];
  skipOpenBrowser?: boolean;
  isModuleFederationRemote?: boolean;
  linkedWorkspace?: string;
}

export async function startFrontend(options: StartAppOptions) {
  const packageJson = (await readJson(
    resolvePath(options.targetDir ?? targetPaths.resolve(), 'package.json'),
  )) as BackstagePackageJson;

  if (!hasReactDomClient()) {
    console.warn(
      'React 17 is now deprecated! Please follow the Backstage migration guide to update to React 18: https://backstage.io/docs/tutorials/react18-migration/',
    );
  }

  const waitForExit = await serveBundle({
    entry: options.entry,
    targetDir: options.targetDir,
    checksEnabled: options.checksEnabled,
    configPaths: options.configPaths,
    verifyVersions: options.verifyVersions,
    skipOpenBrowser: options.skipOpenBrowser,
    linkedWorkspace: options.linkedWorkspace,
    moduleFederationRemote: options.isModuleFederationRemote
      ? await getModuleFederationRemoteOptions(
          packageJson,
          resolvePath(targetPaths.resolve()),
        )
      : undefined,
  });

  await waitForExit();
}
