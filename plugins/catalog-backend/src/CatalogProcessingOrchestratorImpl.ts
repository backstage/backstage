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

import {
  Entity,
  LocationSpec,
  stringifyLocationReference,
} from '@backstage/catalog-model';
import { JsonObject } from '@backstage/config';
import {
  CatalogProcessor,
  CatalogProcessorEmit,
  CatalogProcessorParser,
} from './ingestion/processors';
import {
  CatalogProcessingOrchestrator,
  EntityProcessingError,
  LocationEntity,
} from './newthing';
import { Logger } from 'winston';
import * as result from './ingestion/processors/results';

export class CatalogProcessingOrchestratorImpl
  implements CatalogProcessingOrchestrator {
  constructor(
    private readonly options: {
      processors: CatalogProcessor[];
      logger: Logger;
      parser: CatalogProcessorParser;
    },
  ) {}

  async process(request: {
    entity: Entity;
    eager?: boolean | undefined;
    state: Map<string, JsonObject>;
  }): Promise<{
    state: Map<string, JsonObject>;
    completeEntities: Entity[];
    deferredEntites: Entity[];
    errors: EntityProcessingError[];
  }> {
    const { entity, eager, state } = request;
    const completedEntities: Entity[] = [];
    const deferredEntites: Entity[] = [];
    const errors: EntityProcessingError[] = [];

    if (eager) {
      const stack = [entity];
      const emit = (i: Entity) => stack.push(i);
      while (stack.length) {
        const item = stack.pop();
        stack.push();
      }
    } else {
      const emit = (i: Entity) => {
        deferredEntites.push(i);
      };
      if (entity.spec) {
        if (entity.spec.kind === 'Location') {
          this.handleLocation(
            {
              type: (entity.spec.type as unknown) as string,
              target: (entity.spec.target as unknown) as string,
            },
            emit,
          );
        }
      }
    }

    return {
      deferredEntites,
      completeEntities: completedEntities,
      errors,
      state,
    };
  }

  private async handleLocation(
    location: LocationSpec,
    emit: CatalogProcessorEmit,
  ) {
    const { processors, logger } = this.options;

    const validatedEmit: CatalogProcessorEmit = emitResult => {
      if (emitResult.type === 'relation') {
        throw new Error('readLocation may not emit entity relations');
      }
      if (
        emitResult.type === 'location' &&
        emitResult.location.type === location.type &&
        emitResult.location.target === location.target
      ) {
        // Ignore self-referential locations silently (this can happen for
        // example if you use a glob target like "**/*.yaml" in a Location
        // entity)
        return;
      }
      emit(emitResult);
    };

    for (const processor of processors) {
      if (processor.readLocation) {
        try {
          if (
            await processor.readLocation(
              location,
              // TODO: figure out how this will work in the new processing system - locations from PRs might be optional
              location.presence !== 'required',
              validatedEmit,
              this.options.parser,
            )
          ) {
            return;
          }
        } catch (e) {
          const message = `Processor ${
            processor.constructor.name
          } threw an error while reading location ${stringifyLocationReference(
            location,
          )}, ${e}`;
          emit(result.generalError(location, message));
          logger.warn(message);
        }
      }
    }

    const message = `No processor was able to read location ${stringifyLocationReference(
      location,
    )}`;
    emit(result.inputError(location, message));
    logger.warn(message);
  }
}
