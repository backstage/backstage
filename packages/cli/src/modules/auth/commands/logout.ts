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
import { removeMetadata, withMetadataLock, readMetadata } from '../lib/storage';
import { httpForm } from '../lib/http';

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

  await withMetadataLock(backendBaseUrl, async () => {
    const meta = await readMetadata(backendBaseUrl);
    const clientId = meta?.clientId;
    const clientSecret = (await secretStore.get(service, 'clientSecret')) ?? '';
    const refreshToken = (await secretStore.get(service, 'refreshToken')) ?? '';

    if (clientId && clientSecret && refreshToken) {
      const basic = Buffer.from(`${clientId}:${clientSecret}`).toString(
        'base64',
      );
      try {
        await httpForm(
          `${authBase}/v1/revoke`,
          { token: refreshToken, token_type_hint: 'refresh_token' },
          {
            headers: { Authorization: `Basic ${basic}` },
          },
        );
      } catch {
        // ignore errors per RFC 7009
      }
    }

    await secretStore.delete(service, 'clientSecret');
    await secretStore.delete(service, 'refreshToken');
    await removeMetadata(backendBaseUrl);
  });

  process.stderr.write('Logged out\n');
}
