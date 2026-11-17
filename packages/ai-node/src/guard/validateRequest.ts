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

import { zstdDecompressSync } from 'node:zlib';
import type { TrustedOperation } from './types';
import { MODEL_HTTP_MATRIX } from './matrix';

const MAX_BODY = 16 * 1024 * 1024;
const ENDPOINTS = {
  'openai-responses': '/responses',
  'openai-completions': '/chat/completions',
  'azure-openai-responses': '/responses',
  'openai-codex-responses': '/responses',
  'anthropic-messages': '/messages',
} as const;

function assertUniqueTopLevelKeys(json: string) {
  const seen = new Set<string>();
  let depth = 0;
  for (let i = 0; i < json.length; i++) {
    const ch = json[i];
    if (ch === '"') {
      const start = i++;
      while (i < json.length && json[i] !== '"') {
        if (json[i] === '\\') i++;
        i++;
      }
      const end = i;
      let next = i + 1;
      while (/\s/.test(json[next] ?? '') && next < json.length) next++;
      if (depth === 1 && json[next] === ':') {
        const key: string = JSON.parse(json.slice(start, end + 1));
        if (seen.has(key)) throw new Error('Duplicate request field');
        seen.add(key);
      }
    } else if (ch === '{' || ch === '[') {
      depth++;
    } else if (ch === '}' || ch === ']') {
      depth--;
    }
  }
}

async function readBody(request: Request): Promise<Buffer> {
  const reader = request.clone().body?.getReader();
  if (!reader) throw new Error('Missing request body');
  const chunks: Buffer[] = [];
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY)
        throw new Error('Request body exceeds validation limit');
      chunks.push(Buffer.from(value));
    }
  } catch (error) {
    // Do not wait for cancellation of a tee whose other branch has not been consumed.
    void reader.cancel().catch(() => {});
    throw error;
  }
  return Buffer.concat(chunks, size);
}

/** Validate the final SDK-produced envelope, not the original Model object. */
export async function validateRequest(
  operation: TrustedOperation,
  request: Request,
): Promise<'model' | 'auth.token-exchange'> {
  if (
    !Object.hasOwn(MODEL_HTTP_MATRIX.operations, operation.operation) ||
    !MODEL_HTTP_MATRIX.operations[operation.operation] ||
    !Object.hasOwn(ENDPOINTS, operation.api)
  ) {
    throw new Error('Unverified model operation or transport');
  }
  const actual = new URL(request.url);
  const authDestination =
    operation.api === 'anthropic-messages' &&
    actual.pathname === '/v1/oauth/token' &&
    operation.authTokenDestinations?.includes(actual.href);
  const destination = new URL(
    authDestination ? actual.href : operation.destination,
  );
  const sdkParams: Readonly<Record<string, string>> =
    operation.api === 'anthropic-messages' && !authDestination
      ? MODEL_HTTP_MATRIX.sdkQueryParams['anthropic-messages']
      : {};
  for (const [key, value] of Object.entries(sdkParams)) {
    if (!destination.searchParams.has(key) && actual.searchParams.has(key)) {
      const values = actual.searchParams.getAll(key);
      if (values.length !== 1 || values[0] !== value) {
        throw new Error('Unexpected SDK query parameter');
      }
      actual.searchParams.delete(key);
    }
  }
  destination.searchParams.sort();
  actual.searchParams.sort();
  if (
    destination.href !== actual.href ||
    destination.username ||
    destination.password ||
    destination.hash ||
    (destination.protocol !== 'https:' &&
      !(
        destination.protocol === 'http:' &&
        ['localhost', '127.0.0.1', '[::1]'].includes(destination.hostname)
      )) ||
    (!authDestination &&
      !destination.pathname.endsWith(ENDPOINTS[operation.api])) ||
    request.method !== 'POST'
  )
    throw new Error('Unexpected model destination or method');
  const contentType = request.headers
    .get('content-type')
    ?.split(';', 1)[0]
    .trim()
    .toLowerCase();
  if (contentType !== 'application/json')
    throw new Error('Uninspectable model request');
  let bytes = await readBody(request);
  const encoding = request.headers.get('content-encoding')?.toLowerCase();
  if (encoding && encoding !== 'identity') {
    if (operation.api !== 'openai-codex-responses' || encoding !== 'zstd') {
      throw new Error('Uninspectable model request encoding');
    }
    bytes = zstdDecompressSync(bytes, { maxOutputLength: MAX_BODY });
  }
  const json = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  const payload: unknown = JSON.parse(json);
  assertUniqueTopLevelKeys(json);
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new Error('Uninspectable model request');
  }
  if (authDestination) {
    const tokenRequest = payload as Record<string, unknown>;
    if (
      tokenRequest.grant_type !==
        'urn:ietf:params:oauth:grant-type:jwt-bearer' ||
      typeof tokenRequest.assertion !== 'string' ||
      !tokenRequest.assertion ||
      typeof tokenRequest.organization_id !== 'string' ||
      !tokenRequest.organization_id ||
      typeof tokenRequest.federation_rule_id !== 'string' ||
      !tokenRequest.federation_rule_id
    ) {
      throw new Error('Uninspectable token request');
    }
    return 'auth.token-exchange';
  }
  if (
    !Object.hasOwn(payload, 'model') ||
    (payload as { model?: unknown }).model !== operation.resolvedModel
  ) {
    throw new Error('Request model does not match authorized model');
  }
  return 'model';
}
