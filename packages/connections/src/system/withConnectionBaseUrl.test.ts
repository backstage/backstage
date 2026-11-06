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
import { connectionBaseUrlSchema } from './connectionBaseUrlSchema';
import { withConnectionBaseUrl } from './withConnectionBaseUrl';
import { createConnectionType } from './createConnectionType';

const schema = withConnectionBaseUrl(
  z.object({
    host: z.string().optional(),
    baseUrl: connectionBaseUrlSchema.optional(),
    project: z.string().optional(),
  }),
);

describe('withConnectionBaseUrl', () => {
  it('derives missing fields and preserves explicit lookup hosts and endpoints', () => {
    for (const host of ['example.com', 'example.com:8443', '[::1]:8443']) {
      expect(schema.parse({ host })).toEqual({
        host,
        baseUrl: `https://${host}/`,
      });
    }
    for (const [baseUrl, host] of [
      ['https://example.com/context', 'example.com'],
      ['http://localhost:8080/context', 'localhost:8080'],
      ['https://[::1]:8443/a%2Fb', '[::1]:8443'],
      ['HTTPS://EXAMPLE.COM:443/context', 'example.com'],
    ]) {
      expect(schema.parse({ baseUrl })).toEqual({
        host,
        baseUrl: `${baseUrl}/`,
      });
    }
    expect(
      schema.parse({
        host: 'public.example.com',
        baseUrl: 'http://internal.example.com:8080/context%2Fapi',
        project: 'example',
      }),
    ).toEqual({
      host: 'public.example.com',
      baseUrl: 'http://internal.example.com:8080/context%2Fapi/',
      project: 'example',
    });
  });

  it('matches canonical resource URL host identities without using an override endpoint scheme', () => {
    for (const [input, queryUrl, expectedHost] of [
      [{ host: 'EXAMPLE.COM' }, 'https://example.com/items', 'example.com'],
      [
        { host: '[0:0:0:0:0:0:0:1]:08443' },
        'https://[::1]:8443/items',
        '[::1]:8443',
      ],
      [
        { host: 'EXAMPLE.COM:443' },
        'https://example.com:443/items',
        'example.com',
      ],
      [
        { host: 'EXAMPLE.COM:80' },
        'https://example.com:80/items',
        'example.com:80',
      ],
      [
        { baseUrl: 'http://example.com:80/context' },
        'http://example.com:80/items',
        'example.com',
      ],
      [
        { baseUrl: 'http://example.com:443/context' },
        'http://example.com:443/items',
        'example.com:443',
      ],
      [
        {
          host: 'PUBLIC.EXAMPLE.COM:00443',
          baseUrl: 'https://internal.example.com/context',
        },
        'http://public.example.com:443/items',
        'public.example.com:443',
      ],
      [
        {
          host: 'PUBLIC.EXAMPLE.COM:00080',
          baseUrl: 'http://internal.example.com/context',
        },
        'https://public.example.com:80/items',
        'public.example.com:80',
      ],
    ] as const) {
      const parsed = schema.parse(input);
      expect(parsed.host).toBe(expectedHost);
      expect(parsed.host).toBe(new URL(queryUrl).host);
      const expectedBaseUrl =
        'baseUrl' in input ? `${input.baseUrl}/` : `https://${input.host}/`;
      expect(parsed.baseUrl).toBe(expectedBaseUrl);
    }
    const explicit = schema.parse({
      host: 'PUBLIC.EXAMPLE.COM:443',
      baseUrl: 'https://internal.example.com/context',
    });
    expect(explicit.host).not.toBe(
      new URL('https://public.example.com:443/items').host,
    );
    expect(explicit.baseUrl).toBe('https://internal.example.com/context/');
  });

  it('rejects missing endpoints and malformed hosts or base URLs without throwing from safeParse', () => {
    for (const input of [
      {},
      { host: '' },
      { host: 'example.com/context' },
      { host: 'user@example.com' },
      { host: 'example.com?' },
      { host: 'example.com#' },
      { host: 'example.com\u0000' },
      { host: 'https://example.com' },
      { host: 'example.com:invalid' },
      { baseUrl: 'not a URL' },
      { baseUrl: 'https://example.com/?' },
      { baseUrl: 'https://example.com/context\u0000' },
    ]) {
      expect({ input, success: schema.safeParse(input).success }).toEqual({
        input,
        success: false,
      });
    }
  });

  it('uses field defaults and transformed derived values without reparsing explicit values', () => {
    const transformed = withConnectionBaseUrl(
      z.object({
        host: z
          .string()
          .transform(host => `lookup.${host}`)
          .optional(),
        baseUrl: connectionBaseUrlSchema
          .transform(url => `${url}api/`)
          .optional(),
      }),
    );
    expect(transformed.parse({ host: 'example.com' })).toEqual({
      host: 'lookup.example.com',
      baseUrl: 'https://lookup.example.com/api/',
    });
    expect(
      transformed.parse({ baseUrl: 'https://example.com/context' }),
    ).toEqual({
      host: 'lookup.example.com',
      baseUrl: 'https://example.com/context/api/',
    });
    const defaulted = withConnectionBaseUrl(
      z.object({
        host: z.string().default('example.com'),
        baseUrl: connectionBaseUrlSchema.optional(),
      }),
    );
    expect(defaulted.parse({})).toEqual({
      host: 'example.com',
      baseUrl: 'https://example.com/',
    });
    const defaultedUrl = withConnectionBaseUrl(
      z.object({
        host: z.string().optional(),
        baseUrl: connectionBaseUrlSchema.default(
          'https://example.com/context/',
        ),
      }),
    );
    expect(defaultedUrl.parse({})).toEqual({
      host: 'example.com',
      baseUrl: 'https://example.com/context/',
    });
    const invalidOutput = withConnectionBaseUrl(
      z.object({
        host: z
          .string()
          .transform(() => 'example.com/path')
          .optional(),
        baseUrl: connectionBaseUrlSchema.optional(),
      }),
    );
    expect(
      invalidOutput.safeParse({ baseUrl: 'https://example.com' }).success,
    ).toBe(false);
  });

  it('validates derived fields and keeps provider refinements on the portable schema', () => {
    const restricted = withConnectionBaseUrl(
      z.object({
        host: z
          .string()
          .refine(host => host === 'example.com')
          .optional(),
        baseUrl: connectionBaseUrlSchema
          .refine(url => new URL(url).hostname === 'api.example.com')
          .optional(),
      }),
    );
    expect(
      restricted.safeParse({ baseUrl: 'https://other.example.com/' }).success,
    ).toBe(false);
    expect(restricted.safeParse({ host: 'example.com' }).success).toBe(false);
    expect(
      restricted.parse({
        host: 'example.com',
        baseUrl: 'https://api.example.com/context',
      }),
    ).toEqual({
      host: 'example.com',
      baseUrl: 'https://api.example.com/context/',
    });

    const connectionType = createConnectionType({
      type: 'host-and-base-url-test',
      title: 'Host and base URL test',
      configSchema: schema.refine(
        config => new URL(config.baseUrl).protocol === 'https:',
      ),
      authMethods: [
        { method: 'none', title: 'None', configSchema: z.object({}) },
      ],
    });
    const parsed = connectionType.configSchema.parse({
      baseUrl: 'https://example.com/context',
      project: 'test',
    });
    const host: string = parsed.host;
    const baseUrl: string = parsed.baseUrl;
    const project: string | undefined = parsed.project;
    expect({ host, baseUrl, project }).toEqual({
      host: 'example.com',
      baseUrl: 'https://example.com/context/',
      project: 'test',
    });
    expect(new URL('items', baseUrl).href).toBe(
      'https://example.com/context/items',
    );
    expect(() =>
      connectionType.configSchema.parse({ host: 'example.com', extra: true }),
    ).toThrow(InputError);
    expect(() =>
      connectionType.configSchema.parse({
        baseUrl: 'http://example.com/context',
      }),
    ).toThrow(InputError);
    expect(connectionType.configSchema.schema().schema).toMatchObject({
      type: 'object',
      additionalProperties: false,
      properties: {
        host: { type: 'string' },
        baseUrl: { type: 'string', format: 'uri' },
        project: { type: 'string' },
      },
    });
    expect(connectionType.configSchema.schema().schema.required ?? []).toEqual(
      [],
    );
  });
});
