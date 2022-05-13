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

import type { MetadataRef } from './types';

export type MetadataRefConfig = {
  id: string;
};

class MetadataRefImpl<T> implements MetadataRef<T> {
  constructor(private readonly config: MetadataRefConfig) {}

  get id(): string {
    return this.config.id;
  }

  get T(): T {
    throw new Error(`tried to read MetadataRef.T of ${this}`);
  }

  toString() {
    return `metadataRef{${this.config.id}}`;
  }
}

/**
 * Creates a reference to a metadata.
 *
 * @param config - The descriptor of the metadata to reference.
 * @returns A metadata reference.
 * @public
 */
export function createMetadataRef<T>(
  config: MetadataRefConfig,
): MetadataRef<T> {
  return new MetadataRefImpl<T>(config);
}
