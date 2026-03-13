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
import { getSelectedInstance, getInstanceConfig } from '../../auth/lib/storage';
import {
  accessTokenNeedsRefresh,
  refreshAccessToken,
} from '../../auth/lib/auth';
import { getSecretStore } from '../../auth/lib/secretStore';
import { ActionsClient } from '../lib/ActionsClient';

export default async ({ args, info }: CommandContext) => {
  const {
    flags: { instance: instanceFlag },
  } = cli(
    {
      help: info,
      flags: {
        instance: {
          type: String,
          description: 'Name of the instance',
        },
      },
    },
    undefined,
    args,
  );

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

  const pluginSources =
    (await getInstanceConfig<string[]>(instance.name, 'pluginSources')) ?? [];
  if (pluginSources.length === 0) {
    process.stdout.write(
      'No plugin sources configured. Run "actions sources add <pluginId>" to add one.\n',
    );
    return;
  }

  const client = new ActionsClient(instance.baseUrl, accessToken);
  const actions = await client.list(pluginSources);

  if (actions.length === 0) {
    process.stdout.write('No actions found.\n');
    return;
  }

  for (const action of actions) {
    process.stdout.write(`${action.id}\n`);
    if (action.title) {
      process.stdout.write(`  ${action.title}\n`);
    }
    if (action.description) {
      process.stdout.write(`  ${action.description}\n`);
    }
    const attrs: string[] = [];
    if (action.attributes.readOnly) attrs.push('read-only');
    if (action.attributes.destructive) attrs.push('destructive');
    if (action.attributes.idempotent) attrs.push('idempotent');
    if (attrs.length > 0) {
      process.stdout.write(`  [${attrs.join(', ')}]\n`);
    }
    process.stdout.write('\n');
  }
};
