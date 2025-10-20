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
import { startCallbackServer } from '../lib/localServer';
import { openInBrowser } from '../lib/browser';
import { challengeFromVerifier, generateVerifier } from '../lib/pkce';
import { httpJson } from '../lib/http';
import { upsertInstance, withMetadataLock } from '../lib/storage';
import { getSecretStore } from '../lib/secretStore';
import crypto from 'crypto';
import fs from 'fs-extra';
import path from 'path';
import glob from 'glob';
import YAML from 'yaml';
import inquirer from 'inquirer';

type Args = {
  backendUrl?: string;
  noBrowser?: boolean;
  name?: string;
};

export default async function main(argv: string[]) {
  const parsed = parseArgs(argv);

  const backendBaseUrl = await resolveBackendBaseUrl({
    explicit: parsed.backendUrl,
  });
  const authBaseUrl = `${backendBaseUrl}/api/auth`;

  const callback = await startCallbackServer({ state: cryptoRandom() });
  const { client_id, client_secret } = await registerClient(
    authBaseUrl,
    callback.url,
  );

  const { verifier, challenge, state } = createPkceState();
  const authorizeUrl = buildAuthorizeUrl({
    authBaseUrl,
    clientId: client_id,
    redirectUri: callback.url,
    state,
    challenge,
  });

  await openBrowserOrPrint(authorizeUrl, parsed.noBrowser);

  const code = await waitForAuthorizationCode(callback, state);

  const token = await exchangeAuthorizationCode({
    authBaseUrl,
    code,
    redirectUri: callback.url,
    verifier,
  });

  await persistInstance({
    parsed,
    backendBaseUrl,
    clientId: client_id,
    clientSecret: client_secret,
    token,
  });

  process.stderr.write('Login successful\n');
}

function parseArgs(argv: string[]): Args & { [k: string]: unknown } {
  return (yargs(argv) as yargs.Argv<Args>)
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
}

async function resolveBackendBaseUrl(options: { explicit?: string }) {
  if (options.explicit) {
    return normalizeUrl(options.explicit);
  }
  const cwd = process.cwd();
  const candidates: Array<{ url: string; file: string }> = [];

  const patterns = [
    'app-config.yaml',
    'app-config.*.yaml',
    'packages/*/app-config.yaml',
    'packages/*/app-config.*.yaml',
  ];
  const files = patterns.flatMap(p => glob.sync(p, { cwd, nodir: true }));
  for (const file of files) {
    try {
      const content = await fs.readFile(path.resolve(cwd, file), 'utf8');
      const doc = YAML.parse(content);
      const url = doc?.backend?.baseUrl as string | undefined;
      if (url) {
        candidates.push({ url: normalizeUrl(url), file });
      }
    } catch {
      // ignore parse errors
    }
  }

  const list = candidates;
  if (list.length === 0) {
    const { manual } = await inquirer.prompt<{ manual: string }>([
      { type: 'input', name: 'manual', message: 'Enter backend base URL' },
    ]);
    return normalizeUrl(manual);
  }
  if (list.length === 1) {
    return list[0].url;
  }

  const { picked } = await inquirer.prompt<{ picked: string }>([
    {
      type: 'list',
      name: 'picked',
      message: 'Select backend base URL',
      choices: [
        ...list.map(e => ({ name: `${e.url} (${e.file})`, value: e.url })),
        { name: 'Enter manually', value: '__manual__' },
      ],
    },
  ]);
  if (picked === '__manual__') {
    const { manual } = await inquirer.prompt<{ manual: string }>([
      { type: 'input', name: 'manual', message: 'Enter backend base URL' },
    ]);
    return normalizeUrl(manual);
  }
  return picked;
}

function normalizeUrl(u: string): string {
  const url = new URL(u);
  return url.toString().replace(/\/$/, '');
}

async function registerClient(authBase: string, redirectUri: string) {
  return await httpJson<{ client_id: string; client_secret: string }>(
    `${authBase}/v1/register`,
    {
      method: 'POST',
      body: {
        client_name: 'Backstage CLI',
        redirect_uris: [redirectUri],
        response_types: ['code'],
        grant_types: ['authorization_code'],
        scope: 'openid offline_access',
      },
    },
  );
}

function createPkceState() {
  const verifier = generateVerifier();
  const challenge = challengeFromVerifier(verifier);
  const state = cryptoRandom();
  return { verifier, challenge, state };
}

function buildAuthorizeUrl(options: {
  authBaseUrl: string;
  clientId: string;
  redirectUri: string;
  state: string;
  challenge: string;
}): string {
  const { authBaseUrl, clientId, redirectUri, state, challenge } = options;
  const authorize = new URL(`${authBaseUrl}/v1/authorize`);
  authorize.searchParams.set('client_id', clientId);
  authorize.searchParams.set('redirect_uri', redirectUri);
  authorize.searchParams.set('response_type', 'code');
  authorize.searchParams.set('scope', 'openid offline_access');
  authorize.searchParams.set('state', state);
  authorize.searchParams.set('code_challenge', challenge);
  authorize.searchParams.set('code_challenge_method', 'S256');
  return authorize.toString();
}

async function openBrowserOrPrint(url: string, noBrowser?: boolean) {
  if (noBrowser) {
    process.stderr.write(`Open this URL to continue: ${url}\n`);
  } else {
    openInBrowser(url);
  }
}

async function waitForAuthorizationCode(
  callback: Awaited<ReturnType<typeof startCallbackServer>>,
  expectedState: string,
) {
  const { code, state } = await callback.waitForCode();
  await callback.close();
  if (state !== expectedState) {
    throw new Error('State mismatch');
  }
  return code;
}

async function exchangeAuthorizationCode(options: {
  authBaseUrl: string;
  code: string;
  redirectUri: string;
  verifier: string;
}) {
  const { authBaseUrl, code, redirectUri, verifier } = options;
  return await httpJson<{
    access_token: string;
    token_type: string;
    expires_in: number;
    id_token?: string;
    refresh_token?: string;
  }>(`${authBaseUrl}/v1/token`, {
    method: 'POST',
    body: {
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      code_verifier: verifier,
    },
  });
}

async function persistInstance(options: {
  parsed: Args;
  backendBaseUrl: string;
  clientId: string;
  clientSecret: string;
  token: { refresh_token?: string; expires_in: number };
}) {
  const { parsed, backendBaseUrl, clientId, clientSecret, token } = options;
  if (!token.refresh_token) {
    throw new Error('No refresh token received');
  }
  const name: string = parsed.name || new URL(backendBaseUrl).host;
  const secretStore = await getSecretStore();
  const service = `backstage-cli:instance:${name}`;
  await withMetadataLock(name, async () => {
    await secretStore.set(service, 'clientSecret', clientSecret);
    await secretStore.set(service, 'refreshToken', token.refresh_token!);
    await upsertInstance({
      name,
      baseUrl: backendBaseUrl,
      clientId,
      issuedAt: Date.now(),
      accessTokenExpiresAt: Date.now() + token.expires_in * 1000,
    });
  });
}

function cryptoRandom(): string {
  return crypto.randomBytes(16).toString('hex');
}
