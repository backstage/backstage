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

import { DefaultProcessingDatabase } from '../database/DefaultProcessingDatabase';
import { RefreshOptions, RefreshService } from './types';

export class DefaultRefreshService implements RefreshService {
  private database: DefaultProcessingDatabase;

  constructor(options: { database: DefaultProcessingDatabase }) {
    this.database = options.database;
  }

  async refresh(options: RefreshOptions) {
    await this.database.transaction(async tx => {
      const { entityRefs } = await this.database.listAncestors(tx, {
        entityRef: options.entityRef,
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
        entityRef: options.entityRef,
      });
    });
  }
}
