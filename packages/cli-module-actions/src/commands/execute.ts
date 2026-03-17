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

import { cli } from 'cleye';
import type { CliCommandContext } from '@backstage/cli-node';
import { ActionsClient } from '../lib/ActionsClient';
import { schemaToFlags } from '../lib/schemaToFlags';
import { resolveAuth } from '../lib/resolveAuth';

export default async ({ args, info }: CliCommandContext) => {
  if (args.includes('--help') || args.includes('-h')) {
    cli(
      {
        help: info,
        parameters: ['<action-id>'],
        flags: {
          instance: {
            type: String,
            description: 'Name of the instance to use',
          },
        },
      },
      undefined,
      args,
    );
    return;
  }

  const instanceIdx = args.indexOf('--instance');
  const instanceFlag = instanceIdx !== -1 ? args[instanceIdx + 1] : undefined;

  // Skip flag names, flag values (the argument after a known flag), and
  // the --instance value position so we only pick up positional arguments.
  const skipIndices = new Set<number>();
  if (instanceIdx !== -1) {
    skipIndices.add(instanceIdx);
    skipIndices.add(instanceIdx + 1);
  }

  let actionId: string | undefined;
  let actionIdIdx = -1;
  for (let i = 0; i < args.length; i++) {
    if (!skipIndices.has(i) && !args[i].startsWith('-')) {
      actionId = args[i];
      actionIdIdx = i;
      break;
    }
  }

  if (!actionId) {
    process.stderr.write('Usage: actions execute <action-id> [flags]\n');
    process.exit(1);
  }

  const { accessToken, instance } = await resolveAuth(instanceFlag);

  const client = new ActionsClient(instance.baseUrl, accessToken);
  const actions = await client.listForPlugin(actionId);
  const action = actions.find(a => a.id === actionId);

  if (!action) {
    throw new Error(
      `Action "${actionId}" not found. Run "actions list" to see available actions.`,
    );
  }

  const schemaFlags = schemaToFlags(action.schema.input as any);

  const flagArgs = args.filter((_, i) => i !== actionIdIdx);

  const { flags } = cli(
    {
      help: info,
      flags: {
        instance: {
          type: String,
          description: 'Name of the instance to use',
        },
        ...schemaFlags,
      },
    },
    undefined,
    flagArgs,
  );

  const allFlags = flags as Record<string, unknown>;
  const input: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(allFlags)) {
    if (key !== 'instance' && value !== undefined) {
      input[key] = value;
    }
  }

  const output = await client.execute(actionId, input);
  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
};
