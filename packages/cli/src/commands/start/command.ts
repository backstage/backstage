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

import { Command } from 'commander';
import { startBackend } from './startBackend';
import { startFrontend } from './startFrontend';
import { findRoleFromCommand } from '../../lib/role';

export async function command(cmd: Command): Promise<void> {
  const role = await findRoleFromCommand(cmd);

  const options = {
    configPaths: cmd.config as string[],
    checksEnabled: Boolean(cmd.check),
    inspectEnabled: Boolean(cmd.inspect),
    inspectBrkEnabled: Boolean(cmd.inspectBrk),
  };

  switch (role) {
    case 'backend':
    case 'plugin-backend':
    case 'plugin-backend-module':
    case 'node-library':
      return startBackend(options);
    case 'app':
      return startFrontend({
        ...options,
        entry: 'src/index',
        verifyVersions: true,
      });
    case 'web-library':
    case 'plugin-frontend':
    case 'plugin-frontend-module':
      return startFrontend({ entry: 'dev/index', ...options });
    default:
      throw new Error(
        `Start command is not supported for package role '${role}'`,
      );
  }
}
