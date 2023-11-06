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

import type { ApiRef } from './types';

/**
 * API reference configuration - holds an ID of the referenced API.
 *
 * @public
 */
export type ApiRefConfig = {
  id: string;
};

class ApiRefImpl<T> implements ApiRef<T> {
  constructor(private readonly config: ApiRefConfig) {
    const valid = config.id
      .split('.')
      .flatMap(part => part.split('-'))
      .every(part => part.match(/^[a-z][a-z0-9]*$/));
    if (!valid) {
      throw new Error(
        `API id must only contain period separated lowercase alphanum tokens with dashes, got '${config.id}'`,
      );
    }
  }

  get id(): string {
    return this.config.id;
  }

  // Utility for getting type of an api, using `typeof apiRef.T`
  get T(): T {
    throw new Error(`tried to read ApiRef.T of ${this}`);
  }

  toString() {
    return `apiRef{${this.config.id}}`;
  }
}

/**
 * Creates a reference to an API.
 *
 * @param config - The descriptor of the API to reference.
 * @returns An API reference.
 * @public
 */
export function createApiRef<T>(config: ApiRefConfig): ApiRef<T> {
  return new ApiRefImpl<T>(config);
}
