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
} from '@backstage/cli-module-auth';

export default async ({ args, info }: CliCommandContext) => {
  cli({ help: info }, undefined, args);

  const instance = await getSelectedInstance();
  const sources =
    (await getInstanceConfig<string[]>(instance.name, 'pluginSources')) ?? [];

  if (!sources.length) {
    process.stderr.write('No plugin sources configured.\n');
    return;
  }

  for (const source of sources) {
    process.stdout.write(`${source}\n`);
  }
};
