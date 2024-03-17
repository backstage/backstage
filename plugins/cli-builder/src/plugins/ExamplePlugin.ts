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
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { coreCliServices } from '../services';
import { CatalogClient } from '@backstage/catalog-client';
import { stringifyEntityRef } from '@backstage/catalog-model';
// import { render } from 'ink';
// import App from './test';

const examplePlugin = createBackendPlugin({
  pluginId: 'catalog',
  register(env) {
    env.registerInit({
      deps: {
        commander: coreCliServices.commander,
        discovery: coreServices.discovery,
        logger: coreServices.logger,
      },
      async init({ logger, commander, discovery }) {
        const client = new CatalogClient({ discoveryApi: discovery });
        commander.command('list').action(async () => {
          const { items } = await client.getEntities();
          console.table(
            items.map(item => ({
              tags: item.metadata.tags,
              ref: stringifyEntityRef(item),
            })),
          );
          // render(App);
        });
        commander.command('get <entityRef>').action(async entityRef => {
          try {
            console.log(entityRef);
            const entity = await client.getEntityByRef(entityRef);
            console.dir(entity, { depth: null });
          } catch (err) {
            logger.error('Failed to find an entity by that ID.', err);
          }
        });
      },
    });
  },
});

export default examplePlugin;
