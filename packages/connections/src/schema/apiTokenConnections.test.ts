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

const providers = [
  { type: 'sentry', method: 'token', field: 'token' },
  { type: 'buildkite', method: 'token', field: 'token' },
  { type: 'circleci', method: 'token', field: 'token' },
  { type: 'launchdarkly', method: 'token', field: 'token' },
  { type: 'octopus-deploy', method: 'apiKey', field: 'apiKey' },
  { type: 'dynatrace', method: 'token', field: 'token' },
  { type: 'fossa', method: 'token', field: 'token' },
  { type: 'rollbar', method: 'token', field: 'token' },
] as const;

describe.each(providers)('$type connections', ({ type, method, field }) => {
  const definition = connectionTypes[type];
  const fixture = {
    type,
    baseUrl: 'https://EXAMPLE.com:8443/context%2Fname%3F%23',
    auth: [{ method, [field]: 'dummy-token' }],
  };
  const parse = (overrides: JsonObject = {}) => {
    const {
      type: _type,
      title: _title,
      match: _match,
      auth: _auth,
      ...config
    } = buildConnectionsFromConfig({
      config: new ConfigReader({ connections: [{ ...fixture, ...overrides }] }),
    })[0];
    return definition.configSchema.parse(config);
  };

  it('exports portable draft-07 input schemas separately from normalized output', () => {
    expect(definition.cardinality).toBe('multiton');
    const schema = definition.configSchema.schema().schema;
    expect(schema).toMatchObject({
      $schema: 'http://json-schema.org/draft-07/schema#',
      type: 'object',
      required: ['baseUrl'],
      additionalProperties: false,
      properties: {
        baseUrl: { type: 'string', format: 'uri' },
        apiBaseUrl: { type: 'string', format: 'uri' },
      },
    });
    expect(Object.keys(schema.properties!)).toEqual(['apiBaseUrl', 'baseUrl']);
    expect(definition.authMethods).toHaveLength(1);
    expect(definition.authMethods[0]).toMatchObject({ method });
    expect(
      definition.authMethods[0].configSchema.schema().schema,
    ).toMatchObject({
      $schema: 'http://json-schema.org/draft-07/schema#',
      type: 'object',
      required: [field],
      properties: {
        [field]: { type: 'string', minLength: 1, pattern: '^\\S+$' },
      },
    });
    // Input schemas describe URI strings, not the output-only slash transform.
    // Raw URL refinements are enforced by the parser, not portable JSON Schema.
    const parsed = parse();
    expect(parsed.baseUrl).toBe(`${fixture.baseUrl}/`);
    expect(parsed).not.toHaveProperty('host');
    expect(parsed).not.toHaveProperty('apiBaseUrl');
    expect(
      definition.getLookupIdentity(
        definition.configSchema.parse({ baseUrl: fixture.baseUrl }),
      ),
    ).toEqual({
      key: 'host',
      value: 'example.com:8443',
    });
    const copy = definition.configSchema.schema().schema;
    copy.required = [];
    expect(definition.configSchema.schema().schema.required).toEqual([
      'baseUrl',
    ]);
  });

  it('preserves explicit roots and rejects invalid config and unusable credentials', () => {
    for (const slash of ['', '/']) {
      const parsed = parse({
        baseUrl: `${fixture.baseUrl}${slash}`,
        apiBaseUrl: `http://127.0.0.1:8080/internal%2Fcontext/api${slash}`,
      });
      expect(new URL('resource', parsed.baseUrl).href).toBe(
        'https://example.com:8443/context%2Fname%3F%23/resource',
      );
      expect(new URL('resource', parsed.apiBaseUrl!).href).toBe(
        'http://127.0.0.1:8080/internal%2Fcontext/api/resource',
      );
    }
    for (const fieldName of ['baseUrl', 'apiBaseUrl']) {
      for (const value of [
        '',
        '/relative',
        'ftp://example.com',
        'https://@example.com',
        'https://user:secret@example.com',
        'https://example.com?',
        'https://example.com#',
        'https://example.com/raw space',
        'https://example.com/path\u0000',
      ]) {
        expect(() => parse({ [fieldName]: value })).toThrow();
      }
    }
    for (const overrides of [
      { baseUrl: undefined },
      { host: 'example.com' },
      { token: 'misplaced-token' },
      { auth: [] },
      { auth: [{ method: 'none' }] },
      { auth: [{ method }] },
      ...['', ' ', 'two words', 'line\nbreak'].map(value => ({
        auth: [{ method, [field]: value }],
      })),
    ]) {
      expect(() => parse(overrides)).toThrow();
    }
    expect(() =>
      buildConnectionsFromConfig({
        config: new ConfigReader({
          connections: [
            fixture,
            {
              ...fixture,
              baseUrl: 'https://example.com:8443/organizations/other/',
            },
          ],
        }),
      }),
    ).toThrow(/Duplicate connection/);
  });
});
