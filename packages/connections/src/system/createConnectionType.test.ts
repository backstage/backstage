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
import { InputError } from '@backstage/errors';
import { createConnectionType } from './createConnectionType';

describe('createConnectionType', () => {
  it('builds a single-auth-method connection type whose schema validates correctly', () => {
    const tokenAuth = {
      method: 'token',
      title: 'Token',
      configSchema: z.object({ token: z.string() }),
    } as const;

    const SingleAuthType = createConnectionType({
      type: 'single',
      title: 'Single',
      configSchema: z.object({ host: z.string() }),
      authMethods: [tokenAuth],
    });

    expect(SingleAuthType.type).toBe('single');
    expect(SingleAuthType.authMethods).toEqual([
      expect.objectContaining({ method: 'token', title: 'Token' }),
    ]);
    expect(
      SingleAuthType.authMethods[0].configSchema.schema().schema,
    ).toMatchObject({
      type: 'object',
      properties: { token: { type: 'string' } },
    });
    expect(
      SingleAuthType.authMethods[0].configSchema.parse({ token: 'abc' }).token,
    ).toBe('abc');
    expect(SingleAuthType.configSchema.schema().schema).toMatchObject({
      type: 'object',
      properties: {
        type: { const: 'single' },
        host: { type: 'string' },
        auth: { type: 'array' },
      },
      additionalProperties: false,
    });
    expect(SingleAuthType.configSchema.schema().schema.required).toEqual(
      expect.arrayContaining(['host', 'type', 'auth']),
    );
    expect(SingleAuthType.configSchema.schema().schema.required).toHaveLength(
      3,
    );
    expect(SingleAuthType.configSchema.parse).toBeInstanceOf(Function);

    const parsed = SingleAuthType.configSchema.parse({
      type: 'single',
      host: 'example.com',
      auth: [{ method: 'token', token: 'abc' }],
    });
    expect(parsed.type).toBe('single');
    expect(parsed.host).toBe('example.com');
    expect(parsed.auth[0].token).toBe('abc');

    // Wrong literal type should fail.
    expect(() =>
      SingleAuthType.configSchema.parse({
        type: 'other',
        host: 'example.com',
        auth: [{ method: 'token', token: 'abc' }],
      }),
    ).toThrow();

    // Missing required config field should fail.
    expect(() =>
      SingleAuthType.configSchema.parse({
        type: 'single',
        auth: [{ method: 'token', token: 'abc' }],
      }),
    ).toThrow();

    // Auth method not in the list should fail.
    expect(() =>
      SingleAuthType.configSchema.parse({
        type: 'single',
        host: 'example.com',
        auth: [{ method: 'other', token: 'abc' }],
      }),
    ).toThrow();

    // Unknown top-level fields should fail.
    expect(() =>
      SingleAuthType.configSchema.parse({
        type: 'single',
        host: 'example.com',
        host2: 'example.com',
        auth: [{ method: 'token', token: 'abc' }],
      }),
    ).toThrow();

    // Optional title field should be accepted.
    expect(
      SingleAuthType.configSchema.parse({
        type: 'single',
        host: 'example.com',
        title: 'My Production Instance',
        auth: [{ method: 'token', token: 'abc' }],
      }),
    ).toMatchObject({ title: 'My Production Instance' });

    // Omitting title should still work.
    expect(
      SingleAuthType.configSchema.parse({
        type: 'single',
        host: 'example.com',
        auth: [{ method: 'token', token: 'abc' }],
      }),
    ).not.toHaveProperty('title');

    // Optional auth method title field should be accepted.
    expect(
      SingleAuthType.configSchema.parse({
        type: 'single',
        host: 'example.com',
        auth: [{ method: 'token', title: 'Production Token', token: 'abc' }],
      }),
    ).toMatchObject({ auth: [{ title: 'Production Token' }] });

    // Auth method title must not be empty when provided.
    expect(() =>
      SingleAuthType.configSchema.parse({
        type: 'single',
        host: 'example.com',
        auth: [{ method: 'token', title: '', token: 'abc' }],
      }),
    ).toThrow();
  });

  it('rejects framework-owned auth method config fields at compile time', () => {
    const reservedAuth = {
      method: 'token',
      title: 'Token',
      configSchema: z.object({
        method: z.string(),
        match: z.object({ plugins: z.array(z.string()) }),
        title: z.string(),
      }),
    } as const;

    createConnectionType({
      type: 'reserved-auth',
      title: 'Reserved Auth',
      configSchema: z.object({ host: z.string() }),
      // @ts-expect-error - auth method config must not declare framework-owned fields
      authMethods: [reservedAuth],
    });
  });

  it('wraps schema validation failures in an InputError', () => {
    const connectionType = createConnectionType({
      type: 'wrapped-error',
      title: 'Wrapped Error',
      configSchema: z.object({ host: z.string() }),
      authMethods: [
        {
          method: 'none',
          title: 'None',
          configSchema: z.object({}),
        },
      ],
    });

    let error: unknown;
    try {
      connectionType.configSchema.parse({
        type: 'wrapped-error',
        auth: [{ method: 'none' }],
      });
    } catch (caughtError) {
      error = caughtError;
    }

    expect(error).toBeInstanceOf(InputError);
    expect(error).toMatchObject({
      message: expect.stringContaining(
        'Invalid configuration for connection type "wrapped-error"',
      ),
      cause: expect.any(z.ZodError),
    });
  });

  it('does not wrap unexpected schema errors', () => {
    const expectedError = new Error('Unexpected schema error');
    const connectionType = createConnectionType({
      type: 'unexpected-error',
      title: 'Unexpected Error',
      configSchema: z.object({
        host: z.string().transform(() => {
          throw expectedError;
        }),
      }),
      authMethods: [
        {
          method: 'none',
          title: 'None',
          configSchema: z.object({}),
        },
      ],
    });

    let error: unknown;
    try {
      connectionType.configSchema.parse({
        type: 'unexpected-error',
        host: 'example.com',
        auth: [{ method: 'none' }],
      });
    } catch (caughtError) {
      error = caughtError;
    }

    expect(error).toBe(expectedError);
  });

  it('builds a multi-auth-method connection type that discriminates on method', () => {
    const MultiAuthType = createConnectionType({
      type: 'multi',
      title: 'Multi',
      configSchema: z.object({ host: z.string() }),
      authMethods: [
        {
          method: 'token',
          title: 'Token',
          configSchema: z.object({ token: z.string() }),
        },
        {
          method: 'app',
          title: 'App',
          configSchema: z.object({
            appId: z.number(),
            privateKey: z.string(),
          }),
        },
      ],
    });

    const tokenAuthMethod = MultiAuthType.authMethods.find(
      authMethod => authMethod.method === 'token',
    );
    expect(tokenAuthMethod?.configSchema.parse({ token: 'abc' }).token).toBe(
      'abc',
    );

    const appAuthMethod = MultiAuthType.authMethods.find(
      authMethod => authMethod.method === 'app',
    );
    expect(
      appAuthMethod?.configSchema.parse({
        appId: 1,
        privateKey: 'pk',
      }).appId,
    ).toBe(1);

    // Both auth methods accepted in the same connection.
    expect(() =>
      MultiAuthType.configSchema.parse({
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
      MultiAuthType.configSchema.parse({
        type: 'multi',
        host: 'example.com',
        auth: [{ method: 'app', token: 'abc' }],
      }),
    ).toThrow();

    // Unknown discriminator should fail.
    expect(() =>
      MultiAuthType.configSchema.parse({
        type: 'multi',
        host: 'example.com',
        auth: [{ method: 'oauth' }],
      }),
    ).toThrow();

    // The connection configuration parser is responsible for rejecting an
    // empty auth array, rather than the connection type schema.
    expect(() =>
      MultiAuthType.configSchema.parse({
        type: 'multi',
        host: 'example.com',
        auth: [],
      }),
    ).not.toThrow();
  });
});
