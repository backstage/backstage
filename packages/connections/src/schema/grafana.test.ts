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
import { GrafanaConnectionType } from './grafana';

const connection = {
  type: 'grafana',
  host: 'example.grafana.net',
  baseUrl: 'https://example.grafana.net',
  auth: [{ method: 'token', token: 'dummy-service-account-token' }],
};

function configure(overrides: JsonObject = {}) {
  return buildConnectionsFromConfig({
    config: new ConfigReader({
      connections: [{ ...connection, ...overrides }],
    }),
  });
}

describe('GrafanaConnectionType', () => {
  it('registers portable schemas and validates Cloud and self-hosted configuration', () => {
    expect(connectionTypes.grafana).toBe(GrafanaConnectionType);
    expect(GrafanaConnectionType.cardinality).toBe('multiton');
    expect(GrafanaConnectionType.lookupStrategy).toBe('host');
    expect(configure()).toMatchObject([connection]);
    expect(
      configure({
        host: 'monitoring.example.com:3000',
        baseUrl: 'http://grafana.internal:3000/grafana/',
        auth: [
          { method: 'basic', username: 'reader', password: 'dummy', orgId: 2 },
        ],
      }),
    ).toMatchObject([
      {
        host: 'monitoring.example.com:3000',
        baseUrl: 'http://grafana.internal:3000/grafana/',
        auth: [{ method: 'basic', orgId: 2 }],
      },
    ]);
    expect(configure({ host: '[::1]:3000' })).toHaveLength(1);
    for (const baseUrl of [
      'https://grafana.example.com/grafana',
      'https://grafana.example.com/grafana/',
      'https://grafana.example.com/grafana%3F%23',
      'https://grafana.example.com/grafana%3F%23/',
    ]) {
      expect(configure({ baseUrl })).toMatchObject([{ baseUrl }]);
    }
    expect(GrafanaConnectionType.configSchema.schema().schema).toMatchObject({
      type: 'object',
      required: ['host', 'baseUrl'],
    });
    expect(
      GrafanaConnectionType.authMethods.map(({ method, configSchema }) => ({
        method,
        schema: configSchema.schema().schema,
      })),
    ).toMatchObject([
      { method: 'token', schema: { required: ['token'] } },
      { method: 'basic', schema: { required: ['username', 'password'] } },
    ]);
  });

  it('rejects invalid endpoints and host identities with configuration context', () => {
    for (const baseUrl of [
      '',
      '/grafana',
      'not a URL',
      'ftp://grafana.example.com',
      'https://user:password@grafana.example.com',
      'https://grafana.example.com?orgId=2',
      'https://grafana.example.com#dashboard',
      'https://grafana.example.com/grafana?',
      'https://grafana.example.com/grafana#',
    ]) {
      expect(() => configure({ baseUrl })).toThrow(/grafana.*|baseUrl/);
    }
    for (const host of [
      '',
      'https://grafana.example.com',
      'grafana.example.com/path',
      'user@grafana.example.com',
      'Grafana.example.com',
      'grafana.example.com?orgId=2',
    ]) {
      expect(() => configure({ host })).toThrow(/host/);
    }
    expect(() => configure({ baseUrl: undefined })).toThrow(/baseUrl/);
  });

  it('requires usable static credentials and rejects unauthenticated access', () => {
    for (const auth of [
      [],
      [{ method: 'none' }],
      [{ method: 'token' }],
      [{ method: 'token', token: '' }],
      [{ method: 'token', token: ' \n' }],
      [{ method: 'basic', username: 'reader' }],
      [{ method: 'basic', username: '', password: 'dummy' }],
      [{ method: 'basic', username: 'user:name', password: 'dummy' }],
      [{ method: 'basic', username: 'reader', password: '' }],
      ...[0, -1, 1.5, '2'].map(orgId => [
        { method: 'basic', username: 'reader', password: 'dummy', orgId },
      ]),
    ]) {
      expect(() => configure({ auth })).toThrow(/grafana/);
    }
  });
});
