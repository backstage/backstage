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

import { NotFoundError } from '@backstage/backend-common';
import {
  Entity,
  EntityPolicies,
  EntityPolicy,
  LocationSpec,
} from '@backstage/catalog-model';
import { AnnotateLocationEntityProcessor } from './processors/AnnotateLocationEntityProcessor';
import { EntityPolicyProcessor } from './processors/EntityPolicyProcessor';
import { FileReaderProcessor } from './processors/FileReaderProcessor';
import { GithubReaderProcessor } from './processors/GithubReaderProcessor';
import { LocationProcessor, LocationProcessorResult } from './processors/types';
import { YamlProcessor } from './processors/YamlProcessor';
import { LocationReader, ReadLocationResult } from './types';

// The max amount of nesting depth of generated work items
const MAX_DEPTH = 5;

type QueueItem = LocationProcessorResult & { depth: number };

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
    const result: ReadLocationResult = { entities: [], errors: [] };

    const queue: QueueItem[] = [];
    queue.push({ type: 'location', location, optional: false, depth: 0 });

    while (queue.length) {
      const entry = queue.shift()!;
      const depth = entry.depth + 1;

      if (depth > MAX_DEPTH) {
        throw new Error(
          `Failed to read ${location.type} ${location.target}, max depth exceeded`,
        );
      }

      if (entry.type === 'location') {
        await this.handleLocation(entry.location, entry.optional, depth, queue);
      } else if (entry.type === 'data') {
        await this.handleData(entry.data, entry.location, depth, queue);
      } else if (entry.type === 'error') {
        await this.handleError(entry.error, entry.location, depth, result);
      } else if (entry.type === 'entity') {
        await this.handleEntity(
          entry.entity,
          entry.location,
          depth,
          queue,
          result,
        );
      }
    }

    return result;
  }

  async handleLocation(
    location: LocationSpec,
    optional: boolean,
    depth: number,
    queue: QueueItem[],
  ): Promise<void> {
    for (const processor of this.processors) {
      try {
        const processorOutput = await processor.readLocation?.(location);
        if (processorOutput) {
          processorOutput.forEach(r => queue.push({ ...r, depth }));
          return;
        }
      } catch (e) {
        if (!(e instanceof NotFoundError && optional)) {
          queue.push({
            type: 'error',
            error: e,
            location,
            depth,
          });
        }
      }
    }

    queue.push({
      type: 'error',
      location,
      depth,
      error: new Error(
        `No processor could read location ${location.type} ${location.target}`,
      ),
    });
  }

  async handleData(
    data: Buffer,
    location: LocationSpec,
    depth: number,
    queue: QueueItem[],
  ): Promise<void> {
    for (const processor of this.processors) {
      try {
        const processorOutput = await processor.parseData?.(data, location);
        if (processorOutput) {
          processorOutput.forEach(r => queue.push({ ...r, depth }));
          return;
        }
      } catch (e) {
        queue.push({ type: 'error', location, error: e, depth });
        return;
      }
    }

    queue.push({
      type: 'error',
      location,
      depth,
      error: new Error(
        `No processor could parse location ${location.type} ${location.target}`,
      ),
    });
  }

  async handleError(
    error: Error,
    location: LocationSpec,
    _depth: number,
    result: ReadLocationResult,
  ): Promise<void> {
    for (const processor of this.processors) {
      try {
        await processor.handleError?.(error, location);
      } catch {
        // ignore
      }
    }

    result.errors.push({ location, error });
  }

  async handleEntity(
    entity: Entity,
    location: LocationSpec,
    depth: number,
    queue: QueueItem[],
    result: ReadLocationResult,
  ): Promise<void> {
    let resultingEntity = entity;
    let foundErrors = false;

    for (const processor of this.processors) {
      try {
        const processorOutput = await processor.processEntity?.(
          entity,
          location,
        );
        if (processorOutput) {
          resultingEntity = processorOutput;
        }
      } catch (e) {
        foundErrors = true;
        queue.push({
          type: 'error',
          location,
          error: e,
          depth,
        });
      }
    }

    if (!foundErrors) {
      result.entities.push({
        location,
        entity: resultingEntity,
      });
    }
  }
}
