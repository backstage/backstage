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

import { StoredInstance, upsertInstance } from './storage';
import { getSecretStore } from './secretStore';
import { withMetadataLock } from './storage';
import { getInstanceByName } from './storage';
import { httpJson } from './http';

export function accessTokenNeedsRefresh(instance: StoredInstance): boolean {
  return instance.accessTokenExpiresAt <= Date.now() + 2 * 60_000; // 2 minutes before expiration
}

export async function refreshAccessToken(
  instanceName: string,
): Promise<StoredInstance> {
  const secretStore = await getSecretStore();

  return withMetadataLock(async () => {
    const instance = await getInstanceByName(instanceName);

    const clientId = instance.clientId;
    const service = `backstage-cli:instance:${instanceName}`;
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
