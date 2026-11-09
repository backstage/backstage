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
import { instanceFlag, resolveAuth } from '../lib/resolveAuth';
import { writeJson } from '../lib/intentFormat';
import { parseEntityRef } from '../lib/input';

export default async ({ args, info }: CliCommandContext) => {
  const parsed = cli(
    {
      name: info.usage,
      strictFlags: true,
      parameters: ['<ref>'],
      flags: {
        kind: {
          type: String,
          description:
            'Kind to use when the entity reference does not include one',
        },
        namespace: {
          type: String,
          description:
            'Namespace to use when the entity reference does not include one',
        },
        ...instanceFlag,
      },
    },
    undefined,
    args,
  );
  const { flags } = parsed;
  const ref = parsed._.ref;

  const entityRef = parseEntityRef(ref);
  if (flags.kind && entityRef.kind) {
    throw new Error(
      `--kind ${flags.kind} conflicts with the kind "${entityRef.kind}" in the reference "${ref}"`,
    );
  }
  if (flags.namespace && entityRef.namespace) {
    throw new Error(
      `--namespace ${flags.namespace} conflicts with the namespace "${entityRef.namespace}" in the reference "${ref}"`,
    );
  }

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
