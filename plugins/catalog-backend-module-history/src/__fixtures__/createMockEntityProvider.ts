/*
 * Copyright 2024 The Backstage Authors
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
  BackendFeature,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import {
  ANNOTATION_LOCATION,
  ANNOTATION_ORIGIN_LOCATION,
  Entity,
} from '@backstage/catalog-model';
import { EntityProviderConnection } from '@backstage/plugin-catalog-node';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';
import merge from 'lodash/merge';
import { createDeferred } from './createDeferred';

type UpsertCommand = { type: 'upsert'; entity: Entity };
type DeleteCommand = { type: 'delete'; entityRef: string };
type Command = UpsertCommand | DeleteCommand;

export type MockEntityProvider = BackendFeature & {
  ready: Promise<void>;
  addEntity(entity: Entity): void;
  removeEntity(entityRef: string): void;
};

export function createMockEntityProvider(): MockEntityProvider {
  const ready = createDeferred();
  const commandsQueue = new Set<Command>();
  let commandsLock = createDeferred();

  async function runLoop(connection: EntityProviderConnection) {
    for (;;) {
      await commandsLock.promise;
      const commands = Array.from(commandsQueue);
      commandsQueue.clear();
      commandsLock = createDeferred();

      if (commands.length) {
        const added = commands
          .filter((c): c is UpsertCommand => c.type === 'upsert')
          .map(c => ({
            locationKey: 'mock',
            entity: merge(
              {
                metadata: {
                  annotations: {
                    [ANNOTATION_LOCATION]: 'url:http://mockEntityProvider.com',
                    [ANNOTATION_ORIGIN_LOCATION]:
                      'url:http://mockEntityProvider.com',
                  },
                },
              },
              c.entity,
            ),
          }));

        const removed = commands
          .filter((c): c is DeleteCommand => c.type === 'delete')
          .map(c => ({ locationKey: 'mock', entityRef: c.entityRef }));

        await connection.applyMutation({
          type: 'delta',
          added,
          removed,
        });
      }
    }
  }

  function addEntity(entity: Entity) {
    commandsQueue.add({ type: 'upsert', entity });
    commandsLock.resolve();
  }

  function removeEntity(entityRef: string) {
    commandsQueue.add({ type: 'delete', entityRef });
    commandsLock.resolve();
  }

  const provider = createBackendModule({
    pluginId: 'catalog',
    moduleId: 'mockEntityProvider',
    register(reg) {
      reg.registerInit({
        deps: { catalogProcessing: catalogProcessingExtensionPoint },
        async init({ catalogProcessing }) {
          catalogProcessing.addEntityProvider({
            getProviderName: () => 'mockEntityProvider',
            connect: async conn => {
              runLoop(conn);
              ready.resolve();
            },
          });
        },
      });
    },
  });

  return Object.assign(provider, {
    ready: ready.promise,
    addEntity,
    removeEntity,
  });
}
