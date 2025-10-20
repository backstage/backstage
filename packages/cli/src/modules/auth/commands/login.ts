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
import { startCallbackServer } from '../lib/localServer';
import { openInBrowser } from '../lib/browser';
import { challengeFromVerifier, generateVerifier } from '../lib/pkce';
import { httpJson } from '../lib/http';
import { upsertInstance, withMetadataLock } from '../lib/storage';
import { getSecretStore } from '../lib/secretStore';
import crypto from 'crypto';

type Args = {
  backendUrl?: string;
  noBrowser?: boolean;
  name?: string;
};

export default async function main(argv: string[]) {
  const parsed = (yargs(hideBin(argv)) as yargs.Argv<Args>)
    .option('backend-url', { type: 'string', desc: 'Backend base URL' })
    .option('no-browser', {
      type: 'boolean',
      desc: 'Do not open browser automatically',
    })
    .option('name', {
      type: 'string',
      desc: 'Name for this instance (used by other auth commands)',
    })
    .parse() as unknown as Args & { [k: string]: unknown };

  const backendBaseUrl = await resolveBackendBaseUrl({
    args: argv,
    explicit: parsed.backendUrl,
  });
  const authBase = new URL('/api/auth', backendBaseUrl)
    .toString()
    .replace(/\/$/, '');

  // Register client
  const callback = await startCallbackServer({ state: cryptoRandom() });
  const registerBody = {
    client_name: 'Backstage CLI',
    redirect_uris: [callback.url],
    response_types: ['code'],
    grant_types: ['authorization_code'],
    scope: 'openid offline_access',
  };
  const registration = await httpJson<{
    client_id: string;
    client_secret: string;
  }>(`${authBase}/v1/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(registerBody),
  });

  // PKCE & state
  const verifier = generateVerifier();
  const challenge = challengeFromVerifier(verifier);
  const state = cryptoRandom();

  // Authorize
  const authorize = new URL(`${authBase}/v1/authorize`);
  authorize.searchParams.set('client_id', registration.client_id);
  authorize.searchParams.set('redirect_uri', callback.url);
  authorize.searchParams.set('response_type', 'code');
  authorize.searchParams.set('scope', 'openid offline_access');
  authorize.searchParams.set('state', state);
  authorize.searchParams.set('code_challenge', challenge);
  authorize.searchParams.set('code_challenge_method', 'S256');

  if (parsed.noBrowser) {
    process.stderr.write(
      `Open this URL to continue: ${authorize.toString()}\n`,
    );
  } else {
    openInBrowser(authorize.toString());
  }

  const { code, state: returnedState } = await callback.waitForCode();
  await callback.close();
  if (returnedState !== state) {
    throw new Error('State mismatch');
  }

  // Exchange code for token
  const token = await httpJson<{
    access_token: string;
    token_type: string;
    expires_in: number;
    id_token?: string;
    refresh_token?: string;
  }>(`${authBase}/v1/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: callback.url,
      code_verifier: verifier,
    }),
  });

  if (!token.refresh_token) {
    throw new Error('No refresh token received');
  }
  const refreshTokenValue: string = token.refresh_token;

  const name: string = parsed.name || new URL(backendBaseUrl).host;
  const secretStore = await getSecretStore();
  const service = `backstage-cli:instance:${name}`;

  await withMetadataLock(name, async () => {
    await secretStore.set(service, 'clientSecret', registration.client_secret);
    await secretStore.set(service, 'refreshToken', refreshTokenValue);
    await upsertInstance({
      name,
      baseUrl: backendBaseUrl,
      clientId: registration.client_id,
      issuedAt: Date.now(),
      accessTokenExpiresAt: Date.now() + token.expires_in * 1000,
    });
  });

  process.stderr.write('Login successful\n');
}

function cryptoRandom(): string {
  return crypto.randomBytes(16).toString('hex');
}
