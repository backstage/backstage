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

type MetadataImpl<T = unknown> = readonly [MetadataRef<T>, T];

export class MetadataRegistry implements MetadataHolder {
  private readonly registry = new Map<string, any>();

  register(id: string, payload: any): boolean {
    this.registry.set(id, payload);
    return true;
  }

  get<T>(ref: MetadataRef<T>): T | undefined {
    return this.registry.get(ref.id);
  }

  static from(entries: MetadataImpl[]) {
    const registry = new MetadataRegistry();
    for (const entry of entries) {
      registry.register(entry[0].id, entry[1]);
    }
    return registry;
  }
}
