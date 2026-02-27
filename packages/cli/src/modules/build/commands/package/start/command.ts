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

import { cli } from 'cleye';
import { startPackage } from './startPackage';
import { resolveLinkedWorkspace } from './resolveLinkedWorkspace';
import { findRoleFromCommand } from '../../../lib/role';
import { targetPaths } from '@backstage/cli-common';
import type { CommandContext } from '../../../../../wiring/types';

export default async ({ args, info }: CommandContext) => {
  const {
    flags: {
      config,
      role,
      check,
      inspect,
      inspectBrk,
      require: requirePaths,
      link,
      entrypoint,
    },
  } = cli(
    {
      help: info,
      flags: {
        config: {
          type: [String],
          description: 'Config files to load instead of app-config.yaml',
          default: [],
        },
        role: {
          type: String,
          description: 'Run the command with an explicit package role',
        },
        check: {
          type: Boolean,
          description: 'Enable type checking and linting if available',
        },
        inspect: {
          type: String,
          description: 'Enable debugger in Node.js environments',
        },
        inspectBrk: {
          type: String,
          description:
            'Enable debugger in Node.js environments, breaking before code starts',
        },
        require: {
          type: [String],
          description: 'Add a --require argument to the node process',
        },
        link: {
          type: String,
          description: 'Link an external workspace for module resolution',
        },
        entrypoint: {
          type: String,
          description:
            'The entrypoint to start from, relative to the package root. Can point to either a file (without extension) or a directory (in which case the index file in that directory is used). Defaults to "dev"',
        },
      },
    },
    undefined,
    args,
  );

  await startPackage({
    role: await findRoleFromCommand({ role }),
    entrypoint,
    targetDir: targetPaths.dir,
    configPaths: config,
    checksEnabled: Boolean(check),
    linkedWorkspace: await resolveLinkedWorkspace(link),
    inspectEnabled: inspect,
    inspectBrkEnabled: inspectBrk,
    require: requirePaths?.[0],
  });
};
