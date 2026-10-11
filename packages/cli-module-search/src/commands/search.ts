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
  parseKeyValuePairs,
  type CliCommandContext,
} from '@backstage/cli-node';
import { SearchClient } from '../lib/SearchClient';
import { instanceFlag, resolveAuth } from '../lib/resolveAuth';
import {
  outputFlag,
  pageInteractively,
  parseOutputFlag,
  writeJson,
  formatSearchResults,
} from '../lib/intentFormat';

export default async ({ args, info }: CliCommandContext) => {
  const parsed = cli(
    {
      name: info.usage,
      strictFlags: true,
      parameters: ['<term...>'],
      flags: {
        type: {
          type: [String] as const,
          description:
            'Only search documents of this type, for example techdocs (repeatable)',
          default: [] as string[],
        },
        filter: {
          type: [String] as const,
          description: 'Filter results by a field, as key=value (repeatable)',
          default: [] as string[],
        },
        limit: {
          type: Number,
          description: 'Maximum number of results to return per page',
        },
        cursor: {
          type: String,
          description: 'Continue from the cursor returned by a previous page',
        },
        ...outputFlag,
        ...instanceFlag,
      },
    },
    undefined,
    args,
  );
  const { flags } = parsed;

  const term = parsed._.term.join(' ');
  const mode = parseOutputFlag(flags as Record<string, unknown>);
  const types = flags.type.length > 0 ? flags.type : undefined;
  const filters = parseKeyValuePairs(flags.filter);

  const { accessToken, baseUrl } = await resolveAuth(flags.instance);
  const client = new SearchClient(baseUrl, accessToken);

  const fetchPage = async (cursor?: string) => {
    const response = await client.query({
      term,
      types,
      filters,
      pageLimit: flags.limit,
      pageCursor: cursor,
    });
    return {
      results: response.results,
      nextPageCursor: response.nextPageCursor,
      totalItems: response.numberOfResults,
      hasMoreResults: response.nextPageCursor !== undefined,
    };
  };

  if (mode === 'json') {
    writeJson(await fetchPage(flags.cursor));
    return;
  }

  await pageInteractively(
    async cursor => {
      const page = await fetchPage(cursor);
      return {
        ...page,
        count: page.results.length,
        total: page.totalItems,
        nextCursor: page.nextPageCursor,
      };
    },
    page => process.stdout.write(formatSearchResults(page.results)),
    flags.cursor,
  );
};
