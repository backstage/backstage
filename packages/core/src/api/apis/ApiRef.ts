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

export type ApiRefConfig = {
  id: string;
  description: string;
};

export default class ApiRef<T> {
  constructor(private readonly config: ApiRefConfig) {
    if (!config.id.match(/^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)*$/)) {
      throw new Error(
        `API id must only contain lowercase alphanums separated by dots, got '${config.id}'`,
      );
    }
  }

  get id(): string {
    return this.config.id;
  }

  get description(): string {
    return this.config.description;
  }

  // Utility for getting type of an api, using `typeof apiRef.T`
  get T(): T {
    throw new Error(`tried to read ApiRef.T of ${this}`);
  }

  toString() {
    return `apiRef{${this.config.id}}`;
  }
}
