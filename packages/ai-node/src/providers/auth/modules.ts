/*
 * Copyright 2026 The Backstage Authors
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

import type { OAuthCredential } from '@earendil-works/pi-ai';
import { assertCredential } from '../../credentials/identifiers';
import type { AiAuthModule, AuthOperationKind } from './types';
import type { AuthModuleLookup } from './guard';

/** Token routes owned by the journal vocabulary; modules may not add others. */
const RESERVED_TOKEN_PATHS = ['/oauth/token', '/v1/oauth/token'] as const;

/** Upper bound for a token request body. */
const MAX_REQUEST_BYTES = 8 * 1024;

const REFRESH_FIELDS = ['grant_type', 'refresh_token', 'client_id', 'scope'];
const EXCHANGE_FIELDS = [
  'grant_type',
  'code',
  'redirect_uri',
  'client_id',
  'code_verifier',
  'state',
];

/**
 * Validates registrations once and refuses duplicates and unsupported token
 * routes.
 *
 * @internal
 */
export function createAuthModuleRegistry(
  modules: readonly AiAuthModule[],
): AuthModuleLookup {
  const byId = new Map<string, AiAuthModule>();
  for (const module of modules) {
    if (
      !module ||
      typeof module.id !== 'string' ||
      !/^[a-z][a-z0-9-]{0,63}$/.test(module.id) ||
      byId.has(module.id) ||
      !RESERVED_TOKEN_PATHS.includes(module.tokenPath) ||
      (module.body !== 'json' && module.body !== 'form') ||
      typeof module.refreshRequest !== 'function' ||
      typeof module.exchangeRequest !== 'function' ||
      typeof module.validateTokenRequest !== 'function' ||
      typeof module.parseTokenResponse !== 'function'
    ) {
      throw new Error(
        `Invalid auth module registration: ${String(module?.id)}`,
      );
    }
    byId.set(module.id, Object.freeze({ ...module }));
  }
  return Object.freeze({ get: (id: string) => byId.get(id) });
}

async function assertTokenRequest(
  input: {
    operation: AuthOperationKind;
    endpoint: string;
    request: Request;
  },
  body: 'json' | 'form',
  tokenPath: string,
): Promise<void> {
  const { request, operation, endpoint } = input;
  const url = new URL(request.url);
  if (
    request.method !== 'POST' ||
    request.url.includes('?') ||
    `${url.protocol}//${url.host}${url.pathname}` !== endpoint ||
    url.pathname !== tokenPath
  ) {
    throw new Error('Unexpected token endpoint');
  }
  const contentType = request.headers.get('content-type') ?? '';
  const expected =
    body === 'json' ? 'application/json' : 'application/x-www-form-urlencoded';
  if (!contentType.toLowerCase().startsWith(expected)) {
    throw new Error('Unexpected token request encoding');
  }
  const text = await request.clone().text();
  if (text.length > MAX_REQUEST_BYTES) {
    throw new Error('Token request body exceeds limit');
  }
  let fields: Record<string, string>;
  if (body === 'json') {
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error('Token request body is not valid JSON');
    }
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      Array.isArray(parsed) ||
      Object.values(parsed).some(value => typeof value !== 'string')
    ) {
      throw new Error('Token request body has an unexpected shape');
    }
    fields = parsed as Record<string, string>;
  } else {
    fields = {};
    for (const [key, value] of new URLSearchParams(text)) {
      if (key in fields) throw new Error('Token request repeats a field');
      fields[key] = value;
    }
  }
  const allowed = operation === 'auth.token' ? REFRESH_FIELDS : EXCHANGE_FIELDS;
  const grant =
    operation === 'auth.token' ? 'refresh_token' : 'authorization_code';
  for (const [key, value] of Object.entries(fields)) {
    if (!allowed.includes(key) || value.length === 0) {
      throw new Error('Token request carries an unsupported field');
    }
  }
  if (fields.grant_type !== grant) {
    throw new Error('Token request has an unexpected grant type');
  }
}

