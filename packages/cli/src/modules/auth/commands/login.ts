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
import { spawn } from 'child_process';
import { challengeFromVerifier, generateVerifier } from '../lib/pkce';
import { httpJson } from '../lib/http';
import {
  upsertInstance,
  withMetadataLock,
  getAllInstances,
  StoredInstance,
} from '../lib/storage';
import { getSecretStore } from '../lib/secretStore';
import crypto from 'crypto';
import fs from 'fs-extra';
import path from 'path';
import glob from 'glob';
import YAML from 'yaml';
import inquirer from 'inquirer';

export async function login(argv: string[]) {
  const parsed = await yargs(argv)
    .option('backend-url', { type: 'string', desc: 'Backend base URL' })
    .option('no-browser', {
      type: 'boolean',
      desc: 'Do not open browser automatically',
    })
    .option('instance', {
      type: 'string',
      desc: 'Name for this instance (used by other auth commands)',
    })
    .parse();

  // Load existing instances to allow re-authentication
  const { instances, selected } = await getAllInstances();

  // Determine which instance to authenticate
  let backendBaseUrl: string;
  let instanceName: string;

  if (parsed.instance) {
    instanceName = parsed.instance;
    // User specified a name explicitly
    const targetInstance = instances.find(i => i.name === parsed.instance);
    if (targetInstance) {
      backendBaseUrl =
        normalizeUrl(parsed.backendUrl) ?? targetInstance.baseUrl;
    } else {
      // New instance with specified name
      backendBaseUrl = normalizeUrl(parsed.backendUrl) ?? (await pickBaseUrl());
    }
  } else if (parsed.backendUrl) {
    // User specified a URL, create or update instance
    backendBaseUrl = normalizeUrl(parsed.backendUrl);
    instanceName = deriveInstanceName(backendBaseUrl);
  } else if (instances.length > 0) {
    // Prompt to select existing instance or create new
    const choice = await promptForInstance(instances, selected);
    if (choice === '__new__') {
      backendBaseUrl = await pickBaseUrl();
      instanceName = deriveInstanceName(backendBaseUrl);
    } else {
      const targetInstance = instances.find(i => i.name === choice);
      if (!targetInstance) {
        throw new Error('Instance not found');
      }
      backendBaseUrl = targetInstance.baseUrl;
      instanceName = targetInstance.name;
    }
  } else {
    // No instances, resolve URL from config or prompt
    backendBaseUrl = await pickBaseUrl();
    instanceName = deriveInstanceName(backendBaseUrl);
  }

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
    instanceName,
    backendBaseUrl,
    clientId: client_id,
    clientSecret: client_secret,
    token,
  });

  process.stderr.write('Login successful\n');
}

async function promptForInstance(
  instances: StoredInstance[],
  selected: StoredInstance | undefined,
): Promise<string> {
  const choices = instances.map(i => ({
    name: `${i.name === selected?.name ? '* ' : '  '}${i.name} (${i.baseUrl})`,
    value: i.name,
  }));

  choices.push({
    name: 'Add new instance...',
    value: '__new__',
  });

  const { choice } = await inquirer.prompt<{ choice: string }>([
    {
      type: 'list',
      name: 'choice',
      message: 'Select instance to authenticate:',
      choices,
      default: selected?.name ?? '__new__',
    },
  ]);

  return choice;
}

async function pickBaseUrl() {
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

function normalizeUrl(u: string): string;
function normalizeUrl(u: string | undefined): string | undefined;
function normalizeUrl(u: string | undefined): string | undefined {
  if (u === undefined) {
    return undefined;
  }
  const url = new URL(u);
  return url.toString().replace(/\/$/, '');
}

function deriveInstanceName(url: string): string {
  return new URL(url).host;
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
      signal: AbortSignal.timeout(30_000),
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
    process.stderr.write(`Opening the following URL: ${url}\n`);
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
    signal: AbortSignal.timeout(30_000),
  });
}

async function persistInstance(options: {
  instanceName: string;
  backendBaseUrl: string;
  clientId: string;
  clientSecret: string;
  token: { access_token: string; refresh_token?: string; expires_in: number };
}) {
  const { instanceName, backendBaseUrl, clientId, clientSecret, token } =
    options;
  const secretStore = await getSecretStore();
  await withMetadataLock(async () => {
    const service = `backstage-cli:instance:${instanceName}`;
    await secretStore.set(service, 'clientSecret', clientSecret);
    if (token.refresh_token) {
      await secretStore.set(service, 'refreshToken', token.refresh_token);
    } else {
      process.stderr.write(
        'Warning: No refresh token received. You will need to re-authenticate when the access token expires.\n',
      );
    }
    await upsertInstance({
      name: instanceName,
      baseUrl: backendBaseUrl,
      clientId,
      accessToken: token.access_token,
      issuedAt: Date.now(),
      accessTokenExpiresAt: Date.now() + token.expires_in * 1000,
    });
  });
}

function cryptoRandom(): string {
  return crypto.randomBytes(16).toString('hex');
}

// The react-dev-utils/openBrowser breaks the login URL by encoding the URL parameters again
export function openInBrowser(url: string): void {
  const handleError = (error: unknown) => {
    const message = error instanceof Error ? error.message : 'Unknown error';
    process.stderr.write(
      `Warning: Failed to open browser automatically: ${message}\n`,
    );
    process.stderr.write(`Please open this URL manually: ${url}\n`);
  };

  const spawnOpts = { detached: true, stdio: 'ignore' } as const;
  let child;
  try {
    if (process.platform === 'darwin') {
      child = spawn('open', [url], spawnOpts);
    } else if (process.platform === 'win32') {
      child = spawn('cmd', ['/c', 'start', '""', url], spawnOpts);
    } else {
      // linux and others
      child = spawn('xdg-open', [url], spawnOpts);
    }
    child.unref();
    child.on('error', handleError);
  } catch (error) {
    handleError(error);
  }
}
