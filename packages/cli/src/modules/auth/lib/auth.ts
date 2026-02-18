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

import { z } from 'zod';
import { StoredInstance, upsertInstance } from './storage';
import { getSecretStore } from './secretStore';
import { withMetadataLock } from './storage';
import { getInstanceByName } from './storage';
import { httpJson } from './http';

const TokenResponseSchema = z.object({
  access_token: z.string().min(1),
  token_type: z.string().min(1),
  expires_in: z.number().positive().finite(),
  refresh_token: z.string().min(1),
});

export function accessTokenNeedsRefresh(instance: StoredInstance): boolean {
  return instance.accessTokenExpiresAt <= Date.now() + 2 * 60_000; // 2 minutes before expiration
}

export async function refreshAccessToken(
  instanceName: string,
): Promise<StoredInstance> {
  const secretStore = await getSecretStore();

  return withMetadataLock(async () => {
    const instance = await getInstanceByName(instanceName);

    const service = `backstage-cli:instance:${instanceName}`;
    const refreshToken = (await secretStore.get(service, 'refreshToken')) ?? '';
    if (!refreshToken) {
      throw new Error(
        'Access token is expired and no refresh token is available',
      );
    }

    const response = await httpJson<unknown>(
      `${instance.baseUrl}/api/auth/v1/token`,
      {
        method: 'POST',
        body: {
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        },
        signal: AbortSignal.timeout(30_000),
      },
    );

    const parsed = TokenResponseSchema.safeParse(response);
    if (!parsed.success) {
      throw new Error(`Invalid token response: ${parsed.error.message}`);
    }
    const token = parsed.data;

    await secretStore.set(service, 'accessToken', token.access_token);
    await secretStore.set(service, 'refreshToken', token.refresh_token);
    const newInstance = {
      ...instance,
      issuedAt: Date.now(),
      accessTokenExpiresAt: Date.now() + token.expires_in * 1000,
    };
    await upsertInstance(newInstance);
    return newInstance;
  });
}
