/*
 * Copyright 2021 The Backstage Authors
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

import { JsonObject, JsonValue } from '@backstage/config';
import { CatalogProcessor } from '../ingestion/processors';
import { CatalogProcessorCache } from '../ingestion/processors/types';
import { isObject } from './util';

class SingleProcessorSubCache implements CatalogProcessorCache {
  private newState?: JsonObject;

  constructor(private readonly existingState?: JsonObject) {}

  async get<ItemType extends JsonValue>(
    key: string,
  ): Promise<ItemType | undefined> {
    return this.existingState?.[key] as ItemType | undefined;
  }

  async set<ItemType extends JsonValue>(
    key: string,
    value: ItemType,
  ): Promise<void> {
    if (!this.newState) {
      this.newState = {};
    }

    this.newState[key] = value;
  }

  collect(): JsonObject | undefined {
    return this.newState ?? this.existingState;
  }
}

class SingleProcessorCache implements CatalogProcessorCache {
  private newState?: JsonObject;
  private subCaches: Map<string, SingleProcessorSubCache> = new Map();

  constructor(private readonly existingState?: JsonObject) {}

  async get<ItemType extends JsonValue>(
    key: string,
  ): Promise<ItemType | undefined> {
    return this.existingState?.[key] as ItemType | undefined;
  }

  async set<ItemType extends JsonValue>(
    key: string,
    value: ItemType,
  ): Promise<void> {
    if (!this.newState) {
      this.newState = {};
    }

    this.newState[key] = value;
  }

  withKey(key: string) {
    const existingSubCache = this.subCaches.get(key);
    if (existingSubCache) {
      return existingSubCache;
    }
    const existing = this.existingState?.[key];
    const subCache = new SingleProcessorSubCache(
      isObject(existing) ? existing : undefined,
    );
    this.subCaches.set(key, subCache);
    return subCache;
  }

  collect(): JsonObject | undefined {
    let obj = this.newState ?? this.existingState;
    for (const [key, subCache] of this.subCaches) {
      const subCacheValue = subCache.collect();
      if (subCacheValue) {
        obj = { ...obj, [key]: subCacheValue };
      }
    }
    return obj;
  }
}

export class ProcessorCacheManager {
  private caches = new Map<string, SingleProcessorCache>();

  constructor(private readonly existingState: JsonObject) {}

  forProcessor(
    processor: CatalogProcessor,
    key?: string,
  ): CatalogProcessorCache {
    // constructor name will be deprecated in the future when we make `getProcessorName` required in the implementation
    const name = processor.getProcessorName?.() ?? processor.constructor.name;
    const cache = this.caches.get(name);
    if (cache) {
      return key ? cache.withKey(key) : cache;
    }

    const existing = this.existingState[name];

    const newCache = new SingleProcessorCache(
      isObject(existing) ? existing : undefined,
    );
    this.caches.set(name, newCache);
    return key ? newCache.withKey(key) : newCache;
  }

  collect(): JsonObject {
    const result: JsonObject = {};
    for (const [key, value] of this.caches.entries()) {
      result[key] = value.collect();
    }

    return result;
  }
}
