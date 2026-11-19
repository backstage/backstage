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
import type { Connection } from '../api/Connection';
import { InputError } from '@backstage/errors';
import { connectionBaseUrlSchema } from './connectionBaseUrlSchema';
import { withConnectionBaseUrl } from './withConnectionBaseUrl';
import { createConnectionType } from './createConnectionType';

const options = withConnectionBaseUrl(
  z.object({
    baseUrl: connectionBaseUrlSchema,
    apiBaseUrl: connectionBaseUrlSchema.optional(),
    project: z.string().optional(),
  }),
);
const schema = options.configSchema;

describe('withConnectionBaseUrl', () => {
  it('defaults the API root to the instance URL without adding a host field', () => {
    for (const baseUrl of [
      'https://example.com',
      'HTTPS://EXAMPLE.COM:443/context',
      'http://example.com:80/context',
      'http://example.com:443/context',
      'https://example.com:80/context',
      'https://[0:0:0:0:0:0:0:1]:08443/a%2Fb/%00%1F',
    ]) {
      const parsed = schema.parse({ baseUrl, project: 'test' });
      expect(parsed).toEqual({
        baseUrl: `${baseUrl}/`,
        apiBaseUrl: `${baseUrl}/`,
        project: 'test',
      });
      expect(new URL('items', parsed.apiBaseUrl).href).toBe(
        new URL(`${baseUrl}/items`).href,
      );
      expect(JSON.parse(JSON.stringify(parsed))).toEqual(parsed);
      expect(parsed).not.toHaveProperty('host');
      expect(schema.parse({ baseUrl: `${baseUrl}/` })).toEqual({
        baseUrl: `${baseUrl}/`,
        apiBaseUrl: `${baseUrl}/`,
      });
    }
  });

  it('preserves explicit API destinations without changing instance identity', () => {
    const parsed = schema.parse({
      baseUrl: 'https://jira.example.com/site',
      apiBaseUrl: 'https://api.atlassian.com/ex/jira/cloud%2Fid',
    });
    expect(parsed).toEqual({
      baseUrl: 'https://jira.example.com/site/',
      apiBaseUrl: 'https://api.atlassian.com/ex/jira/cloud%2Fid/',
    });
    expect(options.getLookupIdentity(parsed)).toEqual({
      key: 'host',
      value: 'jira.example.com',
    });
    expect(new URL('rest/api/3/issues', parsed.apiBaseUrl).href).toBe(
      'https://api.atlassian.com/ex/jira/cloud%2Fid/rest/api/3/issues',
    );
    expect(
      schema.parse({
        baseUrl: 'https://public.example.com',
        apiBaseUrl: 'http://internal.example.com:8080/context',
      }).apiBaseUrl,
    ).toBe('http://internal.example.com:8080/context/');
  });

  it('rejects missing or invalid instance roots, old host input and invalid API overrides', () => {
    for (const input of [
      {},
      { host: 'example.com' },
      { apiBaseUrl: 'https://api.example.com' },
      { baseUrl: 'https://example.com', host: 'other.example.com' },
      { baseUrl: 'not a URL' },
      { baseUrl: 'https://example.com?' },
      { baseUrl: 'https://example.com/context\u0000' },
      { baseUrl: 'https://example.com', apiBaseUrl: 'ftp://api.example.com' },
      {
        baseUrl: 'https://example.com',
        apiBaseUrl: 'https://api.example.com/#',
      },
    ]) {
      expect({ input, success: schema.safeParse(input).success }).toEqual({
        input,
        success: false,
      });
    }
    const optionalBase = z.object({
      baseUrl: connectionBaseUrlSchema.optional(),
      apiBaseUrl: connectionBaseUrlSchema.optional(),
    });
    // @ts-expect-error - an instance URL must be required input
    withConnectionBaseUrl(optionalBase);
    const oldHost = z.object({
      host: z.string(),
      baseUrl: connectionBaseUrlSchema,
      apiBaseUrl: connectionBaseUrlSchema.optional(),
    });
    // @ts-expect-error - host is internal identity, never configured/public data
    withConnectionBaseUrl(oldHost);
    const defaultedApi = z.object({
      baseUrl: connectionBaseUrlSchema,
      apiBaseUrl: connectionBaseUrlSchema
        .optional()
        .default('https://api.example.com/'),
    });
    // @ts-expect-error - a schema default must not replace the instance fallback
    withConnectionBaseUrl(defaultedApi);
    const requiredApi = z.object({
      baseUrl: connectionBaseUrlSchema,
      apiBaseUrl: connectionBaseUrlSchema,
    });
    // @ts-expect-error - the API root remains optional for every opted-in type
    withConnectionBaseUrl(requiredApi);
  });

  it('runs provider checks and transforms once for supplied values and the fallback', () => {
    const baseTransform = jest.fn((url: string) => url);
    const apiTransform = jest.fn((url: string) => url);
    const provider = withConnectionBaseUrl(
      z.object({
        baseUrl: connectionBaseUrlSchema
          .refine(url => new URL(url).protocol === 'https:')
          .transform(baseTransform),
        apiBaseUrl: connectionBaseUrlSchema.transform(apiTransform).optional(),
        project: z.string().default('test'),
      }),
    );
    expect(
      provider.configSchema.parse({ baseUrl: 'https://example.com/context' }),
    ).toEqual({
      baseUrl: 'https://example.com/context/',
      apiBaseUrl: 'https://example.com/context/',
      project: 'test',
    });
    expect(baseTransform).toHaveBeenCalledTimes(1);
    expect(apiTransform).toHaveBeenCalledTimes(1);
    expect(apiTransform.mock.calls[0][0]).toBe('https://example.com/context/');
    baseTransform.mockClear();
    apiTransform.mockClear();
    expect(
      provider.configSchema.parse({
        baseUrl: 'https://example.com/context',
        apiBaseUrl: 'https://internal.example.com/api',
      }).apiBaseUrl,
    ).toBe('https://internal.example.com/api/');
    expect(baseTransform).toHaveBeenCalledTimes(1);
    expect(apiTransform).toHaveBeenCalledTimes(1);
    expect(apiTransform.mock.calls[0][0]).toBe(
      'https://internal.example.com/api/',
    );
    expect(
      provider.configSchema.safeParse({ baseUrl: 'http://example.com' })
        .success,
    ).toBe(false);
    const apiCheck = jest.fn(
      (url: string) => new URL(url).protocol === 'https:',
    );
    const restricted = withConnectionBaseUrl(
      z.object({
        baseUrl: connectionBaseUrlSchema,
        apiBaseUrl: connectionBaseUrlSchema.refine(apiCheck).optional(),
      }),
    );
    expect(
      restricted.configSchema.safeParse({ baseUrl: 'http://example.com' })
        .success,
    ).toBe(false);
    expect(apiCheck).toHaveBeenCalledTimes(1);
    const optionalCheck = jest.fn(
      (url: string | undefined) =>
        url !== undefined && new URL(url).protocol === 'https:',
    );
    const rootCheck = jest.fn((config: { apiBaseUrl?: string }) =>
      config.apiBaseUrl?.endsWith('/'),
    );
    const outerRefinement = withConnectionBaseUrl(
      z
        .object({
          baseUrl: connectionBaseUrlSchema.transform(baseTransform),
          apiBaseUrl: connectionBaseUrlSchema
            .transform(apiTransform)
            .optional()
            .refine(optionalCheck),
        })
        .refine(rootCheck),
    );
    for (const apiInput of [
      {},
      { apiBaseUrl: undefined },
      { apiBaseUrl: 'https://internal.example.com/api' },
    ]) {
      baseTransform.mockClear();
      apiTransform.mockClear();
      optionalCheck.mockClear();
      rootCheck.mockClear();
      const expectedApi = apiInput.apiBaseUrl
        ? 'https://internal.example.com/api/'
        : 'https://example.com/';
      expect(
        outerRefinement.configSchema.parse({
          baseUrl: 'https://example.com',
          ...apiInput,
        }),
      ).toEqual({
        baseUrl: 'https://example.com/',
        apiBaseUrl: expectedApi,
      });
      expect(baseTransform).toHaveBeenCalledTimes(1);
      expect(apiTransform).toHaveBeenCalledTimes(1);
      expect(optionalCheck.mock.calls).toEqual([[expectedApi]]);
      expect(rootCheck).toHaveBeenCalledTimes(1);
      expect(rootCheck.mock.calls[0][0]).toEqual({
        baseUrl: 'https://example.com/',
        apiBaseUrl: expectedApi,
      });
    }
    optionalCheck.mockClear();
    expect(
      outerRefinement.configSchema.safeParse({
        baseUrl: 'https://example.com',
        apiBaseUrl: 'http://internal.example.com',
      }).success,
    ).toBe(false);
    expect(optionalCheck.mock.calls).toEqual([
      ['http://internal.example.com/'],
    ]);
    expect(
      outerRefinement.configSchema.safeParse({
        baseUrl: 'https://example.com',
        apiBaseUrl: 123,
      }).success,
    ).toBe(false);
    const rootRejected = withConnectionBaseUrl(
      z
        .object({
          baseUrl: connectionBaseUrlSchema,
          apiBaseUrl: connectionBaseUrlSchema.optional(),
        })
        .refine(() => false, 'Rejected by provider root check'),
    );
    expect(
      rootRejected.configSchema.safeParse({
        baseUrl: 'https://example.com',
      }).error?.issues,
    ).toEqual([
      expect.objectContaining({ message: 'Rejected by provider root check' }),
    ]);
  });

  it('rejects transforms that replace the fallback instead of inventing provider API defaults', () => {
    const transform = jest.fn((url: string) => `${url}api/`);
    const changing = withConnectionBaseUrl(
      z.object({
        baseUrl: connectionBaseUrlSchema,
        apiBaseUrl: connectionBaseUrlSchema.transform(transform).optional(),
      }),
    );
    const result = changing.configSchema.safeParse({
      baseUrl: 'https://example.com/context',
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues).toEqual([
      expect.objectContaining({
        path: ['apiBaseUrl'],
        message: expect.stringContaining('configure apiBaseUrl explicitly'),
      }),
    ]);
    expect(transform).toHaveBeenCalledTimes(1);
    transform.mockClear();
    expect(
      changing.configSchema.parse({
        baseUrl: 'https://example.com/context',
        apiBaseUrl: 'https://api.example.com/',
      }).apiBaseUrl,
    ).toBe('https://api.example.com/api/');
    expect(transform).toHaveBeenCalledTimes(1);
  });

  it('preserves provider input constraints while deferring API validation', () => {
    const providerSchema = z.object({
      baseUrl: connectionBaseUrlSchema,
      apiBaseUrl: z
        .string()
        .min(12)
        .regex(/^https:\/\//)
        .optional()
        .refine(value => value !== undefined),
    });
    const provider = createConnectionType({
      ...withConnectionBaseUrl(providerSchema),
      type: 'constrained-instance',
      title: 'Instance',
      authMethods: [
        { method: 'none', title: 'None', configSchema: z.object({}) },
      ],
    });
    expect(provider.configSchema.schema().schema).toEqual(
      providerSchema.strict().toJSONSchema({ target: 'draft-07', io: 'input' }),
    );
    expect(
      provider.configSchema.parse({ baseUrl: 'https://example.com' }),
    ).toEqual({
      baseUrl: 'https://example.com/',
      apiBaseUrl: 'https://example.com/',
    });
    expect(() =>
      provider.configSchema.parse({
        baseUrl: 'https://example.com',
        apiBaseUrl: 'http://example.com',
      }),
    ).toThrow(InputError);
    expect(() =>
      provider.configSchema.parse({
        baseUrl: 'https://example.com',
        apiBaseUrl: 'https://example.com',
        extra: true,
      }),
    ).toThrow(InputError);
  });

  it('keeps host out of typed/public data and exports strict portable input schema', () => {
    const definition = createConnectionType({
      ...options,
      type: 'instance-test',
      title: 'Instance',
      authMethods: [
        {
          method: 'token',
          title: 'Token',
          configSchema: z.object({ token: z.string() }),
        },
      ],
    });
    const input: z.input<typeof schema> = {
      baseUrl: 'https://example.com/context',
    };
    const parsed = definition.configSchema.parse(input);
    const baseUrl: string = parsed.baseUrl;
    const apiBaseUrl: string = parsed.apiBaseUrl;
    expect({ baseUrl, apiBaseUrl }).toEqual({
      baseUrl: 'https://example.com/context/',
      apiBaseUrl: 'https://example.com/context/',
    });
    const connection: Connection<typeof definition, 'token'> = {
      ...parsed,
      type: 'instance-test',
      title: 'Instance',
      auth: { method: 'token', title: 'Token', token: 'secret' },
    };
    const info: Omit<Connection<typeof definition>, 'auth'> = {
      ...parsed,
      type: 'instance-test',
      title: 'Instance',
    };
    // @ts-expect-error - public authenticated connections have no host field
    expect(connection.host).toBeUndefined();
    // @ts-expect-error - public credential-free connections have no host field
    expect(info.host).toBeUndefined();
    expect(JSON.parse(JSON.stringify(connection))).not.toHaveProperty('host');
    expect(JSON.parse(JSON.stringify(info))).not.toHaveProperty('host');
    expect(() =>
      definition.configSchema.parse({
        baseUrl: 'https://example.com',
        host: 'example.com',
      }),
    ).toThrow(InputError);
    expect(() =>
      definition.configSchema.parse({
        baseUrl: 'https://example.com',
        extra: true,
      }),
    ).toThrow(InputError);
    expect(definition.configSchema.schema().schema).toMatchObject({
      type: 'object',
      required: ['baseUrl'],
      additionalProperties: false,
      properties: {
        baseUrl: { type: 'string', format: 'uri' },
        apiBaseUrl: { type: 'string', format: 'uri' },
      },
    });
    expect(
      definition.configSchema.schema().schema.properties,
    ).not.toHaveProperty('host');
    // @ts-expect-error - host-only input is obsolete
    const hostOnly: z.input<typeof schema> = { host: 'example.com' };
    expect(schema.safeParse(hostOnly).success).toBe(false);
  });
});
