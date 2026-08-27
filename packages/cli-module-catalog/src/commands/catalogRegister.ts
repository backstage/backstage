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
import { writeJson } from '../lib/intentFormat';

export default async ({ args, info }: CliCommandContext) => {
  const { flags } = cli(
    {
      name: info.usage,
      flags: {
        'location-url': {
          type: String,
          description: 'URL to the catalog-info.yaml file (required)',
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

  if (!flags['location-url']) {
    throw new Error(
      '--location-url is required. Usage: catalog register --location-url <url>',
    );
  }

  try {
    // eslint-disable-next-line no-new
    new URL(flags['location-url']);
  } catch {
    throw new Error(`${flags['location-url']} is an invalid URL`);
  }

  const { accessToken, baseUrl } = await resolveAuth(flags.instance);
  const client = createCatalogClient(baseUrl);

  const result = await client.addLocation(
    { type: 'url', target: flags['location-url'] },
    { token: accessToken },
  );
  writeJson({ locationId: result.location.id });
};
