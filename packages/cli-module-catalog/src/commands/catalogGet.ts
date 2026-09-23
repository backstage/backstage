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
import { parseEntityRef } from '../lib/input';

export default async ({ args, info }: CliCommandContext) => {
  const parsed = cli(
    {
      name: info.usage,
      parameters: ['[ref]'],
      flags: {
        name: { type: String, description: 'Entity name alias' },
        kind: {
          type: String,
          description: 'Entity kind for a short reference',
        },
        namespace: {
          type: String,
          description: 'Entity namespace for a short reference',
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
  const ref = parsed._?.ref ?? flags.name;

  if (!ref) {
    throw new Error(
      'Entity reference or --name is required. Usage: catalog get [kind:][namespace/]name',
    );
  }

  const entityRef = parseEntityRef(ref);

  const { accessToken, baseUrl } = await resolveAuth(flags.instance);
  const client = createCatalogClient(baseUrl);

  const filter: Record<string, string> = {
    'metadata.name': entityRef.name,
  };
  const kind = flags.kind ?? entityRef.kind;
  const namespace = flags.namespace ?? entityRef.namespace;
  if (kind) filter.kind = kind;
  if (namespace) filter['metadata.namespace'] = namespace;

  const { items } = await client.queryEntities(
    { query: filter as FilterPredicate },
    { token: accessToken },
  );

  if (items.length === 0) {
    throw new Error(`No entity found with name "${entityRef.name}"`);
  }
  if (items.length > 1) {
    throw new Error(
      `Multiple entities found with name "${
        entityRef.name
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
