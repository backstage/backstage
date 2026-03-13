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
import {
  getSelectedInstance,
  getInstanceConfig,
  updateInstanceConfig,
} from '../../auth/lib/storage';

export default async ({ args, info }: CommandContext) => {
  const argv = cli(
    {
      help: info,
      parameters: ['<plugin-id>'],
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

  const pluginId = argv._.pluginId;
  const instance = await getSelectedInstance(argv.flags.instance);

  const sources =
    (await getInstanceConfig<string[]>(instance.name, 'pluginSources')) ?? [];
  const next = sources.filter(s => s !== pluginId);
  if (next.length !== sources.length) {
    await updateInstanceConfig(instance.name, 'pluginSources', next);
  }
  process.stdout.write(
    `Removed plugin source "${pluginId}" from instance "${instance.name}"\n`,
  );
};
