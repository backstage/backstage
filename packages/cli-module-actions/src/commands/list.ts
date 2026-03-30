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
import { formatActionList } from '../lib/format';

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

  const { accessToken, pluginSources, baseUrl } = await resolveAuth(
    instanceFlag,
  );

  if (!pluginSources.length) {
    process.stderr.write(
      'No plugin sources configured. Run "actions sources add <plugin-id>" to add one.\n',
    );
    return;
  }

  const client = new ActionsClient(baseUrl, accessToken);
  const grouped = await client.list(pluginSources);

  const hasActions = grouped.some(g => g.actions.length > 0);
  if (!hasActions) {
    process.stderr.write('No actions found.\n');
    return;
  }

  process.stdout.write(`${formatActionList(grouped)}\n`);
};