/** Validates the token response and builds the credential. */
function parseTokenResponse(
  input: {
    body: unknown;
    previous?: OAuthCredential;
    now: number;
  },
  extraFields: readonly string[] = [],
): OAuthCredential {
  const body = input.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new Error('Token response has an unexpected shape');
  }
  const record = body as Record<string, unknown>;
  const access = record.access_token;
  const refresh = record.refresh_token ?? input.previous?.refresh;
  const expiresIn = record.expires_in;
  if (typeof access !== 'string' || access.length === 0) {
    throw new Error('Token response has no access token');
  }
  if (typeof refresh !== 'string' || refresh.length === 0) {
    throw new Error('Token response has no refresh token');
  }
  if (
    typeof expiresIn !== 'number' ||
    !Number.isFinite(expiresIn) ||
    expiresIn <= 0
  ) {
    throw new Error('Token response has an unusable expiry');
  }
  const extras: Record<string, unknown> = {};
  for (const field of extraFields) {
    if (record[field] !== undefined) {
      extras[field] = record[field];
    }
  }
  return assertCredential(
    {
      ...extras,
      type: 'oauth',
      refresh,
      access,
      expires: input.now + Math.round(expiresIn * 1000),
    },
    'token response credential',
  ) as OAuthCredential;
}

function tokenRequest(
  endpoint: string,
  body: 'json' | 'form',
  fields: Record<string, string>,
): Request {
  const encoded =
    body === 'json'
      ? JSON.stringify(fields)
      : new URLSearchParams(fields).toString();
  return new Request(endpoint, {
    method: 'POST',
    headers: {
      'content-type':
        body === 'json'
          ? 'application/json'
          : 'application/x-www-form-urlencoded',
    },
    body: encoded,
  });
}

/**
 * Anthropic (Claude subscription) OAuth: JSON token requests on the reserved
 * `/v1/oauth/token` route.
 *
 * @internal
 */
export const anthropicAuthModule: AiAuthModule = {
  id: 'anthropic',
  tokenPath: '/v1/oauth/token',
  body: 'json',
  refreshRequest: ({ endpoint, clientId, credential }) =>
    tokenRequest(endpoint, 'json', {
      grant_type: 'refresh_token',
      refresh_token: credential.refresh,
      client_id: clientId,
    }),
  exchangeRequest: ({ endpoint, clientId, code, codeVerifier, redirectUri }) =>
    tokenRequest(endpoint, 'json', {
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      code_verifier: codeVerifier,
    }),
  validateTokenRequest: input =>
    assertTokenRequest(input, 'json', '/v1/oauth/token'),
  parseTokenResponse: input =>
    parseTokenResponse(input, ['account', 'account_id']),
  extraFields: ['account', 'account_id'],
};

/**
 * OpenAI (ChatGPT subscription) OAuth: form-encoded token requests on the
 * reserved `/oauth/token` route.
 *
 * @internal
 */
export const openaiAuthModule: AiAuthModule = {
  id: 'openai',
  tokenPath: '/oauth/token',
  body: 'form',
  refreshRequest: ({ endpoint, clientId, credential }) =>
    tokenRequest(endpoint, 'form', {
      grant_type: 'refresh_token',
      refresh_token: credential.refresh,
      client_id: clientId,
    }),
  exchangeRequest: ({ endpoint, clientId, code, codeVerifier, redirectUri }) =>
    tokenRequest(endpoint, 'form', {
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      code_verifier: codeVerifier,
    }),
  validateTokenRequest: input =>
    assertTokenRequest(input, 'form', '/oauth/token'),
  parseTokenResponse: input =>
    parseTokenResponse(input, ['account_id', 'chatgpt_account_id']),
  extraFields: ['account_id', 'chatgpt_account_id'],
};

/** Host registration: add another trusted auth module here to enable it. */
export const builtinAuthModules = Object.freeze([
  anthropicAuthModule,
  openaiAuthModule,
]);

/** @internal */
export const builtinAuthModuleRegistry =
  createAuthModuleRegistry(builtinAuthModules);
