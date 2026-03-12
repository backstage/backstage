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
import { getSelectedInstance } from '../../auth/lib/storage';
import { addPluginSource } from '../lib/config';

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

  await addPluginSource(instance.name, pluginId);
  process.stdout.write(
    `Added plugin source "${pluginId}" for instance "${instance.name}"\n`,
  );
};
