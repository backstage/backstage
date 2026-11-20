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
import { ConfigReader } from '@backstage/config';
import type { JsonObject } from '@backstage/types';
import { buildConnectionsFromConfig } from '../config/buildConnectionsFromConfig';
import { connectionTypes } from '../definitions/types';
import { DatadogConnectionType } from './datadog';

const fixture = {
  type: 'datadog',
  baseUrl: 'https://api.datadoghq.com/',
  auth: [
    {
      method: 'apiKey',
      apiKey: 'dummy-api-key',
      applicationKey: 'dummy-application-key',
    },
  ],
};
function parse(overrides: JsonObject = {}) {
  return buildConnectionsFromConfig({
    config: new ConfigReader({
      connections: [{ ...fixture, ...overrides }],
    }),
  });
}

describe('DatadogConnectionType', () => {
  it('registers portable schemas and derives identity without returning host', () => {
    expect(connectionTypes.datadog).toBe(DatadogConnectionType);
    expect(DatadogConnectionType.cardinality).toBe('multiton');
    expect(parse()[0]).toMatchObject({
      type: 'datadog',
      baseUrl: 'https://api.datadoghq.com/',
    });
    const withoutApi = DatadogConnectionType.configSchema.parse({
      ...fixtureConfig(),
      apiBaseUrl: undefined,
    });
    expect(withoutApi.apiBaseUrl).toBeUndefined();
    expect(parse()[0]).not.toHaveProperty('host');
    const config = DatadogConnectionType.configSchema.parse(fixtureConfig());
    expect(DatadogConnectionType.getLookupIdentity(config)).toEqual({
      key: 'host',
      value: new URL(fixture.baseUrl).host,
    });
    const json = DatadogConnectionType.configSchema.schema().schema;
    expect(json).toMatchObject({
      type: 'object',
      additionalProperties: false,
      properties: {
        baseUrl: { type: 'string', format: 'uri' },
        apiBaseUrl: { type: 'string', format: 'uri' },
      },
    });
    expect(json.required).toEqual(expect.arrayContaining(['baseUrl']));
    expect(json.required).toHaveLength(1);
    expect(json.properties).not.toHaveProperty('host');
    for (const method of DatadogConnectionType.authMethods) {
      expect(method.configSchema.schema().schema).toMatchObject({
        type: 'object',
      });
    }
  });

  it('normalizes both slash forms and encoded paths for direct relative URL joining', () => {
    for (const input of [
      fixture.baseUrl.slice(0, -1),
      fixture.baseUrl,
      `${fixture.baseUrl}context%2Fname%3F%23`,
      `${fixture.baseUrl}context%2Fname%3F%23/`,
    ]) {
      const expected = input.endsWith('/') ? input : `${input}/`;
      const parsed = DatadogConnectionType.configSchema.parse({
        ...fixtureConfig(),
        baseUrl: input,
      });
      expect(parsed.baseUrl).toBe(expected);
      expect(new URL('resource', parsed.baseUrl).href).toBe(
        `${expected}resource`,
      );
    }
    for (const apiBaseUrl of [
      'https://internal.example.com:8443/context%2Fname%3F%23/api',
      'https://internal.example.com:8443/context%2Fname%3F%23/api/',
    ]) {
      const parsed = DatadogConnectionType.configSchema.parse({
        ...fixtureConfig(),
        apiBaseUrl,
      });
      expect(parsed.apiBaseUrl).toBe(
        'https://internal.example.com:8443/context%2Fname%3F%23/api/',
      );
      expect(new URL('resource', parsed.apiBaseUrl).href).toBe(
        'https://internal.example.com:8443/context%2Fname%3F%23/api/resource',
      );
      expect(parsed.baseUrl).toBe(fixture.baseUrl);
    }
  });

  it('rejects malformed roots, obsolete host fields and duplicate instance hosts', () => {
    for (const baseUrl of [
      undefined,
      '',
      '/relative',
      'not-a-url',
      'ftp://example.com',
      'https://user:secret@example.com',
      'https://@example.com',
      'https://example.com?',
      'https://example.com#',
      'https://example.com/path\u0000',
    ]) {
      expect(() => parse({ baseUrl })).toThrow();
    }
    for (const apiBaseUrl of [
      'https://example.com?',
      'https://example.com#',
      'https://user:secret@example.com',
    ]) {
      expect(() => parse({ apiBaseUrl })).toThrow();
    }
    expect(() => parse({ host: new URL(fixture.baseUrl).host })).toThrow(
      /host/,
    );
    expect(() => parse({ unknown: true })).toThrow();
    expect(() =>
      buildConnectionsFromConfig({
        config: new ConfigReader({
          connections: [
            fixture,
            { ...fixture, baseUrl: `${fixture.baseUrl}other` },
          ],
        }),
      }),
    ).toThrow(/Duplicate connection/);
  });

  it('requires supported, complete provider credentials', () => {
    const invalid: JsonObject[][] = [
      [],
      [{ method: 'none' }],
      [{ method: 'token', token: 'dummy' }],
      [{ method: 'apiKey', apiKey: null, applicationKey: 'dummy' }],
      [{ method: 'apiKey', apiKey: '', applicationKey: 'dummy' }],
      [{ method: 'apiKey', apiKey: '   ', applicationKey: 'dummy' }],
      [
        {
          method: 'apiKey',
          apiKey: 'key with spaces',
          applicationKey: 'dummy',
        },
      ],
      [{ method: 'apiKey', apiKey: 123, applicationKey: 'dummy' }],
      [{ method: 'apiKey', apiKey: 'dummy', applicationKey: null }],
      [{ method: 'apiKey', apiKey: 'dummy', applicationKey: '' }],
      [{ method: 'apiKey', apiKey: 'dummy', applicationKey: '   ' }],
      [
        {
          method: 'apiKey',
          apiKey: 'dummy',
          applicationKey: 'key with spaces',
        },
      ],
      [{ method: 'apiKey', apiKey: 'dummy', applicationKey: 123 }],
    ];
    for (const auth of invalid) {
      expect(() => parse({ auth })).toThrow();
    }
  });
  it('retains HTTPS-only provider destinations', () => {
    expect(() =>
      DatadogConnectionType.configSchema.parse({
        ...fixtureConfig(),
        baseUrl: 'http://example.com/',
      }),
    ).toThrow(/HTTPS/);
    expect(() => parse({ baseUrl: 'http://example.com/' })).toThrow(/HTTPS/);
    expect(() =>
      parse({ apiBaseUrl: 'http://internal.example.com/api/' }),
    ).toThrow(/HTTPS/);
    expect(() => parse({ baseUrl: 'https://api..example.com/' })).toThrow(
      /hostname/,
    );
  });
});

function fixtureConfig() {
  const { type: _type, auth: _auth, ...config } = fixture;
  return config;
}
