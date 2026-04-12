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
import { formatActionHelp, flagDefsToFlagInfo } from '../lib/format';

function parseArgs(args: string[]) {
  const instanceIdx = args.indexOf('--instance');
  const instanceFlag = instanceIdx !== -1 ? args[instanceIdx + 1] : undefined;

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

  return { instanceFlag, actionId, actionIdIdx, wantsHelp };
}

function showGenericHelp(
  info: CliCommandContext['info'],
  args: string[],
): void {
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
}

async function showActionHelp(
  info: CliCommandContext['info'],
  actionId: string,
  instanceFlag: string | undefined,
): Promise<boolean> {
  try {
    const { accessToken, baseUrl } = await resolveAuth(instanceFlag);
    const client = new ActionsClient(baseUrl, accessToken);
    const actions = await client.listForPlugin(actionId);
    const action = actions.find(a => a.id === actionId);

    if (!action) {
      return false;
    }

    const { flags: flagDefs } = schemaToFlags(action.schema.input as any);
    const flags = flagDefsToFlagInfo(flagDefs);
    flags.push({
      name: 'instance',
      type: 'string',
      description: 'Name of the instance to use',
    });

    process.stdout.write(
      await formatActionHelp({
        action,
        usage: `${info.usage ?? 'backstage actions execute'} ${actionId}`,
        flags,
      }),
    );
    return true;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    process.stderr.write(
      `Unable to retrieve action schema: ${msg}\nShowing generic help.\n`,
    );
    return false;
  }
}

export default async ({ args, info }: CliCommandContext) => {
  const { instanceFlag, actionId, actionIdIdx, wantsHelp } = parseArgs(args);

  if (wantsHelp) {
    if (!actionId || !(await showActionHelp(info, actionId, instanceFlag))) {
      showGenericHelp(info, args);
    }
    return;
  }

  if (!actionId) {
    // Inject --help so cleye renders its help output before we throw.
    showGenericHelp(info, ['--help', ...args]);
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

  const inputSchema = action.schema.input as any;
  const { flags: schemaFlags, complexKeys } = schemaToFlags(inputSchema);

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
    if (key === 'instance' || value === undefined) {
      continue;
    }
    if (complexKeys.has(key) && typeof value === 'string') {
      try {
        input[key] = JSON.parse(value);
      } catch {
        throw new Error(`Invalid JSON for --${key}. Expected a JSON string.`);
      }
    } else {
      input[key] = value;
    }
  }

  const output = await client.execute(actionId, input);
  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
};
