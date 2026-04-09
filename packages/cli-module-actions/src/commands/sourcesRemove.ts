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
import { pluginSourcesSchema } from '../lib/pluginSources';

export default async ({ args, info }: CliCommandContext) => {
  const parsed = cli(
    {
      help: info,
      parameters: ['<plugin-ids...>'],
    },
    undefined,
    args,
  );

  const pluginIds: string[] = parsed._.pluginIds;

  const auth = await CliAuth.create();
  const existing = pluginSourcesSchema.parse(
    await auth.getMetadata('pluginSources'),
  );

  const removed: string[] = [];
  const skipped: string[] = [];

  for (const pluginId of pluginIds) {
    if (existing.includes(pluginId)) {
      removed.push(pluginId);
    } else {
      skipped.push(pluginId);
    }
  }

  if (removed.length > 0) {
    await auth.setMetadata(
      'pluginSources',
      existing.filter(s => !removed.includes(s)),
    );
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
