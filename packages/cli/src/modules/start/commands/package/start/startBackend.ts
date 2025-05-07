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

import fs from 'fs-extra';
import { resolve as resolvePath } from 'path';
import { paths } from '../../../../../lib/paths';
import { runBackend } from '../../../lib/runner';

interface StartBackendOptions {
  targetDir: string;
  checksEnabled: boolean;
  inspectEnabled?: boolean | string;
  inspectBrkEnabled?: boolean | string;
  linkedWorkspace?: string;
  require?: string;
}

export async function startBackend(options: StartBackendOptions) {
  const waitForExit = await runBackend({
    targetDir: options.targetDir,
    entry: 'src/index',
    inspectEnabled: options.inspectEnabled,
    inspectBrkEnabled: options.inspectBrkEnabled,
    linkedWorkspace: options.linkedWorkspace,
    require: options.require,
  });

  await waitForExit();
}

export async function startBackendPlugin(options: StartBackendOptions) {
  const hasDevIndexEntry = await fs.pathExists(
    resolvePath(options.targetDir ?? paths.targetDir, 'dev/index.ts'),
  );
  if (!hasDevIndexEntry) {
    console.warn(
      `The 'dev' directory is missing. Please create a proper dev/index.ts in order to start the plugin.`,
    );
    return;
  }

  const waitForExit = await runBackend({
    targetDir: options.targetDir,
    entry: 'dev/index',
    inspectEnabled: options.inspectEnabled,
    inspectBrkEnabled: options.inspectBrkEnabled,
    require: options.require,
    linkedWorkspace: options.linkedWorkspace,
  });

  await waitForExit();
}
