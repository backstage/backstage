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
import { buildConnectionsFromConfig } from '../config';
import { connectionTypes } from '../definitions/types';
import { DatadogConnectionType } from './datadog';

describe('DatadogConnectionType', () => {
  const auth = {
    method: 'apiKey',
    apiKey: 'dummy-api-key',
    applicationKey: 'dummy-application-key',
  };
  const connection = {
    type: 'datadog',
    host: 'api.datadoghq.com',
    auth: [auth],
  };
  const parse = (entry: object) =>
    buildConnectionsFromConfig({
      config: new ConfigReader({ connections: [entry] }),
    });

  it('registers a host-based connection with portable schemas', () => {
    expect(connectionTypes.datadog).toBe(DatadogConnectionType);
    expect(DatadogConnectionType).toMatchObject({
      type: 'datadog',
      cardinality: 'multiton',
      lookupStrategy: 'host',
    });
    expect(parse(connection)).toMatchObject([connection]);
    expect(DatadogConnectionType.configSchema.schema().schema).toMatchObject({
      required: ['host'],
      additionalProperties: false,
    });
    expect(DatadogConnectionType.authMethods).toHaveLength(1);
    expect(
      DatadogConnectionType.authMethods[0].configSchema.schema().schema,
    ).toMatchObject({ required: ['apiKey', 'applicationKey'] });
  });

  it('rejects missing or malformed hosts and unknown connection fields', () => {
    for (const host of [
      undefined,
      '',
      'https://api.datadoghq.com',
      'api.datadoghq.com/api/v2',
      'api.datadoghq.com:443',
      'API.datadoghq.com',
      ' api.datadoghq.com',
      'api..datadoghq.com',
    ]) {
      expect(() => parse({ ...connection, host })).toThrow(InputError);
    }
    expect(() => parse({ ...connection, site: 'datadoghq.com' })).toThrow(
      InputError,
    );
  });

  it('requires both nonempty keys and an explicit supported authentication method', () => {
    for (const field of ['apiKey', 'applicationKey']) {
      for (const value of [undefined, '', '   ', 'key with spaces', 123]) {
        expect(() =>
          parse({
            ...connection,
            auth: [{ ...auth, [field]: value }],
          }),
        ).toThrow(InputError);
      }
    }
    for (const entries of [
      [],
      [{ method: 'none' }],
      [{ method: 'token', token: 'dummy' }],
    ]) {
      expect(() => parse({ ...connection, auth: entries })).toThrow(InputError);
    }
  });
});
