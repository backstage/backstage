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

import {
  SchedulerService,
  SchedulerServiceTaskRunner,
  SchedulerServiceTaskInvocationDefinition,
} from '@backstage/backend-plugin-api';
import {
  mockServices,
  registerMswTestHooks,
} from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';
import { EntityProviderConnection } from '@backstage/plugin-catalog-node';
import fs from 'fs-extra';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import path from 'path';
import { GerritEntityProvider } from './GerritEntityProvider';

const server = setupServer();

const getJsonFixture = (fileName: string) =>
  JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, `__fixtures__/${fileName}`),
      'utf8',
    ),
  );

class PersistingTaskRunner implements SchedulerServiceTaskRunner {
  private tasks: SchedulerServiceTaskInvocationDefinition[] = [];

  getTasks() {
    return this.tasks;
  }

  run(task: SchedulerServiceTaskInvocationDefinition): Promise<void> {
    this.tasks.push(task);
    return Promise.resolve(undefined);
  }
}

const logger = mockServices.logger.mock();

describe('GerritEntityProvider', () => {
  let schedule: PersistingTaskRunner;

  registerMswTestHooks(server);

  afterEach(() => {
    jest.clearAllMocks();
  });

  const config = mockServices.rootConfig({
    data: {
      catalog: {
        providers: {
          gerrit: {
            'active-training': {
              host: 'g.com',
              query: 'state=ACTIVE&prefix=training',
              branch: 'main',
            },
            'custom-catalog-file': {
              host: 'g.com',
              query: 'state=ACTIVE&prefix=training',
              catalogPath: 'catalog-*.yaml',
              branch: 'main',
            },
            'without-branch': {
              host: 'g.com',
              query: 'state=ACTIVE&prefix=training',
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
    },
  });

  beforeEach(() => {
    schedule = new PersistingTaskRunner();
  });

  const entityProviderConnection: EntityProviderConnection = {
    applyMutation: jest.fn(),
    refresh: jest.fn(),
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

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith(
      expected,
    );
  });

  it('discovers projects from the api with a custom catalog file path.', async () => {
    const repoBuffer = fs.readFileSync(
      path.resolve(__dirname, '__fixtures__/listProjectsBody.txt'),
    );
    const expected = getJsonFixture(
      'expectedProviderEntitiesCustomCatalogFile.json',
    );

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
    })[1];
    expect(provider.getProviderName()).toEqual(
      'gerrit-provider:custom-catalog-file',
    );

    await provider.connect(entityProviderConnection);

    const taskDef = schedule.getTasks()[0];
    expect(taskDef.id).toEqual('gerrit-provider:custom-catalog-file:refresh');
    await (taskDef.fn as () => Promise<void>)();

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith(
      expected,
    );
  });

  it('discovers the default branch when not explicitly configured.', async () => {
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
      rest.get('https://g.com/gerrit/projects/:project/HEAD', (_, res, ctx) =>
        res(
          ctx.status(200),
          ctx.set('Content-Type', 'application/json'),
          ctx.body(`)]}'\n"refs/heads/main"`),
        ),
      ),
    );

    const configWithoutBranch = new ConfigReader({
      catalog: {
        providers: {
          gerrit: {
            'active-training': {
              host: 'g.com',
              query: 'state=ACTIVE&prefix=training',
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

    const provider = GerritEntityProvider.fromConfig(configWithoutBranch, {
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

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith(
      expected,
    );
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
            gitilesBaseUrl: 'https://gerrit1.com/gitiles',
          },
          {
            host: 'gerrit2.com',
            gitilesBaseUrl: 'https://gerrit2.com/gitiles',
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
            gitilesBaseUrl: 'https://gerrit1.com/gitiles',
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

  it('fail without schedule and scheduler', () => {
    expect(() =>
      GerritEntityProvider.fromConfig(config, {
        logger,
      }),
    ).toThrow('Either schedule or scheduler must be provided');
  });

  it('fail with scheduler but no schedule config', () => {
    const scheduler = {
      createScheduledTaskRunner: (_: any) => jest.fn(),
    } as unknown as SchedulerService;
    expect(() =>
      GerritEntityProvider.fromConfig(config, {
        logger,
        scheduler,
      }),
    ).toThrow(
      'No schedule provided neither via code nor config for gerrit-provider:active-training',
    );
  });

  it('discovers projects from the api with schedule in config', async () => {
    const configWithSchedule = new ConfigReader({
      catalog: {
        providers: {
          gerrit: {
            'active-training': {
              host: 'g.com',
              query: 'state=ACTIVE&prefix=training',
              branch: 'main',
              schedule: {
                frequency: 'PT30M',
                timeout: {
                  minutes: 3,
                },
              },
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
    const scheduler = {
      createScheduledTaskRunner: (_: any) => schedule,
    } as unknown as SchedulerService;

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

    const provider = GerritEntityProvider.fromConfig(configWithSchedule, {
      logger,
      scheduler,
    })[0];
    expect(provider.getProviderName()).toEqual(
      'gerrit-provider:active-training',
    );

    await provider.connect(entityProviderConnection);

    const taskDef = schedule.getTasks()[0];
    expect(taskDef.id).toEqual('gerrit-provider:active-training:refresh');
    await (taskDef.fn as () => Promise<void>)();

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith(
      expected,
    );
  });
});
