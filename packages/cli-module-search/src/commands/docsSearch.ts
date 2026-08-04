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
  formatSearchResults,
} from '../lib/intentFormat';

export default async ({ args, info }: CliCommandContext) => {
  const nonFlagArgs: string[] = [];
  const flagArgs: string[] = [];
  let skipNext = false;

  for (let i = 0; i < args.length; i++) {
    if (skipNext) {
      skipNext = false;
      continue;
    }
    if (args[i].startsWith('-')) {
      flagArgs.push(args[i]);
      if (
        i + 1 < args.length &&
        !args[i + 1].startsWith('-') &&
        !args[i].includes('=')
      ) {
        flagArgs.push(args[i + 1]);
        skipNext = true;
      }
    } else {
      nonFlagArgs.push(args[i]);
    }
  }

  const { flags } = cli(
    {
      name: info.usage,
      flags: {
        'page-limit': {
          type: Number,
          description: 'Results per page (default: 10)',
        },
        'page-cursor': {
          type: String,
          description: 'Pagination cursor',
        },
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
    flagArgs,
  );

  const term = nonFlagArgs.join(' ');
  if (!term) {
    throw new Error('Search term is required. Usage: docs search <term>');
  }

  const mode = parseOutputFlag(flags as Record<string, unknown>);
  const { accessToken, baseUrl } = await resolveAuth(flags.instance);
  const client = new ActionsClient(baseUrl, accessToken);

  const input: Record<string, unknown> = {
    term,
    types: ['techdocs'],
  };
  if (flags['page-limit']) input.pageLimit = flags['page-limit'];
  if (flags['page-cursor']) input.pageCursor = flags['page-cursor'];

  const result = (await client.execute('search:query', input)) as Record<
    string,
    unknown
  >;

  if (mode === 'json') {
    writeJson(result);
  } else {
    const results = (result?.results ?? []) as Array<Record<string, unknown>>;
    process.stdout.write(formatSearchResults(results));
  }
};
