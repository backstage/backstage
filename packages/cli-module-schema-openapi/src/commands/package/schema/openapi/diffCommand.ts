/*
 * Copyright 2026 The Backstage Authors
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
import { command } from './diff';

export default async ({ args, info }: CliCommandContext) => {
  const {
    flags: { ignore, json, since },
  } = cli(
    {
      name: info.usage,
      flags: {
        ignore: {
          type: Boolean,
          description: 'Ignore linting failures and only log the results.',
        },
        json: {
          type: Boolean,
          description: 'Output the results as JSON',
        },
        since: {
          type: String,
          description: 'Diff the API against a specific ref',
        },
      },
    },
    undefined,
    args,
  );

  await command({ ignore, json, since });
};
