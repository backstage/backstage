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
import { createConnectionType } from './createConnectionType';

describe('connectionBaseUrlSchema', () => {
  it('preserves roots and context paths when resolving relative paths', () => {
    for (const root of [
      'https://example.com',
      'http://localhost:8080',
      'https://[::1]:8443',
      'https://example.com/context/api',
      'https://example.com/a%2Fb/%23%3F/%E2%9C%93/%00%1F',
      'HTTPS://EXAMPLE.COM:443/Context/%2f',
      'https://example.com/context//api',
    ]) {
      for (const input of [root, `${root}/`]) {
        const parsed = connectionBaseUrlSchema.parse(input);
        expect(parsed).toBe(`${root}/`);
        expect(new URL('items', parsed).href).toBe(
          new URL(`${root}/items`).href,
        );
        expect(connectionBaseUrlSchema.parse(parsed)).toBe(parsed);
      }
    }
  });

  it('rejects invalid base roots, including empty query and fragment delimiters', () => {
    for (const input of [
      '',
      'not a URL',
      '/context',
      '//example.com/context',
      'ftp://example.com/context',
      'https:example.com/context',
      'https:/example.com/context',
      'https:///example.com/context',
      'https://',
      'https://example.com:invalid/context',
      ' https://example.com/context',
      'https://example.com/context ',
      'https://example.com/context\n',
      'https://example.com/con\ntext',
      'https://example.com\u0000',
      'https://example.com/context\u0000',
      'https://example.com/con\u001ftext',
      'https://example.com/con\\text',
      'https://user:password@example.com/context',
      'https://user@example.com/context',
      'https://@example.com/context',
      'https://example.com/context?key=value',
      'https://example.com/context#fragment',
      'https://example.com/context?',
      'https://example.com/context#',
      'https://example.com/?',
      'https://example.com/#',
    ]) {
      expect({
        input,
        success: connectionBaseUrlSchema.safeParse(input).success,
      }).toEqual({ input, success: false });
    }
    expect(connectionBaseUrlSchema.safeParse(undefined).success).toBe(false);
  });

  it('composes with optional fields and provider-specific restrictions', () => {
    const schema = connectionBaseUrlSchema
      .refine(value => new URL(value).protocol === 'https:')
      .refine(value => new URL(value).hostname === 'api.example.com')
      .optional();

    expect(schema.parse(undefined)).toBeUndefined();
    expect(schema.parse('https://api.example.com/context')).toBe(
      'https://api.example.com/context/',
    );
    expect(schema.safeParse('http://api.example.com/context').success).toBe(
      false,
    );
    expect(schema.safeParse('https://other.example.com/context').success).toBe(
      false,
    );
  });

  it('exports input JSON Schema while returning normalised portable-schema output', () => {
    const connectionType = createConnectionType({
      type: 'base-url-test',
      title: 'Base URL test',
      configSchema: z.object({
        baseUrl: connectionBaseUrlSchema,
        optionalBaseUrl: connectionBaseUrlSchema.optional(),
      }),
      authMethods: [
        { method: 'none', title: 'None', configSchema: z.object({}) },
      ],
    });

    const jsonSchema = connectionType.configSchema.schema().schema;
    expect(jsonSchema).toMatchObject({
      type: 'object',
      properties: {
        baseUrl: { type: 'string', format: 'uri', pattern: expect.any(String) },
        optionalBaseUrl: { type: 'string', format: 'uri' },
      },
      required: ['baseUrl'],
      additionalProperties: false,
    });
    const properties = jsonSchema.properties as Record<
      string,
      { pattern: string }
    >;
    const pattern = new RegExp(properties.baseUrl.pattern);
    expect(pattern.test('https://example.com/context')).toBe(true);
    expect(pattern.test('https://example.com/context/')).toBe(true);
    expect(pattern.test('https://example.com/context?')).toBe(false);
    expect(pattern.test('HTTPS://EXAMPLE.COM:443/Context/%2f')).toBe(true);
    expect(pattern.test('https://example.com/context\n')).toBe(false);
    expect(pattern.test('https://example.com\u0000')).toBe(false);
    expect(pattern.test('https://example.com/context\u0000')).toBe(false);
    expect(pattern.test('https://example.com/context%00%1F')).toBe(true);
    const parsed = connectionType.configSchema.parse({
      baseUrl: 'https://example.com/context',
      optionalBaseUrl: 'https://example.com/a%2Fb',
    });
    const baseUrl: string = parsed.baseUrl;
    const optionalBaseUrl: string | undefined = parsed.optionalBaseUrl;
    expect(baseUrl).toBe('https://example.com/context/');
    expect(optionalBaseUrl).toBe('https://example.com/a%2Fb/');
    expect(
      connectionType.configSchema.parse({ baseUrl: 'https://example.com/' }),
    ).toEqual({ baseUrl: 'https://example.com/' });
    expect(() =>
      connectionType.configSchema.parse({ baseUrl: 'https://example.com/?' }),
    ).toThrow(InputError);
  });
});
