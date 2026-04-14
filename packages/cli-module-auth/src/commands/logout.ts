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
import { getSecretStore, getAuthInstanceService } from '@internal/cli';
import {
  removeInstance,
  withMetadataLock,
  getInstanceByName,
} from '../lib/storage';
import { httpJson } from '../lib/http';
import { pickInstance } from '../lib/prompt';

export default async ({ args, info }: CliCommandContext) => {
  const {
    flags: { instance: instanceFlag },
  } = cli(
    {
      help: info,
      flags: {
        instance: {
          type: String,
          description: 'Name of the instance to log out',
        },
      },
    },
    undefined,
    args,
  );

  const { name: instanceName } = await pickInstance(instanceFlag);

  await withMetadataLock(async () => {
    const instance = await getInstanceByName(instanceName);
    const secretStore = await getSecretStore();
    const service = getAuthInstanceService(instanceName);
    const refreshToken = (await secretStore.get(service, 'refreshToken')) ?? '';

    if (refreshToken) {
      try {
        const authBaseUrl = new URL('/api/auth', instance.baseUrl)
          .toString()
          .replace(/\/$/, '');
        await httpJson(`${authBaseUrl}/v1/revoke`, {
          method: 'POST',
          body: {
            token: refreshToken,
            token_type_hint: 'refresh_token',
          },
          signal: AbortSignal.timeout(30_000),
        });
      } catch {
        // ignore errors per RFC 7009
      }
    }

    await secretStore.delete(service, 'accessToken');
    await secretStore.delete(service, 'refreshToken');
    await removeInstance(instance.name);
  });

  process.stdout.write('Logged out\n');
};
