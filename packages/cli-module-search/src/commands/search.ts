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
import {
  parseCommaSeparatedList,
  parseKeyValuePairs,
  type CliCommandContext,
} from '@backstage/cli-node';
import { SearchClient } from '../lib/SearchClient';
import { resolveAuth } from '../lib/resolveAuth';
import {
  parseOutputFlag,
  writeJson,
  formatSearchResults,
} from '../lib/intentFormat';

export default async ({ args, info }: CliCommandContext) => {
  const nonFlagArgs: string[] = [];
  let skipNext = false;

  for (let i = 0; i < args.length; i++) {
    if (skipNext) {
      skipNext = false;
      continue;
    }
    if (args[i].startsWith('-')) {
      if (
        i + 1 < args.length &&
        !args[i + 1].startsWith('-') &&
        !args[i].includes('=')
      ) {
        skipNext = true;
      }
    } else {
      nonFlagArgs.push(args[i]);
    }
  }

  const parsed = cli(
    {
      name: info.usage,
      strictFlags: true,
      parameters: ['<term...>'],
      flags: {
        types: {
          type: String,
          description: 'Comma-separated document types',
        },
        filter: {
          type: [String] as const,
          description: 'Query filter as repeatable key=value input',
          default: [] as string[],
        },
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
    args,
  );
  const { flags } = parsed;

  const termParts = parsed._?.term ?? nonFlagArgs;
  const term = termParts.join(' ');
  if (!term) {
    throw new Error(
      'Search term is required. Usage: search <term> [--types techdocs]',
    );
  }

  const mode = parseOutputFlag(flags as Record<string, unknown>);
  const { accessToken, baseUrl } = await resolveAuth(flags.instance);
  const client = new SearchClient(baseUrl, accessToken);

  const response = await client.query({
    term,
    types: parseCommaSeparatedList(flags.types),
    filters: parseKeyValuePairs(flags.filter),
    pageLimit: flags['page-limit'],
    pageCursor: flags['page-cursor'],
  });
  const result = {
    results: response.results,
    nextPageCursor: response.nextPageCursor,
    totalItems: response.numberOfResults,
    hasMoreResults: response.nextPageCursor !== undefined,
  };

  if (mode === 'json') {
    writeJson(result);
  } else {
    process.stdout.write(formatSearchResults(result.results));
  }
};
