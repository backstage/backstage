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
import { Stitcher } from './Stitcher';
import {
  CatalogProcessingEngine,
  CatalogProcessingOrchestrator,
  EntityProvider,
  EntityProviderConnection,
  EntityProviderMutation,
  ProcessingStateManager,
} from './types';

class Connection implements EntityProviderConnection {
  constructor(
    private readonly config: {
      stateManager: ProcessingStateManager;
      id: string;
    },
  ) {}

  async applyMutation(mutation: EntityProviderMutation): Promise<void> {
    if (mutation.type === 'full') {
      await this.config.stateManager.replaceProcessingItems({
        sourceKey: this.config.id,
        type: 'full',
        items: mutation.entities,
      });

      return;
    }

    await this.config.stateManager.replaceProcessingItems({
      sourceKey: this.config.id,
      type: 'delta',
      added: mutation.added,
      removed: mutation.removed,
    });
  }
}

export class DefaultCatalogProcessingEngine implements CatalogProcessingEngine {
  private running: boolean = false;

  constructor(
    private readonly logger: Logger,
    private readonly entityProviders: EntityProvider[],
    private readonly stateManager: ProcessingStateManager,
    private readonly orchestrator: CatalogProcessingOrchestrator,
    private readonly stitcher: Stitcher,
  ) {}

  async start() {
    for (const provider of this.entityProviders) {
      await provider.connect(
        new Connection({
          stateManager: this.stateManager,
          id: provider.getProviderName(),
        }),
      );
    }

    this.running = true;

    while (this.running) {
      const {
        id,
        entity,
        state: initialState,
      } = await this.stateManager.getNextProcessingItem();

      const result = await this.orchestrator.process({
        entity,
        state: initialState,
      });

      for (const error of result.errors) {
        this.logger.warn(error.message);
      }

      if (!result.ok) {
        return;
      }

      result.completedEntity.metadata.uid = id;
      await this.stateManager.setProcessingItemResult({
        id,
        entity: result.completedEntity,
        state: result.state,
        errors: result.errors,
        relations: result.relations,
        deferredEntities: result.deferredEntities,
      });

      const setOfThingsToStitch = new Set<string>([
        stringifyEntityRef(result.completedEntity),
        ...result.relations.map(relation =>
          stringifyEntityRef(relation.source),
        ),
      ]);
      await this.stitcher.stitch(setOfThingsToStitch);
    }
  }

  async stop() {
    this.running = false;
  }
}
