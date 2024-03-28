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
import { PuppetDbEntityProvider } from './PuppetDbEntityProvider';
import {
  DeferredEntity,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-node';
import * as puppetFunctions from '../puppet/read';
import { ANNOTATION_PUPPET_CERTNAME } from '../puppet';
import {
  ANNOTATION_LOCATION,
  ANNOTATION_ORIGIN_LOCATION,
  ResourceEntity,
} from '@backstage/catalog-model';
import { DEFAULT_ENTITY_OWNER, ENDPOINT_NODES } from '../puppet/constants';

jest.mock('../puppet/read', () => {
  return {
    readPuppetNodes: jest.fn(),
  };
});

const logger = getVoidLogger();

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
          baseUrl: 'http://puppetdb:8080',
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
      jest.spyOn(puppetFunctions, 'readPuppetNodes').mockResolvedValueOnce([]);
    });

    it('creates no entities', async () => {
      const connection: EntityProviderConnection = {
        applyMutation: jest.fn(),
        refresh: jest.fn(),
      };
      const providers = PuppetDbEntityProvider.fromConfig(config, {
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
      jest.spyOn(puppetFunctions, 'readPuppetNodes').mockResolvedValueOnce([
        {
          apiVersion: 'backstage.io/v1beta1',
          kind: 'Resource',
          metadata: {
            name: 'node1',
            namespace: 'default',
            annotations: {
              [ANNOTATION_PUPPET_CERTNAME]: 'node1',
            },
            tags: ['windows', 'unchanged'],
            description: 'Description 1',
          },
          spec: {
            type: 'virtual-machine',
            owner: DEFAULT_ENTITY_OWNER,
            dependsOn: [],
            dependencyOf: [],
          },
        },
        {
          apiVersion: 'backstage.io/v1beta1',
          kind: 'Resource',
          metadata: {
            name: 'node2',
            namespace: 'default',
            annotations: {
              [ANNOTATION_PUPPET_CERTNAME]: 'node2',
            },
            tags: ['linux', 'unchanged'],
            description: 'Description 2',
          },
          spec: {
            type: 'physical-server',
            owner: DEFAULT_ENTITY_OWNER,
            dependsOn: [],
            dependencyOf: [],
          },
        },
      ] as ResourceEntity[]);
    });

    it('creates entities', async () => {
      const connection: EntityProviderConnection = {
        applyMutation: jest.fn(),
        refresh: jest.fn(),
      };
      const providers = PuppetDbEntityProvider.fromConfig(config, {
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
              apiVersion: 'backstage.io/v1beta1',
              kind: 'Resource',
              metadata: {
                name: 'node1',
                namespace: 'default',
                annotations: {
                  [ANNOTATION_PUPPET_CERTNAME]: 'node1',
                  [ANNOTATION_LOCATION]: `url:${config.getString(
                    'catalog.providers.puppetdb.baseUrl',
                  )}/${ENDPOINT_NODES}/node1`,
                  [ANNOTATION_ORIGIN_LOCATION]: `url:${config.getString(
                    'catalog.providers.puppetdb.baseUrl',
                  )}/${ENDPOINT_NODES}/node1`,
                },
                tags: ['windows', 'unchanged'],
                description: 'Description 1',
              },
              spec: {
                type: 'virtual-machine',
                owner: DEFAULT_ENTITY_OWNER,
                dependsOn: [],
                dependencyOf: [],
              },
            },
          },
          {
            locationKey: providers[0].getProviderName(),
            entity: {
              apiVersion: 'backstage.io/v1beta1',
              kind: 'Resource',
              metadata: {
                name: 'node2',
                namespace: 'default',
                annotations: {
                  [ANNOTATION_PUPPET_CERTNAME]: 'node2',
                  [ANNOTATION_LOCATION]: `url:${config.getString(
                    'catalog.providers.puppetdb.baseUrl',
                  )}/${ENDPOINT_NODES}/node2`,
                  [ANNOTATION_ORIGIN_LOCATION]: `url:${config.getString(
                    'catalog.providers.puppetdb.baseUrl',
                  )}/${ENDPOINT_NODES}/node2`,
                },
                tags: ['linux', 'unchanged'],
                description: 'Description 2',
              },
              spec: {
                type: 'physical-server',
                owner: DEFAULT_ENTITY_OWNER,
                dependsOn: [],
                dependencyOf: [],
              },
            },
          },
        ] as DeferredEntity[],
      });
    });
  });
});
