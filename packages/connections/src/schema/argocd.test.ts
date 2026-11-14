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
import { connectionTypes } from '../definitions/types';

const config = {
  type: 'argocd',
  host: 'argocd.example.com:8443',
  baseUrl: 'https://argocd.example.com:8443/argo-cd',
  auth: [{ method: 'token', token: 'dummy-api-token' }],
};

function parse(connection: object) {
  return buildConnectionsFromConfig({
    config: new ConfigReader({ connections: [connection] }),
  });
}

describe('Argo CD connections', () => {
  it('registers a portable host-based multiton with token authentication', () => {
    const type = connectionTypes.argocd;
    expect(type.type).toBe('argocd');
    expect(type.cardinality).toBe('multiton');
    expect(type.lookupStrategy).toBe('host');
    expect(type.authMethods.map(method => method.method)).toEqual(['token']);
    expect(type.configSchema.schema().schema).toMatchObject({
      required: ['host', 'baseUrl'],
      additionalProperties: false,
      properties: { baseUrl: { type: 'string', format: 'uri' } },
    });
    expect(type.authMethods[0].configSchema.schema().schema).toMatchObject({
      required: ['token'],
      properties: { token: { type: 'string', pattern: expect.any(String) } },
    });
    expect(parse(config)).toMatchObject([
      {
        ...config,
        title: 'Argo CD',
        auth: [{ ...config.auth[0], title: 'API Token' }],
      },
    ]);
    expect(
      parse({ ...config, baseUrl: `${config.baseUrl}/` })[0],
    ).toMatchObject({
      baseUrl: `${config.baseUrl}/`,
    });
    expect(
      parse({ ...config, baseUrl: 'http://argocd.example.com:8443' }),
    ).toHaveLength(1);
  });

  it('rejects malformed endpoint configuration and mismatched identities', () => {
    for (const baseUrl of [
      undefined,
      '',
      '/argo-cd',
      'ftp://argocd.example.com:8443',
      'https://other.example.com/argo-cd',
      'https://argocd.example.com/argo-cd',
      'https://user:password@argocd.example.com:8443',
      `${config.baseUrl}?token=secret`,
      `${config.baseUrl}#fragment`,
      `${config.baseUrl}?`,
      `${config.baseUrl}#`,
    ]) {
      expect(() => parse({ ...config, baseUrl })).toThrow(/Invalid connection/);
    }
    expect(() => parse({ ...config, host: '' })).toThrow();
    expect(() => parse({ ...config, unknown: 'field' })).toThrow();
  });

  it('preserves encoded path characters and optional trailing slashes', () => {
    for (const baseUrl of [
      `${config.baseUrl}/tenant%3Fname%23section`,
      `${config.baseUrl}/tenant%3Fname%23section/`,
    ]) {
      expect(parse({ ...config, baseUrl })[0]).toMatchObject({ baseUrl });
      expect(
        new URL(
          'api/v1/applications',
          `${baseUrl.replace(/\/+$/, '')}/`,
        ).toString(),
      ).toBe(`${config.baseUrl}/tenant%3Fname%23section/api/v1/applications`);
    }
  });

  it('requires explicit raw token authentication', () => {
    for (const auth of [
      [],
      [{ method: 'none' }],
      [{ method: 'basic', username: 'user', password: 'secret' }],
      [{ method: 'token' }],
      ...[
        '',
        '   ',
        'Bearer dummy-token',
        'argocd.token=dummy-token',
        'token\nvalue',
      ].map(token => [{ method: 'token', token }]),
    ]) {
      expect(() => parse({ ...config, auth })).toThrow(/Invalid connection/);
    }
  });

  it('rejects duplicate hosts even when deployment paths differ', () => {
    expect(() =>
      buildConnectionsFromConfig({
        config: new ConfigReader({
          connections: [
            config,
            { ...config, baseUrl: 'https://argocd.example.com:8443/other' },
          ],
        }),
      }),
    ).toThrow(
      'Duplicate connection of type "argocd" for host "argocd.example.com:8443"',
    );
  });
});
