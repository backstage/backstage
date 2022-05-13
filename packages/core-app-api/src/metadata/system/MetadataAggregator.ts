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

import { MetadataRef, MetadataHolder } from '@backstage/core-plugin-api';

/**
 * An MetadataHolder that queries multiple other holders from for
 * an metadata implementation, returning the first one encountered..
 */
export class MetadataAggregator implements MetadataHolder {
  private readonly holders: MetadataHolder[];

  constructor(...holders: MetadataHolder[]) {
    this.holders = holders;
  }

  get<T>(ref: MetadataRef<T>): T | undefined {
    for (const holder of this.holders) {
      const metadata = holder.get(ref);
      if (metadata) {
        return metadata;
      }
    }
    return undefined;
  }
}
