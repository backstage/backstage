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
import { ScaffolderClient } from '../lib/ScaffolderClient';
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
        namespace: {
          type: String,
          description:
            'Namespace to use when the template reference does not include one',
        },
        value: {
          type: [String] as const,
          description: 'Template input value, as key=value (repeatable)',
          default: [] as string[],
        },
        secret: {
          type: [String] as const,
          description: 'Template secret, as key=value (repeatable)',
          default: [] as string[],
        },
        ...instanceFlag,
      },
    },
    undefined,
    args,
  );
  const { flags } = parsed;
  const ref = parsed._.ref;

  const parsedRef = parseEntityRef(ref);
  if (flags.namespace && parsedRef.namespace) {
    throw new Error(
      `--namespace ${flags.namespace} conflicts with the namespace "${parsedRef.namespace}" in the reference "${ref}"`,
    );
  }

  const values = parseKeyValuePairs(flags.value) ?? {};
  const secrets = parseKeyValuePairs(flags.secret) as
    | Record<string, string>
    | undefined;

  const { accessToken, baseUrl } = await resolveAuth(flags.instance);
  const client = new ScaffolderClient(baseUrl, accessToken);

  const kind = parsedRef.kind ?? 'template';
  const namespace = flags.namespace ?? parsedRef.namespace;
  let templateRef: string;

  if (namespace) {
    templateRef = `${kind}:${namespace}/${parsedRef.name}`;
  } else {
    const catalog = createCatalogClient(baseUrl);
    const { items } = await catalog.queryEntities(
      { query: { kind, 'metadata.name': parsedRef.name } },
      { token: accessToken },
    );
    if (items.length === 0) {
      throw new Error(`Template not found: ${parsedRef.name}`);
    }
    if (items.length > 1) {
      throw new Error(
        `Multiple templates named "${parsedRef.name}" found; use a namespace to disambiguate`,
      );
    }
    templateRef = `${items[0].kind}:${
      items[0].metadata.namespace ?? 'default'
    }/${items[0].metadata.name}`;
  }

  const result = await client.execute({ templateRef, values, secrets });
  writeJson(result);
};
