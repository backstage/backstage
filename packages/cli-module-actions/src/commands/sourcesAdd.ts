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
} from '../lib/pluginSources';

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
  const existing = pluginSourcesSchema.parse(
    await auth.getMetadata('pluginSources'),
  );
  const excluded = excludedSourcesSchema.parse(
    await auth.getMetadata('excludedPluginSources'),
  );

  const added: string[] = [];
  const skipped: string[] = [];

  for (const pluginId of pluginIds) {
    if (existing.includes(pluginId)) {
      skipped.push(pluginId);
    } else {
      added.push(pluginId);
    }
  }

  if (added.length > 0) {
    await auth.setMetadata('pluginSources', [...existing, ...added]);

    const reExcluded = added.filter(id => excluded.includes(id));
    if (reExcluded.length > 0) {
      await auth.setMetadata(
        'excludedPluginSources',
        excluded.filter(s => !reExcluded.includes(s)),
      );
    }

    process.stdout.write(
      `Added plugin source${added.length > 1 ? 's' : ''}: ${added.join(
        ', ',
      )}\n`,
    );
  }

  for (const id of skipped) {
    process.stderr.write(`Plugin source "${id}" is already configured.\n`);
  }
};
