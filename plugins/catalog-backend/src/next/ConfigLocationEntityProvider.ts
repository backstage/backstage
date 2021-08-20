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

import { Config } from '@backstage/config';
import path from 'path';
import { getEntityLocationRef } from './processing/util';
import { EntityProvider, EntityProviderConnection } from './types';
import { locationSpecToLocationEntity } from './util';

export class ConfigLocationEntityProvider implements EntityProvider {
  constructor(private readonly config: Config) {}

  getProviderName(): string {
    return 'ConfigLocationProvider';
  }

  async connect(connection: EntityProviderConnection): Promise<void> {
    const entities = this.getEntitiesFromConfig();
    await connection.applyMutation({
      type: 'full',
      entities,
    });

    if (this.config.subscribe) {
      let currentKey = JSON.stringify(entities);

      this.config.subscribe(() => {
        const newEntities = this.getEntitiesFromConfig();
        const newKey = JSON.stringify(newEntities);

        if (currentKey !== newKey) {
          currentKey = newKey;
          connection.applyMutation({
            type: 'full',
            entities: newEntities,
          });
        }
      });
    }
  }

  private getEntitiesFromConfig() {
    const locationConfigs =
      this.config.getOptionalConfigArray('catalog.locations') ?? [];

    return locationConfigs.map(location => {
      const type = location.getString('type');
      const target = location.getString('target');
      const entity = locationSpecToLocationEntity({
        type,
        target: type === 'file' ? path.resolve(target) : target,
      });
      const locationKey = getEntityLocationRef(entity);
      return { entity, locationKey };
    });
  }
}
