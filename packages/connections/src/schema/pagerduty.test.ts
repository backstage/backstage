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
import { PagerDutyConnectionType } from './pagerduty';

const fixture = {
  type: 'pagerduty',
  baseUrl: 'https://example.pagerduty.com/',
  apiBaseUrl: 'https://api.pagerduty.com/',
  auth: [{ method: 'token', token: 'dummy-rest-token' }],
};
function parse(overrides: JsonObject = {}) {
  return buildConnectionsFromConfig({
    config: new ConfigReader({
      connections: [{ ...fixture, ...overrides }],
    }),
  });
}

describe('PagerDutyConnectionType', () => {
  it('registers portable schemas and derives identity without returning host', () => {
    expect(connectionTypes.pagerduty).toBe(PagerDutyConnectionType);
    expect(PagerDutyConnectionType.cardinality).toBe('multiton');
    expect(parse()[0]).toMatchObject({
      type: 'pagerduty',
      baseUrl: 'https://example.pagerduty.com/',
      apiBaseUrl: 'https://api.pagerduty.com/',
    });
    expect(parse()[0]).not.toHaveProperty('host');
    const config = PagerDutyConnectionType.configSchema.parse(fixtureConfig());
    expect(PagerDutyConnectionType.getLookupIdentity(config)).toEqual({
      key: 'host',
      value: new URL(fixture.baseUrl).host,
    });
    const json = PagerDutyConnectionType.configSchema.schema().schema;
    expect(json).toMatchObject({
      type: 'object',
      additionalProperties: false,
      properties: {
        baseUrl: { type: 'string', format: 'uri' },
        apiBaseUrl: { type: 'string', format: 'uri' },
      },
    });
    expect(json.required).toEqual(
      expect.arrayContaining(['baseUrl', 'apiBaseUrl']),
    );
    expect(json.required).toHaveLength(2);
    expect(json.properties).not.toHaveProperty('host');
    for (const method of PagerDutyConnectionType.authMethods) {
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
      const parsed = PagerDutyConnectionType.configSchema.parse({
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
      const parsed = PagerDutyConnectionType.configSchema.parse({
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
      [{ method: 'routingKey' }],
      [{ method: 'oauth' }],
      [{ method: 'clientCredentials' }],
      [{ method: 'token', routingKey: 'dummy-events-key' }],
      [{ method: 'token', token: '' }],
      [{ method: 'token', token: ' ' }],
      [{ method: 'token', token: 'Token token=dummy' }],
      [{ method: 'token', token: 'token\nvalue' }],
    ];
    for (const auth of invalid) {
      expect(() => parse({ auth })).toThrow();
    }
  });
  it('retains HTTPS-only provider destinations', () => {
    expect(() =>
      PagerDutyConnectionType.configSchema.parse({
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
  it('requires the region to be configured independently of account identity', () => {
    expect(() => parse({ apiBaseUrl: undefined })).toThrow(/apiBaseUrl/);
  });
});

function fixtureConfig() {
  const { type: _type, auth: _auth, ...config } = fixture;
  return config;
}
