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

import { zstdCompressSync } from 'node:zlib';
import { validateRequest as validateRequestBase } from './validateRequest';
import { builtinProviderRegistry } from '../providers/testFixtures';

const validateRequest = (
  operation: Parameters<typeof validateRequestBase>[0],
  input: Parameters<typeof validateRequestBase>[1],
  registry = builtinProviderRegistry,
) => validateRequestBase(operation, input, registry);
import type { TrustedOperation } from './types';

const operation = {
  api: 'openai-responses',
  operation: 'stream',
  destination: 'https://provider.example/v1/responses',
  resolvedModel: 'authorized',
} as TrustedOperation;

function request(
  body: BodyInit,
  url = operation.destination,
  extra: HeadersInit = {},
) {
  return new Request(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...extra },
    body,
  });
}

describe('validateRequest', () => {
  it('validates the final destination, operation and resolved model', async () => {
    const valid = request('{"model":"authorized","input":[]}');
    await expect(validateRequest(operation, valid)).resolves.toBe('model');
    expect(await valid.text()).toBe('{"model":"authorized","input":[]}');
    for (const bad of [
      request('{"model":"other"}'),
      request('{"model":"authorized","model":"other"}'),
      request('{"model":"other","model":"authorized"}'),
      request(
        '{"model":"authorized"}',
        'https://attacker.example/v1/responses',
      ),
      request('{"model":"authorized"}', `${operation.destination}?redirect=1`),
      request('{"model":"authorized"}', operation.destination, {
        'content-encoding': 'gzip',
      }),
    ]) {
      await expect(validateRequest(operation, bad)).rejects.toThrow();
    }
    await expect(
      validateRequest(
        { ...operation, operation: 'classify' },
        request('{"model":"authorized"}'),
      ),
    ).rejects.toThrow();
    await expect(
      validateRequest(
        { ...operation, api: 'bedrock' } as unknown as TrustedOperation,
        request('{"model":"authorized"}'),
      ),
    ).rejects.toThrow();
  });

  it('normalizes only the allowlisted Anthropic SDK query parameter', async () => {
    const anthropic = {
      ...operation,
      api: 'anthropic-messages',
      destination: 'https://provider.example/v1/messages?bound=1',
    } as const;
    await expect(
      validateRequest(
        anthropic,
        request('{"model":"authorized"}', `${anthropic.destination}&beta=true`),
      ),
    ).resolves.toBe('model');
    for (const query of [
      '&beta=false',
      '&beta=true&beta=true',
      '&unbound=1',
      '&beta=true&extra=1',
    ]) {
      await expect(
        validateRequest(
          anthropic,
          request('{"model":"authorized"}', `${anthropic.destination}${query}`),
        ),
      ).rejects.toThrow();
    }
  });

  it('inspects the actual Codex zstd payload and rejects a substituted model', async () => {
    const codex = { ...operation, api: 'openai-codex-responses' } as const;
    const encode = (model: string) =>
      new Uint8Array(zstdCompressSync(Buffer.from(JSON.stringify({ model }))));
    await expect(
      validateRequest(
        codex,
        request(encode('authorized'), codex.destination, {
          'content-encoding': 'zstd',
        }),
      ),
    ).resolves.toBe('model');
    await expect(
      validateRequest(
        codex,
        request(encode('other'), codex.destination, {
          'content-encoding': 'zstd',
        }),
      ),
    ).rejects.toThrow();
  });
});
