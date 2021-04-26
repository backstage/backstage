/*
 * Copyright 2021 Spotify AB
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

import { EntityProviderConnection, EntityProvider } from './types';
import path from 'path';
import { Config } from '@backstage/config';
import { locationSpecToLocationEntity } from './util';

export class ConfigLocationProvider implements EntityProvider {
  private connection: EntityProviderConnection | undefined;

  constructor(private readonly config: Config) {}

  getProviderName(): string {
    return 'ConfigLocationProvider';
  }

  async connect(connection: EntityProviderConnection): Promise<void> {
    this.connection = connection;

    const locationConfigs =
      this.config.getOptionalConfigArray('catalog.locations') ?? [];

    const entities = locationConfigs.map(location =>
      locationSpecToLocationEntity({
        type: location.getString('type'),
        target: path.resolve(location.getString('target')),
      }),
    );

    await this.connection.applyMutation({
      type: 'full',
      entities,
    });
  }
}
