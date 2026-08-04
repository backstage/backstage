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
import { ActionsClient } from '../lib/ActionsClient';
import { resolveAuth } from '../lib/resolveAuth';
import {
  parseOutputFlag,
  writeJson,
  extractEntities,
  formatEntityTable,
} from '../lib/intentFormat';

export default async ({ args, info }: CliCommandContext) => {
  const { flags } = cli(
    {
      name: info.usage,
      flags: {
        limit: { type: Number, description: 'Maximum results to return' },
        output: {
          type: String,
          description: 'Output format: human (default), json',
        },
        instance: {
          type: String,
          description: 'Name of the instance to use',
        },
      },
    },
    undefined,
    args,
  );

  const mode = parseOutputFlag(flags as Record<string, unknown>);
  const { accessToken, baseUrl } = await resolveAuth(flags.instance);
  const client = new ActionsClient(baseUrl, accessToken);

  const input: Record<string, unknown> = {
    query: { kind: 'Template' },
  };
  if (flags.limit) input.limit = flags.limit;

  const result = await client.execute('catalog:query-catalog-entities', input);

  if (mode === 'json') {
    writeJson(result);
  } else {
    process.stdout.write(formatEntityTable(extractEntities(result)));
  }
};
