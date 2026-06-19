/*
 * Copyright 2020 The Backstage Authors
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

import express from 'express';
import { Entity, CompoundEntityRef } from '@backstage/catalog-model';
import {
  PublisherBase,
  PublishRequest,
  PublishResponse,
  ReadinessResponse,
  TechDocsMetadata,
  MigrateRequest,
} from './types';

/**
 * A publisher that wraps multiple publishers, enabling writing to multiple
 * storage backends and reading from a primary backend.
 *
 * @public
 */
export class MultiPublisher implements PublisherBase {
  private readonly publishers: PublisherBase[];

  constructor(publishers: PublisherBase[]) {
    if (!publishers || publishers.length === 0) {
      throw new Error('MultiPublisher requires at least one publisher');
    }
    this.publishers = publishers;
  }

  private get primary(): PublisherBase {
    return this.publishers[0];
  }

  async getReadiness(): Promise<ReadinessResponse> {
    const responses = await Promise.allSettled(
      this.publishers.map(p => p.getReadiness()),
    );
    return {
      isAvailable: responses.every(
        r => r.status === 'fulfilled' && r.value.isAvailable,
      ),
    };
  }

  async publish(request: PublishRequest): Promise<PublishResponse> {
    // Publish to all concurrently and wait for all to succeed
    const results = await Promise.all(
      this.publishers.map(p => p.publish(request)),
    );
    // Return the response from the primary publisher
    return results[0];
  }

  async fetchTechDocsMetadata(
    entityName: CompoundEntityRef,
  ): Promise<TechDocsMetadata> {
    // Only fetch metadata from the primary publisher
    return this.primary.fetchTechDocsMetadata(entityName);
  }

  docsRouter(): express.Handler {
    // Use the primary publisher's docs router
    return this.primary.docsRouter();
  }

  async hasDocsBeenGenerated(entityName: Entity): Promise<boolean> {
    // Only check if docs have been generated on the primary publisher
    return this.primary.hasDocsBeenGenerated(entityName);
  }

  async migrateDocsCase(migrateRequest: MigrateRequest): Promise<void> {
    // Perform migration on all publishers if they support it
    await Promise.all(
      this.publishers.map(async p => {
        if (p.migrateDocsCase) {
          await p.migrateDocsCase(migrateRequest);
        }
      }),
    );
  }
}
