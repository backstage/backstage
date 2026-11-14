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
import { PagerDutyConnectionType } from './pagerduty';

const config = {
  type: 'pagerduty',
  host: 'example.pagerduty.com',
  apiBaseUrl: 'https://api.pagerduty.com',
  auth: [{ method: 'token', token: 'dummy-rest-token' }],
};

function parse(overrides: JsonObject = {}) {
  return buildConnectionsFromConfig({
    config: new ConfigReader({ connections: [{ ...config, ...overrides }] }),
  });
}

describe('PagerDutyConnectionType', () => {
  it('registers the host-based REST contract and validates both regional endpoints', () => {
    expect(connectionTypes.pagerduty).toBe(PagerDutyConnectionType);
    expect(PagerDutyConnectionType.lookupStrategy).toBe('host');
    expect(PagerDutyConnectionType.cardinality).toBe('multiton');
    expect(parse()).toMatchObject([{ ...config, title: 'PagerDuty' }]);
    expect(
      parse({ apiBaseUrl: 'https://api.eu.pagerduty.com' })[0],
    ).toMatchObject({
      apiBaseUrl: 'https://api.eu.pagerduty.com',
      auth: [
        { method: 'token', title: 'REST API Token', token: 'dummy-rest-token' },
      ],
    });
    expect(PagerDutyConnectionType.configSchema.schema().schema).toMatchObject({
      required: ['host', 'apiBaseUrl'],
    });
  });

  it('preserves valid API roots, context paths, trailing slashes, and encoded delimiters', () => {
    for (const apiBaseUrl of [
      'https://api.pagerduty.com/',
      'https://proxy.example.com/pagerduty',
      'https://proxy.example.com/pagerduty/',
      'https://proxy.example.com/pager%3Fduty%23api',
      'https://proxy.example.com/pager%3Fduty%23api/',
    ]) {
      expect(parse({ apiBaseUrl })[0]).toMatchObject({ apiBaseUrl });
    }
  });

  it('normalizes account hosts before rejecting duplicate identities', () => {
    expect(parse({ host: 'Example.PagerDuty.com' })[0]).toMatchObject({
      host: 'example.pagerduty.com',
    });
    expect(() =>
      buildConnectionsFromConfig({
        config: new ConfigReader({
          connections: [config, { ...config, host: 'Example.PagerDuty.com' }],
        }),
      }),
    ).toThrow(/Duplicate connection/);
  });

  it('rejects invalid endpoints and authentication without silently accepting Events or OAuth', () => {
    for (const host of [
      '',
      'https://example.pagerduty.com',
      'example.pagerduty.com/path',
    ]) {
      expect(() => parse({ host })).toThrow();
    }
    for (const apiBaseUrl of [
      '',
      'not-a-url',
      'http://api.pagerduty.com',
      'https://user:secret@api.pagerduty.com',
      'https://api.pagerduty.com?token=secret',
      'https://api.pagerduty.com#fragment',
      'https://api.pagerduty.com?',
      'https://api.pagerduty.com#',
      'https://proxy.example.com/pagerduty?',
      'https://proxy.example.com/pagerduty#',
    ]) {
      expect(() => parse({ apiBaseUrl })).toThrow();
    }
    for (const token of ['', ' ', 'token with spaces', 'token\nheader']) {
      expect(() => parse({ auth: [{ method: 'token', token }] })).toThrow();
    }
    for (const method of ['none', 'routingKey', 'oauth', 'clientCredentials']) {
      expect(() => parse({ auth: [{ method }] })).toThrow(
        /Unknown auth method/,
      );
    }
    expect(() =>
      parse({ auth: [{ method: 'token', routingKey: 'dummy-events-key' }] }),
    ).toThrow();
    expect(() => parse({ auth: [] })).toThrow(/at least one auth method/);
    expect(() =>
      buildConnectionsFromConfig({
        config: new ConfigReader({
          connections: [
            { type: 'pagerduty', host: config.host, auth: config.auth },
          ],
        }),
      }),
    ).toThrow();
  });
});
