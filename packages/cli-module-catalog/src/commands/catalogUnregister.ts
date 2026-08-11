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
        'location-id': {
          type: String,
          description: 'Location ID to unregister',
        },
        'location-url': {
          type: String,
          description: 'Location URL to unregister',
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

  if (!flags['location-id'] && !flags['location-url']) {
    throw new Error(
      '--location-id or --location-url is required. Usage: catalog unregister --location-id <id>',
    );
  }

  const { accessToken, baseUrl } = await resolveAuth(flags.instance);
  const client = createCatalogClient(baseUrl);
  const options = { token: accessToken };

  if (flags['location-id']) {
    await client.removeLocationById(flags['location-id'], options);
  } else {
    const locationUrl = flags['location-url'];
    if (!locationUrl) {
      throw new Error(
        '--location-id or --location-url is required. Usage: catalog unregister --location-id <id>',
      );
    }
    const { items } = await client.getLocations(undefined, options);
    const locations = items.filter(
      location => location.target.toLowerCase() === locationUrl.toLowerCase(),
    );

    if (locations.length === 0) {
      throw new Error(`Location with URL ${locationUrl} not found`);
    }

    for (const location of locations) {
      await client.removeLocationById(location.id, options);
    }
  }

  writeJson({});
};
