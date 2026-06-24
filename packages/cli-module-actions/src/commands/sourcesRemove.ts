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
import { CliAuth, type CliCommandContext } from '@backstage/cli-node';
import {
  pluginSourcesSchema,
  excludedSourcesSchema,
  mergePluginSources,
} from '../lib/pluginSources';
import { ActionsClient } from '../lib/ActionsClient';

export default async ({ args, info }: CliCommandContext) => {
  const parsed = cli(
    {
      name: info.usage,
      parameters: ['<plugin-ids...>'],
    },
    undefined,
    args,
  );

  const pluginIds: string[] = parsed._.pluginIds;

  const auth = await CliAuth.create();
  const accessToken = await auth.getAccessToken();
  const localAdditions = pluginSourcesSchema.parse(
    await auth.getMetadata('pluginSources'),
  );
  const localExclusions = excludedSourcesSchema.parse(
    await auth.getMetadata('excludedPluginSources'),
  );

  const client = new ActionsClient(auth.getBaseUrl(), accessToken);
  const serverSources = await client.listSources();

  const effective = mergePluginSources({
    serverSources,
    localAdditions,
    localExclusions,
  });

  const removed: string[] = [];
  const skipped: string[] = [];

  for (const pluginId of pluginIds) {
    if (effective.includes(pluginId)) {
      removed.push(pluginId);
    } else {
      skipped.push(pluginId);
    }
  }

  if (removed.length > 0) {
    const fromLocal = removed.filter(id => localAdditions.includes(id));
    if (fromLocal.length > 0) {
      await auth.setMetadata(
        'pluginSources',
        localAdditions.filter(s => !fromLocal.includes(s)),
      );
    }

    const fromServer = removed.filter(
      id => serverSources.includes(id) && !localAdditions.includes(id),
    );
    if (fromServer.length > 0) {
      await auth.setMetadata('excludedPluginSources', [
        ...localExclusions,
        ...fromServer,
      ]);
    }

    process.stdout.write(
      `Removed plugin source${removed.length > 1 ? 's' : ''}: ${removed.join(
        ', ',
      )}\n`,
    );
  }

  for (const id of skipped) {
    process.stderr.write(`Plugin source "${id}" is not configured.\n`);
  }
};
