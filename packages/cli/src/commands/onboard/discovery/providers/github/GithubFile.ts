/*
 * Copyright 2023 The Backstage Authors
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

import { RepositoryFile } from '../types';

export class GithubFile implements RepositoryFile {
  readonly #path: string;
  readonly #content: string;

  constructor(path: string, content: string) {
    this.#path = path;
    this.#content = content;
  }

  get path(): string {
    return this.#path;
  }

  async text(): Promise<string> {
    return this.#content;
  }
}
