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
import { JiraConnectionType } from './jira';

const fixture = {
  type: 'jira',
  baseUrl: 'https://example.atlassian.net/',
  deployment: 'cloud',
  apiBaseUrl:
    'https://api.atlassian.com/ex/jira/00000000-0000-4000-8000-000000000000/',
  auth: [
    { method: 'apiToken', email: 'reader@example.com', token: 'dummy-token' },
  ],
};
function parse(overrides: JsonObject = {}) {
  return buildConnectionsFromConfig({
    config: new ConfigReader({
      connections: [{ ...fixture, ...overrides }],
    }),
  });
}

describe('JiraConnectionType', () => {
  it('registers portable schemas and derives identity without returning host', () => {
    expect(connectionTypes.jira).toBe(JiraConnectionType);
    expect(JiraConnectionType.cardinality).toBe('multiton');
    expect(parse()[0]).toMatchObject({
      type: 'jira',
      baseUrl: 'https://example.atlassian.net/',
      deployment: 'cloud',
      apiBaseUrl:
        'https://api.atlassian.com/ex/jira/00000000-0000-4000-8000-000000000000/',
    });
    const withoutApi = JiraConnectionType.configSchema.parse({
      ...fixtureConfig(),
      apiBaseUrl: undefined,
    });
    expect(withoutApi.apiBaseUrl).toBeUndefined();
    expect(parse()[0]).not.toHaveProperty('host');
    const config = JiraConnectionType.configSchema.parse(fixtureConfig());
    expect(JiraConnectionType.getLookupIdentity(config)).toEqual({
      key: 'host',
      value: new URL(fixture.baseUrl).host,
    });
    const json = JiraConnectionType.configSchema.schema().schema;
    expect(json).toMatchObject({
      type: 'object',
      additionalProperties: false,
      properties: {
        baseUrl: { type: 'string', format: 'uri' },
        apiBaseUrl: { type: 'string', format: 'uri' },
      },
    });
    expect(json.required).toEqual(
      expect.arrayContaining(['baseUrl', 'deployment']),
    );
    expect(json.required).toHaveLength(2);
    expect(json.properties).not.toHaveProperty('host');
    for (const method of JiraConnectionType.authMethods) {
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
      const parsed = JiraConnectionType.configSchema.parse({
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
      const parsed = JiraConnectionType.configSchema.parse({
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

  it('preserves HTTP internal destinations and installation paths', () => {
    const parsed = parse({
      baseUrl: 'http://localhost:8080/context',
      apiBaseUrl: 'http://127.0.0.1:9000/internal/api',
      deployment: 'datacenter',
      auth: [{ method: 'pat', token: 'dummy' }],
    })[0];
    expect(parsed).toMatchObject({
      baseUrl: 'http://localhost:8080/context/',
      apiBaseUrl: 'http://127.0.0.1:9000/internal/api/',
    });
  });

  it('requires supported, complete provider credentials', () => {
    const invalid: JsonObject[][] = [
      [],
      [{ method: 'apiToken', email: 'invalid', token: 'dummy' }],
      [{ method: 'apiToken', token: 'dummy' }],
      [{ method: 'apiToken', email: 'reader@example.com', token: '' }],
      [
        {
          method: 'apiToken',
          email: 'reader@example.com',
          token: 'Basic encoded',
        },
      ],
      [{ method: 'token', token: 'ambiguous' }],
      [{ method: 'basic', username: 'user', password: 'password' }],
      [{ method: 'none', token: 'unexpected' }],
    ];
    for (const auth of invalid) {
      expect(() => parse({ auth })).toThrow();
    }
  });
  it('preserves Cloud gateways and rejects deployment/auth mismatches and REST-prefixed roots', () => {
    expect(() =>
      JiraConnectionType.configSchema.parse({
        ...fixtureConfig(),
        baseUrl: 'https://example.com/rest/api/2/',
      }),
    ).toThrow(/exclude \/rest/);
    expect(parse()[0]).toMatchObject({ apiBaseUrl: fixture.apiBaseUrl });
    expect(
      parse({
        deployment: 'datacenter',
        auth: [{ method: 'pat', token: 'dummy-pat' }],
      })[0].auth,
    ).toMatchObject([{ method: 'pat' }]);
    for (const deployment of ['cloud', 'datacenter'])
      expect(
        parse({ deployment, auth: [{ method: 'none' }] })[0].auth,
      ).toMatchObject([{ method: 'none' }]);
    expect(() =>
      parse({
        auth: [
          { method: 'pat', token: 'dummy', match: { plugins: ['catalog'] } },
        ],
      }),
    ).toThrow(/not supported for deployment/);
    expect(() => parse({ deployment: 'datacenter' })).toThrow(
      /not supported for deployment/,
    );
    expect(() => parse({ deployment: 'server' })).toThrow();
    expect(() => parse({ deployment: undefined })).toThrow();
    expect(() => parse({ baseUrl: 'https://example.com/rest/api/2/' })).toThrow(
      /exclude \/rest/,
    );
    expect(() =>
      parse({ apiBaseUrl: 'https://example.com/rest/api/3/' }),
    ).toThrow(/exclude \/rest/);
    expect(() =>
      parse({
        deployment: 'datacenter',
        auth: [{ method: 'pat', token: ' ' }],
      }),
    ).toThrow();
  });
});

function fixtureConfig() {
  const { type: _type, auth: _auth, ...config } = fixture;
  return config;
}
