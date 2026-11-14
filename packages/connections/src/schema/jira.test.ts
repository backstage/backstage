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
import { JsonObject } from '@backstage/types';
import { buildConnectionsFromConfig } from '../config/buildConnectionsFromConfig';
import { connectionTypes } from '../definitions/types';
import { JiraConnectionType } from './jira';

const cloud = {
  type: 'jira',
  host: 'example.atlassian.net',
  deployment: 'cloud',
  baseUrl: 'https://example.atlassian.net',
  apiBaseUrl:
    'https://api.atlassian.com/ex/jira/00000000-0000-4000-8000-000000000000',
  auth: [
    { method: 'apiToken', email: 'reader@example.com', token: 'dummy-token' },
  ],
};

function configure(connection: JsonObject) {
  return buildConnectionsFromConfig({
    config: new ConfigReader({ connections: [connection] }),
  });
}

describe('JiraConnectionType', () => {
  it('registers portable schemas and preserves site and API roots', () => {
    expect(connectionTypes.jira).toBe(JiraConnectionType);
    expect(JiraConnectionType.lookupStrategy).toBe('host');
    expect(JiraConnectionType.cardinality).toBe('multiton');
    expect(configure(cloud)).toMatchObject([{ ...cloud, title: 'Jira' }]);
    expect(
      configure({
        type: 'jira',
        host: 'jira.example.com:8443',
        deployment: 'datacenter',
        baseUrl: 'https://jira.example.com:8443/jira/',
        auth: [{ method: 'pat', token: 'dummy-pat' }],
      }),
    ).toMatchObject([
      {
        baseUrl: 'https://jira.example.com:8443/jira/',
        auth: [{ method: 'pat', token: 'dummy-pat' }],
      },
    ]);
    for (const deployment of ['cloud', 'datacenter']) {
      expect(
        configure({ ...cloud, deployment, auth: [{ method: 'none' }] }),
      ).toMatchObject([{ auth: [{ method: 'none' }] }]);
    }
    expect(JiraConnectionType.configSchema.schema().schema).toMatchObject({
      type: 'object',
      required: ['host', 'deployment', 'baseUrl'],
    });
    for (const method of JiraConnectionType.authMethods) {
      expect(method.configSchema.schema().schema).toMatchObject({
        type: 'object',
      });
    }
  });

  it('rejects malformed or ambiguous endpoint configuration', () => {
    const invalidFields = [
      { host: '' },
      { host: 'https://example.atlassian.net' },
      { deployment: 'server' },
      { deployment: undefined },
      { baseUrl: undefined },
      { baseUrl: 'not-a-url' },
      { baseUrl: 'ftp://example.atlassian.net' },
      { baseUrl: 'https://different.atlassian.net' },
      { baseUrl: 'https://user:secret@example.atlassian.net' },
      { baseUrl: 'https://example.atlassian.net?secret=token' },
      { apiBaseUrl: 'https://api.atlassian.com/#fragment' },
      { apiBaseUrl: 'https://api.atlassian.com/rest/api/3/' },
      { baseUrl: 'https://example.atlassian.net/rest/api/2/' },
      { unknown: true },
    ];
    for (const fields of invalidFields) {
      expect(() => configure({ ...cloud, ...fields })).toThrow();
    }
  });

  it('rejects empty query and fragment delimiters without rejecting encoded path characters', () => {
    for (const field of ['baseUrl', 'apiBaseUrl']) {
      const root = field === 'baseUrl' ? cloud.baseUrl : cloud.apiBaseUrl;
      for (const suffix of ['?', '#', '/?', '/#']) {
        expect(() =>
          configure({ ...cloud, [field]: `${root}${suffix}` }),
        ).toThrow(
          'must not contain credentials, query parameters, or fragments',
        );
      }
      for (const path of ['/jira', '/jira/', '/jira%3F%23', '/jira%3F%23/']) {
        const value = `${root}${path}`;
        expect(configure({ ...cloud, [field]: value })).toMatchObject([
          { [field]: value },
        ]);
        const endpoint = new URL(
          'rest/api/3/myself',
          `${value.replace(/\/$/, '')}/`,
        );
        expect(endpoint.href).toBe(
          `${value.replace(/\/$/, '')}/rest/api/3/myself`,
        );
      }
    }
  });

  it('rejects incomplete credentials and authorization header values', () => {
    const invalidAuth = [
      { method: 'apiToken', email: 'invalid', token: 'dummy' },
      { method: 'apiToken', token: 'dummy' },
      { method: 'apiToken', email: 'reader@example.com', token: '' },
      {
        method: 'apiToken',
        email: 'reader@example.com',
        token: 'Basic encoded',
      },
      { method: 'pat', token: ' ' },
      { method: 'token', token: 'ambiguous' },
      { method: 'basic', username: 'user', password: 'password' },
      { method: 'none', token: 'unexpected' },
    ];
    for (const auth of invalidAuth) {
      const deployment = auth.method === 'pat' ? 'datacenter' : 'cloud';
      expect(() => configure({ ...cloud, deployment, auth: [auth] })).toThrow();
    }
  });

  it('rejects deployment/auth mismatches even in plugin-scoped entries', () => {
    expect(() =>
      configure({
        ...cloud,
        auth: [
          { method: 'pat', token: 'dummy', match: { plugins: ['catalog'] } },
        ],
      }),
    ).toThrow('auth method "pat" is not supported for deployment "cloud"');
    expect(() => configure({ ...cloud, deployment: 'datacenter' })).toThrow(
      'auth method "apiToken" is not supported for deployment "datacenter"',
    );
    expect(() => configure({ ...cloud, auth: [] })).toThrow(
      'at least one auth method',
    );
  });
});
