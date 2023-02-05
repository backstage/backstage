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

import { TaskInvocationDefinition, TaskRunner } from '@backstage/backend-tasks';
import { ConfigReader } from '@backstage/config';
import { getVoidLogger } from '@backstage/backend-common';
import { PuppetDBEntityProvider } from './PuppetDBEntityProvider';
import { EntityProviderConnection } from '@backstage/plugin-catalog-backend';
import * as p from '../puppet/read';
import { DEFAULT_OWNER } from './constants';
import { ANNOTATION_PUPPET_CERTNAME } from '../puppet';
import {
  ANNOTATION_LOCATION,
  ANNOTATION_ORIGIN_LOCATION,
} from '@backstage/catalog-model/';
import { ENDPOINT_NODES } from '../puppet/constants';

const logger = getVoidLogger();

jest.mock('../puppet/read', () => ({
  __esModule: true,
  default: jest.fn(),
  readPuppetNodes: null,
}));

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

describe('PuppetEntityProvider', () => {
  const config = new ConfigReader({
    catalog: {
      providers: {
        puppetdb: {
          host: 'http://puppetdb:8080',
          schedule: {
            frequency: {
              minutes: 10,
            },
            timeout: {
              minutes: 10,
            },
          },
        },
      },
    },
  });

  describe('where there are no nodes', () => {
    beforeEach(() => {
      // @ts-ignore
      p.readPuppetNodes = jest.fn().mockResolvedValue([]);
    });

    it('creates no entities', async () => {
      const connection: EntityProviderConnection = {
        applyMutation: jest.fn(),
        refresh: jest.fn(),
      };
      const providers = PuppetDBEntityProvider.fromConfig(config, {
        logger,
        schedule: new PersistingTaskRunner(),
      });

      await providers[0].connect(connection);
      await providers[0].refresh(logger);

      expect(connection.applyMutation).toHaveBeenCalledWith({
        type: 'full',
        entities: [],
      });
    });
  });

  describe('where there are nodes', () => {
    beforeEach(() => {
      // @ts-ignore
      p.readPuppetNodes = jest.fn().mockResolvedValue([
        {
          api_version: 'backstage.io/v1beta1',
          kind: 'Resource',
          metadata: {
            name: 'node1',
            namespace: 'default',
            annotations: {
              [ANNOTATION_PUPPET_CERTNAME]: 'node1',
            },
            tags: ['windows'],
            description: 'Description 1',
            spec: {
              type: 'virtual-machine',
              owner: DEFAULT_OWNER,
              dependsOn: [],
              dependencyOf: [],
            },
          },
        },
        {
          api_version: 'backstage.io/v1beta1',
          kind: 'Resource',
          metadata: {
            name: 'node2',
            namespace: 'default',
            annotations: {
              [ANNOTATION_PUPPET_CERTNAME]: 'node2',
            },
            tags: ['linux'],
            description: 'Description 2',
            spec: {
              type: 'physical-server',
              owner: DEFAULT_OWNER,
              dependsOn: [],
              dependencyOf: [],
            },
          },
        },
      ]);
    });

    it('creates entities', async () => {
      const connection: EntityProviderConnection = {
        applyMutation: jest.fn(),
        refresh: jest.fn(),
      };
      const providers = PuppetDBEntityProvider.fromConfig(config, {
        logger,
        schedule: new PersistingTaskRunner(),
      });

      await providers[0].connect(connection);
      await providers[0].refresh(logger);

      expect(connection.applyMutation).toHaveBeenCalledWith({
        type: 'full',
        entities: [
          {
            locationKey: providers[0].getProviderName(),
            entity: {
              api_version: 'backstage.io/v1beta1',
              kind: 'Resource',
              metadata: {
                name: 'node1',
                namespace: 'default',
                annotations: {
                  [ANNOTATION_PUPPET_CERTNAME]: 'node1',
                  [ANNOTATION_LOCATION]: `url:${config.getString(
                    'catalog.providers.puppetdb.host',
                  )}${ENDPOINT_NODES}/node1`,
                  [ANNOTATION_ORIGIN_LOCATION]: `url:${config.getString(
                    'catalog.providers.puppetdb.host',
                  )}${ENDPOINT_NODES}/node1`,
                },
                tags: ['windows'],
                description: 'Description 1',
                spec: {
                  type: 'virtual-machine',
                  owner: DEFAULT_OWNER,
                  dependsOn: [],
                  dependencyOf: [],
                },
              },
            },
          },
          {
            locationKey: providers[0].getProviderName(),
            entity: {
              api_version: 'backstage.io/v1beta1',
              kind: 'Resource',
              metadata: {
                name: 'node2',
                namespace: 'default',
                annotations: {
                  [ANNOTATION_PUPPET_CERTNAME]: 'node2',
                  [ANNOTATION_LOCATION]: `url:${config.getString(
                    'catalog.providers.puppetdb.host',
                  )}${ENDPOINT_NODES}/node2`,
                  [ANNOTATION_ORIGIN_LOCATION]: `url:${config.getString(
                    'catalog.providers.puppetdb.host',
                  )}${ENDPOINT_NODES}/node2`,
                },
                tags: ['linux'],
                description: 'Description 2',
                spec: {
                  type: 'physical-server',
                  owner: DEFAULT_OWNER,
                  dependsOn: [],
                  dependencyOf: [],
                },
              },
            },
          },
        ],
      });
    });
  });
});
