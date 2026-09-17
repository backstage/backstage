/*
 * Copyright 2026 The Backstage Authors
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

import { LifecycleService, LoggerService } from '@backstage/backend-plugin-api';
import {
  CatalogModel,
  CatalogModelSource,
  compileCatalogModel,
} from '@backstage/catalog-model/alpha';

/**
 * Wraps the concern of maintaining a compiled catalog model based on sources.
 *
 * @internal
 */
export class ModelHolder {
  #model: CatalogModel;

  static modelPassthroughForTest(model: CatalogModel): ModelHolder {
    return new ModelHolder(model);
  }

  static async create(options: {
    sources: CatalogModelSource[];
    logger: LoggerService;
    lifecycle: LifecycleService;
  }): Promise<ModelHolder> {
    const { sources, logger, lifecycle } = options;

    const shutdownController = new AbortController();
    lifecycle.addShutdownHook(() => shutdownController.abort());

    logger.info(`Reading ${sources.length} catalog model sources`);
    let readyCount = 0;

    const logInterval = setInterval(() => {
      const remaining = sources.length - readyCount;
      logger.warn(
        `Waiting for ${remaining}/${sources.length} catalog model sources to be ready`,
      );
    }, 3000);

    // TODO(freben): Obviously this needs to be extended to support dynamic
    // model source events during the lifetime of the plugin.
    try {
      const layers = await Promise.all(
        sources.map(async source => {
          const iter = source.read({ signal: shutdownController.signal });
          try {
            const result = await iter.next();
            readyCount += 1;
            const entries = result.value?.data ?? [];
            for (const entry of entries) {
              logger.info(`Loaded catalog model layer: ${entry.layer.layerId}`);
            }
            return entries.map(entry => entry.layer);
          } finally {
            await iter.return(undefined);
          }
        }),
      );
      return new ModelHolder(compileCatalogModel(layers.flat()));
    } finally {
      clearInterval(logInterval);
    }
  }

  get model(): CatalogModel {
    return this.#model;
  }

  private constructor(model: CatalogModel) {
    this.#model = model;
  }
}
