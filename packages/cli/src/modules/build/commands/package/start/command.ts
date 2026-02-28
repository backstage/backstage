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
  const { inspectEnabled, inspectBrkEnabled, filteredArgs } =
    extractInspectFlags(args);

  const {
    flags: { config, role, check, require: requirePath, link, entrypoint },
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
        require: {
          type: String,
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
    filteredArgs,
  );

  await startPackage({
    role: await findRoleFromCommand({ role }),
    entrypoint,
    targetDir: targetPaths.dir,
    configPaths: config,
    checksEnabled: Boolean(check),
    linkedWorkspace: await resolveLinkedWorkspace(link),
    inspectEnabled,
    inspectBrkEnabled,
    require: requirePath,
  });
};

// --inspect and --inspect-brk accept an optional host value, which cleye
// can't express (it only supports required or no value). We extract them
// from the raw args before passing the rest to cleye.
function extractInspectFlags(args: string[]) {
  let inspectEnabled: boolean | string | undefined;
  let inspectBrkEnabled: boolean | string | undefined;
  const filteredArgs: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--inspect' || arg === '--inspect-brk') {
      const next = args[i + 1];
      const value = next && !next.startsWith('-') ? args[++i] : true;
      if (arg === '--inspect') {
        inspectEnabled = value;
      } else {
        inspectBrkEnabled = value;
      }
    } else if (arg.startsWith('--inspect=')) {
      inspectEnabled = arg.slice('--inspect='.length);
    } else if (arg.startsWith('--inspect-brk=')) {
      inspectBrkEnabled = arg.slice('--inspect-brk='.length);
    } else {
      filteredArgs.push(arg);
    }
  }

  return { inspectEnabled, inspectBrkEnabled, filteredArgs };
}
