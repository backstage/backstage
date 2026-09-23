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
import { resolveAuth } from '../lib/resolveAuth';
import { writeJson } from '../lib/intentFormat';
import { parseEntityRef } from '../lib/input';

export default async ({ args, info }: CliCommandContext) => {
  const parsed = cli(
    {
      name: info.usage,
      strictFlags: true,
      parameters: ['[ref]'],
      flags: {
        'template-ref': {
          type: String,
          description: 'Template entity reference alias',
        },
        value: {
          type: [String] as const,
          description: 'Template input value as repeatable key=value input',
          default: [] as string[],
        },
        secret: {
          type: [String] as const,
          description: 'Template secret as repeatable key=value input',
          default: [] as string[],
        },
        namespace: {
          type: String,
          description: 'Template namespace for a short reference',
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
  const ref = parsed._?.ref;

  if (!ref && !flags['template-ref']) {
    throw new Error(
      'Template reference or --template-ref is required. Usage: template execute [namespace/]name',
    );
  }

  const { accessToken, baseUrl } = await resolveAuth(flags.instance);
  const client = new ScaffolderClient(baseUrl, accessToken);
  let templateRef = flags['template-ref'];

  if (!templateRef && ref) {
    const parsedRef = parseEntityRef(ref);
    const kind = parsedRef.kind ?? 'template';
    const namespace = flags.namespace ?? parsedRef.namespace;

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
  }

  const values = parseKeyValuePairs(flags.value) ?? {};
  const secrets = parseKeyValuePairs(flags.secret) as
    | Record<string, string>
    | undefined;

  const result = await client.execute({
    templateRef: templateRef!,
    values,
    secrets,
  });
  writeJson(result);
};
