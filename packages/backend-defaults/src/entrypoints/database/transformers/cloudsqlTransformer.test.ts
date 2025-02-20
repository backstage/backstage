/*
 * Copyright 2025 The Backstage Authors
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

import { Knex } from 'knex';
import { cloudsqlTransformer } from './cloudsqlTransformer';

jest.mock('@google-cloud/cloud-sql-connector');

describe('cloudsqlTransformer', () => {
  it('should throw with incorrect config', async () => {
    await expect(
      cloudsqlTransformer({
        client: 'pg',
        connection: {
          type: 'cloudsql',
        },
      } as any as Knex.Config),
    ).rejects.toThrow(/Missing instance connection name for Cloud SQL/);
  });

  it('adds the settings from cloud-sql-connector', async () => {
    const { Connector } = jest.requireMock(
      '@google-cloud/cloud-sql-connector',
    ) as jest.Mocked<typeof import('@google-cloud/cloud-sql-connector')>;

    const mockStream = (): any => {};
    Connector.prototype.getOptions.mockResolvedValue({ stream: mockStream });

    expect(
      await cloudsqlTransformer({
        client: 'pg',
        connection: {
          type: 'cloudsql',
          database: 'other_db',
          user: 'ben@gke.com',
          instance: 'project:region:instance',
          port: 5423,
        },
      } as any),
    ).toEqual({
      client: 'pg',
      connection: {
        user: 'ben@gke.com',
        port: 5423,
        stream: mockStream,
        database: 'other_db',
      },
    });
  });

  it('passes default settings to cloud-sql-connector', async () => {
    const { Connector } = jest.requireMock(
      '@google-cloud/cloud-sql-connector',
    ) as jest.Mocked<typeof import('@google-cloud/cloud-sql-connector')>;

    const mockStream = (): any => {};
    Connector.prototype.getOptions.mockResolvedValue({ stream: mockStream });

    await cloudsqlTransformer({
      client: 'pg',
      connection: {
        type: 'cloudsql',
        user: 'ben@gke.com',
        instance: 'project:region:instance',
        port: 5423,
      },
    } as any);

    expect(Connector.prototype.getOptions).toHaveBeenCalledWith({
      authType: 'IAM',
      instanceConnectionName: 'project:region:instance',
      ipType: 'PUBLIC',
    });
  });

  it('passes ip settings to cloud-sql-connector', async () => {
    const { Connector } = jest.requireMock(
      '@google-cloud/cloud-sql-connector',
    ) as jest.Mocked<typeof import('@google-cloud/cloud-sql-connector')>;

    const mockStream = (): any => {};
    Connector.prototype.getOptions.mockResolvedValue({ stream: mockStream });

    await cloudsqlTransformer({
      client: 'pg',
      connection: {
        type: 'cloudsql',
        user: 'ben@gke.com',
        instance: 'project:region:instance',
        ipAddressType: 'PRIVATE',
        port: 5423,
      },
    } as any);

    expect(Connector.prototype.getOptions).toHaveBeenCalledWith({
      authType: 'IAM',
      instanceConnectionName: 'project:region:instance',
      ipType: 'PRIVATE',
    });
  });
});
