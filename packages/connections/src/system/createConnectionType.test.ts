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
import { z } from 'zod/v4';
import { createConnectionType } from './createConnectionType';

describe('createConnectionType', () => {
  it('builds a single-auth-method connection type whose schema validates correctly', () => {
    const tokenAuth = {
      method: 'token',
      configSchema: z.object({ token: z.string() }),
    } as const;

    const SingleAuthType = createConnectionType({
      type: 'single',
      configSchema: z.object({ host: z.string() }),
      authMethods: [tokenAuth],
    });

    expect(SingleAuthType.type).toBe('single');
    expect(SingleAuthType.authMethods).toEqual([tokenAuth]);

    expect(() =>
      SingleAuthType.schema.parse({
        type: 'single',
        host: 'example.com',
        auth: [{ method: 'token', token: 'abc' }],
      }),
    ).not.toThrow();

    // Wrong literal type should fail.
    expect(() =>
      SingleAuthType.schema.parse({
        type: 'other',
        host: 'example.com',
        auth: [{ method: 'token', token: 'abc' }],
      }),
    ).toThrow();

    // Missing required config field should fail.
    expect(() =>
      SingleAuthType.schema.parse({
        type: 'single',
        auth: [{ method: 'token', token: 'abc' }],
      }),
    ).toThrow();

    // Auth method not in the list should fail.
    expect(() =>
      SingleAuthType.schema.parse({
        type: 'single',
        host: 'example.com',
        auth: [{ method: 'other', token: 'abc' }],
      }),
    ).toThrow();

    // Unknown top-level fields should fail.
    expect(() =>
      SingleAuthType.schema.parse({
        type: 'single',
        host: 'example.com',
        host2: 'example.com',
        auth: [{ method: 'token', token: 'abc' }],
      }),
    ).toThrow();
  });

  it('builds a multi-auth-method connection type that discriminates on method', () => {
    const MultiAuthType = createConnectionType({
      type: 'multi',
      configSchema: z.object({ host: z.string() }),
      authMethods: [
        { method: 'token', configSchema: z.object({ token: z.string() }) },
        {
          method: 'app',
          configSchema: z.object({
            appId: z.number(),
            privateKey: z.string(),
          }),
        },
      ],
    });

    // Both auth methods accepted in the same connection.
    expect(() =>
      MultiAuthType.schema.parse({
        type: 'multi',
        host: 'example.com',
        auth: [
          { method: 'token', token: 'abc' },
          { method: 'app', appId: 1, privateKey: 'pk' },
        ],
      }),
    ).not.toThrow();

    // Auth config must match the discriminator.
    expect(() =>
      MultiAuthType.schema.parse({
        type: 'multi',
        host: 'example.com',
        auth: [{ method: 'app', token: 'abc' }],
      }),
    ).toThrow();

    // Unknown discriminator should fail.
    expect(() =>
      MultiAuthType.schema.parse({
        type: 'multi',
        host: 'example.com',
        auth: [{ method: 'oauth' }],
      }),
    ).toThrow();

    // Empty auth array is allowed by the array schema.
    expect(() =>
      MultiAuthType.schema.parse({
        type: 'multi',
        host: 'example.com',
        auth: [],
      }),
    ).not.toThrow();
  });
});
