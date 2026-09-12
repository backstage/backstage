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
import { ActionsClient } from '../lib/ActionsClient';
import {
  pluginSourcesSchema,
  excludedSourcesSchema,
  mergePluginSources,
} from '../lib/pluginSources';

export default async ({ args, info }: CliCommandContext) => {
  const {
    flags: { instance: instanceFlag },
  } = cli(
    {
      name: info.usage,
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

  const auth = await CliAuth.create({ instanceName: instanceFlag });
  const localAdditions = pluginSourcesSchema.parse(
    await auth.getMetadata('pluginSources'),
  );
  const localExclusions = excludedSourcesSchema.parse(
    await auth.getMetadata('excludedPluginSources'),
  );

  const client = new ActionsClient(auth.getBaseUrl(), '');
  const serverSources = await client.listSources();

  const sources = mergePluginSources({
    serverSources,
    localAdditions,
    localExclusions,
  });

  if (!sources.length) {
    process.stderr.write('No plugin sources configured.\n');
    return;
  }

  for (const source of sources) {
    process.stdout.write(`${source}\n`);
  }
};
