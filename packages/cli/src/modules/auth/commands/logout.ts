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

import yargs from 'yargs';
import { getSecretStore } from '../lib/secretStore';
import {
  removeInstance,
  withMetadataLock,
  getInstanceByName,
} from '../lib/storage';
import { httpJson } from '../lib/http';
import { pickInstance } from '../lib/prompt';

export async function logout(argv: string[]) {
  const parsed = await yargs(argv)
    .option('instance', {
      type: 'string',
      desc: 'Name of the instance to log out',
    })
    .parse();

  const { name: instanceName } = await pickInstance(parsed.instance);

  await withMetadataLock(async () => {
    const instance = await getInstanceByName(instanceName);
    const clientId = instance.clientId;
    const secretStore = await getSecretStore();
    const service = `backstage-cli:instance:${instanceName}`;
    const clientSecret = (await secretStore.get(service, 'clientSecret')) ?? '';
    const refreshToken = (await secretStore.get(service, 'refreshToken')) ?? '';

    if (clientId && clientSecret && refreshToken) {
      const basic = Buffer.from(`${clientId}:${clientSecret}`).toString(
        'base64',
      );
      try {
        const authBaseUrl = new URL('/api/auth', instance.baseUrl)
          .toString()
          .replace(/\/$/, '');
        await httpJson(`${authBaseUrl}/v1/revoke`, {
          method: 'POST',
          headers: { Authorization: `Basic ${basic}` },
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

    await secretStore.delete(service, 'clientSecret');
    await secretStore.delete(service, 'refreshToken');
    await removeInstance(instance.name);
  });

  process.stderr.write('Logged out\n');
}
