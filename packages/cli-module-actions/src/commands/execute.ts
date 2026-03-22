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

  const wantsHelp = args.includes('--help') || args.includes('-h');

  if (wantsHelp && actionId) {
    let actionSchemaFlags: Record<string, unknown> = {};
    try {
      const { accessToken, baseUrl } = await resolveAuth(instanceFlag);
      const client = new ActionsClient(baseUrl, accessToken);
      const actions = await client.listForPlugin(actionId);
      const action = actions.find(a => a.id === actionId);
      if (action) {
        actionSchemaFlags = schemaToFlags(action.schema.input as any);
      }
    } catch {
      process.stderr.write(
        'Unable to retrieve action schema. Showing generic help.\n',
      );
    }

    cli(
      {
        help: info,
        parameters: ['<action-id>'],
        flags: {
          ...actionSchemaFlags,
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

  if (wantsHelp) {
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

  if (!actionId) {
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
      ['--help', ...args],
    );
    throw new Error('Action ID is required');
  }

  const { accessToken, baseUrl } = await resolveAuth(instanceFlag);

  const client = new ActionsClient(baseUrl, accessToken);
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
        ...schemaFlags,
        instance: {
          type: String,
          description: 'Name of the instance to use',
        },
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
