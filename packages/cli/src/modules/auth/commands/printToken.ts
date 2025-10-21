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
  getInstanceByName,
  withMetadataLock,
  upsertInstance,
  StoredInstance,
  getSelectedInstance,
} from '../lib/storage';
import { httpJson } from '../lib/http';

export default async function main(argv: string[]) {
  const parsed = await yargs(argv)
    .option('name', {
      type: 'string',
      desc: 'Name of the instance to use',
    })
    .parse();

  let instance = await getSelectedInstance(parsed.name);

  if (accessTokenNeedsRefresh(instance)) {
    instance = await refreshAccessToken(instance.name);
  }

  process.stdout.write(`${instance.accessToken}\n`);
}

export function accessTokenNeedsRefresh(instance: StoredInstance): boolean {
  return instance.accessTokenExpiresAt <= Date.now() + 2 * 60_000; // 2 minutes before expiration
}

export async function refreshAccessToken(
  instanceName: string,
): Promise<StoredInstance> {
  const secretStore = await getSecretStore();
  const service = `backstage-cli:instance:${instanceName}`;

  return withMetadataLock(instanceName, async () => {
    const instance = await getInstanceByName(instanceName);

    const clientId = instance.clientId;
    const clientSecret = (await secretStore.get(service, 'clientSecret')) ?? '';
    const refreshToken = (await secretStore.get(service, 'refreshToken')) ?? '';
    if (!refreshToken) {
      throw new Error(
        'Access token is expired and no refresh token is available',
      );
    }
    if (!clientId || !clientSecret) {
      throw new Error('Missing stored credentials');
    }

    const token = await httpJson<{
      access_token: string;
      token_type: string;
      expires_in: number;
      refresh_token: string;
    }>(`${instance.baseUrl}/api/auth/v1/token`, {
      method: 'POST',
      body: {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      },
    });

    // Persist rotated refresh token, access token, and expiry
    await secretStore.set(service, 'refreshToken', token.refresh_token);
    const newInstance = {
      ...instance,
      accessToken: token.access_token,
      issuedAt: Date.now(),
      accessTokenExpiresAt: Date.now() + token.expires_in * 1000,
    };
    await upsertInstance(newInstance);
    return newInstance;
  });
}
