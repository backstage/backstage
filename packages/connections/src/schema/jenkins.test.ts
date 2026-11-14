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
import { InputError } from '@backstage/errors';
import type { JsonObject } from '@backstage/types';
import { buildConnectionsFromConfig } from '../config/buildConnectionsFromConfig';
import { connectionTypes } from '../index';
import { JenkinsConnectionType } from './jenkins';

const config = {
  type: 'jenkins',
  host: 'ci.example.com:8443',
  baseUrl: 'https://ci.example.com:8443/jenkins',
  auth: [
    { method: 'apiToken', username: 'backstage-bot', apiToken: 'dummy-token' },
  ],
};
const parse = (connections: JsonObject[]) =>
  buildConnectionsFromConfig({ config: new ConfigReader({ connections }) });

describe('JenkinsConnectionType', () => {
  it('registers a host-based multiton and preserves context paths and credentials', () => {
    expect(connectionTypes.jenkins).toBe(JenkinsConnectionType);
    expect(JenkinsConnectionType).toMatchObject({
      cardinality: 'multiton',
      lookupStrategy: 'host',
    });
    for (const baseUrl of [
      config.baseUrl,
      `${config.baseUrl}/`,
      'http://ci.example.com:8443',
      `${config.baseUrl}%3F%23`,
      `${config.baseUrl}%3F%23/`,
    ]) {
      expect(parse([{ ...config, baseUrl }])[0]).toMatchObject({
        ...config,
        baseUrl,
        title: 'Jenkins',
        auth: [{ ...config.auth[0], title: 'API token' }],
      });
    }
    expect(parse([{ ...config, auth: [{ method: 'none' }] }])[0].auth).toEqual([
      { method: 'none', title: 'None', match: undefined },
    ]);
    expect(JenkinsConnectionType.configSchema.schema().schema).toMatchObject({
      required: ['host', 'baseUrl'],
      additionalProperties: false,
    });
    expect(
      JenkinsConnectionType.authMethods[0].configSchema.schema().schema,
    ).toMatchObject({
      required: ['username', 'apiToken'],
      additionalProperties: false,
    });
  });

  it('rejects invalid endpoints and inconsistent host identities', () => {
    expect(() =>
      JenkinsConnectionType.configSchema.parse({
        host: config.host,
        baseUrl: '/jenkins',
      }),
    ).toThrow(InputError);
    for (const baseUrl of [
      '',
      '/jenkins',
      'ftp://ci.example.com:8443/jenkins',
      'https://user:password@ci.example.com:8443/jenkins',
      `${config.baseUrl}?`,
      `${config.baseUrl}#`,
      `${config.baseUrl}/?`,
      `${config.baseUrl}/#`,
      `${config.baseUrl}?query=true`,
      `${config.baseUrl}#fragment`,
      'https://other.example.com/jenkins',
    ]) {
      expect(() => parse([{ ...config, baseUrl }])).toThrow(
        /Invalid connection of type "jenkins"/,
      );
    }
    for (const host of [
      '',
      'https://ci.example.com:8443',
      'ci.example.com',
      'ci.example.com:8443/jenkins',
    ]) {
      expect(() => parse([{ ...config, host }])).toThrow();
    }
    const { baseUrl: _, ...missingBaseUrl } = config;
    expect(() => parse([missingBaseUrl])).toThrow();
    expect(() => parse([{ ...config, unexpected: true }])).toThrow();
    expect(() =>
      parse([
        config,
        { ...config, baseUrl: 'https://ci.example.com:8443/other' },
      ]),
    ).toThrow(
      'Duplicate connection of type "jenkins" for host "ci.example.com:8443"',
    );
  });

  it('requires explicit auth and rejects incomplete or ambiguous Basic credentials', () => {
    for (const auth of [
      [],
      [{ method: 'token', token: 'dummy' }],
      [{ method: 'apiToken', username: 'bot' }],
      [{ method: 'apiToken', apiToken: 'dummy' }],
      [{ method: 'apiToken', username: '', apiToken: 'dummy' }],
      [{ method: 'apiToken', username: 'bot', apiToken: '' }],
      [{ method: 'apiToken', username: 'bot:other', apiToken: 'dummy' }],
      [{ method: 'apiToken', username: 'bot', password: 'dummy' }],
      [{ method: 'none', apiToken: 'dummy' }],
    ]) {
      expect(() => parse([{ ...config, auth }])).toThrow();
    }
    const { auth: _, ...missingAuth } = config;
    expect(() => parse([missingAuth])).toThrow(
      'must configure at least one auth method',
    );
  });
});
