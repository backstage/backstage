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

import { guardedRequestOptions } from './requestOptions';
import type { TrustedOperation } from './types';

describe('guarded request options', () => {
  it('pins Codex SSE and the guard and rejects client and transport overrides', () => {
    const operation = {
      api: 'openai-codex-responses',
      operation: 'completeSimple',
      controller: new AbortController(),
    } as TrustedOperation;
    const guarded = { fetch: jest.fn(), finish: jest.fn() };
    const signal = new AbortController();
    const result = guardedRequestOptions(operation, guarded, {
      signal: signal.signal,
      maxRetries: 2,
    });
    expect(result.transport).toBe('sse');
    expect(result.maxRetries).toBe(2);
    expect(typeof result.fetch).toBe('function');
    signal.abort();
    expect((result.signal as AbortSignal).aborted).toBe(true);
    for (const options of [
      { transport: 'auto' },
      { transport: 'websocket' },
      { fetch: globalThis.fetch },
      { client: {} },
      { apiKey: 'override' },
      { env: {} },
      { headers: {} },
      { transformHeaders: () => ({}) },
      { azureDeploymentName: 'other' },
    ])
      expect(() =>
        guardedRequestOptions(operation, guarded, options),
      ).toThrow();
    expect(() =>
      guardedRequestOptions({ ...operation, operation: 'classify' }, guarded),
    ).toThrow();
    expect(() =>
      guardedRequestOptions(
        { ...operation, api: 'bedrock' } as unknown as TrustedOperation,
        guarded,
      ),
    ).toThrow();
  });
});
