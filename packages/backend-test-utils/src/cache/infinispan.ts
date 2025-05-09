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

import Keyv from 'keyv';
import { v4 as uuid } from 'uuid';
import { Instance } from './types';
import { InfinispanKeyvStore } from '@backstage/backend-defaults/cache';
import infinispan from 'infinispan';
import { mockServices } from '@backstage/backend-test-utils';
import { resolvePackagePath } from '@backstage/backend-plugin-api';

async function attemptInfinispanConnection(connection: string): Promise<Keyv> {
  const startTime = Date.now();
  const [host, portStr] = connection.split(':');
  const port = parseInt(portStr, 10);
  const logger = mockServices.logger.mock();

  logger.info('Attempting to connect to Infinispan...', { host, port });

  for (;;) {
    try {
      logger.debug('Creating Infinispan client...');
      const clientPromise = infinispan.client(
        { host, port },
        {
          authentication: {
            enabled: true,
            saslMechanism: 'DIGEST-MD5',
            userName: 'admin',
            password: 'admin',
            serverName: 'infinispan',
          },
        },
      );
      logger.debug('Creating InfinispanKeyvStore...');
      const store = new InfinispanKeyvStore({
        clientPromise,
        logger: mockServices.logger.mock(),
      });
      const keyv = new Keyv({ store });
      const value = uuid();
      logger.debug('Testing connection with test value...', { value });
      await keyv.set('test', value);
      const retrieved = await keyv.get('test');
      if (retrieved === value) {
        logger.info('Successfully connected to Infinispan!');
        return keyv;
      }
      logger.warn('Test value mismatch, retrying...', {
        expected: value,
        got: retrieved,
      });
    } catch (e) {
      const elapsed = Date.now() - startTime;
      logger.warn('Connection attempt failed, retrying...', {
        error: e instanceof Error ? e.message : String(e),
        elapsedMs: elapsed,
      });
      if (elapsed > 60_000) {
        // Increase timeout to 60 seconds
        throw new Error(
          `Timed out waiting for infinispan to be ready for connections after ${elapsed}ms: ${e}`,
        );
      }
    }

    await new Promise(resolve => setTimeout(resolve, 1000)); // Increase retry interval to 1 second
  }
}

export async function connectToExternalInfinispan(
  connection: string,
): Promise<Instance> {
  const keyv = await attemptInfinispanConnection(connection);
  return {
    store: 'infinispan',
    connection,
    keyv,
    stop: async () => await keyv.disconnect(),
  };
}

export async function startInfinispanContainer(
  image: string,
): Promise<Instance> {
  // Lazy-load to avoid side-effect of importing testcontainers
  const { GenericContainer, Wait } =
    require('testcontainers') as typeof import('testcontainers');

  const logger = mockServices.logger.mock();
  logger.info('Starting Infinispan container...', { image });

  const container = await new GenericContainer(
    'infinispan/server:15.2.1.Final-1',
  )
    .withExposedPorts(11222)
    .withEnvironment({
      USER: 'admin',
      PASS: 'admin',
      CONFIG_PATH: '/opt/infinispan/server/conf/infinispan.xml',
      SERVER_NAME: 'infinispan',
      JAVA_OPTIONS:
        '-Dinfinispan.server.config.dir=/opt/infinispan/server/conf -Dinfinispan.server.log.level=DEBUG -Dinfinispan.server.bind.address=0.0.0.0',
    })
    .withCopyFilesToContainer([
      {
        source: resolvePackagePath(
          '@backstage/backend-test-utils',
          'src/cache/infinispan.xml',
        ),
        target: '/opt/infinispan/server/conf/infinispan.xml',
      },
      {
        source: resolvePackagePath(
          '@backstage/backend-test-utils',
          'src/cache/users.properties',
        ),
        target: '/opt/infinispan/server/conf/users.properties',
      },
      {
        source: resolvePackagePath(
          '@backstage/backend-test-utils',
          'src/cache/groups.properties',
        ),
        target: '/opt/infinispan/server/conf/groups.properties',
      },
    ])
    .withWaitStrategy(
      Wait.forLogMessage('ISPN080001').withStartupTimeout(120000),
    )
    .withStartupTimeout(120000)
    .withLogConsumer(stream => {
      stream.on('data', line => {
        const logLine = line.toString();
        logger.info('Container log:', { line: logLine });
        if (logLine.includes('error') || logLine.includes('exception')) {
          logger.error('Container error:', { line: logLine });
        }
        // Log specific startup messages
        if (logLine.includes('ISPN080001')) {
          logger.info('Infinispan server started message detected');
        }
        if (logLine.includes('ISPN080002')) {
          logger.info('Infinispan server listening message detected');
        }
        if (logLine.includes('HotRod')) {
          logger.info('HotRod protocol message:', { line: logLine });
        }
        if (logLine.includes('bind')) {
          logger.info('Binding message:', { line: logLine });
        }
      });
    });

  try {
    logger.info('Starting container...');
    const startedContainer = await container.start();
    logger.info('Container started successfully');

    // Wait a bit to ensure the server is fully started
    await new Promise(resolve => setTimeout(resolve, 5000));

    const host = startedContainer.getHost();
    const port = startedContainer.getMappedPort(11222);
    const connection = `${host}:${port}`;

    logger.info('Container connection details:', { host, port, connection });

    logger.info('Creating Infinispan client...');
    const clientPromise = infinispan.client(
      { host, port },
      {
        authentication: {
          enabled: true,
          saslMechanism: 'DIGEST-MD5',
          userName: 'admin',
          password: 'admin',
          serverName: 'infinispan',
        },
        cacheName: 'backstage',
        version: '2.9',
      },
    );

    logger.info('Waiting for client connection...');
    const client = await clientPromise;
    logger.info('Client connected successfully');

    logger.info('Creating InfinispanKeyvStore...');
    const store = new InfinispanKeyvStore({
      clientPromise: Promise.resolve(client),
      logger: mockServices.logger.mock(),
    });
    const keyv = new Keyv({ store });

    // Test the connection
    logger.info('Testing connection with a test value...');
    const testValue = 'test-value';
    await keyv.set('test-key', testValue);
    const retrievedValue = await keyv.get('test-key');
    logger.info('Connection test result:', {
      testValue,
      retrievedValue,
      success: testValue === retrievedValue,
    });

    return {
      store: 'infinispan',
      connection,
      keyv,
      stop: async () => {
        logger.info('Stopping Infinispan container...');
        await keyv.disconnect();
        await startedContainer.stop({ timeout: 5000 });
        logger.info('Container stopped successfully');
      },
    };
  } catch (error) {
    logger.error('Failed to start Infinispan container:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
}
