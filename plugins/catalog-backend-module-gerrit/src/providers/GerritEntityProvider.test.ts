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

import { getVoidLogger } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { TaskInvocationDefinition, TaskRunner } from '@backstage/backend-tasks';
import { setupRequestMockHandlers } from '@backstage/backend-test-utils';
import { EntityProviderConnection } from '@backstage/plugin-catalog-backend';
import { rest } from 'msw';
import fs from 'fs-extra';
import path from 'path';
import { setupServer } from 'msw/node';
import { GerritEntityProvider } from './GerritEntityProvider';

const server = setupServer();

const getJsonFixture = (fileName: string) =>
  JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, `__fixtures__/${fileName}`),
      'utf8',
    ),
  );

class PersistingTaskRunner implements TaskRunner {
  private tasks: TaskInvocationDefinition[] = [];

  getTasks() {
    return this.tasks;
  }

  run(task: TaskInvocationDefinition): Promise<void> {
    this.tasks.push(task);
    return Promise.resolve(undefined);
  }
}

const logger = getVoidLogger();

describe('GerritEntityProvider', () => {
  setupRequestMockHandlers(server);

  afterEach(() => {
    jest.resetAllMocks();
  });

  const config = new ConfigReader({
    catalog: {
      providers: {
        gerrit: {
          'active-training': {
            host: 'g.com',
            query: 'state=ACTIVE&prefix=training',
            branch: 'main',
          },
        },
      },
    },
    integrations: {
      gerrit: [
        {
          host: 'g.com',
          baseUrl: 'https://g.com/gerrit',
          gitilesBaseUrl: 'https:/g.com/gitiles',
        },
      ],
    },
  });
  const schedule = new PersistingTaskRunner();

  const entityProviderConnection: EntityProviderConnection = {
    applyMutation: jest.fn(),
  };

  it('discovers projects from the api.', async () => {
    const repoBuffer = fs.readFileSync(
      path.resolve(__dirname, '__fixtures__/listProjectsBody.txt'),
    );
    const expected = getJsonFixture('expectedProviderEntities.json');

    server.use(
      rest.get('https://g.com/gerrit/projects/', (_, res, ctx) =>
        res(
          ctx.status(200),
          ctx.set('Content-Type', 'application/json'),
          ctx.body(repoBuffer),
        ),
      ),
    );

    const provider = GerritEntityProvider.fromConfig(config, {
      logger,
      schedule,
    })[0];
    expect(provider.getProviderName()).toEqual(
      'gerrit-provider:active-training',
    );

    await provider.connect(entityProviderConnection);

    const taskDef = schedule.getTasks()[0];
    expect(taskDef.id).toEqual('gerrit-provider:active-training:refresh');
    await (taskDef.fn as () => Promise<void>)();

    expect(entityProviderConnection.applyMutation).toBeCalledWith(expected);
  });

  it('handles api errors.', async () => {
    const provider = GerritEntityProvider.fromConfig(config, {
      logger,
      schedule,
    })[0];

    server.use(
      rest.get('https://g.com/gerrit/projects/', (_, res, ctx) =>
        res(ctx.status(500, 'Error!.')),
      ),
    );

    await provider.connect(entityProviderConnection);
    const taskDef = schedule.getTasks()[0];

    await (taskDef.fn as () => Promise<void>)();
    expect(entityProviderConnection.applyMutation).not.toHaveBeenCalled();
  });

  it('can create multiple providers from config.', async () => {
    const configTwoProviders = new ConfigReader({
      catalog: {
        providers: {
          gerrit: {
            'active-g1': {
              host: 'gerrit1.com',
              query: 'state=ACTIVE',
            },
            'active-g2': {
              host: 'gerrit2.com',
              query: 'state=ACTIVE',
            },
          },
        },
      },
      integrations: {
        gerrit: [
          {
            host: 'gerrit1.com',
          },
          {
            host: 'gerrit2.com',
          },
        ],
      },
    });

    const providers = GerritEntityProvider.fromConfig(configTwoProviders, {
      logger,
      schedule,
    });
    expect(providers).toHaveLength(2);
    expect(providers[0]).toBeInstanceOf(GerritEntityProvider);
    expect(providers[0].getProviderName()).toEqual('gerrit-provider:active-g1');
    expect(providers[1]).toBeInstanceOf(GerritEntityProvider);
    expect(providers[1].getProviderName()).toEqual('gerrit-provider:active-g2');
  });

  it('throws if integration is missing.', () => {
    const configMissingIntegration = new ConfigReader({
      catalog: {
        providers: {
          gerrit: {
            'active-g2': {
              host: 'gerrit2.com',
              query: 'state=ACTIVE',
            },
          },
        },
      },
      integrations: {
        gerrit: [
          {
            host: 'gerrit1.com',
          },
        ],
      },
    });

    expect(() =>
      GerritEntityProvider.fromConfig(configMissingIntegration, {
        logger,
        schedule,
      }),
    ).toThrow(/No gerrit integration/);
  });
});
