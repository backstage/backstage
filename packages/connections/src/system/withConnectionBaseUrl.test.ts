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
    host: z.string(),
    baseUrl: connectionBaseUrlSchema.optional(),
    project: z.string().optional(),
  }),
);

describe('withConnectionBaseUrl', () => {
  it('defaults only the base URL and preserves explicit destinations and context paths', () => {
    for (const host of ['example.com', 'example.com:8443', '[::1]:8443']) {
      expect(schema.parse({ host })).toEqual({
        host,
        baseUrl: `https://${host}/`,
      });
    }
    for (const baseUrl of [
      'http://internal.example.com:8080/context%2Fapi',
      'https://[::1]:8443/a%2Fb/%00%1F',
      'HTTPS://INTERNAL.EXAMPLE.COM:443/context',
    ]) {
      const parsed = schema.parse({
        host: 'public.example.com',
        baseUrl,
        project: 'test',
      });
      expect(parsed).toEqual({
        host: 'public.example.com',
        baseUrl: `${baseUrl}/`,
        project: 'test',
      });
      expect(new URL('items', parsed.baseUrl).href).toBe(
        new URL(`${baseUrl}/items`).href,
      );
      expect(
        schema.parse({ host: 'public.example.com', baseUrl: `${baseUrl}/` })
          .baseUrl,
      ).toBe(`${baseUrl}/`);
    }
  });

  it('canonicalises lookup hosts independently of default or explicit endpoint schemes', () => {
    for (const [host, queryUrl, expectedHost] of [
      ['EXAMPLE.COM', 'https://example.com/items', 'example.com'],
      ['[0:0:0:0:0:0:0:1]:08443', 'https://[::1]:8443/items', '[::1]:8443'],
      [
        'PUBLIC.EXAMPLE.COM:00443',
        'http://public.example.com:443/items',
        'public.example.com:443',
      ],
      [
        'PUBLIC.EXAMPLE.COM:00080',
        'https://public.example.com:80/items',
        'public.example.com:80',
      ],
    ]) {
      for (const baseUrl of [
        undefined,
        'https://internal.example.com/context',
        'http://internal.example.com/context',
      ]) {
        const parsed = schema.parse({ host, baseUrl });
        expect(parsed.host).toBe(expectedHost);
        expect(parsed.host).toBe(new URL(queryUrl).host);
      }
    }
    const explicit = schema.parse({ host: 'PUBLIC.EXAMPLE.COM:443' });
    expect(explicit.host).toBe('public.example.com:443');
    expect(explicit.host).not.toBe(
      new URL('https://public.example.com:443/items').host,
    );
    expect(explicit.baseUrl).toBe('https://PUBLIC.EXAMPLE.COM:443/');
  });

  it('rejects URL-only inputs and malformed hosts or base URLs', () => {
    for (const input of [
      {},
      { baseUrl: 'https://example.com/context' },
      { host: '' },
      { host: 'example.com/context' },
      { host: 'user@example.com' },
      { host: 'example.com?' },
      { host: 'example.com#' },
      { host: 'example.com\u0000' },
      { host: 'https://example.com' },
      { host: 'example.com:invalid' },
      { host: 'example.com', baseUrl: 'not a URL' },
      { host: 'example.com', baseUrl: 'https://example.com/?' },
      { host: 'example.com', baseUrl: 'https://example.com/context\u0000' },
    ]) {
      expect({ input, success: schema.safeParse(input).success }).toEqual({
        input,
        success: false,
      });
    }
    withConnectionBaseUrl(
      // @ts-expect-error - the lookup identity must be required, not derived
      z.object({
        host: z.string().optional(),
        baseUrl: connectionBaseUrlSchema.optional(),
      }),
    );
    withConnectionBaseUrl(
      // @ts-expect-error - a host default must not make URL-only input valid
      z.object({
        host: z.string().default('example.com'),
        baseUrl: connectionBaseUrlSchema.optional(),
      }),
    );
  });

  it('retains provider field transforms and defaults exactly once', () => {
    const transformed = withConnectionBaseUrl(
      z.object({
        host: z.string().transform(host => `lookup.${host}`),
        baseUrl: connectionBaseUrlSchema
          .transform(url => `${url}api/`)
          .optional(),
        project: z.string().default('example'),
      }),
    );
    expect(transformed.parse({ host: 'example.com' })).toEqual({
      host: 'lookup.example.com',
      baseUrl: 'https://lookup.example.com/api/',
      project: 'example',
    });
    expect(
      transformed.parse({
        host: 'example.com',
        baseUrl: 'https://internal.example.com/context',
      }),
    ).toEqual({
      host: 'lookup.example.com',
      baseUrl: 'https://internal.example.com/context/api/',
      project: 'example',
    });
    const defaulted = withConnectionBaseUrl(
      z.object({
        host: z.string(),
        baseUrl: connectionBaseUrlSchema.default(
          'https://internal.example.com/context/',
        ),
      }),
    );
    expect(defaulted.parse({ host: 'example.com' })).toEqual({
      host: 'example.com',
      baseUrl: 'https://internal.example.com/context/',
    });
    expect(
      defaulted.safeParse({ baseUrl: 'https://internal.example.com/' }).success,
    ).toBe(false);
    const invalidOutput = withConnectionBaseUrl(
      z.object({
        host: z.string().transform(() => 'example.com/path'),
        baseUrl: connectionBaseUrlSchema.optional(),
      }),
    );
    expect(invalidOutput.safeParse({ host: 'example.com' }).success).toBe(
      false,
    );
  });

  it('validates the default and retains strictness, refinements and typed portable output', () => {
    const restricted = withConnectionBaseUrl(
      z.object({
        host: z.string().refine(host => host === 'example.com'),
        baseUrl: connectionBaseUrlSchema
          .refine(url => new URL(url).hostname === 'api.example.com')
          .optional(),
      }),
    );
    expect(
      restricted.safeParse({
        host: 'other.example.com',
        baseUrl: 'https://api.example.com/',
      }).success,
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
      host: 'example.com',
      baseUrl: 'https://internal.example.com/context',
      project: 'test',
    });
    const host: string = parsed.host;
    const baseUrl: string = parsed.baseUrl;
    const project: string | undefined = parsed.project;
    expect({ host, baseUrl, project }).toEqual({
      host: 'example.com',
      baseUrl: 'https://internal.example.com/context/',
      project: 'test',
    });
    const hostOnlyInput: z.input<typeof schema> = { host: 'example.com' };
    expect(connectionType.configSchema.parse(hostOnlyInput)).toEqual({
      host: 'example.com',
      baseUrl: 'https://example.com/',
    });
    // @ts-expect-error - the helper's input requires the explicit lookup host
    const urlOnlyInput: z.input<typeof schema> = {
      baseUrl: 'https://example.com/',
    };
    expect(() => connectionType.configSchema.parse(urlOnlyInput)).toThrow(
      InputError,
    );
    expect(() =>
      connectionType.configSchema.parse({ host: 'example.com', extra: true }),
    ).toThrow(InputError);
    expect(() =>
      connectionType.configSchema.parse({
        host: 'example.com',
        baseUrl: 'http://internal.example.com/context',
      }),
    ).toThrow(InputError);
    expect(connectionType.configSchema.schema().schema).toMatchObject({
      type: 'object',
      additionalProperties: false,
      required: ['host'],
      properties: {
        host: { type: 'string' },
        baseUrl: { type: 'string', format: 'uri' },
        project: { type: 'string' },
      },
    });
  });
});
