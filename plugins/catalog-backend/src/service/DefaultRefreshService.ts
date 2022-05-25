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

import { PluginTaskScheduler } from '@backstage/backend-tasks';
import { EntityProvider } from '../api';
import { DefaultProcessingDatabase } from '../database/DefaultProcessingDatabase';
import { RefreshOptions, RefreshService } from './types';

export class DefaultRefreshService implements RefreshService {
  private database: DefaultProcessingDatabase;
  private entityProviders: EntityProvider[];
  private scheduler: PluginTaskScheduler;

  constructor(options: {
    database: DefaultProcessingDatabase;
    entityProviders: EntityProvider[];
    scheduler: PluginTaskScheduler;
  }) {
    this.database = options.database;
    this.entityProviders = options.entityProviders;
    this.scheduler = options.scheduler;
  }

  async refresh(options: RefreshOptions) {
    if (options.entityRef) {
      return this.refreshEntity(options);
    }

    if (options.providers) {
      return this.refreshProviders(options);
    }

    return new Promise<void>(resolve => resolve());
  }

  private async refreshProviders(options: RefreshOptions) {
    return new Promise<void>((resolve, reject) => {
      Promise.allSettled(
        this.entityProviders
          .filter(
            provider =>
              options.providers === 'all' ||
              options.providers?.includes(provider.getProviderName()),
          )
          .filter(provider => 'getTaskId' in provider)
          .map(provider => provider.getTaskId!())
          .map(async taskId => {
            try {
              await this.scheduler.triggerTask(taskId);
            } catch (error) {
              if (!['ConflictError', 'NotFoundError'].includes(error.name)) {
                throw error;
              }
            }
          }),
      )
        .then(_ => resolve())
        .catch(reason => reject(reason));
    });
  }

  private async refreshEntity(options: RefreshOptions) {
    await this.database.transaction(async tx => {
      const { entityRefs } = await this.database.listAncestors(tx, {
        entityRef: options.entityRef!,
      });
      const locationAncestor = entityRefs.find(ref =>
        ref.startsWith('location:'),
      );

      // TODO: Refreshes are currently scheduled(as soon as possible) for execution and will therefore happen in the future.
      // There's room for improvements here where the refresh could potentially hang or return an ID so that the user can check progress.
      if (locationAncestor) {
        await this.database.refresh(tx, {
          entityRef: locationAncestor,
        });
      }
      await this.database.refresh(tx, {
        entityRef: options.entityRef!,
      });
    });
  }
}
