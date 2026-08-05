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
        host: { type: 'string' },
      },
      additionalProperties: false,
    });
    expect(SingleAuthType.configSchema.schema().schema.required).toEqual([
      'host',
    ]);
    expect(SingleAuthType.configSchema.parse).toBeInstanceOf(Function);

    const parsed = SingleAuthType.configSchema.parse({
      host: 'example.com',
    });
    expect(parsed.host).toBe('example.com');

    // Missing required config field should fail.
    expect(() => SingleAuthType.configSchema.parse({})).toThrow();

    // Unknown top-level fields should fail (strict mode).
    expect(() =>
      SingleAuthType.configSchema.parse({
        host: 'example.com',
        host2: 'example.com',
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
      connectionType.configSchema.parse({});
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
        host: 'example.com',
      });
    } catch (caughtError) {
      error = caughtError;
    }

    expect(error).toBe(expectedError);
  });

  it('exposes the validate hook for rules that span a whole connection', () => {
    const ValidatedType = createConnectionType({
      type: 'validated',
      title: 'Validated',
      configSchema: z.object({ defaultToken: z.string().optional() }),
      authMethods: [
        {
          method: 'token',
          title: 'Token',
          configSchema: z.object({
            token: z.string(),
            primary: z.boolean().optional(),
          }),
        },
      ],
      validate: ({ config, auth }) => {
        if (auth.filter(a => a.primary).length > 1) {
          throw new InputError('At most one auth entry may be primary');
        }
        if (config.defaultToken && auth.some(a => a.primary)) {
          throw new InputError(
            'defaultToken and a primary auth entry are mutually exclusive',
          );
        }
      },
    });

    expect(() =>
      ValidatedType.validate?.({
        config: {},
        auth: [
          { method: 'token', token: 'a', primary: true },
          { method: 'token', token: 'b' },
        ],
      }),
    ).not.toThrow();
    expect(() =>
      ValidatedType.validate?.({
        config: {},
        auth: [
          { method: 'token', token: 'a', primary: true },
          { method: 'token', token: 'b', primary: true },
        ],
      }),
    ).toThrow('At most one auth entry may be primary');
    expect(() =>
      ValidatedType.validate?.({
        config: { defaultToken: 't' },
        auth: [{ method: 'token', token: 'a', primary: true }],
      }),
    ).toThrow(/mutually exclusive/);
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

    // Config schema only validates user-defined fields.
    expect(() =>
      MultiAuthType.configSchema.parse({ host: 'example.com' }),
    ).not.toThrow();

    // Unknown config fields should fail (strict mode).
    expect(() =>
      MultiAuthType.configSchema.parse({
        host: 'example.com',
        extra: 'field',
      }),
    ).toThrow();
  });
});
