/*
 * Copyright 2021 The Backstage Authors
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
import { DatabaseManagerImpl } from './DatabaseManager';
import { Connector } from './types';

describe('DatabaseManagerImpl', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls the right connector, only once per plugin id', async () => {
    const connector1 = {
      getClient: jest.fn(),
      dropDatabase: jest.fn(),
    } satisfies Connector;
    const connector2 = {
      getClient: jest.fn(),
      dropDatabase: jest.fn(),
    } satisfies Connector;

    const impl = new DatabaseManagerImpl(
      new ConfigReader({
        client: 'pg',
      }),
      {
        pg: connector1,
        notpg: connector2,
      },
    );

    await impl.forPlugin('plugin1').getClient();
    expect(connector1.getClient).toHaveBeenCalledTimes(1);
    expect(connector1.getClient).toHaveBeenLastCalledWith('plugin1', undefined);
    expect(connector2.getClient).toHaveBeenCalledTimes(0);

    await impl.forPlugin('plugin1').getClient();
    expect(connector1.getClient).toHaveBeenCalledTimes(1);
    expect(connector1.getClient).toHaveBeenLastCalledWith('plugin1', undefined);
    expect(connector2.getClient).toHaveBeenCalledTimes(0);

    await impl.forPlugin('plugin2').getClient();
    expect(connector1.getClient).toHaveBeenCalledTimes(2);
    expect(connector1.getClient).toHaveBeenLastCalledWith('plugin2', undefined);
    expect(connector2.getClient).toHaveBeenCalledTimes(0);
  });

  it('respects per-plugin overridden connectors', async () => {
    const connector1 = {
      getClient: jest.fn(),
      dropDatabase: jest.fn(),
    } satisfies Connector;
    const connector2 = {
      getClient: jest.fn(),
      dropDatabase: jest.fn(),
    } satisfies Connector;

    const impl = new DatabaseManagerImpl(
      new ConfigReader({
        client: 'pg',
        plugin: {
          plugin2: {
            client: 'mysql',
          },
        },
      }),
      {
        pg: connector1,
        mysql: connector2,
      },
    );

    await impl.forPlugin('plugin1').getClient();
    expect(connector1.getClient).toHaveBeenCalledTimes(1);
    expect(connector1.getClient).toHaveBeenLastCalledWith('plugin1', undefined);
    expect(connector2.getClient).toHaveBeenCalledTimes(0);

    await impl.forPlugin('plugin2').getClient();
    expect(connector1.getClient).toHaveBeenCalledTimes(1);
    expect(connector1.getClient).toHaveBeenLastCalledWith('plugin1', undefined);
    expect(connector2.getClient).toHaveBeenCalledTimes(1);
    expect(connector2.getClient).toHaveBeenLastCalledWith('plugin2', undefined);
  });

  it('retains the migration skip info', async () => {
    const connector = {
      getClient: jest.fn(),
      dropDatabase: jest.fn(),
    } satisfies Connector;

    const impl1 = new DatabaseManagerImpl(new ConfigReader({ client: 'pg' }), {
      pg: connector,
    });

    const impl2 = new DatabaseManagerImpl(
      new ConfigReader({
        client: 'pg',
        backend: {
          database: { plugin: { plugin1: { skipMigrations: true } } },
        },
      }),
      {
        pg: connector,
      },
    );

    expect((await impl1.forPlugin('plugin1')).migrations).toEqual({
      skip: false,
    });

    expect((await impl2.forPlugin('plugin1')).migrations).toEqual({
      skip: true,
    });

    const impl3 = new DatabaseManagerImpl(
      new ConfigReader({
        client: 'pg',
        backend: {
          database: {
            skipMigrations: true,
            plugin: { plugin1: { skipMigrations: false } },
          },
        },
      }),
      {
        pg: connector,
      },
    );
    expect((await impl3.forPlugin('plugin1')).migrations).toEqual({
      skip: true,
    });
  });
});
