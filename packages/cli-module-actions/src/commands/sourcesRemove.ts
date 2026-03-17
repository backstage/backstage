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
import {
  getSelectedInstance,
  getInstanceConfig,
  updateInstanceConfig,
} from '@backstage/cli-module-auth';

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

  const instance = await getSelectedInstance();
  const existing =
    (await getInstanceConfig<string[]>(instance.name, 'pluginSources')) ?? [];

  if (!existing.includes(pluginId)) {
    process.stderr.write(`Plugin source "${pluginId}" is not configured.\n`);
    return;
  }

  await updateInstanceConfig(
    instance.name,
    'pluginSources',
    existing.filter(s => s !== pluginId),
  );

  process.stdout.write(`Removed plugin source "${pluginId}".\n`);
};
