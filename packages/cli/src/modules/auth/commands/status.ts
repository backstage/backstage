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
import { hideBin } from 'yargs/helpers';
import { resolveBackendBaseUrl } from '../lib/backendDiscovery';
import { getSecretStore } from '../lib/secretStore';
import { readMetadata, withMetadataLock, writeMetadata } from '../lib/storage';
import { httpJson } from '../lib/http';

type Args = {
  backendUrl?: string;
};

export default async function main(argv: string[]) {
  const parsed = (yargs(hideBin(argv)) as yargs.Argv<Args>)
    .option('backend-url', { type: 'string', desc: 'Backend base URL' })
    .parse();

  const backendBaseUrl = await resolveBackendBaseUrl({
    args: argv,
    explicit: parsed.backendUrl,
  });
  const authBase = new URL('/api/auth', backendBaseUrl)
    .toString()
    .replace(/\/$/, '');

  const secretStore = await getSecretStore();
  const service = `backstage-cli:${backendBaseUrl}`;

  let accessToken: string | undefined;
  let accessTokenExpiresAt: number | undefined;

  await withMetadataLock(backendBaseUrl, async () => {
    const meta = await readMetadata(backendBaseUrl);
    if (!meta) throw new Error('Not logged in');

    const now = Date.now();
    const needsRefresh = now + 30_000 >= meta.accessTokenExpiresAt;

    const clientId = meta.clientId;
    const clientSecret = (await secretStore.get(service, 'clientSecret')) ?? '';
    const refreshToken = (await secretStore.get(service, 'refreshToken')) ?? '';
    if (!clientId || !clientSecret || !refreshToken) {
      throw new Error('Missing stored credentials');
    }

    if (needsRefresh) {
      const token = await httpJson<{
        access_token: string;
        token_type: string;
        expires_in: number;
        refresh_token: string;
      }>(`${authBase}/v1/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }),
      });

      await secretStore.set(service, 'refreshToken', token.refresh_token);
      await writeMetadata(backendBaseUrl, {
        clientId,
        issuedAt: Date.now(),
        accessTokenExpiresAt: Date.now() + token.expires_in * 1000,
      });
      accessToken = token.access_token;
      accessTokenExpiresAt = Date.now() + token.expires_in * 1000;
    } else {
      // Within validity window, we still need an access token for userinfo, so refresh once
      const token = await httpJson<{
        access_token: string;
        token_type: string;
        expires_in: number;
        refresh_token: string;
      }>(`${authBase}/v1/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }),
      });
      await secretStore.set(service, 'refreshToken', token.refresh_token);
      accessToken = token.access_token;
      accessTokenExpiresAt = Date.now() + token.expires_in * 1000;
    }
  });

  const userinfo = await httpJson<any>(`${authBase}/v1/userinfo`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  process.stderr.write(
    `Logged in as: ${userinfo.sub ?? userinfo.entityRef ?? 'unknown'}\n`,
  );
  if (accessTokenExpiresAt) {
    process.stderr.write(
      `Access token expires: ${new Date(accessTokenExpiresAt).toISOString()}\n`,
    );
  }
}
