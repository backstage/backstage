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
import { createCatalogClient } from '../lib/catalogClient';
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
        kind: {
          type: String,
          description: 'Entity kind (Component, API, System, etc.)',
        },
        type: {
          type: String,
          description: 'Entity type (service, website, library, etc.)',
        },
        filter: {
          type: String,
          description: 'Full query predicate (JSON)',
        },
        limit: { type: Number, description: 'Maximum results to return' },
        fields: {
          type: String,
          description: 'Fields to include (JSON array)',
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

  const mode = parseOutputFlag(flags as Record<string, unknown>);
  const { accessToken, baseUrl } = await resolveAuth(flags.instance);
  const client = createCatalogClient(baseUrl);

  const query: Record<string, unknown> = {};
  if (flags.kind) query.kind = flags.kind;
  if (flags.type) query['spec.type'] = flags.type;

  const request: Record<string, unknown> = {};
  if (flags.filter) {
    request.query = JSON.parse(flags.filter);
  } else if (Object.keys(query).length > 0) {
    request.query = query;
  }
  if (flags.limit) request.limit = flags.limit;
  if (flags.fields) request.fields = JSON.parse(flags.fields);

  const response = await client.queryEntities(request, { token: accessToken });
  const result = {
    items: response.items,
    totalItems: response.totalItems,
    hasMoreEntities: Boolean(response.pageInfo?.nextCursor),
    nextPageCursor: response.pageInfo?.nextCursor,
  };

  if (mode === 'json') {
    writeJson(result);
  } else {
    process.stdout.write(formatEntityTable(extractEntities(result)));
  }
};
