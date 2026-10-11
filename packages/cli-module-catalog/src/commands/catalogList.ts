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
        kind: {
          type: String,
          description:
            'Only list entities of this kind (shortcut for --filter kind=<kind>)',
        },
        type: {
          type: String,
          description:
            'Only list entities of this type (shortcut for --filter spec.type=<type>)',
        },
        filter: {
          type: [String] as const,
          description: 'Filter entities by a field, as key=value (repeatable)',
          default: [] as string[],
        },
        fields: {
          type: String,
          description: 'Comma-separated list of entity fields to include',
        },
        limit: {
          type: Number,
          description: 'Maximum number of entities to return per page',
        },
        cursor: {
          type: String,
          description:
            'Continue from the cursor returned by a previous page (cannot be combined with --kind, --type, --filter or --fields)',
        },
        ...outputFlag,
        ...instanceFlag,
      },
    },
    undefined,
    args,
  );

  const mode = parseOutputFlag(flags as Record<string, unknown>);

  if (flags.cursor) {
    const conflicting = [
      flags.kind && '--kind',
      flags.type && '--type',
      flags.filter?.length && '--filter',
      flags.fields && '--fields',
    ].filter(Boolean);
    if (conflicting.length > 0) {
      throw new Error(
        `--cursor cannot be combined with ${conflicting.join(
          ', ',
        )}, the cursor already contains the original query`,
      );
    }
  }

  const filter = parseKeyValuePairs(flags.filter) ?? {};
  const shortcuts: Record<string, string> = {};
  if (flags.kind) shortcuts.kind = flags.kind;
  if (flags.type) shortcuts['spec.type'] = flags.type;
  for (const [key, value] of Object.entries(shortcuts)) {
    if (key in filter) {
      const option = key === 'kind' ? '--kind' : '--type';
      throw new Error(
        `${option} ${value} conflicts with --filter ${key}=..., use only one of them`,
      );
    }
  }
  const query = { ...shortcuts, ...filter };
  const fields = parseCommaSeparatedList(flags.fields);

  const { accessToken, baseUrl } = await resolveAuth(flags.instance);
  const client = createCatalogClient(baseUrl);

  const fetchPage = async (cursor?: string) => {
    const request: Record<string, unknown> = {};
    if (cursor) {
      request.cursor = cursor;
    } else {
      if (Object.keys(query).length > 0) request.query = query;
      if (fields) request.fields = fields;
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
    page =>
      process.stdout.write(formatEntityTable(extractEntities(page), fields)),
    flags.cursor,
  );
};
