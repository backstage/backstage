/*
 * Copyright 2022 The Backstage Authors
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
import { buildTechInsightsContext } from './techInsightsContextBuilder';
import {
  DatabaseManager,
  getVoidLogger,
  PluginDatabaseManager,
  ServerTokenManager,
} from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { TaskScheduler } from '@backstage/backend-tasks';
import { DefaultFactRetrieverRegistry } from './fact/FactRetrieverRegistry';
import { Knex } from 'knex';

jest.mock('./fact/FactRetrieverRegistry');
jest.mock('./fact/FactRetrieverEngine', () => ({
  DefaultFactRetrieverEngine: {
    create: jest.fn().mockResolvedValue({
      schedule: jest.fn(),
    }),
  },
}));

describe('buildTechInsightsContext', () => {
  const pluginDatabase: PluginDatabaseManager = {
    getClient: () => {
      return Promise.resolve({
        migrate: {
          latest: () => {},
        },
      }) as unknown as Promise<Knex>;
    },
  };
  const databaseManager: Partial<DatabaseManager> = {
    forPlugin: () => pluginDatabase,
  };
  const manager = databaseManager as DatabaseManager;
  const discoveryMock = {
    getBaseUrl: (_: string) => Promise.resolve('http://mock.url'),
    getExternalBaseUrl: (_: string) => Promise.resolve('http://mock.url'),
  };
  const scheduler = new TaskScheduler(manager, getVoidLogger()).forPlugin(
    'tech-insights',
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('constructs the default FactRetrieverRegistry if factRetrievers but no factRetrieverRegistry are passed', () => {
    buildTechInsightsContext({
      database: pluginDatabase,
      logger: getVoidLogger(),
      factRetrievers: [],
      scheduler: scheduler,
      config: ConfigReader.fromConfigs([]),
      discovery: discoveryMock,
      tokenManager: ServerTokenManager.noop(),
    });
    expect(DefaultFactRetrieverRegistry).toHaveBeenCalledTimes(1);
  });

  it('uses factRetrieverRegistry implementation instead of the default FactRetrieverRegistry if it is passed in', () => {
    const factRetrieverRegistryMock = {} as DefaultFactRetrieverRegistry;

    buildTechInsightsContext({
      database: pluginDatabase,
      logger: getVoidLogger(),
      factRetrievers: [],
      factRetrieverRegistry: factRetrieverRegistryMock,
      scheduler: scheduler,
      config: ConfigReader.fromConfigs([]),
      discovery: discoveryMock,
      tokenManager: ServerTokenManager.noop(),
    });
    expect(DefaultFactRetrieverRegistry).not.toHaveBeenCalled();
  });
});
