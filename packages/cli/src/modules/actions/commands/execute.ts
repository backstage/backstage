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
import type { CommandContext } from '../../../wiring/types';
import { getSelectedInstance } from '../../auth/lib/storage';
import {
  accessTokenNeedsRefresh,
  refreshAccessToken,
} from '../../auth/lib/auth';
import { getSecretStore } from '../../auth/lib/secretStore';
import { ActionsClient } from '../lib/ActionsClient';
import { schemaToFlags } from '../lib/schemaToFlags';

export default async ({ args, info }: CommandContext) => {
  const actionId = args.find(a => !a.startsWith('-'));

  if (!actionId) {
    process.stdout.write(`Usage: ${info.usage} <action-id> [flags]\n`);
    process.exit(1);
  }

  const instanceFlagIdx = args.findIndex(a => a === '--instance');
  const instanceFlag =
    instanceFlagIdx !== -1 ? args[instanceFlagIdx + 1] : undefined;

  let instance = await getSelectedInstance(instanceFlag);

  if (accessTokenNeedsRefresh(instance)) {
    process.stdout.write('Refreshing access token...\n');
    instance = await refreshAccessToken(instance.name);
  }

  const secretStore = await getSecretStore();
  const service = `backstage-cli:auth-instance:${instance.name}`;
  const accessToken = await secretStore.get(service, 'accessToken');
  if (!accessToken) {
    throw new Error('No access token found. Run "auth login" to authenticate.');
  }

  const colonIndex = actionId.indexOf(':');
  if (colonIndex === -1) {
    throw new Error(`Invalid action id: ${actionId}`);
  }
  const pluginId = actionId.substring(0, colonIndex);

  const client = new ActionsClient(instance.baseUrl, accessToken);
  const actions = await client.list([pluginId]);
  const action = actions.find(a => a.id === actionId);

  if (!action) {
    const available = actions.map(a => a.id).join('\n  ');
    throw new Error(
      `Action "${actionId}" not found.${
        available ? `\n\nAvailable actions:\n  ${available}` : ''
      }`,
    );
  }

  const { flags: schemaFlags, parseInput } = schemaToFlags(action.schema.input);

  const flagArgs = args.filter(a => a !== actionId);

  const parsed = cli(
    {
      help: info,
      flags: {
        ...schemaFlags,
        input: {
          type: String,
          description: 'JSON input, overridden by individual flags',
        },
        instance: {
          type: String,
          description: 'Name of the instance to use',
        },
      },
    },
    undefined,
    flagArgs,
  );

  let input: Record<string, unknown> = {};

  if (parsed.flags.input) {
    try {
      input = JSON.parse(parsed.flags.input);
    } catch {
      throw new Error('Invalid JSON provided to --input flag');
    }
  }

  const schemaFlagValues: Record<string, unknown> = {};
  for (const key of Object.keys(schemaFlags)) {
    const val = (parsed.flags as Record<string, unknown>)[key];
    if (val !== undefined) {
      schemaFlagValues[key] = val;
    }
  }

  input = { ...input, ...parseInput(schemaFlagValues) };

  const result = await client.execute(
    actionId,
    Object.keys(input).length > 0 ? input : undefined,
  );

  process.stdout.write(`${JSON.stringify(result.output, null, 2)}\n`);
};
