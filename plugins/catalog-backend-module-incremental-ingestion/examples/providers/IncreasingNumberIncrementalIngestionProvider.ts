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

import {
  ANNOTATION_LOCATION,
  ANNOTATION_ORIGIN_LOCATION,
} from '@backstage/catalog-model';
import {
  type EntityIteratorResult,
  type IncrementalEntityProvider,
} from '@backstage/plugin-catalog-backend-module-incremental-ingestion';

interface Cursor {
  next: number;
}

type IncreasingNumberIncrementalIngestionProviderOptions = {
  providerName?: string;
  source?: string;
  totalEntities?: number;
  batchSize?: number;
  delayMs?: number;
  owner?: string;
  lifecycle?: string;
};

export class IncreasingNumberIncrementalIngestionProvider
  implements IncrementalEntityProvider<Cursor, {}>
{
  private readonly providerName: string;
  private readonly source: string;
  private readonly totalEntities: number;
  private readonly batchSize: number;
  private readonly delayMs: number;
  private readonly owner: string;
  private readonly lifecycle: string;

  constructor(
    options: IncreasingNumberIncrementalIngestionProviderOptions = {},
  ) {
    this.providerName =
      options.providerName ?? 'IncreasingNumberIncrementalIngestionProvider';
    this.source = options.source ?? 'demo-source';
    this.totalEntities = Math.max(1, options.totalEntities ?? 10_000);
    this.batchSize = Math.max(1, options.batchSize ?? 100);
    this.delayMs = Math.max(0, options.delayMs ?? 0);
    this.owner = options.owner ?? 'user:default/guest';
    this.lifecycle = options.lifecycle ?? 'production';
  }

  getProviderName() {
    return this.providerName;
  }

  async around(burst: (context: {}) => Promise<void>): Promise<void> {
    await burst({});
  }

  async next(
    _context: {},
    cursor: Cursor = { next: 1 },
  ): Promise<EntityIteratorResult<Cursor>> {
    if (this.delayMs > 0) {
      await new Promise(resolve => setTimeout(resolve, this.delayMs));
    }

    const start = cursor.next;
    const location = `${this.getProviderName()}:${this.source}`;

    if (start > this.totalEntities) {
      return {
        done: true,
        entities: [],
        cursor,
      };
    }

    const end = Math.min(start + this.batchSize - 1, this.totalEntities);
    const entities: EntityIteratorResult<Cursor>['entities'] = [];

    for (let i = start; i <= end; i += 1) {
      entities.push({
        entity: {
          apiVersion: 'backstage.io/v1beta1',
          kind: 'Component',
          metadata: {
            name: `demo-service-${i}`,
            annotations: {
              [ANNOTATION_LOCATION]: location,
              [ANNOTATION_ORIGIN_LOCATION]: location,
            },
          },
          spec: {
            type: 'service',
            owner: this.owner,
            lifecycle: this.lifecycle,
          },
        },
      });
    }

    return {
      done: end >= this.totalEntities,
      entities,
      cursor: { next: end + 1 },
    };
  }
}
