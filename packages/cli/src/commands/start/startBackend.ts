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
import { paths } from '../../lib/paths';
import { serveBackend } from '../../lib/bundler';
import { startBackendExperimental } from '../../lib/experimental/startBackendExperimental';

interface StartBackendOptions {
  checksEnabled: boolean;
  inspectEnabled: boolean;
  inspectBrkEnabled: boolean;
}

export async function startBackend(options: StartBackendOptions) {
  if (!process.env.LEGACY_BACKEND_START) {
    const waitForExit = await startBackendExperimental({
      entry: 'src/index',
      checksEnabled: false, // not supported
      inspectEnabled: options.inspectEnabled,
      inspectBrkEnabled: options.inspectBrkEnabled,
    });

    await waitForExit();
  } else {
    // Cleaning dist/ before we start the dev process helps work around an issue
    // where we end up with the entrypoint executing multiple times, causing
    // a port bind conflict among other things.
    await fs.remove(paths.resolveTarget('dist'));

    const waitForExit = await serveBackend({
      entry: 'src/index',
      checksEnabled: options.checksEnabled,
      inspectEnabled: options.inspectEnabled,
      inspectBrkEnabled: options.inspectBrkEnabled,
    });

    await waitForExit();
  }
}

export async function startBackendPlugin(options: StartBackendOptions) {
  if (!process.env.LEGACY_BACKEND_START) {
    const hasEntry = await fs.pathExists(paths.resolveTarget('dev'));
    if (!hasEntry) {
      console.warn(
        `dev directory doesn't exist. \
It looks like this plugin hasn't been migrated to the new backend system. \
Please run "LEGACY_BACKEND_START=1 yarn start" instead.`,
      );
      return;
    }

    const waitForExit = await startBackendExperimental({
      entry: 'dev/index',
      checksEnabled: false, // not supported
      inspectEnabled: options.inspectEnabled,
      inspectBrkEnabled: options.inspectBrkEnabled,
    });

    await waitForExit();
  } else {
    const hasEntry = await fs.pathExists(paths.resolveTarget('src', 'run.ts'));
    if (!hasEntry) {
      console.log(`src/run.ts is missing.`);
      return;
    }
    // Cleaning dist/ before we start the dev process helps work around an issue
    // where we end up with the entrypoint executing multiple times, causing
    // a port bind conflict among other things.
    await fs.remove(paths.resolveTarget('dist'));

    const waitForExit = await serveBackend({
      entry: 'src/run',
      checksEnabled: options.checksEnabled,
      inspectEnabled: options.inspectEnabled,
      inspectBrkEnabled: options.inspectBrkEnabled,
    });

    await waitForExit();
  }
}
