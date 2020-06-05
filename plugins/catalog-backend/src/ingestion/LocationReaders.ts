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

import {
  EntityPolicies,
  EntityPolicy,
  LocationSpec,
} from '@backstage/catalog-model';
import { AnnotateLocationEntityProcessor } from './processors/AnnotateLocationEntityProcessor';
import { EntityPolicyProcessor } from './processors/EntityPolicyProcessor';
import { FileReaderProcessor } from './processors/FileReaderProcessor';
import { GithubReaderProcessor } from './processors/GithubReaderProcessor';
import {
  LocationProcessor,
  LocationProcessorResult,
  LocationProcessorResults,
} from './processors/types';
import { YamlProcessor } from './processors/YamlProcessor';
import { LocationReader, ReadLocationResult } from './types';

// The max amount of nesting depth of generated work items
const MAX_DEPTH = 10;

/**
 * Implements the reading of a location through a series of processor tasks.
 */
export class LocationReaders implements LocationReader {
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
    processors: LocationProcessor[] = LocationReaders.defaultProcessors(),
  ) {
    this.processors = processors;
  }

  async read(location: LocationSpec): Promise<ReadLocationResult> {
    const output: ReadLocationResult = { entities: [], errors: [] };
    const initialItem: LocationProcessorResult = {
      type: 'location',
      location,
      optional: false,
    };
    await this.handleResultItem(initialItem, 0, output);
    return output;
  }

  async handleResultItem(
    item: LocationProcessorResult,
    depth: number,
    output: ReadLocationResult,
  ): Promise<void> {
    // Sanity check to break silly expansions / loops
    if (depth > MAX_DEPTH) {
      output.errors.push({
        location: item.location,
        error: new Error(`Max recursion depth ${MAX_DEPTH} reached`),
      });
      return;
    }

    if (item.type === 'location') {
      await this.runAll(
        processor => processor.readLocation?.(item.location, item.optional),
        emitted => this.handleResultItem(emitted, depth + 1, output),
        item.location,
        true,
        true,
      );
    } else if (item.type === 'data') {
      await this.runAll(
        processor => processor.parseData?.(item.data, item.location),
        emitted => this.handleResultItem(emitted, depth + 1, output),
        item.location,
        true,
        true,
      );
    } else if (item.type === 'error') {
      await this.runAll(
        processor => processor.handleError?.(item.error, item.location),
        emitted => this.handleResultItem(emitted, depth + 1, output),
        item.location,
        false,
        false,
      );
      output.errors.push({
        location: item.location,
        error: item.error,
      });
    } else if (item.type === 'entity') {
      const current = { entity: item.entity, location: item.location };
      await this.runAll(
        processor =>
          processor.processEntity?.(current.entity, current.location),
        async emitted => {
          if (emitted.type === 'entity') {
            current.entity = emitted.entity;
            current.location = emitted.location;
          } else {
            await this.handleResultItem(emitted, depth + 1, output);
          }
        },
        item.location,
        false,
        false,
      );
      output.entities.push({
        entity: current.entity,
        location: current.location,
      });
    }
  }

  async runAll(
    start: (
      processor: LocationProcessor,
    ) => LocationProcessorResults | undefined,
    emit: (item: LocationProcessorResult) => Promise<void>,
    location: LocationSpec,
    stopAfterFirstHandled: boolean,
    failIfNotHandled: boolean,
  ): Promise<void> {
    let wasHandled = false;
    for (const processor of this.processors) {
      try {
        const iterator = start(processor);
        if (!iterator) {
          continue;
        }

        for (;;) {
          const item = await iterator.next();
          if (item.done) {
            break;
          }

          wasHandled = true;
          await emit(item.value);
        }

        if (wasHandled && stopAfterFirstHandled) {
          return;
        }
      } catch (e) {
        const message = `Processor ${processor.constructor.name} threw an error, ${e}`;
        await emit({ type: 'error', location, error: new Error(message) });
        return;
      }

      if (!wasHandled && failIfNotHandled) {
        const message = `No processor was able to handle ${location.type} ${location.target}`;
        await emit({ type: 'error', location, error: new Error(message) });
      }
    }
  }
}
