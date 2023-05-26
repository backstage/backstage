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

import {
  DeferredEntity,
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-node';
import { Logger } from 'winston';

export class LoadBuildingEntityProvider implements EntityProvider {
  private connection?: EntityProviderConnection;
  constructor(private readonly opts: { logger: Logger }) {}

  async connect(connection: EntityProviderConnection): Promise<void> {
    this.connection = connection;

    // let's load some mock data!
    const entities = new Array(250000).fill({}).map(
      (_, index): DeferredEntity => ({
        entity: {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: {
            name: `test-entity-${index}`,
            namespace: 'default',
            title: `Entity ${index}`,
            annotations: {
              'backstage.io/managed-by-location': 'url:fake',
              'backstage.io/managed-by-origin-location': 'url:fake',
            },
          },
          spec: {
            owner: 'user:default/guest',
            type: 'service',
            lifecycle: 'production',
          },
        },
      }),
    );

    await this.connection.applyMutation({
      type: 'full',
      entities,
    });

    this.opts.logger.info(`Loaded in ${entities.length} entities`);
  }

  getProviderName(): string {
    return LoadBuildingEntityProvider.name;
  }
}
