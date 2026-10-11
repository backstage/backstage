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
import { createCatalogClient } from '../lib/catalogClient';
import { instanceFlag, resolveAuth } from '../lib/resolveAuth';
import {
  outputFlag,
  pageInteractively,
  parseOutputFlag,
  writeJson,
  extractEntities,
  formatEntityTable,
} from '../lib/intentFormat';

export default async ({ args, info }: CliCommandContext) => {
  const { flags } = cli(
    {
      name: info.usage,
      strictFlags: true,
      flags: {
        filter: {
          type: [String] as const,
          description: 'Filter templates by a field, as key=value (repeatable)',
          default: [] as string[],
        },
        limit: {
          type: Number,
          description: 'Maximum number of templates to return per page',
        },
        cursor: {
          type: String,
          description:
            'Continue from the cursor returned by a previous page (cannot be combined with --filter)',
        },
        ...outputFlag,
        ...instanceFlag,
      },
    },
    undefined,
    args,
  );

  const mode = parseOutputFlag(flags as Record<string, unknown>);

  if (flags.cursor && flags.filter?.length) {
    throw new Error(
      '--cursor cannot be combined with --filter, the cursor already contains the original query',
    );
  }
  const filter = parseKeyValuePairs(flags.filter) ?? {};
  const { accessToken, baseUrl } = await resolveAuth(flags.instance);
  const client = createCatalogClient(baseUrl);

  const fetchPage = async (cursor?: string) => {
    const request: Record<string, unknown> = {};
    if (cursor) {
      request.cursor = cursor;
    } else {
      request.query = { kind: 'Template', ...filter };
    }
    if (flags.limit) request.limit = flags.limit;

    const response = await client.queryEntities(request as any, {
      token: accessToken,
    });
    return {
      items: response.items,
      totalItems: response.totalItems,
      hasMoreEntities: Boolean(response.pageInfo?.nextCursor),
      nextPageCursor: response.pageInfo?.nextCursor,
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
        count: page.items.length,
        total: page.totalItems,
        nextCursor: page.nextPageCursor,
      };
    },
    page => process.stdout.write(formatEntityTable(extractEntities(page))),
    flags.cursor,
  );
};
