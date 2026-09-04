/*
 * Copyright 2020 The Backstage Authors
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

import { Config, ConfigReader } from '@backstage/config';
import {
  buildPgDatabaseConfig,
  computePgPluginConfig,
  createPgDatabaseClient,
  getPgConnectionConfig,
  parsePgConnectionString,
  PgAdminPool,
  PgConnector,
} from './postgres';
import { type Knex } from 'knex';
import { mockServices } from '@backstage/backend-test-utils';

jest.mock('@google-cloud/cloud-sql-connector');
jest.mock('@azure/identity');
jest.mock('@aws-sdk/rds-signer');

describe('postgres', () => {
  const deps = {
    logger: mockServices.logger.mock(),
    lifecycle: mockServices.lifecycle.mock(),
  };

  const createMockConnection = () => ({
    host: 'acme',
    user: 'foo',
    password: 'bar',
    database: 'foodb',
  });

  describe('PgAdminPool', () => {
    it('reuses the client between operations within the idle timeout', async () => {
      const client = { destroy: jest.fn() } as unknown as Knex;
      const createClient = jest.fn().mockResolvedValue(client);
      const pool = new PgAdminPool(createClient, 10_000);

      const first = await pool.run((admin: unknown) => admin);
      const second = await pool.run((admin: unknown) => admin);

      expect(first).toBe(client);
      expect(second).toBe(client);
      expect(createClient).toHaveBeenCalledTimes(1);
      expect(client.destroy).not.toHaveBeenCalled();
    });

    it('destroys an idle client and recreates it for later work', async () => {
      jest.useFakeTimers();
      try {
        const clients = [
          { destroy: jest.fn().mockResolvedValue(undefined) },
          { destroy: jest.fn().mockResolvedValue(undefined) },
        ] as unknown as Knex[];
        const createClient = jest
          .fn()
          .mockResolvedValueOnce(clients[0])
          .mockResolvedValueOnce(clients[1]);
        const pool = new PgAdminPool(createClient, 10_000);

        await pool.run(() => undefined);
        await jest.advanceTimersByTimeAsync(5_000);
        await pool.run(() => undefined);
        await jest.advanceTimersByTimeAsync(9_999);
        expect(clients[0].destroy).not.toHaveBeenCalled();

        await jest.advanceTimersByTimeAsync(1);
        expect(clients[0].destroy).toHaveBeenCalledTimes(1);

        const laterClient = await pool.run(admin => admin);
        expect(laterClient).toBe(clients[1]);
      } finally {
        jest.useRealTimers();
      }
    });

    it('waits for idle destruction before creating another client', async () => {
      jest.useFakeTimers();
      try {
        let releaseDestroy!: () => void;
        const destroyBlocker = new Promise<void>(resolve => {
          releaseDestroy = resolve;
        });
        const clients = [
          { destroy: jest.fn().mockReturnValue(destroyBlocker) },
          { destroy: jest.fn().mockResolvedValue(undefined) },
        ] as unknown as Knex[];
        const createClient = jest
          .fn()
          .mockResolvedValueOnce(clients[0])
          .mockResolvedValueOnce(clients[1]);
        const pool = new PgAdminPool(createClient, 10_000);

        await pool.run(() => undefined);
        await jest.advanceTimersByTimeAsync(10_000);
        expect(clients[0].destroy).toHaveBeenCalledTimes(1);

        const laterOperation = pool.run(admin => admin);
        await Promise.resolve();
        expect(createClient).toHaveBeenCalledTimes(1);

        releaseDestroy();
        await expect(laterOperation).resolves.toBe(clients[1]);
      } finally {
        jest.useRealTimers();
      }
    });

    it('waits for idle destruction during shutdown', async () => {
      jest.useFakeTimers();
      try {
        let releaseDestroy!: () => void;
        const destroyBlocker = new Promise<void>(resolve => {
          releaseDestroy = resolve;
        });
        const client = {
          destroy: jest.fn().mockReturnValue(destroyBlocker),
        } as unknown as Knex;
        const pool = new PgAdminPool(
          jest.fn().mockResolvedValue(client),
          10_000,
        );

        await pool.run(() => undefined);
        await jest.advanceTimersByTimeAsync(10_000);

        const shutdownComplete = jest.fn();
        const shutdown = pool.shutdown().then(shutdownComplete);
        for (let i = 0; i < 10; i++) {
          await Promise.resolve();
        }
        expect(shutdownComplete).not.toHaveBeenCalled();

        releaseDestroy();
        await shutdown;
        expect(shutdownComplete).toHaveBeenCalledTimes(1);
      } finally {
        jest.useRealTimers();
      }
    });

    it('recovers after idle destruction fails and reports it on shutdown', async () => {
      jest.useFakeTimers();
      try {
        const clients = [
          {
            destroy: jest.fn().mockRejectedValue(new Error('destroy failed')),
          },
          { destroy: jest.fn().mockResolvedValue(undefined) },
        ] as unknown as Knex[];
        const pool = new PgAdminPool(
          jest
            .fn()
            .mockResolvedValueOnce(clients[0])
            .mockResolvedValueOnce(clients[1]),
          10_000,
        );

        await pool.run(() => undefined);
        await jest.advanceTimersByTimeAsync(10_000);

        await expect(pool.run(admin => admin)).resolves.toBe(clients[1]);
        await expect(pool.shutdown()).rejects.toThrow(
          'Failed to destroy PostgreSQL admin pool clients',
        );
      } finally {
        jest.useRealTimers();
      }
    });

    it('destroys the client on shutdown and rejects later work', async () => {
      const client = {
        destroy: jest.fn().mockResolvedValue(undefined),
      } as unknown as Knex;
      const pool = new PgAdminPool(jest.fn().mockResolvedValue(client), 10_000);

      await pool.run(() => undefined);
      await pool.shutdown();

      expect(client.destroy).toHaveBeenCalledTimes(1);
      await expect(pool.run(() => undefined)).rejects.toThrow(
        'PostgreSQL admin pool is shut down',
      );
    });

    it('retries client creation after a failure', async () => {
      const client = {
        destroy: jest.fn().mockResolvedValue(undefined),
      } as unknown as Knex;
      const createClient = jest
        .fn()
        .mockRejectedValueOnce(new Error('connection failed'))
        .mockResolvedValueOnce(client);
      const pool = new PgAdminPool(createClient, 10_000);

      await expect(pool.run(() => undefined)).rejects.toThrow(
        'connection failed',
      );
      await expect(pool.run(admin => admin)).resolves.toBe(client);
      expect(createClient).toHaveBeenCalledTimes(2);
      await pool.shutdown();
    });

    it('waits for active operations before shutting down', async () => {
      const client = {
        destroy: jest.fn().mockResolvedValue(undefined),
      } as unknown as Knex;
      const pool = new PgAdminPool(jest.fn().mockResolvedValue(client), 10_000);
      let signalStarted!: () => void;
      const started = new Promise<void>(resolve => {
        signalStarted = resolve;
      });
      let releaseOperation!: () => void;
      const operationBlocker = new Promise<void>(resolve => {
        releaseOperation = resolve;
      });
      const operation = pool.run(async () => {
        signalStarted();
        await operationBlocker;
      });
      await started;

      const shutdown = pool.shutdown();
      await Promise.resolve();
      expect(client.destroy).not.toHaveBeenCalled();

      releaseOperation();
      await Promise.all([operation, shutdown]);
      expect(client.destroy).toHaveBeenCalledTimes(1);
    });
  });

  const createMockConnectionString = () =>
    'postgresql://foo:bar@acme:5432/foodb';

  const createConfig = (connection: any): Config =>
    new ConfigReader({ client: 'pg', connection });

  describe('buildPgDatabaseConfig', () => {
    afterEach(() => {
      jest.useRealTimers();
    });

    it('builds a postgres config', async () => {
      const mockConnection = createMockConnection();

      expect(await buildPgDatabaseConfig(createConfig(mockConnection))).toEqual(
        {
          client: 'pg',
          connection: mockConnection,
          pool: { min: 0 },
          useNullAsDefault: true,
        },
      );
    });

    it('builds a connection string config', async () => {
      const mockConnectionString = createMockConnectionString();

      expect(
        await buildPgDatabaseConfig(createConfig(mockConnectionString)),
      ).toEqual({
        client: 'pg',
        connection: mockConnectionString,
        pool: { min: 0 },
        useNullAsDefault: true,
      });
    });

    it('overrides the database name', async () => {
      const mockConnection = createMockConnection();

      expect(
        await buildPgDatabaseConfig(createConfig(mockConnection), {
          connection: { database: 'other_db' },
        }),
      ).toEqual({
        client: 'pg',
        connection: {
          ...mockConnection,
          database: 'other_db',
        },
        pool: { min: 0 },
        useNullAsDefault: true,
      });
    });

    it('overrides the schema name', async () => {
      const mockConnection = {
        ...createMockConnection(),
        schema: 'schemaName',
      };

      expect(
        await buildPgDatabaseConfig(createConfig(mockConnection), {
          searchPath: ['schemaName'],
        }),
      ).toEqual({
        client: 'pg',
        connection: mockConnection,
        pool: { min: 0 },
        searchPath: ['schemaName'],
        useNullAsDefault: true,
      });
    });

    it('adds additional config settings', async () => {
      const mockConnection = createMockConnection();

      expect(
        await buildPgDatabaseConfig(createConfig(mockConnection), {
          connection: { database: 'other_db' },
          pool: { min: 2, max: 7 },
          debug: true,
        }),
      ).toEqual({
        client: 'pg',
        connection: {
          ...mockConnection,
          database: 'other_db',
        },
        useNullAsDefault: true,
        pool: { min: 2, max: 7 },
        debug: true,
      });
    });

    it('overrides the database from connection string', async () => {
      const mockConnectionString = createMockConnectionString();
      const mockConnection = createMockConnection();

      expect(
        await buildPgDatabaseConfig(createConfig(mockConnectionString), {
          connection: { database: 'other_db' },
        }),
      ).toEqual({
        client: 'pg',
        connection: {
          ...mockConnection,
          port: '5432',
          database: 'other_db',
        },
        pool: { min: 0 },
        useNullAsDefault: true,
      });
    });

    it('should default to using default azure credentials when type is azure with no credentials', async () => {
      const { DefaultAzureCredential } = jest.requireMock(
        '@azure/identity',
      ) as jest.Mocked<typeof import('@azure/identity')>;

      const tokenExpirationTimestamp = new Date(
        '2025-01-01T12:34:56.789',
      ).valueOf();

      DefaultAzureCredential.prototype.getToken.mockResolvedValue({
        token: 'afaketoken',
        expiresOnTimestamp: tokenExpirationTimestamp,
      });

      const configResult = await buildPgDatabaseConfig(
        new ConfigReader({
          client: 'pg',
          connection: {
            type: 'azure',
            user: 'some-user@domain.com',
            port: 5423,
            database: 'other_db',
          },
        }),
      );

      expect(DefaultAzureCredential).toHaveBeenCalled();
      expect(configResult).toMatchObject({
        client: 'pg',
        connection: expect.any(Function),
        useNullAsDefault: true,
      });

      const connectionResult = await configResult.connection();

      expect(connectionResult).toMatchObject({
        user: 'some-user@domain.com',
        password: 'afaketoken',
        port: 5423,
        expirationChecker: expect.any(Function),
      });
      expect(connectionResult).not.toHaveProperty('allowedClockSkewMs');
      expect(connectionResult).not.toHaveProperty('type');
      expect(connectionResult).not.toHaveProperty('tokenCredential');
    });

    it('uses the correct config when using azure managed identity', async () => {
      const { ManagedIdentityCredential } = jest.requireMock(
        '@azure/identity',
      ) as jest.Mocked<typeof import('@azure/identity')>;

      const tokenExpirationTimestamp = new Date(
        '2025-01-01T12:34:56.789',
      ).valueOf();

      ManagedIdentityCredential.prototype.getToken.mockResolvedValue({
        token: 'afaketoken',
        expiresOnTimestamp: tokenExpirationTimestamp,
      });

      const configResult = await buildPgDatabaseConfig(
        new ConfigReader({
          client: 'pg',
          connection: {
            type: 'azure',
            user: 'some-user@domain.com',
            port: 5423,
            database: 'other_db',
            tokenCredential: {
              clientId: 'my-client-id',
            },
          },
        }),
      );

      expect(ManagedIdentityCredential).toHaveBeenCalledWith('my-client-id');
      expect(configResult).toMatchObject({
        client: 'pg',
        connection: expect.any(Function),
        useNullAsDefault: true,
      });

      const connectionResult = await configResult.connection();

      expect(connectionResult).toMatchObject({
        user: 'some-user@domain.com',
        password: 'afaketoken',
        port: 5423,
        expirationChecker: expect.any(Function),
      });
      expect(connectionResult).not.toHaveProperty('type');
      expect(connectionResult).not.toHaveProperty('tokenCredential');
    });

    it('uses the correct config when using azure client secret credentials', async () => {
      const { ClientSecretCredential } = jest.requireMock(
        '@azure/identity',
      ) as jest.Mocked<typeof import('@azure/identity')>;

      const tokenExpirationTimestamp = new Date(
        '2025-01-01T12:34:56.789',
      ).valueOf();

      ClientSecretCredential.prototype.getToken.mockResolvedValue({
        token: 'afaketoken',
        expiresOnTimestamp: tokenExpirationTimestamp,
      });

      const configResult = await buildPgDatabaseConfig(
        new ConfigReader({
          client: 'pg',
          connection: {
            type: 'azure',
            user: 'some-user@domain.com',
            port: 5423,
            database: 'other_db',
            tokenCredential: {
              clientId: 'my-client-id',
              tenantId: 'my-tenant-id',
              clientSecret: 'my-client-secret',
            },
          },
        }),
      );

      expect(ClientSecretCredential).toHaveBeenCalledWith(
        'my-tenant-id',
        'my-client-id',
        'my-client-secret',
      );
      expect(configResult).toMatchObject({
        client: 'pg',
        connection: expect.any(Function),
        useNullAsDefault: true,
      });

      const connectionResult = await configResult.connection();

      expect(connectionResult).toMatchObject({
        user: 'some-user@domain.com',
        password: 'afaketoken',
        port: 5423,
        expirationChecker: expect.any(Function),
      });
      expect(connectionResult).not.toHaveProperty('type');
      expect(connectionResult).not.toHaveProperty('tokenCredential');
    });

    it('removes tokenCredential from the final connection', async () => {
      const { DefaultAzureCredential } = jest.requireMock(
        '@azure/identity',
      ) as jest.Mocked<typeof import('@azure/identity')>;
      DefaultAzureCredential.prototype.getToken.mockResolvedValue({
        token: 't',
        expiresOnTimestamp: Date.now() + 1000,
      });

      const config = new ConfigReader({
        client: 'pg',
        connection: {
          type: 'azure',
          instance: 'unused',
          tokenCredential: { clientId: 'x' },
        },
      });

      const configResult = await buildPgDatabaseConfig(config);
      const connection = await configResult.connection();

      expect(connection).not.toHaveProperty('tokenCredential');
    });

    it('instructs knex to get a new connection object when the old azure token expires', async () => {
      const { DefaultAzureCredential } = jest.requireMock(
        '@azure/identity',
      ) as jest.Mocked<typeof import('@azure/identity')>;

      const tokenExpirationTimestamp = new Date(
        '2025-01-01T12:34:56.789',
      ).valueOf();

      DefaultAzureCredential.prototype.getToken.mockResolvedValue({
        token: 'afaketoken',
        expiresOnTimestamp: tokenExpirationTimestamp,
      });

      let configResult = await buildPgDatabaseConfig(
        new ConfigReader({
          client: 'pg',
          connection: {
            type: 'azure',
            tokenCredential: {
              tokenRenewableOffsetTime: '1 minute',
            },
            user: 'some-user@domain.com',
            database: 'other_db',
            port: 5423,
          },
        }),
      );

      let connectionResult = await configResult.connection();

      jest.useFakeTimers({ now: tokenExpirationTimestamp - 90_000 });
      let expirationResult = await connectionResult.expirationChecker();
      expect(expirationResult).toBe(false);

      jest.useFakeTimers({ now: tokenExpirationTimestamp - 60_000 });
      expirationResult = await connectionResult.expirationChecker();
      expect(expirationResult).toBe(true);

      jest.useFakeTimers({ now: tokenExpirationTimestamp });
      expirationResult = await connectionResult.expirationChecker();
      expect(expirationResult).toBe(true);

      // Check the default tokenRenewableOffsetTime of 5 minutes
      configResult = await buildPgDatabaseConfig(
        new ConfigReader({
          client: 'pg',
          connection: {
            type: 'azure',
            user: 'user@contoso.com',
            database: 'other_db',
            port: 5423,
          },
        }),
      );

      connectionResult = await configResult.connection();
      jest.useFakeTimers({ now: tokenExpirationTimestamp - 450_000 });
      expirationResult = await connectionResult.expirationChecker();
      expect(expirationResult).toBe(false);

      jest.useFakeTimers({ now: tokenExpirationTimestamp - 300_000 });
      expirationResult = await connectionResult.expirationChecker();
      expect(expirationResult).toBe(true);

      jest.useFakeTimers({ now: tokenExpirationTimestamp });
      expirationResult = await connectionResult.expirationChecker();
      expect(expirationResult).toBe(true);
    });

    it('throws an error when Azure token acquisition fails', async () => {
      const { DefaultAzureCredential } = jest.requireMock(
        '@azure/identity',
      ) as jest.Mocked<typeof import('@azure/identity')>;

      DefaultAzureCredential.prototype.getToken.mockResolvedValue(null as any);

      const configResult = await buildPgDatabaseConfig(
        new ConfigReader({
          client: 'pg',
          connection: {
            type: 'azure',
            user: 'some-user@domain.com',
            database: 'other_db',
          },
        }),
      );

      await expect(configResult.connection()).rejects.toThrow(
        'Failed to acquire Azure access token for database authentication',
      );
    });

    it('uses the correct config when using cloudsql', async () => {
      expect(
        await buildPgDatabaseConfig(
          new ConfigReader({
            client: 'pg',
            connection: {
              type: 'cloudsql',
              user: 'ben@gke.com',
              instance: 'project:region:instance',
              port: 5423,
            },
          }),
          { connection: { database: 'other_db' } },
        ),
      ).toEqual({
        client: 'pg',
        connection: {
          user: 'ben@gke.com',
          port: 5423,
          database: 'other_db',
        },
        pool: { min: 0 },
        useNullAsDefault: true,
      });
    });

    it('should throw with incorrect config', async () => {
      await expect(
        buildPgDatabaseConfig(
          new ConfigReader({
            client: 'pg',
            connection: {
              type: 'cloudsql',
            },
          }),
        ),
      ).rejects.toThrow(/Missing instance connection name for Cloud SQL/);

      await expect(
        buildPgDatabaseConfig(
          new ConfigReader({
            client: 'not-pg',
            connection: {
              type: 'cloudsql',
              instance: 'asd:asd:asd',
            },
          }),
        ),
      ).rejects.toThrow(/Cloud SQL only supports the pg client/);
    });

    it('adds the settings from cloud-sql-connector', async () => {
      const { Connector } = jest.requireMock(
        '@google-cloud/cloud-sql-connector',
      ) as jest.Mocked<typeof import('@google-cloud/cloud-sql-connector')>;

      const mockStream = (): any => {};
      Connector.prototype.getOptions.mockResolvedValue({ stream: mockStream });

      expect(
        await buildPgDatabaseConfig(
          new ConfigReader({
            client: 'pg',
            connection: {
              type: 'cloudsql',
              user: 'ben@gke.com',
              instance: 'project:region:instance',
              port: 5423,
            },
          }),
          { connection: { database: 'other_db' } },
        ),
      ).toEqual({
        client: 'pg',
        connection: {
          user: 'ben@gke.com',
          port: 5423,
          stream: mockStream,
          database: 'other_db',
        },
        pool: { min: 0 },
        useNullAsDefault: true,
      });
    });

    it('passes default settings to cloud-sql-connector', async () => {
      const { Connector } = jest.requireMock(
        '@google-cloud/cloud-sql-connector',
      ) as jest.Mocked<typeof import('@google-cloud/cloud-sql-connector')>;

      const mockStream = (): any => {};
      Connector.prototype.getOptions.mockResolvedValue({ stream: mockStream });

      await buildPgDatabaseConfig(
        new ConfigReader({
          client: 'pg',
          connection: {
            type: 'cloudsql',
            user: 'ben@gke.com',
            instance: 'project:region:instance',
            port: 5423,
          },
        }),
        { connection: { database: 'other_db' } },
      );

      expect(Connector.prototype.getOptions).toHaveBeenCalledWith({
        authType: 'IAM',
        instanceConnectionName: 'project:region:instance',
        ipType: 'PUBLIC',
      });
    });

    it('passes configured ipType to connector.getOptions', async () => {
      const { Connector } = jest.requireMock(
        '@google-cloud/cloud-sql-connector',
      ) as jest.Mocked<typeof import('@google-cloud/cloud-sql-connector')>;

      const mockStream = (): any => {};
      Connector.prototype.getOptions.mockResolvedValue({ stream: mockStream });

      await buildPgDatabaseConfig(
        new ConfigReader({
          client: 'pg',
          connection: {
            type: 'cloudsql',
            instance: 'proj:region:inst',
            ipAddressType: 'PUBLIC',
          },
        }),
      );

      expect(Connector.prototype.getOptions).toHaveBeenCalledWith({
        authType: 'IAM',
        instanceConnectionName: 'proj:region:inst',
        ipType: 'PUBLIC',
      });
    });

    it('throws when connection.ipAddressType is invalid', async () => {
      await expect(
        buildPgDatabaseConfig(
          new ConfigReader({
            client: 'pg',
            connection: {
              type: 'cloudsql',
              instance: 'proj:region:inst',
              ipAddressType: 'INVALID',
            },
          }),
        ),
      ).rejects.toThrow(/Invalid connection.ipAddressType/);
    });

    it('passes ip settings to cloud-sql-connector', async () => {
      const { Connector } = jest.requireMock(
        '@google-cloud/cloud-sql-connector',
      ) as jest.Mocked<typeof import('@google-cloud/cloud-sql-connector')>;

      const mockStream = (): any => {};
      Connector.prototype.getOptions.mockResolvedValue({ stream: mockStream });

      await buildPgDatabaseConfig(
        new ConfigReader({
          client: 'pg',
          connection: {
            type: 'cloudsql',
            user: 'ben@gke.com',
            instance: 'project:region:instance',
            ipAddressType: 'PRIVATE',
            port: 5423,
          },
        }),
        { connection: { database: 'other_db' } },
      );

      expect(Connector.prototype.getOptions).toHaveBeenCalledWith({
        authType: 'IAM',
        instanceConnectionName: 'project:region:instance',
        ipType: 'PRIVATE',
      });
    });

    it('uses the correct config when using rds IAM auth', async () => {
      const { Signer } = jest.requireMock('@aws-sdk/rds-signer') as jest.Mocked<
        typeof import('@aws-sdk/rds-signer')
      >;

      Signer.prototype.getAuthToken.mockResolvedValue('mock-iam-token');

      const configResult = await buildPgDatabaseConfig(
        new ConfigReader({
          client: 'pg',
          connection: {
            type: 'rds',
            host: 'mydb.cluster.eu-west-1.rds.amazonaws.com',
            port: 5432,
            user: 'postgres',
            region: 'eu-west-1',
          },
        }),
      );

      expect(Signer).toHaveBeenCalledWith({
        hostname: 'mydb.cluster.eu-west-1.rds.amazonaws.com',
        port: 5432,
        username: 'postgres',
        region: 'eu-west-1',
      });
      expect(configResult).toMatchObject({
        client: 'pg',
        connection: expect.any(Function),
        useNullAsDefault: true,
      });

      const connectionResult = await (
        configResult.connection as () => Promise<any>
      )();

      expect(connectionResult).toMatchObject({
        host: 'mydb.cluster.eu-west-1.rds.amazonaws.com',
        port: 5432,
        user: 'postgres',
        password: 'mock-iam-token',
      });
      expect(connectionResult).not.toHaveProperty('type');
      expect(connectionResult).not.toHaveProperty('region');
    });

    it('generates a fresh IAM token on each connection factory call', async () => {
      const { Signer } = jest.requireMock('@aws-sdk/rds-signer') as jest.Mocked<
        typeof import('@aws-sdk/rds-signer')
      >;

      Signer.prototype.getAuthToken
        .mockResolvedValueOnce('token-1')
        .mockResolvedValueOnce('token-2');

      const configResult = await buildPgDatabaseConfig(
        new ConfigReader({
          client: 'pg',
          connection: {
            type: 'rds',
            host: 'mydb.cluster.eu-west-1.rds.amazonaws.com',
            port: 5432,
            user: 'postgres',
            region: 'eu-west-1',
          },
        }),
      );

      const conn1 = await (configResult.connection as () => Promise<any>)();
      const conn2 = await (configResult.connection as () => Promise<any>)();

      expect(conn1.password).toBe('token-1');
      expect(conn2.password).toBe('token-2');
    });

    it('returns an expirationChecker that reflects the token TTL', async () => {
      const { Signer } = jest.requireMock('@aws-sdk/rds-signer') as jest.Mocked<
        typeof import('@aws-sdk/rds-signer')
      >;

      Signer.prototype.getAuthToken.mockResolvedValue('mock-iam-token');

      const configResult = await buildPgDatabaseConfig(
        new ConfigReader({
          client: 'pg',
          connection: {
            type: 'rds',
            host: 'mydb.cluster.eu-west-1.rds.amazonaws.com',
            port: 5432,
            user: 'postgres',
            region: 'eu-west-1',
          },
        }),
      );

      const conn = await (configResult.connection as () => Promise<any>)();

      expect(conn.expirationChecker).toBeInstanceOf(Function);
      // Token was just issued, so it should not yet be considered expired.
      expect(conn.expirationChecker()).toBe(false);
    });

    it('throws when port is missing for rds connection', async () => {
      await expect(
        buildPgDatabaseConfig(
          new ConfigReader({
            client: 'pg',
            connection: {
              type: 'rds',
              host: 'mydb.cluster.eu-west-1.rds.amazonaws.com',
              user: 'postgres',
              region: 'eu-west-1',
            },
          }),
        ),
      ).rejects.toThrow(/connection\.port/);
    });

    it('falls back to AWS_REGION env var when region is not set in config', async () => {
      const { Signer } = jest.requireMock('@aws-sdk/rds-signer') as jest.Mocked<
        typeof import('@aws-sdk/rds-signer')
      >;

      Signer.prototype.getAuthToken.mockResolvedValue('mock-iam-token');

      const originalRegion = process.env.AWS_REGION;
      process.env.AWS_REGION = 'us-east-1';

      try {
        await buildPgDatabaseConfig(
          new ConfigReader({
            client: 'pg',
            connection: {
              type: 'rds',
              host: 'mydb.cluster.us-east-1.rds.amazonaws.com',
              port: 5432,
              user: 'postgres',
            },
          }),
        );

        expect(Signer).toHaveBeenCalledWith(
          expect.objectContaining({ region: 'us-east-1' }),
        );
      } finally {
        if (originalRegion === undefined) {
          delete process.env.AWS_REGION;
        } else {
          process.env.AWS_REGION = originalRegion;
        }
      }
    });

    it('throws when host is missing for rds connection', async () => {
      await expect(
        buildPgDatabaseConfig(
          new ConfigReader({
            client: 'pg',
            connection: {
              type: 'rds',
              port: 5432,
              user: 'postgres',
              region: 'eu-west-1',
            },
          }),
        ),
      ).rejects.toThrow(/connection\.host/);
    });

    it('throws when user is missing for rds connection', async () => {
      await expect(
        buildPgDatabaseConfig(
          new ConfigReader({
            client: 'pg',
            connection: {
              type: 'rds',
              host: 'mydb.cluster.eu-west-1.rds.amazonaws.com',
              port: 5432,
              region: 'eu-west-1',
            },
          }),
        ),
      ).rejects.toThrow(/connection\.user/);
    });

    it('throws when region is missing and no env var is set for rds connection', async () => {
      const originalRegion = process.env.AWS_REGION;
      const originalDefaultRegion = process.env.AWS_DEFAULT_REGION;
      delete process.env.AWS_REGION;
      delete process.env.AWS_DEFAULT_REGION;

      try {
        await expect(
          buildPgDatabaseConfig(
            new ConfigReader({
              client: 'pg',
              connection: {
                type: 'rds',
                host: 'mydb.cluster.eu-west-1.rds.amazonaws.com',
                port: 5432,
                user: 'postgres',
              },
            }),
          ),
        ).rejects.toThrow(/Missing region for AWS RDS IAM auth/);
      } finally {
        if (originalRegion !== undefined) {
          process.env.AWS_REGION = originalRegion;
        }
        if (originalDefaultRegion !== undefined) {
          process.env.AWS_DEFAULT_REGION = originalDefaultRegion;
        }
      }
    });

    it('throws an error when the connection type is not supported', async () => {
      await expect(
        buildPgDatabaseConfig(
          new ConfigReader({
            client: 'pg',
            connection: {
              type: 'not-supported',
            },
          }),
        ),
      ).rejects.toThrow('Unknown connection type: not-supported');
    });

    it('supports default as the default connection type', async () => {
      await expect(
        buildPgDatabaseConfig(
          new ConfigReader({
            client: 'pg',
            connection: {
              type: 'default',
              port: '5432',
              database: 'other_db',
            },
          }),
        ),
      ).resolves.toEqual({
        client: 'pg',
        connection: {
          port: '5432',
          database: 'other_db',
        },
        pool: { min: 0 },
        useNullAsDefault: true,
      });
    });
  });

  describe('PgConnector', () => {
    const createConnectorConfig = () =>
      new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost' },
        plugin: {
          plugin1: { connection: { database: 'shared' } },
          plugin2: { connection: { database: 'shared' } },
        },
      });

    it('shares database existence checks between plugins', async () => {
      const ensureDatabaseExists = jest.fn().mockResolvedValue(undefined);
      const connector = new PgConnector(
        createConnectorConfig(),
        'backstage_plugin_',
        { ensureDatabaseExists },
      );

      const clients = await Promise.all([
        connector.getClient('plugin1', deps),
        connector.getClient('plugin2', deps),
      ]);

      expect(ensureDatabaseExists).toHaveBeenCalledTimes(1);
      expect(ensureDatabaseExists).toHaveBeenCalledWith(
        expect.any(ConfigReader),
        'shared',
      );

      await Promise.all(clients.map(client => client.destroy()));
    });

    it('retries a database existence check after failure', async () => {
      const ensureDatabaseExists = jest
        .fn()
        .mockRejectedValueOnce(new Error('temporary failure'))
        .mockResolvedValueOnce(undefined);
      const connector = new PgConnector(
        createConnectorConfig(),
        'backstage_plugin_',
        { ensureDatabaseExists },
      );

      await expect(connector.getClient('plugin1', deps)).rejects.toThrow(
        "Failed to connect to the database to make sure that 'shared' exists, Error: temporary failure",
      );

      const client = await connector.getClient('plugin2', deps);
      expect(ensureDatabaseExists).toHaveBeenCalledTimes(2);
      await client.destroy();
    });

    it('shares an admin client between checks for distinct databases', async () => {
      const count = jest.fn().mockResolvedValue([{ count: '1' }]);
      const where = jest.fn().mockReturnValue({ count });
      const admin = {
        from: jest.fn().mockReturnValue({ where }),
        destroy: jest.fn().mockResolvedValue(undefined),
      } as unknown as Knex;
      const createAdminClient = jest.fn().mockResolvedValue(admin);
      const connector = new PgConnector(
        new ConfigReader({
          client: 'pg',
          connection: { host: 'localhost' },
          plugin: {
            plugin1: { connection: { database: 'database1' } },
            plugin2: { connection: { database: 'database2' } },
          },
        }),
        'backstage_plugin_',
        { createAdminClient, adminPoolIdleTimeoutMillis: 10_000 },
      );

      const clients = await Promise.all([
        connector.getClient('plugin1', deps),
        connector.getClient('plugin2', deps),
      ]);

      expect(createAdminClient).toHaveBeenCalledTimes(1);
      expect(admin.from).toHaveBeenCalledTimes(2);
      await (connector as any).shutdown();
      expect(admin.destroy).toHaveBeenCalledTimes(1);
      await Promise.all(clients.map(client => client.destroy()));
    });

    it('shares an admin client between schema creation operations', async () => {
      const admin = {
        raw: jest.fn().mockResolvedValue(undefined),
        destroy: jest.fn().mockResolvedValue(undefined),
      } as unknown as Knex;
      const createAdminClient = jest.fn().mockResolvedValue(admin);
      const connector = new PgConnector(
        new ConfigReader({
          client: 'pg',
          connection: { host: 'localhost', database: 'shared' },
          pluginDivisionMode: 'schema',
          ensureExists: false,
          ensureSchemaExists: true,
        }),
        'backstage_plugin_',
        { createAdminClient, adminPoolIdleTimeoutMillis: 10_000 },
      );

      const clients = await Promise.all([
        connector.getClient('plugin1', deps),
        connector.getClient('plugin2', deps),
      ]);

      expect(createAdminClient).toHaveBeenCalledTimes(1);
      expect(admin.raw).toHaveBeenNthCalledWith(
        1,
        'CREATE SCHEMA IF NOT EXISTS ??',
        ['plugin1'],
      );
      expect(admin.raw).toHaveBeenNthCalledWith(
        2,
        'CREATE SCHEMA IF NOT EXISTS ??',
        ['plugin2'],
      );
      await connector.shutdown();
      expect(admin.destroy).toHaveBeenCalledTimes(1);
      await Promise.all(clients.map(client => client.destroy()));
    });

    it('recreates the admin client when a database operation and cleanup fail', async () => {
      const firstAdmin = {
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            count: jest.fn().mockRejectedValue(new Error('connection failed')),
          }),
        }),
        destroy: jest.fn().mockRejectedValue(new Error('destroy failed')),
      } as unknown as Knex;
      const secondAdmin = {
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            count: jest.fn().mockResolvedValue([{ count: '1' }]),
          }),
        }),
        destroy: jest.fn().mockResolvedValue(undefined),
      } as unknown as Knex;
      const createAdminClient = jest
        .fn()
        .mockResolvedValueOnce(firstAdmin)
        .mockResolvedValueOnce(secondAdmin);
      const connector = new PgConnector(
        new ConfigReader({
          client: 'pg',
          connection: { host: 'localhost' },
          plugin: { plugin1: { connection: { database: 'database1' } } },
        }),
        'backstage_plugin_',
        { createAdminClient },
      );

      const client = await connector.getClient('plugin1', deps);

      expect(createAdminClient).toHaveBeenCalledTimes(2);
      expect(firstAdmin.destroy).toHaveBeenCalledTimes(1);
      await expect(connector.shutdown()).rejects.toThrow(
        'Failed to destroy PostgreSQL admin pool clients',
      );
      await client.destroy();
    });

    it('preserves the database operation error when cleanup also fails', async () => {
      const operationError = new Error('connection failed');
      const createAdminClient = jest.fn().mockImplementation(async () => {
        return {
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
              count: jest.fn().mockRejectedValue(operationError),
            }),
          }),
          destroy: jest.fn().mockRejectedValue(new Error('destroy failed')),
        } as unknown as Knex;
      });
      const connector = new PgConnector(
        new ConfigReader({
          client: 'pg',
          connection: { host: 'localhost' },
          plugin: { plugin1: { connection: { database: 'database1' } } },
        }),
        'backstage_plugin_',
        { createAdminClient },
      );

      await expect(connector.getClient('plugin1', deps)).rejects.toThrow(
        "Failed to connect to the database to make sure that 'database1' exists, Error: connection failed",
      );
      expect(createAdminClient).toHaveBeenCalledTimes(3);
      await expect(connector.shutdown()).rejects.toThrow(
        'Failed to destroy PostgreSQL admin pool clients',
      );
    });

    it('waits for both admin pools to shut down before reporting failure', async () => {
      let releaseSchemaDestroy!: () => void;
      const schemaDestroyBlocker = new Promise<void>(resolve => {
        releaseSchemaDestroy = resolve;
      });
      const databaseAdmin = {
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            count: jest.fn().mockResolvedValue([{ count: '1' }]),
          }),
        }),
        destroy: jest.fn().mockRejectedValue(new Error('destroy failed')),
      } as unknown as Knex;
      const schemaAdmin = {
        raw: jest.fn().mockResolvedValue(undefined),
        destroy: jest.fn().mockReturnValue(schemaDestroyBlocker),
      } as unknown as Knex;
      const createAdminClient = jest
        .fn()
        .mockResolvedValueOnce(databaseAdmin)
        .mockResolvedValueOnce(schemaAdmin);
      const connector = new PgConnector(
        new ConfigReader({
          client: 'pg',
          connection: { host: 'localhost', database: 'shared' },
          pluginDivisionMode: 'schema',
          ensureSchemaExists: true,
        }),
        'backstage_plugin_',
        { createAdminClient },
      );
      const client = await connector.getClient('plugin1', deps);

      const shutdownSettled = jest.fn();
      const shutdown = connector.shutdown().then(
        () => shutdownSettled(),
        error => shutdownSettled(error),
      );
      for (let i = 0; i < 10; i++) {
        await Promise.resolve();
      }
      expect(shutdownSettled).not.toHaveBeenCalled();

      releaseSchemaDestroy();
      await shutdown;
      expect(shutdownSettled).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Failed to destroy PostgreSQL admin pool clients',
        }),
      );
      await client.destroy();
    });
  });

  describe('getPgConnectionConfig', () => {
    it('returns the connection object back', () => {
      const mockConnection = createMockConnection();
      const config = createConfig(mockConnection);

      expect(getPgConnectionConfig(config)).toEqual(mockConnection);
    });

    it('does not parse the connection string', () => {
      const mockConnection = createMockConnection();
      const config = createConfig(mockConnection);

      expect(getPgConnectionConfig(config, true)).toEqual(mockConnection);
    });

    it('automatically parses the connection string', () => {
      const mockConnection = createMockConnection();
      const mockConnectionString = createMockConnectionString();
      const config = createConfig(mockConnectionString);

      expect(getPgConnectionConfig(config)).toEqual({
        ...mockConnection,
        port: '5432',
      });
    });

    it('parses the connection string', () => {
      const mockConnection = createMockConnection();
      const mockConnectionString = createMockConnectionString();
      const config = createConfig(mockConnectionString);

      expect(getPgConnectionConfig(config, true)).toEqual({
        ...mockConnection,
        port: '5432',
      });
    });
  });

  describe('createPgDatabaseClient', () => {
    it('creates a postgres knex instance', async () => {
      expect(
        await createPgDatabaseClient(
          createConfig({
            host: 'acme',
            user: 'foo',
            password: 'bar',
            database: 'foodb',
          }),
        ),
      ).toBeTruthy();
    });

    it('attempts to read an ssl cert', async () => {
      await expect(() =>
        createPgDatabaseClient(
          createConfig(
            'postgresql://postgres:pass@localhost:5432/dbname?sslrootcert=/path/to/file',
          ),
        ),
      ).rejects.toThrow(/no such file or directory/);
    });
  });

  describe('parsePgConnectionString', () => {
    it('parses a connection string uri', () => {
      expect(
        parsePgConnectionString(
          'postgresql://postgres:pass@foobar:5432/dbname?ssl=true',
        ),
      ).toEqual({
        host: 'foobar',
        user: 'postgres',
        password: 'pass',
        port: '5432',
        database: 'dbname',
        ssl: true,
      });
    });
  });
});

describe('computePgPluginConfig', () => {
  const prefix = 'backstage_plugin_';

  describe('client', () => {
    it('uses base client when no plugin client specified', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost' },
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.client).toBe('pg');
      expect(result.clientOverridden).toBe(false);
    });

    it('uses plugin client when specified', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost' },
        plugin: {
          catalog: {
            client: 'better-sqlite3',
          },
        },
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.client).toBe('better-sqlite3');
      expect(result.clientOverridden).toBe(true);
    });
  });

  describe('role', () => {
    it('returns undefined when no role specified', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost' },
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.role).toBeUndefined();
    });

    it('uses base role when no plugin role specified', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost' },
        role: 'base_role',
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.role).toBe('base_role');
    });

    it('uses plugin role when specified', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost' },
        role: 'base_role',
        plugin: {
          catalog: {
            role: 'plugin_role',
          },
        },
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.role).toBe('plugin_role');
    });
  });

  describe('additionalKnexConfig', () => {
    it('returns empty object when no knexConfig specified', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost' },
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.additionalKnexConfig).toEqual({});
    });

    it('uses base knexConfig when no plugin config', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost' },
        knexConfig: { debug: true },
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.additionalKnexConfig).toEqual({ debug: true });
    });

    it('merges base and plugin knexConfig', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost' },
        knexConfig: { debug: true, pool: { min: 0 } },
        plugin: {
          catalog: {
            knexConfig: { pool: { max: 10 } },
          },
        },
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.additionalKnexConfig).toEqual({
        debug: true,
        pool: { min: 0, max: 10 },
      });
    });
  });

  describe('ensureExists', () => {
    it('defaults to true when not specified', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost' },
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.ensureExists).toBe(true);
    });

    it('uses base ensureExists when no plugin setting', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost' },
        ensureExists: false,
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.ensureExists).toBe(false);
    });

    it('uses plugin ensureExists when specified', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost' },
        ensureExists: true,
        plugin: {
          catalog: {
            ensureExists: false,
          },
        },
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.ensureExists).toBe(false);
    });
  });

  describe('ensureSchemaExists', () => {
    it('defaults to false when not specified', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost' },
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.ensureSchemaExists).toBe(false);
    });

    it('uses base ensureSchemaExists when no plugin setting', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost' },
        ensureSchemaExists: true,
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.ensureSchemaExists).toBe(true);
    });
  });

  describe('pluginDivisionMode', () => {
    it('defaults to database when not specified', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost' },
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.pluginDivisionMode).toBe('database');
    });

    it('uses specified pluginDivisionMode', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost' },
        pluginDivisionMode: 'schema',
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.pluginDivisionMode).toBe('schema');
    });
  });

  describe('connection', () => {
    it('sets application_name to plugin id', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost' },
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.connection).toMatchObject({
        application_name: 'backstage_plugin_catalog',
      });
    });

    it('preserves existing application_name', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost', application_name: 'custom_name' },
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.connection).toMatchObject({
        application_name: 'custom_name',
      });
    });

    it('omits database from base connection when pluginDivisionMode is database', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost', database: 'shared_db' },
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.connection.database).toBeUndefined();
    });

    it('keeps database from base connection when pluginDivisionMode is schema', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost', database: 'shared_db' },
        pluginDivisionMode: 'schema',
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.connection.database).toBe('shared_db');
    });

    it('merges plugin connection with base connection', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost', user: 'base_user' },
        plugin: {
          catalog: {
            connection: { password: 'plugin_pass' },
          },
        },
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.connection).toMatchObject({
        host: 'localhost',
        user: 'base_user',
        password: 'plugin_pass',
      });
    });

    it('excludes base connection when client is overridden', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost', user: 'base_user' },
        plugin: {
          catalog: {
            client: 'better-sqlite3',
            connection: { filename: ':memory:' },
          },
        },
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.connection.host).toBeUndefined();
      expect(result.connection.user).toBeUndefined();
      expect(
        (result.connection as Knex.BetterSqlite3ConnectionConfig).filename,
      ).toBe(':memory:');
    });

    it('parses connection string in base config', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: 'postgresql://user:pass@localhost:5432/mydb',
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.connection).toMatchObject({
        host: 'localhost',
        user: 'user',
        password: 'pass',
        port: '5432',
      });
    });

    it('parses connection string in plugin config', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'base-host' },
        plugin: {
          catalog: {
            connection: 'postgresql://plugin:pass@plugin-host:5432/plugindb',
          },
        },
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.connection).toMatchObject({
        host: 'plugin-host',
        user: 'plugin',
        password: 'pass',
        port: '5432',
      });
    });
  });

  describe('databaseName', () => {
    it('auto-generates database name with prefix in database mode', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost' },
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.databaseName).toBe('backstage_plugin_catalog');
    });

    it('uses connection database when specified in database mode', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost' },
        plugin: {
          catalog: {
            connection: { database: 'custom_db' },
          },
        },
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.databaseName).toBe('custom_db');
    });

    it('uses connection database in schema mode', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost', database: 'shared_db' },
        pluginDivisionMode: 'schema',
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.databaseName).toBe('shared_db');
    });

    it('returns undefined when no database in schema mode', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost' },
        pluginDivisionMode: 'schema',
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.databaseName).toBeUndefined();
    });
  });

  describe('databaseClientOverrides', () => {
    it('sets connection.database when databaseName exists', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost' },
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.databaseClientOverrides).toEqual({
        connection: { database: 'backstage_plugin_catalog' },
      });
    });

    it('adds searchPath when in schema mode', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost', database: 'shared_db' },
        pluginDivisionMode: 'schema',
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.databaseClientOverrides).toEqual({
        connection: { database: 'shared_db' },
        searchPath: ['catalog'],
      });
    });

    it('returns empty object when no databaseName in schema mode', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost' },
        pluginDivisionMode: 'schema',
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.databaseClientOverrides).toEqual({
        searchPath: ['catalog'],
      });
    });
  });

  describe('knexConfig', () => {
    it('includes client and connection', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost' },
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.knexConfig.client).toBe('pg');
      expect(result.knexConfig.connection).toBeDefined();
    });

    it('includes role when specified', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost' },
        role: 'my_role',
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect((result.knexConfig as any).role).toBe('my_role');
    });

    it('does not include role when not specified', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost' },
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect((result.knexConfig as any).role).toBeUndefined();
    });

    it('includes additionalKnexConfig properties', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost' },
        knexConfig: { debug: true, pool: { min: 2 } },
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.knexConfig.debug).toBe(true);
      expect(result.knexConfig.pool).toEqual({ min: 2 });
    });
  });
});
