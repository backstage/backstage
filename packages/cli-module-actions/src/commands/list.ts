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
import { resolveAuth } from '../lib/resolveAuth';

export default async ({ args, info }: CliCommandContext) => {
  const {
    flags: { instance: instanceFlag },
  } = cli(
    {
      help: info,
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

  const { accessToken, pluginSources, instance } = await resolveAuth(
    instanceFlag,
  );

  if (!pluginSources.length) {
    process.stderr.write(
      'No plugin sources configured. Run "actions sources add <plugin-id>" to add one.\n',
    );
    return;
  }

  const client = new ActionsClient(instance.baseUrl, accessToken);
  const actions = await client.list(pluginSources);

  if (!actions.length) {
    process.stderr.write('No actions found.\n');
    return;
  }

  for (const action of actions) {
    const desc = action.description ? ` - ${action.description}` : '';
    process.stdout.write(`${action.id}${desc}\n`);
  }
};
