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
import { buildConnectionsFromConfig } from '../config/buildConnectionsFromConfig';
import { SonarqubeConnectionType } from './sonarqube';

const connection = {
  type: 'sonarqube',
  host: 'sonarqube.example.com:9000',
  baseUrl: 'http://sonarqube.example.com:9000/sonar',
  externalBaseUrl: 'https://quality.example.com/sonar',
  auth: [{ method: 'token', token: 'dummy-token' }],
};

const parse = (overrides: object = {}) =>
  buildConnectionsFromConfig({
    config: new ConfigReader({
      connections: [{ ...connection, ...overrides }],
    }),
  });

describe('SonarqubeConnectionType', () => {
  it('preserves endpoint paths and defaults tokens to Bearer', () => {
    expect(parse()).toMatchObject([
      {
        ...connection,
        auth: [{ method: 'token', token: 'dummy-token', authType: 'bearer' }],
      },
    ]);
    expect(
      parse({
        auth: [{ method: 'token', token: 'dummy-token', authType: 'basic' }],
      })[0].auth,
    ).toMatchObject([{ authType: 'basic' }]);
    expect(parse({ auth: [{ method: 'none' }] })[0].auth).toMatchObject([
      { method: 'none' },
    ]);
    expect(SonarqubeConnectionType.configSchema.schema().schema).toMatchObject({
      type: 'object',
      required: ['host', 'baseUrl'],
    });
    expect(
      SonarqubeConnectionType.authMethods[1].configSchema.schema().schema,
    ).toMatchObject({ properties: { authType: { default: 'bearer' } } });
  });

  it('rejects invalid endpoints and hosts without requiring the display host to match', () => {
    for (const baseUrl of [
      '',
      'sonarqube.example.com',
      'ftp://sonarqube.example.com:9000/sonar',
      'http://user:password@sonarqube.example.com:9000/sonar',
      'http://sonarqube.example.com:9000/sonar?token=value',
      'http://sonarqube.example.com:9000/sonar#fragment',
      'http://other.example.com:9000/sonar',
    ]) {
      expect(() => parse({ baseUrl })).toThrow();
    }
    expect(() => parse({ baseUrl: undefined })).toThrow();
    expect(() => parse({ host: 'https://sonarqube.example.com:9000' })).toThrow(
      /host must match/,
    );
    expect(() =>
      parse({ externalBaseUrl: 'https://quality.example.com/?key=value' }),
    ).toThrow();
    expect(() => parse({ organization: 'consumer-owned' })).toThrow();
  });

  it('rejects empty query and fragment delimiters while preserving encoded context paths', () => {
    for (const field of ['baseUrl', 'externalBaseUrl'] as const) {
      for (const delimiter of ['?', '#']) {
        expect(() =>
          parse({ [field]: `${connection[field]}${delimiter}` }),
        ).toThrow(/Base URLs must not contain/);
      }
      for (const suffix of ['', '/', '/encoded%3F%23', '/encoded%3F%23/']) {
        const value = `${connection[field]}${suffix}`;
        expect(parse({ [field]: value })[0]).toHaveProperty(field, value);
      }
    }
  });

  it('rejects invalid token credentials and unknown transports', () => {
    for (const auth of [
      [],
      [{ method: 'token' }],
      [{ method: 'token', token: '' }],
      [{ method: 'token', token: '  ' }],
      [{ method: 'token', token: 'dummy\nvalue' }],
      [{ method: 'token', token: 'dummy', authType: 'Basic' }],
      [{ method: 'basic', username: 'user', password: 'password' }],
    ]) {
      expect(() => parse({ auth })).toThrow();
    }
  });

  it('rejects two explicit connections on the same host even with different context paths', () => {
    expect(() =>
      buildConnectionsFromConfig({
        config: new ConfigReader({
          connections: [
            connection,
            {
              ...connection,
              baseUrl: 'http://sonarqube.example.com:9000/other',
            },
          ],
        }),
      }),
    ).toThrow(
      'Duplicate connection of type "sonarqube" for host "sonarqube.example.com:9000"',
    );
  });
});
