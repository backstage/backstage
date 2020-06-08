/*
 * Copyright 2020 Spotify AB
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

import { getVoidLogger } from '@backstage/backend-common';
import {
  EntityPolicies,
  EntityPolicy,
  LocationSpec,
} from '@backstage/catalog-model';
import { Logger } from 'winston';
import { AnnotateLocationEntityProcessor } from './processors/AnnotateLocationEntityProcessor';
import { EntityPolicyProcessor } from './processors/EntityPolicyProcessor';
import { FileReaderProcessor } from './processors/FileReaderProcessor';
import { GithubReaderProcessor } from './processors/GithubReaderProcessor';
import * as result from './processors/results';
import {
  LocationProcessor,
  LocationProcessorEmit,
  LocationProcessorResult,
} from './processors/types';
import { YamlProcessor } from './processors/YamlProcessor';
import { LocationReader, ReadLocationResult } from './types';

// The max amount of nesting depth of generated work items
const MAX_DEPTH = 10;

/**
 * Implements the reading of a location through a series of processor tasks.
 */
export class LocationReaders implements LocationReader {
  private readonly logger: Logger;
  private readonly processors: LocationProcessor[];

  static defaultProcessors(
    entityPolicy: EntityPolicy = new EntityPolicies(),
  ): LocationProcessor[] {
    return [
      new FileReaderProcessor(),
      new GithubReaderProcessor(),
      new YamlProcessor(),
      new EntityPolicyProcessor(entityPolicy),
      new AnnotateLocationEntityProcessor(),
    ];
  }

  constructor(
    logger: Logger = getVoidLogger(),
    processors: LocationProcessor[] = LocationReaders.defaultProcessors(),
  ) {
    this.logger = logger;
    this.processors = processors;
  }

  async read(location: LocationSpec): Promise<ReadLocationResult> {
    const output: ReadLocationResult = { entities: [], errors: [] };
    let items: LocationProcessorResult[] = [result.location(location, false)];

    for (let depth = 0; depth < MAX_DEPTH; ++depth) {
      const newItems: LocationProcessorResult[] = [];
      const emit: LocationProcessorEmit = i => newItems.push(i);

      for (const item of items) {
        let current = item;

        for (const processor of this.processors) {
          try {
            const next = await processor.process(item, emit);
            if (!next) {
              break;
            } else {
              current = next;
            }
          } catch (e) {
            const message = `Processor ${processor.constructor.name} threw an error while reading location ${item.location.type} ${item.location.target}, ${e}`;
            emit(result.generalError(item.location, message));
            continue;
          }
        }

        if (current.type === 'entity') {
          output.entities.push({
            entity: current.entity,
            location: current.location,
          });
        } else if (current.type === 'error') {
          output.errors.push({
            error: current.error,
            location: current.location,
          });
        }
      }

      if (newItems.length === 0) {
        return output;
      }

      items = newItems;
    }

    const message = `Max recursion depth ${MAX_DEPTH} reached for ${location.type} ${location.target}`;
    this.logger.warn(message);
    output.errors.push({ location, error: new Error(message) });
    return output;
  }
}
