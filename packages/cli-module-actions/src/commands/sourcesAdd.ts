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
import { z } from 'zod/v3';

const pluginSourcesSchema = z.array(z.string()).default([]);

export default async ({ args, info }: CliCommandContext) => {
  const parsed = cli(
    {
      help: info,
      parameters: ['<plugin-id>'],
    },
    undefined,
    args,
  );

  const pluginId = parsed._[0];

  const auth = await CliAuth.create();
  const existing = pluginSourcesSchema.parse(
    await auth.getMetadata('pluginSources'),
  );

  if (existing.includes(pluginId)) {
    process.stderr.write(
      `Plugin source "${pluginId}" is already configured.\n`,
    );
    return;
  }

  await auth.setMetadata('pluginSources', [...existing, pluginId]);

  process.stdout.write(`Added plugin source "${pluginId}".\n`);
};
