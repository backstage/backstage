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
import type { FilterPredicate } from '@backstage/filter-predicates';
import { createCatalogClient } from '../lib/catalogClient';
import { resolveAuth } from '../lib/resolveAuth';
import { writeJson } from '../lib/intentFormat';

export default async ({ args, info }: CliCommandContext) => {
  const { flags } = cli(
    {
      name: info.usage,
      flags: {
        name: { type: String, description: 'Entity name (required)' },
        kind: { type: String, description: 'Entity kind' },
        namespace: {
          type: String,
          description: 'Entity namespace (default: default)',
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

  if (!flags.name) {
    throw new Error(
      '--name is required. Usage: catalog get --name <entity-name> [--kind <kind>]',
    );
  }

  const { accessToken, baseUrl } = await resolveAuth(flags.instance);
  const client = createCatalogClient(baseUrl);

  const filter: Record<string, string> = { 'metadata.name': flags.name };
  if (flags.kind) filter.kind = flags.kind;
  if (flags.namespace) filter['metadata.namespace'] = flags.namespace;

  const { items } = await client.queryEntities(
    { query: filter as FilterPredicate },
    { token: accessToken },
  );

  if (items.length === 0) {
    throw new Error(`No entity found with name "${flags.name}"`);
  }
  if (items.length > 1) {
    throw new Error(
      `Multiple entities found with name "${
        flags.name
      }", please provide more specific filters. Entities found: ${items
        .map(
          item =>
            `"${item.kind}:${item.metadata.namespace ?? 'default'}/${
              item.metadata.name
            }"`,
        )
        .join(', ')}`,
    );
  }

  writeJson(items[0]);
};
