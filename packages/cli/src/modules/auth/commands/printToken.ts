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
import { getSecretStore } from '../lib/secretStore';
import {
  readInstance,
  withMetadataLock,
  upsertInstance,
  getAllInstances,
} from '../lib/storage';
import { httpJson } from '../lib/http';

type Args = {
  name?: string;
};

export default async function main(argv: string[]) {
  const parsed = (yargs(hideBin(argv)) as yargs.Argv<Args>)
    .option('name', {
      type: 'string',
      desc: 'Name of the instance to use',
    })
    .parse() as unknown as Args & { [k: string]: unknown };

  let name = parsed.name;
  if (!name) {
    const all = await getAllInstances();
    if (!all.length)
      throw new Error('No instances found, run auth login first');
    const selected = all.find(i => i.selected) ?? all[0];
    name = selected.name;
  }
  const instance = await readInstance(name!);
  if (!instance) throw new Error(`Unknown instance '${name}'`);
  const authBase = new URL('/api/auth', instance.baseUrl)
    .toString()
    .replace(/\/$/, '');

  const secretStore = await getSecretStore();
  const service = `backstage-cli:instance:${instance.name}`;

  let accessToken: string | undefined;

  await withMetadataLock(instance.name, async () => {
    const meta = await readInstance(instance.name);
    if (!meta) throw new Error('Not logged in');

    const now = Date.now();
    const needsRefresh = now + 30_000 >= meta.accessTokenExpiresAt;

    if (!needsRefresh) {
      // Nothing to do, assume previously printed access token is not stored; force refresh path to obtain one
    }

    const clientId = meta.clientId;
    const clientSecret = (await secretStore.get(service, 'clientSecret')) ?? '';
    const refreshToken = (await secretStore.get(service, 'refreshToken')) ?? '';
    if (!clientId || !clientSecret || !refreshToken) {
      throw new Error('Missing stored credentials');
    }

    // Always refresh to produce a valid "current" access token, but do so while holding the lock
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

    // Persist rotated refresh token and expiry
    await secretStore.set(service, 'refreshToken', token.refresh_token);
    await upsertInstance({
      ...meta,
      issuedAt: Date.now(),
      accessTokenExpiresAt: Date.now() + token.expires_in * 1000,
    });

    accessToken = token.access_token;
  });

  process.stdout.write(`${accessToken}\n`);
}
