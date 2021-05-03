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

import { stringifyEntityRef } from '@backstage/catalog-model';
import { Logger } from 'winston';
import { ProcessingDatabase } from './database/types';
import { Stitcher } from './Stitcher';
import {
  CatalogProcessingEngine,
  CatalogProcessingOrchestrator,
  EntityProvider,
  EntityProviderConnection,
  EntityProviderMutation,
} from './types';

class Connection implements EntityProviderConnection {
  constructor(
    private readonly config: {
      processingDatabase: ProcessingDatabase;
      id: string;
    },
  ) {}

  async applyMutation(mutation: EntityProviderMutation): Promise<void> {
    const db = this.config.processingDatabase;
    if (mutation.type === 'full') {
      db.transaction(async tx => {
        await db.replaceUnprocessedEntities(tx, {
          sourceKey: this.config.id,
          type: 'full',
          items: mutation.entities,
        });
      });
      return;
    }
    db.transaction(async tx => {
      await db.replaceUnprocessedEntities(tx, {
        sourceKey: this.config.id,
        type: 'delta',
        added: mutation.added,
        removed: mutation.removed,
      });
    });
  }
}

export class DefaultCatalogProcessingEngine implements CatalogProcessingEngine {
  private running = false;

  constructor(
    private readonly logger: Logger,
    private readonly entityProviders: EntityProvider[],
    private readonly processingDatabase: ProcessingDatabase,
    private readonly orchestrator: CatalogProcessingOrchestrator,
    private readonly stitcher: Stitcher,
  ) {}

  async start() {
    for (const provider of this.entityProviders) {
      await provider.connect(
        new Connection({
          processingDatabase: this.processingDatabase,
          id: provider.getProviderName(),
        }),
      );
    }
    this.running = true;
    this.run();
  }

  private async run() {
    while (this.running) {
      const { items } = await this.processingDatabase.transaction(async tx => {
        return this.processingDatabase.getProcessableEntities(tx, {
          processBatchSize: 1,
        });
      });

      if (items.length) {
        const { id, state, unprocessedEntity } = items[0];

        const result = await this.orchestrator.process({
          entity: unprocessedEntity,
          state,
        });
        for (const error of result.errors) {
          this.logger.warn(error.message);
        }
        if (!result.ok) {
          return;
        }

        result.completedEntity.metadata.uid = id;
        await this.processingDatabase.transaction(async tx => {
          await this.processingDatabase.updateProcessedEntity(tx, {
            id,
            processedEntity: result.completedEntity,
            state: result.state,
            errors: JSON.stringify(result.errors),
            relations: result.relations,
            deferredEntities: result.deferredEntities,
          });
        });

        const setOfThingsToStitch = new Set<string>([
          stringifyEntityRef(result.completedEntity),
          ...result.relations.map(relation =>
            stringifyEntityRef(relation.source),
          ),
        ]);
        await this.stitcher.stitch(setOfThingsToStitch);
      } else {
        // Wait one second before fetching next item.
        await new Promise<void>(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  async stop() {
    this.running = false;
  }
}
